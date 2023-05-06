import TelegramBot from 'node-telegram-bot-api';
import * as D from '../../../../duck/index.js';

export interface Props {
  msg: TelegramBot.Message;
  bot: TelegramBot;
  topicId: string;
  editableField: D.types.editableFields;
  callbackQueryFromId?: number;
}
