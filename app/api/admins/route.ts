// app/api/admins/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/index';
import { requireSuperAdmin, forbidden, unauthorized } from '@/lib/auth';

// GET /api/admins — list all team members (superadmin only)
export async function GET(req: NextRequest) {
  const auth = requireSuperAdmin(req);
  if (!auth) return forbidden();

  try {
    await connectDB();
    const admins = await AdminUser.find()
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();
    return NextResponse.json({ admins });
  } catch (err) {
    console.error('[ADMINS GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admins — create a new team member (superadmin only)
export async function POST(req: NextRequest) {
  const auth = requireSuperAdmin(req);
  if (!auth) return forbidden();

  try {
    await connectDB();
    const { name, email, password, role, bio } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!['superadmin', 'writer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const exists = await AdminUser.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({
      name, email, password: hashed,
      role: role || 'writer',
      bio: bio || '',
      active: true,
    });

    const { password: _, ...safeAdmin } = admin.toObject();
    return NextResponse.json({ admin: safeAdmin }, { status: 201 });
  } catch (err: any) {
    console.error('[ADMINS POST]', err);
    if (err.code === 11000) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
