# 🧪 Step 6 Testing: Public Blog Site

This guide walks you through testing the public-facing blog site.

---

## 📋 Prerequisites

1. You should have completed Steps 1-5 successfully
2. You have at least one category created
3. You have at least one lawyer profile created
4. You have at least one published post

---

## 🎯 What to Test

### 1️⃣ **Home Page**

**URL:** `http://localhost:3000/`

**Expected:**
- ✅ Header with logo and navigation links (ראשי, קטגוריות, אודות, צור קשר)
- ✅ Hero section with title "בלוג משפטי - משרד עורכי דין קשת"
- ✅ Categories section showing all categories as clickable cards
- ✅ Latest posts section showing up to 6 published posts
- ✅ Footer with contact information and links
- ✅ If no posts exist, should show "אין מאמרים פורסמים עדיין" with link to create first post

**Actions:**
1. Visit the home page
2. Click on a category card → should navigate to `/קטגוריה/[slug]`
3. Click on a post card → should navigate to `/מאמר/[slug]`
4. Check the header navigation links work
5. Check the footer links work

---

### 2️⃣ **Categories Listing Page**

**URL:** `http://localhost:3000/categories`

**Expected:**
- ✅ Header with title "📂 כל הקטגוריות"
- ✅ Grid of category cards showing category name and post count
- ✅ Clicking a category navigates to category page
- ✅ If no categories exist, shows "אין קטגוריות עדיין"

**Actions:**
1. Visit `/categories`
2. Verify all categories are displayed
3. Verify post counts are correct
4. Click on a category → should navigate to `/קטגוריה/[slug]`

---

### 3️⃣ **Single Category Page**

**URL:** `http://localhost:3000/קטגוריה/[slugHe]`

**Example:** `http://localhost:3000/קטגוריה/דיני-נדלן`

**Expected:**
- ✅ Header with category name and post count
- ✅ Grid of posts belonging to this category
- ✅ Each post shows: title, summary, categories, date, author
- ✅ Clicking a post navigates to post detail page
- ✅ If no posts in category, shows "אין מאמרים בקטגוריה זו עדיין"
- ✅ If category doesn't exist, shows 404 page

**Actions:**
1. Visit a category page (e.g., from home page or categories listing)
2. Verify correct posts are displayed
3. Verify post count is accurate
4. Click on a post → should navigate to `/מאמר/[slug]`
5. Try accessing a non-existent category (e.g., `/קטגוריה/fake-category`) → should show 404

---

### 4️⃣ **Single Post Page**

**URL:** `http://localhost:3000/מאמר/[slugHe]`

**Example:** `http://localhost:3000/מאמר/מדריך-לרכישת-דירה`

**Expected:**
- ✅ Categories badges at the top (clickable)
- ✅ Post title (large, prominent)
- ✅ Post summary (if exists)
- ✅ Published date and author name
- ✅ Full post content (rendered as HTML)
- ✅ "מה למדנו?" section (if exists) - highlighted box
- ✅ Author card with photo, name, title, bio, and contact info
- ✅ CTA section at bottom: "זקוקים לייעוץ משפטי?" with "צור קשר עכשיו" button
- ✅ If post doesn't exist, shows 404 page

**Actions:**
1. Visit a post page (e.g., from home page or category page)
2. Verify all content is displayed correctly
3. Click on a category badge → should navigate to category page
4. Click on "צור קשר עכשיו" button → should navigate to `/contact`
5. Click author email/phone → should open mail client or phone dialer
6. Try accessing a non-existent post (e.g., `/מאמר/fake-post`) → should show 404

---

### 5️⃣ **About Page**

**URL:** `http://localhost:3000/about`

**Expected:**
- ✅ Title: "אודות משרד עורכי דין קשת"
- ✅ Multiple sections: "מי אנחנו", "תחומי התמחות", "למה לבחור בנו?"
- ✅ Clean layout with proper spacing

**Actions:**
1. Visit `/about` from header navigation
2. Verify content is displayed correctly
3. Verify RTL layout and Hebrew text

---

### 6️⃣ **Contact Page**

**URL:** `http://localhost:3000/contact`

**Expected:**
- ✅ Title: "צור קשר"
- ✅ Contact information section with phone, email, address, hours
- ✅ CTA section with "התקשרו עכשיו 📞" button
- ✅ Phone/email links are clickable

**Actions:**
1. Visit `/contact` from header navigation
2. Verify contact information is displayed
3. Click phone number → should open phone dialer
4. Click email → should open mail client
5. Click "התקשרו עכשיו 📞" button → should open phone dialer

---

### 7️⃣ **404 Page**

**URL:** Any non-existent page

**Expected:**
- ✅ Large "404" text
- ✅ Message: "הדף לא נמצא"
- ✅ "חזרה לדף הבית" button

**Actions:**
1. Visit a non-existent URL (e.g., `/fake-page`)
2. Verify 404 page is shown
3. Click "חזרה לדף הבית" → should navigate to home page

---

### 8️⃣ **Header & Footer (Global)**

**Expected:**

**Header:**
- ✅ Sticky header (stays at top when scrolling)
- ✅ Logo "⚖️ משרד עורכי דין קשת" links to home page
- ✅ Navigation: ראשי, קטגוריות, אודות, צור קשר
- ✅ Hover effects on navigation links
- ✅ Responsive on mobile (navigation stacks vertically)

**Footer:**
- ✅ Three columns: About, Links, Contact
- ✅ All links work correctly
- ✅ Copyright year is current year
- ✅ Responsive on mobile (columns stack)

**Actions:**
1. Navigate through different pages
2. Verify header stays visible when scrolling
3. Click logo → should navigate to home page
4. Click each navigation link → should navigate correctly
5. Verify footer links work
6. Test on mobile viewport (if possible)

---

## 🧪 Testing Scenarios

### Scenario 1: First-Time Visitor Journey

1. Start at home page
2. Browse categories
3. Click on a category
4. Read a post
5. Navigate to contact page
6. Return to home page

### Scenario 2: Empty State Testing

1. Delete all posts → home page should show "אין מאמרים פורסמים עדיין"
2. Delete all categories → categories page should show "אין קטגוריות עדיין"
3. Access non-existent post/category → should show 404

### Scenario 3: Draft Posts (Should NOT Appear)

1. Create a post with status "draft"
2. Verify it does NOT appear on home page
3. Verify it does NOT appear in category pages
4. Try accessing it directly by slug → should show 404 (draft posts should not be accessible)

---

## 🐛 Common Issues & Solutions

### Issue 1: Categories Not Showing on Home Page
**Problem:** `Available Categories: []` in console

**Solution:** Make sure you have created at least one category in the admin panel (`/admin/categories`)

### Issue 2: Posts Not Showing
**Problem:** No posts on home page

**Possible Causes:**
- Posts status is "draft" instead of "published"
- `publishedAt` date is not set
- No posts exist in the database

**Solution:** 
1. Go to `/admin/posts`
2. Check post status
3. Publish at least one post

### Issue 3: Hebrew URLs Not Working
**Problem:** Clicking on post/category shows 404

**Solution:** This is expected if you're using Windows - Hebrew characters in URLs might need special encoding. Try accessing the post/category from the UI (don't type the URL manually).

### Issue 4: Layout Broken
**Problem:** Text is left-aligned instead of right-aligned

**Solution:** Check that `app/layout.tsx` has `dir="rtl"` on the HTML element

---

## ✅ Success Criteria

You should be able to:

- ✅ View the home page with categories and latest posts
- ✅ Browse all categories
- ✅ View posts by category
- ✅ Read a full post with all its content
- ✅ See author information on posts
- ✅ Navigate between pages using header/footer
- ✅ Access about and contact pages
- ✅ See proper 404 page for non-existent pages
- ✅ All Hebrew text is displayed correctly (RTL)
- ✅ All links work correctly

---

## 📊 What We Built in Step 6

1. **Public Layout** (`app/(public)/layout.tsx`)
   - Header with logo and navigation
   - Footer with contact info and links
   - RTL-friendly design

2. **Home Page** (`app/page.tsx`)
   - Hero section
   - Categories grid
   - Latest posts grid

3. **PostCard Component** (`components/PostCard.tsx`)
   - Reusable card for displaying post previews
   - Shows title, summary, categories, date, author

4. **Categories Listing** (`app/(public)/categories/page.tsx`)
   - Shows all categories with post counts

5. **Single Category Page** (`app/(public)/קטגוריה/[slugHe]/page.tsx`)
   - Shows all posts in a category
   - Hebrew slug routing

6. **Single Post Page** (`app/(public)/מאמר/[slugHe]/page.tsx`)
   - Full post content
   - Author card
   - CTA section
   - Hebrew slug routing

7. **About Page** (`app/(public)/about/page.tsx`)
   - About the law firm

8. **Contact Page** (`app/(public)/contact/page.tsx`)
   - Contact information
   - CTA to call

9. **404 Page** (`app/not-found.tsx`)
   - Custom 404 error page

---

## 🎉 Next Steps

After confirming everything works:

1. Test on different devices (mobile, tablet, desktop)
2. Test with more posts and categories
3. Ready to continue to **Step 7: SEO & Metadata** 🚀

---

**Need help?** If something doesn't work as expected, double-check:
- MongoDB connection is active
- You have at least one published post
- Categories are assigned to posts
- Author (lawyer) is assigned to posts

