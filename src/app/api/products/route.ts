import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',').filter(Boolean);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isPopular = searchParams.get('popular');
    const isFeatured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') ?? '100');

    const where: Record<string, unknown> = { inStock: true };

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (isPopular === 'true') where.isPopular = true;
    if (isFeatured === 'true') where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name, slug, description, composition, price, oldPrice,
      categoryId, size, colors, flowers, occasion,
      inStock, isPopular, isFeatured, isNew, images,
    } = body;

    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        composition,
        price: parseInt(price),
        oldPrice: oldPrice ? parseInt(oldPrice) : null,
        categoryId,
        size,
        colors,
        flowers,
        occasion,
        inStock: inStock ?? true,
        isPopular: isPopular ?? false,
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? false,
        images: images?.length ? {
          create: images.map((url: string, i: number) => ({
            url,
            sortOrder: i,
          })),
        } : undefined,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Slug уже используется' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
