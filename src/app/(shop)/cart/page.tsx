'use client';

import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Zap, Truck, Gift, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { BrandImage } from '@/components/ui/BrandImage';
import { formatPrice, DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const grandTotal = total + deliveryCost;
  const progress = Math.min(100, Math.round((total / FREE_DELIVERY_THRESHOLD) * 100));

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-porcelain flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-accent-soft rounded-full grid place-items-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-accent-deep" strokeWidth={1.4} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink mb-3">Корзина пуста</h1>
          <p className="text-ink-soft mb-8">Добавьте букеты, чтобы оформить заказ.</p>
          <Link href="/catalog" className="btn-primary btn-lg">Перейти в каталог <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-porcelain min-h-screen">
      <div className="bg-porcelain-fade border-b border-line">
        <div className="container-site py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">Корзина</h1>
          <p className="text-ink-soft text-sm mt-2">{count} {count === 1 ? 'товар' : 'товара'} на сумму {formatPrice(total)}</p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-card border border-line shadow-card p-4 md:p-5 flex gap-4 md:gap-5">
                <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <div className="media w-24 h-32 md:w-28 md:h-36">
                    <BrandImage src={item.product.images?.[0]?.url} alt={item.product.name}
                      tone={(item.product.colors?.split(',')[0] || 'mixed') as never} sizes="120px" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">{item.product.category?.name}</div>
                  <Link href={`/product/${item.product.slug}`} className="font-semibold text-ink hover:text-accent transition-colors line-clamp-2 leading-snug">{item.product.name}</Link>
                  <div className="flex items-center justify-between mt-auto pt-4 flex-wrap gap-3">
                    <div className="flex items-center border border-line rounded-pill overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 grid place-items-center hover:bg-porcelain-deep transition-colors"><Minus className="w-3.5 h-3.5 text-ink-soft" /></button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 grid place-items-center hover:bg-porcelain-deep transition-colors"><Plus className="w-3.5 h-3.5 text-ink-soft" /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-ink">{formatPrice(item.product.price * item.quantity)}</div>
                        {item.quantity > 1 && <div className="text-xs text-ink-muted">{formatPrice(item.product.price)} × {item.quantity}</div>}
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-ink-muted hover:text-red-500 transition-colors" aria-label="Удалить"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-accent transition-colors pt-2">← Продолжить покупки</Link>
          </div>

          {/* Summary */}
          <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white rounded-card border border-line shadow-card p-6">
              <h2 className="text-lg font-bold text-ink mb-5">Итого</h2>
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between"><span className="text-ink-soft">Товары ({count} шт.)</span><span className="font-medium">{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Доставка</span><span className={deliveryCost === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span></div>
                {deliveryCost > 0 && (
                  <div className="pt-1">
                    <div className="h-1.5 bg-porcelain-deep rounded-full overflow-hidden mb-2"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
                    <div className="text-xs text-ink-muted">До бесплатной доставки: {formatPrice(FREE_DELIVERY_THRESHOLD - total)}</div>
                  </div>
                )}
              </div>
              <div className="border-t border-line pt-4 mb-6 flex justify-between items-baseline">
                <span className="font-bold text-ink">К оплате</span>
                <span className="text-2xl font-bold tracking-tight text-ink">{formatPrice(grandTotal)}</span>
              </div>
              <Link href="/checkout" className="btn-primary w-full btn-lg">Оформить заказ <ArrowRight className="w-5 h-5" /></Link>
            </div>

            <div className="bg-ink text-porcelain/70 rounded-card p-5 text-sm space-y-2.5">
              <div className="text-champagne font-semibold mb-3">Условия доставки</div>
              <div className="flex items-center gap-2.5"><Zap className="w-4 h-4 text-accent-glow" /> Экспресс за 60 минут</div>
              <div className="flex items-center gap-2.5"><Truck className="w-4 h-4 text-accent-glow" /> Доставка {formatPrice(DELIVERY_COST)}</div>
              <div className="flex items-center gap-2.5"><Gift className="w-4 h-4 text-accent-glow" /> Бесплатно от {formatPrice(FREE_DELIVERY_THRESHOLD)}</div>
              <div className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-accent-glow" /> Ежедневно 09:00–00:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
