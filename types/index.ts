// Global TypeScript types and interfaces

// User roles
export type UserRole = 'admin' | 'editor' | 'user';

// User status
export type UserStatus = 'active' | 'blocked';

// Post status
export type PostStatus = 'draft' | 'pendingApproval' | 'published';

// Comment status (moderation workflow)
export type CommentStatus = 'pending' | 'approved' | 'rejected';

// Dispute types (common in Israeli real estate law)
export type DisputeType =
  | 'רטיבות'
  | 'ליקויי בנייה'
  | 'רכוש משותף'
  | 'פגמים נסתרים'
  | 'קבלנים'
  | 'שכנים'
  | 'רעש'
  | 'הצפה'
  | 'סדקים'
  | 'גג דולף'
  | 'אחר';

// Schema types for structured data (SEO)
export type SchemaType = 'Article' | 'FAQPage' | 'LegalService';

// Download access levels
export type DownloadAccess = 'free' | 'leadRequired' | 'registeredOnly';

// Lead status
export type LeadStatus = 'new' | 'in_progress' | 'closed';

// Analytics event types
export type AnalyticsEventType =
  | 'pageView'
  | 'postView'
  | 'leadSubmitted'
  | 'whatsappClick'
  | 'fileDownload';

// API response shape
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: any; // For validation errors
}

// Session user (returned from auth)
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

