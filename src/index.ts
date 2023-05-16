import TelegramBot from 'node-telegram-bot-api';
import * as D from './duck/index.js';
import * as Commands from './commands/index.js';
import * as EventHandlers from './event-handlers/index.js';
import { Task, SimpleIntervalJob } from 'toad-scheduler';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env['TOKEN'] as string;
const PORT = process.env['PORT'];
const URL = process.env['WEBHOOK_URL'];

const bot = new TelegramBot(TOKEN);
// eslint-disable-next-line @typescript-eslint/no-empty-function
bot.setWebHook(`${URL}/bot${TOKEN}`);

// WebHook server setup
const app = express();
app.use(express.json());
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200).end();
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server is listening on ${PORT}`);
});

await bot.setMyCommands(D.constants.commands);

bot.onText(/\/start/, (msg) => Commands.start(msg, bot));
bot.onText(/\/create/, (msg) => Commands.Topic.createTopic(msg, bot));
bot.onText(/\/list/, (msg) => Commands.Topic.topicList(msg, bot));
bot.onText(/\/info/, (msg) => Commands.info(msg, bot));

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
