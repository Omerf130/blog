import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Post from '@/models/Post';
import Link from 'next/link';
import styles from './categories.module.scss';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  await connectDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  // Count posts per category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat: any) => {
      const count = await Post.countDocuments({
        status: 'published',
        categories: cat._id,
      });
      return {
        _id: cat._id.toString(),
        name: cat.name,
        slugHe: cat.slugHe,
        count,
      };
    })
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📂 כל הקטגוריות</h1>
        <p className={styles.subtitle}>דפדפו במאמרים לפי נושאים</p>
      </div>

      {categoriesWithCounts.length === 0 ? (
        <div className={styles.empty}>
          <p>אין קטגוריות עדיין</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {categoriesWithCounts.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slugHe}`}
              className={styles.card}
            >
              <h2 className={styles.cardTitle}>{cat.name}</h2>
              <p className={styles.cardCount}>
                {cat.count} {cat.count === 1 ? 'מאמר' : 'מאמרים'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

