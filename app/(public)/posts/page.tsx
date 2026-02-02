import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import PostCard from '@/components/PostCard';
import styles from './posts.module.scss';

export const dynamic = 'force-dynamic';

export default async function AllPostsPage() {
  await connectDB();

  // Fetch all published posts
  const postsRaw = await Post.find({ status: 'published' })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title')
    .sort({ publishedAt: -1 })
    .select('-content')
    .lean();

  // Fetch all categories for filter
  const categoriesRaw = await Category.find().sort({ name: 1 }).lean();

  // Serialize data
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
    } : undefined,
  }));

  const categories = categoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slugHe: cat.slugHe,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📚 כל המאמרים</h1>
        <p className={styles.subtitle}>
          {posts.length} מאמרים בנושאי משפט נדל"ן
        </p>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className={styles.categories}>
          <h2 className={styles.categoriesTitle}>סינון לפי קטגוריה:</h2>
          <div className={styles.categoryGrid}>
            <a href="/posts" className={styles.categoryCard}>
              הכל ({posts.length})
            </a>
            {categories.map((cat) => {
              const count = posts.filter((post) =>
                post.categories?.some((c: any) => c._id === cat._id)
              ).length;
              return (
                <a
                  key={cat._id}
                  href={`/category/${cat.slugHe}`}
                  className={styles.categoryCard}
                >
                  {cat.name} ({count})
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>אין מאמרים פורסמו עדיין</p>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

