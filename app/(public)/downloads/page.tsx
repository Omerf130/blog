'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './downloads.module.scss';

interface DocItem {
  _id: string;
  title: string;
  description?: string;
  category?: { _id: string; name: string };
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function DownloadsPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 700);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchDocuments = async (query: string, category: string) => {
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      const url = `/api/documents/public${params.toString() ? `?${params}` : ''}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        setDocuments(data.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setCategories(data.data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchDocuments(debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory]);

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

  if (initialLoading) {
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

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="חיפוש לפי כותרת..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          className={styles.categoryFilter}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {documents.length === 0 ? (
        <div className={styles.empty}>
          <p>אין מסמכים זמינים כרגע</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {documents.map((doc) => (
            <div key={doc._id} className={styles.card}>
              <h3 className={styles.cardTitle}>{doc.title}</h3>

              {doc.description && (
                <p className={styles.cardDescription}>{doc.description}</p>
              )}

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

