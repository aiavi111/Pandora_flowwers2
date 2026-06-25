import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Lightweight DB ping. Hit this URL every ~5 minutes from a free uptime pinger
// (e.g. cron-job.org) to keep the database awake → no cold-start delays.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
