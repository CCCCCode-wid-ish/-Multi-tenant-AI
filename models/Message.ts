import mongoose, { Schema, Document, Model } from 'mongoose';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface IStepLog {
  label: string;
  detail?: string;
  timestamp: Date;
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: MessageRole;
  content: string;
  stepLogs?: IStepLog[];
  createdAt: Date;
  updatedAt: Date;
}

const StepLogSchema = new Schema<IStepLog>(
  {
    label: { type: String, required: true },
    detail: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    stepLogs: { type: [StepLogSchema], default: [] },
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
