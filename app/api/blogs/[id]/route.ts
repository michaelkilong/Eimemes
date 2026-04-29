// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { requireAuth, unauthorized, forbidden } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const isAdmin = !!requireAuth(req);
    const { id } = params;

    let post = id.match(/^[a-f\d]{24}$/i)
      ? await BlogPost.findById(id)
      : await BlogPost.findOne({ slug: id });

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!isAdmin && post.status !== 'published') return NextResponse.json({ error: 'Not found' }, { status: 404 });

    BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const post = await BlogPost.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'superadmin') return forbidden();
  try {
    await connectDB();
    await BlogPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
