# Step 7 Testing Guide 🧪

## Comments System Testing

Follow these steps to verify the commenting system works correctly.

---

## Prerequisites

1. ✅ MongoDB connected
2. ✅ At least one published post exists
3. ✅ Admin user exists
4. ✅ Regular user account exists (or create one)

---

## Test 1: Unauthenticated User

### Steps:
1. Open browser in **incognito mode** (or logout)
2. Navigate to a published post: `http://localhost:3000/מאמר/{slugHe}`
3. Scroll to the comments section

### Expected Results:
- ✅ Should see "יש להתחבר כדי להגיב"
- ✅ Should see "התחבר כאן" link
- ✅ Should NOT see comment form
- ✅ Should see existing approved comments (if any)

---

## Test 2: Submit Comment as Regular User

### Steps:
1. Login as a **regular user** (not admin)
2. Navigate to a published post
3. Scroll to comments section
4. Write a test comment: "זו תגובת בדיקה"
5. Click "שלח תגובה"

### Expected Results:
- ✅ Should see comment form with textarea
- ✅ Character counter shows: "0 / 2000"
- ✅ After submit: Success message appears
- ✅ Message says: "התגובה נשלחה בהצלחה! היא תופיע לאחר אישור."
- ✅ Comment does NOT appear in the list yet (pending approval)

### Test Edge Cases:
- Try submitting empty comment → Should show error
- Try submitting very long comment (>2000 chars) → Textarea blocks it

---

## Test 3: Admin Moderation

### Steps:
1. Login as **admin**
2. Navigate to: `http://localhost:3000/admin/comments`
3. Should see the pending comment

### Expected Results:
- ✅ Comment appears in list
- ✅ Status badge shows: "⏳ ממתין"
- ✅ User name and email visible
- ✅ Post title shown with link
- ✅ Comment content displayed

### Test Actions:

#### A. Approve Comment
1. Click "✅ אשר" button
2. Go back to the post page
3. **Expected:** Comment now appears publicly

#### B. Approve as Lawyer Reply
1. Submit another comment
2. In admin panel, click "⚖️ אשר כעו"ד"
3. Go to post page
4. **Expected:** Comment has blue gradient background and "⚖️ עורך דין" badge

#### C. Reject Comment
1. Submit another comment
2. In admin panel, click "❌ דחה"
3. Go to post page
4. **Expected:** Comment does NOT appear publicly

#### D. Delete Comment
1. In admin panel, click "🗑️ מחק"
2. Confirm deletion
3. **Expected:** Comment removed from list

---

## Test 4: Filtering and Pagination

### Steps:
1. In `/admin/comments`, use status filter dropdown
2. Select "ממתין לאישור" (pending)
3. Select "מאושר" (approved)
4. Select "נדחה" (rejected)
5. Select "הכל" (all)

### Expected Results:
- ✅ List updates based on filter
- ✅ If >20 comments, pagination appears
- ✅ Can navigate between pages

---

## Test 5: Multiple Comments Display

### Steps:
1. Create 3-4 approved comments (mix regular and lawyer replies)
2. View post page
3. Scroll to comments section

### Expected Results:
- ✅ All approved comments visible
- ✅ Sorted by newest first
- ✅ Lawyer replies have special styling:
  - Blue gradient background
  - "⚖️ עורך דין" badge
  - Border on the right
- ✅ Regular comments have white background
- ✅ Each shows: user name, date, content

---

## Test 6: Comments Locked

### Steps:
1. In admin, edit a post
2. Check "Lock Comments" (if you added this field)
3. Try to submit a comment on that post

### Expected Results:
- ✅ API returns 403 error
- ✅ Error message: "Comments are disabled for this post"

*Note: If you haven't added `commentsLocked` UI to post form yet, you can test this via API or MongoDB directly.*

---

## Test 7: API Testing (Optional)

### Using curl or Postman:

#### Get Comments (Public)
```bash
curl http://localhost:3000/api/comments?postId=YOUR_POST_ID
```
**Expected:** Returns approved comments only

#### Submit Comment (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=YOUR_SESSION_COOKIE" \
  -d '{"postId":"POST_ID","content":"Test comment"}'
```
**Expected:** Returns success with pending status

#### List All Comments (Admin)
```bash
curl http://localhost:3000/api/admin/comments?status=all \
  -H "Cookie: keshet_session=ADMIN_SESSION_COOKIE"
```
**Expected:** Returns all comments with full details

#### Moderate Comment (Admin)
```bash
curl -X PATCH http://localhost:3000/api/admin/comments/COMMENT_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: keshet_session=ADMIN_SESSION_COOKIE" \
  -d '{"status":"approved","isLawyerReply":false}'
```
**Expected:** Comment status updated

---

## Common Issues & Solutions

### Issue 1: "Authentication required" when logged in
**Solution:** Clear cookies and login again

### Issue 2: Comments not appearing after approval
**Solution:** 
- Check comment status in MongoDB
- Verify post ID matches
- Refresh the page (hard refresh: Ctrl+Shift+R)

### Issue 3: Admin page shows empty list
**Solution:**
- Check MongoDB for comments
- Verify filter is set to "הכל" (all)
- Check browser console for errors

### Issue 4: Cannot submit comment
**Solution:**
- Verify user is logged in
- Check post is published
- Check post ID is valid
- Look at browser console for errors

---

## Database Verification

### Check Comments in MongoDB:
```javascript
// In MongoDB Compass or Shell
db.comments.find().pretty()

// Check specific post's comments
db.comments.find({ postId: ObjectId("YOUR_POST_ID") })

// Check by status
db.comments.find({ status: "pending" })
db.comments.find({ status: "approved" })
```

---

## Success Criteria ✅

All tests should pass:
- [x] Unauthenticated users see login prompt
- [x] Authenticated users can submit comments
- [x] Comments start as pending
- [x] Admin can approve/reject/delete
- [x] Lawyer replies have special styling
- [x] Only approved comments visible publicly
- [x] Filtering and pagination work
- [x] Character limits enforced
- [x] Error handling works

---

## Next Steps

Once all tests pass:
1. ✅ Comments system is working!
2. 🚀 Ready for **Step 8: Lead Forms & "Ask a Lawyer"**

---

**Need help?** Check:
- Browser console for errors
- MongoDB for data
- Server logs for API errors
- Network tab for failed requests

