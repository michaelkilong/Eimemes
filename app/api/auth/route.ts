import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/index';
import { signToken, requireAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const LOGIN_LIMIT = 5;        // attempts
const LOGIN_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  // Rate limiting
  if (!rateLimit(req, LOGIN_LIMIT, LOGIN_WINDOW)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    await connectDB();
    const user = await AdminUser.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.active) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // No need for separate inactive message — already handled above

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',   // stronger
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[AUTH POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}

export async function GET(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: payload });
}
