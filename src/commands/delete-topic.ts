import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const deleteTopic = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  topicId: string,
  callbackQueryFromId?: number,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = callbackQueryFromId || msg.from?.id;

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
  await bot.sendMessage(chatId, 'Topic was deleted.');
};

export default deleteTopic;
