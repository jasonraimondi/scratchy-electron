// import "source-map-support/register";
// import "tsconfig-paths/register";
// import "dotenv/config";

import { app } from "electron";
import { join } from "path";

import { WindowManager } from "./window_manager";
import { environment } from "./config/environment";

const mainWindowUrl = `file://${join(__dirname, "../../index.html")}`;
const windowManager = new WindowManager(mainWindowUrl);

export async function openMainWindow() {
  await windowManager.createWindow();
}

// export function reloadAllWindows() {
//   windowManager.reloadAll();
// }

async function bootstrap() {
  await app.whenReady();
  await openMainWindow();

  app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (environment.isMac) {
      windowManager.focusOrCreate();
    }
  });

  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!environment.isMac) {
      app.quit();
    }
  });
}

bootstrap().catch(console.log);
