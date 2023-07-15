import TelegramBot from 'node-telegram-bot-api';
import i18next from 'i18next';
import * as MongoDB from '../../mongo-db/index.js';

const additionalInfo = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  subject: string,
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

  const user = await MongoDB.Models.UserModel.findOne(
    { telegramId: userTelegramId },
    'lng',
  );

  if (!user) {
    await bot.sendMessage(
      chatId,
      'Something went wrong. I cannot find your data in database.',
    );
    return;
  }

  await bot.editMessageText(
    i18next.t(`info.${subject}.text`, { lng: user.lng }),
    {
      chat_id: chatId,
      message_id: callbackQuery.message?.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18next.t(`info.${subject}.back_btn`, { lng: user.lng }),
              callback_data: `/nav?path=info`,
            },
          ],
        ],
      },
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    },
  );
};

export default additionalInfo;
