import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as D from '../duck/index.js';
import * as MongoDB from '../mongo-db/index.js';

const profile = async (
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

  const user = await MongoDB.Models.UserModel.findOne({
    telegramId: userTelegramId,
  });

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  if (callbackQuery) {
    try {
      user.lng = user.lng === 'ru' ? 'en' : 'ru';
      await user.save();
    } catch {
      await bot.sendMessage(
        chatId,
        i18next.t('profile.saving_error', { lng: user.lng }),
      );
      return;
    }
    await bot.editMessageText(
      i18next.t('profile.lng_changed_message', { lng: user.lng }),
      {
        chat_id: chatId,
        message_id: callbackQuery.message?.message_id,
        parse_mode: 'Markdown',
      },
    );
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('profile.message', {
        date: D.dayjs(user.signUpDate).format(
          i18next.t('date_format', { lng: user.lng }) as string,
        ),
        lng: user.lng,
        language: user.lng === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English',
      }),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18next.t('profile.switch_lng_btn', {
                  lng: user.lng,
                  language: user.lng === 'ru' ? '🇬🇧 English' : '🇷🇺 Русский',
                }),
                callback_data: `/nav?path=profile`,
              },
            ],
          ],
        },
        parse_mode: 'Markdown',
      },
    );
  }
};

export default profile;
