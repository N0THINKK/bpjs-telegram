'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Conversation {
  id: string
  chatId: string
  userName: string | null
  message: string
  response: string | null
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Fetch data function
  async function fetchConversations() {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load + auto refresh tiap 5 detik
  useEffect(() => {
    fetchConversations()

    const interval = setInterval(() => {
      fetchConversations()
    }, 5000) // 5 detik

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header dengan indicator */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Percakapan</h2>
          <p className="text-sm text-gray-400 mt-1">
            Total: {conversations.length} chat • 
            Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left">Waktu</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Pesan</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => (
              <tr 
                key={conv.id} 
                className="border-t border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <td className="p-4 text-sm text-gray-400">
                  {new Date(conv.createdAt).toLocaleString('id-ID')}
                </td>
                <td className="p-4 font-medium">{conv.userName}</td>
                <td className="p-4 max-w-md truncate">{conv.message}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    conv.status === 'active' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}>
                    {conv.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/dashboard/${conv.id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Detail →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {conversations.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">Belum ada percakapan</p>
          <p className="text-sm mt-2">Chat akan muncul otomatis di sini</p>
        </div>
      )}
    </div>
  )
}