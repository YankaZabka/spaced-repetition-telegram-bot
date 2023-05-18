import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

const chapterList = async (
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

  const user = D.utils.findDBUserById(userTelegramId);

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
    return;
  }

  if (!topic.chapters) {
    await bot.sendMessage(chatId, 'There is no chapters.');
    return;
  }

  const inlineKeyboard = topic.chapters.map((chapter) => [
    {
      text: chapter.title,
      callback_data: `/show-chapter?tId=${topic.id}&cId=${chapter.id}`,
    },
  ]);

  await bot.editMessageText(
    'There is list of all chapters that you created for this topic.\nClick on the chapter you want to see information about.',
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          ...inlineKeyboard,
          [
            {
              text: '« Back to Topic',
              callback_data: `/nav?path=show-topic&tId=${topic.id}`,
            },
          ],
        ],
      },
    },
  );
};

export default chapterList;
