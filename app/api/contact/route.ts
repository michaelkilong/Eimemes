// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

// POST — public submit
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const contact = await ContactMessage.create({ name, email, subject: subject || 'General Inquiry', message });
    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (err) {
    console.error('[CONTACT POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — admin only
export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const read = searchParams.get('read');
    const query: Record<string, unknown> = {};
    if (read === 'false') query.read = false;
    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH — mark as read
export async function PATCH(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const { id } = await req.json();
    await ContactMessage.findByIdAndUpdate(id, { read: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
