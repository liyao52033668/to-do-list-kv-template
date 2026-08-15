/**
 * 默认情况下，Remix 会为您在客户端自动处理应用的水合（hydrating）过程。
 * 如果您希望删除此文件，完全可以自由操作，但如果以后想恢复它，
 * 可以运行 `npx remix reveal` ✨
 * 有关更多信息，请参阅 https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>,
	);
});
