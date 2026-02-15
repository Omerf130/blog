import type { Metadata } from 'next';
import HomeTopBar from '@/components/HomeTopBar';
import Footer from '@/components/Footer';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'משרד עורכי דין קשת - בלוג משפטי',
  description: 'בלוג משפטי המתמחה במקרקעין ודיני בניין',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <HomeTopBar />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

