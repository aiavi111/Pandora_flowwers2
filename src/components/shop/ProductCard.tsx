'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { formatPrice, cn } from '@/lib/utils';
import { BrandImage } from '@/components/ui/BrandImage';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isFavorite } = useFavoritesStore();

  const mainImage = product.images?.[0]?.url ?? '';
  const hoverImage = product.images?.[1]?.url ?? '';
  const isLiked = isFavorite(product.id);
  const tone = (product.colors?.split(',')[0]?.trim() || 'mixed') as never;
  const hasPrice = product.price > 0;

  const discount = product.oldPrice && hasPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!hasPrice) { window.location.href = `/custom?ref=${product.slug}`; return; }
    addItem(product);
    setAdded(true);
    toast.success(`«${product.name}» в корзине`);
    setTimeout(() => setAdded(false), 1400);
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggle(product.id);
    toast(isLiked ? 'Удалено из избранного' : 'В избранном', { icon: isLiked ? '🤍' : '🩷' });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="card-product card-hover h-full flex flex-col">
        {/* Media */}
        <div className="media aspect-[4/5]">
          <BrandImage
            src={mainImage} alt={product.name} tone={tone} label={product.category?.name}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            imgClassName="transition-transform duration-[1.1s] ease-out-expo group-hover:scale-[1.06]"
          />
          {hoverImage && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <BrandImage src={hoverImage} alt={product.name} tone={tone}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            </div>
          )}

          {/* top gradient for badge legibility */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/12 to-transparent opacity-60 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="badge-new">Новинка</span>}
            {product.isPopular && !product.isNew && <span className="badge-popular">Хит</span>}
            {discount && <span className="badge-sale">−{discount}%</span>}
            {!product.inStock && <span className="badge bg-ink/70 text-white">Нет в наличии</span>}
          </div>

          {/* Favorite */}
          <button onClick={toggleFav}
            className={cn(
              'absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full transition-all duration-300 glass-card',
              isLiked ? 'text-accent scale-105' : 'text-ink/70 hover:text-accent hover:scale-105',
            )}
            aria-label={isLiked ? 'Удалить из избранного' : 'В избранное'}>
            <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>

          {/* Quick add */}
          <div className="absolute inset-x-3 bottom-3 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-500 ease-out-expo">
            <button onClick={addToCart} disabled={!product.inStock}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-pill transition-colors duration-300 backdrop-blur',
                !product.inStock ? 'bg-ink/30 text-white/70 cursor-not-allowed'
                  : added ? 'bg-champagne text-ink' : 'bg-ink/92 text-porcelain hover:bg-accent',
              )}>
              {added ? <><Check className="w-4 h-4" /> Добавлено</>
                : hasPrice ? <><Plus className="w-4 h-4" /> В корзину</> : 'Заказать'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 px-1 pt-4 pb-1">
          <div className="text-[0.66rem] text-ink-muted uppercase tracking-[0.18em] mb-1.5">
            {product.category?.name ?? 'Pandora'}
          </div>
          <h3 className="font-serif text-lg leading-snug text-ink mb-3 line-clamp-2 group-hover:text-accent-deep transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              {hasPrice ? (
                <>
                  <span className="font-medium text-ink text-[1.05rem]">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-xs text-ink-muted line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                </>
              ) : (
                <span className="text-sm text-accent-deep font-medium">Цена по запросу</span>
              )}
            </div>
            <span className="w-9 h-9 grid place-items-center rounded-full border border-line text-ink-soft group-hover:bg-ink group-hover:text-porcelain group-hover:border-ink transition-all duration-300">
              <Plus className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
