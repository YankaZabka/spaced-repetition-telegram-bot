import TelegramBot from "node-telegram-bot-api"

const start = async (msg: TelegramBot.Message, bot: TelegramBot) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
        chatId,
        "Hi! 👋 I am a telegram bot that uses a spaced repetition algorithm to help you learn and remember things! \n\n If you want to know more and watch some tutorials, click the *Learn More* button.\n If you're already familiar with my functionality, click the *Create New Topic*.",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Learn More 🎓', callback_data: '/info' },
                        { text: 'Create New Topic 📝', callback_data: '/create' },
                    ],
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
            parse_mode: 'Markdown',
        },
    );
}

export default start