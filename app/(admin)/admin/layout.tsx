import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import styles from './admin-layout.module.scss';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require admin or editor role
  let user;
  try {
    user = await requireRole(['admin', 'editor']);
  } catch (error) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>🎛️ פאנל ניהול</h2>
          <p className={styles.userBadge}>
            {user.name} <span className={styles.role}>({user.role})</span>
          </p>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            🏠 דשבורד
          </Link>
          <Link href="/admin/categories" className={styles.navLink}>
            📂 קטגוריות
          </Link>
          <Link href="/admin/posts" className={styles.navLink}>
            📝 פוסטים
          </Link>
          <Link href="/admin/lawyers" className={styles.navLink}>
            👨‍⚖️ עורכי דין
          </Link>
          <Link href="/admin/comments" className={styles.navLink}>
            💬 תגובות
          </Link>
          <Link href="/admin/leads" className={styles.navLink}>
            📥 לידים
          </Link>
          <Link href="/admin/downloads" className={styles.navLink}>
            📥 הורדות
          </Link>
          <Link href="/admin/videos" className={styles.navLink}>
            📹 וידאו
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className={styles.logoutBtn}>
              🚪 התנתק
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

