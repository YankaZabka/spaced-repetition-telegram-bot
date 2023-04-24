import TelegramBot from 'node-telegram-bot-api';
import { v4 as uuidv4 } from 'uuid';
import * as D from '../duck/index.js';

const createTopic = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;

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

  const newTopicId = uuidv4();
  const title = titleReply.text;

  if (!title) {
    await bot.sendMessage(chatId, 'Invalid title. Please try again.');
    return;
  }

  D.constants.DATABASE.topics.push({
    id: newTopicId,
    title: title,
  });

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

  const description = descriptionReply.text;
  const newTopic = D.constants.DATABASE.topics.find(
    (topic) => topic.id === newTopicId,
  );

  if (!description) {
    await bot.sendMessage(chatId, 'Invalid description. Please try again.');
    return;
  }

  if (newTopic) {
    newTopic.description = description;
    await bot.sendMessage(chatId, 'Congrats! The topic was created.');
  } else {
    await bot.sendMessage(
      chatId,
      'Failed to create the topic. Please try again.',
    );
  }
};

export default createTopic;
