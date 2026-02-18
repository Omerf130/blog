import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import styles from './admin-layout.module.scss';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

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
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <AdminSidebar>
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
          <Link href="/admin/video" className={styles.navLink}>
            🎬 סרטון
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className={styles.logoutBtn}>
              🚪 התנתק
            </button>
          </form>
        </div>
      </AdminSidebar>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

