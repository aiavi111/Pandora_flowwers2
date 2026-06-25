import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [newOrders, pendingPayments, newRequests] = await Promise.all([
    prisma.order.count({ where: { status: { in: ['created', 'waiting_payment', 'waiting_verification'] } } }),
    prisma.order.count({ where: { paymentStatus: 'waiting_verification' } }),
    prisma.customRequest.count({ where: { status: 'pending' } }),
  ]);

  return NextResponse.json({ admin, counts: { newOrders, pendingPayments, newRequests } });
}
