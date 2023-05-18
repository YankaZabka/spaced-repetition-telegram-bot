import { IDB } from './types.js';

export const DATABASE: IDB = {
  users: [],
};

export const commands = [
  { command: 'create', description: 'Create New Topic' },
  { command: 'start', description: 'Start the Bot' },
  { command: 'mytopics', description: 'List of all topics' },
  { command: 'info', description: 'Bot features description' },
];
