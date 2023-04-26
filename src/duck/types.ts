export interface IDB {
  topics: ITopic[];
}

export interface ITopic {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  links?: string[];
  chapters?: IChapter[];
}

interface IChapter {
  title: string;
  description: string;
}

export type editableFields = 'title' | 'description';
