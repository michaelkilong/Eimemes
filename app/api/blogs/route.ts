// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page    = parseInt(searchParams.get('page') || '1');
    const limit   = parseInt(searchParams.get('limit') || '10');
    const isAdmin = !!requireAuth(req);
    const status  = searchParams.get('status') || '';

    const query: Record<string, unknown> = {};
    if (!isAdmin) query.status = 'published';
    else if (status) query.status = status;

    const skip  = (page - 1) * limit;
    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .lean();

    return NextResponse.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('[BLOGS GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.slug || body.title, { lower: true, strict: true });
    const exists = await BlogPost.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;
    const post = await BlogPost.create({ ...body, slug: finalSlug });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    console.error('[BLOGS POST]', err);
    if (err.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
