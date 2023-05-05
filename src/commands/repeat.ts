import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const repeat = async (
  chatId: number,
  bot: TelegramBot,
  topic: D.types.ITopic,
) => {
  await bot.sendMessage(
    chatId,
    `Title: ${topic.title}.\nDescription: ${topic.description}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Complete ✅', callback_data: `/complete/${topic.id}` },
            {
              text: 'Fail ❎',
              callback_data: `/fail/${topic.id}`,
            },
          ],
          [
            { text: 'Snooze 💤', callback_data: `/snooze/${topic.id}` },
            {
              text: 'Show 📖 ',
              callback_data: `/show/${topic.id}`,
            },
          ],
          [
            { text: 'Progress 🚀', callback_data: `/progress/${topic.id}` },
            {
              text: 'Supplement topic 🧪',
              callback_data: `/add_chapter/${topic.id}`,
            },
          ],
        ],
      },
    },
  );
};

export default repeat;
