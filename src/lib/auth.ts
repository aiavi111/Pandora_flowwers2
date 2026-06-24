import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'pandora-flowers-secret-2024'
);

export async function signAdminToken(payload: {
  id: string;
  email: string;
  name: string;
  role: string;
}): Promise<string> {
  return new SignJWT({ ...payload, type: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== 'admin') return null;
    return payload as {
      id: string;
      email: string;
      name: string;
      role: string;
      type: string;
    };
  } catch {
    return null;
  }
}

export async function signCustomerToken(payload: {
  id: string;
  email: string;
  name: string;
}): Promise<string> {
  return new SignJWT({ ...payload, type: 'customer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyCustomerToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== 'customer') return null;
    return payload as {
      id: string;
      email: string;
      name: string;
      type: string;
    };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
  type: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function getCustomerFromRequest(): Promise<{
  id: string;
  email: string;
  name: string;
  type: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('customer_token')?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}
