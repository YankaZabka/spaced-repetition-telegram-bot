import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js';

const deleteTopic = async (
    msg: TelegramBot.Message,
    bot: TelegramBot,
    topicId: string,
) => {
    const chatId = msg.chat.id;

    const topic = D.constants.DATABASE.topics.find(
        (topic) => topic.id === topicId,
    );

    if (topic) {
        D.constants.DATABASE.topics = D.constants.DATABASE.topics.filter(
            (topic) => topic.id !== topicId,
        );
        await bot.sendMessage(chatId, 'Topic was deleted.');
    } else {
        await bot.sendMessage(chatId, 'Failed to delete the topic. Please try again.');
    }
};

export default deleteTopic;
