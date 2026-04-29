// app/api/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GalleryItem } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = !!requireAuth(req);
    const query: Record<string, unknown> = {};
    if (!isAdmin) query.status = 'published';
    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const item = await GalleryItem.create(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
