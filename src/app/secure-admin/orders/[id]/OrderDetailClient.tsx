'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle,
  XCircle,
  Truck,
  MessageCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import {
  formatPrice,
  formatDateTime,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderDetailClientProps {
  order: Order & {
    customer?: { name: string; email: string; phone?: string | null } | null;
    items: Array<Order['items'][0] & {
      product: { images: { url: string }[] };
    }>;
  };
}

const STATUS_TRANSITIONS: Record<string, OrderStatus[]> = {
  created: ['confirmed', 'cancelled'],
  waiting_payment: ['paid', 'cancelled'],
  waiting_verification: ['paid', 'cancelled'],
  paid: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['courier_assigned', 'cancelled'],
  courier_assigned: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? '');

  const updateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Ошибка');
      toast.success(`Статус изменён: ${ORDER_STATUS_LABELS[newStatus]}`);
      router.refresh();
    } catch {
      toast.error('Ошибка обновления статуса');
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePayment = async (approved: boolean) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: approved ? 'paid' : 'failed',
          status: approved ? 'paid' : order.status,
        }),
      });
      if (!res.ok) throw new Error('Ошибка');
      toast.success(approved ? '✅ Оплата подтверждена' : '❌ Оплата отклонена');
      router.refresh();
    } catch {
      toast.error('Ошибка');
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNotes = async () => {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
      toast.success('Заметки сохранены');
    } catch {
      toast.error('Ошибка');
    }
  };

  const transitions = STATUS_TRANSITIONS[order.status] ?? [];
  const statusLabel = ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status;
  const statusColor = ORDER_STATUS_COLORS[order.status as OrderStatus] ?? 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3">
        <span className={`badge ${statusColor} text-sm px-3 py-1.5`}>{statusLabel}</span>

        {/* Status transitions */}
        {transitions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {transitions.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={isUpdating}
                className={`px-4 py-2 text-sm rounded-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                  status === 'cancelled'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-pandora-rose text-white hover:bg-pandora-dark'
                }`}
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {ORDER_STATUS_LABELS[status] ?? status}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order items */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-800">
              Состав заказа ({order.items.length} позиции)
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                  {item.imageUrl && (
                    <div className="w-14 h-16 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-400">× {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-sm text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Товары</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Доставка</span>
                <span>{order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Итого</span>
                <span className="text-pandora-rose">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment verification */}
          {order.paymentStatus === 'waiting_verification' && order.receiptImage && (
            <div className="bg-orange-50 border border-orange-200 rounded-sm p-5">
              <h3 className="font-semibold text-orange-800 mb-3">⏳ Требуется проверка оплаты</h3>
              <div className="mb-4">
                <div className="text-sm text-orange-700 mb-2">Чек от покупателя:</div>
                <img
                  src={order.receiptImage}
                  alt="Receipt"
                  className="max-w-xs rounded-sm border border-orange-200"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updatePayment(true)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Подтвердить оплату
                </button>
                <button
                  onClick={() => updatePayment(false)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Отклонить
                </button>
              </div>
            </div>
          )}

          {/* Admin notes */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Заметки администратора</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pandora-rose resize-none"
              rows={3}
              placeholder="Внутренние заметки..."
            />
            <button
              onClick={saveNotes}
              className="mt-2 px-4 py-2 bg-pandora-rose text-white text-sm rounded-sm hover:bg-pandora-dark transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Покупатель</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 w-20 flex-shrink-0">Имя:</span>
                <span className="font-medium text-gray-800">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <a href={`tel:${order.customerPhone}`} className="text-pandora-rose hover:underline">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 w-4 flex-shrink-0">@</span>
                  <span>{order.customerEmail}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${order.customerPhone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-pandora-rose text-white text-xs rounded-sm hover:bg-pandora-dark transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Позвонить
              </a>
              <a
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 text-white text-xs rounded-sm hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Доставка</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{order.deliveryMethod === 'delivery' ? 'Курьерская доставка' : 'Самовывоз'}</span>
              </div>
              {order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
              {order.deliveryDate && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{order.deliveryDate} {order.deliveryTime && `· ${order.deliveryTime}`}</span>
                </div>
              )}
              {order.recipientName && (
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Получатель: {order.recipientName}
                  {order.recipientPhone && ` · ${order.recipientPhone}`}
                  {order.isAnonymous && ' (анонимно)'}
                </div>
              )}
            </div>
          </div>

          {/* Order meta */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Информация</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Создан:</span>
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Обновлён:</span>
                <span>{formatDateTime(order.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Оплата:</span>
                <span>{order.paymentMethod === 'qr' ? 'QR-оплата' : 'Банковская карта'}</span>
              </div>
            </div>
          </div>

          {/* Greeting */}
          {order.greetingCard && (
            <div className="bg-pandora-blush/20 rounded-sm border border-pandora-blush p-4">
              <div className="text-xs font-medium text-pandora-rose mb-2">Текст открытки:</div>
              <p className="text-sm text-pandora-text italic">&ldquo;{order.greetingCard}&rdquo;</p>
            </div>
          )}

          {order.specialNotes && (
            <div className="bg-yellow-50 rounded-sm border border-yellow-200 p-4">
              <div className="text-xs font-medium text-yellow-800 mb-2">Особые пожелания:</div>
              <p className="text-sm text-yellow-700">{order.specialNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
