// app/api/kuki-fc/fixtures/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Fixture } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch') || '';
    const status = searchParams.get('status') || '';
    const query: Record<string, unknown> = {};
    if (branch) query.branch = branch;
    if (status) query.status = status;
    const fixtures = await Fixture.find(query).sort({ date: 1 }).lean();
    return NextResponse.json({ fixtures });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const fixture = await Fixture.create(body);
    return NextResponse.json({ fixture }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

