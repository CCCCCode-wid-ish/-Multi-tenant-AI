import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProductType = 'sales-assistant' | 'support-assistant' | 'crm-assistant' | 'general';

export interface IProductInstance extends Document {
  projectId: mongoose.Types.ObjectId;
  nameSpace: string;
  productType: ProductType;
  displayName: string;
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductInstanceSchema = new Schema<IProductInstance>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    nameSpace: { type: String, required: true, lowercase: true, trim: true },
    productType: {
      type: String,
      enum: ['sales-assistant', 'support-assistant', 'crm-assistant', 'general'],
      default: 'general',
    },
    displayName: { type: String, required: true, trim: true },
    systemPrompt: { type: String },
  },
  { timestamps: true }
);

ProductInstanceSchema.index({ projectId: 1, nameSpace: 1 }, { unique: true });

const ProductInstance: Model<IProductInstance> =
  mongoose.models.ProductInstance ??
  mongoose.model<IProductInstance>('ProductInstance', ProductInstanceSchema);

export default ProductInstance;
