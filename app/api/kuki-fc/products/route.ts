// app/api/kuki-fc/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/KukiFC';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const isAdmin  = !!requireAuth(req);
    const query: Record<string, unknown> = {};
    if (!isAdmin) query.inStock = true;
    if (category) query.category = category;
    const products = await Product.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.slug || body.name, { lower: true, strict: true });
    const exists = await Product.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;
    const product = await Product.create({ ...body, slug: finalSlug });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: 'Slug exists' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

