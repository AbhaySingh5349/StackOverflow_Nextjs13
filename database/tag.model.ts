import { Schema, model, models, Document } from 'mongoose';

export interface TagInterface extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const TagSchema = new Schema<TagInterface>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// check if model already exists, else we creat new
const Tag = models.Tag || model('Tag', TagSchema);

export { Tag };
