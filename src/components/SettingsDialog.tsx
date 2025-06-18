import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Settings, Save } from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SettingsState {
  apiKey: string
  theme: 'dark' | 'light'
  fontSize: number
  autoSave: boolean
  claudeCodePath: string
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState<SettingsState>({
    apiKey: '',
    theme: 'dark',
    fontSize: 14,
    autoSave: true,
    claudeCodePath: 'claude-code'
  })

  const handleSave = () => {
    // In a real app, this would save to localStorage or electron-store
    localStorage.setItem('claude-code-studio-settings', JSON.stringify(settings))
    onOpenChange(false)
  }

  const handleReset = () => {
    setSettings({
      apiKey: '',
      theme: 'dark',
      fontSize: 14,
      autoSave: true,
      claudeCodePath: 'claude-code'
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bg-secondary border border-gray-600 rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-accent" />
              <Dialog.Title className="text-lg font-semibold text-text-primary">
                Settings
              </Dialog.Title>
            </div>
            <Dialog.Close className="p-1 hover:bg-gray-700 rounded">
              <X className="w-5 h-5 text-text-secondary" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* API Configuration */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-primary">API Configuration</h3>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-ant-..."
                  className="w-full bg-bg-primary border border-gray-600 rounded px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Your API key is stored locally and never sent to external servers
                </p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Claude Code Path
                </label>
                <input
                  type="text"
                  value={settings.claudeCodePath}
                  onChange={(e) => setSettings(prev => ({ ...prev, claudeCodePath: e.target.value }))}
                  placeholder="claude-code"
                  className="w-full bg-bg-primary border border-gray-600 rounded px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Path to Claude Code CLI executable
                </p>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-primary">Appearance</h3>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' }))}
                  className="w-full bg-bg-primary border border-gray-600 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full accent-accent"
                />
              </div>
            </div>

            {/* Editor */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-primary">Editor</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="accent-accent"
                />
                <label htmlFor="autoSave" className="text-sm text-text-primary">
                  Auto-save conversations
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}