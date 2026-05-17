// app/api/kuki-fc/players/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Player } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const player = await Player.findById(params.id).lean();
    if (!player) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ player });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const player = await Player.findByIdAndUpdate(params.id, body, { new: true });
    if (!player) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ player });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    await Player.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
  
