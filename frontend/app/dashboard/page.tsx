'use client'

import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <p>No estás autenticado.</p>
        <Link href="/login" className="text-blue-600 underline">Ir a login</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-xl font-semibold">Dashboard de {user.name}</h2>
      <p>Rol: {user.role}</p>
      <button onClick={logout} className="bg-red-600 text-white rounded p-2 w-32">Salir</button>
    </div>
  )
}
