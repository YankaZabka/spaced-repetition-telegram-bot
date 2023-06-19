import TelegramBot from 'node-telegram-bot-api';
import * as D from './duck/index.js';
import * as Commands from './commands/index.js';
import * as EventHandlers from './event-handlers/index.js';
import { Task, SimpleIntervalJob } from 'toad-scheduler';
import * as dotenv from 'dotenv';
dotenv.config();

const initBot = async () => {
  const TOKEN = process.env['TOKEN'] as string;
  const bot = new TelegramBot(TOKEN, { polling: true });

  // i18next initialization
  await D.i18next();

  await bot.setMyCommands(D.constants.commands);

  bot.onText(/\/start/, (msg) => Commands.start(msg, bot));
  bot.onText(/\/create/, (msg) => Commands.Topic.createTopic(msg, bot));
  bot.onText(/\/mytopics/, (msg) => Commands.Topic.topicList(msg, bot));
  bot.onText(/\/info/, (msg) => Commands.Info.mainInfo(msg, bot));

  bot.on('callback_query', async (callbackQuery) =>
    EventHandlers.callbackQueryHandler(callbackQuery, bot),
  );
  bot.on('my_chat_member', EventHandlers.myChatMemberHandler);

  // Each hour, this task checks if there are users with chapters to repeat.
  const schedulerTask = new Task('check for repeats', () =>
    D.utils.checkForRepeats(bot),
  );
  const schedulerJob = new SimpleIntervalJob({ seconds: 20 }, schedulerTask);
  D.scheduler.addSimpleIntervalJob(schedulerJob);
};

await initBot();
