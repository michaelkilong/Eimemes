// app/api/kuki-fc/branches/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Branch } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const branch = params.id.match(/^[a-f\d]{24}$/i)
      ? await Branch.findById(params.id).lean()
      : await Branch.findOne({ slug: params.id }).lean();
    if (!branch) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ branch });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const branch = await Branch.findByIdAndUpdate(params.id, body, { new: true });
    if (!branch) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ branch });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    await Branch.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

