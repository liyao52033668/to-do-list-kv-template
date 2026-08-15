interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: number;
}

/**
 * TodoManager 处理所有与 Todos KV 存储的交互。
 * 该类为在 Cloudflare KV 存储中管理待办事项提供 CRUD 操作。
 *
 * 通过将所有与 KV 存储交互的逻辑与 Remix 应用的其余部分分离，
 * 我们可以使用 [Cloudflare 的 vitest 集成](https://developers.cloudflare.com/workers/testing/vitest-integration/)
 * 在隔离环境中轻松测试逻辑。
 */
export class TodoManager {
	/**
	 * 创建 TodoManager 实例
	 * @param kv - 用于存储的 Cloudflare KV 命名空间实例
	 * @param todosKey - 待办事项在 KV 中存储所用的键（默认为 "todos"）
	 */
	constructor(
		private kv: KVNamespace,
		private todosKey: string = "todos",
	) {}

	/**
	 * 从存储中检索所有待办事项
	 * @returns 返回按创建日期排序（最新在前）的待办事项数组的 Promise
	 */
	async list(): Promise<Todo[]> {
		const todos = await this.kv.get(this.todosKey, "json");
		if (Array.isArray(todos)) {
			todos.sort((a: Todo, b: Todo) => b.createdAt - a.createdAt);
		}
		return (todos || []) as Todo[];
	}

	/**
	 * 创建新的待办事项
	 * @param text - 待办事项的文本内容
	 * @returns 返回新创建待办事项的 Promise
	 */
	async create(text: string): Promise<Todo> {
		const newTodo: Todo = {
			id: crypto.randomUUID(),
			text,
			completed: false,
			createdAt: Date.now(),
		};
		const todos = await this.list();
		todos.push(newTodo);
		await this.kv.put(this.todosKey, JSON.stringify(todos), {
			expirationTtl: 300,
		});
		return newTodo;
	}

	/**
	 * 切换待办事项的完成状态
	 * @param id - 要切换的待办事项的唯一标识符
	 * @returns 返回更新后的待办事项的 Promise
	 * @throws 如果指定 ID 的待办事项未找到则抛出错错误
	 */
	async toggle(id: string): Promise<Todo> {
		const todos = await this.list();
		const todoIndex = todos.findIndex((todo) => todo.id === id);
		if (todoIndex === -1) {
			throw new Error(`未找到 ID 为 ${id} 的待办事项`);
		}
		todos[todoIndex].completed = !todos[todoIndex].completed;
		await this.kv.put(this.todosKey, JSON.stringify(todos), {
			expirationTtl: 300,
		});
		return todos[todoIndex];
	}

	/**
	 * 删除待办事项
	 * @param id - 要删除的待办事项的唯一标识符
	 * @returns 删除完成时解析的 Promise
	 */
	async delete(id: string): Promise<void> {
		const todos = await this.list();
		const newTodos = todos.filter((todo) => todo.id !== id);
		await this.kv.put(this.todosKey, JSON.stringify(newTodos), {
			expirationTtl: 300,
		});
	}
}
