import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWidget {
  id: string;
  type: 'stats' | 'activity' | 'chart' | 'integrations' | 'users';
  title: string;
  config?: Record<string, unknown>;
}

export interface ISection {
  title: string;
  widgets: IWidget[];
}

export interface IDashboardConfig extends Document {
  projectId: mongoose.Types.ObjectId;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const WidgetSchema = new Schema<IWidget>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['stats', 'activity', 'chart', 'integrations', 'users'],
      required: true,
    },
    title: { type: String, required: true },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    widgets: { type: [WidgetSchema], default: [] },
  },
  { _id: false }
);

const DashboardConfigSchema = new Schema<IDashboardConfig>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

const DashboardConfig: Model<IDashboardConfig> =
  mongoose.models.DashboardConfig ??
  mongoose.model<IDashboardConfig>('DashboardConfig', DashboardConfigSchema);

export default DashboardConfig;
