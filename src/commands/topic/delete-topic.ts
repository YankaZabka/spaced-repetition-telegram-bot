import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as MongoDB from '../../mongo-db/index.js';

const deleteTopic = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
) => {
  const { message } = callbackQuery as {
    message: TelegramBot.Message;
  };
  const chatId = message.chat.id;
  const userTelegramId = callbackQuery.from.id;

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

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.sendMessage(chatId, i18next.t('errors.topic', { lng: user.lng }));
    return;
  }

  user.topics = user.topics.filter((topic) => topic.id !== topicId);

  try {
    await user.save();
  } catch {
    await bot.sendMessage(
      chatId,
      i18next.t('delete_topic.saving_error', { lng: user.lng }),
    );
    return;
  }

  await bot.editMessageText(
    i18next.t('delete_topic.success', { lng: user.lng }),
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18next.t('delete_topic.back_btn', { lng: user.lng }),
              callback_data: `/nav?path=list`,
            },
          ],
        ],
      },
    },
  );
};

export default deleteTopic;
