// app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GalleryItem } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const item = await GalleryItem.findByIdAndUpdate(params.id, body, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    await GalleryItem.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
