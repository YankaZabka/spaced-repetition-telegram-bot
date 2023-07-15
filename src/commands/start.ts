import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as D from '../duck/index.js';
import * as MongoDB from '../mongo-db/index.js';

const start = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  callbackQueryFromId?: number,
  lng?: string,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = callbackQueryFromId || msg.from?.id;

  if (!userTelegramId) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot identify your telegram id.',
    );
    return;
  }

  const isUserExist = await MongoDB.Models.UserModel.exists({
    telegramId: userTelegramId,
  });

  if (isUserExist === null) {
    if (!lng) {
      await bot.sendMessage(
        chatId,
        `🌎 Choose a language.\n (You can change it in *profile* later)`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🇷🇺 Русский',
                  callback_data: `/lang?lng=ru`,
                },
                {
                  text: '🇬🇧 English',
                  callback_data: `/lang?lng=en`,
                },
              ],
            ],
          },
          parse_mode: 'Markdown',
        },
      );
      return;
    }

    await bot.deleteMessage(chatId, msg.message_id);
    try {
      const newUser = new MongoDB.Models.UserModel({
        chatId,
        telegramId: userTelegramId,
        signUpDate: D.dayjs.unix(msg.date).format(),
        lng,
      });
      await newUser.save();
      // eslint-disable-next-line
    } catch (error: any) {
      await bot.sendMessage(
        chatId,
        `An error occurred when saving a new user: ${error.message || null}`,
      );
      return;
    }
  }

  const user = await MongoDB.Models.UserModel.findOne(
    {
      telegramId: userTelegramId,
    },
    'lng',
  );

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  await bot.sendMessage(chatId, i18next.t('start.text', { lng: user.lng }), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: i18next.t('start.info_button', { lng: user.lng }),
            callback_data: '/info',
          },
          {
            text: i18next.t('start.create_button', { lng: user.lng }),
            callback_data: '/create',
          },
        ],
      ],
    },
    parse_mode: 'Markdown',
  });
};

export default start;
