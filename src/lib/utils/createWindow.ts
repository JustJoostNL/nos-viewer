import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export function createWindow(
  windowId: string,
  windowTitle: string,
  windowUrl: string,
) {
  const webview = new WebviewWindow(windowId, {
    title: windowTitle,
    url: windowUrl,
    width: 800,
    height: 450,
  });

  return webview;
}
