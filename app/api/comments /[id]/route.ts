// app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Comment } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  try {
    await connectDB();
    await Comment.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
