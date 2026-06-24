'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag, Menu, X, Heart, User, Phone, Search, ChevronDown, ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import CartDrawer from '@/components/shop/CartDrawer';
import { PandoraLogo } from '@/components/ui/PandoraLogo';
import { cn } from '@/lib/utils';

const categories = [
  { href: '/catalog/roses', label: 'Розы' },
  { href: '/catalog/peonies', label: 'Пионы' },
  { href: '/catalog/bouquets', label: 'Авторские букеты' },
  { href: '/catalog/tulips', label: 'Тюльпаны' },
  { href: '/catalog/mono', label: 'Монобукеты' },
  { href: '/catalog/wedding', label: 'Свадебные' },
  { href: '/catalog/chrysanthemums', label: 'Хризантемы' },
  { href: '/catalog/gifts', label: 'Подарки' },
];

const navLinks = [
  { href: '/custom', label: 'Букет на заказ' },
  { href: '/catalog/wedding', label: 'Свадебные' },
  { href: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { totalItems, openCart } = useCartStore();
  const { ids: favoriteIds } = useFavoritesStore();
  const cartCount = totalItems();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setCatOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-porcelain/70 text-xs hidden md:block">
        <div className="container-site flex items-center justify-between h-9">
          <div className="flex items-center gap-5 tracking-wide">
            <span>Доставка по Бишкеку за 60 минут</span>
            <span className="text-champagne/50">·</span>
            <span>Ежедневно 09:00–00:00</span>
            <span className="text-champagne/50">·</span>
            <span className="text-champagne">Шоколад в подарок к каждому букету</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+996772070067" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> +996 772 07 00 67
            </a>
            <span className="text-white/15">|</span>
            <a href="https://instagram.com/pandora__flowers" target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">@pandora__flowers</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500 ease-out-expo',
          isScrolled ? 'glass shadow-soft' : 'bg-porcelain/0 border-b border-transparent',
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden -ml-2 p-2 text-ink"
              onClick={() => setMobileOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80" aria-label="Pandora Flowers — на главную">
              <PandoraLogo size={36} className="hidden sm:inline-flex" />
              <PandoraLogo size={34} variant="mark" className="sm:hidden" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-9 ml-2">
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <Link
                  href="/catalog"
                  className="flex items-center gap-1 text-sm font-medium tracking-wide text-ink hover:text-accent transition-colors py-2"
                  aria-expanded={catOpen}
                >
                  Каталог
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-300', catOpen && 'rotate-180')} />
                </Link>
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[30rem] transition-all duration-300 ease-out-expo',
                    catOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none',
                  )}
                >
                  <div className="glass-card rounded-card shadow-lift p-3 grid grid-cols-2 gap-1">
                    {categories.map((c) => (
                      <Link key={c.href} href={c.href}
                        className="group flex items-center justify-between px-4 py-3 rounded-input hover:bg-accent-soft/70 transition-colors">
                        <span className="text-sm text-ink group-hover:text-accent-deep transition-colors">{c.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wide link-underline py-2 transition-colors',
                    pathname === link.href ? 'text-accent' : 'text-ink hover:text-accent',
                  )}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 md:gap-1 ml-auto lg:ml-0">
              <button onClick={() => setSearchOpen((s) => !s)}
                className="p-2.5 text-ink-soft hover:text-accent transition-colors" aria-label="Поиск">
                <Search className="w-5 h-5" strokeWidth={1.6} />
              </button>
              <Link href="/account/favorites"
                className="relative p-2.5 text-ink-soft hover:text-accent transition-colors hidden sm:flex" aria-label="Избранное">
                <Heart className="w-5 h-5" strokeWidth={1.6} />
                {favoriteIds.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[0.6rem] rounded-full flex items-center justify-center leading-none">
                    {favoriteIds.length > 9 ? '9+' : favoriteIds.length}
                  </span>
                )}
              </Link>
              <Link href="/account"
                className="p-2.5 text-ink-soft hover:text-accent transition-colors hidden md:flex" aria-label="Личный кабинет">
                <User className="w-5 h-5" strokeWidth={1.6} />
              </Link>
              <button onClick={openCart}
                className="relative flex items-center gap-2 ml-1 px-4 md:px-5 py-2.5 bg-ink text-porcelain text-sm font-medium rounded-pill hover:bg-accent transition-colors duration-300"
                aria-label="Корзина">
                <ShoppingBag className="w-4 h-4" strokeWidth={1.7} />
                <span className="hidden sm:inline">Корзина</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-champagne text-ink rounded-full text-[0.66rem] font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={cn(
          'overflow-hidden border-t border-line/0 bg-porcelain/95 backdrop-blur transition-all duration-300 ease-out-expo',
          searchOpen ? 'max-h-24 border-line/80' : 'max-h-0',
        )}>
          <div className="container-site py-4">
            <form onSubmit={submitSearch} className="flex gap-2">
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск букетов, цветов, подарков…" className="input-field flex-1"
                autoFocus={searchOpen}
              />
              <button type="submit" className="btn-primary">Найти</button>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-3 text-ink-muted hover:text-accent transition-colors" aria-label="Закрыть поиск">
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={cn(
        'fixed inset-0 z-[60] lg:hidden transition-all duration-500 ease-out-expo',
        mobileOpen ? 'visible' : 'invisible',
      )}>
        <div
          className={cn('absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
        />
        <div className={cn(
          'absolute inset-y-0 left-0 w-[88%] max-w-sm bg-porcelain shadow-lift flex flex-col transition-transform duration-500 ease-out-expo',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-line">
            <PandoraLogo size={32} />
            <button onClick={() => setMobileOpen(false)} className="p-2 text-ink" aria-label="Закрыть меню">
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-7">
            <div className="text-eyebrow uppercase text-ink-muted mb-4">Каталог</div>
            <div className="flex flex-col">
              {categories.map((c) => (
                <Link key={c.href} href={c.href}
                  className="font-serif text-2xl text-ink py-2.5 hover:text-accent transition-colors">{c.label}</Link>
              ))}
            </div>
            <div className="h-px bg-line my-6" />
            <div className="flex flex-col gap-1">
              <Link href="/custom" className="text-sm font-medium text-ink py-2.5">Букет на заказ</Link>
              <Link href="/contacts" className="text-sm font-medium text-ink py-2.5">Контакты</Link>
              <Link href="/account" className="text-sm font-medium text-ink py-2.5 flex items-center gap-2">
                <User className="w-4 h-4" /> Личный кабинет
              </Link>
            </div>
          </nav>
          <div className="px-6 py-5 border-t border-line">
            <a href="tel:+996772070067" className="btn-primary w-full mb-3">
              <Phone className="w-4 h-4" /> Позвонить
            </a>
            <a href="https://wa.me/996772070067" target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
