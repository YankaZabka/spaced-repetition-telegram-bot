import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import * as MongoDB from '../../mongo-db/index.js';

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

  const user = await MongoDB.Models.UserModel.findOne({
    telegramId: userTelegramId,
  });

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  const newTopic: D.types.ITopic = {
    id: nanoid(5),
    title: '',
    description: '',
  };

  const titleMsgResponse = await bot.sendMessage(
    chatId,
    i18next.t('create_topic.title_prompt', { lng: user.lng }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: i18next.t('create_topic.title_placeholder', {
          lng: user.lng,
        }) as string,
      },
    },
  );

  const titleReply = await new Promise<TelegramBot.Message>((resolve) => {
    bot.onReplyToMessage(chatId, titleMsgResponse.message_id, async (msg) => {
      resolve(msg);
    });
  });

  if (titleReply.text) {
    newTopic.title = titleReply.text;
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('create_topic.errors.title', { lng: user.lng }),
    );
    return;
  }

  const descriptionMsgResponse = await bot.sendMessage(
    chatId,
    i18next.t('create_topic.description_prompt', { lng: user.lng }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: i18next.t(
          'create_topic.description_placeholder',
          { lng: user.lng },
        ) as string,
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

    user.topics = user.topics ? [newTopic, ...user.topics] : [newTopic];
    try {
      await user.save();
    } catch (error) {
      await bot.sendMessage(
        chatId,
        i18next.t('create_topic.errors.saving', { lng: user.lng }),
      );
    }

    await bot.sendMessage(
      chatId,
      i18next.t('create_topic.success', { lng: user.lng }),
    );
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('create_topic.errors.description', { lng: user.lng }),
    );
  }
};

export default createTopic;
