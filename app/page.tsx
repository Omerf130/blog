import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import styles from './home.module.scss';

export const dynamic = 'force-dynamic';

// Metadata for homepage
export const metadata: Metadata = {
  title: 'משרד עורכי דין אשכנזי - בלוג משפטי למקרקעין ונדל"ן',
  description: 'הבלוג המשפטי המוביל בנושאי נדל"ן, מקרקעין, ליקויי בנייה ודיני שכנים. טיפים משפטיים, מאמרים מקצועיים וייעוץ משפטי מעורכי דין מומחים.',
  keywords: 'עורך דין נדל"ן, עורך דין מקרקעין, ליקויי בנייה, דיני שכנים, בלוג משפטי, ייעוץ משפטי',
  openGraph: {
    title: 'משרד עורכי דין אשכנזי - בלוג משפטי למקרקעין ונדל"ן',
    description: 'הבלוג המשפטי המוביל בנושאי נדל"ן, מקרקעין, ליקויי בנייה ודיני שכנים',
    type: 'website',
    siteName: 'משרד עורכי דין אשכנזי',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'משרד עורכי דין אשכנזי - בלוג משפטי',
    description: 'הבלוג המשפטי המוביל בנושאי נדל"ן ומקרקעין',
  },
};

export default async function HomePage() {
  await connectDB();

  // Check if user is authenticated
  const user = await getCurrentUser();

  // Fetch latest published posts
  const postsRaw = await Post.find({ status: 'published' })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title slugHe')
    .sort({ publishedAt: -1 })
    .limit(6)
    .select('-content')
    .lean();

  // Fetch all categories
  const categoriesRaw = await Category.find().sort({ name: 1 }).lean();

  // Serialize data for client components
  const posts = postsRaw.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    summary: post.summary,
    slugHe: post.slugHe,
    publishedAt: post.publishedAt,
    categories: post.categories?.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slugHe: cat.slugHe,
    })),
    authorLawyerId: post.authorLawyerId ? {
      _id: post.authorLawyerId._id.toString(),
      name: post.authorLawyerId.name,
      title: post.authorLawyerId.title,
      slugHe: post.authorLawyerId.slugHe,
    } : undefined,
  }));

  const categories = categoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slugHe: cat.slugHe,
  }));

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          <div className={styles.contactInfo}>
            <span className={styles.callUs}>התקשרו אלינו:</span>
            <a href="tel:050-123-4567" className={styles.phoneNumber}>050-123-4567</a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoPlaceholder}>
            <img 
              src="/assets/logo.jpeg" 
              alt="משרד עורכי דין אשכנזי" 
              className={styles.logo}
            />
          </div>
          <h1 className={styles.heroTitle}>הבלוג המשפטי למקרקעין ונדל"ן</h1>
          <p className={styles.heroSubtitle}>
            טיפים חיוניים בנושאי נדל"ן, ליקויי בנייה ודיני מקרקעין מעורכי הדין במשרד קשת
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={styles.mainNav}>
        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat._id} href={`/category/${cat.slugHe}`} className={styles.navLink}>
                {cat.name}
              </Link>
            ))}
            {categories.length > 4 && (
              <Link href="/categories" className={styles.navLink}>
                עוד קטגוריות
              </Link>
            )}
          </div>

          <div className={styles.navRight}>
            <div className={styles.searchWrapper}>
              <SearchBar />
            </div>

            <div className={styles.authLinks}>
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'editor') && (
                    <Link href="/admin" className={styles.authLink}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      ניהול
                    </Link>
                  )}
                  <div className={styles.userInfo}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{user.name}</span>
                  </div>
                  <form action="/api/auth/logout" method="POST" className={styles.logoutForm}>
                    <button type="submit" className={styles.authLink}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      התנתק
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.authLink}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    התחבר
                  </Link>
                  <Link href="/register" className={styles.authLinkPrimary}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    הרשם
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Latest Posts Section */}
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📰 מאמרים אחרונים</h2>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <p>אין מאמרים עדיין</p>
              <Link href="/admin/posts/new">צור מאמר ראשון</Link>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📂 נושאים</h2>
            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/category/${cat.slugHe}`}
                  className={styles.categoryCard}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
