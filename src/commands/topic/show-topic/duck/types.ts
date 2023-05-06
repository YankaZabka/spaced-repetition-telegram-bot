import TelegramBot from 'node-telegram-bot-api';

export interface Props {
  msg: TelegramBot.Message;
  bot: TelegramBot;
  topicId: string;
  callbackQueryId: string;
  callbackQueryFromId?: number;
}
