'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isFavorite } = useFavoritesStore();

  const mainImage = product.images?.[0]?.url ?? '';
  const hoverImage = product.images?.[1]?.url ?? mainImage;
  const isLiked = isFavorite(product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast(isLiked ? 'Удалено из избранного' : 'Добавлено в избранное', {
      icon: isLiked ? '💔' : '❤️',
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="card-product block group">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {mainImage && (
          <>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-700 group-hover:scale-105',
                hoverImage !== mainImage && 'group-hover:opacity-0',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              priority={priority}
              onLoad={() => setImageLoaded(true)}
            />
            {hoverImage !== mainImage && (
              <Image
                src={hoverImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
            )}
          </>
        )}

        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-pandora-blush/30 to-pandora-border animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge-new">Новинка</span>}
          {product.isPopular && !product.isNew && (
            <span className="badge-popular">Хит</span>
          )}
          {discount && <span className="badge-sale">−{discount}%</span>}
          {!product.inStock && (
            <span className="badge bg-gray-500 text-white">Нет в наличии</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-200',
            isLiked
              ? 'bg-pandora-rose text-white scale-110'
              : 'bg-white text-pandora-muted hover:text-pandora-rose hover:scale-110'
          )}
          aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart
            className="w-4 h-4"
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>

        {/* Overlay actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-sm transition-all duration-200',
                product.inStock
                  ? 'bg-pandora-dark text-white hover:bg-pandora-rose'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.inStock ? 'В корзину' : 'Нет в наличии'}</span>
            </button>
            <Link
              href={`/product/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 flex items-center justify-center bg-white text-pandora-text hover:text-pandora-rose rounded-sm transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs text-pandora-muted uppercase tracking-wider mb-1">
          {product.category?.name ?? ''}
        </div>
        <h3 className="font-medium text-pandora-text text-sm leading-snug mb-3 line-clamp-2 group-hover:text-pandora-rose transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-pandora-dark">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-pandora-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200',
              product.inStock
                ? 'bg-pandora-rose text-white hover:bg-pandora-dark hover:scale-110'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
            aria-label="Добавить в корзину"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
