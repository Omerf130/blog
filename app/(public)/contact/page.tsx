import styles from './contact.module.scss';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>צור קשר</h1>

      <div className={styles.content}>
        <section className={styles.info}>
          <h2>פרטי התקשרות</h2>
          
          <div className={styles.contactItem}>
            <span className={styles.icon}>📞</span>
            <div>
              <strong>טלפון:</strong>
              <a href="tel:050-123-4567">050-123-4567</a>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.icon}>📧</span>
            <div>
              <strong>אימייל:</strong>
              <a href="mailto:info@keshet-law.co.il">info@keshet-law.co.il</a>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.icon}>📍</span>
            <div>
              <strong>כתובת:</strong>
              <p>רחוב הרצל 123, תל אביב</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.icon}>🕒</span>
            <div>
              <strong>שעות פעילות:</strong>
              <p>ראשון-חמישי: 9:00-18:00</p>
              <p>שישי: 9:00-13:00</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>זקוקים לייעוץ משפטי?</h2>
          <p>צרו איתנו קשר עוד היום לקבלת ייעוץ ראשוני ללא התחייבות</p>
          <a href="tel:050-123-4567" className={styles.button}>
            התקשרו עכשיו 📞
          </a>
        </section>
      </div>
    </div>
  );
}

