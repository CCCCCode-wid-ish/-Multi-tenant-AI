import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  projectId: mongoose.Types.ObjectId;
  productInstanceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    productInstanceId: { type: Schema.Types.ObjectId, ref: 'ProductInstance', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Conversation', trim: true },
  },
  { timestamps: true }
);

ConversationSchema.index({ projectId: 1, productInstanceId: 1, userId: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ??
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
