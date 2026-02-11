import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import styles from './home.module.scss';

export const dynamic = 'force-dynamic';

const POSTS_PER_PAGE = 6;

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

/** Build the page number array with ellipsis for the pagination bar. */
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  await connectDB();

  // Check if user is authenticated
  const user = await getCurrentUser();

  // Parse & clamp page number
  const pageParam = parseInt(searchParams.page || '1', 10);
  const requestedPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const query = { status: 'published' };

  // Fetch posts + total count in parallel
  const [postsRaw, totalPosts] = await Promise.all([
    Post.find(query)
      .populate('categories', 'name slugHe')
      .populate('authorLawyerId', 'name title slugHe')
      .sort({ publishedAt: -1 })
      .skip((requestedPage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .select('-content')
      .lean(),
    Post.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  // Serialize data for client components (include featuredImage for hero)
  const posts = postsRaw.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    summary: post.summary,
    slugHe: post.slugHe,
    publishedAt: post.publishedAt,
    featuredImage: post.featuredImage?.data
      ? {
          data: post.featuredImage.data,
          mimetype: post.featuredImage.mimetype,
          filename: post.featuredImage.filename,
        }
      : undefined,
    categories: post.categories?.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slugHe: cat.slugHe,
    })),
    authorLawyerId: post.authorLawyerId
      ? {
          _id: post.authorLawyerId._id.toString(),
          name: post.authorLawyerId.name,
          title: post.authorLawyerId.title,
          slugHe: post.authorLawyerId.slugHe,
        }
      : undefined,
  }));

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoPlaceholder}>
            <img 
              src="/assets/logo.png" 
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

      {/* Blog Feed */}
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📰 מאמרים אחרונים</h2>

          {posts.length === 0 ? (
            <div className={styles.empty}>
              <p>אין מאמרים עדיין</p>
              <Link href="/admin/posts/new">צור מאמר ראשון</Link>
            </div>
          ) : (
            <>
              <div className={styles.postsFeed}>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className={styles.pagination} aria-label="ניווט עמודים">
                  {currentPage > 1 ? (
                    <Link href={`/?page=${currentPage - 1}`} className={styles.pageLink}>
                      הקודם
                    </Link>
                  ) : (
                    <span className={styles.pageLinkDisabled}>הקודם</span>
                  )}

                  {pageNumbers.map((pageNum, idx) =>
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>
                        ...
                      </span>
                    ) : pageNum === currentPage ? (
                      <span
                        key={pageNum}
                        className={`${styles.pageLink} ${styles.pageLinkActive}`}
                      >
                        {pageNum}
                      </span>
                    ) : (
                      <Link
                        key={pageNum}
                        href={`/?page=${pageNum}`}
                        className={styles.pageLink}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}

                  {currentPage < totalPages ? (
                    <Link href={`/?page=${currentPage + 1}`} className={styles.pageLink}>
                      הבא
                    </Link>
                  ) : (
                    <span className={styles.pageLinkDisabled}>הבא</span>
                  )}
                </nav>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
