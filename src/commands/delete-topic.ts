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
        const topicIndex = D.constants.DATABASE.topics.findIndex(
            (topic) => topic.id === topicId,
        );
        delete D.constants.DATABASE.topics[topicIndex]
        await bot.sendMessage(chatId, 'Topic was deleted.');
    } else {
        await bot.sendMessage(chatId, 'Failed to delete the topic. Please try again.');
    }
};

export default deleteTopic;
