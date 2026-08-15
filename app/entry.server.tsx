/**
 * 默认情况下，Remix 会为您自动处理生成 HTTP 响应。
 * 如果您希望删除此文件，完全可以自由操作，但如果以后想恢复它，
 * 可以运行 `npx remix reveal` ✨
 * 有关更多信息，请参阅 https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	// 此参数被忽略，以便在模板中保留其可见性。
	// 如果您在应用中不使用它，可以随意删除此参数！
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loadContext: AppLoadContext,
) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, ABORT_DELAY);

	const body = await renderToReadableStream(
		<RemixServer
			context={remixContext}
			url={request.url}
			abortDelay={ABORT_DELAY}
		/>,
		{
			signal: controller.signal,
			onError(error: unknown) {
				if (!controller.signal.aborted) {
					// 记录外壳内部的流式渲染错误
					console.error(error);
				}
				responseStatusCode = 500;
			},
		},
	);

	void body.allReady.then(() => {
		clearTimeout(timeoutId);
	});

	if (isbot(request.headers.get("user-agent") || "")) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
