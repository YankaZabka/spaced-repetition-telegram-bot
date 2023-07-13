import mongoose from 'mongoose';
import * as D from '../../../duck/index.js';
import { chapterSchema } from '../chapter-model/chapter-model.js';

export const topicSchema = new mongoose.Schema<D.types.ITopic>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  chapters: chapterSchema,
});

export const topicModel = mongoose.model<D.types.ITopic>('Topic', topicSchema);
