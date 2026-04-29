// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth, unauthorized } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 415 });
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext       = file.name.split('.').pop() || 'jpg';
    const safeName  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer    = Buffer.from(await file.arrayBuffer());

    await writeFile(path.join(UPLOAD_DIR, safeName), buffer);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url, name: safeName });
  } catch (err) {
    console.error('[UPLOAD]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };
