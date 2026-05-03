import { NextResponse } from 'next/server'
import { conversationRepo } from '@/app/services/conversation'

export async function GET() {
  try {
    const conversations = await conversationRepo.findAll(100)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}