# Legal Blog + Leads System 🏛️

A full-stack legal blog and lead management system built with Next.js, MongoDB, and TypeScript. Features Hebrew RTL support, role-based access control, and comprehensive lead tracking.

## 🚀 Features

- **Public Legal Blog**: Categories, dispute types, Hebrew slugs, SEO optimization
- **Comments System**: User comments with admin moderation and official lawyer replies
- **Lead Management**: Multi-topic lead forms with WhatsApp integration
- **Downloads Library**: Gated content with three access levels (free, lead-required, registered-only)
- **Video Library**: YouTube embeds with categorization
- **Lawyer Profiles**: Attorney pages with post attribution
- **Admin Panel**: Complete CRUD for all entities
- **Analytics**: Event logging and tracking
- **Authentication**: DB-backed sessions with RBAC (admin/editor/user)

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Styling**: SCSS Modules (no Tailwind)
- **Validation**: Zod
- **Authentication**: Custom DB sessions with bcrypt

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd blog

# Install dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-blog?retryWrites=true&w=majority

# Session Configuration
SESSION_COOKIE_NAME=keshet_session
SESSION_TTL_DAYS=14
SESSION_SECRET=your-strong-random-secret-here-min-32-chars

# Admin Bootstrap (one-time use to create first admin)
ADMIN_BOOTSTRAP_SECRET=your-bootstrap-secret-here

# WhatsApp Integration
WHATSAPP_DEFAULT_NUMBER=972501234567
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong random string for `SESSION_SECRET` (minimum 32 characters)
- Set a secure `ADMIN_BOOTSTRAP_SECRET` for creating the first admin user
- Update `WHATSAPP_DEFAULT_NUMBER` with your business WhatsApp number (international format, no + or spaces)

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Bootstrap First Admin

After the server is running, create the first admin user by sending a POST request:

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-secret: your-bootstrap-secret-here" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "YourSecurePassword123!"
  }'
```

**Using Postman or similar:**
- URL: `POST http://localhost:3000/api/admin/bootstrap`
- Headers:
  - `Content-Type: application/json`
  - `x-bootstrap-secret: your-bootstrap-secret-here`
- Body (JSON):
  ```json
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "YourSecurePassword123!"
  }
  ```

**Note:** This endpoint only works ONCE. After the first admin is created, it will return 403 Forbidden for security.

### Step 5: Login to Admin Panel

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with the credentials you created in Step 4
3. Start managing your content!

## 📁 Project Structure

```
blog/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Home page
│   │   ├── [postSlug]/    # Blog post pages
│   │   └── ...
│   ├── (admin)/           # Admin panel pages
│   │   └── admin/
│   │       ├── login/
│   │       ├── posts/
│   │       └── ...
│   ├── api/               # API Route Handlers
│   │   ├── auth/
│   │   ├── posts/
│   │   └── ...
│   └── layout.tsx         # Root layout (RTL)
├── components/            # Reusable components
├── lib/
│   ├── db.ts             # MongoDB connection
│   ├── auth.ts           # Authentication helpers
│   ├── slug.ts           # Hebrew slugify
│   ├── whatsapp.ts       # WhatsApp link builder
│   └── validators/       # Zod schemas
├── models/               # Mongoose models
├── styles/               # SCSS modules
└── middleware.ts         # Route protection

```

## 🔐 User Roles

- **admin**: Full access (create, edit, delete everything)
- **editor**: Can create/edit posts and manage content (cannot delete or manage users)
- **user**: Can comment on posts and submit inquiries

## 🌐 API Routes

All API routes follow this response format:
```typescript
{
  ok: boolean;
  data?: any;
  error?: string;
}
```

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - List posts (with filters)
- `POST /api/posts` - Create post (admin/editor)
- `GET /api/posts/[id]` - Get single post
- `PATCH /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post (admin only)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Comments
- `GET /api/comments?postId=...` - Get comments for post
- `POST /api/comments` - Add comment (logged-in users)
- `PATCH /api/comments/[id]` - Moderate comment (admin/editor)

### Leads
- `POST /api/leads` - Submit lead form
- `GET /api/leads` - List leads (admin/editor)
- `GET /api/leads/export` - Export leads as CSV

_See full API documentation in `/docs/api.md` (coming soon)_

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- **Netlify**: Use Next.js build plugin
- **Railway**: Auto-detects Next.js
- **DigitalOcean App Platform**: Select Node.js + Next.js
- **AWS/Azure**: Use container deployment or serverless

**Remember to:**
- Set all environment variables
- Ensure MongoDB is accessible from production
- Use production-ready `SESSION_SECRET`

## 🧪 Testing Steps After Setup

1. ✅ Server starts without errors (`npm run dev`)
2. ✅ Home page loads with Hebrew RTL layout
3. ✅ MongoDB connection successful (check console logs)
4. ✅ Bootstrap endpoint creates first admin
5. ✅ Admin login works
6. ✅ Admin panel loads after authentication

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Private - All rights reserved

## 🆘 Troubleshooting

**Problem**: "Cannot connect to MongoDB"
- Solution: Check your `MONGODB_URI` in `.env` file
- Ensure your IP is whitelisted in MongoDB Atlas

**Problem**: "Bootstrap endpoint returns 403"
- Solution: Admin already exists. Use the login page instead.

**Problem**: "Session cookie not setting"
- Solution: Check that `SESSION_SECRET` is set and is at least 32 characters

**Problem**: "Hebrew text displaying incorrectly"
- Solution: Ensure `dir="rtl"` is set in root layout and font supports Hebrew characters

---

Built with ❤️ for Israeli legal professionals

