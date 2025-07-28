'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ChatMessage {
  from: 'user' | 'bot'
  text: string
}

interface ChatState {
  messages: ChatMessage[]
  sendMessage: (text: string) => Promise<void>
}

const ChatContext = createContext<ChatState | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('chat')
    if (stored) {
      try {
        setMessages(JSON.parse(stored))
      } catch {
        /* ignore */
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chat', JSON.stringify(messages))
  }, [messages])

  const sendMessage = async (text: string) => {
    setMessages(prev => [...prev, { from: 'user', text }])
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: 'default', sender: 'anonymous', message: text })
      })
      const data = await res.json()
      const replies: string[] = Array.isArray(data.data)
        ? data.data.map((r: any) => r.text)
        : [data.data?.text || data.data]
      replies.forEach(t => setMessages(prev => [...prev, { from: 'bot', text: t }]))
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error sending message' }])
    }
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
