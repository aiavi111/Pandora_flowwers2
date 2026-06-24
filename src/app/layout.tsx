import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pandora Flowers — Авторские букеты в Бишкеке',
    template: '%s | Pandora Flowers',
  },
  description:
    'Pandora Flowers — авторские букеты премиум-класса в Бишкеке. Доставка за 60 минут. Розы, пионы, тюльпаны, свадебные букеты. Звоните: +996 772 07 00 67',
  keywords: [
    'цветы Бишкек',
    'букеты Бишкек',
    'доставка цветов Бишкек',
    'авторские букеты',
    'Pandora Flowers',
    'розы Бишкек',
    'пионы Бишкек',
    'свадебные букеты',
  ],
  authors: [{ name: 'Pandora Flowers' }],
  creator: 'Pandora Flowers',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://pandora-flowers.kg',
    siteName: 'Pandora Flowers',
    title: 'Pandora Flowers — Авторские букеты в Бишкеке',
    description: 'Авторские букеты премиум-класса. Доставка за 60 минут по Бишкеку.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-pandora-cream text-pandora-text antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A0A12',
              color: '#FAF8F5',
              borderRadius: '2px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#C9A85C',
                secondary: '#1A0A12',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
