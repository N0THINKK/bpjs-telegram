import { bot } from '@/app/lib/bot';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ 
    message: 'BPJS Helpdesk Bot Webhook',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}