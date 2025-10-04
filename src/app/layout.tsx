import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Shiraori Joki Pro - Professional Gaming Assistant',
    template: '%s | Shiraori Joki Pro'
  },
  description: 'Asisten AI profesional untuk jasa gaming Genshin Impact dan Honkai Star Rail. Dapatkan bantuan terbaik dengan teknologi Z.ai.',
  keywords: ['joki', 'genshin impact', 'honkai star rail', 'gaming', 'assistant', 'AI', 'z.ai', 'professional gaming'],
  authors: [{ name: 'Shiraori Joki Pro' }],
  creator: 'Shiraori Joki Pro',
  publisher: 'Shiraori Joki Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Shiraori Joki Pro - Professional Gaming Assistant',
    description: 'Asisten AI profesional untuk jasa gaming dengan teknologi terdepan.',
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Shiraori Joki Pro',
    images: [
      {
        url: '/logo/Logo-4.png',
        width: 1200,
        height: 630,
        alt: 'Shiraori Joki Pro - Professional Gaming Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shiraori Joki Pro - Professional Gaming Assistant',
    description: 'Asisten AI profesional untuk jasa gaming dengan teknologi terdepan.',
    images: ['/logo/Logo-4.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}