import * as D from '../../../duck/index.js';
import * as LD from './duck/index.js';

const showTopic = async ({
  topicId,
  callbackQueryId,
  msg,
  bot,
  callbackQueryFromId,
}: LD.types.Props) => {
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
    await bot.answerCallbackQuery(callbackQueryId, {
      text: 'Invalid topic. Please try again.',
    });
    return;
  }

  await bot.answerCallbackQuery(callbackQueryId, {
    text: 'Welcome to the View Topic Section!',
  });

  await bot.sendMessage(
    chatId,
    `Title: ${topic.title}.
    \nDescription: ${topic.description}.
    \nRepeat date: ${D.dayjs(topic.repeatDate).format('YYYY-MM-DD HH:mm')}.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Chapters 📝', callback_data: `/chapter-list/${topic.id}` },
            {
              text: 'Add chapter ➕',
              callback_data: `/create-chapter/${topic.id}`,
            },
          ],
          [
            { text: 'Edit title', callback_data: `/edit/${topic.id}/title` },
            {
              text: 'Edit description',
              callback_data: `/edit/${topic.id}/description`,
            },
          ],
          [{ text: 'Delete topic', callback_data: `/delete/${topic.id}` }],
        ],
      },
    },
  );
};

export default showTopic;
