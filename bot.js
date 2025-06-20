const { Telegraf } = require('telegraf');
const { scrapeQuestionsFromUrl } = require('./scraper');
const { solveQuestions } = require('./solver');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Welcome to Exam Helper Bot!\nSend me a link to your test or exam page, and I’ll help you answer it.");
});

bot.command('solve', async (ctx) => {
  const input = ctx.message.text.split(" ")[1];
  if (!input) {
    return ctx.reply("⚠️ Please send the link like this:\n/solve https://exam-link.com");
  }

  ctx.reply("🔍 Scanning the page for questions...");
  try {
    const questions = await scrapeQuestionsFromUrl(input);
    ctx.reply("🧠 Solving questions...");
    const answers = await solveQuestions(questions);

    answers.forEach((q, i) => {
      ctx.reply(`📘 Q${i+1}: ${q.question}\n✅ Answer: ${q.answer}\n💡 Explanation: ${q.explanation}`);
    });
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Failed to process the link. It may be protected or not compatible.");
  }
});

bot.launch();