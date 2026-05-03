'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReplyForm({ 
  conversationId, 
  chatId 
}: { 
  conversationId: string
  chatId: string 
}) {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!response.trim()) return

    setLoading(true)
    
    try {
      const res = await fetch('/api/conversations/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: conversationId, 
          chatId,
          response 
        })
      })

      if (res.ok) {
        setResponse('')
        router.refresh() // Refresh page biar chat update
      } else {
        alert('Gagal mengirim balasan')
      }
    } catch (error) {
      alert('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Balas Pesan</h3>
      
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Ketik balasan Anda di sini..."
        className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={loading || !response.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Mengirim...' : 'Kirim Balasan →'}
        </button>
      </div>
    </form>
  )
}