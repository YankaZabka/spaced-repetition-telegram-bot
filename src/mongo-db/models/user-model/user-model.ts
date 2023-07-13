import mongoose from 'mongoose';
import * as D from '../../../duck/index.js';
import { topicSchema } from '../topic-model/topic-model.js';

const userSchema = new mongoose.Schema<D.types.IUser>({
  chatId: { type: Number, required: true },
  lng: { type: String, required: true },
  telegramId: { type: Number, required: true },
  signUpDate: { type: String, required: true },
  topics: topicSchema,
});

export const UserModel = mongoose.model<D.types.IUser>('User', userSchema);
