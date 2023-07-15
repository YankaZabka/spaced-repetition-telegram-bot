import TelegramBot from 'node-telegram-bot-api';
import * as MongoDB from '../mongo-db/index.js';

const myChatMemberHandler = async (
  chatMember: TelegramBot.ChatMemberUpdated,
) => {
  if (chatMember.new_chat_member.status === 'kicked' && chatMember.from.id) {
    try {
      await MongoDB.Models.UserModel.deleteOne({
        telegramId: chatMember.from.id,
      });
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error when deleting a user: ', error);
    }
  }
};

export default myChatMemberHandler;
