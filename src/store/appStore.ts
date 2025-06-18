import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface AppState {
  messages: Message[]
  currentProject: string | null
  isConnected: boolean
  isLoading: boolean
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  setCurrentProject: (project: string | null) => void
  setConnected: (connected: boolean) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  messages: [],
  currentProject: null,
  isConnected: false,
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }]
  })),

  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),

  setCurrentProject: (project) => set({ currentProject: project }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] })
}))