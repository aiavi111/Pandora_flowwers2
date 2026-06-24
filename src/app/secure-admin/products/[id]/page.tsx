import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import ProductFormClient from '../ProductFormClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) notFound();

  return (
    <AdminShell title="Редактировать товар" subtitle={product.name}>
      <ProductFormClient
        categories={categories}
        product={{
          ...product,
          oldPrice: product.oldPrice ?? undefined,
          composition: product.composition ?? undefined,
          size: product.size ?? undefined,
          colors: product.colors ?? undefined,
          flowers: product.flowers ?? undefined,
          occasion: product.occasion ?? undefined,
        }}
      />
    </AdminShell>
  );
}
