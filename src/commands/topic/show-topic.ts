import * as D from '../../duck/index.js';
import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';

const showTopic = async (
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
    await bot.sendMessage(chatId, i18next.t('errors.topic', { lng: user.lng }));
    return;
  }

  await bot.editMessageText(`*${topic.title}*\n\n${topic.description}`, {
    chat_id: chatId,
    message_id: callbackQuery.message?.message_id,
    reply_markup: {
      inline_keyboard: [
        topic.chapters?.length
          ? [
              {
                text: i18next.t('show_topic.chapters_btn', { lng: user.lng }),
                callback_data: `/chapter-list?tId=${topic.id}`,
              },
              {
                text: i18next.t('show_topic.add_chapter_btn', {
                  lng: user.lng,
                }),
                callback_data: `/create-chapter?tId=${topic.id}`,
              },
            ]
          : [
              {
                text: i18next.t('show_topic.add_chapter_btn', {
                  lng: user.lng,
                }),
                callback_data: `/create-chapter?tId=${topic.id}`,
              },
            ],
        [
          {
            text: i18next.t('show_topic.edit_btn', { lng: user.lng }),
            callback_data: `/edit?tId=${topic.id}`,
          },
          {
            text: i18next.t('show_topic.delete_btn', { lng: user.lng }),
            callback_data: `/delete?tId=${topic.id}`,
          },
        ],
        [
          {
            text: i18next.t('show_topic.back_btn', { lng: user.lng }),
            callback_data: `/nav?path=list`,
          },
        ],
      ],
    },
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  });
};

export default showTopic;
