import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

const chapterList = async (
  topicId: string,
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const { message } = callbackQuery;
  if (!message) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Something went wrong.',
    });
    return;
  }
  const chatId = message.chat.id;

  const userTelegramId = callbackQuery.from.id;

  if (!userTelegramId) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Something went wrong. I cannot identify your telegram id.',
    });
    return;
  }

  const user = D.utils.findDBUserById(userTelegramId);

  if (!user) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Something went wrong. I cannot find your data in database.',
    });
    return;
  }

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Invalid topic. Please try again.',
    });
    return;
  }

  if (!topic.chapters) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'There is no chapters.',
    });
    return;
  }

  const inlineKeyboard = topic.chapters.map((chapter) => [
    {
      text: chapter.title,
      callback_data: `/show-chapter?topicId=${topic.id}&chapterId=${chapter.id}`,
    },
  ]);

  await bot.answerCallbackQuery(callbackQuery.id, {
    text: 'Welcome to the Chapters list!',
  });
  await bot.sendMessage(
    chatId,
    'There is list of all chapters that you created for this topic.\nClick on the chapter you want to see information about.',
    {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
        resize_keyboard: true,
      },
    },
  );
};

export default chapterList;
