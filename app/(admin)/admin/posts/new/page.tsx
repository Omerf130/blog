'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from './post-form.module.scss';

interface Category {
  _id: string;
  name: string;
}

interface Lawyer {
  _id: string;
  name: string;
  title: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    whatWeLearned: '',
    categories: [] as string[],
    disputeType: '',
    authorLawyerId: '',
    status: 'draft',
    featuredImage: null as { data: string; mimetype: string; filename: string; size: number } | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching categories and lawyers...');
      
      const [categoriesRes, lawyersRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/lawyers?isActive=true'),
      ]);

      console.log('📡 Categories Response Status:', categoriesRes.status);
      console.log('📡 Lawyers Response Status:', lawyersRes.status);

      const categoriesData = await categoriesRes.json();
      const lawyersData = await lawyersRes.json();

      console.log('📦 Categories Data:', categoriesData);
      console.log('📦 Lawyers Data:', lawyersData);

      if (categoriesData.ok) {
        setCategories(categoriesData.data.categories);
        console.log('✅ Categories loaded:', categoriesData.data.categories.length);
      } else {
        console.error('❌ Failed to load categories:', categoriesData.error);
      }

      if (lawyersData.ok) {
        setLawyers(lawyersData.data.lawyers);
        console.log('✅ Lawyers loaded:', lawyersData.data.lawyers.length);
      } else {
        console.error('❌ Failed to load lawyers:', lawyersData.error);
      }
    } catch (err) {
      console.error('💥 Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          disputeType: formData.disputeType || undefined,
          authorLawyerId: formData.authorLawyerId || undefined,
          featuredImage: formData.featuredImage || undefined,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push('/admin/posts');
      } else {
        setError(data.error || 'שגיאה בשמירה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      setError('גודל התמונה חייב להיות קטן מ-5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setError('פורמט תמונה לא נתמך. השתמש ב-JPEG, PNG, WEBP או GIF');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        featuredImage: {
          data: base64String,
          mimetype: file.type,
          filename: file.name,
          size: file.size,
        },
      }));
      setImagePreview(base64String);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: null }));
    setImagePreview(null);
  };

  const toggleCategory = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((id) => id !== catId)
        : [...prev.categories, catId],
    }));
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📝 פוסט חדש</h1>
        <Button variant="secondary" onClick={() => router.back()}>
          ← חזרה
        </Button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.card}>
          <h2>פרטים כלליים</h2>

          <Input
            label="כותרת *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="כותרת הפוסט"
          />

          <Textarea
            label="תקציר *"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
            placeholder="תקציר קצר (עד 500 תווים)"
            rows={3}
          />

          <Textarea
            label="תוכן מלא *"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            placeholder="תוכן הפוסט המלא..."
            rows={15}
          />

          <Textarea
            label='מה למדנו (אופציונלי)'
            value={formData.whatWeLearned}
            onChange={(e) => setFormData({ ...formData, whatWeLearned: e.target.value })}
            placeholder="לקח חשוב מהמאמר..."
            rows={4}
          />

          <div className={styles.field}>
            <label className={styles.fieldLabel}>תמונה ראשית (אופציונלי)</label>
            <p className={styles.helperText}>גודל מקסימלי: 5MB | פורמטים נתמכים: JPEG, PNG, WEBP, GIF</p>

            {!imagePreview ? (
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className={styles.uploadLabel}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span>בחר תמונה</span>
                </label>
              </div>
            ) : (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="תצוגה מקדימה" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={removeImage}
                  className={styles.removeImageBtn}
                >
                  🗑️ הסר תמונה
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>קטגוריזציה</h2>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>קטגוריות * (בחר לפחות אחת)</label>
            {categories.length === 0 ? (
              <div className={styles.emptyState}>
                <p>⚠️ אין קטגוריות זמינות</p>
                <a href="/admin/categories" target="_blank" className={styles.link}>
                  צור קטגוריה ראשונה ←
                </a>
              </div>
            ) : (
              <div className={styles.checkboxGroup}>
                {categories.map((cat) => (
                  <label key={cat._id} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>סוג סכסוך (אופציונלי)</label>
            <select
              className={styles.select}
              value={formData.disputeType}
              onChange={(e) => setFormData({ ...formData, disputeType: e.target.value })}
            >
              <option value="">ללא</option>
              <option value="רטיבות">רטיבות</option>
              <option value="ליקויי בנייה">ליקויי בנייה</option>
              <option value="רכוש משותף">רכוש משותף</option>
              <option value="פגמים נסתרים">פגמים נסתרים</option>
              <option value="קבלנים">קבלנים</option>
              <option value="שכנים">שכנים</option>
              <option value="רעש">רעש</option>
              <option value="הצפה">הצפה</option>
              <option value="סדקים">סדקים</option>
              <option value="גג דולף">גג דולף</option>
              <option value="אחר">אחר</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>עורך דין מייחס (אופציונלי)</label>
            <select
              className={styles.select}
              value={formData.authorLawyerId}
              onChange={(e) => setFormData({ ...formData, authorLawyerId: e.target.value })}
            >
              <option value="">ללא</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.name} - {lawyer.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.card}>
          <h2>פרסום</h2>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>סטטוס</label>
            <select
              className={styles.select}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">טיוטה</option>
              <option value="pendingApproval">ממתין לאישור</option>
              <option value="published">פורסם</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={submitting || formData.categories.length === 0}>
            {submitting ? 'שומר...' : 'שמור פוסט'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
}

