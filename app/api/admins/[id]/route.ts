// app/api/admins/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/index';
import { requireAuth, requireSuperAdmin, forbidden, unauthorized } from '@/lib/auth';

type Params = { params: { id: string } };

// PUT /api/admins/:id — update name, role, bio, active status (superadmin only)
export async function PUT(req: NextRequest, { params }: Params) {
  const auth = requireSuperAdmin(req);
  if (!auth) return forbidden();

  try {
    await connectDB();
    const body = await req.json();

    // Prevent superadmin from demoting themselves
    const target = await AdminUser.findById(params.id).lean();
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (target.email === auth.email && body.role && body.role !== 'superadmin') {
      return NextResponse.json({ error: "You can't demote yourself" }, { status: 400 });
    }

    if (target.email === auth.email && body.active === false) {
      return NextResponse.json({ error: "You can't deactivate yourself" }, { status: 400 });
    }

    const allowed = ['name', 'role', 'bio', 'avatar', 'active'];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const updated = await AdminUser.findByIdAndUpdate(params.id, update, { new: true }).select('-password');
    return NextResponse.json({ admin: updated });
  } catch (err) {
    console.error('[ADMINS PUT]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admins/:id — remove team member (superadmin only)
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = requireSuperAdmin(req);
  if (!auth) return forbidden();

  try {
    await connectDB();
    const target = await AdminUser.findById(params.id).lean();
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (target.email === auth.email) {
      return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
    }

    await AdminUser.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
