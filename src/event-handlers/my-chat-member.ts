import TelegramBot from 'node-telegram-bot-api';

const myChatMemberHandler = async (
    chatMember: TelegramBot.ChatMemberUpdated,
) => {
    if (chatMember.new_chat_member.status === 'kicked') {
        //     delete user from database
    }
};

export default myChatMemberHandler;
