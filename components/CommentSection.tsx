'use client';

import { useState, useEffect } from 'react';
import styles from './CommentSection.module.scss';

interface Comment {
  _id: string;
  content: string;
  isLawyerReply: boolean;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
}

interface CommentSectionProps {
  postId: string;
  isAuthenticated: boolean;
}

export default function CommentSection({ postId, isAuthenticated }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();

      if (data.ok) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!content.trim()) {
      setError('אנא כתוב תגובה');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      setSuccess('התגובה נשלחה בהצלחה! היא תופיע לאחר אישור.');
      setContent('');
      
      // Optionally refresh comments after a delay
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>💬 תגובות ({comments.length})</h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="כתוב תגובה..."
            className={styles.textarea}
            rows={4}
            maxLength={2000}
            disabled={submitting}
          />
          <div className={styles.formFooter}>
            <span className={styles.charCount}>
              {content.length} / 2000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className={styles.submitBtn}
            >
              {submitting ? 'שולח...' : 'שלח תגובה'}
            </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          <p>
            יש להתחבר כדי להגיב.{' '}
            <a href="/login">התחבר כאן</a>
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className={styles.loading}>טוען תגובות...</div>
      ) : comments.length === 0 ? (
        <div className={styles.empty}>אין תגובות עדיין. היה הראשון להגיב!</div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className={`${styles.comment} ${
                comment.isLawyerReply ? styles.lawyerReply : ''
              }`}
            >
              <div className={styles.commentHeader}>
                <span className={styles.userName}>
                  {comment.user.name}
                  {comment.isLawyerReply && (
                    <span className={styles.lawyerBadge}>⚖️ עורך דין</span>
                  )}
                </span>
                <span className={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.commentContent}>{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

