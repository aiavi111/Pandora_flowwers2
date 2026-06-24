import { MapPin, Phone, Clock, Instagram, MessageCircle, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контакты Pandora Flowers. Адрес: ул. Токтогула 112/1, БЦ Сфера, Бишкек. Телефон: +996 772 07 00 67',
};

export default function ContactsPage() {
  return (
    <div className="bg-pandora-cream">
      <div className="bg-white border-b border-pandora-border">
        <div className="container-site py-8">
          <div className="section-subtitle mb-3">Связаться с нами</div>
          <h1 className="section-title">Контакты</h1>
        </div>
      </div>

      <div className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <div className="space-y-8">
              <ContactBlock
                icon={<Phone className="w-6 h-6 text-pandora-gold" />}
                title="Телефон"
              >
                <a href="tel:+996772070067" className="text-lg font-medium text-pandora-dark hover:text-pandora-rose transition-colors">
                  +996 772 07 00 67
                </a>
                <div className="text-pandora-muted text-sm mt-1">Звоните или пишите в WhatsApp</div>
              </ContactBlock>

              <ContactBlock
                icon={<MapPin className="w-6 h-6 text-pandora-gold" />}
                title="Адрес"
              >
                <div className="text-pandora-dark font-medium">ул. Токтогула 112/1</div>
                <div className="text-pandora-muted">БЦ Сфера, Бишкек, Кыргызстан</div>
                <div className="text-pandora-muted text-sm mt-1">2 магазина в городе</div>
              </ContactBlock>

              <ContactBlock
                icon={<Clock className="w-6 h-6 text-pandora-gold" />}
                title="Режим работы"
              >
                <div className="text-pandora-dark font-medium">Ежедневно 09:00–00:00</div>
                <div className="text-pandora-muted text-sm mt-1">Доставка по Бишкеку за 60 минут</div>
              </ContactBlock>

              <ContactBlock
                icon={<Instagram className="w-6 h-6 text-pandora-gold" />}
                title="Социальные сети"
              >
                <div className="flex gap-3 mt-2">
                  <a
                    href="https://instagram.com/pandora__flowers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pandora-dark text-white text-sm rounded-sm hover:bg-pandora-rose transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/996772070067"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-sm hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/pandora__flowers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm rounded-sm hover:bg-sky-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Telegram
                  </a>
                </div>
              </ContactBlock>
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="aspect-square bg-pandora-border relative flex items-center justify-center">
                <div className="text-center text-pandora-muted">
                  <MapPin className="w-12 h-12 text-pandora-rose/30 mx-auto mb-3" />
                  <div className="font-medium">ул. Токтогула 112/1</div>
                  <div className="text-sm">БЦ Сфера, Бишкек</div>
                </div>
                {/* You can embed a real Yandex/Google map iframe here */}
              </div>
              <div className="p-4 bg-white text-center">
                <a
                  href="https://yandex.com/maps/org/pandora_flowers/27232024814/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  Открыть на карте
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-pandora-blush/30 rounded-sm flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-pandora-muted uppercase tracking-wider mb-1">{title}</div>
        {children}
      </div>
    </div>
  );
}
