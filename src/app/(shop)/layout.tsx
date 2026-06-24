export const dynamic = 'force-dynamic';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-porcelain">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollReveal />
    </div>
  );
}
