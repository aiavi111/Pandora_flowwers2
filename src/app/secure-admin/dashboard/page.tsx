import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Clock, Users, Package, Star } from 'lucide-react';
import Link from 'next/link';

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [
    revenueToday,
    revenueMonth,
    revenueYear,
    ordersToday,
    pendingOrders,
    pendingPayments,
    totalCustomers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: todayStart }, status: { not: 'cancelled' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart }, status: { not: 'cancelled' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: yearStart }, status: { not: 'cancelled' } },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.order.count({
      where: { status: { in: ['created', 'confirmed', 'preparing'] } },
    }),
    prisma.order.count({
      where: { paymentStatus: 'waiting_verification' },
    }),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { take: 1 } },
    }),
    prisma.orderItem.groupBy({
      by: ['name'],
      _count: { name: true },
      _sum: { price: true },
      orderBy: { _count: { name: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    revenueToday: revenueToday._sum.total ?? 0,
    revenueMonth: revenueMonth._sum.total ?? 0,
    revenueYear: revenueYear._sum.total ?? 0,
    ordersToday,
    pendingOrders,
    pendingPayments,
    totalCustomers,
    recentOrders,
    topProducts,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      label: 'Выручка сегодня',
      value: formatPrice(data.revenueToday),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-pandora-rose',
      bg: 'bg-pandora-blush/30',
    },
    {
      label: 'Выручка за месяц',
      value: formatPrice(data.revenueMonth),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-pandora-gold',
      bg: 'bg-pandora-gold/10',
    },
    {
      label: 'Заказы сегодня',
      value: data.ordersToday.toString(),
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Ожидают обработки',
      value: data.pendingOrders.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      highlight: data.pendingOrders > 0,
    },
    {
      label: 'Проверка оплаты',
      value: data.pendingPayments.toString(),
      icon: <Package className="w-5 h-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      highlight: data.pendingPayments > 0,
    },
    {
      label: 'Покупателей',
      value: data.totalCustomers.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <AdminShell title="Дашборд" subtitle={`Сегодня: ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}`}>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white rounded-sm p-5 shadow-sm border ${
              stat.highlight ? 'border-orange-200 ring-1 ring-orange-200' : 'border-gray-100'
            }`}
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-sm flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-semibold ${stat.highlight ? 'text-orange-600' : 'text-gray-800'}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Последние заказы</h2>
            <Link href="/secure-admin/orders" className="text-xs text-pandora-rose hover:underline">
              Все заказы →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Заказов пока нет</div>
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/secure-admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-800">{order.orderNumber}</div>
                    <div className="text-xs text-gray-400">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-pandora-rose text-sm">
                      {formatPrice(order.total)}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Популярные товары</h2>
            <Link href="/secure-admin/products" className="text-xs text-pandora-rose hover:underline">
              Все товары →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Нет данных</div>
            ) : (
              data.topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3 p-4">
                  <div className="w-8 h-8 bg-pandora-blush/30 rounded-full flex items-center justify-center text-pandora-rose font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{product.name}</div>
                    <div className="text-xs text-gray-400">{product._count.name} заказов</div>
                  </div>
                  <div className="text-sm font-semibold text-pandora-rose">
                    {formatPrice((product._sum.price ?? 0) * product._count.name)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { href: '/secure-admin/orders?status=waiting_verification', label: 'Проверить оплату', desc: `${data.pendingPayments} ожидают`, color: 'border-purple-200 bg-purple-50' },
          { href: '/secure-admin/orders?status=created', label: 'Новые заказы', desc: `${data.pendingOrders} активных`, color: 'border-blue-200 bg-blue-50' },
          { href: '/secure-admin/products/new', label: 'Добавить товар', desc: 'Новый букет', color: 'border-green-200 bg-green-50' },
          { href: '/secure-admin/custom-requests', label: 'Заявки на заказ', desc: 'Букеты на заказ', color: 'border-orange-200 bg-orange-50' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-sm border p-4 ${item.color} hover:shadow-sm transition-shadow`}
          >
            <div className="font-medium text-gray-800 text-sm">{item.label}</div>
            <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
