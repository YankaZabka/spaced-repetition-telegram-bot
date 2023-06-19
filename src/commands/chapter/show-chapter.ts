import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import i18next from 'i18next';

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
    await bot.sendMessage(chatId, i18next.t('errors.topic', { lng: user.lng }));
    return;
  }

  const chapter = topic.chapters?.find((chapter) => chapter.id === chapterId);

  if (!chapter) {
    await bot.sendMessage(
      chatId,
      i18next.t('errors.chapter', { lng: user.lng }),
    );
    return;
  }

  await bot.editMessageText(
    `*${chapter.title}*\n\n${chapter.description}\n\n${i18next.t(
      'show_chapter.repeat_date_text',
      { lng: user.lng },
    )} ${D.dayjs(chapter.repeatDate).format('YYYY-MM-DD HH:mm')}.`,
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18next.t('show_chapter.edit_btn', { lng: user.lng }),
              callback_data: `/edit-chapter?tId=${topic.id}&cId=${chapter.id}`,
            },
            {
              text: i18next.t('show_chapter.delete_btn', { lng: user.lng }),
              callback_data: `/delete-chapter?tId=${topic.id}&cId=${chapter.id}`,
            },
          ],
          [
            {
              text: i18next.t('show_chapter.back_btn', { lng: user.lng }),
              callback_data: `/nav?path=chapter-list&tId=${topicId}`,
            },
          ],
        ],
      },
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    },
  );
};

export default showChapter;
