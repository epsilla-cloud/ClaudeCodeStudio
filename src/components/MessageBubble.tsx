import React from 'react'
import { User, Bot } from 'lucide-react'
import { Message } from '../store/appStore'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-msg-user' : 'bg-msg-assistant'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-msg-user text-white' 
            : 'bg-msg-assistant text-text-primary border border-gray-600'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser ? 'text-green-200' : 'text-text-secondary'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}