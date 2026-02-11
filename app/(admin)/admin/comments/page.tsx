'use client';

import { useEffect, useState } from 'react';
import styles from './comments.module.scss';

export const dynamic = 'force-dynamic';

type CommentStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface Comment {
  _id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  isLawyerReply: boolean;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  post: {
    _id: string;
    title: string;
    slugHe: string;
  };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommentStatus>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/admin/comments?status=${statusFilter}&page=${page}&limit=20`
      );
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to fetch comments');
      }

      setComments(data.data.comments);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [statusFilter, page]);

  const moderateComment = async (
    id: string,
    status: 'approved' | 'rejected',
    isLawyerReply = false
  ) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isLawyerReply }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to moderate comment');
      }

      // Refresh comments
      fetchComments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to delete comment');
      }

      // Refresh comments
      fetchComments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>💬 ניהול תגובות</h1>
      </div>

      {/* Status Filter */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>סטטוס:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as CommentStatus);
              setPage(1);
            }}
            className={styles.select}
          >
            <option value="all">הכל</option>
            <option value="pending">ממתין לאישור</option>
            <option value="approved">מאושר</option>
            <option value="rejected">נדחה</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>טוען תגובות...</div>
      ) : comments.length === 0 ? (
        <div className={styles.empty}>אין תגובות להצגה</div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <div className={styles.commentMeta}>
                  <span className={styles.userName}>{comment.user.name}</span>
                  <span className={styles.userEmail}>({comment.user.email})</span>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <span className={`${styles.badge} ${styles[comment.status]}`}>
                  {comment.status === 'pending' && '⏳ ממתין'}
                  {comment.status === 'approved' && '✅ מאושר'}
                  {comment.status === 'rejected' && '❌ נדחה'}
                </span>
              </div>

              <div className={styles.postInfo}>
                <strong>מאמר:</strong>{' '}
                <a
                  href={`/post/${comment.post._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {comment.post.title}
                </a>
              </div>

              <div className={styles.commentContent}>{comment.content}</div>

              {comment.isLawyerReply && (
                <div className={styles.lawyerBadge}>⚖️ תגובת עורך דין</div>
              )}

              <div className={styles.actions}>
                {comment.status !== 'approved' && (
                  <>
                    <button
                      onClick={() => moderateComment(comment._id, 'approved', false)}
                      className={`${styles.btn} ${styles.btnApprove}`}
                    >
                      ✅ אשר
                    </button>
                    <button
                      onClick={() => moderateComment(comment._id, 'approved', true)}
                      className={`${styles.btn} ${styles.btnLawyer}`}
                      title="סמן כתגובת עורך דין"
                    >
                      ⚖️ אשר כעו"ד
                    </button>
                  </>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    onClick={() => moderateComment(comment._id, 'rejected')}
                    className={`${styles.btn} ${styles.btnReject}`}
                  >
                    ❌ דחה
                  </button>
                )}
                <button
                  onClick={() => deleteComment(comment._id)}
                  className={`${styles.btn} ${styles.btnDelete}`}
                >
                  🗑️ מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={styles.paginationBtn}
          >
            ← הקודם
          </button>
          <span className={styles.pageInfo}>
            עמוד {page} מתוך {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={styles.paginationBtn}
          >
            הבא →
          </button>
        </div>
      )}
    </div>
  );
}

