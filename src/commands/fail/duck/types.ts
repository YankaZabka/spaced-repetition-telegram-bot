import TelegramBot from 'node-telegram-bot-api';

export interface IProps {
  bot: TelegramBot;
  topicId: string;
  chapterId: string;
  callbackQuery?: TelegramBot.CallbackQuery;
  forceFailOptions?: {
    chatId: number;
    userId: number;
  };
}
