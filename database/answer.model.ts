import { Schema, model, models, Document } from 'mongoose';

export interface AnswerInterface extends Document {
  author: Schema.Types.ObjectId;
  questionId: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema<AnswerInterface>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// check if model already exists, else we creat new
const Answer = models.Answer || model('Answer', AnswerSchema);

export { Answer };
