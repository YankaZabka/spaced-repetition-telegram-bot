import TelegramBot from 'node-telegram-bot-api';
import * as Commands from '../commands/index.js';
import * as D from '../duck/index.js';

const callbackQueryHandler = async (
  callbackQuery: TelegramBot.CallbackQuery,
  bot: TelegramBot,
) => {
  if (callbackQuery.message && callbackQuery.data === '/info') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Welcome to the Info section!',
    });
    await Commands.info(callbackQuery.message, bot);
    return;
  }

  if (callbackQuery.message && callbackQuery.data === '/create') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Welcome to the Create New Topic Section!',
    });
    await Commands.Topic.createTopic(
      callbackQuery.message,
      bot,
      callbackQuery.from.id,
    );
    return;
  }

  if (
    callbackQuery.message &&
    callbackQuery.data?.startsWith('/create-chapter')
  ) {
    const topicId = callbackQuery.data?.split('/')[2];
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Welcome to the Add New Chapter Section!',
    });
    await Commands.Chapter.createChapter(topicId, bot, callbackQuery);
    return;
  }

  if (
    callbackQuery.message &&
    callbackQuery.data?.startsWith('/chapter-list')
  ) {
    const topicId = callbackQuery.data?.split('/')[2];
    await Commands.Chapter.chapterList(topicId, bot, callbackQuery);
    return;
  }

  if (callbackQuery.message && callbackQuery.data?.startsWith('/show')) {
    const topicId = callbackQuery.data?.split('/')[2];

    await Commands.Topic.showTopic({
      msg: callbackQuery.message,
      bot,
      topicId,
      callbackQueryId: callbackQuery.id,
      callbackQueryFromId: callbackQuery.from.id,
    });
    return;
  }

  if (callbackQuery.message && callbackQuery.data?.startsWith('/edit')) {
    const topicId = callbackQuery.data?.split('/')[2];
    const editableField = callbackQuery?.data?.split(
      '/',
    )[3] as D.types.editableFields;

    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Edit Topic Section',
    });
    await Commands.Topic.editTopic({
      msg: callbackQuery.message,
      bot,
      topicId,
      editableField,
      callbackQueryFromId: callbackQuery.from.id,
    });
    return;
  }

  if (callbackQuery.message && callbackQuery.data?.startsWith('/delete')) {
    const topicId = callbackQuery.data?.split('/')[2];
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Delete Topic Section',
    });
    await Commands.Topic.deleteTopic(
      callbackQuery.message,
      bot,
      topicId,
      callbackQuery.from.id,
    );
    return;
  }
};

export default callbackQueryHandler;
