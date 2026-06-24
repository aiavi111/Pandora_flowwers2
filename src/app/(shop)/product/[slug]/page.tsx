import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductPageClient from './ProductPageClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, inStock: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <ProductPageClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product={product as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relatedProducts={relatedProducts as any}
    />
  );
}
