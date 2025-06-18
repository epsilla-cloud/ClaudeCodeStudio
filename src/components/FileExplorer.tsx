import React, { useState, useEffect } from 'react'
import { Folder, File, ChevronRight, ChevronDown, Plus, RefreshCw } from 'lucide-react'
import { FileSystemManager, FileSystemNode } from '../utils/fileSystem'
import { useAppStore } from '../store/appStore'

export function FileExplorer() {
  const [fileTree, setFileTree] = useState<FileSystemNode[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { setCurrentProject } = useAppStore()
  const fileManager = FileSystemManager.getInstance()

  useEffect(() => {
    loadFileTree()
  }, [])

  const loadFileTree = async () => {
    const tree = await fileManager.loadProjectStructure('/current-project')
    setFileTree(tree)
    setCurrentProject('Claude Code Studio')
  }

  const toggleFolder = (path: string) => {
    const updateTree = (nodes: FileSystemNode[]): FileSystemNode[] => {
      return nodes.map(node => {
        if (node.path === path && node.type === 'folder') {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) }
        }
        return node
      })
    }
    setFileTree(updateTree(fileTree))
  }

  const handleFileClick = (node: FileSystemNode) => {
    if (node.type === 'file') {
      setSelectedFile(node.path)
    } else {
      toggleFolder(node.path)
    }
  }

  const FileTreeNode = ({ node, level = 0 }: { node: FileSystemNode; level?: number }) => {
    const isSelected = selectedFile === node.path
    
    return (
      <div>
        <div
          className={`flex items-center space-x-2 px-2 py-1 hover:bg-gray-700 cursor-pointer transition-colors ${
            isSelected ? 'bg-accent/20 border-l-2 border-accent' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'folder' && (
            node.expanded ? (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            )
          )}
          
          {node.type === 'folder' ? (
            <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            <span className="text-sm w-4 h-4 flex items-center justify-center">
              {fileManager.getFileIcon(node.name)}
            </span>
          )}
          
          <span className={`text-sm flex-1 ${isSelected ? 'text-white font-medium' : 'text-text-primary'}`}>
            {node.name}
          </span>
          
          {node.type === 'file' && node.size && (
            <span className="text-xs text-text-secondary">
              {fileManager.formatFileSize(node.size)}
            </span>
          )}
        </div>
        
        {node.type === 'folder' && node.expanded && node.children && (
          <div>
            {node.children.map((child, index) => (
              <FileTreeNode key={`${child.path}-${index}`} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-600">
        <span className="text-text-primary font-medium text-sm">EXPLORER</span>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-gray-600 rounded" title="New File">
            <Plus className="w-4 h-4 text-text-secondary" />
          </button>
          <button 
            className="p-1 hover:bg-gray-600 rounded" 
            title="Refresh"
            onClick={loadFileTree}
          >
            <RefreshCw className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {fileTree.map((node, index) => (
          <FileTreeNode key={`${node.path}-${index}`} node={node} />
        ))}
      </div>
    </div>
  )
}