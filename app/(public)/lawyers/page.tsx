import connectDB from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import Link from 'next/link';
import styles from './lawyers.module.scss';

export default async function LawyersPage() {
  await connectDB();

  // Fetch all active lawyers
  const lawyersRaw = await Lawyer.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  // Serialize data
  const lawyers = lawyersRaw.map((lawyer: any) => ({
    _id: lawyer._id.toString(),
    name: lawyer.name,
    title: lawyer.title,
    slugHe: lawyer.slugHe,
    bio: lawyer.bio,
    photoUrl: lawyer.photoUrl,
    specialties: lawyer.specialties,
  }));

  return (
    <div className={styles.lawyersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>⚖️ עורכי הדין שלנו</h1>
          <p className={styles.subtitle}>
            הכירו את צוות עורכי הדין המקצועי של משרדנו
          </p>
        </div>

        {lawyers.length === 0 ? (
          <div className={styles.empty}>
            <p>אין עורכי דין להצגה כרגע</p>
          </div>
        ) : (
          <div className={styles.lawyersGrid}>
            {lawyers.map((lawyer) => (
              <Link
                key={lawyer._id}
                href={`/lawyer/${lawyer.slugHe}`}
                className={styles.lawyerCard}
              >
                {lawyer.photoUrl && (
                  <div className={styles.photoWrapper}>
                    <img
                      src={lawyer.photoUrl}
                      alt={lawyer.name}
                      className={styles.photo}
                    />
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{lawyer.name}</h3>
                  <p className={styles.lawyerTitle}>{lawyer.title}</p>

                  {lawyer.specialties && lawyer.specialties.length > 0 && (
                    <div className={styles.specialties}>
                      {lawyer.specialties.slice(0, 3).map((specialty: string, index: number) => (
                        <span key={index} className={styles.specialty}>
                          {specialty}
                        </span>
                      ))}
                      {lawyer.specialties.length > 3 && (
                        <span className={styles.specialty}>
                          +{lawyer.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {lawyer.bio && (
                    <p className={styles.bioPreview}>
                      {lawyer.bio.length > 120
                        ? `${lawyer.bio.substring(0, 120)}...`
                        : lawyer.bio}
                    </p>
                  )}

                  <div className={styles.viewProfile}>
                    <span>לפרופיל המלא</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

