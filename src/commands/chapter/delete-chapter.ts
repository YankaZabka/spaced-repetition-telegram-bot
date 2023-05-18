import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

const deleteChapter = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
  chapterId: string,
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

  const chapter = topic.chapters?.find((chapter) => chapter.id === chapterId);

  if (!chapter || !topic.chapters) {
    await bot.sendMessage(chatId, 'Invalid chapter. Please try again.');
    return;
  }

  topic.chapters = topic.chapters.filter((chapter) => chapter.id !== chapterId);
  await bot.editMessageText('Chapter was deleted.', {
    chat_id: chatId,
    message_id: callbackQuery.message?.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '« Back to Chapters List',
            callback_data: `/nav?path=chapter-list&tId=${topicId}`,
          },
        ],
      ],
    },
  });
};

export default deleteChapter;
