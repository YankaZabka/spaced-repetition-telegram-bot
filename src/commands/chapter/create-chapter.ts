import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import { nanoid } from 'nanoid';

const createChapter = async (
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

  const newChapter: D.types.IChapter = {
    id: nanoid(5),
    topicId,
    title: '',
    description: '',
    repeatDate: '',
    leitnerBox: 1,
  };

  const titleMsgResponse = await bot.sendMessage(
    chatId,
    'Please provide a new chapter title:',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Title',
      },
    },
  );

  const titleReply = await new Promise<TelegramBot.Message>((resolve) => {
    bot.onReplyToMessage(chatId, titleMsgResponse.message_id, async (msg) => {
      resolve(msg);
    });
  });

  if (titleReply.text) {
    newChapter.title = titleReply.text;
  } else {
    await bot.sendMessage(chatId, 'Invalid title. Please try again.');
    return;
  }

  const descriptionMsgResponse = await bot.sendMessage(
    chatId,
    'Please provide a new chapter description:',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Description',
      },
    },
  );

  const descriptionReply = await new Promise<TelegramBot.Message>((resolve) => {
    bot.onReplyToMessage(
      chatId,
      descriptionMsgResponse.message_id,
      async (msg) => {
        resolve(msg);
      },
    );
  });

  if (descriptionReply.text) {
    newChapter.description = descriptionReply.text;
    newChapter.repeatDate = D.utils.calculateReviewDate(
      descriptionReply.date,
      1,
    );

    if (topic.chapters) {
      topic.chapters.push(newChapter);
    } else {
      topic.chapters = [newChapter];
    }

    await bot.sendMessage(
      chatId,
      'Congrats! The chapter was added. You will be notify for repetition on the next day.',
    );
  } else {
    await bot.sendMessage(chatId, 'Invalid description. Please try again.');
  }
};

export default createChapter;
