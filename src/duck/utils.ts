import * as D from './index.js';
import TelegramBot from 'node-telegram-bot-api';
import * as Commands from '../commands/index.js';

export const calculateReviewDate = (msgDate: number, period: number) =>
  D.dayjs.unix(msgDate).add(period, 'day').format();

export const findDBUserById = (userTelegramId: number) =>
  D.constants.DATABASE.users.find((user) => user.telegramId === userTelegramId);

export const checkForRepeats = (bot: TelegramBot) => {
  D.constants.DATABASE.users.forEach((user) => {
    user.topics.forEach((topic) => {
      const currentDate = D.dayjs();
      const repeatDate = D.dayjs(topic.repeatDate);
      const isSameOrBefore = repeatDate.isSameOrBefore(currentDate, 'hour');
      if (isSameOrBefore) {
        Commands.repeat(user.chatId, bot, topic).then(() => {
          // do nothing.
        });
      }
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
