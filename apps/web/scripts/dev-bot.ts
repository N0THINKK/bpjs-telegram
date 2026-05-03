import 'dotenv/config'
import { bot } from '../app/lib/bot'

console.log('🤖 Starting bot in polling mode...')

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))