import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import styles from './page.module.scss';

// Force dynamic rendering (uses cookies for auth)
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Require admin or editor role
  let user;
  try {
    user = await requireRole(['admin', 'editor']);
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎛️ פאנל ניהול</h1>
        <div className={styles.userInfo}>
          <span>שלום, {user.name}</span>
          <span className={styles.role}>{user.role}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h2>ברוך הבא למערכת הניהול! 🎉</h2>
          <p>התחברת בהצלחה כ-{user.role}</p>
        </div>

        <div className={styles.grid}>
          <Link href="/admin/posts" className={styles.cardLink}>
            <div className={styles.card}>
              <h3>📝 פוסטים</h3>
              <p>ניהול פוסטים בבלוג המשפטי</p>
            </div>
          </Link>

          <Link href="/admin/categories" className={styles.cardLink}>
            <div className={styles.card}>
              <h3>📂 קטגוריות</h3>
              <p>ניהול קטגוריות ונושאים</p>
            </div>
          </Link>

          <Link href="/admin/comments" className={styles.cardLink}>
            <div className={styles.card}>
              <h3>💬 תגובות</h3>
              <p>מודרציה של תגובות</p>
            </div>
          </Link>

          <Link href="/admin/leads" className={styles.cardLink}>
            <div className={styles.card}>
              <h3>📥 לידים</h3>
              <p>ניהול פניות ולידים</p>
            </div>
          </Link>

          <Link href="/admin/video" className={styles.cardLink}>
            <div className={styles.card}>
              <h3>📹 וידאו</h3>
              <p>ספריית וידאו</p>
            </div>
          </Link>
        </div>

        <div className={styles.info}>
          <h3>פרטי משתמש:</h3>
          <ul>
            <li><strong>שם:</strong> {user.name}</li>
            <li><strong>אימייל:</strong> {user.email}</li>
            <li><strong>תפקיד:</strong> {user.role}</li>
            <li><strong>סטטוס:</strong> {user.status}</li>
          </ul>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button type="submit" className={styles.logoutBtn}>
            🚪 התנתק
          </button>
        </form>
      </main>
    </div>
  );
}

