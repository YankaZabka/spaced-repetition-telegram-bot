import * as D from '../../duck/index.js';
import * as LD from './duck/index.js';
import i18next from 'i18next';

const fail = async ({
  bot,
  topicId,
  chapterId,
  callbackQuery,
  forceFailOptions,
}: LD.types.IProps) => {
  const chatId = forceFailOptions
    ? forceFailOptions.chatId
    : (callbackQuery?.message?.chat.id as number);
  const userId = forceFailOptions
    ? forceFailOptions.userId
    : callbackQuery?.from.id;

  if (!userId) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  const user = D.utils.findDBUserById(userId);

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
      chapter.repeatDate = D.utils.calculateReviewDate(
        forceFailOptions
          ? D.dayjs().unix()
          : (callbackQuery?.message?.date as number),
        1,
      );
      chapter.isWaitingForRepeat = false;
      break;
    case 2:
      chapter.leitnerBox = 1;
      chapter.repeatDate = D.utils.calculateReviewDate(
        forceFailOptions
          ? D.dayjs().unix()
          : (callbackQuery?.message?.date as number),
        1,
      );
      chapter.isWaitingForRepeat = false;
      break;
    case 3:
      chapter.leitnerBox = 2;
      chapter.repeatDate = D.utils.calculateReviewDate(
        forceFailOptions
          ? D.dayjs().unix()
          : (callbackQuery?.message?.date as number),
        2,
      );
      chapter.isWaitingForRepeat = false;
  }

  await bot.sendMessage(chatId, 'Chapter repetition was failed.');
};

export default fail;
