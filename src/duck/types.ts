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
  repeatDate?: string;
  cover?: string;
  links?: string[];
  chapters?: IChapter[];
}

interface IChapter {
  title: string;
  description: string;
}

export type editableFields = 'title' | 'description';
