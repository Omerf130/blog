# Step 3 Testing Guide ✅

## What Was Completed

**Step 3: Authentication Endpoints & Middleware**

### Files Created:
1. ✅ `lib/validators/auth.ts` - Zod validation schemas
2. ✅ `app/api/admin/bootstrap/route.ts` - Create first admin endpoint
3. ✅ `app/api/auth/login/route.ts` - Login endpoint
4. ✅ `app/api/auth/logout/route.ts` - Logout endpoint
5. ✅ `app/api/auth/me/route.ts` - Current user endpoint
6. ✅ `middleware.ts` - Route protection
7. ✅ `app/(admin)/admin/login/page.tsx` - Login page
8. ✅ `app/(admin)/admin/login/page.module.scss` - Login styles
9. ✅ `app/(admin)/admin/page.tsx` - Admin dashboard
10. ✅ `app/(admin)/admin/page.module.scss` - Dashboard styles

### Key Features:
- ✅ Bootstrap endpoint (one-time admin creation)
- ✅ Email + password login
- ✅ Secure session management
- ✅ httpOnly cookies
- ✅ Automatic route protection
- ✅ Role-based access control
- ✅ Beautiful RTL login page

---

## Testing Flow

### Test 1: Bootstrap - Create First Admin ✅

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-secret: your-bootstrap-secret" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@test.com\",\"password\":\"Test123!\"}"
```

**Using PowerShell:**

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-bootstrap-secret" = "your-bootstrap-secret"
}
$body = @{
    name = "Admin User"
    email = "admin@test.com"
    password = "Test123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bootstrap" -Method Post -Headers $headers -Body $body
```

**✅ Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Admin user created successfully",
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin"
    }
  }
}
```

**✅ Terminal Should Show:**
```
✅ Bootstrap: First admin user created: admin@test.com
```

**⚠️ Try running it again (should fail):**
```json
{
  "ok": false,
  "error": "Admin user already exists. Bootstrap is disabled."
}
```

**Success Criteria:**
- [ ] First request creates admin successfully
- [ ] Second request returns 403 (bootstrap disabled)
- [ ] User appears in MongoDB Atlas
- [ ] Password is hashed (not plain text)

---

### Test 2: Login Page (Browser) ✅

**Step 1:** Open browser to `http://localhost:3000/admin/login`

**✅ Expected:**
- Beautiful login page with gradient header
- Hebrew text (RTL layout)
- "כניסה למערכת" title
- Email and password fields
- "התחבר" button

**Step 2:** Enter credentials:
- Email: `admin@test.com`
- Password: `Test123!`

**Step 3:** Click "התחבר"

**✅ Expected:**
- Redirects to `/admin` (dashboard)
- Welcome message with your name
- User info displayed
- Cards showing upcoming features

**Success Criteria:**
- [ ] Login page loads correctly
- [ ] Hebrew text displays (RTL)
- [ ] Can enter credentials
- [ ] Login redirects to dashboard
- [ ] Dashboard shows user info

---

### Test 3: Login API (Programmatic) ✅

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"Test123!\"}" \
  -c cookies.txt
```

**Using PowerShell:**

```powershell
$body = @{
    email = "admin@test.com"
    password = "Test123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body $body -SessionVariable session
```

**✅ Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Login successful",
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

**✅ Terminal Should Show:**
```
✅ User logged in: admin@test.com
```

**Success Criteria:**
- [ ] Returns user data
- [ ] Sets `keshet_session` cookie
- [ ] Cookie is httpOnly
- [ ] Session stored in MongoDB

---

### Test 4: Current User Endpoint ✅

**After logging in**, test the current user endpoint:

**Browser:** Navigate to `http://localhost:3000/api/auth/me`

**Curl (with cookies):**
```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
```

**✅ Expected Response:**
```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

**❌ Without login (should fail):**
```json
{
  "ok": false,
  "error": "Not authenticated"
}
```

**Success Criteria:**
- [ ] Returns user data when authenticated
- [ ] Returns 401 when not authenticated
- [ ] Cookie is validated correctly

---

### Test 5: Route Protection (Middleware) ✅

**Test accessing admin without login:**

1. Open **incognito/private browser window** (to ensure no cookies)
2. Navigate to `http://localhost:3000/admin`

**✅ Expected:**
- Redirects to `/admin/login?redirect=/admin`
- Shows login page

**After logging in:**
- Should redirect back to `/admin`
- Shows dashboard

**Success Criteria:**
- [ ] Cannot access `/admin` without login
- [ ] Redirects to login page
- [ ] After login, redirects back to requested page

---

### Test 6: Logout ✅

**Method 1: Dashboard Button**
1. Go to `/admin` (while logged in)
2. Click "🚪 התנתק" button

**✅ Expected:**
- Redirects to login page
- Cannot access `/admin` anymore
- `/api/auth/me` returns 401

**Method 2: API Call**

```bash
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

**✅ Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**✅ Terminal Should Show:**
```
✅ User logged out
```

**Success Criteria:**
- [ ] Session deleted from database
- [ ] Cookie cleared
- [ ] Cannot access protected routes
- [ ] Must login again

---

### Test 7: Invalid Credentials ✅

Try logging in with wrong password:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"WrongPassword\"}"
```

**✅ Expected Response:**
```json
{
  "ok": false,
  "error": "Invalid email or password"
}
```

**Success Criteria:**
- [ ] Returns 401 status
- [ ] Error message is generic (security)
- [ ] No session created

---

### Test 8: Validation Errors ✅

**Test invalid email:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"not-an-email\",\"password\":\"Test123!\"}"
```

**✅ Expected:**
```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [...]
}
```

**Test short password on bootstrap:**
```bash
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-secret: your-secret" \
  -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"123\"}"
```

**✅ Expected:**
```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [{
    "message": "Password must be at least 6 characters"
  }]
}
```

**Success Criteria:**
- [ ] Invalid email rejected
- [ ] Short password rejected
- [ ] Helpful error messages

---

### Test 9: MongoDB Verification ✅

**Check in MongoDB Atlas:**

1. Go to MongoDB Atlas
2. Browse Collections
3. Check `users` collection:
   - Should have 1 user (admin)
   - Password should be hashed (starts with `$2b$`)
   - Email is lowercase

4. Check `sessions` collection:
   - Should have session if logged in
   - `tokenHash` is hashed (not plain token)
   - `expiresAt` is set to 14 days from now
   - `userId` references the user

**Success Criteria:**
- [ ] User exists in database
- [ ] Password is hashed (bcrypt)
- [ ] Session exists when logged in
- [ ] Token is hashed in database

---

### Test 10: Session Expiration ✅

Sessions are set to expire after 14 days (configurable via `SESSION_TTL_DAYS`).

**To test immediately:**

1. Login to create a session
2. In MongoDB Atlas, manually edit the session's `expiresAt` to a past date
3. Try accessing `/admin` or `/api/auth/me`

**✅ Expected:**
- Session is invalid
- Redirects to login
- MongoDB TTL index will delete the expired session automatically (within 60 seconds)

**Success Criteria:**
- [ ] Expired sessions are rejected
- [ ] TTL index cleans up old sessions

---

## Verification Checklist

Before moving to Step 4, confirm:

- [ ] Bootstrap endpoint creates first admin (once only)
- [ ] Login page loads with Hebrew/RTL
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Dashboard shows after login
- [ ] `/admin` redirects to login if not authenticated
- [ ] `/api/auth/me` returns user data when logged in
- [ ] Logout works (clears session)
- [ ] Sessions stored in MongoDB
- [ ] Passwords are hashed in database
- [ ] Validation errors are helpful

---

## Common Issues & Solutions

### Issue: "Invalid bootstrap secret"

**Solution:**
- Check `x-bootstrap-secret` header matches `ADMIN_BOOTSTRAP_SECRET` in `.env`
- Ensure no extra spaces in the secret

### Issue: "Admin user already exists"

**Solution:**
- Bootstrap only works once!
- If you need to reset, delete the admin user from MongoDB Atlas
- Or login with the existing admin credentials

### Issue: Login redirects to login page (loop)

**Solution:**
- Check that session cookie is being set
- Ensure `SESSION_SECRET` is set in `.env`
- Check browser console for errors
- Try clearing cookies

### Issue: "Not authenticated" when should be logged in

**Solution:**
- Check that cookies are enabled
- Verify session exists in MongoDB
- Check `expiresAt` is in the future
- Try logging in again

### Issue: Cannot access /admin after login

**Solution:**
- Check user role is `admin` or `editor`
- Verify middleware is running
- Check terminal for errors
- Clear browser cache and cookies

---

## Quick Test Commands

```bash
# 1. Create admin (REPLACE 'your-bootstrap-secret' with your actual secret)
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-secret: your-bootstrap-secret" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"Test123!\"}"

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"Test123!\"}" \
  -c cookies.txt

# 3. Check current user
curl http://localhost:3000/api/auth/me -b cookies.txt

# 4. Logout
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

---

## What's Working Now

✅ **Complete Authentication System:**
- User registration (bootstrap)
- Login with email + password
- Secure session management
- Route protection
- Role-based access
- Logout functionality

✅ **Security Features:**
- bcrypt password hashing
- httpOnly cookies
- Token hashing in database
- TTL session expiration
- Request validation
- CSRF-safe (SameSite cookies)

---

## Next Step Preview

**Step 4** will implement:
- Category CRUD endpoints
- Post CRUD endpoints
- Lawyer CRUD endpoints
- Hebrew slug generation
- Admin pages for managing content

---

**All tests passing?** ✅ Let's move to Step 4! 🚀

