# Fixes: Registration & Post Approval ✅

Two critical issues resolved to enable proper testing of the comments system.

---

## Issue 1: No Public Registration ❌ → ✅

### Problem:
- Only admins could be created (via bootstrap endpoint)
- Regular users couldn't register
- Couldn't test commenting system as a regular user

### Solution:
Created a complete public registration system.

#### Files Created:
1. **`lib/validators/register.ts`** - Registration validation schema
   - Name (2-100 chars)
   - Email (valid email, lowercase)
   - Password (min 6 chars)

2. **`app/api/auth/register/route.ts`** - Registration API endpoint
   - POST `/api/auth/register`
   - Checks for existing email
   - Hashes password with bcrypt
   - Creates user with role='user' by default
   - Returns success message

3. **`app/(auth)/register/page.tsx`** - Registration page
   - Form with name, email, password
   - Client-side validation
   - Success redirect to login
   - Link back to login page

4. **`app/(auth)/register/register.module.scss`** - Registration styles
   - Matches login page design
   - Gradient background
   - Responsive card layout

#### Updated Files:
- **`app/(auth)/admin/login/page.tsx`** - Added "הרשם כאן" link
- **`app/(auth)/admin/login/page.module.scss`** - Added `.link` class

---

## Issue 2: No Post Approval UI ❌ → ✅

### Problem:
- Editors could create posts with status 'draft' or 'pendingApproval'
- No UI to change post status to 'published'
- Had to manually edit via API or database

### Solution:
Added status change buttons to the admin posts listing page.

#### Updated Files:
**`app/(admin)/admin/posts/page.tsx`** - Added:

1. **`handleStatusChange()` function**
   - Changes post status via PATCH API
   - Sets `publishedAt` when publishing
   - Confirmation dialog before change
   - Refreshes list after success

2. **Status-based action buttons:**
   - **Draft posts** → "✅ פרסם" (Publish)
   - **Pending posts** → "✅ אשר ופרסם" (Approve & Publish)
   - **Published posts** → "📥 הסר מפרסום" (Unpublish to draft)

---

## How to Test 🧪

### Test Registration:
1. Open browser (incognito recommended)
2. Go to: `http://localhost:3000/register`
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
4. Click "הרשם"
5. ✅ Should show success alert
6. ✅ Redirected to login page
7. Login with the new credentials
8. ✅ Should login successfully

### Test Post Approval:
1. Login as admin
2. Go to `/admin/posts`
3. Create a new post with status "draft"
4. In the posts list, you should see:
   - ✅ "✅ פרסם" button next to draft posts
5. Click the publish button
6. ✅ Confirm the dialog
7. ✅ Post status changes to "published"
8. ✅ Post appears on the public site

### Test Comment Flow (End-to-End):
1. **Register** a new user at `/register`
2. **Login** as that user
3. **Go to a published post** on the public site
4. **Submit a comment**
5. ✅ See success message
6. **Logout, login as admin**
7. **Go to `/admin/comments`**
8. ✅ See pending comment
9. **Click "✅ אשר"**
10. **Go back to the post**
11. ✅ Comment now visible!

---

## API Endpoints

### New Endpoint:
```
POST /api/auth/register
Body: { name, email, password }
Returns: { ok: true, data: { message, userId } }
```

### Existing Endpoint (Now Used):
```
PATCH /api/posts/[id]
Body: { status, publishedAt? }
Returns: { ok: true, data: { ... } }
```

---

## Security Features

### Registration:
- ✅ Email uniqueness check
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Default role='user' (not admin)
- ✅ Email normalization (lowercase)
- ✅ Input validation (Zod)

### Post Approval:
- ✅ Requires authentication
- ✅ Confirmation dialog before change
- ✅ Sets publishedAt timestamp
- ✅ Validation via existing API

---

## Files Summary

### Created (4 files):
```
lib/validators/register.ts
app/api/auth/register/route.ts
app/(auth)/register/page.tsx
app/(auth)/register/register.module.scss
```

### Updated (3 files):
```
app/(auth)/admin/login/page.tsx
app/(auth)/admin/login/page.module.scss
app/(admin)/admin/posts/page.tsx
```

---

## User Roles & Permissions

After these fixes, we now have:

| Role | Can Register | Can Comment | Can Moderate | Can Manage Content |
|------|-------------|-------------|--------------|-------------------|
| **user** | ✅ (public) | ✅ | ❌ | ❌ |
| **editor** | ❌ (admin creates) | ✅ | ✅ | ✅ (limited) |
| **admin** | ❌ (bootstrap) | ✅ | ✅ | ✅ (full) |

---

## What's Next? 🚀

Now you can fully test the comments system:

1. ✅ **Register** regular users
2. ✅ **Create and publish** posts via admin
3. ✅ **Submit comments** as regular users
4. ✅ **Moderate comments** as admin
5. ✅ **Complete end-to-end testing**

---

## Quick Links

- **Register:** http://localhost:3000/register
- **Login:** http://localhost:3000/admin/login
- **Admin Posts:** http://localhost:3000/admin/posts
- **Admin Comments:** http://localhost:3000/admin/comments
- **Public Site:** http://localhost:3000

---

Ready to test! 🎉

