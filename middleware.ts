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

// CORS allowed origins
const ALLOWED_ORIGINS = [
  'https://eimemes.vercel.app',
  'http://localhost:3000',
];

function handleAdminAuth(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return null;
  if (PUBLIC_ADMIN.some(p => pathname === p)) return null;

  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
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

    return null;
  } catch {
    const res = NextResponse.redirect(new URL(ADMIN_PREFIX, req.url));
    res.cookies.delete('admin_token');
    return res;
  }
}

function handleCORS(req: NextRequest): NextResponse | null {
  // Only apply to API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) return null;

  const origin = req.headers.get('origin') || '';
  const response = NextResponse.next();

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (origin) {
    // Block unauthorized origins
    return new NextResponse(
      JSON.stringify({ error: 'CORS policy violation' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export function middleware(req: NextRequest) {
  // Check CORS first for API routes
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // Then check admin auth
  const adminResponse = handleAdminAuth(req);
  if (adminResponse) return adminResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/control-panel-92x/:path*',
    '/api/:path*',
  ],
};
