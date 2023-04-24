import * as D from '../../duck/index.js';
import * as LD from './duck/index.js';

const showTopic = async ({
  topicId,
  callbackQueryId,
  message,
  bot,
}: LD.types.Props) => {
  const chatId = message.chat.id;

  const topic = D.constants.DATABASE.topics.find(
    (topic) => topic.id === topicId,
  );

  if (!topic) {
    if (callbackQueryId) {
      await bot.answerCallbackQuery(callbackQueryId, {
        text: 'Invalid topic. Please try again.',
      });
    }
    return;
  }

  if (callbackQueryId) {
    await bot.answerCallbackQuery(callbackQueryId, {
      text: 'Welcome to the View Topic Section!',
    });
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
