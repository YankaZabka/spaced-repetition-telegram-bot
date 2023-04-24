import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const list = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;

  if (D.constants.DATABASE.topics.length === 0) {
      await bot.sendMessage(chatId, 'There is no topic.');
      return;
  }

  const inlineKeyboard = D.constants.DATABASE.topics.map((topic) => [
    { text: topic.title, callback_data: `/show/${topic.id}` },
  ]);

  await bot.sendMessage(
    chatId,
    'There is list of all topic that you created.\nClick on the topic you want to see information about.',
    {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
        resize_keyboard: true,
      },
    },
  );
};

export default list;
