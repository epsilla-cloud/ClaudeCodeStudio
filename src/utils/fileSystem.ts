export interface FileSystemNode {
  name: string
  type: 'file' | 'folder'
  path: string
  size?: number
  modified?: Date
  children?: FileSystemNode[]
  expanded?: boolean
}

export class FileSystemManager {
  private static instance: FileSystemManager
  
  static getInstance(): FileSystemManager {
    if (!FileSystemManager.instance) {
      FileSystemManager.instance = new FileSystemManager()
    }
    return FileSystemManager.instance
  }

  async loadProjectStructure(projectPath: string): Promise<FileSystemNode[]> {
    // In a real implementation, this would use electron's fs module
    // For now, return a mock structure
    return this.getMockFileStructure()
  }

  private getMockFileStructure(): FileSystemNode[] {
    return [
      {
        name: 'src',
        type: 'folder',
        path: '/src',
        expanded: true,
        children: [
          {
            name: 'components',
            type: 'folder',
            path: '/src/components',
            expanded: false,
            children: [
              { name: 'ChatInterface.tsx', type: 'file', path: '/src/components/ChatInterface.tsx', size: 3420 },
              { name: 'MessageBubble.tsx', type: 'file', path: '/src/components/MessageBubble.tsx', size: 1580 },
              { name: 'FileExplorer.tsx', type: 'file', path: '/src/components/FileExplorer.tsx', size: 2140 },
            ]
          },
          {
            name: 'store',
            type: 'folder',
            path: '/src/store',
            children: [
              { name: 'appStore.ts', type: 'file', path: '/src/store/appStore.ts', size: 1200 }
            ]
          },
          {
            name: 'utils',
            type: 'folder',
            path: '/src/utils',
            children: [
              { name: 'claudeCodeBridge.ts', type: 'file', path: '/src/utils/claudeCodeBridge.ts', size: 2800 }
            ]
          },
          { name: 'main.tsx', type: 'file', path: '/src/main.tsx', size: 320 },
          { name: 'App.tsx', type: 'file', path: '/src/App.tsx', size: 1840 },
          { name: 'index.css', type: 'file', path: '/src/index.css', size: 950 },
        ]
      },
      {
        name: 'electron',
        type: 'folder',
        path: '/electron',
        children: [
          { name: 'main.ts', type: 'file', path: '/electron/main.ts', size: 3200 },
          { name: 'preload.ts', type: 'file', path: '/electron/preload.ts', size: 860 }
        ]
      },
      {
        name: 'public',
        type: 'folder',
        path: '/public',
        children: [
          { name: 'favicon.ico', type: 'file', path: '/public/favicon.ico', size: 4286 }
        ]
      },
      { name: 'package.json', type: 'file', path: '/package.json', size: 1200 },
      { name: 'tsconfig.json', type: 'file', path: '/tsconfig.json', size: 640 },
      { name: 'vite.config.ts', type: 'file', path: '/vite.config.ts', size: 580 },
      { name: 'tailwind.config.js', type: 'file', path: '/tailwind.config.js', size: 420 },
      { name: 'README.md', type: 'file', path: '/README.md', size: 890 },
    ]
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    const iconMap: Record<string, string> = {
      'tsx': '⚛️',
      'ts': '🔷',
      'js': '🟨',
      'jsx': '⚛️',
      'json': '📄',
      'md': '📝',
      'css': '🎨',
      'html': '🌐',
      'svg': '🖼️',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'ico': '🖼️'
    }
    
    return iconMap[ext || ''] || '📄'
  }
}