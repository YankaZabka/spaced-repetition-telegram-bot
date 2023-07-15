import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';
import { HydratedDocument } from 'mongoose';
import i18next from 'i18next';

const repeat = async (
  user: HydratedDocument<D.types.IUser>,
  bot: TelegramBot,
  chapter: D.types.IChapter,
) => {
  chapter.isWaitingForRepeat = true;
  try {
    await user.save();
  } catch {
    await bot.sendMessage(
      user.chatId,
      i18next.t('repeat.saving_error', { lng: user.lng }),
    );
  }

  await bot.sendMessage(
    user.chatId,
    `${i18next.t('repeat.title', { lng: user.lng })}${
      chapter.title
    }.\n${i18next.t('repeat.description', { lng: user.lng })}${
      chapter.description
    }`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18next.t('repeat.complete', { lng: user.lng }),
              callback_data: `/complete?tId=${chapter.topicId}&cId=${chapter.id}`,
            },
          ],
          [
            {
              text: i18next.t('repeat.fail', { lng: user.lng }),
              callback_data: `/fail?tId=${chapter.topicId}&cId=${chapter.id}`,
            },
            {
              text: i18next.t('repeat.snooze', { lng: user.lng }),
              callback_data: `/snooze/${chapter.id}`,
            },
          ],
        ],
      },
    },
  );
};

export default repeat;
