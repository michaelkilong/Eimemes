// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Comment } from '@/lib/models/index';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const postId  = searchParams.get('postId');
    const isAdmin = !!requireAuth(req);

    const query: Record<string, unknown> = {};
    if (postId) query.postId = postId;

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .limit(isAdmin ? 200 : 50)
      .lean();

    return NextResponse.json({ comments });
  } catch (err) {
    console.error('[COMMENTS GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, comment, postId, postType, postSlug, postTitle } = await req.json();

    if (!name || !email || !comment) {
      return NextResponse.json({ error: 'Name, email and comment are required' }, { status: 400 });
    }

    if (comment.length > 1000) {
      return NextResponse.json({ error: 'Comment too long (max 1000 characters)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!postId || !postType || !postSlug) {
      return NextResponse.json({ error: 'Post info missing' }, { status: 400 });
    }

    const newComment = await Comment.create({
      name, email, comment,
      postId, postType, postSlug, postTitle,
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (err) {
    console.error('[COMMENTS POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
