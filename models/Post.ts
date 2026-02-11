import mongoose, { Schema, Document } from 'mongoose';
import type { DisputeType, PostStatus, SchemaType } from '@/types';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  content: string;
  whatWeLearned?: string;
  authorLawyerId?: mongoose.Types.ObjectId;
  authorUserId?: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  disputeType?: DisputeType;
  featuredImage?: {
    data: string;
    mimetype: string;
    filename: string;
    size: number;
  };
  slugHe: string;
  status: PostStatus;
  commentsLocked: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  schemaTypes: SchemaType[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    whatWeLearned: {
      type: String,
      maxlength: [2000, 'What we learned cannot exceed 2000 characters'],
    },
    authorLawyerId: {
      type: Schema.Types.ObjectId,
      ref: 'Lawyer',
    },
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: 'Category',
      required: [true, 'At least one category is required'],
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return v && v.length > 0;
        },
        message: 'At least one category is required',
      },
    },
    disputeType: {
      type: String,
      enum: [
        'רטיבות',
        'ליקויי בנייה',
        'רכוש משותף',
        'פגמים נסתרים',
        'קבלנים',
        'שכנים',
        'רעש',
        'הצפה',
        'סדקים',
        'גג דולף',
        'אחר',
      ],
    },
    featuredImage: {
      data: {
        type: String,
        maxlength: [16000000, 'Image data too large (max 16MB)'],
      },
      mimetype: {
        type: String,
        enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      },
      filename: String,
      size: {
        type: Number,
        max: [5000000, 'Image file size cannot exceed 5MB'],
      },
    },
    slugHe: {
      type: String,
      required: [true, 'Hebrew slug is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pendingApproval', 'published'],
      default: 'draft',
    },
    commentsLocked: {
      type: Boolean,
      default: false,
    },
    seo: {
      title: {
        type: String,
        maxlength: [70, 'SEO title cannot exceed 70 characters'],
      },
      description: {
        type: String,
        maxlength: [160, 'SEO description cannot exceed 160 characters'],
      },
      keywords: [String],
    },
    schemaTypes: {
      type: [String],
      enum: ['Article', 'FAQPage', 'LegalService'],
      default: ['Article'],
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PostSchema.index({ slugHe: 1 }, { unique: true });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ categories: 1 });
PostSchema.index({ disputeType: 1 });
PostSchema.index({ authorLawyerId: 1 });
// Text index for search
PostSchema.index({ title: 'text', summary: 'text', content: 'text' });

// Prevent model recompilation
const Post =
  (mongoose.models.Post as mongoose.Model<IPost>) ||
  mongoose.model<IPost>('Post', PostSchema);

export default Post;

