import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as MongoDB from '../../mongo-db/index.js';

const topicList = async (
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

  if (user.topics.length === 0) {
    await bot.sendMessage(
      chatId,
      i18next.t('topics_list.error', { lng: user.lng }),
    );
    return;
  }

  const inlineKeyboard = user.topics.map((topic) => [
    { text: topic.title, callback_data: `/show?tId=${topic.id}` },
  ]);

  if (callbackQuery) {
    await bot.editMessageText(
      i18next.t('topics_list.message', { lng: user.lng }),
      {
        chat_id: chatId,
        message_id: callbackQuery.message?.message_id,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      },
    );
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('topics_list.message', { lng: user.lng }),
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      },
    );
  }
};

export default topicList;
