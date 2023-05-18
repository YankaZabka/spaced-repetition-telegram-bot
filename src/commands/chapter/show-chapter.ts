import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

const showChapter = async (
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

  if (!chapter) {
    await bot.sendMessage(chatId, 'Invalid chapter. Please try again.');
    return;
  }

  await bot.editMessageText(
    `Title: ${chapter.title}.
    \nDescription: ${chapter.description}.
    \nRepeat date: ${D.dayjs(chapter.repeatDate).format('YYYY-MM-DD HH:mm')}.`,
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Edit title',
              callback_data: `/edit-chapter?tId=${topic.id}&cId=${chapter.id}`,
            },
            {
              text: 'Edit description',
              callback_data: `/edit-chapter?tId=${topic.id}&cId=${chapter.id}`,
            },
          ],
          [
            {
              text: 'Delete chapter',
              callback_data: `/delete-chapter?tId=${topic.id}&cId=${chapter.id}`,
            },
          ],
          [
            {
              text: '« Back to Chapters List',
              callback_data: `/nav?path=chapter-list&tId=${topicId}`,
            },
          ],
        ],
      },
    },
  );
};

export default showChapter;
