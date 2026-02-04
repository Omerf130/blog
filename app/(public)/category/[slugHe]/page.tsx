import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';
import styles from './category.module.scss';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    slugHe: string;
  };
}

// Generate metadata for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  await connectDB();
  const { slugHe } = params;

  const category = await Category.findOne({ slugHe }).lean();

  if (!category) {
    return {
      title: 'קטגוריה לא נמצאה',
    };
  }

  const title = `${category.name} | משרד עורכי דין אשכנזי`;
  const description = category.description || `מאמרים בנושא ${category.name} - טיפים משפטיים, ייעוץ מקצועי ומידע משפטי`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'משרד עורכי דין אשכנזי',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connectDB();

  const category = await Category.findOne({ slugHe: params.slugHe }).lean();

  if (!category) {
    notFound();
  }

  const postsRaw = await Post.find({
    status: 'published',
    categories: category._id,
  })
    .populate('categories', 'name slugHe')
    .populate('authorLawyerId', 'name title slugHe')
    .sort({ publishedAt: -1 })
    .select('-content')
    .lean();

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📂 {category.name}</h1>
        <p className={styles.count}>{posts.length} מאמרים</p>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>אין מאמרים בקטגוריה זו עדיין</p>
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

