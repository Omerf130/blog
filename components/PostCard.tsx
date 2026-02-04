import Link from 'next/link';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    summary: string;
    slugHe: string;
    categories?: Array<{ _id: string; name: string; slugHe: string }>;
    authorLawyerId?: { _id: string; name: string; title?: string; slugHe?: string };
    publishedAt?: Date;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className={styles.card}>
      <Link href={`/post/${post.slugHe}`} className={styles.link}>
        <div className={styles.content}>
          <h3 className={styles.title}>{post.title}</h3>
          <p className={styles.summary}>{post.summary}</p>

          <div className={styles.meta}>
            {post.categories && post.categories.length > 0 && (
              <div className={styles.categories}>
                {post.categories.slice(0, 2).map((cat) => (
                  <span key={cat._id} className={styles.category}>
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {publishDate && (
              <time className={styles.date} dateTime={post.publishedAt?.toString()}>
                {publishDate}
              </time>
            )}
          </div>

          {post.authorLawyerId && (
            <div className={styles.author}>
              {post.authorLawyerId.slugHe ? (
                <Link href={`/lawyer/${post.authorLawyerId.slugHe}`} className={styles.authorLink}>
                  <span className={styles.authorName}>{post.authorLawyerId.name}</span>
                  {post.authorLawyerId.title && (
                    <span className={styles.authorTitle}> • {post.authorLawyerId.title}</span>
                  )}
                </Link>
              ) : (
                <>
                  <span className={styles.authorName}>{post.authorLawyerId.name}</span>
                  {post.authorLawyerId.title && (
                    <span className={styles.authorTitle}> • {post.authorLawyerId.title}</span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

