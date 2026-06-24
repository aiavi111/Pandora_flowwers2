'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  Clock,
  Award,
  Star,
  ChevronRight,
  Plus,
  Minus,
  Phone,
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

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { toggle, isFavorite } = useFavoritesStore();

  const isLiked = isFavorite(product.id);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;

  const colors = product.colors?.split(',').filter(Boolean) ?? [];
  const flowers = product.flowers?.split(',').filter(Boolean) ?? [];
  const occasions = product.occasion?.split(',').filter(Boolean) ?? [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} × ${quantity} добавлен в корзину`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = '/checkout';
  };

  const handleFavorite = () => {
    toggle(product.id);
    toast(isLiked ? 'Удалено из избранного' : 'Добавлено в избранное', {
      icon: isLiked ? '💔' : '❤️',
    });
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="bg-pandora-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-pandora-border">
        <div className="container-site py-3">
          <nav className="flex items-center gap-2 text-xs text-pandora-muted">
            <Link href="/" className="hover:text-pandora-rose transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/catalog" className="hover:text-pandora-rose transition-colors">Каталог</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/catalog?category=${product.category.slug}`}
                  className="hover:text-pandora-rose transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-pandora-text truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ── IMAGE GALLERY ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-white shadow-card">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt ?? product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <span className="badge-new">Новинка</span>}
                {product.isPopular && <span className="badge-popular">Хит продаж</span>}
                {discount && <span className="badge-sale">−{discount}%</span>}
              </div>

              {/* Favorite */}
              <button
                onClick={handleFavorite}
                className={cn(
                  'absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200',
                  isLiked
                    ? 'bg-pandora-rose text-white scale-110'
                    : 'bg-white text-pandora-muted hover:text-pandora-rose hover:scale-110'
                )}
              >
                <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden transition-all duration-200',
                      selectedImage === i
                        ? 'ring-2 ring-pandora-rose ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div>
            {/* Category */}
            <div className="text-pandora-muted text-xs uppercase tracking-wider mb-2">
              {product.category?.name}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-pandora-dark mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.round(avgRating)
                          ? 'text-pandora-gold fill-pandora-gold'
                          : 'text-pandora-border'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-pandora-muted">
                  {avgRating.toFixed(1)} ({product.reviews.length} отзывов)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-4xl text-pandora-rose font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-pandora-muted text-lg line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {discount && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-sm font-medium">
                  Скидка {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-pandora-text leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Composition */}
            {product.composition && (
              <div className="bg-pandora-blush/30 rounded-sm p-4 mb-6">
                <div className="text-xs font-semibold text-pandora-rose uppercase tracking-wider mb-2">
                  Состав
                </div>
                <p className="text-sm text-pandora-text">{product.composition}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.size && (
                <div className="text-sm">
                  <span className="text-pandora-muted">Размер: </span>
                  <span className="text-pandora-text font-medium">
                    {{ small: 'Маленький', medium: 'Средний', large: 'Большой', xl: 'XL' }[product.size] ?? product.size}
                  </span>
                </div>
              )}
              {colors.length > 0 && (
                <div className="text-sm">
                  <span className="text-pandora-muted">Цвета: </span>
                  <span className="text-pandora-text font-medium">
                    {colors.map((c) => FLOWER_COLORS[c] ?? c).join(', ')}
                  </span>
                </div>
              )}
              {flowers.length > 0 && (
                <div className="text-sm col-span-2">
                  <span className="text-pandora-muted">Цветы: </span>
                  <span className="text-pandora-text font-medium capitalize">
                    {flowers.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Occasions */}
            {occasions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {occasions.map((occ) => (
                  <span
                    key={occ}
                    className="px-3 py-1 bg-white border border-pandora-border text-pandora-muted text-xs rounded-full"
                  >
                    {({ birthday: 'День рождения', anniversary: 'Годовщина', romance: 'Романтика', wedding: 'Свадьба', march8: '8 марта', holiday: 'Праздник' } as Record<string, string>)[occ] ?? occ}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-pandora-muted">Количество:</span>
              <div className="flex items-center border border-pandora-border rounded-sm overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pandora-border transition-colors"
                >
                  <Minus className="w-4 h-4 text-pandora-muted" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pandora-border transition-colors"
                >
                  <Plus className="w-4 h-4 text-pandora-muted" />
                </button>
              </div>
              <span className="text-pandora-rose font-semibold">
                = {formatPrice(product.price * quantity)}
              </span>
            </div>

            {/* Actions */}
            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="btn-secondary flex-1 text-base py-4"
                >
                  <ShoppingBag className="w-5 h-5" />
                  В корзину
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary flex-1 text-base py-4"
                >
                  <Zap className="w-5 h-5" />
                  Купить сейчас
                </button>
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-500 text-center py-4 rounded-sm mb-6 font-medium">
                Нет в наличии
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-pandora-border">
              {[
                {
                  icon: <Truck className="w-5 h-5 text-pandora-gold" />,
                  title: 'Доставка за 60 минут',
                  desc: 'По всему Бишкеку • Фотоотчёт перед отправкой',
                },
                {
                  icon: <Award className="w-5 h-5 text-pandora-gold" />,
                  title: 'Шоколад в подарок',
                  desc: 'Фирменный бельгийский шоколад к каждому букету',
                },
                {
                  icon: <Clock className="w-5 h-5 text-pandora-gold" />,
                  title: 'Работаем 09:00–00:00',
                  desc: 'Закажите в любое удобное время без выходных',
                },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 flex-shrink-0 mt-0.5">{feat.icon}</div>
                  <div>
                    <div className="text-sm font-medium text-pandora-dark">{feat.title}</div>
                    <div className="text-xs text-pandora-muted">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="mt-6 pt-6 border-t border-pandora-border">
              <a
                href={`https://wa.me/996772070067?text=Хочу заказать: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-pandora-muted hover:text-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Заказать через WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl text-pandora-dark mb-8">
            Отзывы ({product.reviews.length})
          </h2>

          {product.reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-sm">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-pandora-muted">Отзывов пока нет. Будьте первым!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-sm shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-pandora-dark">{review.customer?.name ?? 'Покупатель'}</div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-3.5 h-3.5',
                            i < review.rating
                              ? 'text-pandora-gold fill-pandora-gold'
                              : 'text-pandora-border'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-pandora-text text-sm leading-relaxed">{review.text}</p>
                  )}
                  <div className="text-xs text-pandora-muted mt-3">
                    {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RELATED ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-pandora-dark">Похожие букеты</h2>
              <Link
                href={`/catalog?category=${product.category?.slug}`}
                className="text-pandora-rose text-sm hover:underline"
              >
                Смотреть все →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
