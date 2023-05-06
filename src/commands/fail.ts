import * as D from '../duck/index.js';
import TelegramBot from 'node-telegram-bot-api';

const fail = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
  chapterId: string,
) => {
  const { message } = callbackQuery as {
    message: TelegramBot.Message;
  };
  const chatId = message.chat.id;

  const user = D.utils.findDBUserById(callbackQuery.from.id);

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

  const chapter = topic.chapters?.find((chapter) => chapter.id === chapterId);

  if (!chapter || !topic.chapters) {
    await bot.sendMessage(chatId, 'Invalid chapter. Please try again.');
    return;
  }

  switch (chapter.leitnerBox) {
    case 1:
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 1);
      break;
    case 2:
      chapter.leitnerBox = 1;
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 1);
      break;
    case 3:
      chapter.leitnerBox = 2;
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 2);
  }

  await bot.sendMessage(chatId, 'Chapter repetition was failed.');
};

export default fail;
