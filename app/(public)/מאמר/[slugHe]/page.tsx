import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';
import styles from './post.module.scss';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: {
    slugHe: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  await connectDB();

  const postRaw = await Post.findOne({ slugHe: params.slugHe, status: 'published' })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title bio photoUrl email phone')
    .lean();

  if (!postRaw) {
    notFound();
  }

  // Serialize the post data
  const post = {
    _id: (postRaw._id as any).toString(),
    title: postRaw.title,
    summary: postRaw.summary,
    content: postRaw.content,
    whatWeLearned: postRaw.whatWeLearned,
    slugHe: postRaw.slugHe,
    publishedAt: postRaw.publishedAt,
    categories: (postRaw.categories as any)?.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slugHe: cat.slugHe,
    })) || [],
    authorLawyerId: (postRaw.authorLawyerId as any) ? {
      _id: (postRaw.authorLawyerId as any)._id.toString(),
      name: (postRaw.authorLawyerId as any).name,
      title: (postRaw.authorLawyerId as any).title,
      bio: (postRaw.authorLawyerId as any).bio,
      photoUrl: (postRaw.authorLawyerId as any).photoUrl,
      email: (postRaw.authorLawyerId as any).email,
      phone: (postRaw.authorLawyerId as any).phone,
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
                href={`/קטגוריה/${cat.slugHe}`}
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
    </article>
  );
}

