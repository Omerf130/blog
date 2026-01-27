import mongoose, { Schema, Document } from 'mongoose';

export interface ILawyer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  title: string; // e.g., "עורך דין", "שותף בכיר"
  bio: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerSchema = new Schema<ILawyer>(
  {
    name: {
      type: String,
      required: [true, 'Lawyer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    photoUrl: {
      type: String,
      maxlength: [500, 'Photo URL cannot exceed 500 characters'],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    linkedIn: {
      type: String,
      maxlength: [200, 'LinkedIn URL cannot exceed 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
LawyerSchema.index({ isActive: 1 });
LawyerSchema.index({ name: 1 });

// Prevent model recompilation
const Lawyer =
  (mongoose.models.Lawyer as mongoose.Model<ILawyer>) ||
  mongoose.model<ILawyer>('Lawyer', LawyerSchema);

export default Lawyer;

