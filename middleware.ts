// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

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

  // Just check cookie exists — API routes handle real verification
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
  }

  // Decode without verifying (verification happens in API routes)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      const res = NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
      res.cookies.delete('admin_token');
      return res;
    }

    // Check superadmin routes
    const isSuperAdminRoute = SUPERADMIN_ONLY.some(p => pathname.startsWith(p));
    if (isSuperAdminRoute && payload.role !== 'superadmin') {
      return NextResponse.redirect(
        new URL('/control-panel-92x/dashboard?forbidden=1', req.url)
      );
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
    res.cookies.delete('admin_token');
    return res;
  }
}

export const config = {
  matcher: ['/control-panel-92x/:path*'],
};
