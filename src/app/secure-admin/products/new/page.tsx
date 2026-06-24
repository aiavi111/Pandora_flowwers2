import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import ProductFormClient from '../ProductFormClient';

async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminShell title="Добавить товар">
      <ProductFormClient categories={categories} />
    </AdminShell>
  );
}
