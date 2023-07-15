import * as D from './index.js';
import TelegramBot from 'node-telegram-bot-api';
import * as Commands from '../commands/index.js';
import * as MongoDB from '../mongo-db/index.js';

export const calculateReviewDate = (msgDate: number, period: number) =>
  D.dayjs.unix(msgDate).add(period, 'day').format();

export const checkForRepeats = async (bot: TelegramBot) => {
  const users = await MongoDB.Models.UserModel.find({});
  if (!users || users?.length === 0) {
    return;
  }

  users.forEach((user) => {
    user.topics?.forEach((topic) => {
      topic.chapters?.forEach((chapter) => {
        const currentDate = D.dayjs();
        const repeatDate = D.dayjs(chapter.repeatDate);

        if (chapter.isWaitingForRepeat) {
          const fiveHoursAgo = currentDate.subtract(5, 'hour');
          const isRepeatWasFiveHoursBefore = repeatDate.isBefore(fiveHoursAgo);
          if (isRepeatWasFiveHoursBefore) {
            Commands.fail({
              bot,
              topicId: topic.id,
              chapterId: chapter.id,
              forceFailOptions: {
                chatId: user.chatId,
                userId: user.telegramId,
              },
            });
          }
          return;
        }

        const isSameOrBefore = repeatDate.isSameOrBefore(currentDate, 'hour');
        if (isSameOrBefore) {
          Commands.repeat(user, bot, chapter);
        }
      });
    });
  });
};

export const getQueryParams = (query: string) => {
  const paramsString = query.split('?')[1];
  if (paramsString) {
    const paramsArray = paramsString.split('&').map((item) => {
      const [param, value] = item.split('=');
      return {
        [param]: value,
      };
    });
    return Object.assign({}, ...paramsArray);
  }
  return null;
};

export const navigate = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const { path } = D.utils.getQueryParams(callbackQuery.data as string);
  const { message } = callbackQuery as {
    message: TelegramBot.Message;
  };

  switch (path) {
    case 'list':
      await Commands.Topic.topicList(message, bot, callbackQuery);
      break;
    case 'info':
      await Commands.Info.mainInfo(message, bot, callbackQuery);
      break;
    case 'show-topic':
      await Commands.Topic.showTopic(
        bot,
        callbackQuery,
        D.utils.getQueryParams(callbackQuery.data as string).tId,
      );
      break;
    case 'show-chapter':
      await Commands.Chapter.showChapter(
        bot,
        callbackQuery,
        D.utils.getQueryParams(callbackQuery.data as string).tId,
        D.utils.getQueryParams(callbackQuery.data as string).cId,
      );
      break;
    case 'chapter-list':
      await Commands.Chapter.chapterList(
        bot,
        callbackQuery,
        D.utils.getQueryParams(callbackQuery.data as string).tId,
      );
      break;
    case 'profile':
      await Commands.profile(message, bot, callbackQuery);
      break;
  }
};

// eslint-disable-next-line
export const errorWrapper = async (callback: any, message: string) => {
  try {
    await callback();
  } catch (error) {
    // eslint-disable-next-line
    console.error(message, error);
  }
};

// eslint-disable-next-line
export const syncErrorWrapper = (callback: any, message: string) => {
  try {
    callback();
  } catch (error) {
    // eslint-disable-next-line
    console.error(message, error);
  }
};
