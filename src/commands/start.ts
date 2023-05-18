import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const start = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const userTelegramId = msg.from?.id;

  if (!msg.from?.id) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot identify your telegram id.',
    );
    return;
  }

  if (
    D.constants.DATABASE.users.findIndex(
      (user) => user.telegramId === userTelegramId,
    ) === -1
  ) {
    D.constants.DATABASE.users.push({
      chatId,
      telegramId: msg.from.id,
      topics: [
        {
          id: '1',
          title: '1',
          description: '1',
          chapters: [
            {
              id: '1',
              topicId: '1',
              title: '1',
              description: '1',
              leitnerBox: 1,
              repeatDate: 'dgsdfg',
            },
          ],
        },
      ],
    });
  }

  await bot.sendMessage(
    chatId,
    "Hi! 👋 I am a telegram bot that uses a spaced repetition algorithm to help you learn and remember things! \n\n If you want to know more and watch some tutorials, click the *Learn More* button.\n If you're already familiar with my functionality, click the *Create New Topic*.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Learn More 🎓', callback_data: '/info' },
            { text: 'Create New Topic 📝', callback_data: '/create' },
          ],
        ],
      },
      parse_mode: 'Markdown',
    },
  );
};

export default start;
