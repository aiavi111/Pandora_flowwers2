import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest, getCustomerFromRequest } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit), page });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = await getCustomerFromRequest();

    const {
      deliveryMethod, deliveryAddress, deliveryDate, deliveryTime,
      customerName, customerPhone, customerEmail,
      recipientName, recipientPhone,
      greetingCard, isAnonymous, specialNotes,
      paymentMethod, receiptImage,
      items, subtotal, deliveryCost, total,
    } = body;

    if (!customerName || !customerPhone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer?.id ?? null,
        customerName,
        customerPhone,
        customerEmail,
        deliveryMethod,
        deliveryAddress,
        deliveryDate,
        deliveryTime,
        recipientName,
        recipientPhone,
        greetingCard,
        isAnonymous: isAnonymous ?? false,
        specialNotes,
        paymentMethod,
        paymentStatus: paymentMethod === 'qr' ? 'pending' : 'pending',
        receiptImage,
        status: 'created',
        subtotal: parseInt(subtotal),
        deliveryCost: parseInt(deliveryCost ?? 0),
        total: parseInt(total),
        items: {
          create: items.map((item: {
            productId: string;
            name: string;
            price: number;
            quantity: number;
            imageUrl?: string;
          }) => ({
            productId: item.productId,
            name: item.name,
            price: parseInt(String(item.price)),
            quantity: parseInt(String(item.quantity)),
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
