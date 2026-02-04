import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import CommentSection from '@/components/CommentSection';
import styles from './post.module.scss';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: {
    slugHe: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  await connectDB();
  const { slugHe } = params;

  const post = await Post.findOne({ slugHe, status: 'published' })
    .populate('authorLawyerId', 'name')
    .lean();

  if (!post) {
    return {
      title: 'מאמר לא נמצא',
    };
  }

  const siteName = 'משרד עורכי דין אשכנזי';
  const postData = post as any;
  const title = `${postData.title} | ${siteName}`;
  const author = postData.authorLawyerId?.name || siteName;

  return {
    title,
    description: postData.summary,
    keywords: postData.tags?.join(', '),
    authors: [{ name: author }],
    openGraph: {
      title,
      description: postData.summary,
      type: 'article',
      siteName,
      publishedTime: postData.publishedAt?.toISOString(),
      modifiedTime: postData.updatedAt?.toISOString(),
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.summary,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  await connectDB();

  const postRaw = await Post.findOne({ slugHe: params.slugHe, status: 'published' })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title bio photoUrl email phone slugHe')
    .lean();

  if (!postRaw) {
    notFound();
  }

  // Check if user is authenticated
  const user = await getCurrentUser();

  // Serialize the post data
  const postData = postRaw as any;
  const post = {
    _id: postData._id.toString(),
    title: postData.title,
    summary: postData.summary,
    content: postData.content,
    whatWeLearned: postData.whatWeLearned,
    slugHe: postData.slugHe,
    publishedAt: postData.publishedAt,
    updatedAt: postData.updatedAt,
    categories: postData.categories?.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slugHe: cat.slugHe,
    })) || [],
    authorLawyerId: postData.authorLawyerId ? {
      _id: postData.authorLawyerId._id.toString(),
      name: postData.authorLawyerId.name,
      title: postData.authorLawyerId.title,
      bio: postData.authorLawyerId.bio,
      photoUrl: postData.authorLawyerId.photoUrl,
      email: postData.authorLawyerId.email,
      phone: postData.authorLawyerId.phone,
      slugHe: postData.authorLawyerId.slugHe,
    } : null,
  };

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        {post.categories && post.categories.length > 0 && (
          <div className={styles.categories}>
            {post.categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slugHe}`}
                className={styles.category}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <h1 className={styles.title}>{post.title}</h1>

        {post.summary && <p className={styles.summary}>{post.summary}</p>}

        <div className={styles.meta}>
          {publishDate && (
            <time className={styles.date} dateTime={post.publishedAt?.toString()}>
              📅 {publishDate}
            </time>
          )}
          {post.authorLawyerId && (
            <div className={styles.author}>
              ✍️ {post.authorLawyerId.name}
              {post.authorLawyerId.title && ` • ${post.authorLawyerId.title}`}
            </div>
          )}
        </div>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.whatWeLearned && (
        <div className={styles.whatWeLearned}>
          <h2>💡 מה למדנו?</h2>
          <div dangerouslySetInnerHTML={{ __html: post.whatWeLearned }} />
        </div>
      )}

      {post.authorLawyerId && (
        <div className={styles.authorCard}>
          <h3>אודות הכותב</h3>
          <div className={styles.authorInfo}>
            {post.authorLawyerId.photoUrl && (
              <img
                src={post.authorLawyerId.photoUrl}
                alt={post.authorLawyerId.name}
                className={styles.authorPhoto}
              />
            )}
            <div>
              <h4>{post.authorLawyerId.name}</h4>
              {post.authorLawyerId.title && <p className={styles.authorTitle}>{post.authorLawyerId.title}</p>}
              {post.authorLawyerId.bio && <p className={styles.authorBio}>{post.authorLawyerId.bio}</p>}
              <div className={styles.authorContact}>
                {post.authorLawyerId.email && (
                  <a href={`mailto:${post.authorLawyerId.email}`}>📧 {post.authorLawyerId.email}</a>
                )}
                {post.authorLawyerId.phone && (
                  <a href={`tel:${post.authorLawyerId.phone}`}>📞 {post.authorLawyerId.phone}</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.cta}>
        <h3>זקוקים לייעוץ משפטי?</h3>
        <p>צרו איתנו קשר עוד היום לקבלת ייעוץ ראשוני ללא התחייבות</p>
        <Link href="/contact" className={styles.ctaButton}>
          צור קשר עכשיו
        </Link>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post._id} isAuthenticated={!!user} />

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.summary,
            author: {
              '@type': 'Person',
              name: post.authorLawyerId?.name || 'משרד עורכי דין אשכנזי',
            },
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt?.toISOString(),
            publisher: {
              '@type': 'Organization',
              name: 'משרד עורכי דין אשכנזי',
              logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ashkenazi-law.com'}/assets/logo.jpeg`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ashkenazi-law.com'}/post/${post.slugHe}`,
            },
            ...(post.categories && post.categories.length > 0 && {
              keywords: post.categories.map((cat: any) => cat.name).join(', '),
            }),
          }),
        }}
      />
    </article>
  );
}

