import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signCustomerToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Введите email и пароль' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    const token = await signCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
