'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'

export default function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()
  return (
    <Button
      onClick={() => {
        logout()
        router.push('/login')
      }}
    >
      Logout
    </Button>
  )
}
