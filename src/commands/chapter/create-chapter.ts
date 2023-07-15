import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../duck/index.js';
import { nanoid } from 'nanoid';
import i18next from 'i18next';
import * as MongoDB from '../../mongo-db/index.js';

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

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.sendMessage(chatId, i18next.t('errors.topic', { lng: user.lng }));
    return;
  }

  const newChapter: D.types.IChapter = {
    id: nanoid(5),
    topicId,
    title: '',
    description: '',
    repeatDate: '',
    leitnerBox: 1,
    isWaitingForRepeat: false,
  };

  const titleMsgResponse = await bot.sendMessage(
    chatId,
    i18next.t('create_chapter.title_prompt', { lng: user.lng }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: i18next.t('create_chapter.title_placeholder', {
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
    newChapter.title = titleReply.text;
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('create_chapter.errors.title', { lng: user.lng }),
    );
    return;
  }

  const descriptionMsgResponse = await bot.sendMessage(
    chatId,
    i18next.t('create_chapter.description_prompt', { lng: user.lng }),
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: i18next.t('create_chapter.title_placeholder', {
          lng: user.lng,
        }) as string,
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

    try {
      await user.save();
    } catch {
      await bot.sendMessage(
        chatId,
        i18next.t('create_chapter.errors.saving', { lng: user.lng }),
      );
      return;
    }

    await bot.sendMessage(
      chatId,
      i18next.t('create_chapter.success', { lng: user.lng }),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18next.t('create_chapter.back_btn', { lng: user.lng }),
                callback_data: `/nav?path=show-topic&tId=${topic.id}`,
              },
            ],
          ],
        },
      },
    );
  } else {
    await bot.sendMessage(
      chatId,
      i18next.t('create_chapter.errors.description', { lng: user.lng }),
    );
  }
};

export default createChapter;
