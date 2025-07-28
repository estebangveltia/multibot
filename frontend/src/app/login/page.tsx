'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import type { Role } from '../../types/role'

const roles: Role[] = ['SUPER_ADMIN', 'TENANT_ADMIN', 'ANALYST', 'AGENT', 'VIEWER']

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('VIEWER')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, role, token: password })
    router.push('/')
  }

  return (
    <main className="container mx-auto max-w-sm p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          className="border rounded w-full p-2"
          value={role}
          onChange={e => setRole(e.target.value as Role)}
        >
          {roles.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </main>
  )
}
