'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './documents.module.scss';

interface DocItem {
  _id: string;
  title: string;
  category?: { _id: string; name: string };
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadedBy?: { _id: string; name: string };
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.ok) {
        setDocuments(data.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.ok) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('יש לבחור קובץ');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (categoryId) formData.append('category', categoryId);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.ok) {
        await fetchDocuments();
        resetForm();
        setShowForm(false);
      } else {
        setError(data.error || 'שגיאה בהעלאה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, docTitle: string) => {
    if (!confirm(`האם למחוק את המסמך "${docTitle}"?`)) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.ok) {
        await fetchDocuments();
      } else {
        alert(data.error || 'שגיאה במחיקה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategoryId('');
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <span className={`${styles.fileType} ${styles.pdf}`}>PDF</span>;
    }
    return <span className={`${styles.fileType} ${styles.docx}`}>DOCX</span>;
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📄 ניהול מסמכים</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ העלאת מסמך</Button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2>העלאת מסמך חדש</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <Input
              label="כותרת המסמך *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="הסכם שכירות לדוגמה"
            />

            <div className={styles.field}>
              <label>קטגוריה</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">ללא קטגוריה</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>קובץ (PDF / DOCX) *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
                required
              />
              <div className={styles.fileHint}>גודל מקסימלי: 10MB</div>
            </div>

            <div className={styles.formActions}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'מעלה...' : 'העלה'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                ביטול
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableCard}>
        {documents.length === 0 ? (
          <div className={styles.empty}>
            <p>אין מסמכים עדיין</p>
            <Button onClick={() => setShowForm(true)}>העלה מסמך ראשון</Button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>כותרת</th>
                <th>קטגוריה</th>
                <th>סוג</th>
                <th>גודל</th>
                <th>תאריך</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>
                    <strong>{doc.title}</strong>
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                      {doc.originalFilename}
                    </div>
                  </td>
                  <td>
                    {doc.category ? (
                      <span className={styles.categoryBadge}>
                        {doc.category.name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{getFileTypeLabel(doc.mimeType)}</td>
                  <td>{formatFileSize(doc.fileSize)}</td>
                  <td>
                    {new Date(doc.createdAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className={styles.actions}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        window.open(
                          `/api/documents/${doc._id}/download`,
                          '_blank'
                        )
                      }
                    >
                      ⬇️ הורד
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(doc._id, doc.title)}
                    >
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

