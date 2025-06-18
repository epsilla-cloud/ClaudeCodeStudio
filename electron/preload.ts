import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  onMainProcessMessage: (callback: (message: string) => void) => 
    ipcRenderer.on('main-process-message', (_event, message) => callback(message)),
  
  executeClaudeCode: (command: string) => 
    ipcRenderer.invoke('execute-claude-code', command),
  
  getSystemInfo: () => 
    ipcRenderer.invoke('get-system-info'),
})

declare global {
  interface Window {
    electronAPI: {
      onMainProcessMessage: (callback: (message: string) => void) => void
      executeClaudeCode: (command: string) => Promise<string>
      getSystemInfo: () => Promise<{
        platform: string
        arch: string
        node: string
        electron: string
      }>
    }
  }
}