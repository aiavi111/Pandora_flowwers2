import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signCustomerToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль минимум 6 символов' }, { status: 400 });
    }

    const existing = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email уже используется' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      },
    });

    const token = await signCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json(
      { customer: { id: customer.id, name: customer.name, email: customer.email } },
      { status: 201 }
    );

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
