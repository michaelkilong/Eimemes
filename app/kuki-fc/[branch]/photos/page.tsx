import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Branch } from '@/lib/models/KukiFC';
import { GalleryItem } from '@/lib/models';

type Props = { params: { branch: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug: params.branch, active: true }).lean();
    if (!branch) return { title: 'Not Found' };
    return {
      title: `Match Photos — Kuki FC ${branch.name}`,
      description: `Photo gallery for ${branch.name} — Kuki FC, ${branch.city}.`,
    };
  } catch {
    return { title: 'Match Photos' };
  }
}

export const revalidate = 60;

async function getPhotos(slug: string) {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug, active: true }).lean();
    if (!branch) return { branch: null, photos: [] };
    const photos = await GalleryItem.find({
      branch: slug,
      status: 'published',
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return {
      branch: JSON.parse(JSON.stringify(branch)),
      photos: JSON.parse(JSON.stringify(photos)),
    };
  } catch {
    return { branch: null, photos: [] };
  }
}

export default async function PhotosPage({ params }: Props) {
  const data = await getPhotos(params.branch);
  if (!data || !data.branch) notFound();

  const { branch, photos } = data;

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <Link
              href={`/kuki-fc/${params.branch}`}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-5 transition-colors"
            >
              <ArrowLeft size={12} /> {branch.name}
            </Link>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Match Photos</h1>
            <p className="text-slate-400 font-mono text-sm">
              {branch.name} · {branch.city}
            </p>
          </div>
        </div>

        {/* Branch nav — Photos tab active */}
        <div className="bg-white border-b border-[#e5e0d8] sticky top-0 z-40">
          <div className="container flex gap-0">
            {[
              { href: `/kuki-fc/${params.branch}`, label: 'Overview' },
              { href: `/kuki-fc/${params.branch}/squad`, label: 'Squad' },
              { href: `/kuki-fc/${params.branch}/fixtures`, label: 'Fixtures' },
              { href: `/kuki-fc/${params.branch}/photos`, label: 'Photos' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  href.endsWith('/photos')
                    ? 'border-[#d97706] text-[#d97706]'
                    : 'border-transparent text-[#1e293b] hover:text-[#d97706] hover:border-[#d97706]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="container py-12">
          {photos.length === 0 ? (
            <div className="text-center py-24 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
              <p className="font-display text-2xl text-[#0f172a] mb-2">No match photos yet</p>
              <p className="text-[#6b7280] text-sm">
                Photos from matches will appear here once they're uploaded.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {photos.map((item: any, i: number) => (
                <div
                  key={item._id.toString()}
                  className="break-inside-avoid bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || 'Match photo'}
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
