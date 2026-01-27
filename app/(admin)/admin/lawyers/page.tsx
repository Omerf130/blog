'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from './lawyers.module.scss';

interface Lawyer {
  _id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  isActive: boolean;
  createdAt: string;
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photoUrl: '',
    phone: '',
    email: '',
    linkedIn: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await fetch('/api/lawyers');
      const data = await res.json();
      if (data.ok) {
        setLawyers(data.data.lawyers);
      }
    } catch (err) {
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingId ? `/api/lawyers/${editingId}` : '/api/lawyers';
      const method = editingId ? 'PATCH' : 'POST';

      // Clean empty optional fields
      const cleanData: any = { ...formData };
      if (!cleanData.photoUrl) delete cleanData.photoUrl;
      if (!cleanData.phone) delete cleanData.phone;
      if (!cleanData.email) delete cleanData.email;
      if (!cleanData.linkedIn) delete cleanData.linkedIn;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      const data = await res.json();

      if (data.ok) {
        await fetchLawyers();
        setShowForm(false);
        setEditingId(null);
        resetForm();
      } else {
        setError(data.error || 'שגיאה בשמירה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (lawyer: Lawyer) => {
    setFormData({
      name: lawyer.name,
      title: lawyer.title,
      bio: lawyer.bio,
      photoUrl: lawyer.photoUrl || '',
      phone: lawyer.phone || '',
      email: lawyer.email || '',
      linkedIn: lawyer.linkedIn || '',
      isActive: lawyer.isActive,
    });
    setEditingId(lawyer._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`האם למחוק את עו"ד ${name}?`)) return;

    try {
      const res = await fetch(`/api/lawyers/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.ok) {
        await fetchLawyers();
      } else {
        alert(data.error || 'שגיאה במחיקה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      photoUrl: '',
      phone: '',
      email: '',
      linkedIn: '',
      isActive: true,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
    setError('');
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>👨‍⚖️ ניהול עורכי דין</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ עורך דין חדש</Button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2>{editingId ? 'עריכת עורך דין' : 'עורך דין חדש'}</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.row}>
              <Input
                label="שם מלא *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder='עו"ד יוסי כהן'
              />

              <Input
                label="תפקיד *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="שותף מייסד"
              />
            </div>

            <Textarea
              label="ביוגרפיה *"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              placeholder="עורך דין מומחה בדיני מקרקעין..."
              rows={5}
            />

            <Input
              label="URL תמונה"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />

            <div className={styles.row}>
              <Input
                label="טלפון"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="050-1234567"
              />

              <Input
                label="אימייל"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="lawyer@example.com"
              />
            </div>

            <Input
              label="LinkedIn"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive">פעיל (מוצג באתר)</label>
            </div>

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
        {lawyers.length === 0 ? (
          <div className={styles.empty}>
            <p>אין עורכי דין עדיין</p>
            <Button onClick={() => setShowForm(true)}>הוסף עורך דין ראשון</Button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם</th>
                <th>תפקיד</th>
                <th>אימייל</th>
                <th>טלפון</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {lawyers.map((lawyer) => (
                <tr key={lawyer._id}>
                  <td><strong>{lawyer.name}</strong></td>
                  <td>{lawyer.title}</td>
                  <td>{lawyer.email || '-'}</td>
                  <td>{lawyer.phone || '-'}</td>
                  <td>
                    <span className={lawyer.isActive ? styles.active : styles.inactive}>
                      {lawyer.isActive ? '✓ פעיל' : '✗ לא פעיל'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(lawyer)}>
                      ✏️ ערוך
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(lawyer._id, lawyer.name)}>
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

