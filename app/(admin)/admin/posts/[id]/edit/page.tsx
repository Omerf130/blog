'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import mammoth from 'mammoth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from '../../new/post-form.module.scss';

interface Category {
  _id: string;
  name: string;
}

interface Lawyer {
  _id: string;
  name: string;
  title: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Word file state
  const [docxActive, setDocxActive] = useState(false);
  const [docxFileName, setDocxFileName] = useState('');
  const [docxProcessing, setDocxProcessing] = useState(false);

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
  }, [postId]);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching post, categories and lawyers...');

      const [postRes, categoriesRes, lawyersRes] = await Promise.all([
        fetch(`/api/posts/${postId}`),
        fetch('/api/categories'),
        fetch('/api/lawyers?isActive=true'),
      ]);

      if (!postRes.ok) {
        setError('פוסט לא נמצא');
        setLoading(false);
        return;
      }

      const postData = await postRes.json();
      const categoriesData = await categoriesRes.json();
      const lawyersData = await lawyersRes.json();

      console.log('📦 Post Data:', postData);

      if (postData.ok && postData.data.post) {
        const post = postData.data.post;
        
        // Extract category IDs (handle both populated and non-populated)
        const categoryIds = post.categories?.map((cat: any) => 
          typeof cat === 'string' ? cat : cat._id
        ) || [];

        setFormData({
          title: post.title || '',
          summary: post.summary || '',
          content: post.content || '',
          whatWeLearned: post.whatWeLearned || '',
          categories: categoryIds,
          disputeType: post.disputeType || '',
          authorLawyerId: typeof post.authorLawyerId === 'string' 
            ? post.authorLawyerId 
            : post.authorLawyerId?._id || '',
          status: post.status || 'draft',
          featuredImage: post.featuredImage || null,
        });

        if (post.featuredImage?.data) {
          setImagePreview(post.featuredImage.data);
        }

        console.log('✅ Post loaded');
      }

      if (categoriesData.ok) {
        setCategories(categoriesData.data.categories);
        console.log('✅ Categories loaded:', categoriesData.data.categories.length);
      }

      if (lawyersData.ok) {
        setLawyers(lawyersData.data.lawyers);
        console.log('✅ Lawyers loaded:', lawyersData.data.lawyers.length);
      }
    } catch (err) {
      console.error('💥 Error fetching data:', err);
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('יש להעלות קובץ Word בפורמט .docx בלבד');
      return;
    }

    setDocxProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      // Extract title from filename (remove .docx extension)
      const title = file.name.replace(/\.docx$/i, '');

      setFormData((prev) => ({
        ...prev,
        title,
        content: result.value,
      }));

      setDocxActive(true);
      setDocxFileName(file.name);

      if (result.messages.length > 0) {
        console.warn('Mammoth warnings:', result.messages);
      }

      console.log('✅ Word file converted successfully');
    } catch (err) {
      console.error('❌ Error converting Word file:', err);
      setError('שגיאה בהמרת קובץ ה-Word. ודא שהקובץ תקין.');
    } finally {
      setDocxProcessing(false);
      // Reset the input so the same file can be re-uploaded
      e.target.value = '';
    }
  };

  const removeDocx = () => {
    setDocxActive(false);
    setDocxFileName('');
    setFormData((prev) => ({
      ...prev,
      title: '',
      content: '',
      whatWeLearned: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          disputeType: formData.disputeType || undefined,
          authorLawyerId: formData.authorLawyerId || undefined,
          featuredImage: formData.featuredImage || null,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push('/admin/posts');
      } else {
        setError(data.error || 'שגיאה בעדכון');
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

  if (error && !formData.title) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Button onClick={() => router.back()}>← חזרה</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>✏️ עריכת פוסט</h1>
        <Button variant="secondary" onClick={() => router.back()}>
          ← חזרה
        </Button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Word File Upload Section */}
        <div className={styles.card}>
          <h2>📄 העלאת קובץ Word</h2>
          <p className={styles.helperText}>
            העלה קובץ Word (.docx) כדי להחליף את תוכן הפוסט. שאר השדות (תמונה, קטגוריות) יישארו ללא שינוי.
          </p>

          {!docxActive ? (
            <div className={styles.docxUpload}>
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleDocxUpload}
                className={styles.fileInput}
                id="docxUploadEdit"
                disabled={docxProcessing}
              />
              <label htmlFor="docxUploadEdit" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>📄</span>
                <span>{docxProcessing ? 'ממיר קובץ...' : 'בחר קובץ Word (.docx)'}</span>
              </label>
            </div>
          ) : (
            <div className={styles.docxActiveBox}>
              <div className={styles.docxInfo}>
                <span className={styles.docxIcon}>✅</span>
                <span className={styles.docxName}>{docxFileName}</span>
                <span className={styles.docxBadge}>קובץ Word נטען</span>
              </div>
              <button
                type="button"
                onClick={removeDocx}
                className={styles.removeDocxBtn}
              >
                🗑️ הסר קובץ Word
              </button>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2>פרטים כלליים</h2>

          {docxActive && (
            <div className={styles.docxNotice}>
              📌 השדות הבאים מולאו מקובץ ה-Word ואינם ניתנים לעריכה. להסרת הקובץ, לחץ על "הסר קובץ Word" למעלה.
            </div>
          )}

          <div className={docxActive ? styles.disabledField : undefined}>
            <Input
              label="כותרת *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="כותרת הפוסט"
              disabled={docxActive}
            />
          </div>

          <Textarea
            label="תקציר *"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
            placeholder="תקציר קצר (עד 500 תווים)"
            rows={3}
          />

          <div className={docxActive ? styles.disabledField : undefined}>
            <Textarea
              label="תוכן מלא *"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="תוכן הפוסט המלא..."
              rows={15}
              disabled={docxActive}
            />
          </div>

          <div className={docxActive ? styles.disabledField : undefined}>
            <Textarea
              label='מה למדנו (אופציונלי)'
              value={formData.whatWeLearned}
              onChange={(e) => setFormData({ ...formData, whatWeLearned: e.target.value })}
              placeholder="לקח חשוב מהמאמר..."
              rows={4}
              disabled={docxActive}
            />
          </div>

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
                  id="imageUploadEdit"
                />
                <label htmlFor="imageUploadEdit" className={styles.uploadLabel}>
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
            {submitting ? 'מעדכן...' : 'עדכן פוסט'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
}
