import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react';

async function getAnalyticsData() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' }),
    };
  }).reverse();

  const [totalRevenue, totalOrders, totalCustomers, topProducts, categoryStats] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: 'cancelled' } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: { not: 'cancelled' } } }),
    prisma.customer.count(),
    prisma.orderItem.groupBy({
      by: ['name'],
      _count: { name: true },
      _sum: { price: true },
      orderBy: { _count: { name: 'desc' } },
      take: 10,
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalCustomers,
    topProducts,
    categoryStats,
    avgOrderValue: totalOrders > 0 ? Math.round((totalRevenue._sum.total ?? 0) / totalOrders) : 0,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <AdminShell title="Аналитика">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Общая выручка', value: formatPrice(data.totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-pandora-rose bg-pandora-blush/30' },
          { label: 'Всего заказов', value: data.totalOrders.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Покупателей', value: data.totalCustomers.toString(), icon: <Users className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
          { label: 'Средний чек', value: formatPrice(data.avgOrderValue), icon: <Star className="w-5 h-5" />, color: 'text-pandora-gold bg-pandora-gold/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 ${stat.color} rounded-sm flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-semibold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Топ-10 товаров по продажам</h2>
          </div>
          <div className="p-5 space-y-3">
            {data.topProducts.map((product, i) => {
              const maxCount = data.topProducts[0]?._count.name ?? 1;
              const pct = (product._count.name / maxCount) * 100;
              return (
                <div key={product.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-5 text-gray-400 font-mono text-xs">{i + 1}.</span>
                      <span className="line-clamp-1">{product.name}</span>
                    </span>
                    <span className="text-gray-500 ml-2 flex-shrink-0">{product._count.name} шт</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pandora-rose rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category stats */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Товаров по категориям</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {data.categoryStats.map((cat) => {
                const maxCount = Math.max(...data.categoryStats.map((c) => c._count.products));
                const pct = maxCount > 0 ? (cat._count.products / maxCount) * 100 : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-400">{cat._count.products} товаров</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pandora-gold rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
