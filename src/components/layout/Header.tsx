'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  User,
  Phone,
  Search,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import CartDrawer from '@/components/shop/CartDrawer';
import { PandoraLogoMark } from '@/components/ui/PandoraLogoMark';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/custom', label: 'Букет на заказ' },
  { href: '/catalog/wedding', label: 'Свадебные' },
];


export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { totalItems, openCart } = useCartStore();
  const { ids: favoriteIds } = useFavoritesStore();
  const cartCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      {/* Top bar */}
      <div className="bg-pandora-black text-white/60 text-xs py-2 hidden md:block">
        <div className="container-site flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>Доставка по Бишкеку за 60 минут</span>
            <span className="text-white/20">|</span>
            <span>Работаем 09:00–00:00</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/996772070067"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pandora-rose transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              +996 772 07 00 67
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://instagram.com/pandora__flowers"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pandora-rose transition-colors"
            >
              @pandora__flowers
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled || !isHome
            ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-pandora-border'
            : 'bg-transparent'
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-pandora-text"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <PandoraLogoMark
                size={36}
                className={cn(
                  'transition-colors duration-300',
                  isScrolled || !isHome ? 'text-pandora-dark' : isHome ? 'text-white' : 'text-pandora-dark'
                )}
              />
              <div className="hidden sm:block">
                <div className={cn(
                  'font-serif text-xl font-semibold tracking-[0.15em] transition-colors duration-300',
                  isScrolled || !isHome ? 'text-pandora-dark' : 'text-white'
                )}>
                  PANDORA
                </div>
                <div className={cn(
                  'text-xs tracking-[0.25em] uppercase transition-colors duration-300',
                  isScrolled || !isHome ? 'text-pandora-muted' : 'text-white/60'
                )}>
                  Flowers
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wide transition-colors duration-200 relative group',
                    isScrolled || !isHome
                      ? pathname === link.href
                        ? 'text-pandora-rose'
                        : 'text-pandora-text hover:text-pandora-rose'
                      : pathname === link.href
                        ? 'text-pandora-rose'
                        : 'text-white/80 hover:text-white'
                  )}
                >
                  {link.label}
                  <span className={cn(
                    'absolute -bottom-1 left-0 h-px bg-pandora-rose transition-all duration-300',
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )} />
                </Link>
              ))}
              <Link
                href="/contacts"
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors duration-200',
                  isScrolled || !isHome ? 'text-pandora-text hover:text-pandora-rose' : 'text-white/80 hover:text-white'
                )}
              >
                Контакты
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  'p-2 transition-colors rounded-sm',
                  isScrolled || !isHome ? 'text-pandora-muted hover:text-pandora-rose' : 'text-white/70 hover:text-white'
                )}
                aria-label="Поиск"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account/favorites"
                className={cn(
                  'relative p-2 transition-colors rounded-sm',
                  isScrolled || !isHome ? 'text-pandora-muted hover:text-pandora-rose' : 'text-white/70 hover:text-white'
                )}
                aria-label="Избранное"
              >
                <Heart className="w-5 h-5" />
                {favoriteIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pandora-rose text-white text-xs rounded-full flex items-center justify-center leading-none">
                    {favoriteIds.length > 9 ? '9+' : favoriteIds.length}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className={cn(
                  'p-2 transition-colors rounded-sm hidden md:flex',
                  isScrolled || !isHome ? 'text-pandora-muted hover:text-pandora-rose' : 'text-white/70 hover:text-white'
                )}
                aria-label="Аккаунт"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-3 py-2 bg-pandora-dark text-white text-sm font-medium rounded-sm hover:bg-pandora-rose transition-colors duration-200"
                aria-label="Корзина"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Корзина</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-pandora-rose rounded-full text-xs font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-pandora-border bg-white py-3 animate-slide-up">
            <div className="container-site">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск букетов, цветов..."
                  className="input-field flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary px-6 py-3">
                  Найти
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-3 text-pandora-muted hover:text-pandora-rose transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-pandora-border bg-white animate-slide-up">
            <nav className="container-site py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-3 px-4 text-sm font-medium rounded-sm transition-colors',
                    pathname === link.href
                      ? 'bg-pandora-blush text-pandora-rose'
                      : 'text-pandora-text hover:bg-pandora-border'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contacts"
                className="py-3 px-4 text-sm font-medium text-pandora-text hover:bg-pandora-border rounded-sm transition-colors"
              >
                Контакты
              </Link>
              <Link
                href="/account"
                className="py-3 px-4 text-sm font-medium text-pandora-text hover:bg-pandora-border rounded-sm transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Личный кабинет
              </Link>
              <div className="pt-4 border-t border-pandora-border mt-2">
                <a
                  href="tel:+996772070067"
                  className="flex items-center gap-2 px-4 py-2 text-pandora-rose font-medium"
                >
                  <Phone className="w-4 h-4" />
                  +996 772 07 00 67
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
