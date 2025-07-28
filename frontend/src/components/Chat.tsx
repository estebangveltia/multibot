'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Chat() {
  const { messages, sendMessage } = useChat()
  const [text, setText] = useState('')

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage(text)
    setText('')
  }

  return (
    <div className="space-y-4">
      <div className="border rounded p-4 h-64 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <span>{m.from === 'user' ? '🧑' : '🤖'} {m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
          placeholder="Escribe un mensaje..."
        />
        <Button onClick={handleSend} variant="default" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
