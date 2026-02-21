'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.scss';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.ok) {
        // Login successful - update auth state and redirect
        await refreshUser();
        const redirectTo = searchParams.get('redirect') || '/';
        router.push(redirectTo);
      } else {
        setError(data.error || 'שגיאת התחברות');
      }
    } catch (err) {
      setError('שגיאת רשת. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>כניסה למערכת</h1>
        <p className={styles.subtitle}>משרד עורכי דין אשכנזי</p>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="הכנס אימייל..."
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            אין לך חשבון?{' '}
            <a href="/register" className={styles.link}>
              הרשם כאן
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <LoginForm />
    </Suspense>
  );
}

