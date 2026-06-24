import { NextRequest } from 'next/server';

const store = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries on each access instead of using setInterval
function cleanupStore() {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}

export function rateLimit(req: NextRequest, maxRequests: number, windowMs: number): boolean {
  cleanupStore();

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
