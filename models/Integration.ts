import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIntegration extends Document {
  projectId: mongoose.Types.ObjectId;
  shopify: boolean;
  crm: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    shopify: { type: Boolean, default: false },
    crm: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Integration: Model<IIntegration> =
  mongoose.models.Integration ??
  mongoose.model<IIntegration>('Integration', IntegrationSchema);

export default Integration;
