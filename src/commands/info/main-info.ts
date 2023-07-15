import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as MongoDB from '../../mongo-db/index.js';

const mainInfo = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  callbackQuery?: TelegramBot.CallbackQuery,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = callbackQuery ? callbackQuery.from.id : msg.from?.id;

  if (!userTelegramId) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot identify your telegram id.',
    );
    return;
  }

  const user = await MongoDB.Models.UserModel.findOne(
    { telegramId: userTelegramId },
    'lng',
  );

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  const inlineKeyboard = [
    [
      {
        text: i18next.t('info.main.leitner_btn', { lng: user.lng }),
        callback_data: `/additional-info?subject=leitner`,
      },
    ],
    [
      {
        text: i18next.t('info.main.chapters_btn', { lng: user.lng }),
        callback_data: `/additional-info?subject=chapters`,
      },
    ],
    [
      {
        text: i18next.t('info.main.author_btn', { lng: user.lng }),
        callback_data: `/additional-info?subject=author`,
      },
    ],
  ];

  if (callbackQuery) {
    await bot.editMessageText(i18next.t('info.main.text', { lng: user.lng }), {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
      parse_mode: 'Markdown',
    });
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('info.main.text', { lng: user.lng }),
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
        parse_mode: 'Markdown',
      },
    );
  }
};

export default mainInfo;
