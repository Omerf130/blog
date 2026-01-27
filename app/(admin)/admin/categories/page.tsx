'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from './categories.module.scss';

interface Category {
  _id: string;
  name: string;
  slugHe: string;
  description?: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.ok) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.ok) {
        await fetchCategories();
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
      } else {
        setError(data.error || 'שגיאה בשמירה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`האם למחוק את הקטגוריה "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.ok) {
        await fetchCategories();
      } else {
        alert(data.error || 'שגיאה במחיקה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setError('');
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📂 ניהול קטגוריות</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ קטגוריה חדשה</Button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2>{editingId ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <Input
              label="שם הקטגוריה *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="למשל: דיני מקרקעין"
            />

            <Textarea
              label="תיאור"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="תיאור קצר של הקטגוריה (אופציונלי)"
            />

            <div className={styles.formActions}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'שומר...' : 'שמור'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                ביטול
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableCard}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <p>אין קטגוריות עדיין</p>
            <Button onClick={() => setShowForm(true)}>צור קטגוריה ראשונה</Button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם</th>
                <th>Slug</th>
                <th>תיאור</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td><strong>{cat.name}</strong></td>
                  <td><code>{cat.slugHe}</code></td>
                  <td>{cat.description || '-'}</td>
                  <td className={styles.actions}>
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(cat)}>
                      ✏️ ערוך
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(cat._id, cat.name)}>
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

