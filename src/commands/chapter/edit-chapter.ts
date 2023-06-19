import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import i18next from 'i18next';

const editChapter = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
  chapterId: string,
  editableField: D.types.editableFields,
) => {
  const { message } = callbackQuery as {
    message: TelegramBot.Message;
  };
  const chatId = message.chat.id;
  const userTelegramId = callbackQuery.from.id;
  const formattedEditableField =
    editableField === 't' ? 'title' : 'description';

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

  if (editableField === null) {
    await bot.editMessageReplyMarkup(
      {
        inline_keyboard: [
          [
            {
              text: i18next.t('edit_chapter.edit_title_btn', { lng: user.lng }),
              callback_data: `/edit-chapter?tId=${topic.id}&cId=${chapter.id}&ef=t`,
            },
            {
              text: i18next.t('edit_chapter.edit_description_btn', {
                lng: user.lng,
              }),
              callback_data: `/edit-chapter?tId=${topic.id}&cId=${chapter.id}&ef=d`,
            },
          ],
          [
            {
              text: i18next.t('edit_chapter.back_chapter_btn', {
                lng: user.lng,
              }),
              callback_data: `/nav?path=show-chapter&tId=${topicId}&cId=${chapterId}`,
            },
          ],
        ],
      },
      {
        chat_id: chatId,
        message_id: callbackQuery.message?.message_id,
      },
    );

    return;
  }

  const msgResponse = await bot.sendMessage(
    chatId,
    i18next.t(`edit_chapter.prompt_${formattedEditableField}`, {
      lng: user.lng,
      field: i18next.t(`edit_chapter.${formattedEditableField}_field`, {
        lng: user.lng,
      }),
    }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder:
          i18next
            .t(`edit_chapter.${formattedEditableField}_field`, {
              lng: user.lng,
            })
            .charAt(0)
            .toUpperCase() +
          i18next
            .t(`edit_chapter.${formattedEditableField}_field`, {
              lng: user.lng,
            })
            .slice(1),
      },
    },
  );

  const reply = await new Promise<TelegramBot.Message>((resolve) => {
    bot.onReplyToMessage(chatId, msgResponse.message_id, (msg) => {
      resolve(msg);
    });
  });

  const updatedField = reply.text;

  if (updatedField) {
    chapter[formattedEditableField] = updatedField;
    await bot.sendMessage(
      chatId,
      i18next.t(`edit_chapter.success_${formattedEditableField}`, {
        lng: user.lng,
        field: i18next.t(`edit_chapter.${formattedEditableField}_field`, {
          lng: user.lng,
        }),
      }),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18next.t('edit_chapter.back_chapter_btn', {
                  lng: user.lng,
                }),
                callback_data: `/nav?path=show-chapter&tId=${topicId}&cId=${chapterId}`,
              },
              {
                text: i18next.t('edit_chapter.back_chapters_list_btn', {
                  lng: user.lng,
                }),
                callback_data: `/nav?path=chapter-list&tId=${topicId}`,
              },
            ],
          ],
        },
      },
    );
  } else {
    await bot.sendMessage(
      chatId,
      'Failed to update the chapter. Please try again.',
    );
  }
};

export default editChapter;
