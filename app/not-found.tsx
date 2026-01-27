import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>הדף לא נמצא</h2>
        <p className={styles.message}>
          מצטערים, הדף שחיפשת אינו קיים או הוסר
        </p>
        <Link href="/" className={styles.button}>
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

