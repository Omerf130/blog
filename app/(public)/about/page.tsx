import styles from './about.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>אודות משרד עורכי דין קשת</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>מי אנחנו</h2>
          <p>
            משרד עורכי דין קשת מתמחה בדיני מקרקעין, נדל"ן וליקויי בנייה. אנו מספקים
            ייעוץ משפטי מקצועי ומלווים את לקוחותינו לאורך כל הדרך.
          </p>
        </section>

        <section className={styles.section}>
          <h2>תחומי התמחות</h2>
          <ul>
            <li>דיני מקרקעין</li>
            <li>דיני נדל"ן</li>
            <li>ליקויי בנייה</li>
            <li>מחלוקות שכנים</li>
            <li>קניית דירה</li>
            <li>ייצוג במשפט</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>למה לבחור בנו?</h2>
          <ul>
            <li>✅ ניסיון של שנים בתחום</li>
            <li>✅ ליווי אישי ומקצועי</li>
            <li>✅ שירות מהיר ואמין</li>
            <li>✅ שקיפות מלאה</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

