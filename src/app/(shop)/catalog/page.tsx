import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import CatalogClient from './CatalogClient';

export const metadata = {
  title: 'Каталог букетов',
  description: 'Авторские букеты премиум-класса в Бишкеке. Розы, пионы, тюльпаны, авторские композиции. Доставка за 60 минут.',
};

async function getData(params: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  colors?: string;
  occasion?: string;
}) {
  const where: Record<string, unknown> = { inStock: true };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
      { composition: { contains: params.search } },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Record<string, number>).gte = parseInt(params.minPrice);
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseInt(params.maxPrice);
  }

  if (params.colors) {
    const colorList = params.colors.split(',');
    where.OR = [
      ...(Array.isArray(where.OR) ? where.OR : []),
      ...colorList.map((c) => ({ colors: { contains: c } })),
    ];
  }

  if (params.occasion) {
    where.occasion = { contains: params.occasion };
  }

  const orderBy: Record<string, string> = {};
  switch (params.sort) {
    case 'price_asc': orderBy.price = 'asc'; break;
    case 'price_desc': orderBy.price = 'desc'; break;
    case 'newest': orderBy.createdAt = 'desc'; break;
    case 'popular': orderBy.sortOrder = 'asc'; break;
    default: orderBy.sortOrder = 'asc';
  }

  const [products, categories, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
      orderBy,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { inStock: true } } } } },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, categories, totalCount };
}

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    occasion?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { products, categories, totalCount } = await getData(params);

  return (
    <Suspense>
      <CatalogClient
        initialProducts={products as Parameters<typeof CatalogClient>[0]['initialProducts']}
        categories={categories}
        totalCount={totalCount}
        params={params}
      />
    </Suspense>
  );
}
