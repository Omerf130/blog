'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './posts.module.scss';

interface Post {
  _id: string;
  title: string;
  slugHe: string;
  status: string;
  categories: Array<{ _id: string; name: string }>;
  disputeType?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [filter, searchQuery]);

  const fetchPosts = async () => {
    try {
      let url = '/api/posts?limit=15';
      if (filter) url += `&status=${filter}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        setPosts(data.data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`האם למחוק את הפוסט "${title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.ok) {
        await fetchPosts();
      } else {
        alert(data.error || 'שגיאה במחיקה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, title: string) => {
    const statusNames: any = {
      draft: 'טיוטה',
      pendingApproval: 'ממתין לאישור',
      published: 'פורסם',
    };
    
    if (!confirm(`האם לשנות את הסטטוס של "${title}" ל-${statusNames[newStatus]}?`)) return;

    try {
      const updateData: any = { status: newStatus };
      
      // If publishing, set publishedAt to now
      if (newStatus === 'published') {
        updateData.publishedAt = new Date().toISOString();
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      const data = await res.json();

      if (data.ok) {
        await fetchPosts();
      } else {
        alert(data.error || 'שגיאה בשינוי סטטוס');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      draft: { text: 'טיוטה', className: styles.draft },
      pendingApproval: { text: 'ממתין לאישור', className: styles.pending },
      published: { text: 'פורסם', className: styles.published },
    };
    const badge = badges[status] || { text: status, className: '' };
    return <span className={`${styles.badge} ${badge.className}`}>{badge.text}</span>;
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📝 ניהול פוסטים</h1>
        <Link href="/admin/posts/new">
          <Button>+ פוסט חדש</Button>
        </Link>
      </div>

      <form
        className={styles.searchBar}
        onSubmit={(e) => {
          e.preventDefault();
          setSearchQuery(search);
        }}
      >
        <input
          type="text"
          className={styles.searchInput}
          placeholder="חיפוש לפי כותרת..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" size="sm">
          🔍 חפש
        </Button>
        {searchQuery && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setSearch('');
              setSearchQuery('');
            }}
          >
            ✕ נקה
          </Button>
        )}
      </form>

      <div className={styles.filters}>
        <Button
          size="sm"
          variant={filter === '' ? 'primary' : 'secondary'}
          onClick={() => setFilter('')}
        >
          הכל ({posts.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'published' ? 'primary' : 'secondary'}
          onClick={() => setFilter('published')}
        >
          פורסם
        </Button>
        <Button
          size="sm"
          variant={filter === 'draft' ? 'primary' : 'secondary'}
          onClick={() => setFilter('draft')}
        >
          טיוטות
        </Button>
        <Button
          size="sm"
          variant={filter === 'pendingApproval' ? 'primary' : 'secondary'}
          onClick={() => setFilter('pendingApproval')}
        >
          ממתין לאישור
        </Button>
      </div>

      <div className={styles.tableCard}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>אין פוסטים עדיין</p>
            <Link href="/admin/posts/new">
              <Button>צור פוסט ראשון</Button>
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>כותרת</th>
                <th>קטגוריות</th>
                <th>סטטוס</th>
                <th>תאריך</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className={styles.postTitle}>
                      <strong>{post.title}</strong>
                      <code className={styles.slug}>{post.slugHe}</code>
                    </div>
                  </td>
                  <td>
                    <div className={styles.categories}>
                      {post.categories.map((cat) => (
                        <span key={cat._id} className={styles.categoryTag}>
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{getStatusBadge(post.status)}</td>
                  <td>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('he-IL')
                      : new Date(post.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className={styles.actions}>
                    {/* Status change buttons */}
                    {post.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStatusChange(post._id, 'published', post.title)}
                      >
                        ✅ פרסם
                      </Button>
                    )}
                    {post.status === 'pendingApproval' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStatusChange(post._id, 'published', post.title)}
                      >
                        ✅ אשר ופרסם
                      </Button>
                    )}
                    {post.status === 'published' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange(post._id, 'draft', post.title)}
                      >
                        📥 הסר מפרסום
                      </Button>
                    )}
                    
                    <Link href={`/admin/posts/${post._id}/edit`}>
                      <Button size="sm" variant="secondary">
                        ✏️ ערוך
                      </Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(post._id, post.title)}>
                      🗑️ מחק
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

