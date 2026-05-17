// app/api/kuki-fc/fixtures/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Fixture } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const fixture = await Fixture.findByIdAndUpdate(params.id, body, { new: true });
    if (!fixture) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ fixture });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    await Fixture.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

