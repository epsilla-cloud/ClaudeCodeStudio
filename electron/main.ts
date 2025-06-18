import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn } from 'child_process'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, 'preload.js')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Claude Code Studio',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// IPC handlers for Claude Code integration
ipcMain.handle('execute-claude-code', async (event, command: string) => {
  return new Promise((resolve, reject) => {
    const claudeProcess = spawn('claude-code', command.split(' '), {
      shell: true,
      stdio: 'pipe'
    })

    let stdout = ''
    let stderr = ''

    claudeProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    claudeProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    claudeProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(stderr))
      }
    })
  })
})

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    electron: process.versions.electron
  }
})