'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/app/home.module.scss';

export default function AuthLinks() {
  const { user, loading, refreshUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <>
        {(user.role === 'admin' || user.role === 'editor') && (
          <Link href="/admin" className={styles.authLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            ניהול
          </Link>
        )}
        <button type="button" onClick={handleLogout} className={styles.authLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          התנתק
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.authLink}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        התחבר
      </Link>
      <Link href="/register" className={styles.authLinkPrimary}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        הרשם
      </Link>
    </>
  );
}

