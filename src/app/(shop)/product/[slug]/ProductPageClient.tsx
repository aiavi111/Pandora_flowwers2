'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandImage } from '@/components/ui/BrandImage';
import {
  Heart, ShoppingBag, Zap, Truck, Gift, Clock, Star, ChevronRight, Plus, Minus, Phone, Check,
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { formatPrice, cn, FLOWER_COLORS } from '@/lib/utils';
import ProductCard from '@/components/shop/ProductCard';
import toast from 'react-hot-toast';

interface ProductPageClientProps {
  product: Product & { reviews: { id: string; rating: number; text?: string | null; createdAt: Date | string; customer: { name: string } }[] };
  relatedProducts: Product[];
}

const SIZE_LABELS: Record<string, string> = { small: 'Маленький', medium: 'Средний', large: 'Большой', xl: 'XL' };
const OCC_LABELS: Record<string, string> = { birthday: 'День рождения', anniversary: 'Годовщина', romance: 'Романтика', wedding: 'Свадьба', march8: '8 марта', holiday: 'Праздник', housewarming: 'Новоселье', condolence: 'Соболезнование' };

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const { toggle, isFavorite } = useFavoritesStore();

  const isLiked = isFavorite(product.id);
  const tone = (product.colors?.split(',')[0]?.trim() || 'mixed') as never;
  const hasPrice = product.price > 0;
  const avgRating = product.reviews.length ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : null;
  const colors = product.colors?.split(',').filter(Boolean) ?? [];
  const flowers = product.flowers?.split(',').filter(Boolean) ?? [];
  const occasions = product.occasion?.split(',').filter(Boolean) ?? [];
  const discount = product.oldPrice && hasPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const addToCart = () => { addItem(product, qty); toast.success(`«${product.name}» × ${qty} в корзине`); };
  const buyNow = () => { addItem(product, qty); window.location.href = '/checkout'; };
  const fav = () => { toggle(product.id); toast(isLiked ? 'Удалено из избранного' : 'В избранном', { icon: isLiked ? '🤍' : '🩷' }); };

  return (
    <div className="bg-porcelain">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-white">
        <div className="container-site py-3.5">
          <nav className="flex items-center gap-2 text-xs text-ink-muted">
            <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/catalog" className="hover:text-accent transition-colors">Каталог</Link>
            {product.category && (<>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/catalog/${product.category.slug}`} className="hover:text-accent transition-colors">{product.category.name}</Link>
            </>)}
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink-soft truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
            <div className="media aspect-[4/5] shadow-soft">
              <BrandImage src={product.images[selected]?.url} alt={product.images[selected]?.alt ?? product.name}
                tone={tone} label={product.category?.name} priority sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isNew && <span className="badge-new">Новинка</span>}
                {product.isPopular && <span className="badge-popular">Хит продаж</span>}
                {discount && <span className="badge-sale">−{discount}%</span>}
              </div>
              <button onClick={fav} className={cn('absolute top-4 right-4 w-11 h-11 grid place-items-center rounded-full glass-card transition-all z-10',
                isLiked ? 'text-accent scale-105' : 'text-ink/70 hover:text-accent hover:scale-105')} aria-label="В избранное">
                <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.8} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setSelected(i)}
                    className={cn('relative w-20 h-24 flex-shrink-0 rounded-input overflow-hidden transition-all duration-200',
                      selected === i ? 'ring-2 ring-ink ring-offset-2 ring-offset-porcelain' : 'opacity-60 hover:opacity-100')}>
                    <BrandImage src={img.url} alt={img.alt ?? product.name} tone={tone} sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-2">
            <div className="section-subtitle mb-3">{product.category?.name}</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink leading-tight mb-4">{product.name}</h1>

            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < Math.round(avgRating) ? 'text-champagne fill-champagne' : 'text-line')} />
                  ))}
                </div>
                <span className="text-sm text-ink-muted">{avgRating.toFixed(1)} · {product.reviews.length} отзывов</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              {hasPrice ? (<>
                <span className="text-4xl font-bold tracking-tight text-ink">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-ink-muted text-lg line-through">{formatPrice(product.oldPrice)}</span>}
                {discount && <span className="badge-sale">−{discount}%</span>}
              </>) : (
                <span className="text-2xl font-bold text-accent-deep">Цена по запросу</span>
              )}
            </div>

            <p className="text-ink-soft leading-relaxed mb-6">{product.description}</p>

            {product.composition && (
              <div className="bg-accent-soft/50 border border-accent-soft rounded-card p-5 mb-6">
                <div className="text-xs font-semibold text-accent-deep uppercase tracking-[0.14em] mb-2">Состав</div>
                <p className="text-sm text-ink">{product.composition}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-7 text-sm">
              {product.size && <Detail label="Размер" value={SIZE_LABELS[product.size] ?? product.size} />}
              {colors.length > 0 && <Detail label="Цвета" value={colors.map((c) => FLOWER_COLORS[c] ?? c).join(', ')} />}
              {flowers.length > 0 && <div className="col-span-2"><Detail label="Цветы" value={flowers.join(', ')} cap /></div>}
            </div>

            {occasions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">
                {occasions.map((o) => (
                  <span key={o} className="px-3 py-1 bg-white border border-line text-ink-soft text-xs rounded-pill">{OCC_LABELS[o] ?? o}</span>
                ))}
              </div>
            )}

            {/* Quantity + actions */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-ink-muted">Количество</span>
              <div className="flex items-center border border-line rounded-pill overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 grid place-items-center hover:bg-porcelain-deep transition-colors"><Minus className="w-4 h-4 text-ink-soft" /></button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 grid place-items-center hover:bg-porcelain-deep transition-colors"><Plus className="w-4 h-4 text-ink-soft" /></button>
              </div>
              {hasPrice && <span className="text-ink font-semibold ml-auto">{formatPrice(product.price * qty)}</span>}
            </div>

            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {hasPrice ? (<>
                  <button onClick={addToCart} className="btn-outline flex-1 btn-lg"><ShoppingBag className="w-5 h-5" /> В корзину</button>
                  <button onClick={buyNow} className="btn-primary flex-1 btn-lg"><Zap className="w-5 h-5" /> Купить сейчас</button>
                </>) : (
                  <a href={`https://wa.me/996772070067?text=${encodeURIComponent('Здравствуйте! Хочу узнать цену: ' + product.name)}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 btn-lg">
                    <Phone className="w-5 h-5" /> Узнать цену
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-porcelain-deep text-ink-muted text-center py-4 rounded-pill mb-6 font-medium">Нет в наличии</div>
            )}

            {/* Trust features */}
            <div className="grid gap-3.5 pt-6 border-t border-line">
              {[
                { icon: Truck, t: 'Доставка за 60 минут', d: 'По всему Бишкеку · фотоотчёт перед отправкой' },
                { icon: Gift, t: 'Шоколад в подарок', d: 'Фирменный бельгийский шоколад к каждому букету' },
                { icon: Clock, t: 'Работаем 09:00–00:00', d: 'Закажите в любое удобное время, без выходных' },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-soft grid place-items-center flex-shrink-0"><f.icon className="w-5 h-5 text-accent-deep" strokeWidth={1.6} /></div>
                  <div><div className="text-sm font-semibold text-ink">{f.t}</div><div className="text-xs text-ink-muted">{f.d}</div></div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-line flex flex-wrap gap-4">
              <a href={`https://wa.me/996772070067?text=${encodeURIComponent('Хочу заказать: ' + product.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-accent transition-colors"><Phone className="w-4 h-4" /> Заказать в WhatsApp</a>
              <a href="https://t.me/pandora__flowers" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-accent transition-colors">Заказать в Telegram</a>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink mb-8">Отзывы {product.reviews.length > 0 && <span className="text-ink-muted font-normal">({product.reviews.length})</span>}</h2>
          {product.reviews.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-card border border-line">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-soft grid place-items-center"><Check className="w-6 h-6 text-accent-deep" /></div>
              <p className="text-ink-soft">Отзывов пока нет — станьте первым!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-card border border-line shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-soft grid place-items-center text-accent-deep font-semibold text-sm">{(r.customer?.name ?? 'К')[0]}</div>
                      <div className="font-semibold text-ink text-sm">{r.customer?.name ?? 'Покупатель'}</div>
                    </div>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-3.5 h-3.5', i < r.rating ? 'text-champagne fill-champagne' : 'text-line')} />)}</div>
                  </div>
                  {r.text && <p className="text-ink-soft text-sm leading-relaxed">{r.text}</p>}
                  <div className="text-xs text-ink-muted mt-3">{new Date(r.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">Похожие букеты</h2>
              <Link href={`/catalog/${product.category?.slug}`} className="link-underline text-sm font-medium text-ink hover:text-accent">Смотреть все →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, cap }: { label: string; value: string; cap?: boolean }) {
  return (
    <div>
      <span className="text-ink-muted">{label}: </span>
      <span className={cn('text-ink font-medium', cap && 'capitalize')}>{value}</span>
    </div>
  );
}
