import TelegramBot from 'node-telegram-bot-api';
import * as Commands from '../commands/index.js';
import * as D from '../duck/index.js';

const callbackQueryHandler = async (
  callbackQuery: TelegramBot.CallbackQuery,
  bot: TelegramBot,
) => {
  if (!callbackQuery.message) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Something went wrong. Probably you are using too old message.',
    });
    return;
  }

  if (callbackQuery.data === '/info') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Info Section',
    });
    await Commands.info(callbackQuery.message, bot);
    return;
  }

  if (callbackQuery.data === '/create') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Create Topic Section',
    });
    await Commands.Topic.createTopic(
      callbackQuery.message,
      bot,
      callbackQuery.from.id,
    );
    return;
  }

  if (callbackQuery.data?.startsWith('/show')) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Show Topic Section',
    });
    const { topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Topic.showTopic(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/edit')) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Edit Topic Section',
    });
    const { topicId, field: editableField } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.Topic.editTopic(bot, callbackQuery, topicId, editableField);
    return;
  }

  if (callbackQuery.data?.startsWith('/delete')) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Delete Topic Section',
    });
    const { topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Topic.deleteTopic(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/create-chapter')) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Add New Chapter Section',
    });
    const { topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Chapter.createChapter(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/chapter-list')) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Chapter List Section',
    });
    const { topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Chapter.chapterList(bot, callbackQuery, topicId);
    return;
  }
};

export default callbackQueryHandler;
