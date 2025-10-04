import { Poppins, Space_Grotesk } from 'next/font/google';
import './globals.css';

// Inisialisasi font dari Google Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // Nama variabel CSS
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk', // Nama variabel CSS
});

export const metadata = {
  title: 'ShiraoriJokiPro | Jasa Joki Genshin & Honkai',
  description: 'Layanan joki profesional untuk Genshin Impact dan Honkai: Star Rail. Aman, cepat, dan terpercaya.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Menggabungkan variabel font ke dalam body */}
      <body className={`${poppins.variable} ${spaceGrotesk.variable} font-poppins`}>
        {children}
      </body>
    </html>
  );
}