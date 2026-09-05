// lib/csrf.ts
import crypto from 'crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Store CSRF token in cookie
 */
export async function setCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = cookies();
  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  return token;
}

/**
 * Verify CSRF token from request
 */
export async function verifyCSRFToken(token: string): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const storedToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;
    if (!storedToken || !token) return false;
    return storedToken === token;
  } catch {
    return false;
  }
}
