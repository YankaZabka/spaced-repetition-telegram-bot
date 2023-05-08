import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';

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
    await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
    return;
  }

  const chapter = topic.chapters?.find((chapter) => chapter.id === chapterId);

  if (!chapter) {
    await bot.sendMessage(chatId, 'Invalid chapter. Please try again.');
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
    chapter[formattedEditableField] = updatedField;
    await bot.sendMessage(
      chatId,
      `Congrats! The chapter's ${formattedEditableField} was updated.`,
    );
  } else {
    await bot.sendMessage(
      chatId,
      'Failed to update the chapter. Please try again.',
    );
  }
};

export default editChapter;
