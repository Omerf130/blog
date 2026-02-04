import mongoose, { Schema, Model } from 'mongoose';

export interface ILead {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  source?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: [
        'דיני מקרקעין',
        'ליקויי בנייה',
        'דיני שכנים',
        'נדל"ן',
        'רכוש משותף',
        'פגמים נסתרים',
        'קבלנים',
        'אחר',
      ],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'website',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export default Lead;

