// app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import { requireAuth, unauthorized, forbidden } from '@/lib/auth';

type Params = { params: { id: string } };

// GET /api/articles/:id — fetch by id or slug
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;
    const isAdmin = !!requireAuth(req);

    // Try by MongoDB id first, then slug
    let article =
      id.match(/^[a-f\d]{24}$/i)
        ? await Article.findById(id)
        : await Article.findOne({ slug: id });

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!isAdmin && article.status !== 'published') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment views (non-blocking)
    Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({ article });
  } catch (err) {
    console.error('[ARTICLE GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/articles/:id — update
export async function PUT(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  try {
    await connectDB();
    const body = await req.json();

    const article = await Article.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ article });
  } catch (err) {
    console.error('[ARTICLE PUT]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/articles/:id — superadmin only
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'superadmin') return forbidden();

  try {
    await connectDB();
    const article = await Article.findByIdAndDelete(params.id);
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[ARTICLE DELETE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
