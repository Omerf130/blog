'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import styles from './about.module.scss';

const WHATSAPP_PHONE = '972549001774';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  role: string;
  topic: string;
  urgency: string;
  caseSummary: string;
  hasDocuments: boolean;
  preferredContact: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  role?: string;
  topic?: string;
  caseSummary?: string;
}

export default function AboutContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    role: '',
    topic: '',
    urgency: '',
    caseSummary: '',
    hasDocuments: false,
    preferredContact: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'שדה חובה';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'שדה חובה';
    }
    if (!formData.role) {
      newErrors.role = 'יש לבחור אפשרות';
    }
    if (!formData.topic) {
      newErrors.topic = 'יש לבחור אפשרות';
    }
    if (!formData.caseSummary.trim()) {
      newErrors.caseSummary = 'שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const lines = [
      'פנייה חדשה למרכז שיפוטי',
      '',
      `שם מלא: ${formData.fullName}`,
      `טלפון: ${formData.phone}`,
      `אימייל: ${formData.email || '-'}`,
      `עיר/יישוב: ${formData.city || '-'}`,
      `מי הפונה: ${formData.role}`,
      `תחום הפנייה: ${formData.topic}`,
      `דחיפות: ${formData.urgency || '-'}`,
      `יש מסמכים: ${formData.hasDocuments ? 'כן' : 'לא'}`,
      `דרך יצירת קשר מועדפת: ${formData.preferredContact || '-'}`,
      `תיאור המקרה: ${formData.caseSummary}`,
    ];

    const message = lines.join('\n');
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <section className={styles.formCard}>
      <h2 className={styles.formTitle}>פנייה לייעוץ ראשוני</h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formSection}>
          <h3>פרטים אישיים</h3>

          <div className={styles.formRow}>
            <Input
              label="שם מלא *"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              placeholder="שם מלא"
            />

            <Input
              label="טלפון *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="050-1234567"
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="אימייל"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
            />

            <Input
              label="עיר / יישוב"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="עיר מגורים"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>פרטי הפנייה</h3>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>מי הפונה? *</label>
              <select
                className={`${styles.select} ${errors.role ? styles.selectError : ''}`}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">-- בחר --</option>
                <option value="דייר/ת">דייר/ת</option>
                <option value="ועד בית / נציגות">ועד בית / נציגות</option>
                <option value="קבלן/יזם">קבלן/יזם</option>
                <option value="אחר">אחר</option>
              </select>
              {errors.role && <span className={styles.fieldError}>{errors.role}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>תחום הפנייה *</label>
              <select
                className={`${styles.select} ${errors.topic ? styles.selectError : ''}`}
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              >
                <option value="">-- בחר --</option>
                <option value="יישוב סכסוכי שכנים">יישוב סכסוכי שכנים</option>
                <option value="ליקויי בנייה">ליקויי בנייה</option>
                <option value="שירותים לוועדי בתים ונציגויות">שירותים לוועדי בתים ונציגויות</option>
                <option value="רישום בית משותף והסדרת זכויות">רישום בית משותף והסדרת זכויות</option>
              </select>
              {errors.topic && <span className={styles.fieldError}>{errors.topic}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>דחיפות</label>
            <select
              className={styles.select}
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            >
              <option value="">-- בחר --</option>
              <option value="מיידי">מיידי</option>
              <option value="השבוע">השבוע</option>
              <option value="החודש">החודש</option>
              <option value="לא דחוף">לא דחוף</option>
            </select>
          </div>

          <Textarea
            label="תיאור קצר של המקרה (מה קרה, מול מי, ומה מבוקש) *"
            value={formData.caseSummary}
            onChange={(e) => setFormData({ ...formData, caseSummary: e.target.value })}
            error={errors.caseSummary}
            placeholder="תארו בקצרה את המקרה..."
            rows={5}
          />
        </div>

        <div className={styles.formSection}>
          <h3>פרטים נוספים</h3>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.hasDocuments}
                onChange={(e) => setFormData({ ...formData, hasDocuments: e.target.checked })}
                className={styles.checkboxInput}
              />
              <span>יש מסמכים רלוונטיים (נסח טאבו / תקנון / תשריט / התכתבויות / חוות דעת)</span>
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>דרך יצירת קשר מועדפת</label>
            <div className={styles.radioGroup}>
              {['טלפון', 'וואטסאפ', 'אימייל'].map((option) => (
                <label key={option} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="preferredContact"
                    value={option}
                    checked={formData.preferredContact === option}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className={styles.radioInput}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <p>
            <strong>שים לב:</strong> לאחר לחיצה על &quot;שלח פנייה&quot;, הפנייה תישלח ישירות
            לוואטסאפ שלנו. נחזור אליך בהקדם האפשרי.
          </p>
        </div>

        <div className={styles.actions}>
          <Button type="submit" fullWidth>
            שלח פנייה בוואטסאפ 📨
          </Button>
        </div>
      </form>
    </section>
  );
}

