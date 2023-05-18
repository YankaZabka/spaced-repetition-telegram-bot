import * as D from '../../duck/index.js';
import TelegramBot from 'node-telegram-bot-api';

const showTopic = async (
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

  await bot.editMessageText(
    `Title: ${topic.title}.
    \nDescription: ${topic.description}.`,
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          topic.chapters
            ? [
                {
                  text: 'Chapters 📝',
                  callback_data: `/chapter-list?tId=${topic.id}`,
                },
                {
                  text: 'Add chapter ➕',
                  callback_data: `/create-chapter?tId=${topic.id}`,
                },
              ]
            : [
                {
                  text: 'Add chapter ➕',
                  callback_data: `/create-chapter?tId=${topic.id}`,
                },
              ],
          [
            {
              text: 'Edit ✏️',
              callback_data: `/edit?tId=${topic.id}`,
            },
            {
              text: 'Delete topic 🗑️',
              callback_data: `/delete?tId=${topic.id}`,
            },
          ],
          [
            {
              text: '« Back to Topics List',
              callback_data: `/nav?path=list`,
            },
          ],
        ],
      },
    },
  );
};

export default showTopic;
