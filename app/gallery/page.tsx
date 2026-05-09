// app/gallery/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { GalleryItem } from '@/lib/models/index';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and images from Eimemes — grassroots football and community stories.',
};

export const revalidate = 60;

async function getItems() {
  try {
    await connectDB();
    const items = await GalleryItem.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return items;
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getItems();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-[#0f172a] py-16 text-center">
          <div className="container">
            <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-4">Visual Stories</p>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Gallery</h1>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Moments from the pitch, the terraces, and the community.
            </p>
          </div>
        </div>

        <div className="container py-12">
          {items.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-[#0f172a] mb-3">No photos yet</p>
              <p className="text-[#6b7280] text-sm">Check back soon — we're building our archive.</p>
            </div>
          ) : (
            <>
              {/* Masonry-style grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {items.map((item: any, i: number) => (
                  <div
                    key={item._id.toString()}
                    className="break-inside-avoid bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="relative w-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    {(item.title || item.caption) && (
                      <div className="p-4">
                        {item.title && (
                          <p className="font-display text-sm font-bold text-[#0f172a] mb-1">
                            {item.title}
                          </p>
                        )}
                        {item.caption && (
                          <p className="text-xs text-[#6b7280] leading-relaxed">{item.caption}</p>
                        )}
                        {item.category && (
                          <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-widest text-[#d97706]">
                            {item.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
