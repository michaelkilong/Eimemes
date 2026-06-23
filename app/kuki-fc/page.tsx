// app/kuki-fc/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShoppingBag, Users, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Branch } from '@/lib/models/KukiFC';

export const metadata: Metadata = {
  title: 'Kuki FC — Official Club Hub',
  description: 'Kuki FC — grassroots football club with branches across India.',
};

export const revalidate = 60;

async function getBranches() {
  try {
    await connectDB();
    const branches = await Branch.find({ active: true }).sort({ createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(branches));
  } catch {
    return [];
  }
}

export default async function KukiFCPage() {
  const branches = await getBranches();

  return (
    <>
      <Header />
      <main>
        {/* Hero — with football background & fading black */}
        <div className="relative py-24 text-center overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://i.ibb.co/fVpCPXyK/7-DAB2067-7225-49-AD-B81-B-98002-DE32-B27.jpg')",
            }}
          />

          {/* Fading black overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="container relative z-10">
            {/* Logo — now using your correct direct URL */}
            <div className="w-24 h-24 mx-auto mb-6">
              <img
                src="https://i.ibb.co/hx2zzpkK/469-B42-C4-3-CF4-467-E-88-BE-F24840-CC9-D52.jpg"
                alt="Kuki FC Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4">
              Kuki FC
            </h1>
            <p className="text-[#d97706] font-mono text-sm uppercase tracking-widest mb-4">
              Grassroots · Community · Football
            </p>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
              Born from community passion. Built on hard work. Kuki FC is more than a football club —
              it is a movement growing across India.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/kuki-fc/shop" className="btn-primary px-6 py-3">
                <ShoppingBag size={16} /> Shop
              </Link>
              <Link
                href="#branches"
                className="btn-ghost border-slate-600 text-slate-300 hover:bg-slate-800 px-6 py-3"
              >
                <MapPin size={16} /> Our Branches
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="bg-[#d97706]">
          <div className="container py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Branches', value: branches.length || '3+' },
                { label: 'Cities', value: branches.length || '3+' },
                { label: 'Est.', value: '2025' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-white font-display font-bold text-2xl">{value}</p>
                  <p className="text-amber-100 text-xs font-mono uppercase tracking-widest">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Branches */}
        <div id="branches" className="container py-16">
          <div className="mb-10">
            <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-2">
              Our clubs
            </p>
            <h2 className="font-display text-3xl font-bold text-[#0f172a]">Branches</h2>
          </div>

          {branches.length === 0 ? (
            <div className="text-center py-16 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
              <Users size={40} className="text-[#d4cfc7] mx-auto mb-4" />
              <p className="font-display text-xl text-[#0f172a] mb-2">Branches coming soon</p>
              <p className="text-[#6b7280] text-sm">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch: any) => (
                <Link
                  key={branch._id}
                  href={`/kuki-fc/${branch.slug}`}
                  className="group bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover"
                >
                  <div className="relative h-48 bg-[#0f172a] overflow-hidden">
                    {branch.coverImage ? (
                      <Image
                        src={branch.coverImage}
                        alt={branch.name}
                        fill
                        className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                        sizes="400px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 font-display font-black text-6xl">KFC</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-1">
                        {branch.city}
                      </p>
                      <h3 className="font-display text-xl font-bold text-white">{branch.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    {branch.description && (
                      <p className="text-sm text-[#4b4540] leading-relaxed mb-4 line-clamp-2">
                        {branch.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs font-mono text-[#6b7280]">
                      {branch.stadium && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {branch.stadium}
                        </span>
                      )}
                      {branch.founded && <span>Est. {branch.founded}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Shop CTA */}
        <div className="bg-[#0f172a] py-16">
          <div className="container text-center">
            <ShoppingBag size={40} className="text-[#d97706] mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Official Kuki FC Shop
            </h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Jerseys, scarves, caps and more. Wear your colours with pride.
            </p>
            <Link href="/kuki-fc/shop" className="btn-primary px-8 py-3 text-base">
              Browse the shop
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
