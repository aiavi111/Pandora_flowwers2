import { MapPin, Phone, Clock, Instagram, MessageCircle, Send, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import ContactForm from '@/components/shop/ContactForm';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контакты Pandora Flowers. Адрес: ул. Токтогула 112/1, БЦ «Сфера», Бишкек. Телефон: +996 772 07 00 67. Доставка цветов за 60 минут.',
};

export default function ContactsPage() {
  return (
    <div className="bg-porcelain min-h-screen">
      <div className="bg-porcelain-fade border-b border-line">
        <div className="container-site py-10 md:py-14">
          <div className="section-subtitle mb-3">Свяжитесь с нами</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-ink">Контакты</h1>
          <p className="text-ink-soft mt-3 max-w-xl">Поможем выбрать букет, оформить доставку или собрать композицию на заказ. Мы на связи каждый день.</p>
        </div>
      </div>

      <div className="container-site py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: info + socials */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard icon={Phone} title="Телефон">
                <a href="tel:+996772070067" className="text-lg font-semibold text-ink hover:text-accent transition-colors">+996 772 07 00 67</a>
                <div className="text-ink-muted text-sm mt-1">Звонки и WhatsApp</div>
              </InfoCard>
              <InfoCard icon={Clock} title="Режим работы">
                <div className="text-ink font-semibold">Ежедневно 09:00–00:00</div>
                <div className="text-ink-muted text-sm mt-1">Доставка за 60 минут</div>
              </InfoCard>
              <InfoCard icon={MapPin} title="Адрес" wide>
                <div className="text-ink font-semibold">ул. Токтогула 112/1</div>
                <div className="text-ink-muted">БЦ «Сфера», Бишкек, Кыргызстан</div>
              </InfoCard>
            </div>

            <div>
              <div className="section-subtitle mb-3">Мессенджеры</div>
              <div className="flex flex-wrap gap-3">
                <a href="https://instagram.com/pandora__flowers" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><Instagram className="w-4 h-4" /> Instagram</a>
                <a href="https://wa.me/996772070067" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <a href="https://t.me/pandora__flowers" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><Send className="w-4 h-4" /> Telegram</a>
              </div>
            </div>

            <ContactForm />
          </div>

          {/* Right: map */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white rounded-card border border-line shadow-card overflow-hidden">
              <div className="aspect-[4/5] relative grid place-items-center bg-gradient-to-br from-porcelain-deep to-accent-soft/50">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white shadow-soft grid place-items-center"><MapPin className="w-6 h-6 text-accent" /></div>
                  <div className="font-semibold text-ink">ул. Токтогула 112/1</div>
                  <div className="text-sm text-ink-soft">БЦ «Сфера», Бишкек</div>
                </div>
              </div>
              <div className="p-4 border-t border-line">
                <a href="https://yandex.com/maps/org/pandora_flowers/27232024814/" target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                  Открыть на карте <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children, wide }: { icon: React.ElementType; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`bg-white rounded-card border border-line shadow-card p-5 ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="w-11 h-11 rounded-full bg-accent-soft grid place-items-center mb-4"><Icon className="w-5 h-5 text-accent-deep" strokeWidth={1.6} /></div>
      <div className="text-xs text-ink-muted uppercase tracking-[0.14em] mb-1.5">{title}</div>
      {children}
    </div>
  );
}
