import { NextRequest } from 'next/server';

const store = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in‑memory rate limiter.
 * Returns true if the request is within the limit, false otherwise.
 */
export function rateLimit(req: NextRequest, maxRequests: number, windowMs: number): boolean {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
  const key = `${ip}:${maxRequests}:${windowMs}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60000);
