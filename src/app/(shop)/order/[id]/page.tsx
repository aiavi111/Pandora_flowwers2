import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CheckCircle, Package, Truck, Clock, Phone, ArrowRight } from 'lucide-react';
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
    },
  });
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  created: <Clock className="w-5 h-5" />,
  waiting_payment: <Clock className="w-5 h-5" />,
  waiting_verification: <Package className="w-5 h-5" />,
  paid: <CheckCircle className="w-5 h-5" />,
  confirmed: <CheckCircle className="w-5 h-5" />,
  preparing: <Package className="w-5 h-5" />,
  ready: <Package className="w-5 h-5" />,
  out_for_delivery: <Truck className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
  completed: <CheckCircle className="w-5 h-5" />,
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { success } = await searchParams;
  const order = await getOrder(id);

  if (!order) notFound();

  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status;
  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ?? 'bg-gray-100 text-gray-700';

  const PROGRESS_STEPS = [
    { key: 'created', label: 'Создан' },
    { key: 'paid', label: 'Оплачен' },
    { key: 'preparing', label: 'Готовится' },
    { key: 'out_for_delivery', label: 'Доставляется' },
    { key: 'delivered', label: 'Доставлен' },
  ];

  const ORDER_STATUS_INDEX: Record<string, number> = {
    created: 0, waiting_payment: 0, waiting_verification: 0,
    paid: 1, confirmed: 1,
    preparing: 2, ready: 2, courier_assigned: 2,
    out_for_delivery: 3,
    delivered: 4, completed: 4,
  };

  const currentStep = ORDER_STATUS_INDEX[order.status] ?? 0;

  return (
    <div className="bg-porcelain min-h-screen py-12">
      <div className="container-site max-w-3xl">
        {/* Success banner */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-card p-6 mb-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold tracking-tight text-green-800 mb-1">
              Заказ оформлен!
            </h2>
            <p className="text-green-700 text-sm">
              Мы свяжемся с вами в ближайшее время для подтверждения
            </p>
          </div>
        )}

        {/* Order header */}
        <div className="bg-white rounded-card border border-line shadow-card p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-pandora-muted text-xs uppercase tracking-wider mb-1">
                Заказ
              </div>
              <h1 className="font-serif text-2xl text-pandora-dark">
                № {order.orderNumber}
              </h1>
              <div className="text-pandora-muted text-sm mt-1">
                {formatDateTime(order.createdAt)}
              </div>
            </div>
            <span className={`badge ${statusColor} text-sm px-3 py-1.5`}>
              {STATUS_ICONS[order.status] || <Clock className="w-4 h-4" />}
              <span className="ml-1.5">{statusLabel}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {!['cancelled'].includes(order.status) && (
          <div className="bg-white rounded-card border border-line shadow-card p-6 mb-6">
            <div className="relative">
              {/* Line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-pandora-border" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-pandora-rose transition-all duration-500"
                style={{ width: `${(currentStep / (PROGRESS_STEPS.length - 1)) * (100 - 10 / PROGRESS_STEPS.length)}%` }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {PROGRESS_STEPS.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 ${
                        i <= currentStep
                          ? 'bg-pandora-rose border-pandora-rose text-white'
                          : 'bg-white border-pandora-border text-pandora-muted'
                      }`}
                    >
                      {i < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <div className={`text-xs mt-2 text-center max-w-[60px] leading-tight ${
                      i <= currentStep ? 'text-pandora-rose font-medium' : 'text-pandora-muted'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="bg-white rounded-card border border-line shadow-card p-6">
            <h2 className="font-serif text-xl text-pandora-dark mb-4">Состав заказа</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-pandora-border last:border-0">
                  {item.imageUrl && (
                    <div className="w-12 h-14 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-pandora-text line-clamp-1">{item.name}</div>
                    <div className="text-xs text-pandora-muted">× {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-pandora-dark flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-pandora-border space-y-2">
              <div className="flex justify-between text-sm text-pandora-muted">
                <span>Товары</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-pandora-muted">
                <span>Доставка</span>
                <span>{order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-pandora-dark pt-2 border-t border-pandora-border">
                <span>Итого</span>
                <span className="text-pandora-rose">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="space-y-4">
            <div className="bg-white rounded-card border border-line shadow-card p-6">
              <h2 className="font-serif text-xl text-pandora-dark mb-4">Детали заказа</h2>
              <div className="space-y-3 text-sm">
                <InfoRow label="Покупатель" value={order.customerName} />
                <InfoRow label="Телефон" value={order.customerPhone} />
                {order.deliveryMethod === 'delivery' ? (
                  <>
                    <InfoRow label="Доставка" value="Курьерская доставка" />
                    {order.deliveryAddress && (
                      <InfoRow label="Адрес" value={order.deliveryAddress} />
                    )}
                    {order.deliveryDate && (
                      <InfoRow label="Дата" value={order.deliveryDate} />
                    )}
                    {order.deliveryTime && (
                      <InfoRow label="Время" value={order.deliveryTime} />
                    )}
                  </>
                ) : (
                  <InfoRow label="Получение" value="Самовывоз • ул. Токтогула 112/1" />
                )}
                <InfoRow label="Оплата" value={order.paymentMethod === 'qr' ? 'QR-оплата' : 'Банковская карта'} />
                {order.greetingCard && (
                  <InfoRow label="Открытка" value={order.greetingCard} />
                )}
                {order.isAnonymous && (
                  <InfoRow label="Анонимно" value="Да" />
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-ink rounded-card p-5 text-porcelain">
              <div className="font-semibold mb-3">Нужна помощь?</div>
              <div className="text-porcelain/60 text-sm mb-4">
                Наши менеджеры готовы помочь с любым вопросом по заказу.
              </div>
              <a
                href="tel:+996772070067"
                className="flex items-center gap-2 text-champagne hover:text-porcelain transition-colors"
              >
                <Phone className="w-4 h-4" />
                +996 772 07 00 67
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Link href="/catalog" className="btn-secondary">
            Продолжить покупки
          </Link>
          <Link href="/account/orders" className="btn-ghost">
            Все мои заказы
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-pandora-muted w-24 flex-shrink-0">{label}:</span>
      <span className="text-pandora-text">{value}</span>
    </div>
  );
}
