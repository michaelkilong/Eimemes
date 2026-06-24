// app/api/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GalleryItem } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

// Allowed fields for creation
const ALLOWED_FIELDS = [
  'title',
  'caption',
  'imageUrl',
  'category',
  'status',
  'order',
  'branch',
  'fixture',
];

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

    // Extract only allowed fields
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        sanitized[key] = body[key];
      }
    }

    // Basic validation
    if (!sanitized.title || !sanitized.imageUrl) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }
    if (sanitized.status && !['draft', 'published'].includes(sanitized.status as string)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const item = await GalleryItem.create(sanitized);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
