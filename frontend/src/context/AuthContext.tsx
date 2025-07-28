'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Role } from '../types/role'

export interface AuthUser {
  email: string
  role: Role
  token?: string
}

interface AuthState {
  user: AuthUser | null
  login: (info: AuthUser) => void
  logout: () => void
  hasRole: (role: Role | Role[]) => boolean
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('auth')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        /* ignore */
      }
    }
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('auth', JSON.stringify(user))
    else localStorage.removeItem('auth')
  }, [user])

  const login = (info: AuthUser) => {
    setUser(info)
  }

  const logout = () => {
    setUser(null)
  }

  const hasRole = (roles: Role | Role[]) => {
    if (!user) return false
    const arr = Array.isArray(roles) ? roles : [roles]
    return arr.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
