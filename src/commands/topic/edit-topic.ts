import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

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
    await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
    return;
  }

  if (editableField === null) {
    await bot.editMessageReplyMarkup(
      {
        inline_keyboard: [
          [
            {
              text: 'Edit Title',
              callback_data: `/edit?tId=${topic.id}&ef=t`,
            },
            {
              text: 'Edit Description',
              callback_data: `/edit?tId=${topic.id}&ef=d`,
            },
          ],
          [
            {
              text: '« Back to Topic',
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
    `Please provide new ${formattedEditableField}:`,
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder:
          formattedEditableField.charAt(0).toUpperCase() +
          formattedEditableField.slice(1),
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
      `Congrats! The topic's ${formattedEditableField} was updated.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '« Back to Topic',
                callback_data: `/nav?path=show-topic&tId=${topic.id}`,
              },
              {
                text: '« Back to Topics List',
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
      'Failed to update the topic. Please try again.',
    );
  }
};

export default editTopic;
