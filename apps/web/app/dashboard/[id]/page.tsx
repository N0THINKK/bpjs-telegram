import Link from 'next/link'
import { conversationRepo } from '@/app/services/conversation'
import { ReplyForm } from './ReplyForm'

export default async function ConversationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const conversation = await conversationRepo.findById(params.id)
  
  if (!conversation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Chat tidak ditemukan</h2>
        <Link href="/dashboard" className="text-blue-400 mt-4 inline-block">
          ← Kembali ke Dashboard
        </Link>
      </div>
    )
  }

  // Ambil semua chat dari user yang sama
  const chatHistory = await conversationRepo.findByChatId(conversation.chatId)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">
            ← Kembali ke Dashboard
          </Link>
          <h2 className="text-2xl font-bold mt-2">Detail Percakapan</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          conversation.status === 'active' 
            ? 'bg-yellow-600 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          {conversation.status === 'active' ? '⏳ Menunggu' : '✅ Terjawab'}
        </span>
      </div>

      {/* Info User */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">User:</span>
            <p className="font-semibold text-lg">{conversation.userName}</p>
          </div>
          <div>
            <span className="text-gray-400">Chat ID:</span>
            <p className="font-mono">{conversation.chatId}</p>
          </div>
          <div>
            <span className="text-gray-400">Waktu:</span>
            <p>{new Date(conversation.createdAt).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 min-h-[300px]">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
          Riwayat Chat
        </h3>
        
        <div className="space-y-4">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="flex flex-col gap-2">
              {/* Pesan User */}
              <div className="flex justify-start">
                <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-sm font-semibold text-blue-200 mb-1">
                    {chat.userName}
                  </p>
                  <p>{chat.message}</p>
                  <span className="text-xs text-blue-300 mt-1 block">
                    {new Date(chat.createdAt).toLocaleTimeString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Balasan Admin (kalau ada) */}
              {chat.response && (
                <div className="flex justify-end">
                  <div className="bg-green-600 rounded-lg px-4 py-2 max-w-[80%]">
                    <p className="text-sm font-semibold text-green-200 mb-1">
                      Admin BPJS
                    </p>
                    <p>{chat.response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {conversation.status === 'active' && (
        <ReplyForm 
          conversationId={conversation.id} 
          chatId={conversation.chatId}
        />
      )}
    </div>
  )
}