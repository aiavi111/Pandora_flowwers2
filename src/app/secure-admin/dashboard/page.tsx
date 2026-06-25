import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Clock, ArrowUpRight, Plus, CreditCard, Flower2 } from 'lucide-react';
import Link from 'next/link';
import ResetDataButton from './ResetDataButton';

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [revenueToday, revenueMonth, revenueYear, ordersToday, pendingOrders, pendingPayments, totalCustomers, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({ where: { createdAt: { gte: todayStart }, status: { not: 'cancelled' } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: monthStart }, status: { not: 'cancelled' } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: yearStart }, status: { not: 'cancelled' } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { status: { in: ['created', 'confirmed', 'preparing'] } } }),
    prisma.order.count({ where: { paymentStatus: 'waiting_verification' } }),
    prisma.customer.count(),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: 'desc' }, include: { items: { take: 1 } } }),
    prisma.orderItem.groupBy({ by: ['name'], _count: { name: true }, _sum: { price: true }, orderBy: { _count: { name: 'desc' } }, take: 5 }),
  ]);

  return {
    revenueToday: revenueToday._sum.total ?? 0, revenueMonth: revenueMonth._sum.total ?? 0, revenueYear: revenueYear._sum.total ?? 0,
    ordersToday, pendingOrders, pendingPayments, totalCustomers, recentOrders, topProducts,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: 'Выручка сегодня', value: formatPrice(data.revenueToday), icon: TrendingUp, tile: 'bg-accent-soft text-accent-deep' },
    { label: 'Выручка за месяц', value: formatPrice(data.revenueMonth), icon: TrendingUp, tile: 'bg-champagne-soft text-[#8a6d2f]' },
    { label: 'Выручка за год', value: formatPrice(data.revenueYear), icon: TrendingUp, tile: 'bg-porcelain-deep text-ink' },
    { label: 'Заказы сегодня', value: String(data.ordersToday), icon: ShoppingBag, tile: 'bg-blue-50 text-blue-600' },
    { label: 'Ожидают обработки', value: String(data.pendingOrders), icon: Clock, tile: 'bg-orange-50 text-orange-600', highlight: data.pendingOrders > 0 },
    { label: 'Проверка оплаты', value: String(data.pendingPayments), icon: CreditCard, tile: 'bg-purple-50 text-purple-600', highlight: data.pendingPayments > 0 },
  ];

  return (
    <AdminShell title="Дашборд" subtitle={new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-card p-5 border ${s.highlight ? 'border-orange-200 ring-1 ring-orange-100' : 'border-line'}`}>
            <div className={`w-10 h-10 ${s.tile} rounded-xl grid place-items-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className={`text-2xl font-bold tracking-tight ${s.highlight ? 'text-orange-600' : 'text-ink'}`}>{s.value}</div>
            <div className="text-xs text-ink-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-card border border-line overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-line">
            <h2 className="font-bold text-ink">Последние заказы</h2>
            <Link href="/secure-admin/orders" className="text-xs font-medium text-accent hover:text-accent-deep">Все заказы →</Link>
          </div>
          <div className="divide-y divide-line">
            {data.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-sm">Заказов пока нет</div>
            ) : data.recentOrders.map((o) => (
              <Link key={o.id} href={`/secure-admin/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-porcelain-deep transition-colors">
                <div>
                  <div className="font-semibold text-sm text-ink">{o.orderNumber}</div>
                  <div className="text-xs text-ink-muted">{o.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ink text-sm">{formatPrice(o.total)}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{new Date(o.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-card border border-line overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-line">
            <h2 className="font-bold text-ink">Популярные товары</h2>
            <Link href="/secure-admin/products" className="text-xs font-medium text-accent hover:text-accent-deep">Все товары →</Link>
          </div>
          <div className="divide-y divide-line">
            {data.topProducts.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-sm">Нет данных</div>
            ) : data.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 bg-accent-soft rounded-full grid place-items-center text-accent-deep font-bold text-sm flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p._count.name} заказов</div>
                </div>
                <div className="text-sm font-bold text-ink">{formatPrice((p._sum.price ?? 0) * p._count.name)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { href: '/secure-admin/orders?status=waiting_verification', label: 'Проверить оплату', desc: `${data.pendingPayments} ожидают`, icon: CreditCard },
          { href: '/secure-admin/orders?status=created', label: 'Новые заказы', desc: `${data.pendingOrders} активных`, icon: ShoppingBag },
          { href: '/secure-admin/products/new', label: 'Добавить товар', desc: 'Новый букет', icon: Plus },
          { href: '/secure-admin/custom-requests', label: 'Заявки на заказ', desc: 'Букеты на заказ', icon: Flower2 },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="group rounded-card border border-line bg-white p-5 hover:border-ink hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-porcelain-deep grid place-items-center text-ink-soft group-hover:bg-ink group-hover:text-porcelain transition-colors"><item.icon className="w-4 h-4" /></div>
              <ArrowUpRight className="w-4 h-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-ink text-sm">{item.label}</div>
            <div className="text-xs text-ink-muted mt-0.5">{item.desc}</div>
          </Link>
        ))}
      </div>

      <ResetDataButton />
    </AdminShell>
  );
}
