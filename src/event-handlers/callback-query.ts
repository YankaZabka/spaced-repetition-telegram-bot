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

  if (callbackQuery.data?.startsWith('/lang')) {
    const { lng } = D.utils.getQueryParams(callbackQuery.data);
    await bot.answerCallbackQuery(callbackQuery.id);
    await Commands.start(
      callbackQuery.message,
      bot,
      callbackQuery.from.id,
      lng,
    );
    return;
  }

  if (callbackQuery.data?.startsWith('/nav')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    await D.utils.navigate(bot, callbackQuery);
    return;
  }

  if (callbackQuery.data === '/info') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await Commands.info(callbackQuery.message, bot);
    return;
  }

  if (callbackQuery.data === '/create') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await Commands.Topic.createTopic(
      callbackQuery.message,
      bot,
      callbackQuery.from.id,
    );
    return;
  }

  if (callbackQuery.data?.startsWith('/show-chapter')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId, cId: chapterId } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.Chapter.showChapter(bot, callbackQuery, topicId, chapterId);
    return;
  }

  if (callbackQuery.data?.startsWith('/show')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Topic.showTopic(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/edit-chapter')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const {
      tId: topicId,
      cId: chapterId,
      ef: editableField = null,
    } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Chapter.editChapter(
      bot,
      callbackQuery,
      topicId,
      chapterId,
      editableField,
    );
    return;
  }

  if (callbackQuery.data?.startsWith('/edit')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId, ef: editableField = null } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.Topic.editTopic(bot, callbackQuery, topicId, editableField);
    return;
  }

  if (callbackQuery.data?.startsWith('/delete-chapter')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId, cId: chapterId } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.Chapter.deleteChapter(
      bot,
      callbackQuery,
      topicId,
      chapterId,
    );
    return;
  }

  if (callbackQuery.data?.startsWith('/delete')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Topic.deleteTopic(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/create-chapter')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Chapter.createChapter(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/chapter-list')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId } = D.utils.getQueryParams(callbackQuery.data);
    await Commands.Chapter.chapterList(bot, callbackQuery, topicId);
    return;
  }

  if (callbackQuery.data?.startsWith('/complete')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId, cId: chapterId } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.complete(bot, callbackQuery, topicId, chapterId);
    return;
  }

  if (callbackQuery.data?.startsWith('/fail')) {
    await bot.answerCallbackQuery(callbackQuery.id);
    const { tId: topicId, cId: chapterId } = D.utils.getQueryParams(
      callbackQuery.data,
    );
    await Commands.fail({
      bot,
      topicId,
      chapterId,
      callbackQuery,
    });
    return;
  }
};

export default callbackQueryHandler;
