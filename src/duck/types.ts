export interface IDB {
  users: IUser[];
}

export interface IUser {
  chatId: number;
  lng: string;
  telegramId: number;
  signUpDate: string;
  topics: ITopic[];
}

export interface ITopic {
  id: string;
  title: string;
  description: string;
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
