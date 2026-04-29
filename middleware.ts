// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_PREFIX = '/control-panel-92x';

// Routes only superadmin can access
const SUPERADMIN_ONLY = [
  '/control-panel-92x/team',
  '/control-panel-92x/gallery',
  '/control-panel-92x/messages',
];

// Public admin routes (no auth needed)
const PUBLIC_ADMIN = [
  '/control-panel-92x',
  '/control-panel-92x/',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (PUBLIC_ADMIN.includes(pathname)) return NextResponse.next();

  // Verify JWT cookie
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    const res = NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
    res.cookies.delete('admin_token');
    return res;
  }

  // Superadmin-only route check
  const isSuperAdminRoute = SUPERADMIN_ONLY.some(p => pathname.startsWith(p));
  if (isSuperAdminRoute && payload.role !== 'superadmin') {
    return NextResponse.redirect(
      new URL('/control-panel-92x/dashboard?forbidden=1', req.url)
    );
  }

  // Pass user info via headers
  const response = NextResponse.next();
  response.headers.set('x-user-id',   payload.userId);
  response.headers.set('x-user-role', payload.role);
  response.headers.set('x-user-name', payload.name);
  return response;
}

export const config = {
  matcher: ['/control-panel-92x/:path*'],
};
