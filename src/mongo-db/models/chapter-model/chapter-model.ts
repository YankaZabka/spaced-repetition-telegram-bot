import mongoose from 'mongoose';
import * as D from '../../../duck/index.js';

export const chapterSchema = new mongoose.Schema<D.types.IChapter>({
  id: { type: String, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  repeatDate: { type: String, required: true },
  leitnerBox: { type: Number, required: true },
  isWaitingForRepeat: { type: Boolean, required: true },
});

export const chapterModel = mongoose.model<D.types.IChapter>(
  'Chapter',
  chapterSchema,
);
