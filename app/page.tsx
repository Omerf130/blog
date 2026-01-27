import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>משרד עורכי דין קשת</h1>
        <p>בלוג משפטי + ניהול לידים</p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>🎉 ברוכים הבאים</h2>
          <p>המערכת הותקנה בהצלחה!</p>
          <ul>
            <li>✅ Next.js App Router</li>
            <li>✅ TypeScript</li>
            <li>✅ SCSS Modules</li>
            <li>✅ תמיכה מלאה בעברית (RTL)</li>
          </ul>
        </div>

        <div className={styles.nextSteps}>
          <h3>השלבים הבאים:</h3>
          <ol>
            <li>התקן את התלויות: <code>npm install</code></li>
            <li>צור קובץ <code>.env</code> והגדר את המשתנים</li>
            <li>הפעל את שרת הפיתוח: <code>npm run dev</code></li>
            <li>התחבר ל-MongoDB Atlas</li>
            <li>צור את המשתמש הראשון (admin)</li>
          </ol>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>נבנה עם ❤️ בישראל</p>
      </footer>
    </div>
  );
}

