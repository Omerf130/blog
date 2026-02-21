import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  category?: mongoose.Types.ObjectId;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  fileData: Buffer;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    },
    fileSize: {
      type: Number,
      required: true,
      max: [10 * 1024 * 1024, 'File size cannot exceed 10MB'],
    },
    fileData: {
      type: Buffer,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DocumentSchema.index({ category: 1 });
DocumentSchema.index({ createdAt: -1 });

// Prevent model recompilation
const DocumentModel =
  (mongoose.models.Document as mongoose.Model<IDocument>) ||
  mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;

