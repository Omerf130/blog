'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import styles from './search.module.scss';

interface Post {
  _id: string;
  title: string;
  summary: string;
  slugHe: string;
  publishedAt: Date;
  categories?: Array<{ _id: string; name: string; slugHe: string }>;
  authorLawyerId?: { _id: string; name: string; title?: string; slugHe?: string };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim().length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.ok) {
          setPosts(data.data.posts);
          setTotal(data.data.total);
        } else {
          setError(data.error || 'Failed to search');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('שגיאה בחיפוש');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {query ? `תוצאות חיפוש עבור: "${query}"` : 'חיפוש'}
          </h1>
          {!loading && total > 0 && (
            <p className={styles.resultsCount}>נמצאו {total} תוצאות</p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>מחפש...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Empty Query */}
        {!loading && (!query || query.trim().length === 0) && (
          <div className={styles.empty}>
            <p>אנא הזן מילת חיפוש</p>
            <Link href="/">חזרה לדף הבית</Link>
          </div>
        )}

        {/* No Results */}
        {!loading && query && total === 0 && !error && (
          <div className={styles.empty}>
            <p>לא נמצאו תוצאות עבור "{query}"</p>
            <p className={styles.suggestion}>נסה מילים אחרות או <Link href="/">חזור לדף הבית</Link></p>
          </div>
        )}

        {/* Results */}
        {!loading && posts.length > 0 && (
          <div className={styles.results}>
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className={styles.searchPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>מחפש...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

