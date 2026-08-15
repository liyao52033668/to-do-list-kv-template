import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { TodoManager } from "../app/to-do-manager";
import { env } from "cloudflare:test";

describe("待办事项管理器", () => {
	let kv: KVNamespace;
	let manager: TodoManager;

	beforeEach(() => {
		kv = env.TO_DO_LIST;
		manager = new TodoManager(kv);
	});

	afterEach(async () => {
		await kv.delete("todos");
	});

	describe("list()", () => {
		it("在没有待办事项时返回空数组", async () => {
			const todos = await manager.list();
			expect(todos).toEqual([]);
		});

		it("按创建时间倒序返回待办事项", async () => {
			const todo1 = await manager.create("第一个事项");
			const todo2 = await manager.create("第二个事项");

			const todos = await manager.list();
			expect(todos).toHaveLength(2);
			expect(todos).toEqual(expect.arrayContaining([todo2, todo1]));
		});
	});

	describe("create()", () => {
		it("创建新的待办事项", async () => {
			const todo = await manager.create("测试待办事项");

			expect(todo).toMatchObject({
				text: "测试待办事项",
				completed: false,
			});
			expect(todo.id).toBeDefined();
			expect(todo.createdAt).toBeTypeOf("number");

			const storedTodos = await manager.list();
			expect(storedTodos).toEqual([todo]);
		});
	});

	describe("toggle()", () => {
		it("切换待办事项的完成状态", async () => {
			const todo = await manager.create("测试待办事项");
			expect(todo.completed).toBe(false);

			const toggled = await manager.toggle(todo.id);
			expect(toggled.completed).toBe(true);

			const storedTodos = await manager.list();
			expect(storedTodos[0].completed).toBe(true);
		});
	});

	describe("delete()", () => {
		it("删除待办事项", async () => {
			const todo = await manager.create("测试待办事项");
			await manager.delete(todo.id);

			const storedTodos = await manager.list();
			expect(storedTodos).toEqual([]);
		});

		it("在存在多个待办事项时删除指定事项", async () => {
			const todo1 = await manager.create("测试待办事项 1");
			const todo2 = await manager.create("测试待办事项 2");
			await manager.delete(todo1.id);

			const storedTodos = await manager.list();
			expect(storedTodos).toEqual([todo2]);
		});
	});
});
