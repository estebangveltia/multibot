import Chat from '../components/Chat'
import LogoutButton from '../components/LogoutButton'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  return (
    <main className="container mx-auto max-w-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🤖 Multibot Chat
        </h1>
        {user ? <LogoutButton /> : <Link href="/login">Login</Link>}
      </div>
      <Chat />
    </main>
  )
}
