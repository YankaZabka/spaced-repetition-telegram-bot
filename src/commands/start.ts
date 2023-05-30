import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as D from '../duck/index.js';

const start = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  callbackQueryFromId?: number,
  lng?: string,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = callbackQueryFromId || msg.from?.id;

  if (!msg.from?.id) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot identify your telegram id.',
    );
    return;
  }

  if (
    D.constants.DATABASE.users.findIndex(
      (user) => user.telegramId === userTelegramId,
    ) === -1
  ) {
    if (!lng) {
      await bot.sendMessage(chatId, `🌎 Choose a language:`, {
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
      });
      return;
    }

    await bot.deleteMessage(chatId, msg.message_id);
    D.constants.DATABASE.users.push({
      chatId,
      telegramId: msg.from.id,
      topics: [],
      lng,
    });
  }

  await bot.sendMessage(chatId, i18next.t('start.text', { lng }), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: i18next.t('start.info_button', { lng }),
            callback_data: '/info',
          },
          {
            text: i18next.t('start.create_button', { lng }),
            callback_data: '/create',
          },
        ],
      ],
    },
    parse_mode: 'Markdown',
  });
};

export default start;
