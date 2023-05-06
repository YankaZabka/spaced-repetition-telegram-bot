import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const repeat = async (
  chatId: number,
  bot: TelegramBot,
  chapter: D.types.IChapter,
) => {
  await bot.sendMessage(
    chatId,
    `Title: ${chapter.title}.\nDescription: ${chapter.description}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Complete ✅',
              callback_data: `/complete?tId=${chapter.topicId}&cId=${chapter.id}`,
            },
            {
              text: 'More 📖 ',
              callback_data: `/show-chapter?tId=${chapter.topicId}&cId=${chapter.id}`,
            },
          ],
          [
            {
              text: 'Fail ❎',
              callback_data: `/fail?tId=${chapter.topicId}&cId=${chapter.id}`,
            },
            { text: 'Snooze 💤 (WIP)', callback_data: `/snooze/${chapter.id}` },
          ],
          [
            {
              text: 'Progress 🚀 (WIP)',
              callback_data: `/progress/${chapter.id}`,
            },
          ],
        ],
      },
    },
  );
};

export default repeat;
