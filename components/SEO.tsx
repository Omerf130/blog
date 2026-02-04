import { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage = '/assets/logo.jpeg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
}: SEOProps): Metadata {
  const siteName = 'משרד עורכי דין אשכנזי - בלוג משפטי';
  const fullTitle = `${title} | ${siteName}`;
  
  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };

  return metadata;
}

