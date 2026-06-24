'use client';

import Link from 'next/link';
import {
  Phone,
  MapPin,
  Clock,
  Camera,
  MessageCircle,
  Send,
  ChevronRight,
} from 'lucide-react';
import { PandoraLogoMark } from '@/components/ui/PandoraLogoMark';

export default function Footer() {
  return (
    <footer className="bg-pandora-black text-white/60">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <PandoraLogoMark size={34} className="text-white group-hover:text-pandora-rose transition-colors duration-300" />
              <div>
                <div className="font-serif text-xl font-semibold text-white tracking-[0.15em]">
                  PANDORA
                </div>
                <div className="text-white/40 text-xs tracking-[0.2em] uppercase">
                  Flowers
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Авторские букеты премиум-класса в Бишкеке. Создаём красоту, которую невозможно забыть.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/pandora__flowers"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/8 border border-white/10 rounded-sm flex items-center justify-center hover:border-pandora-rose hover:text-pandora-rose transition-all duration-200"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/996772070067"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/8 border border-white/10 rounded-sm flex items-center justify-center hover:border-pandora-rose hover:text-pandora-rose transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/pandora__flowers"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/8 border border-white/10 rounded-sm flex items-center justify-center hover:border-pandora-rose hover:text-pandora-rose transition-all duration-200"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="text-white font-serif text-lg mb-5 font-light tracking-wide">Каталог</h3>
            <ul className="space-y-3">
              {[
                { href: '/catalog/roses', label: 'Розы' },
                { href: '/catalog/peonies', label: 'Пионы' },
                { href: '/catalog/bouquets', label: 'Авторские букеты' },
                { href: '/catalog/tulips', label: 'Тюльпаны' },
                { href: '/catalog/wedding', label: 'Свадебные' },
                { href: '/catalog/gifts', label: 'Подарки' },
                { href: '/custom', label: 'Букет на заказ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-pandora-rose transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-serif text-lg mb-5 font-light tracking-wide">Информация</h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'О нас' },
                { href: '/delivery', label: 'Доставка и оплата' },
                { href: '/contacts', label: 'Контакты' },
                { href: '/privacy', label: 'Конфиденциальность' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-pandora-rose transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-serif text-lg mt-8 mb-5 font-light tracking-wide">Аккаунт</h3>
            <ul className="space-y-3">
              {[
                { href: '/account', label: 'Личный кабинет' },
                { href: '/account/orders', label: 'Мои заказы' },
                { href: '/account/favorites', label: 'Избранное' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-pandora-rose transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif text-lg mb-5 font-light tracking-wide">Контакты</h3>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-pandora-rose flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/30 mb-1 tracking-wider uppercase">Телефон</div>
                  <a
                    href="tel:+996772070067"
                    className="text-sm text-white hover:text-pandora-rose transition-colors"
                  >
                    +996 772 07 00 67
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-pandora-rose flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/30 mb-1 tracking-wider uppercase">Адрес</div>
                  <div className="text-sm">
                    ул. Токтогула 112/1<br />
                    БЦ Сфера, Бишкек
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-pandora-rose flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/30 mb-1 tracking-wider uppercase">Режим работы</div>
                  <div className="text-sm">
                    Ежедневно 09:00–00:00<br />
                    <span className="text-pandora-rose text-xs">Доставка за 60 минут</span>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <div className="text-xs text-white/50 font-medium mb-3 tracking-wider uppercase">Подпишитесь на акции</div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-3 py-2.5 bg-white/6 border border-white/12 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-pandora-rose transition-colors rounded-l-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-pandora-rose text-white text-sm font-medium hover:bg-pandora-rose/80 transition-colors rounded-r-sm"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <div>© {new Date().getFullYear()} Pandora Flowers. Все права защищены.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-pandora-rose transition-colors">
              Конфиденциальность
            </Link>
            <span className="text-white/15">•</span>
            <Link href="/delivery" className="hover:text-pandora-rose transition-colors">
              Доставка
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
