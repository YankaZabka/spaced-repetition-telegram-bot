import TelegramBot from 'node-telegram-bot-api';

export interface Props {
  message: TelegramBot.Message;
  bot: TelegramBot;
  topicId: string;
  callbackQueryId?: string;
}
