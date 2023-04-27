import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const repeat = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  topicId: string,
) => {
  const chatId = msg.chat.id;
  const userTelegramId = msg.from?.id;

  if (!userTelegramId) {
    await bot.sendMessage(
      chatId,
      'Cannot notify about repetition: there is no telegram id.',
    );
    return;
  }

  const user = D.utils.findDBUserById(userTelegramId);

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Cannot notify about repetition: cannot find your data in database.',
    );
    return;
  }

  const topic = user.topics.find((topic) => topic.id === topicId);

  if (!topic) {
    await bot.sendMessage(
      chatId,
      'Cannot notify about repetition: invalid topic.',
    );
    return;
  }

  await bot.sendMessage(
    chatId,
    `Title: ${topic.title}.\nDescription: ${topic.description}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Complete' },
            {
              text: 'Fail',
            },
          ],
          [
            { text: 'Snooze' },
            {
              text: 'Info',
            },
          ],
          [
            { text: 'Progress' },
            {
              text: 'Supplement topic',
            },
          ],
        ],
      },
    },
  );
};

export default repeat;
