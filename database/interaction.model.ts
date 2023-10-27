import { Schema, model, models, Document } from 'mongoose';

export interface InteractionInterface extends Document {
  userId: Schema.Types.ObjectId;
  action: string;
  questionId: Schema.Types.ObjectId;
  answerId: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  createdAt: Date;
}

const InteractionSchema = new Schema<InteractionInterface>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  answerId: { type: Schema.Types.ObjectId, ref: 'Answer' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
});

// check if model already exists, else we creat new
const Interaction =
  models.Interaction || model('Interaction', InteractionSchema);

export { Interaction };
