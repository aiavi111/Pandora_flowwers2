import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Truck, Clock, Sparkles, Gift, Phone,
  Star, ShieldCheck, Instagram, Leaf,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import { BrandImage } from '@/components/ui/BrandImage';
import { formatPrice } from '@/lib/utils';

async function getPopularProducts() {
  return prisma.product.findMany({
    where: { isPopular: true, inStock: true },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    orderBy: { sortOrder: 'asc' }, take: 8,
  });
}
async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, inStock: true },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    orderBy: { createdAt: 'desc' }, take: 5,
  });
}
async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, slug: { notIn: ['gifts'] } },
    orderBy: { sortOrder: 'asc' }, take: 6,
    include: {
      _count: { select: { products: true } },
      products: {
        where: { inStock: true },
        orderBy: { sortOrder: 'asc' },
        take: 1,
        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      },
    },
  });
}
async function getGifts() {
  return prisma.product.findMany({
    where: { category: { slug: 'gifts' }, inStock: true },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true }, take: 4,
  });
}

const CAT_TONE: Record<string, string> = {
  roses: 'red', peonies: 'pink', bouquets: 'mixed', tulips: 'peach',
  mono: 'white', wedding: 'white', chrysanthemums: 'yellow', gifts: 'cream',
};

export default async function HomePage() {
  const [popular, featured, categories, gifts] = await Promise.all([
    getPopularProducts(), getFeaturedProducts(), getCategories(), getGifts(),
  ]);

  const heroProduct = featured[0];

  return (
    <div className="page-enter">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #FFFFFF 0%, #FDF4F8 42%, #F6E1EC 100%)' }}>
        <div className="absolute -z-0 top-1/4 -left-24 w-[30rem] h-[30rem] rounded-full bg-accent-glow/25 blur-3xl pointer-events-none" />
        <div className="container-site relative z-[1] grid lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-12 pb-16 lg:pt-16 lg:pb-24">
          {/* Copy */}
          <div className="lg:col-span-6 lg:pr-6 order-2 lg:order-1">
            <div className="eyebrow mb-7" data-reveal>Авторская флористика · Бишкек</div>

            <h1 className="font-semibold tracking-tight text-ink leading-[1.02] text-[clamp(2.5rem,6vw,4.6rem)]" data-reveal style={{ transitionDelay: '60ms' }}>
              Цветы, которые<br />
              <span className="text-accent">запоминают</span>
            </h1>

            <p className="mt-7 text-lg text-ink-soft max-w-md leading-relaxed" data-reveal style={{ transitionDelay: '140ms' }}>
              Премиальные букеты ручной сборки с доставкой по Бишкеку за 60 минут.
              Каждая композиция — авторская работа наших флористов.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3" data-reveal style={{ transitionDelay: '220ms' }}>
              <Link href="/catalog" className="btn-primary btn-lg">
                Смотреть каталог <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/custom" className="btn-outline btn-lg">
                Букет на заказ
              </Link>
            </div>

            <dl className="mt-12 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-6" data-reveal style={{ transitionDelay: '300ms' }}>
              {[
                { v: '60 мин', l: 'доставка' },
                { v: '4.8', l: 'рейтинг' },
                { v: '81K', l: 'в Instagram' },
                { v: '5 лет', l: 'на рынке' },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-3xl font-bold tracking-tight text-ink leading-none">{s.v}</dt>
                  <dd className="text-xs text-ink-muted tracking-wider uppercase mt-1.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Media composition */}
          <div className="lg:col-span-6 order-1 lg:order-2" data-reveal style={{ transitionDelay: '120ms' }}>
            <div className="relative">
              <div className="media aspect-[4/5] rounded-xl2 shadow-lift animate-kenburns">
                <BrandImage src="/images/hero/hero-1.jpg" alt="Авторский букет Pandora Flowers"
                  tone="pink" label="Pandora Flowers" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>

              {/* floating rating card */}
              <div className="hidden sm:flex absolute -left-4 lg:-left-8 bottom-10 glass-card rounded-card shadow-lift p-4 pr-6 items-center gap-3 animate-float">
                <div className="flex -space-x-2">
                  {['#E3BFC6', '#EDCBD7', '#E7D5AC'].map((c) => (
                    <span key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-champagne">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5">168+ счастливых клиентов</div>
                </div>
              </div>

              {/* floating delivery chip */}
              <div className="hidden sm:flex absolute -right-3 lg:-right-6 top-8 glass-card rounded-pill shadow-soft px-4 py-2.5 items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-ink">Доставка 60 мин</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -z-0 -top-24 -right-24 w-96 h-96 rounded-full bg-accent-soft/40 blur-3xl pointer-events-none" />
      </section>

      {/* ─────────────────── TRUST STRIP (marquee) ─────────────────── */}
      <section className="bg-ink text-porcelain/70 py-3.5 overflow-hidden">
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
                {[
                  ['Доставка по Бишкеку за 60 минут', Truck],
                  ['Фотоотчёт перед отправкой', ShieldCheck],
                  ['Свежие цветы каждый день', Leaf],
                  ['Шоколад в подарок к букету', Gift],
                  ['Работаем 09:00 – 00:00', Clock],
                  ['Авторская сборка', Sparkles],
                ].map(([t, Icon]: any, i) => (
                  <span key={i} className="flex items-center gap-2.5 px-7 text-xs tracking-wide whitespace-nowrap">
                    <Icon className="w-3.5 h-3.5 text-champagne" /> {t}
                    <span className="text-champagne/40 ml-7">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── CATEGORIES ──────────────────────── */}
      <section className="section bg-porcelain">
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12" data-reveal>
            <div>
              <div className="section-subtitle mb-3">Коллекции</div>
              <h2 className="section-title">Выберите повод</h2>
            </div>
            <Link href="/catalog" className="link-underline text-sm font-medium text-ink hover:text-accent self-start md:self-auto">
              Весь каталог <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <Link key={cat.id} href={`/catalog/${cat.slug}`}
                className="group relative block media aspect-[3/4] shadow-card hover:shadow-card-hover transition-shadow duration-500"
                data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                <BrandImage src={cat.imageUrl ?? cat.products?.[0]?.images?.[0]?.url} alt={cat.name} tone={(CAT_TONE[cat.slug] ?? 'mixed') as never}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  imgClassName="transition-transform duration-[1.1s] ease-out-expo group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-center text-porcelain">
                  <div className="font-serif text-lg leading-tight">{cat.name}</div>
                  <div className="text-[0.66rem] text-porcelain/60 mt-1 tracking-wider uppercase">
                    {cat._count.products} {cat._count.products === 1 ? 'букет' : 'букетов'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────── POPULAR BOUQUETS ────────────────────── */}
      <section className="section bg-porcelain-deep">
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12" data-reveal>
            <div>
              <div className="section-subtitle mb-3">Выбор клиентов</div>
              <h2 className="section-title">Букеты, которые любят</h2>
            </div>
            <Link href="/catalog" className="link-underline text-sm font-medium text-ink hover:text-accent self-start md:self-auto">
              Смотреть все <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popular.map((p, i) => (
              <div key={p.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <ProductCard product={p as Parameters<typeof ProductCard>[0]['product']} priority={i < 4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── FEATURED SHOWCASE ───────────────────── */}
      {heroProduct && featured.length >= 3 && (
        <section className="section bg-porcelain">
          <div className="container-site">
            <div className="text-center max-w-2xl mx-auto mb-14" data-reveal>
              <div className="section-subtitle eyebrow eyebrow-center justify-center mb-4">Витрина сезона</div>
              <h2 className="section-title">Подписанные работы ателье</h2>
              <p className="mt-4 text-ink-soft">Флагманские композиции, которыми мы гордимся больше всего.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
              {/* large left */}
              <Link href={`/product/${heroProduct.slug}`}
                className="md:col-span-7 group relative block media aspect-[4/3] md:aspect-auto md:h-[34rem] shadow-card hover:shadow-card-hover transition-shadow duration-500"
                data-reveal>
                <BrandImage src={heroProduct.images?.[0]?.url} alt={heroProduct.name}
                  tone={(heroProduct.colors?.split(',')[0] || 'mixed') as never}
                  label={heroProduct.category?.name} sizes="(max-width: 768px) 100vw, 58vw"
                  imgClassName="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-porcelain">
                  <div className="text-eyebrow uppercase text-champagne mb-2">{heroProduct.category?.name}</div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-md">{heroProduct.name}</h3>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-lg">{heroProduct.price > 0 ? formatPrice(heroProduct.price) : 'Цена по запросу'}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm border border-white/30 rounded-pill px-4 py-1.5 group-hover:bg-porcelain group-hover:text-ink transition-colors">
                      Подробнее <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* right column */}
              <div className="md:col-span-5 grid grid-rows-2 gap-4 md:gap-5 md:h-[34rem]">
                {featured.slice(1, 3).map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`}
                    className="group relative block media aspect-[16/10] md:aspect-auto shadow-card hover:shadow-card-hover transition-shadow duration-500"
                    data-reveal>
                    <BrandImage src={p.images?.[0]?.url} alt={p.name}
                      tone={(p.colors?.split(',')[0] || 'mixed') as never}
                      label={p.category?.name} sizes="(max-width: 768px) 100vw, 42vw"
                      imgClassName="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-porcelain">
                      <h3 className="text-lg md:text-xl font-semibold tracking-tight">{p.name}</h3>
                      <span className="text-sm text-porcelain/80">{p.price > 0 ? formatPrice(p.price) : 'Цена по запросу'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ────────────────────── CUSTOM CTA BAND ────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #FDF2F6 0%, #F8E2EC 48%, #F0D2E2 100%)' }}>
        <div className="absolute -right-20 -top-24 w-[28rem] h-[28rem] rounded-full bg-white/50 blur-3xl pointer-events-none" />
        <div className="absolute right-24 -bottom-24 w-96 h-96 rounded-full bg-accent-glow/30 blur-3xl pointer-events-none" />
        <div className="container-site relative py-20 lg:py-28">
          <div className="max-w-xl" data-reveal>
            <div className="eyebrow mb-6">Индивидуальный заказ</div>
            <h2 className="text-display-sm md:text-display font-bold leading-[1.05] tracking-tight text-ink">
              Не нашли<br /><span className="text-accent">идеальный букет?</span>
            </h2>
            <p className="mt-5 text-ink-soft text-lg max-w-md leading-relaxed">
              Опишите задумку, повод и бюджет — флористы соберут уникальную композицию
              специально для вас и пришлют фото перед доставкой.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/custom" className="btn-primary btn-lg">
                Создать букет <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/996772070067" target="_blank" rel="noopener noreferrer" className="btn-outline btn-lg">
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── THE PROMISE ──────────────────────── */}
      <section className="section bg-porcelain">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16" data-reveal>
            <div className="section-subtitle eyebrow eyebrow-center justify-center mb-4">Почему Pandora</div>
            <h2 className="section-title">Обещание ателье</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {[
              { icon: Sparkles, t: 'Авторская сборка', d: 'Каждый букет — ручная работа флориста, а не конвейер. Композиция, которой нет больше ни у кого.' },
              { icon: Truck, t: 'Доставка 60 минут', d: 'Привезём по всему Бишкеку за час и пришлём фото букета перед отправкой получателю.' },
              { icon: Leaf, t: 'Свежесть гарантирована', d: 'Только свежий срез и проверенные поставщики. Букеты, которые радуют долго.' },
              { icon: Gift, t: 'Подарок в каждом', d: 'Фирменный бельгийский шоколад Pandora и открытка с вашими словами — бесплатно.' },
            ].map((f, i) => (
              <div key={f.t} className="text-center sm:text-left" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 mx-auto sm:mx-0 grid place-items-center rounded-full bg-accent-soft text-accent-deep mb-5">
                  <f.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-ink mb-2.5">{f.t}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────── GIFTS ──────────────────────────── */}
      {gifts.length > 0 && (
        <section className="section bg-porcelain-deep">
          <div className="container-site">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12" data-reveal>
              <div>
                <div className="section-subtitle mb-3">Дополните букет</div>
                <h2 className="section-title">Подарки и комплименты</h2>
              </div>
              <Link href="/catalog/gifts" className="link-underline text-sm font-medium text-ink hover:text-accent self-start md:self-auto">
                Все подарки <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {gifts.map((p, i) => (
                <div key={p.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                  <ProductCard product={p as Parameters<typeof ProductCard>[0]['product']} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────── INSTAGRAM ──────────────────────── */}
      <section className="section bg-porcelain">
        <div className="container-site">
          <div className="text-center mb-10" data-reveal>
            <div className="section-subtitle eyebrow eyebrow-center justify-center mb-3">Живая лента</div>
            <h2 className="section-title">@pandora__flowers</h2>
            <p className="mt-3 text-ink-soft">81 000 подписчиков уже с нами в Instagram</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3" data-reveal>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <a key={n} href="https://instagram.com/pandora__flowers" target="_blank" rel="noopener noreferrer"
                className="group relative block media aspect-square">
                <BrandImage src={`/images/gallery/post-${n}.jpg`} alt="Pandora Flowers в Instagram"
                  tone={(['red', 'pink', 'mixed', 'peach', 'white', 'cream'][n - 1]) as never}
                  sizes="(max-width: 768px) 33vw, 16vw"
                  imgClassName="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors grid place-items-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://instagram.com/pandora__flowers" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Instagram className="w-4 h-4" /> Подписаться
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────── CONTACT CTA ──────────────────────── */}
      <section className="relative bg-blush-gradient">
        <div className="container-site py-16 text-center" data-reveal>
          <h2 className="text-display-sm font-bold tracking-tight text-ink">Остались вопросы?</h2>
          <p className="mt-3 text-ink-soft max-w-md mx-auto">Поможем выбрать букет и оформить доставку — позвоните или напишите прямо сейчас.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="tel:+996772070067" className="btn-primary btn-lg">
              <Phone className="w-4 h-4" /> +996 772 07 00 67
            </a>
            <a href="https://wa.me/996772070067" target="_blank" rel="noopener noreferrer" className="btn-outline btn-lg">
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
