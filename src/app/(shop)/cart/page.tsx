'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const grandTotal = total + deliveryCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-pandora-cream flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-pandora-blush/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-pandora-rose/40" />
          </div>
          <h1 className="font-serif text-3xl text-pandora-dark mb-3">Корзина пуста</h1>
          <p className="text-pandora-muted mb-8">Добавьте цветы, чтобы оформить заказ</p>
          <Link href="/catalog" className="btn-primary">
            Перейти в каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pandora-cream min-h-screen">
      <div className="bg-white border-b border-pandora-border">
        <div className="container-site py-8">
          <h1 className="section-title">Корзина</h1>
          <p className="text-pandora-muted text-sm mt-1">{count} товара на сумму {formatPrice(total)}</p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const image = item.product.images?.[0]?.url;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-sm shadow-card p-4 md:p-6 flex gap-4 md:gap-6"
                >
                  <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-32 md:w-28 md:h-36 rounded-sm overflow-hidden bg-pandora-border">
                      {image && (
                        <Image
                          src={image}
                          alt={item.product.name}
                          width={112}
                          height={144}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-pandora-muted mb-1">
                      {item.product.category?.name}
                    </div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium text-pandora-dark hover:text-pandora-rose transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-pandora-border rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-pandora-border transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-pandora-muted" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-pandora-border transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-pandora-muted" />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-pandora-dark">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-pandora-muted">
                              {formatPrice(item.product.price)} × {item.quantity}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-pandora-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="font-serif text-xl text-pandora-dark mb-5">Итого</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-pandora-muted">Товары ({count} шт.)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pandora-muted">Доставка</span>
                  <span className={deliveryCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                  </span>
                </div>
                {deliveryCost > 0 && (
                  <div className="text-xs text-pandora-muted bg-pandora-blush/20 px-3 py-2 rounded-sm">
                    До бесплатной доставки: {formatPrice(FREE_DELIVERY_THRESHOLD - total)}
                  </div>
                )}
              </div>

              <div className="border-t border-pandora-border pt-4 mb-6">
                <div className="flex justify-between font-semibold text-pandora-dark text-lg">
                  <span>К оплате</span>
                  <span className="text-pandora-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center text-base py-4">
                Оформить заказ
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 flex items-center gap-2 text-xs text-pandora-muted justify-center">
                <Tag className="w-3.5 h-3.5" />
                Есть промокод? Введите при оформлении
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-pandora-dark text-white rounded-sm p-5 text-sm space-y-2">
              <div className="text-pandora-gold font-medium mb-3">Доставка</div>
              <div>⚡ Экспресс-доставка за 60 минут</div>
              <div>📦 Доставка {formatPrice(DELIVERY_COST)}</div>
              <div>🎁 Бесплатно от {formatPrice(FREE_DELIVERY_THRESHOLD)}</div>
              <div>🕐 Доставляем 09:00–00:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
