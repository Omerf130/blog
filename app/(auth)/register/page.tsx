'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './register.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful! Now auto-login the user
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const loginData = await loginRes.json();

      if (loginData.ok) {
        // Auto-login successful - redirect to home page
        router.push('/');
        router.refresh();
      } else {
        // Auto-login failed, redirect to login page
        alert('רישום הצליח! אנא התחבר');
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>הרשמה</h1>
        <p className={styles.subtitle}>צור חשבון חדש</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="שם מלא"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />

          <Input
            label="אימייל"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />

          <Input
            label="סיסמה"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
            helperText="לפחות 6 תווים"
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'רושם...' : 'הרשם'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            כבר יש לך חשבון?{' '}
            <Link href="/login" className={styles.link}>
              התחבר כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

