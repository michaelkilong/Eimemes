// app/kuki-fc/shop/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/KukiFC';

export const metadata: Metadata = {
  title: 'Shop — Kuki FC',
  description: 'Official Kuki FC merchandise. Jerseys, scarves, caps and more.',
};

export const revalidate = 60;

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({ inStock: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch { return []; }
}

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Footwear', 'Other'];

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-[#0f172a] py-16 text-center">
          <div className="container">
            <Link href="/kuki-fc"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-6 transition-colors">
              <ArrowLeft size={12} /> Kuki FC
            </Link>
            <ShoppingBag size={40} className="text-[#d97706] mx-auto mb-4" />
            <h1 className="font-display text-5xl font-bold text-white mb-3">Official Shop</h1>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Wear your colours. Support your club. All orders via WhatsApp.
            </p>
          </div>
        </div>

        <div className="container py-12">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
              <ShoppingBag size={48} className="text-[#d4cfc7] mx-auto mb-4" />
              <p className="font-display text-2xl text-[#0f172a] mb-2">Shop coming soon</p>
              <p className="text-[#6b7280] text-sm">Official merchandise will be available here shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/kuki-fc/shop/${product.slug}`}
                  className="group bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover"
                >
                  <div className="relative w-full h-56 bg-[#f8f7f4] overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]} alt={product.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag size={40} className="text-[#d4cfc7]" />
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-[#d97706] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-display font-bold text-[#0f172a] mb-2 group-hover:text-[#d97706] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-[#0f172a]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.sizes?.length > 0 && (
                        <div className="flex gap-1">
                          {product.sizes.slice(0, 3).map((size: string) => (
                            <span key={size} className="text-[10px] border border-[#e5e0d8] px-1.5 py-0.5 rounded-sm font-mono text-[#6b7280]">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 3 && (
                            <span className="text-[10px] text-[#6b7280] font-mono">+{product.sizes.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
                      
