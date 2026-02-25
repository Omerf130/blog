'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from './ask-lawyer.module.scss';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
}

export default function AskLawyerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const updateField = (field: keyof FormErrors, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שדה חובה';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'שם חייב להכיל לפחות 2 תווים';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'שדה חובה';
    } else if (formData.phone.trim().length < 9) {
      newErrors.phone = 'מספר טלפון לא תקין';
    } else if (!/^[0-9\-+\s()]+$/.test(formData.phone.trim())) {
      newErrors.phone = 'מספר טלפון יכול להכיל רק ספרות ותווים מיוחדים';
    }

    if (!formData.topic) {
      newErrors.topic = 'יש לבחור נושא';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'שדה חובה';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'ההודעה חייבת להכיל לפחות 10 תווים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          topic: '',
          message: '',
        });
      } else if (data.details && Array.isArray(data.details)) {
        // Map server validation errors to inline field errors
        const serverErrors: FormErrors = {};
        for (const detail of data.details) {
          const field = detail.path?.[0] as keyof FormErrors | undefined;
          if (field && !serverErrors[field]) {
            serverErrors[field] = detail.message;
          }
        }
        setErrors(serverErrors);
      } else {
        setError(data.error || 'שגיאה בשליחת הטופס');
      }
    } catch (err) {
      setError('שגיאת רשת. אנא נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h1>תודה על פנייתך!</h1>
          <p className={styles.successMessage}>
            קיבלנו את השאלה שלך ונחזור אליך בהקדם האפשרי.
            <br />
            אחד מעורכי הדין שלנו יצור איתך קשר בימים הקרובים.
          </p>
          <div className={styles.successActions}>
            <Button onClick={() => router.push('/')}>
              חזרה לדף הבית
            </Button>
            <Button variant="secondary" onClick={() => setSuccess(false)}>
              שלח שאלה נוספת
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>⚖️ שאל עורך דין</h1>
        <p className={styles.subtitle}>
          יש לך שאלה משפטית? צוות עורכי הדין שלנו כאן כדי לעזור.
          <br />
          מלא את הטופס ונחזור אליך בהקדם.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formSection}>
              <h2>פרטים אישיים</h2>
              
              <Input
                label="שם מלא *"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                error={errors.name}
                placeholder="שם מלא"
              />

              <Input
                label="אימייל *"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                placeholder="example@email.com"
              />

              <Input
                label="טלפון *"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                error={errors.phone}
                placeholder="050-1234567"
              />
            </div>

            <div className={styles.formSection}>
              <h2>נושא הפנייה</h2>
              
              <div className={styles.field}>
                <label className={styles.fieldLabel}>בחר נושא *</label>
                <select
                  className={`${styles.select} ${errors.topic ? styles.selectError : ''}`}
                  value={formData.topic}
                  onChange={(e) => updateField('topic', e.target.value)}
                >
                  <option value="">-- בחר נושא --</option>
                  <option value="דיני מקרקעין">דיני מקרקעין</option>
                  <option value="ליקויי בנייה">ליקויי בנייה</option>
                  <option value="דיני שכנים">דיני שכנים</option>
                  <option value="נדל&quot;ן">נדל"ן</option>
                  <option value="רכוש משותף">רכוש משותף</option>
                  <option value="פגמים נסתרים">פגמים נסתרים</option>
                  <option value="קבלנים">קבלנים</option>
                  <option value="אחר">אחר</option>
                </select>
                {errors.topic && <span className={styles.fieldError}>{errors.topic}</span>}
              </div>

              <Textarea
                label="תאר את השאלה או הבעיה המשפטית *"
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                error={errors.message}
                placeholder="ספר לנו בקצרה על המצב המשפטי שלך..."
                rows={8}
              />
            </div>

            <div className={styles.infoBox}>
              <p>
                ℹ️ <strong>שים לב:</strong> המידע שתשתף איתנו יישאר חסוי ולא ישותף עם צד שלישי.
                אנו נחזור אליך תוך 24-48 שעות בימי עבודה.
              </p>
            </div>

            <div className={styles.actions}>
              <Button type="submit" disabled={submitting} fullWidth>
                {submitting ? 'שולח...' : 'שלח שאלה 📨'}
              </Button>
            </div>
          </form>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>📞 יצירת קשר ישיר</h3>
            <div className={styles.contactItem}>
              <strong>טלפון:</strong>
              <a href="tel:050-123-4567">050-123-4567</a>
            </div>
            <div className={styles.contactItem}>
              <strong>אימייל:</strong>
              <a href="mailto:info@keshet-law.co.il">info@keshet-law.co.il</a>
            </div>
            <div className={styles.contactItem}>
              <strong>שעות פעילות:</strong>
              <p>ראשון-חמישי: 9:00-18:00</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>💡 למה לבחור בנו?</h3>
            <ul className={styles.benefitsList}>
              <li>✅ ניסיון של שנים בתחום</li>
              <li>✅ ייעוץ ראשוני ללא עלות</li>
              <li>✅ מענה מהיר תוך 24 שעות</li>
              <li>✅ שקיפות מלאה</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

