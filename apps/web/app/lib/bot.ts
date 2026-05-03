import { Telegraf, Markup } from 'telegraf'
import { conversationRepo } from '@/app/services/conversation'

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!')
}

export const bot = new Telegraf(process.env.BOT_TOKEN)

// ==================== KEYBOARD MENU ====================
const mainMenu = Markup.keyboard([
  ['📋 FAQ', '📍 Cari Faskes'],
  ['💳 Status Kepesertaan', '💰 Cek Iuran'],
  ['🆘 Bantuan Langsung']
]).resize()

const faqMenu = Markup.keyboard([
  ['📝 Cara Daftar BPJS'],
  ['🏥 Klaim Rawat Inap'],
  ['💳 Kartu Hilang/Rusak'],
  ['⬅️ Kembali ke Menu']
]).resize()

// ==================== COMMANDS ====================

// /start
bot.start(async (ctx) => {
  await ctx.replyWithMarkdown(
    `🏥 *Selamat datang di Helpdesk BPJS Kedung!*\n\n` +
    `Halo *${ctx.from.first_name}*! Saya asisten virtual BPJS Kedung.\n` +
    `Ada yang bisa saya bantu hari ini?`,
    mainMenu
  )
  
  // Simpan ke database
  await conversationRepo.create({
    chatId: String(ctx.chat.id),
    userName: ctx.from.username || ctx.from.first_name || 'Anonymous',
    message: '/start',
    category: 'start'
  })
})

// /faq
bot.command('faq', async (ctx) => {
  await ctx.replyWithMarkdown(
    `📋 *FAQ BPJS Kedung*\n\n` +
    `Pilih topik yang ingin Anda ketahui:`,
    faqMenu
  )
})

// /status
bot.command('status', async (ctx) => {
  await ctx.replyWithMarkdown(
    `💳 *Cek Status Kepesertaan*\n\n` +
    `Silakan kunjungi:\n` +
    `🔗 https://bpjs-kesehatan.go.id\n\n` +
    `Atau hubungi call center:\n` +
    `📞 1500 400`
  )
})

// /lokasi
bot.command('lokasi', async (ctx) => {
  await ctx.replyWithMarkdown(
    `📍 *Cari Fasilitas Kesehatan*\n\n` +
    `Kirimkan lokasi Anda untuk mencari faskes terdekat.\n` +
    `Atau kunjungi:\n` +
    `🔗 https://faskes.bpjs-kesehatan.go.id`
  )
})

// /bantuan
bot.command('bantuan', async (ctx) => {
  await ctx.replyWithMarkdown(
    `🆘 *Bantuan Langsung*\n\n` +
    `Tim admin kami siap membantu Anda.\n` +
    `Silakan ketik pertanyaan Anda, dan admin akan merespons segera.`,
    Markup.removeKeyboard()
  )
})

// ==================== TEXT HANDLERS ====================

// Handle menu buttons & FAQ
bot.on('text', async (ctx) => {
  const text = ctx.message.text
  const chatId = String(ctx.chat.id)
  const userName = ctx.from.username || ctx.from.first_name || 'Anonymous'

  // Simpan semua pesan ke database
  await conversationRepo.create({
    chatId,
    userName,
    message: text,
    category: detectCategory(text)
  })

  // Handle menu buttons
  switch (text) {
    case '📋 FAQ':
    case '/faq':
      return ctx.replyWithMarkdown('📋 *FAQ BPJS:*', faqMenu)
    
    case '📍 Cari Faskes':
    case '/lokasi':
      return ctx.replyWithMarkdown(
        `📍 *Cari Faskes Terdekat*\n\n` +
        `Silakan kirim lokasi Anda atau kunjungi:\n` +
        `https://faskes.bpjs-kesehatan.go.id`
      )
    
    case '💳 Status Kepesertaan':
    case '/status':
      return ctx.replyWithMarkdown(
        `💳 *Status Kepesertaan*\n\n` +
        `Cek status Anda di:\n` +
        `🔗 https://bpjs-kesehatan.go.id\n` +
        `📞 Call Center: 1500 400`
      )
    
    case '💰 Cek Iuran':
      return ctx.replyWithMarkdown(
        `💰 *Cek Iuran BPJS*\n\n` +
        `Iuran dapat dicek melalui:\n` +
        `1. Aplikasi Mobile JKN\n` +
        `2. Website bpjs-kesehatan.go.id\n` +
        `3. Kantor BPJS terdekat`
      )
    
    case '🆘 Bantuan Langsung':
    case '/bantuan':
      return ctx.replyWithMarkdown(
        `🆘 *Bantuan Langsung*\n\n` +
        `Silakan ketik pertanyaan detail Anda.\n` +
        `Admin akan merespons dalam waktu 1x24 jam.`,
        Markup.removeKeyboard()
      )
    
    case '📝 Cara Daftar BPJS':
      return ctx.replyWithMarkdown(
        `📝 *Cara Daftar BPJS Kesehatan*\n\n` +
        `*Online:*\n` +
        `1. Kunjungi bpjs-kesehatan.go.id\n` +
        `2. Pilih "Pendaftaran"\n` +
        `3. Isi data lengkap\n` +
        `4. Upload dokumen\n` +
        `5. Cetak kartu sementara\n\n` +
        `*Offline:*\n` +
        `Datang ke kantor BPJS terdekat dengan KTP & KK`
      )
    
    case '🏥 Klaim Rawat Inap':
      return ctx.replyWithMarkdown(
        `🏥 *Prosedur Klaim Rawat Inap*\n\n` +
        `*Persyaratan:*\n` +
        `• Kartu BPJS/KTP\n` +
        `• Surat rujukan (jika ada)\n` +
        `• Formulir klaim dari rumah sakit\n\n` +
        `*Proses:*\n` +
        `1. Daftar di loket RS\n` +
        `2. Verifikasi oleh petugas\n` +
        `3. Tunggu approval (real-time)`
      )
    
    case '💳 Kartu Hilang/Rusak':
      return ctx.replyWithMarkdown(
        `💳 *Kartu Hilang/Rusak*\n\n` +
        `*Cetak Ulang Kartu:*\n` +
        `1. Login di bpjs-kesehatan.go.id\n` +
        `2. Pilih "Cetak Kartu"\n` +
        `3. Atau gunakan Mobile JKN\n\n` +
        `*Kantor BPJS:*\n` +
        `Bawa KTP untuk cetak kartu fisik`
      )
    
    case '⬅️ Kembali ke Menu':
      return ctx.replyWithMarkdown('🏠 *Menu Utama*', mainMenu)
    
    default:
      // Pesan umum → masuk ke database untuk admin
      return ctx.replyWithMarkdown(
        `✅ *Pesan tersimpan!*\n\n` +
        `Terima kasih telah menghubungi kami.\n` +
        `Tim admin akan merespons segera.\n\n` +
        `Nomor tiket: *#${Date.now().toString().slice(-6)}*`,
        mainMenu
      )
  }
})

// ==================== LOCATION HANDLER ====================
bot.on('location', async (ctx) => {
  const { latitude, longitude } = ctx.message.location
  
  await ctx.replyWithMarkdown(
    `📍 *Lokasi diterima!*\n\n` +
    `Koordinat: ${latitude}, ${longitude}\n\n` +
    `Faskes terdekat:\n` +
    `• RSUD Kedung - 2.3 km\n` +
    `• Puskesmas Wonorejo - 1.5 km\n` +
    `• Klinik Sehat - 0.8 km\n\n` +
    `[Buka di Google Maps](https://www.google.com/maps/search/RS+terdekat/@${latitude},${longitude},15z)`
  )
})

// ==================== HELPERS ====================
function detectCategory(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('daftar')) return 'pendaftaran'
  if (lower.includes('klaim')) return 'klaim'
  if (lower.includes('kartu')) return 'kartu'
  if (lower.includes('iuran')) return 'pembayaran'
  if (lower.includes('lokasi')) return 'faskes'
  return 'general'
}

// Error handler
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err)
  ctx.reply('❌ Maaf, terjadi kesalahan. Silakan coba lagi.')
})