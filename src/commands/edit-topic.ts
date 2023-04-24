import TelegramBot from 'node-telegram-bot-api';
import * as D from '../duck/index.js'

const editTopic = async (
  msg: TelegramBot.Message,
  bot: TelegramBot,
  topicId: string,
  editableField: D.types.editableFields,
) => {
  const chatId = msg.chat.id;

    const topic = D.constants.DATABASE.topics.find(
        (topic) => topic.id === topicId,
    );

    if (!topic) {
        await bot.sendMessage(chatId, 'Invalid topic. Please try again.');
        return;
    }

    const msgResponse = await bot.sendMessage(
        chatId,
        `Please provide new ${editableField}:`,
        {
            reply_markup: {
                force_reply: true,
                input_field_placeholder: editableField.charAt(0).toUpperCase() + editableField.slice(1),
            },
        },
    );

    const reply = await new Promise<TelegramBot.Message>((resolve) => {
        bot.onReplyToMessage(chatId, msgResponse.message_id, (msg) => {
            resolve(msg);
        });
    });

    const updatedField = reply.text;

    if (updatedField) {
        topic[editableField] = updatedField;
        await bot.sendMessage(chatId, `Congrats! The topic's ${editableField} was updated.`);
    } else {
        await bot.sendMessage(chatId, 'Failed to update the topic. Please try again.');
    }
};

export default editTopic;
