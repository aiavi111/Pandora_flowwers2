import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Clock, Award, Phone, Gem, Gift } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import { formatPrice } from '@/lib/utils';

async function getPopularProducts() {
  return prisma.product.findMany({
    where: { isPopular: true, inStock: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    orderBy: { sortOrder: 'asc' },
    take: 8,
  });
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, inStock: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, slug: { notIn: ['gifts'] } },
    orderBy: { sortOrder: 'asc' },
    take: 6,
    include: { _count: { select: { products: true } } },
  });
}

async function getGifts() {
  return prisma.product.findMany({
    where: { category: { slug: 'gifts' }, inStock: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    take: 4,
  });
}

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=1920&q=90';

export default async function HomePage() {
  const [popularProducts, featuredProducts, categories, gifts] = await Promise.all([
    getPopularProducts(),
    getFeaturedProducts(),
    getCategories(),
    getGifts(),
  ]);

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Light pink-white gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-pandora-cream to-pandora-blush" />

        {/* Flower photo — right side, fading left */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Pandora Flowers"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Fade photo to white on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 lg:via-white/70 to-white/10" />
          {/* Soft blush tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-pandora-blush/50 via-pandora-blush/10 to-transparent" />
          {/* Bottom fade to cream */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pandora-cream to-transparent" />
        </div>

        {/* Content — left aligned, dark text */}
        <div className="relative z-10 container-site py-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-10 h-px bg-pandora-rose/40" />
              <span className="text-pandora-rose text-xs tracking-[0.4em] uppercase font-light">
                Авторские букеты · Бишкек
              </span>
            </div>

            <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-light tracking-[0.12em] mb-3 text-pandora-dark leading-none">
              PANDORA
            </h1>
            <div className="text-pandora-muted/50 tracking-[0.6em] text-sm uppercase mb-10 font-light">
              F L O W E R S
            </div>

            <p className="text-pandora-muted text-xl font-light mb-10 leading-relaxed max-w-sm">
              Доставка авторских букетов по Бишкеку за 60 минут
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-10 py-4 bg-pandora-dark text-white text-base font-medium rounded-sm hover:bg-pandora-rose transition-all duration-300"
              >
                Смотреть каталог
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/custom"
                className="inline-flex items-center gap-2 px-10 py-4 border border-pandora-rose/50 text-pandora-rose text-base font-light rounded-sm hover:bg-pandora-rose hover:text-white transition-all duration-300"
              >
                Букет на заказ
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-10 mt-14 pt-8 border-t border-pandora-border">
              {[
                { value: '81K', label: 'подписчиков' },
                { value: '4.8', label: 'рейтинг' },
                { value: '60 мин', label: 'доставка' },
                { value: '5 лет', label: 'на рынке' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl font-light text-pandora-dark">{stat.value}</div>
                  <div className="text-pandora-muted text-xs tracking-widest uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pandora-muted/30">
          <span className="text-xs tracking-widest uppercase">Прокрутите</span>
          <div className="w-px h-8 bg-pandora-rose/20 animate-pulse" />
        </div>
      </section>

      {/* ── USP STRIP ── */}
      <section className="bg-pandora-blush/60 border-y border-pandora-border py-4">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-pandora-muted text-xs tracking-wide">
            {[
              { icon: <Truck className="w-3.5 h-3.5 text-pandora-rose" />, text: 'Доставка за 60 минут' },
              { icon: <Clock className="w-3.5 h-3.5 text-pandora-rose" />, text: 'Работаем 09:00–00:00' },
              { icon: <Award className="w-3.5 h-3.5 text-pandora-rose" />, text: 'Авторские букеты' },
              { icon: <Gift className="w-3.5 h-3.5 text-pandora-rose" />, text: 'Шоколад в подарок' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <div className="section-subtitle mb-3 text-pandora-rose">Коллекции</div>
            <h2 className="section-title">Выберите свой стиль</h2>
            <div className="w-12 h-px bg-pandora-rose/30 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                className="group relative rounded-sm overflow-hidden aspect-[3/4] block"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-pandora-rose/60 transition-all duration-400" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white text-center">
                  <div className="font-serif text-sm font-medium">{cat.name}</div>
                  <div className="text-xs text-white/50 mt-0.5">{cat._count.products} букетов</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR BOUQUETS ── */}
      <section className="py-20 bg-pandora-cream">
        <div className="container-site">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-subtitle mb-3 text-pandora-rose">Популярное</div>
              <h2 className="section-title">Букеты, которые выбирают</h2>
              <div className="w-12 h-px bg-pandora-rose/30 mt-4" />
            </div>
            <Link
              href="/catalog"
              className="hidden md:flex items-center gap-2 text-pandora-rose text-sm font-medium hover:gap-3 transition-all duration-200"
            >
              Все букеты
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {popularProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product as Parameters<typeof ProductCard>[0]['product']}
                priority={i < 4}
              />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/catalog" className="btn-secondary">
              Смотреть все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCT HIGHLIGHT ── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-site">
            <div className="text-center mb-12">
              <div className="section-subtitle mb-3 text-pandora-rose">Специальный выбор</div>
              <h2 className="section-title">Бестселлеры сезона</h2>
              <div className="w-12 h-px bg-pandora-rose/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProducts.map((product, i) => {
                const image = product.images?.[0]?.url;
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className={`group relative rounded-sm overflow-hidden block ${
                      i === 0 ? 'md:row-span-2' : ''
                    }`}
                  >
                    <div className={`relative ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}>
                      {image && (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <div className="text-pandora-rose text-xs uppercase tracking-wider mb-1.5">
                          {product.category?.name}
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl font-light mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-lg">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs bg-white/15 border border-white/20 px-3 py-1 rounded-sm backdrop-blur-sm group-hover:bg-pandora-rose group-hover:border-pandora-rose transition-all duration-200">
                            Подробнее
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CUSTOM BOUQUET BANNER ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pandora-black" />
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90"
          alt="Букет на заказ"
          fill
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        {/* Pink gradient accent */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-pandora-rose/10 to-transparent pointer-events-none" />

        <div className="relative z-10 container-site">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-pandora-rose/50" />
              <span className="text-pandora-rose text-xs tracking-[0.3em] uppercase">
                Создайте своё
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-light leading-tight mb-4">
              Не нашли<br />
              <em className="not-italic text-pandora-rose">идеальный букет?</em>
            </h2>
            <p className="text-white/55 text-lg mb-8 leading-relaxed">
              Опишите свою мечту — наши флористы создадут уникальный авторский букет специально для вас в течение 2 часов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/custom" className="btn-primary text-base px-10 py-4">
                Создать букет на заказ
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/996772070067"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/70 text-base rounded-sm hover:border-pandora-rose hover:text-pandora-rose transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── GIFTS SECTION ── */}
      {gifts.length > 0 && (
        <section className="py-20 bg-pandora-cream">
          <div className="container-site">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="section-subtitle mb-3 text-pandora-rose">Подарки</div>
                <h2 className="section-title">Дополните букет подарком</h2>
                <div className="w-12 h-px bg-pandora-rose/30 mt-4" />
              </div>
              <Link
                href="/catalog/gifts"
                className="hidden md:flex items-center gap-2 text-pandora-rose text-sm font-medium hover:gap-3 transition-all duration-200"
              >
                Все подарки
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {gifts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as Parameters<typeof ProductCard>[0]['product']}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY PANDORA ── */}
      <section className="py-20 bg-gradient-to-b from-white to-pandora-cream">
        <div className="container-site">
          <div className="text-center mb-14">
            <div className="text-pandora-rose text-xs tracking-[0.4em] uppercase mb-3">
              Почему выбирают нас
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-pandora-dark">
              Pandora Flowers
            </h2>
            <div className="w-12 h-px bg-pandora-rose/30 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: Gem,
                title: 'Авторские букеты',
                desc: 'Каждый букет — уникальное произведение флористического искусства, созданное нашими мастерами',
              },
              {
                icon: Truck,
                title: '60 минут доставки',
                desc: 'Мгновенная доставка по всему Бишкеку с фотоотчётом перед отправкой',
              },
              {
                icon: Gift,
                title: 'Шоколад в подарок',
                desc: 'К каждому букету — фирменный бельгийский шоколад Pandora. Приятный сюрприз',
              },
              {
                icon: Award,
                title: 'Рейтинг 4.8',
                desc: 'Более 168 довольных клиентов доверяют нам самые важные моменты жизни',
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-pandora-border flex items-center justify-center group-hover:border-pandora-rose group-hover:bg-pandora-blush transition-all duration-300">
                  <item.icon className="w-6 h-6 text-pandora-rose" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-pandora-dark mb-3 font-light">
                  {item.title}
                </h3>
                <p className="text-pandora-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM SECTION ── */}
      <section className="py-20 bg-white">
        <div className="container-site text-center">
          <div className="section-subtitle mb-3 text-pandora-rose">Следите за нами</div>
          <h2 className="section-title mb-2">@pandora__flowers</h2>
          <p className="text-pandora-muted text-sm mb-8">
            81 000 подписчиков уже следят за нами в Instagram
          </p>
          <a
            href="https://instagram.com/pandora__flowers"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Подписаться в Instagram
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 mt-10">
            {[
              'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=300&q=80',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
              'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=300&q=80',
              'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&q=80',
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80',
              'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=300&q=80',
            ].map((url, i) => (
              <a
                key={i}
                href="https://instagram.com/pandora__flowers"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-sm block group"
              >
                <Image
                  src={url}
                  alt="Pandora Flowers Instagram"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 group-hover:brightness-90"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="py-16 bg-gradient-to-r from-pandora-rose to-pandora-rose-light">
        <div className="container-site text-center text-white">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">
            Остались вопросы?
          </h2>
          <p className="text-white/75 mb-8 font-light">
            Мы всегда на связи. Позвоните или напишите нам прямо сейчас.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+996772070067"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pandora-rose font-medium rounded-sm hover:bg-pandora-cream transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              +996 772 07 00 67
            </a>
            <a
              href="https://wa.me/996772070067"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white rounded-sm hover:bg-white/10 transition-colors duration-200"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
