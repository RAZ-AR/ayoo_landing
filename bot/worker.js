/**
 * AYOO Support Bot — Cloudflare Worker
 *
 * Deploy: workers.cloudflare.com → New Worker → paste this → Deploy
 * Set webhook (once, in browser):
 *   https://api.telegram.org/bot8716681173:AAF3VQ3MuCjyUZD9GJ1rB8XJTyYBOkcfko4/setWebhook?url=https://YOUR-WORKER.workers.dev
 *
 * To get your ADMIN_CHAT_ID: send /id to the bot, it replies with your id.
 */

const BOT_TOKEN = '8716681173:AAF3VQ3MuCjyUZD9GJ1rB8XJTyYBOkcfko4';
const ADMIN_CHAT_ID = 128136200;

// ---- Messages ----
const MSGS = {
  client: {
    ru: `Привет! 👋\n\nСпасибо, что ждёшь AYOO!\n\n🐣 Скоро пришлём питомца прямо в этот чат.\nОставайся на связи!`,
    en: `Hey! 👋\n\nThanks for waiting for AYOO!\n\n🐣 We'll send your pet to this chat soon.\nStay tuned!`,
    sr: `Zdravo! 👋\n\nHvala što čekaš AYOO!\n\n🐣 Uskoro šaljemo ljubimca u ovaj čat.\nOstani uz nas!`,
  },
  merchant: {
    ru: `Привет! 👋\n\nЗаявка принята! ✅\n\n🚀 Скоро пришлём доступ к мини-приложению партнёра.\n\nВы одни из первых — спасибо за доверие!`,
    en: `Hey! 👋\n\nApplication received! ✅\n\n🚀 We'll send you partner mini-app access soon.\n\nYou're among the first — thanks for your trust!`,
    sr: `Zdravo! 👋\n\nPrijava primljena! ✅\n\n🚀 Uskoro šaljemo pristup partnerskoj mini-aplikaciji.\n\nMeđu prvima ste — hvala na poverenju!`,
  },
};

// ---- Helpers ----
async function tgCall(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

function detectLang(code = '') {
  if (code.startsWith('en')) return 'en';
  if (code.startsWith('sr') || code.startsWith('bs') || code.startsWith('hr')) return 'sr';
  return 'ru';
}

// ---- Main handler ----
export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response('AYOO Bot is running ✅');

    let update;
    try { update = await request.json(); } catch { return new Response('OK'); }

    const msg = update.message;
    if (!msg?.text) return new Response('OK');

    const chatId = msg.from.id;
    const username = msg.from.username ? '@' + msg.from.username : msg.from.first_name;
    const lang = detectLang(msg.from.language_code);
    const text = msg.text.trim();

    // /id — returns chat_id (use to get ADMIN_CHAT_ID)
    if (text === '/id') {
      await tgCall('sendMessage', { chat_id: chatId, text: `Твой chat_id: <code>${chatId}</code>`, parse_mode: 'HTML' });
      return new Response('OK');
    }

    // /start client | /start merchant
    if (text.startsWith('/start')) {
      const param = text.split(' ')[1] || '';

      if (param === 'client') {
        await tgCall('sendMessage', { chat_id: chatId, text: MSGS.client[lang] });
        if (ADMIN_CHAT_ID) {
          await tgCall('sendMessage', {
            chat_id: ADMIN_CHAT_ID,
            text: `🐣 Новый клиент!\nTelegram: ${username}\nЯзык: ${lang}`,
          });
        }
      } else if (param === 'merchant') {
        await tgCall('sendMessage', { chat_id: chatId, text: MSGS.merchant[lang] });
        if (ADMIN_CHAT_ID) {
          await tgCall('sendMessage', {
            chat_id: ADMIN_CHAT_ID,
            text: `🚀 Новая заявка мерчанта!\nTelegram: ${username}\nЯзык: ${lang}`,
          });
        }
      } else {
        // Plain /start
        await tgCall('sendMessage', {
          chat_id: chatId,
          text: 'Привет! Я бот поддержки AYOO 🤖\nСкоро напишем тебе — жди!',
        });
      }
    }

    return new Response('OK');
  },
};
