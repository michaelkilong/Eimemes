// app/kuki-fc/shop/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/KukiFC';
import WhatsAppOrder from '@/components/kuki-fc/WhatsAppOrder';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug }).lean();
    if (!product) return { title: 'Not Found' };
    return {
      title: `${product.name} — Kuki FC Shop`,
      description: product.description || `Buy ${product.name} from the official Kuki FC shop.`,
    };
  } catch { return { title: 'Product' }; }
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug }).lean();
  if (!product) notFound();

  const p = JSON.parse(JSON.stringify(product));

  return (
    <>
      <Header />
      <main className="container py-12">
        <Link href="/kuki-fc/shop"
          className="inline-flex items-center gap-1.5 text-[#6b7280] hover:text-[#d97706] text-xs font-mono mb-8 transition-colors">
          <ArrowLeft size={12} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative w-full bg-[#f8f7f4] rounded-sm overflow-hidden" style={{ height: '480px' }}>
              {p.images?.[0] ? (
                <Image
                  src={p.images[0]} alt={p.name} fill
                  className="object-contain" sizes="50vw" priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={64} className="text-[#d4cfc7]" />
                </div>
              )}
            </div>
            {p.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {p.images.slice(1).map((img: string, i: number) => (
                  <div key={i} className="relative h-24 bg-[#f8f7f4] rounded-sm overflow-hidden">
                    <Image src={img} alt={`${p.name} ${i + 2}`} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#d97706] mb-2">
              {p.category}
            </p>
            <h1 className="font-display text-3xl font-bold text-[#0f172a] mb-3">{p.name}</h1>
            <p className="font-display text-3xl font-black text-[#0f172a] mb-6">
              ₹{p.price.toLocaleString('en-IN')}
            </p>

            {p.description && (
              <p className="text-[#4b4540] leading-relaxed mb-6 text-sm">{p.description}</p>
            )}

            {/* Sizes */}
            {p.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-mono uppercase tracking-widest text-[#6b7280] mb-3">
                  Available Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((size: string) => (
                    <span key={size}
                      className="border border-[#e5e0d8] px-4 py-2 text-sm font-mono text-[#0f172a] rounded-sm hover:border-[#d97706] hover:text-[#d97706] cursor-pointer transition-all">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6">
              {p.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-mono">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" /> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-mono">
                  <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
                </span>
              )}
            </div>

            {/* WhatsApp order button — client component */}
            {p.inStock && (
              <WhatsAppOrder
                productName={p.name}
                price={p.price}
                whatsappNumber={p.whatsappNumber}
                sizes={p.sizes}
              />
            )}

            {/* Info */}
            <div className="mt-8 p-4 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-[#6b7280] mb-2">How to order</p>
              <ol className="text-sm text-[#4b4540] space-y-1 list-decimal list-inside">
                <li>Select your size above</li>
                <li>Click the WhatsApp button</li>
                <li>Confirm your order with our team</li>
                <li>Pay and receive delivery details</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
              
