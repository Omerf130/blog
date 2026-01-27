## Step 4 Testing Guide ✅

## What Was Completed

**Step 4: Core Models & APIs**

### Files Created:

**Utilities:**
1. ✅ `lib/slug.ts` - Hebrew slug generation with uniqueness

**Models:**
2. ✅ `models/Category.ts` - Blog categories
3. ✅ `models/Lawyer.ts` - Lawyer profiles
4. ✅ `models/Post.ts` - Blog posts with full features

**Validators:**
5. ✅ `lib/validators/category.ts` - Category validation
6. ✅ `lib/validators/lawyer.ts` - Lawyer validation
7. ✅ `lib/validators/post.ts` - Post validation

**API Endpoints:**
8. ✅ `app/api/categories/route.ts` - List & create categories
9. ✅ `app/api/categories/[id]/route.ts` - Get, update, delete category
10. ✅ `app/api/lawyers/route.ts` - List & create lawyers
11. ✅ `app/api/lawyers/[id]/route.ts` - Get, update, delete lawyer
12. ✅ `app/api/posts/route.ts` - List & create posts (with filters)
13. ✅ `app/api/posts/[id]/route.ts` - Get, update, delete post
14. ✅ `app/api/posts/slug/[slugHe]/route.ts` - Get post by Hebrew slug

---

## Testing Flow

### Prerequisites

1. Make sure you're logged in as admin
2. Get your admin auth cookie (login via `/admin/login`)
3. Use Postman, Insomnia, or curl with cookies

---

### Test 1: Create Categories ✅

**Create first category:**

```bash
curl -X POST https://your-app.vercel.app/api/categories \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{
    "name": "דיני מקרקעין",
    "description": "מאמרים בנושא דיני מקרקעין ונדל\"ן"
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Category created successfully",
    "category": {
      "id": "...",
      "name": "דיני מקרקעין",
      "slugHe": "דיני-מקרקעין",
      "description": "..."
    }
  }
}
```

**Create more categories:**
- ליקויי בנייה
- רטיבות
- רכוש משותף
- תביעות קבלנים

**Success Criteria:**
- [ ] Hebrew slug generated automatically
- [ ] Slugs are unique
- [ ] Categories saved to MongoDB

---

### Test 2: List Categories ✅

```bash
curl https://your-app.vercel.app/api/categories
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "categories": [
      { "id": "...", "name": "דיני מקרקעין", "slugHe": "דיני-מקרקעין" },
      ...
    ],
    "total": 4
  }
}
```

**Success Criteria:**
- [ ] All categories returned
- [ ] Sorted alphabetically
- [ ] Hebrew slugs visible

---

### Test 3: Create Lawyer ✅

```bash
curl -X POST https://your-app.vercel.app/api/lawyers \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{
    "name": "עו\"ד יוסי כהן",
    "title": "שותף מייסד",
    "bio": "עורך דין מומחה בדיני מקרקעין ונדל\"ן עם ניסיון של 15 שנה",
    "phone": "050-1234567",
    "email": "yossi@keshet-law.co.il",
    "isActive": true
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Lawyer created successfully",
    "lawyer": {
      "id": "...",
      "name": "עו\"ד יוסי כהן",
      "title": "שותף מייסד",
      ...
    }
  }
}
```

**Success Criteria:**
- [ ] Lawyer created
- [ ] All fields saved correctly
- [ ] isActive defaults to true

---

### Test 4: Create Post ✅

**Important:** Use the actual category and lawyer IDs from previous tests.

```bash
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{
    "title": "כיצד להתמודד עם רטיבות בדירה",
    "summary": "מדריך מקיף לטיפול בבעיות רטיבות בנכסי מקרקעין",
    "content": "# כיצד להתמודד עם רטיבות\n\nרטיבות בדירה היא בעיה נפוצה...",
    "whatWeLearned": "חשוב לתעד את הנזק בצילומים ולפנות מיד לקבלן או הוועד",
    "categories": ["<category-id>"],
    "disputeType": "רטיבות",
    "authorLawyerId": "<lawyer-id>",
    "status": "published",
    "seo": {
      "title": "כיצד להתמודד עם רטיבות בדירה | משרד עורכי דין קשת",
      "description": "מדריך מקיף לטיפול בבעיות רטיבות בנכסי מקרקעין"
    }
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "message": "Post created successfully",
    "post": {
      "id": "...",
      "title": "כיצד להתמודד עם רטיבות בדירה",
      "slugHe": "כיצד-להתמודד-עם-רטיבות-בדירה",
      "status": "published",
      "publishedAt": "2026-01-27T...",
      "categories": [...],
      "authorLawyerId": {...}
    }
  }
}
```

**Success Criteria:**
- [ ] Post created with Hebrew slug
- [ ] Categories populated
- [ ] Lawyer populated
- [ ] publishedAt set (because status is published)
- [ ] SEO fields saved

---

### Test 5: List Posts ✅

**List all posts:**
```bash
curl https://your-app.vercel.app/api/posts
```

**Filter by category:**
```bash
curl "https://your-app.vercel.app/api/posts?category=<category-id>"
```

**Filter by dispute type:**
```bash
curl "https://your-app.vercel.app/api/posts?disputeType=רטיבות"
```

**Search posts:**
```bash
curl "https://your-app.vercel.app/api/posts?q=רטיבות"
```

**With pagination:**
```bash
curl "https://your-app.vercel.app/api/posts?page=1&limit=10"
```

**Success Criteria:**
- [ ] Posts returned with pagination
- [ ] Filters work correctly
- [ ] Search works (requires text index)
- [ ] Categories and author populated

---

### Test 6: Get Post by Slug ✅

```bash
curl "https://your-app.vercel.app/api/posts/slug/כיצד-להתמודד-עם-רטיבות-בדירה"
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "post": {
      "title": "כיצד להתמודד עם רטיבות בדירה",
      "slugHe": "כיצד-להתמודד-עם-רטיבות-בדירה",
      "content": "...",
      "categories": [...],
      "authorLawyerId": {...}
    }
  }
}
```

**Success Criteria:**
- [ ] Post found by Hebrew slug
- [ ] Full content included
- [ ] All relations populated

---

### Test 7: Update Post ✅

```bash
curl -X PATCH https://your-app.vercel.app/api/posts/<post-id> \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{
    "title": "כיצד להתמודד עם רטיבות בדירה - מדריך מעודכן 2026",
    "status": "published"
  }'
```

**Success Criteria:**
- [ ] Title updated
- [ ] Slug regenerated (כיצד-להתמודד-עם-רטיבות-בדירה-מדריך-מעודכן-2026)
- [ ] Old slug is now free

---

### Test 8: Slug Uniqueness ✅

**Create two posts with same title:**

```bash
# First post
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{"title":"בדיקת ייחודיות", "summary":"...", "content":"...", "categories":["..."]}'

# Second post with same title
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{"title":"בדיקת ייחודיות", "summary":"...", "content":"...", "categories":["..."]}'
```

**Expected Slugs:**
- First: `בדיקת-ייחודיות`
- Second: `בדיקת-ייחודיות-2`

**Success Criteria:**
- [ ] Both posts created
- [ ] Slugs are unique
- [ ] Second slug has "-2" suffix

---

### Test 9: Delete Operations ✅

**Delete post (admin only):**
```bash
curl -X DELETE https://your-app.vercel.app/api/posts/<post-id> \
  -H "Cookie: keshet_session=your-session-token"
```

**Delete category (admin only):**
```bash
curl -X DELETE https://your-app.vercel.app/api/categories/<category-id> \
  -H "Cookie: keshet_session=your-session-token"
```

**Success Criteria:**
- [ ] Only admin can delete
- [ ] Editor gets 403 error
- [ ] Items removed from database

---

### Test 10: Validation Errors ✅

**Try creating post without required fields:**
```bash
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=your-session-token" \
  -d '{"title":"Test"}'
```

**Expected Response:**
```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [
    { "message": "Summary is required", "path": ["summary"] },
    { "message": "Content is required", "path": ["content"] },
    { "message": "At least one category is required", "path": ["categories"] }
  ]
}
```

**Success Criteria:**
- [ ] Validation errors returned
- [ ] Helpful error messages
- [ ] All missing fields listed

---

## Verification Checklist

Before moving to Step 5, confirm:

- [ ] Can create categories with Hebrew names
- [ ] Hebrew slugs generated automatically
- [ ] Slugs are unique (with -2, -3 suffix)
- [ ] Can create lawyers with all fields
- [ ] Can create posts with categories
- [ ] Posts can reference lawyers
- [ ] Can list posts with filters
- [ ] Can search posts
- [ ] Can get post by Hebrew slug
- [ ] Can update posts
- [ ] Slug updates when title changes
- [ ] Published posts have publishedAt date
- [ ] Only admin can delete
- [ ] Validation works correctly
- [ ] All data in MongoDB Atlas

---

## MongoDB Verification

Check in MongoDB Atlas:

**Collections:**
- `categories` - Hebrew names and slugs
- `lawyers` - Lawyer profiles
- `posts` - Posts with populated references

**Indexes:**
- `categories.slugHe` - Unique index
- `posts.slugHe` - Unique index  
- `posts` - Text index on title/summary/content

---

## Common Issues

**Issue: "At least one category is required"**
- Make sure categories array has valid ObjectIds
- Check categories exist in database

**Issue: "Lawyer not found"**
- Verify lawyer ID is correct ObjectId
- Make sure lawyer exists and is active

**Issue: Slug not unique**
- Check ensureUniqueSlug function
- Verify slug counter increments

---

## What's Working Now

✅ **Complete Blog Backend:**
- Categories with Hebrew slugs
- Lawyer profiles
- Full-featured blog posts
- CRUD operations for all entities
- Filtering and search
- Pagination
- Role-based access control

✅ **Ready for Step 5:**
- Admin pages to manage content
- UI for creating/editing posts
- Category management
- Lawyer management

---

**All tests passing?** ✅ Ready for Step 5! 🚀

