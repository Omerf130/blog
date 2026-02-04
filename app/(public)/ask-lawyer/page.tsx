'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import styles from './ask-lawyer.module.scss';

export default function AskLawyerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="שם מלא"
              />

              <Input
                label="אימייל *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="example@email.com"
              />

              <Input
                label="טלפון *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="050-1234567"
              />
            </div>

            <div className={styles.formSection}>
              <h2>נושא הפנייה</h2>
              
              <div className={styles.field}>
                <label className={styles.fieldLabel}>בחר נושא *</label>
                <select
                  className={styles.select}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
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
              </div>

              <Textarea
                label="תאר את השאלה או הבעיה המשפטית *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
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

