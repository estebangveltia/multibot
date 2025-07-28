import Chat from '../components/Chat'

export default function Home() {
  return (
    <main className="container mx-auto max-w-xl p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🤖 Multibot Chat
      </h1>
      <Chat />
    </main>
  )
}
