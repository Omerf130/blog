import Link from 'next/link';
import styles from './public-layout.module.scss';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <h1>⚖️ משרד עורכי דין קשת</h1>
          </Link>
          <nav className={styles.nav}>
            <Link href="/">ראשי</Link>
            <Link href="/posts">מאמרים</Link>
            <Link href="/categories">קטגוריות</Link>
            <Link href="/about">אודות</Link>
            <Link href="/contact">צור קשר</Link>
            <Link href="/login" className={styles.loginLink}>התחבר</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>משרד עורכי דין קשת</h3>
            <p>מתמחים בדיני מקרקעין ונדל"ן</p>
          </div>

          <div className={styles.footerSection}>
            <h4>קישורים</h4>
            <Link href="/">ראשי</Link>
            <Link href="/posts">מאמרים</Link>
            <Link href="/categories">קטגוריות</Link>
            <Link href="/about">אודות</Link>
          </div>

          <div className={styles.footerSection}>
            <h4>צור קשר</h4>
            <p>📞 050-123-4567</p>
            <p>📧 info@keshet-law.co.il</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} משרד עורכי דין קשת. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

