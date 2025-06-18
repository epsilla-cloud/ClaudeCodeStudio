"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_module = require("node:module");
const node_url = require("node:url");
const path = require("node:path");
const child_process = require("child_process");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path.join(__dirname$1, "../");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(__dirname$1, "preload.js");
const indexHtml = path.join(RENDERER_DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Claude Code Studio",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
electron.ipcMain.handle("execute-claude-code", async (event, command) => {
  return new Promise((resolve, reject) => {
    const claudeProcess = child_process.spawn("claude-code", command.split(" "), {
      shell: true,
      stdio: "pipe"
    });
    let stdout = "";
    let stderr = "";
    claudeProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    claudeProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    claudeProcess.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
});
electron.ipcMain.handle("get-system-info", () => {
  return {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    electron: process.versions.electron
  };
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
//# sourceMappingURL=main.js.map
