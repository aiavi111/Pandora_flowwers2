import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminFromRequest();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
      averageOrderValue,
      totalCustomers,
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
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: { in: ['created', 'confirmed', 'preparing'] } } }),
      prisma.order.count({ where: { paymentStatus: 'waiting_verification' } }),
      prisma.order.aggregate({ where: { status: { not: 'cancelled' } }, _avg: { total: true } }),
      prisma.customer.count(),
    ]);

    return NextResponse.json({
      revenueToday: revenueToday._sum.total ?? 0,
      revenueMonth: revenueMonth._sum.total ?? 0,
      revenueYear: revenueYear._sum.total ?? 0,
      ordersToday,
      pendingOrders,
      pendingPayments,
      averageOrderValue: Math.round(averageOrderValue._avg.total ?? 0),
      totalCustomers,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
