import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  key: string;
  videoUrl?: string;
  videoUrl2?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    videoUrl2: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation
const SiteSettings =
  (mongoose.models.SiteSettings as mongoose.Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;

