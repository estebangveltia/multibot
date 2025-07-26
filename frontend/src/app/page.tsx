'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ChatMessage { author: string; text: string }

export default function Home() {
  const [tenant, setTenant] = useState('')
  const [sender, setSender] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  async function sendMessage() {
    if (!message) return
    setMessages(m => [...m, { author: 'me', text: message }])
    const payload = { tenant, sender, message }
    setMessage('')
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.ok && Array.isArray(json.data)) {
        const bots = json.data.filter((r: any) => r.text).map((r: any) => ({ author: 'bot', text: r.text }))
        setMessages(m => [...m, ...bots])
      } else {
        setMessages(m => [...m, { author: 'system', text: 'Error: ' + JSON.stringify(json) }])
      }
    } catch (err: any) {
      setMessages(m => [...m, { author: 'system', text: err.message }])
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Chatbot Multi-Tenant</h1>
      <div className="flex space-x-2">
        <input value={tenant} onChange={e=>setTenant(e.target.value)} placeholder="tenant" className="border p-1 flex-1" />
        <input value={sender} onChange={e=>setSender(e.target.value)} placeholder="sender" className="border p-1 flex-1" />
      </div>
      <div className="space-y-1 min-h-[300px] border p-2">
        {messages.map((m,i)=> (
          <div key={i} className={`text-sm ${m.author==='me' ? 'text-right' : ''}`}>
            <span className="font-semibold mr-1">{m.author}</span>{m.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={message}
          onChange={e=>setMessage(e.target.value)}
          placeholder="message"
          className="flex-1 border p-1"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}
