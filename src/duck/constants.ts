import {IDB} from './types.js'

export const DATABASE: IDB = {
    topics: []
}

export const commands = [
    { command: 'create', description: 'Create New Topic' },
    { command: 'start', description: 'Start the Bot' },
    { command: 'list', description: 'List of all topics' },
    { command: 'info', description: 'Bot features description' },
]