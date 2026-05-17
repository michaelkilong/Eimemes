// app/api/kuki-fc/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Player } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch') || '';
    const query: Record<string, unknown> = { active: true };
    if (branch) query.branch = branch;
    const players = await Player.find(query)
      .sort({ position: 1, number: 1 })
      .lean();
    return NextResponse.json({ players });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const player = await Player.create(body);
    return NextResponse.json({ player }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

