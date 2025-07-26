'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { Smile } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-4">
      <Smile className="w-8 h-8 text-blue-500" />
      <h1 className="text-2xl font-bold">Hola{user ? `, ${user.name} 👋` : '!'}</h1>
      {user ? (
        <Link href="/dashboard" className="text-blue-600 underline">Ir al dashboard</Link>
      ) : (
        <Link href="/login" className="text-blue-600 underline">Iniciar sesión</Link>
      )}
    </main>
  )
}
