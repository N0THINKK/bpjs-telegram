import { NextResponse } from 'next/server'
import { conversationRepo } from '@/app/services/conversation'
import { bot } from '@/app/lib/bot'

export async function POST(req: Request) {
  try {
    const { id, chatId, response } = await req.json()

    // 1. Simpan ke database
    await conversationRepo.updateResponse(id, response)

    // 2. Kirim balasan ke Telegram
    await bot.telegram.sendMessage(chatId, 
      `🏥 *Balasan dari Admin BPJS Kedung:*\n\n${response}`, 
      { parse_mode: 'Markdown' }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' }, 
      { status: 500 }
    )
  }
}

