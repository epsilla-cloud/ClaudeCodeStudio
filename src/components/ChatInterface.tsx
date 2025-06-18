import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { MessageBubble } from './MessageBubble'
import { ClaudeCodeBridge } from '../utils/claudeCodeBridge'

export function ChatInterface() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const { messages, addMessage, isLoading, setLoading } = useAppStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    addMessage({
      role: 'user',
      content: userMessage
    })

    setLoading(true)

    try {
      const claudeCode = ClaudeCodeBridge.getInstance()
      const response = await claudeCode.executeCommand(userMessage)
      
      addMessage({
        role: 'assistant',
        content: response.success ? response.output : `Error: ${response.error}`
      })
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <div className="text-center">
              <h2 className="text-xl mb-2">Welcome to Claude Code Studio</h2>
              <p>Start a conversation to begin coding with Claude</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Claude is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-600 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-bg-secondary border border-gray-600 rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:border-accent max-h-32"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-accent hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}