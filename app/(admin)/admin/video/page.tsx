'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './video.module.scss';

export default function AdminVideoPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrl2, setVideoUrl2] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.ok) {
        setVideoUrl(data.data.settings.videoUrl || '');
        setVideoUrl2(data.data.settings.videoUrl2 || '');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, videoUrl2 }),
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess('סרטונים עודכנו בהצלחה! ✅');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'שגיאה בשמירה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (field: 'videoUrl' | 'videoUrl2') => {
    if (field === 'videoUrl') setVideoUrl('');
    else setVideoUrl2('');

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: '' }),
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess('הסרטון הוסר בהצלחה ✅');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'שגיאה בשמירה');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎬 ניהול סרטוני YouTube</h1>
        <p className={styles.subtitle}>הגדר סרטוני YouTube שיוצגו באתר</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Video 1 */}
        <div className={styles.card}>
          <h2>סרטון ראשון (עמוד הבית)</h2>
          <p className={styles.helperText}>
            הדבק קישור YouTube מלא. השאר ריק כדי להסתיר את הסרטון.
          </p>

          <Input
            label="קישור YouTube #1"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            dir="ltr"
          />

          {videoUrl && (
            <div className={styles.preview}>
              <p className={styles.previewLabel}>🔗 קישור נוכחי:</p>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={styles.previewLink} dir="ltr">
                {videoUrl}
              </a>
              <button
                type="button"
                onClick={() => handleRemove('videoUrl')}
                className={styles.removeBtn}
                disabled={saving}
              >
                🗑️ הסר
              </button>
            </div>
          )}
        </div>

        {/* Video 2 */}
        <div className={styles.card}>
          <h2>סרטון שני</h2>
          <p className={styles.helperText}>
            הדבק קישור YouTube מלא. השאר ריק כדי להסתיר את הסרטון.
          </p>

          <Input
            label="קישור YouTube #2"
            value={videoUrl2}
            onChange={(e) => setVideoUrl2(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            dir="ltr"
          />

          {videoUrl2 && (
            <div className={styles.preview}>
              <p className={styles.previewLabel}>🔗 קישור נוכחי:</p>
              <a href={videoUrl2} target="_blank" rel="noopener noreferrer" className={styles.previewLink} dir="ltr">
                {videoUrl2}
              </a>
              <button
                type="button"
                onClick={() => handleRemove('videoUrl2')}
                className={styles.removeBtn}
                disabled={saving}
              >
                🗑️ הסר
              </button>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={saving}>
            {saving ? 'שומר...' : '💾 שמור סרטונים'}
          </Button>
        </div>
      </form>
    </div>
  );
}
