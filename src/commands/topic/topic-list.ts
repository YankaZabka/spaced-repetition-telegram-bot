import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

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

  const user = D.utils.findDBUserById(userTelegramId);

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  if (user.topics.length === 0) {
    await bot.sendMessage(chatId, 'There is no topic.');
    return;
  }

  const inlineKeyboard = user.topics.map((topic) => [
    { text: topic.title, callback_data: `/show?tId=${topic.id}` },
  ]);

  if (callbackQuery) {
    await bot.editMessageText(
      'There is list of all topic that you created.\\nClick on the topic you want to see information about.',
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
      'There is list of all topic that you created.\nClick on the topic you want to see information about.',
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      },
    );
  }
};

export default topicList;
