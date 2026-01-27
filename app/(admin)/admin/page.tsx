import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import styles from './page.module.scss';

export default async function AdminDashboardPage() {
  // Require admin or editor role
  let user;
  try {
    user = await requireRole(['admin', 'editor']);
  } catch (error) {
    redirect('/admin/login');
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
          <div className={styles.card}>
            <h3>📝 פוסטים</h3>
            <p>ניהול פוסטים בבלוג המשפטי</p>
            <span className={styles.badge}>בקרוב</span>
          </div>

          <div className={styles.card}>
            <h3>📂 קטגוריות</h3>
            <p>ניהול קטגוריות ונושאים</p>
            <span className={styles.badge}>בקרוב</span>
          </div>

          <div className={styles.card}>
            <h3>💬 תגובות</h3>
            <p>מודרציה של תגובות</p>
            <span className={styles.badge}>בקרוב</span>
          </div>

          <div className={styles.card}>
            <h3>📥 לידים</h3>
            <p>ניהול פניות ולידים</p>
            <span className={styles.badge}>בקרוב</span>
          </div>

          <div className={styles.card}>
            <h3>📹 וידאו</h3>
            <p>ספריית וידאו</p>
            <span className={styles.badge}>בקרוב</span>
          </div>

          <div className={styles.card}>
            <h3>📥 הורדות</h3>
            <p>קבצים להורדה</p>
            <span className={styles.badge}>בקרוב</span>
          </div>
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

