export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Pandora Admin',
    template: '%s | Pandora Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-porcelain-deep">
      {children}
    </div>
  );
}
