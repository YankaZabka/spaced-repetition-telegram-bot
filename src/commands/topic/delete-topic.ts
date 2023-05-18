import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

const deleteTopic = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
) => {
  const { message } = callbackQuery as {
    message: TelegramBot.Message;
  };
  const chatId = message.chat.id;
  const userTelegramId = callbackQuery.from.id;

  if (!userTelegramId) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot identify your telegram id.',
    );
    return;
  }

  const user = D.utils.findDBUserById(userTelegramId);

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
    return;
  }

  user.topics = user.topics.filter((topic) => topic.id !== topicId);
  await bot.editMessageText('Topic was deleted.', {
    chat_id: chatId,
    message_id: callbackQuery.message?.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '« Back to Topics List',
            callback_data: `/nav?path=list`,
          },
        ],
      ],
    },
  });
};

export default deleteTopic;
