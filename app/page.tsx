import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import PostCard from '@/components/PostCard';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await connectDB();

  // Fetch latest published posts
  const postsRaw = await Post.find({ status: 'published' })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title')
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
    } : undefined,
  }));

  const categories = categoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slugHe: cat.slugHe,
  }));

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>בלוג משפטי - משרד עורכי דין קשת</h1>
        <p>מאמרים מקצועיים בדיני מקרקעין, נדל"ן וליקויי בנייה</p>
      </section>

      {categories.length > 0 && (
        <section className={styles.categories}>
          <h2>📂 קטגוריות</h2>
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
        </section>
      )}

      <section className={styles.posts}>
        <h2>📝 מאמרים אחרונים</h2>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>אין מאמרים פורסמים עדיין</p>
            <a href="/admin/posts/new" className={styles.adminLink}>
              צור מאמר ראשון ←
            </a>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

