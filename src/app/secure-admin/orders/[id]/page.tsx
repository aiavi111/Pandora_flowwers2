import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import OrderDetailClient from './OrderDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } } } },
      customer: true,
    },
  });
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <AdminShell title={`Заказ ${order.orderNumber}`}>
      <OrderDetailClient order={order as Parameters<typeof OrderDetailClient>[0]['order']} />
    </AdminShell>
  );
}
