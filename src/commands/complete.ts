import * as D from '../duck/index.js';
import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';

const complete = async (
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
    await bot.sendMessage(chatId, i18next.t('errors.topic', { lng: user.lng }));
    return;
  }

  const chapter = topic.chapters?.find((chapter) => chapter.id === chapterId);

  if (!chapter || !topic.chapters) {
    await bot.sendMessage(
      chatId,
      i18next.t('errors.chapter', { lng: user.lng }),
    );
    return;
  }

  switch (chapter.leitnerBox) {
    case 1:
      chapter.leitnerBox = 2;
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 2);
      chapter.isWaitingForRepeat = false;
      break;
    case 2:
      chapter.leitnerBox = 3;
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 7);
      chapter.isWaitingForRepeat = false;
      break;
    case 3:
      chapter.repeatDate = D.utils.calculateReviewDate(message.date, 7);
      chapter.isWaitingForRepeat = false;
  }

  await bot.sendMessage(chatId, 'Chapter was successfully repeated!');
};

export default complete;
