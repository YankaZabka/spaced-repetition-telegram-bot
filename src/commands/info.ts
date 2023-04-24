import TelegramBot from "node-telegram-bot-api"

const info = async (msg: TelegramBot.Message, bot: TelegramBot) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, 'Welcome to the Info section!');
}

export default info