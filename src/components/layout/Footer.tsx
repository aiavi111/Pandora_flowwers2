'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Phone, MapPin, Clock, Instagram, MessageCircle, Send, ChevronRight, ArrowRight,
} from 'lucide-react';
import { PandoraLogo } from '@/components/ui/PandoraLogo';
import toast from 'react-hot-toast';

const catalogLinks = [
  { href: '/catalog/roses', label: 'Розы' },
  { href: '/catalog/peonies', label: 'Пионы' },
  { href: '/catalog/bouquets', label: 'Авторские букеты' },
  { href: '/catalog/tulips', label: 'Тюльпаны' },
  { href: '/catalog/wedding', label: 'Свадебные' },
  { href: '/catalog/gifts', label: 'Подарки' },
];

const serviceLinks = [
  { href: '/custom', label: 'Букет на заказ' },
  { href: '/catalog', label: 'Весь каталог' },
  { href: '/contacts', label: 'Доставка и оплата' },
  { href: '/account', label: 'Личный кабинет' },
  { href: '/account/favorites', label: 'Избранное' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative bg-ink text-porcelain/60 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-champagne-line opacity-60" />

      <div className="container-site py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <PandoraLogo size={40} tone="light" />
            <p className="text-sm leading-relaxed mt-6 max-w-xs text-porcelain/55">
              Авторская флористика премиум-класса в Бишкеке. Создаём букеты, которые
              становятся воспоминанием.
            </p>

            <div className="mt-7">
              <div className="text-eyebrow uppercase text-porcelain/40 mb-3">Письма от ателье</div>
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) { toast.success('Спасибо! Вы подписаны.'); setEmail(''); } }}
                className="flex max-w-xs"
              >
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/12 text-white text-sm placeholder:text-white/30 rounded-l-pill focus:outline-none focus:border-accent transition-colors"
                />
                <button type="submit" aria-label="Подписаться"
                  className="px-5 bg-accent text-white rounded-r-pill hover:bg-accent-deep transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-2.5 mt-7">
              {[
                { href: 'https://instagram.com/pandora__flowers', icon: Instagram, label: 'Instagram' },
                { href: 'https://wa.me/996772070067', icon: MessageCircle, label: 'WhatsApp' },
                { href: 'https://t.me/pandora__flowers', icon: Send, label: 'Telegram' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 grid place-items-center bg-white/[0.06] border border-white/10 rounded-full hover:bg-accent hover:border-accent hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div className="lg:col-span-2">
            <h3 className="text-porcelain font-serif text-lg mb-5">Коллекции</h3>
            <ul className="space-y-3">
              {catalogLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-1.5 text-sm hover:text-accent transition-colors">
                    <ChevronRight className="w-3 h-3 -ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="lg:col-span-2">
            <h3 className="text-porcelain font-serif text-lg mb-5">Сервис</h3>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-1.5 text-sm hover:text-accent transition-colors">
                    <ChevronRight className="w-3 h-3 -ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-porcelain font-serif text-lg mb-5">Ателье</h3>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-accent-glow shrink-0 mt-0.5" />
                <div>
                  <div className="text-[0.66rem] text-porcelain/35 mb-1 tracking-wider uppercase">Телефон</div>
                  <a href="tel:+996772070067" className="text-sm text-porcelain hover:text-accent transition-colors">+996 772 07 00 67</a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-accent-glow shrink-0 mt-0.5" />
                <div>
                  <div className="text-[0.66rem] text-porcelain/35 mb-1 tracking-wider uppercase">Адрес</div>
                  <div className="text-sm">ул. Токтогула 112/1<br />БЦ «Сфера», Бишкек</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-accent-glow shrink-0 mt-0.5" />
                <div>
                  <div className="text-[0.66rem] text-porcelain/35 mb-1 tracking-wider uppercase">Часы работы</div>
                  <div className="text-sm">Ежедневно 09:00–00:00<br /><span className="text-accent-glow">Доставка за 60 минут</span></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-porcelain/30">
          <div>© {new Date().getFullYear()} Pandora Flowers · Бишкек. Все права защищены.</div>
          <div className="flex items-center gap-4">
            <Link href="/contacts" className="hover:text-accent transition-colors">Контакты</Link>
            <span className="text-white/15">•</span>
            <Link href="/custom" className="hover:text-accent transition-colors">Индивидуальный заказ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
