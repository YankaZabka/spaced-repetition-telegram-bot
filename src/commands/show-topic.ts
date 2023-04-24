import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const showTopic = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  topicId: string,
) => {
  const chatId = msg.chat.id;

  const topic = D.constants.DATABASE.topics.find(
    (topic) => topic.id === topicId,
  );

  if (!topic) {
    await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
    return;
  }

  await bot.sendMessage(
    chatId,
    `Title: ${topic.title}.\nDescription: ${topic.description}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Edit title', callback_data: `/edit/${topic.id}/title` },
            {
              text: 'Edit description',
              callback_data: `/edit/${topic.id}/description`,
            },
          ],
            [{text: "Delete topic", callback_data: `/delete/${topic.id}`}]
        ],
      },
    },
  );
};

export default showTopic;
