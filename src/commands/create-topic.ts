import TelegramBot from 'node-telegram-bot-api';
import { v4 as uuidv4 } from 'uuid';
import * as D from '../duck/index.js';

const createTopic = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  callbackQueryFromId?: number,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = callbackQueryFromId || msg.from?.id;

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

  const newTopic: D.types.ITopic = {
    id: uuidv4(),
    title: '',
    description: '',
    repeatDate: D.utils.calculateReviewDate(2),
  };

  const topicMsgResponse = await bot.sendMessage(
    chatId,
    'Please provide a new topic title:',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Title',
      },
    },
  );

  const titleReply = await new Promise<TelegramBot.Message>((resolve) => {
    bot.onReplyToMessage(chatId, topicMsgResponse.message_id, async (msg) => {
      resolve(msg);
    });
  });

  if (titleReply.text) {
    newTopic.title = titleReply.text;
  } else {
    await bot.sendMessage(chatId, 'Invalid title. Please try again.');
    return;
  }

  const descriptionMsgResponse = await bot.sendMessage(
    chatId,
    'Please provide a new topic description:',
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
    newTopic.description = descriptionReply.text;
    user.topics.push(newTopic);

    await bot.sendMessage(chatId, 'Congrats! The topic was created.');
  } else {
    await bot.sendMessage(chatId, 'Invalid description. Please try again.');
  }
};

export default createTopic;
