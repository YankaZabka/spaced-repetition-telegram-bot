export interface IDB {
  users: IUser[];
}

export interface IUser {
  chatId: number;
  telegramId: number;
  topics: ITopic[];
}

export interface ITopic {
  id: string;
  title: string;
  description: string;
  cover?: string;
  links?: string[];
  chapters?: IChapter[];
}

export interface IChapter {
  id: string;
  topicId: string;
  title: string;
  description: string;
  repeatDate: string;
  leitnerBox: number;
  isWaitingForRepeat: boolean;
}

export type editableFields = 't' | 'd';
