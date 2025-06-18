import React, { useState } from 'react'
import { Circle, GitBranch, Settings } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { SettingsDialog } from './SettingsDialog'

export function StatusBar() {
  const { isConnected, currentProject } = useAppStore()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="bg-bg-secondary border-t border-gray-600 px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <Circle className={`w-3 h-3 ${isConnected ? 'text-green-400 fill-current' : 'text-red-400 fill-current'}`} />
          <span className="text-text-secondary">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Current Project */}
        {currentProject && (
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-text-secondary" />
            <span className="text-text-primary">
              Working on: {currentProject}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button 
          className="p-1 hover:bg-gray-600 rounded"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          <Settings className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}