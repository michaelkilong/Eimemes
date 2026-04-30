// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import { requireAuth, unauthorized } from '@/lib/auth';

// GET /api/articles — public: published only; admin: all
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page     = parseInt(searchParams.get('page') || '1');
    const limit    = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const status   = searchParams.get('status') || '';
    const isAdmin  = !!requireAuth(req);

    const query: Record<string, unknown> = {};

    if (!isAdmin) query.status = 'published';
    else if (status) query.status = status;

    if (category) query.category = { $regex: category, $options: 'i' };
    if (featured)  query.featured = true;

    const skip  = (page - 1) * limit;
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .lean();

    return NextResponse.json({
      articles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[ARTICLES GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/articles — admin only
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  try {
    await connectDB();
    const body = await req.json();

    const slug = slugify(body.slug || body.title, { lower: true, strict: true });

    const exists = await Article.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;

    const article = await Article.create({ ...body, slug: finalSlug });
    return NextResponse.json({ article }, { status: 201 });
  } catch (err: any) {
    console.error('[ARTICLES POST]', err);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
