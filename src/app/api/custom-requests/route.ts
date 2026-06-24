import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest, getCustomerFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminFromRequest();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requests = await prisma.customRequest.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const customer = await getCustomerFromRequest();
    const body = await request.json();

    const {
      customerName, customerPhone, customerEmail,
      description, budget, preferredFlowers,
      preferredColors, deliveryDate, additionalNotes,
      images,
    } = body;

    if (!customerName || !customerPhone || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customRequest = await prisma.customRequest.create({
      data: {
        customerId: customer?.id ?? null,
        customerName,
        customerPhone,
        customerEmail,
        description,
        budget: budget ? parseInt(budget) : null,
        preferredFlowers,
        preferredColors,
        deliveryDate,
        additionalNotes,
        status: 'pending',
        images: images?.length ? {
          create: images.map((url: string) => ({ url })),
        } : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(customRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
