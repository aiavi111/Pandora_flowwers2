'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, cn, DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();

  const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const grandTotal = total + deliveryCost;
  const remaining = FREE_DELIVERY_THRESHOLD - total;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-pandora-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-pandora-rose" />
            <h2 className="font-serif text-xl text-pandora-dark">
              Корзина
            </h2>
            {count > 0 && (
              <span className="w-6 h-6 flex items-center justify-center bg-pandora-rose text-white text-xs font-bold rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-pandora-muted hover:text-pandora-dark transition-colors rounded-sm hover:bg-pandora-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery progress */}
        {total > 0 && total < FREE_DELIVERY_THRESHOLD && (
          <div className="px-6 py-3 bg-pandora-blush/30 border-b border-pandora-border">
            <div className="flex justify-between text-xs text-pandora-muted mb-2">
              <span>До бесплатной доставки</span>
              <span className="text-pandora-rose font-medium">{formatPrice(remaining)}</span>
            </div>
            <div className="h-1.5 bg-pandora-border rounded-full overflow-hidden">
              <div
                className="h-full bg-pandora-rose rounded-full transition-all duration-300"
                style={{ width: `${Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {total >= FREE_DELIVERY_THRESHOLD && (
          <div className="px-6 py-3 bg-pandora-blush border-b border-pandora-border text-xs text-pandora-rose text-center font-medium flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Бесплатная доставка
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-pandora-blush/30 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-pandora-rose/40" />
              </div>
              <h3 className="font-serif text-xl text-pandora-dark mb-2">
                Корзина пуста
              </h3>
              <p className="text-pandora-muted text-sm mb-6">
                Добавьте цветы, чтобы начать заказ
              </p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const image = item.product.images?.[0]?.url;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-pandora-border last:border-0"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-24 rounded-sm overflow-hidden bg-pandora-border flex-shrink-0"
                    >
                      {image && (
                        <Image
                          src={image}
                          alt={item.product.name}
                          width={80}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-pandora-text hover:text-pandora-rose transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-pandora-rose font-semibold mt-1">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-pandora-border rounded-sm overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-pandora-muted hover:text-pandora-rose hover:bg-pandora-border transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-pandora-muted hover:text-pandora-rose hover:bg-pandora-border transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-pandora-muted hover:text-red-500 transition-colors"
                          aria-label="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-pandora-border px-6 py-5">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-pandora-muted">
                <span>Товары ({count} шт.)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-pandora-muted">
                <span>Доставка</span>
                <span className={deliveryCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-pandora-dark text-base pt-2 border-t border-pandora-border">
                <span>Итого</span>
                <span className="text-pandora-rose">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center"
            >
              Оформить заказ
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block text-center text-sm text-pandora-muted hover:text-pandora-rose mt-3 transition-colors"
            >
              Перейти в корзину
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
