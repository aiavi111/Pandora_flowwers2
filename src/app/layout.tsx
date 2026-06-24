import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Single, clean, highly-readable typeface across the whole platform.
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandora-flowers.kg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pandora Flowers — Авторские букеты в Бишкеке',
    template: '%s | Pandora Flowers',
  },
  description:
    'Pandora Flowers — авторская флористика премиум-класса в Бишкеке. Доставка букетов за 60 минут, фотоотчёт перед отправкой. Розы, пионы, тюльпаны, свадебные букеты. +996 772 07 00 67',
  applicationName: 'Pandora Flowers',
  keywords: [
    'цветы Бишкек', 'букеты Бишкек', 'доставка цветов Бишкек', 'авторские букеты',
    'Pandora Flowers', 'розы Бишкек', 'пионы Бишкек', 'свадебные букеты', 'цветы на заказ Бишкек',
  ],
  authors: [{ name: 'Pandora Flowers' }],
  creator: 'Pandora Flowers',
  alternates: { canonical: '/' },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Pandora Flowers',
    title: 'Pandora Flowers — Авторские букеты в Бишкеке',
    description: 'Авторская флористика премиум-класса. Доставка букетов за 60 минут по Бишкеку.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Pandora Flowers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pandora Flowers — Авторские букеты в Бишкеке',
    description: 'Авторская флористика премиум-класса. Доставка за 60 минут по Бишкеку.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#FBF8F4',
  width: 'device-width',
  initialScale: 1,
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  name: 'Pandora Flowers',
  description: 'Авторская флористика премиум-класса в Бишкеке. Доставка букетов за 60 минут.',
  image: `${SITE_URL}/og.png`,
  url: SITE_URL,
  telephone: '+996772070067',
  priceRange: '₸₸',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Токтогула 112/1, БЦ «Сфера»',
    addressLocality: 'Бишкек',
    addressCountry: 'KG',
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00', closes: '00:00',
  }],
  sameAs: ['https://instagram.com/pandora__flowers'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-porcelain text-ink antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#1C1714', color: '#FBF8F4', borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#BE9E63', secondary: '#1C1714' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </body>
    </html>
  );
}
