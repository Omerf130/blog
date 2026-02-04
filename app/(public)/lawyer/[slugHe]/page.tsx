import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import connectDB from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import styles from './lawyer.module.scss';

interface LawyerPageProps {
  params: {
    slugHe: string;
  };
}

// Generate metadata for lawyer profile pages
export async function generateMetadata({ params }: LawyerPageProps): Promise<Metadata> {
  await connectDB();
  const { slugHe } = params;

  const lawyer = await Lawyer.findOne({ slugHe }).lean();

  if (!lawyer) {
    return {
      title: 'עורך דין לא נמצא',
    };
  }

  const title = `${lawyer.name} - ${lawyer.title} | משרד עורכי דין אשכנזי`;
  const lawyerData = lawyer as any;
  const description = lawyerData.bio 
    ? `${lawyerData.bio.substring(0, 160)}...` 
    : `${lawyerData.name}, ${lawyerData.title} במשרד עורכי דין אשכנזי. ${lawyerData.specialties?.join(', ') || 'ייעוץ משפטי מקצועי'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: 'משרד עורכי דין אשכנזי',
      ...(lawyerData.photoUrl && {
        images: [
          {
            url: lawyerData.photoUrl,
            width: 400,
            height: 400,
            alt: lawyerData.name,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function LawyerPage({ params }: LawyerPageProps) {
  await connectDB();
  const { slugHe } = params;

  // Fetch lawyer
  const lawyerRaw = await Lawyer.findOne({ slugHe }).lean();
  if (!lawyerRaw) {
    notFound();
  }

  // Fetch posts by this lawyer
  const postsRaw = await Post.find({
    authorLawyerId: lawyerRaw._id,
    status: 'published',
  })
    .populate('categories', 'name slugHe')
    .sort({ publishedAt: -1 })
    .select('-content')
    .lean();

  // Serialize data
  const lawyerData = lawyerRaw as any;
  const lawyer = {
    _id: lawyerData._id.toString(),
    name: lawyerData.name,
    title: lawyerData.title,
    slugHe: lawyerData.slugHe,
    bio: lawyerData.bio,
    email: lawyerData.email,
    phone: lawyerData.phone,
    photoUrl: lawyerData.photoUrl,
    specialties: lawyerData.specialties,
    linkedinUrl: lawyerData.linkedinUrl,
  };

  const posts = postsRaw.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    summary: post.summary,
    slugHe: post.slugHe,
    publishedAt: post.publishedAt,
    categories: post.categories?.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slugHe: cat.slugHe,
    })),
    authorLawyerId: {
      _id: lawyer._id,
      name: lawyer.name,
      title: lawyer.title,
    },
  }));

  return (
    <div className={styles.lawyerPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">ראשי</Link>
          <span className={styles.separator}>›</span>
          <span>פרופיל עורך דין</span>
        </nav>

        {/* Lawyer Profile Header */}
        <div className={styles.profileHeader}>
          {lawyer.photoUrl && (
            <div className={styles.photoWrapper}>
              <img
                src={lawyer.photoUrl}
                alt={lawyer.name}
                className={styles.photo}
              />
            </div>
          )}

          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{lawyer.name}</h1>
            <p className={styles.title}>{lawyer.title}</p>

            {lawyer.specialties && lawyer.specialties.length > 0 && (
              <div className={styles.specialties}>
                <h3 className={styles.specialtiesTitle}>תחומי התמחות:</h3>
                <ul className={styles.specialtiesList}>
                  {lawyer.specialties.map((specialty: string, index: number) => (
                    <li key={index}>{specialty}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              {lawyer.phone && (
                <a href={`tel:${lawyer.phone}`} className={styles.contactLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {lawyer.phone}
                </a>
              )}

              {lawyer.email && (
                <a href={`mailto:${lawyer.email}`} className={styles.contactLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {lawyer.email}
                </a>
              )}

              {lawyer.linkedinUrl && (
                <a href={lawyer.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {lawyer.bio && (
          <div className={styles.bioSection}>
            <h2 className={styles.sectionTitle}>אודות</h2>
            <div className={styles.bio}>{lawyer.bio}</div>
          </div>
        )}

        {/* Posts by this lawyer */}
        {posts.length > 0 && (
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>
              מאמרים של {lawyer.name} ({posts.length})
            </h2>
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className={styles.noPosts}>
            <p>עדיין אין מאמרים מאת {lawyer.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

