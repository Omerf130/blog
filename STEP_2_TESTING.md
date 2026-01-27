# Step 2 Testing Guide ✅

## What Was Completed

**Step 2: Database Connection + User & Session Models**

### Files Created:
1. ✅ `lib/db.ts` - Cached MongoDB connection
2. ✅ `models/User.ts` - User model with bcrypt password hashing
3. ✅ `models/Session.ts` - Session model with TTL index
4. ✅ `lib/cookies.ts` - Cookie helper functions
5. ✅ `lib/auth.ts` - Authentication utilities (session management, user verification)
6. ✅ `app/api/test-db/route.ts` - Test endpoint for database connectivity

### Key Features Implemented:
- ✅ Cached MongoDB connection (prevents multiple connections in dev)
- ✅ User model with email uniqueness and password hashing
- ✅ Session model with automatic expiration (TTL index)
- ✅ Secure token hashing using HMAC-SHA256
- ✅ httpOnly cookies for session tokens
- ✅ Helper functions for auth (requireAuth, requireRole, etc.)

---

## Prerequisites

Before testing, you need:

### 1. MongoDB Atlas Setup

**If you don't have MongoDB Atlas:**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free (M0 Free Tier is perfect)
3. Create a cluster (takes ~5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Important:** 
- Replace `<password>` with your actual database user password
- Replace `myFirstDatabase` with `legal-blog` (or any name you prefer)
- Whitelist your IP address (or use 0.0.0.0/0 for testing)

### 2. Create `.env` File

Create a file named `.env` in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-blog?retryWrites=true&w=majority

# Session Configuration
SESSION_COOKIE_NAME=keshet_session
SESSION_TTL_DAYS=14
SESSION_SECRET=your-strong-random-secret-here-min-32-chars

# Admin Bootstrap
ADMIN_BOOTSTRAP_SECRET=your-bootstrap-secret-here

# WhatsApp Integration
WHATSAPP_DEFAULT_NUMBER=972501234567
```

**Generate Strong Secrets:**

Run in Node.js console or terminal:
```javascript
// In Node.js REPL (type 'node' in terminal)
require('crypto').randomBytes(32).toString('hex')
```

Or online: https://generate-secret.vercel.app/32

**Example `.env` with real values:**
```env
MONGODB_URI=mongodb+srv://myuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/legal-blog?retryWrites=true&w=majority
SESSION_COOKIE_NAME=keshet_session
SESSION_TTL_DAYS=14
SESSION_SECRET=f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8
ADMIN_BOOTSTRAP_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
WHATSAPP_DEFAULT_NUMBER=972501234567
```

---

## Testing Steps

### Test 1: Environment Variables ✅

After creating `.env`, restart the dev server:

```bash
# Stop the server (Ctrl+C if running)
npm run dev
```

**Expected:**
- Server starts without "MONGODB_URI" error
- No environment variable warnings

**Success Criteria:**
- ✅ Server starts successfully
- ✅ No environment variable errors

---

### Test 2: Database Connection ✅

With the server running, open your browser or use curl:

**Browser:**
Navigate to: `http://localhost:3000/api/test-db`

**Curl:**
```bash
curl http://localhost:3000/api/test-db
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Database connected successfully!",
    "userCount": 0,
    "timestamp": "2026-01-27T..."
  }
}
```

**In Terminal Console, you should see:**
```
✅ MongoDB connected successfully
```

**Success Criteria:**
- ✅ Response has `"ok": true`
- ✅ `userCount` is 0 (no users yet)
- ✅ Terminal shows "MongoDB connected successfully"
- ✅ No error messages

**If you get an error:**
- Check MongoDB URI is correct
- Verify your IP is whitelisted in Atlas
- Check database user credentials
- Ensure network connection is working

---

### Test 3: MongoDB Atlas Verification ✅

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to your cluster
3. Click "Browse Collections"
4. You should see your database (e.g., `legal-blog`)
5. Collections: `users` and `sessions` should appear after first use

**Success Criteria:**
- ✅ Database exists in Atlas
- ✅ Can browse collections

---

### Test 4: Hot Reload Test ✅

With server running, test the cached connection:

1. Save any file (e.g., add a comment to `app/page.tsx`)
2. Check terminal output
3. Visit `/api/test-db` again

**Expected:**
- No new "MongoDB connected" message (using cached connection)
- Response still works
- `userCount` remains the same

**Success Criteria:**
- ✅ Cached connection is reused
- ✅ No duplicate connections
- ✅ API still responds correctly

---

### Test 5: User Model Validation ✅

Let's verify the User model is working. We'll do this in Step 3 when we create the bootstrap endpoint, but for now, you can verify the model loads:

**Check for TypeScript errors:**
```bash
npm run type-check
```

**Expected:**
- No TypeScript errors
- All models compile correctly

**Success Criteria:**
- ✅ No type errors
- ✅ Models are properly typed

---

### Test 6: Session Model & TTL Index ✅

The Session model has a TTL (Time To Live) index that automatically deletes expired sessions.

**Verify in MongoDB Atlas:**
1. Go to your cluster → Browse Collections
2. Click on `sessions` collection (will be created when first session is made)
3. Click "Indexes" tab
4. You should see an index on `expiresAt` with `expireAfterSeconds: 0`

**Note:** The sessions collection won't exist until we create the first session in Step 3. This is normal!

**Success Criteria:**
- ✅ Understanding that TTL index will auto-delete expired sessions
- ✅ Sessions collection will appear in next step

---

### Test 7: Production Build ✅

Ensure the new database code builds for production:

```bash
npm run build
```

**Expected:**
- Build completes successfully
- All routes compile
- No errors or warnings

**Success Criteria:**
- ✅ Build succeeds
- ✅ No compilation errors
- ✅ API routes are included in build

---

## Verification Checklist

Before moving to Step 3, confirm:

- [ ] `.env` file created with all required variables
- [ ] MongoDB Atlas cluster is running
- [ ] IP address is whitelisted in Atlas
- [ ] Database connection string is correct
- [ ] `/api/test-db` returns `"ok": true`
- [ ] Terminal shows "MongoDB connected successfully"
- [ ] `npm run type-check` passes without errors
- [ ] `npm run build` completes successfully
- [ ] No console errors when visiting test endpoint

---

## Common Issues & Solutions

### Issue: "MONGODB_URI environment variable not defined"

**Solution:**
- Ensure `.env` file exists in project root
- Restart the dev server after creating `.env`
- Check file is named exactly `.env` (not `.env.txt`)

### Issue: "MongoServerError: bad auth"

**Solution:**
- Check database username and password are correct
- Ensure password special characters are URL-encoded
- Example: `p@ssw0rd` should be `p%40ssw0rd`

### Issue: "Connection timeout" or "ECONNREFUSED"

**Solution:**
- Check your internet connection
- Verify your IP is whitelisted in MongoDB Atlas
- Go to Atlas → Network Access → Add IP Address
- Or use `0.0.0.0/0` to allow all IPs (for development only!)

### Issue: "Database connected" appears multiple times

**Solution:**
- This is normal in development with hot reload
- The cached connection should minimize this
- In production, this won't happen

### Issue: Test endpoint returns 500 error

**Solution:**
- Check terminal console for detailed error
- Verify all models can load
- Check MongoDB URI format
- Ensure database user has read/write permissions

---

## Database Structure Verification

At this point, your MongoDB should have:

```
legal-blog (database)
├── users (collection) - Empty for now
└── sessions (collection) - Empty for now
```

**Indexes created:**
- `users`: unique index on `email`
- `sessions`: unique index on `tokenHash`
- `sessions`: TTL index on `expiresAt`
- `sessions`: index on `userId`

---

## What's Working Now

✅ **Database Connection**: Secure, cached connection to MongoDB
✅ **User Model**: Ready to store users with hashed passwords
✅ **Session Model**: Ready for secure session management
✅ **Auth Helpers**: Functions to create/validate sessions
✅ **Cookie Utilities**: Secure httpOnly cookie management

---

## Next Step Preview

**Step 3** will implement:
1. Bootstrap endpoint (`POST /api/admin/bootstrap`) to create first admin
2. Login endpoint (`POST /api/auth/login`)
3. Logout endpoint (`POST /api/auth/logout`)
4. Current user endpoint (`GET /api/auth/me`)
5. Middleware to protect admin routes
6. Test the complete auth flow

---

## Quick Test Summary

Run these commands in order:

```bash
# 1. Create .env file (manually)
# 2. Restart server
npm run dev

# 3. Test database connection
curl http://localhost:3000/api/test-db

# 4. Verify no TypeScript errors
npm run type-check

# 5. Test production build
npm run build
```

**All passing?** ✅ You're ready for Step 3! 🚀

---

## Terminal Output Reference

**Successful Step 2 looks like:**

```bash
$ npm run dev

   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000

 ✓ Ready in 2.5s
 
# When you visit /api/test-db:
✅ MongoDB connected successfully
 GET /api/test-db 200 in 234ms
```

If you see this, **Step 2 is complete!** 🎉

