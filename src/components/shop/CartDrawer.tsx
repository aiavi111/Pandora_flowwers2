'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { BrandImage } from '@/components/ui/BrandImage';
import { formatPrice, cn, DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const grandTotal = total + deliveryCost;
  const remaining = FREE_DELIVERY_THRESHOLD - total;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div className={cn('fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={closeCart} />

      <div className={cn('fixed top-0 right-0 h-full z-[60] w-full max-w-md bg-porcelain shadow-lift flex flex-col transition-transform duration-400 ease-out-expo',
        isOpen ? 'translate-x-0' : 'translate-x-full')}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-line bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-ink">Корзина</h2>
            {count > 0 && <span className="w-6 h-6 grid place-items-center bg-ink text-porcelain text-xs font-bold rounded-full">{count}</span>}
          </div>
          <button onClick={closeCart} className="p-2 text-ink-muted hover:text-ink transition-colors" aria-label="Закрыть"><X className="w-5 h-5" /></button>
        </div>

        {/* Free delivery progress */}
        {total > 0 && total < FREE_DELIVERY_THRESHOLD && (
          <div className="px-6 py-3 bg-accent-soft/50 border-b border-line">
            <div className="flex justify-between text-xs text-ink-soft mb-2">
              <span>До бесплатной доставки</span>
              <span className="text-accent-deep font-semibold">{formatPrice(remaining)}</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }} />
            </div>
          </div>
        )}
        {total >= FREE_DELIVERY_THRESHOLD && (
          <div className="px-6 py-3 bg-accent-soft border-b border-line text-xs text-accent-deep text-center font-semibold flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Бесплатная доставка
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-accent-soft rounded-full grid place-items-center mb-4"><ShoppingBag className="w-8 h-8 text-accent-deep" strokeWidth={1.4} /></div>
              <h3 className="text-xl font-bold text-ink mb-2">Корзина пуста</h3>
              <p className="text-ink-soft text-sm mb-6">Добавьте букеты, чтобы начать заказ.</p>
              <Link href="/catalog" onClick={closeCart} className="btn-primary">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-line last:border-0">
                  <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="media w-20 h-24 flex-shrink-0">
                    <BrandImage src={item.product.images?.[0]?.url} alt={item.product.name} tone={(item.product.colors?.split(',')[0] || 'mixed') as never} sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="text-sm font-semibold text-ink hover:text-accent transition-colors line-clamp-2 leading-snug">{item.product.name}</Link>
                    <div className="text-ink font-semibold mt-1">{formatPrice(item.product.price)}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-line rounded-pill overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 grid place-items-center text-ink-soft hover:bg-porcelain-deep transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 grid place-items-center text-ink-soft hover:bg-porcelain-deep transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-ink-muted hover:text-red-500 transition-colors" aria-label="Удалить"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5 bg-white">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-ink-soft"><span>Товары ({count} шт.)</span><span className="text-ink font-medium">{formatPrice(total)}</span></div>
              <div className="flex justify-between text-ink-soft"><span>Доставка</span><span className={deliveryCost === 0 ? 'text-green-600 font-semibold' : 'text-ink font-medium'}>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span></div>
              <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-line"><span>Итого</span><span>{formatPrice(grandTotal)}</span></div>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">Оформить заказ <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/cart" onClick={closeCart} className="block text-center text-sm text-ink-muted hover:text-accent mt-3 transition-colors">Перейти в корзину</Link>
          </div>
        )}
      </div>
    </>
  );
}
