'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './downloads.module.scss';

interface DocItem {
  _id: string;
  title: string;
  category?: { _id: string; name: string };
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

export default function DownloadsPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check auth and fetch documents in parallel
    Promise.all([
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.data?.user) {
            setUser(data.data.user);
          }
        })
        .catch(() => {}),
      fetch('/api/documents/public')
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setDocuments(data.data.documents);
          }
        })
        .catch((err) => console.error('Error fetching documents:', err)),
    ]).finally(() => {
      setAuthChecked(true);
      setLoading(false);
    });
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeBadge = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <span className={`${styles.fileTypeBadge} ${styles.pdf}`}>PDF</span>;
    }
    return <span className={`${styles.fileTypeBadge} ${styles.docx}`}>DOCX</span>;
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📄 מסמכים להורדה</h1>
        <p className={styles.subtitle}>
          {documents.length} מסמכים זמינים להורדה
        </p>
      </div>

      {!user && authChecked ? (
        <div className={styles.loginPrompt}>
          <p>יש להתחבר כדי להוריד מסמכים</p>
          <Link href="/login" className={styles.loginBtn}>
            התחבר
          </Link>
        </div>
      ) : documents.length === 0 ? (
        <div className={styles.empty}>
          <p>אין מסמכים זמינים כרגע</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {documents.map((doc) => (
            <div key={doc._id} className={styles.card}>
              <h3 className={styles.cardTitle}>{doc.title}</h3>

              <div className={styles.cardMeta}>
                {doc.category && (
                  <span className={styles.categoryBadge}>
                    {doc.category.name}
                  </span>
                )}
                {getFileTypeBadge(doc.mimeType)}
              </div>

              <div className={styles.cardInfo}>
                <span className={styles.fileName}>{doc.originalFilename}</span>
                <span>{formatFileSize(doc.fileSize)}</span>
              </div>

              <a
                href={`/api/documents/${doc._id}/download`}
                className={styles.downloadBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                ⬇️ הורד מסמך
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

