import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import SiteSettings from '@/models/SiteSettings';
// Import models used in .populate() so Mongoose registers their schemas
import '@/models/Category';
import '@/models/Lawyer';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import YouTubePlayer from '@/components/YouTubePlayer';
import Link from 'next/link';
import AuthLinks from '@/components/AuthLinks';
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

  // Parse & clamp page number
  const pageParam = parseInt(searchParams.page || '1', 10);
  const requestedPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const query = { status: 'published' };

  // Fetch posts + total count + site settings in parallel
  const [postsRaw, totalPosts, siteSettings] = await Promise.all([
    Post.find(query)
      .populate('categories', 'name slugHe')
      .populate('authorLawyerId', 'name title slugHe')
      .sort({ publishedAt: -1 })
      .skip((requestedPage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .select('-content')
      .lean(),
    Post.countDocuments(query),
    SiteSettings.findOne({ key: 'main' }).lean(),
  ]);

  const videoUrl = (siteSettings as any)?.videoUrl || '';
  const videoUrl2 = (siteSettings as any)?.videoUrl2 || '';

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
          <h1 className={styles.heroTitle}>שיפוטי - המרכז לייעוץ משפטי לוועדי בית וליישוב סכסוכי שכנים וליקויי בנייה</h1>
          <p className={styles.heroSubtitle}>
            טיפים חיוניים בנושאי נדל"ן, ליקויי בנייה ודיני מקרקעין מעורכי הדין במשרד 
          </p>
          <a href="/ask-lawyer" className={styles.heroCta}>לייעוץ משפטי - זמן שיחת ייעוץ חינם</a>
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
              <AuthLinks />
            </div>
          </div>
        </div>
      </nav>

       {/* YouTube Videos (from admin settings) */}
       {videoUrl && (
        <div className={styles.videoSection}>
          <YouTubePlayer videoUrl={videoUrl} />
        </div>
      )}
     

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

      {videoUrl2 && (
        <div className={styles.videoSection}>
          <YouTubePlayer videoUrl={videoUrl2} />
        </div>
      )}
    </div>
  );
}
