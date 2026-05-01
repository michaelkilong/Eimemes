// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_PREFIX = '/control-panel-92x';

const SUPERADMIN_ONLY = [
  '/control-panel-92x/team',
  '/control-panel-92x/gallery',
  '/control-panel-92x/messages',
];

const PUBLIC_ADMIN = [
  '/control-panel-92x',
  '/control-panel-92x/',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  if (PUBLIC_ADMIN.some(p => pathname === p)) return NextResponse.next();

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

  const isSuperAdminRoute = SUPERADMIN_ONLY.some(p => pathname.startsWith(p));
  if (isSuperAdminRoute && payload.role !== 'superadmin') {
    return NextResponse.redirect(
      new URL('/control-panel-92x/dashboard?forbidden=1', req.url)
    );
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id',   payload.userId);
  response.headers.set('x-user-role', payload.role);
  response.headers.set('x-user-name', payload.name);
  return response;
}

export const config = {
  matcher: ['/control-panel-92x/:path*'],
};
