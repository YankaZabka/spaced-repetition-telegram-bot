import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import i18next from 'i18next';

const editTopic = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  topicId: string,
  editableField: D.types.editableFields | null,
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

  if (editableField === null) {
    await bot.editMessageReplyMarkup(
      {
        inline_keyboard: [
          [
            {
              text: i18next.t('edit_topic.edit_title_btn', { lng: user.lng }),
              callback_data: `/edit?tId=${topic.id}&ef=t`,
            },
            {
              text: i18next.t('edit_topic.edit_description_btn', {
                lng: user.lng,
              }),
              callback_data: `/edit?tId=${topic.id}&ef=d`,
            },
          ],
          [
            {
              text: i18next.t('edit_topic.back_topic_btn', { lng: user.lng }),
              callback_data: `/nav?path=show-topic&tId=${topic.id}`,
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
    i18next.t(`edit_topic.prompt_${formattedEditableField}`, {
      lng: user.lng,
      field: i18next.t(`edit_topic.${formattedEditableField}_field`, {
        lng: user.lng,
      }),
    }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder:
          i18next
            .t(`edit_topic.${formattedEditableField}_field`, {
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
    topic[formattedEditableField] = updatedField;
    await bot.sendMessage(
      chatId,
      i18next.t(`edit_topic.success_${formattedEditableField}`, {
        lng: user.lng,
        field: i18next.t(`edit_topic.${formattedEditableField}_field`, {
          lng: user.lng,
        }),
      }),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18next.t('edit_topic.back_topic_btn', { lng: user.lng }),
                callback_data: `/nav?path=show-topic&tId=${topic.id}`,
              },
              {
                text: i18next.t('edit_topic.back_topics_list_btn', {
                  lng: user.lng,
                }),
                callback_data: `/nav?path=list`,
              },
            ],
          ],
        },
      },
    );
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('edit_topic.error', { lng: user.lng }),
    );
  }
};

export default editTopic;
