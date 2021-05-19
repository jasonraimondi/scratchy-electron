import { join } from "path";
import { app, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { environment } from "@/config/environment";

async function createWindow(windowOptions: Partial<BrowserWindowConstructorOptions> = {}) {
  const win = new BrowserWindow({
    title: "Jason's Title",
    width: 1440,
    height: 900,
    frame: !environment.isMac,
    titleBarStyle: "hidden",
    resizable: true,
    backgroundColor: "#FFF",
    minHeight: 400,
    minWidth: 500,
    ...windowOptions,
    webPreferences: {
      preload: join(__dirname, "../renderer/preload.js"),
      ...windowOptions.webPreferences,
    },
  });
  await win.loadFile("index.html");
}

async function bootstrap() {
  await app.whenReady();
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

bootstrap().catch(console.log);
