# 待办事项列表应用 (To-Do List App)

[![部署到 Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/to-do-list-kv-template)

![待办事项列表模板预览](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/923473bc-a285-487c-93db-e0ddea3d3700/public)

<!-- dash-content-start -->

使用 [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/static-assets/) + [Remix](https://remix.run/) + [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) 管理你的待办事项列表。

> 英文版本文档请参阅 [README-EN.md](./README-EN.md)。

## 工作原理

这是一个简单的待办事项列表应用，允许你添加、删除以及标记任务为已完成。该项目是基于 Remix 构建的 Cloudflare Workers Assets 应用，并使用 Cloudflare Workers KV 存储待办事项。

[Remix Vite 插件](https://remix.run/docs/en/main/guides/vite#vite) 内置了 Cloudflare Dev Proxy，使你能够使用 Cloudflare 开发者平台提供的 [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)。[可观测性 (Observability)](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs) 默认开启。

> [!IMPORTANT]
> 使用 C3 创建此项目时，当询问是否要部署时请选择“否（no）”。在进行部署之前，你需要遵循本项目的[设置步骤](#设置步骤)。

<!-- dash-content-end -->

## 快速开始

在此仓库之外，你可以使用 [C3](https://developers.cloudflare.com/pages/get-started/c3/)（`create-cloudflare` CLI）基于此模板创建新项目：

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/to-do-list-kv-template
```

此模板的在线公开部署可访问 [https://to-do-list-kv-template.templates.workers.dev](https://to-do-list-kv-template.templates.workers.dev)。

## 设置步骤

1. 使用你选择的包管理器安装项目依赖：
   ```bash
   npm install
   ```
2. 创建一个绑定名为 `TO_DO_LIST` 的 [KV 命名空间](https://developers.cloudflare.com/kv/get-started/)：
   ```bash
   npx wrangler kv namespace create TO_DO_LIST
   ```
   ...并将 `wrangler.jsonc` 中 `kv_namespaces` -> `id` 字段更新为新的命名空间 ID。
3. 构建应用：
   ```bash
   npm run build
   ```
4. 部署它！
   ```bash
   npx wrangler deploy
   ```
5. 监控你的 worker！
   ```bash
   npx wrangler tail
   ```
