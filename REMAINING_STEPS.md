# Remaining Steps - Project Roadmap 🗺️

## ✅ Completed (Steps 1-3)

- [x] **Step 1:** Project setup, Next.js, TypeScript, SCSS
- [x] **Step 2:** Database connection, User & Session models
- [x] **Step 3:** Authentication (bootstrap, login, logout, middleware)
- [x] **Code Review:** Improvements and helper functions

---

## 🚀 Remaining Steps (Steps 4-12)

### **STEP 4: Core Models & APIs** 📊
**Priority: HIGH** | **Estimated Time: 2-3 hours**

#### What to Build:
1. **Models:**
   - `models/Category.ts` - Blog categories with Hebrew slugs
   - `models/Lawyer.ts` - Lawyer profiles
   - `models/Post.ts` - Blog posts with full SEO

2. **Utilities:**
   - `lib/slug.ts` - Hebrew slug generation + uniqueness
   - `lib/seo.ts` - Metadata helpers and JSON-LD

3. **API Endpoints:**
   - `POST/GET /api/categories` - Create & list categories
   - `PATCH /api/categories/[id]` - Update category
   - `DELETE /api/categories/[id]` - Delete category (admin only)
   - `POST/GET /api/lawyers` - Lawyer CRUD
   - `PATCH/DELETE /api/lawyers/[id]` - Update/delete lawyer
   - `POST/GET /api/posts` - Post CRUD with filters
   - `GET /api/posts/slug/[slugHe]` - Get post by Hebrew slug
   - `PATCH /api/posts/[id]` - Update post
   - `DELETE /api/posts/[id]` - Delete post (admin only)

4. **Validators:**
   - `lib/validators/category.ts`
   - `lib/validators/lawyer.ts`
   - `lib/validators/post.ts`

**Testing:**
- Create categories via API
- Create lawyers via API
- Create posts with Hebrew slugs
- Verify slug uniqueness

---

### **STEP 5: Admin Pages for Content Management** 🎨
**Priority: HIGH** | **Estimated Time: 2-3 hours**

#### What to Build:
1. **Admin Layout:**
   - `app/(admin)/admin/layout.tsx` - Shared admin layout with nav
   - Sidebar navigation
   - Header with user info

2. **Category Management:**
   - `app/(admin)/admin/categories/page.tsx` - List categories
   - Create/edit category form

3. **Lawyer Management:**
   - `app/(admin)/admin/lawyers/page.tsx` - List lawyers
   - Create/edit lawyer form with photo upload

4. **Post Management:**
   - `app/(admin)/admin/posts/page.tsx` - List posts with filters
   - `app/(admin)/admin/posts/new/page.tsx` - Create post
   - `app/(admin)/admin/posts/[id]/edit/page.tsx` - Edit post
   - Rich text editor or textarea for content
   - Category selection (multi-select)
   - Dispute type dropdown
   - SEO fields

5. **Shared Components:**
   - `components/admin/Table.tsx` - Reusable admin table
   - `components/admin/Form.tsx` - Form wrapper
   - `components/ui/Button.tsx`
   - `components/ui/Input.tsx`
   - `components/ui/Select.tsx`

**Testing:**
- Create categories from admin panel
- Create lawyer profiles
- Create blog posts
- Edit and delete content

---

### **STEP 6: Public Blog Pages** 🌐
**Priority: HIGH** | **Estimated Time: 2-3 hours**

#### What to Build:
1. **Public Layout:**
   - `app/(public)/layout.tsx` - Public site layout
   - Header with navigation
   - Footer

2. **Home Page:**
   - `app/(public)/page.tsx` - Latest posts, categories
   - Search box
   - Featured posts

3. **Category Page:**
   - `app/(public)/קטגוריה/[slugHe]/page.tsx`
   - List posts in category
   - Breadcrumbs

4. **Post Detail Page:**
   - `app/(public)/[postSlugHe]/page.tsx`
   - Full post content
   - "What we learned" section
   - Author signature block
   - Share buttons (WhatsApp, Facebook, Twitter)
   - Print button
   - SEO metadata (generateMetadata)
   - JSON-LD structured data

5. **Components:**
   - `components/PostCard.tsx` - Post preview card
   - `components/CategoryBadge.tsx`
   - `components/ShareButtons.tsx`
   - `components/AuthorSignature.tsx`

**Testing:**
- Browse categories
- View posts
- Check Hebrew slugs work
- Verify SEO meta tags
- Test social share buttons

---

### **STEP 7: Comments System** 💬
**Priority: MEDIUM** | **Estimated Time: 1-2 hours**

#### What to Build:
1. **Model:**
   - `models/Comment.ts` - Comments with moderation

2. **API Endpoints:**
   - `POST /api/comments` - Add comment (requires login)
   - `GET /api/comments?postId=` - Get comments for post
   - `PATCH /api/comments/[id]` - Moderate (hide/show, mark as official)

3. **UI Components:**
   - `components/CommentList.tsx` - Display comments
   - `components/CommentForm.tsx` - Add comment form
   - Show "Login to comment" if not authenticated

4. **Admin Page:**
   - `app/(admin)/admin/comments/page.tsx` - Moderate comments
   - Approve/hide comments
   - Mark as "official lawyer reply"

**Testing:**
- Add comments as logged-in user
- Cannot comment when not logged in
- Admin can hide/show comments
- Official reply badge works

---

### **STEP 8: Lead Forms & "Ask a Lawyer"** 📥
**Priority: MEDIUM** | **Estimated Time: 2 hours**

#### What to Build:
1. **Models:**
   - `models/AskLawyer.ts` - Private inquiries per post
   - `models/Lead.ts` - Topic-based lead forms

2. **Utilities:**
   - `lib/whatsapp.ts` - wa.me link generator
   - Topic routing to phone numbers

3. **API Endpoints:**
   - `POST /api/ask-lawyer` - Submit private inquiry
   - `GET /api/ask-lawyer` - Admin list inquiries
   - `POST /api/leads` - Submit lead form
   - `GET /api/leads` - Admin list leads with filters
   - `GET /api/leads/export` - Export as CSV

4. **UI Components:**
   - `components/AskLawyerForm.tsx` - Form on post pages
   - `components/LeadForm.tsx` - Topic-based forms
   - WhatsApp CTA button after submission

5. **Admin Pages:**
   - `app/(admin)/admin/leads/page.tsx` - Manage leads
   - Filter by topic, status, date
   - Export button

6. **Validators:**
   - `lib/validators/lead.ts` - Form-specific validation

**Testing:**
- Submit "Ask a Lawyer" form from post
- Submit topic-based lead form
- Get WhatsApp link after submission
- Admin can view and filter leads
- Export leads to CSV

---

### **STEP 9: Downloads Library** 📥
**Priority: MEDIUM** | **Estimated Time: 1-2 hours**

#### What to Build:
1. **Model:**
   - `models/Download.ts` - Downloadable files with gating

2. **API Endpoints:**
   - `POST/GET /api/downloads` - CRUD downloads
   - `PATCH/DELETE /api/downloads/[id]`
   - `POST /api/downloads/[id]/track` - Track downloads + analytics

3. **Gating Logic:**
   - **free:** Direct download
   - **registeredOnly:** Require login
   - **leadRequired:** Require lead submission, then grant access

4. **Public Page:**
   - `app/(public)/הורדות/page.tsx` - List downloads
   - Show gating requirements
   - Handle download flow

5. **Admin Page:**
   - `app/(admin)/admin/downloads/page.tsx` - Manage downloads

**Testing:**
- Free downloads work immediately
- Registered-only requires login
- Lead-required shows lead form first
- Download tracking works

---

### **STEP 10: Video Library** 📹
**Priority: LOW** | **Estimated Time: 1 hour**

#### What to Build:
1. **Model:**
   - `models/Video.ts` - YouTube videos

2. **API Endpoints:**
   - `POST/GET /api/videos` - CRUD videos
   - `PATCH/DELETE /api/videos/[id]`

3. **Public Page:**
   - `app/(public)/וידאו-משפטי/page.tsx` - List videos
   - YouTube embeds

4. **Admin Page:**
   - `app/(admin)/admin/videos/page.tsx` - Manage videos

**Testing:**
- Add video with YouTube ID
- Embed displays correctly
- Admin can CRUD videos

---

### **STEP 11: Analytics** 📊
**Priority: LOW** | **Estimated Time: 1-2 hours**

#### What to Build:
1. **Model:**
   - `models/AnalyticsEvent.ts` - Event tracking

2. **API Endpoint:**
   - `POST /api/analytics` - Log events

3. **Tracking Points:**
   - Page views
   - Post views
   - Lead submissions
   - WhatsApp clicks
   - File downloads

4. **Admin Dashboard:**
   - Update `app/(admin)/admin/page.tsx`
   - Show basic stats
   - Recent events list

**Testing:**
- Events logged on actions
- Admin dashboard shows stats

---

### **STEP 12: SEO & Final Polish** ✨
**Priority: MEDIUM** | **Estimated Time: 1 hour**

#### What to Build:
1. **SEO Routes:**
   - `app/sitemap.xml/route.ts` - Dynamic sitemap
   - `app/robots.txt/route.ts` - Robots.txt

2. **Metadata:**
   - Implement `generateMetadata` for all public pages
   - JSON-LD structured data
   - Open Graph tags
   - Twitter Cards

3. **Public Pages:**
   - `app/(public)/הצוות/page.tsx` - List lawyers
   - `app/(public)/עו"ד/[slug]/page.tsx` - Lawyer profile

4. **Polish:**
   - Loading states
   - Error pages (404, 500)
   - Toast notifications
   - Accessibility improvements

**Testing:**
- Sitemap generates correctly
- Meta tags on all pages
- JSON-LD validates
- Lawyer profiles work

---

## Priority Summary

### Must Have (Core Features):
1. ✅ **Step 4** - Core models & APIs
2. ✅ **Step 5** - Admin content management
3. ✅ **Step 6** - Public blog pages

### Should Have (Main Features):
4. ✅ **Step 7** - Comments
5. ✅ **Step 8** - Lead forms & Ask a Lawyer
6. ✅ **Step 9** - Downloads library

### Nice to Have (Polish):
7. ⚡ **Step 10** - Video library
8. ⚡ **Step 11** - Analytics
9. ⚡ **Step 12** - SEO & final polish

---

## Estimated Timeline

- **Steps 4-6** (Core): ~6-9 hours
- **Steps 7-9** (Features): ~4-6 hours
- **Steps 10-12** (Polish): ~3-4 hours

**Total Remaining:** ~13-19 hours of implementation

**With Testing:** ~20-25 hours total

---

## Next Action

**Recommended:** Start with **Step 4** (Core Models & APIs)

This will give us:
- Categories, Lawyers, Posts models
- Hebrew slug generation
- All CRUD endpoints
- Foundation for admin pages and public site

**Ready to start Step 4?** 🚀

