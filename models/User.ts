import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'member';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, projectId: 1 }, { unique: true });

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

export default User;
