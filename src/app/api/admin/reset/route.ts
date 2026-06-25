import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

/**
 * Danger zone — clears all transactional/test data so the dashboard resets to
 * zero. Keeps products, categories and admin accounts. Admin-only; triggered
 * manually from the admin panel with confirmation.
 */
export async function POST() {
  const admin = await getAdminFromRequest();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'owner' && admin.role !== 'manager') {
    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
  }

  try {
    const [orders, requests, customers] = await Promise.all([
      prisma.order.count(),
      prisma.customRequest.count(),
      prisma.customer.count(),
    ]);

    // FK-safe order: dependents first, then parents.
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.address.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customRequestImage.deleteMany();
    await prisma.customRequest.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.customer.deleteMany();

    return NextResponse.json({ success: true, cleared: { orders, requests, customers } });
  } catch {
    return NextResponse.json({ error: 'Не удалось очистить данные' }, { status: 500 });
  }
}
