import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

const PAGE_SIZE = 20;

async function getOrders(params: { status?: string; search?: string; page?: string }) {
  const page = parseInt(params.page ?? '1');
  const skip = (page - 1) * PAGE_SIZE;
  const where: Record<string, unknown> = {};

  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search } },
      { customerName: { contains: params.search } },
      { customerPhone: { contains: params.search } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, pages: Math.ceil(total / PAGE_SIZE), page };
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'created', label: 'Новые' },
  { value: 'waiting_verification', label: 'Проверка оплаты' },
  { value: 'paid', label: 'Оплачены' },
  { value: 'preparing', label: 'Готовятся' },
  { value: 'out_for_delivery', label: 'Доставляются' },
  { value: 'completed', label: 'Завершены' },
  { value: 'cancelled', label: 'Отменены' },
];

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { orders, total, pages, page } = await getOrders(params);

  return (
    <AdminShell title="Заказы" subtitle={`Всего: ${total}`}>
      {/* Filters */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={`/secure-admin/orders${opt.value ? `?status=${opt.value}` : ''}`}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  params.status === opt.value || (!params.status && opt.value === '')
                    ? 'bg-pandora-rose text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                defaultValue={params.search}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pandora-rose w-48"
                placeholder="Заказ, телефон..."
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-pandora-rose text-white text-sm rounded-sm hover:bg-pandora-dark transition-colors">
              Найти
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">№ Заказа</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Покупатель</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Сумма</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Оплата</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Дата</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Заказов не найдено
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ?? 'bg-gray-100 text-gray-700';
                  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/secure-admin/orders/${order.id}`} className="font-medium text-pandora-rose hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusColor} text-xs`}>{statusLabel}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'text-green-600' :
                          order.paymentStatus === 'waiting_verification' ? 'text-orange-600' :
                          'text-gray-400'
                        }`}>
                          {order.paymentMethod === 'qr' ? 'QR' : 'Карта'}
                          {order.paymentStatus === 'paid' ? ' ✓' :
                           order.paymentStatus === 'waiting_verification' ? ' ⏳' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/secure-admin/orders/${order.id}`}
                          className="text-pandora-rose hover:text-pandora-dark text-xs"
                        >
                          →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Страница {page} из {pages} · {total} заказов
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/secure-admin/orders?${new URLSearchParams({ ...params, page: (page - 1).toString() })}`}
                  className="px-3 py-1 border border-gray-200 rounded-sm text-sm hover:border-pandora-rose transition-colors"
                >
                  ← Назад
                </Link>
              )}
              {page < pages && (
                <Link
                  href={`/secure-admin/orders?${new URLSearchParams({ ...params, page: (page + 1).toString() })}`}
                  className="px-3 py-1 border border-gray-200 rounded-sm text-sm hover:border-pandora-rose transition-colors"
                >
                  Вперёд →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
