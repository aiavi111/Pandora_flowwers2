import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import CustomRequestsClient from './CustomRequestsClient';

async function getRequests() {
  return prisma.customRequest.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminCustomRequestsPage() {
  const requests = await getRequests();

  return (
    <AdminShell title="Букеты на заказ" subtitle={`${requests.length} заявок`}>
      <CustomRequestsClient requests={requests as Parameters<typeof CustomRequestsClient>[0]['requests']} />
    </AdminShell>
  );
}
