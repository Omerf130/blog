import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ISessionModel extends Model<ISession> {
  hashToken(token: string): string;
  generateToken(): string;
}

const SessionSchema = new Schema<ISession, ISessionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    ip: {
      type: String,
      maxlength: 45, // IPv6 max length
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SessionSchema.index({ tokenHash: 1 }, { unique: true });
SessionSchema.index({ userId: 1 });
// TTL index - MongoDB will automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method: Hash token using SESSION_SECRET
SessionSchema.statics.hashToken = function (token: string): string {
  const secret = process.env.SESSION_SECRET || 'fallback-secret-change-me';
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
};

// Static method: Generate a secure random token
SessionSchema.statics.generateToken = function (): string {
  // Generate 32 bytes (256 bits) of random data, return as hex string
  return crypto.randomBytes(32).toString('hex');
};

// Prevent model recompilation in development
const Session =
  (mongoose.models.Session as ISessionModel) ||
  mongoose.model<ISession, ISessionModel>('Session', SessionSchema);

export default Session;

