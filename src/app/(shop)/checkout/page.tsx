'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandImage } from '@/components/ui/BrandImage';
import { useForm } from 'react-hook-form';
import {
  Truck,
  Store,
  CreditCard,
  QrCode,
  CheckCircle,
  ChevronDown,
  Loader2,
  Upload,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CheckoutForm {
  // Delivery
  deliveryMethod: 'pickup' | 'delivery';
  // Recipient
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  // Options
  greetingCard: string;
  isAnonymous: boolean;
  specialNotes: string;
  // Payment
  paymentMethod: 'card' | 'qr';
  // Contact
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

const TIME_SLOTS = [
  '09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00',
  '17:00–19:00', '19:00–21:00', '21:00–23:00',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<'delivery' | 'recipient' | 'options' | 'payment' | 'qr'>('delivery');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = totalPrice();
  const { register, watch, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutForm>({
    defaultValues: {
      deliveryMethod: 'delivery',
      paymentMethod: 'qr',
      isAnonymous: false,
    },
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const deliveryCost = deliveryMethod === 'pickup' ? 0 : (total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST);
  const grandTotal = total + deliveryCost;

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-pandora-dark mb-4">Корзина пуста</h2>
          <button onClick={() => router.push('/catalog')} className="btn-primary">
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReceiptImage(url);
      toast.success('Чек загружен');
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.images?.[0]?.url,
        })),
        subtotal: total,
        deliveryCost,
        total: grandTotal,
        receiptImage,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error('Ошибка создания заказа');

      const order = await res.json();
      setOrderId(order.id);
      setOrderNumber(order.orderNumber);

      if (data.paymentMethod === 'qr') {
        setStep('qr');
      } else {
        clearCart();
        router.push(`/order/${order.id}?success=1`);
      }
    } catch {
      toast.error('Ошибка при оформлении заказа. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptSubmit = async () => {
    if (!receiptImage || !orderId) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptImage,
          status: 'waiting_verification',
          paymentStatus: 'waiting_verification',
        }),
      });
      clearCart();
      router.push(`/order/${orderId}?success=1`);
    } catch {
      toast.error('Ошибка загрузки чека');
    } finally {
      setIsSubmitting(false);
    }
  };

  // QR Payment screen
  if (step === 'qr' && orderNumber) {
    return (
      <div className="min-h-screen bg-porcelain py-12">
        <div className="container-site max-w-md text-center">
          <div className="bg-white rounded-card border border-line shadow-card p-8">
            <QrCode className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-pandora-dark mb-2">Оплата через QR</h2>
            <p className="text-pandora-muted text-sm mb-6">Заказ № {orderNumber}</p>

            {/* Mock QR */}
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-sm mb-4 flex items-center justify-center border-2 border-pandora-border">
              <div className="text-center text-pandora-muted text-xs p-4">
                <QrCode className="w-20 h-20 mx-auto mb-2 text-pandora-dark" />
                QR код для оплаты
              </div>
            </div>

            <div className="text-2xl font-semibold text-pandora-rose mb-6">
              {formatPrice(grandTotal)}
            </div>

            <div className="bg-pandora-blush/20 rounded-sm p-4 text-sm text-pandora-text mb-6 text-left space-y-2">
              <div className="font-medium text-pandora-dark">Инструкция:</div>
              <div>1. Отсканируйте QR-код</div>
              <div>2. Укажите сумму: {formatPrice(grandTotal)}</div>
              <div>3. Завершите оплату</div>
              <div>4. Загрузите скриншот чека ниже</div>
            </div>

            <label className="block cursor-pointer mb-4">
              <div className="border-2 border-dashed border-pandora-border rounded-sm p-6 text-center hover:border-pandora-rose transition-colors">
                {receiptImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Чек загружен</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-pandora-muted mx-auto mb-2" />
                    <span className="text-sm text-pandora-muted">Загрузить скриншот чека</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReceiptUpload}
              />
            </label>

            <button
              onClick={handleReceiptSubmit}
              disabled={!receiptImage || isSubmitting}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Подтвердить оплату'
              )}
            </button>

            <p className="text-xs text-pandora-muted mt-3">
              После проверки чека мы подтвердим ваш заказ и начнём работу
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-porcelain min-h-screen">
      <div className="bg-porcelain-fade border-b border-line">
        <div className="container-site py-10">
          <div className="section-subtitle mb-3">Pandora Flowers</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">Оформление заказа</h1>
        </div>
      </div>

      <div className="container-site py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              {/* ── STEP 1: Delivery method ── */}
              <FormCard number={1} title="Способ получения">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      value: 'delivery',
                      icon: <Truck className="w-6 h-6" />,
                      title: 'Доставка курьером',
                      desc: `${formatPrice(DELIVERY_COST)} · Бесплатно от ${formatPrice(FREE_DELIVERY_THRESHOLD)}`,
                    },
                    {
                      value: 'pickup',
                      icon: <Store className="w-6 h-6" />,
                      title: 'Самовывоз',
                      desc: 'ул. Токтогула 112/1, БЦ Сфера',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-4 p-4 rounded-input border-2 cursor-pointer transition-all duration-200 ${
                        deliveryMethod === opt.value
                          ? 'border-ink bg-accent-soft/40'
                          : 'border-line hover:border-ink/40'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('deliveryMethod')}
                        value={opt.value}
                        className="hidden"
                      />
                      <div className={deliveryMethod === opt.value ? 'text-pandora-rose' : 'text-pandora-muted'}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-medium text-pandora-dark">{opt.title}</div>
                        <div className="text-sm text-pandora-muted mt-0.5">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </FormCard>

              {/* ── STEP 2: Recipient & address ── */}
              <FormCard number={2} title="Получатель и адрес">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pandora-text mb-2">
                      Ваше имя *
                    </label>
                    <input
                      {...register('customerName', { required: 'Введите имя' })}
                      className="input-field"
                      placeholder="Айгерим"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pandora-text mb-2">
                      Ваш телефон *
                    </label>
                    <input
                      {...register('customerPhone', { required: 'Введите номер' })}
                      className="input-field"
                      placeholder="+996 700 000 000"
                      type="tel"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-pandora-text mb-2">Email</label>
                    <input
                      {...register('customerEmail')}
                      className="input-field"
                      placeholder="email@example.com"
                      type="email"
                    />
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <>
                      <div className="md:col-span-2 pt-2 border-t border-pandora-border">
                        <div className="text-sm font-semibold text-pandora-dark mb-4">
                          Данные получателя (если не вы)
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-pandora-text mb-2">
                          Имя получателя
                        </label>
                        <input
                          {...register('recipientName')}
                          className="input-field"
                          placeholder="Если отличается от вашего"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-pandora-text mb-2">
                          Телефон получателя
                        </label>
                        <input
                          {...register('recipientPhone')}
                          className="input-field"
                          placeholder="+996 700 000 000"
                          type="tel"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-pandora-text mb-2">
                          Адрес доставки *
                        </label>
                        <input
                          {...register('deliveryAddress', {
                            required: deliveryMethod === 'delivery' ? 'Введите адрес' : false,
                          })}
                          className="input-field"
                          placeholder="Улица, дом, квартира, район"
                        />
                        {errors.deliveryAddress && (
                          <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-pandora-text mb-2">
                          Дата доставки *
                        </label>
                        <input
                          {...register('deliveryDate', { required: 'Выберите дату' })}
                          type="date"
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.deliveryDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.deliveryDate.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-pandora-text mb-2">
                          Время доставки
                        </label>
                        <div className="relative">
                          <select {...register('deliveryTime')} className="input-field appearance-none pr-8">
                            <option value="">Как можно скорее</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-pandora-muted pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </FormCard>

              {/* ── STEP 3: Options ── */}
              <FormCard number={3} title="Дополнительные опции">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-pandora-text mb-2">
                      Текст открытки
                    </label>
                    <textarea
                      {...register('greetingCard')}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Текст для открытки (необязательно)..."
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isAnonymous')}
                      className="mt-0.5 w-4 h-4 accent-pandora-rose rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-pandora-text">Анонимная доставка</div>
                      <div className="text-xs text-pandora-muted">Имя отправителя не будет указано</div>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-pandora-text mb-2">
                      Особые пожелания
                    </label>
                    <textarea
                      {...register('specialNotes')}
                      className="input-field resize-none"
                      rows={2}
                      placeholder="Оставить у двери, позвонить за 30 минут, код домофона..."
                    />
                  </div>
                </div>
              </FormCard>

              {/* ── STEP 4: Payment ── */}
              <FormCard number={4} title="Способ оплаты">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      value: 'qr',
                      icon: <QrCode className="w-6 h-6" />,
                      title: 'QR-оплата',
                      desc: 'Через любой банк (Элкарт, Mbank, Odengi...)',
                    },
                    {
                      value: 'card',
                      icon: <CreditCard className="w-6 h-6" />,
                      title: 'Банковская карта',
                      desc: 'При получении или онлайн',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-4 p-4 rounded-input border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === opt.value
                          ? 'border-ink bg-accent-soft/40'
                          : 'border-line hover:border-ink/40'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value={opt.value}
                        className="hidden"
                      />
                      <div className={paymentMethod === opt.value ? 'text-pandora-rose' : 'text-pandora-muted'}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-medium text-pandora-dark">{opt.title}</div>
                        <div className="text-sm text-pandora-muted mt-0.5">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </FormCard>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Оформить заказ на ${formatPrice(grandTotal)}`
                )}
              </button>
            </div>

            {/* Order summary sidebar */}
            <div>
              <div className="bg-white rounded-card border border-line shadow-card p-6 sticky top-28">
                <h2 className="text-lg font-bold text-ink mb-5">Ваш заказ</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => {
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="media w-14 h-[72px] flex-shrink-0">
                          <BrandImage src={item.product.images?.[0]?.url} alt={item.product.name} tone={(item.product.colors?.split(',')[0] || 'mixed') as never} sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-ink line-clamp-2">{item.product.name}</div>
                          <div className="text-xs text-ink-muted mt-0.5">× {item.quantity}</div>
                          <div className="text-sm font-semibold text-ink">{formatPrice(item.product.price * item.quantity)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-pandora-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-pandora-muted">
                    <span>Товары</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-pandora-muted">
                    <span>Доставка</span>
                    <span>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-pandora-dark text-base pt-2 border-t border-pandora-border">
                    <span>Итого</span>
                    <span className="text-pandora-rose">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-card border border-line shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center text-porcelain text-sm font-bold flex-shrink-0">
          {number}
        </div>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}
