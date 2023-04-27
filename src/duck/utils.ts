import dayjs from 'dayjs';
import * as D from './index.js';

export const calculateReviewDate = (period: number) =>
  dayjs().add(period, 'day').format();

export const findDBUserById = (userTelegramId: number) =>
  D.constants.DATABASE.users.find((user) => user.telegramId === userTelegramId);
