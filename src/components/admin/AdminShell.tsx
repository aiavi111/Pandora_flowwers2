'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Flower2, BarChart3, LogOut, Menu, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PandoraLogoMark } from '@/components/ui/PandoraLogoMark';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/secure-admin/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/secure-admin/orders', label: 'Заказы', icon: ShoppingBag },
  { href: '/secure-admin/products', label: 'Товары', icon: Package },
  { href: '/secure-admin/custom-requests', label: 'Букеты на заказ', icon: Flower2 },
  { href: '/secure-admin/analytics', label: 'Аналитика', icon: BarChart3 },
];

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => r.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
        else router.replace('/secure-admin');
      })
      .catch(() => router.replace('/secure-admin'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    toast.success('Выход выполнен');
    router.replace('/secure-admin');
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-porcelain-deep flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pandora-rose border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-porcelain-deep">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto w-64 bg-ink flex flex-col transition-transform duration-300 ease-in-out flex-shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/secure-admin/dashboard" className="flex items-center gap-3">
            <PandoraLogoMark size={34} className="text-porcelain" />
            <div>
              <div className="text-porcelain font-semibold text-base tracking-wide">Pandora</div>
              <div className="text-champagne/70 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'admin-nav-item',
                  isActive ? 'active' : 'text-porcelain/55 hover:bg-white/5 hover:text-porcelain'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-porcelain text-sm font-bold">{admin.name.charAt(0)}</span>
            </div>
            <div>
              <div className="text-porcelain text-sm font-medium">{admin.name}</div>
              <div className="text-porcelain/45 text-xs capitalize">{admin.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-pandora-blush/50 hover:text-red-400 text-sm transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-line px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-ink-soft hover:text-accent transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
              {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
            </div>
          </div>
          <Link href="/" target="_blank" className="text-xs font-medium text-accent hover:text-accent-deep transition-colors">Смотреть сайт ↗</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
