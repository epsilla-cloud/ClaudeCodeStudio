import React from 'react'
import { ChatInterface } from './components/ChatInterface'
import { FileExplorer } from './components/FileExplorer'
import { StatusBar } from './components/StatusBar'
import { useAppStore } from './store/appStore'

function App() {
  const { currentProject } = useAppStore()

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Menu Bar */}
      <div className="bg-bg-secondary border-b border-gray-600 px-4 py-2 flex items-center">
        <span className="text-text-primary font-semibold">Claude Code Studio</span>
        <div className="ml-8 flex space-x-6">
          <button className="text-text-secondary hover:text-text-primary text-sm">File</button>
          <button className="text-text-secondary hover:text-text-primary text-sm">Edit</button>
          <button className="text-text-secondary hover:text-text-primary text-sm">View</button>
          <button className="text-text-secondary hover:text-text-primary text-sm">Help</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 bg-bg-secondary border-r border-gray-600">
          <FileExplorer />
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}

export default App