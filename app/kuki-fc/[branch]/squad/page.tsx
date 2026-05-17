// app/kuki-fc/[branch]/squad/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Branch, Player } from '@/lib/models/KukiFC';

type Props = { params: { branch: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Squad — Kuki FC ${params.branch}` };
}

export const revalidate = 60;

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Manager', 'Coach'];

async function getData(slug: string) {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug, active: true }).lean();
    if (!branch) return null;
    const players = await Player.find({ branch: slug, active: true })
      .sort({ number: 1 })
      .lean();
    return {
      branch: JSON.parse(JSON.stringify(branch)),
      players: JSON.parse(JSON.stringify(players)),
    };
  } catch { return null; }
}

export default async function SquadPage({ params }: Props) {
  const data = await getData(params.branch);
  if (!data) notFound();
  const { branch, players } = data;

  const grouped = POSITION_ORDER.reduce((acc: Record<string, any[]>, pos) => {
    const group = players.filter((p: any) => p.position === pos);
    if (group.length > 0) acc[pos] = group;
    return acc;
  }, {});

  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <Link href={`/kuki-fc/${params.branch}`}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-5 transition-colors">
              <ArrowLeft size={12} /> {branch.name}
            </Link>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Squad</h1>
            <p className="text-slate-400 font-mono text-sm">{branch.name} · {branch.city}</p>
          </div>
        </div>

        {/* Branch nav */}
        <div className="bg-white border-b border-[#e5e0d8]">
          <div className="container flex gap-0">
            {[
              { href: `/kuki-fc/${params.branch}`, label: 'Overview' },
              { href: `/kuki-fc/${params.branch}/squad`, label: 'Squad' },
              { href: `/kuki-fc/${params.branch}/fixtures`, label: 'Fixtures' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  href.endsWith('/squad')
                    ? 'border-[#d97706] text-[#d97706]'
                    : 'border-transparent text-[#1e293b] hover:text-[#d97706] hover:border-[#d97706]'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="container py-12">
          {players.length === 0 ? (
            <div className="text-center py-20 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
              <p className="font-display text-2xl text-[#0f172a] mb-2">Squad not announced</p>
              <p className="text-[#6b7280] text-sm">Check back soon for the full squad list.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([position, posPlayers]) => (
                <div key={position}>
                  <h2 className="font-display text-xl font-bold text-[#0f172a] border-l-4 border-[#d97706] pl-4 mb-6">
                    {position}s
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {posPlayers.map((player: any) => (
                      <div key={player._id}
                        className="bg-white border border-[#e5e0d8] rounded-sm p-4 text-center card-hover">
                        <div className="relative w-16 h-16 rounded-full bg-[#0f172a] mx-auto mb-3 overflow-hidden flex items-center justify-center">
                          {player.photo ? (
                            <Image src={player.photo} alt={player.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <span className="text-white font-display font-bold text-2xl">
                              {player.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        {player.number > 0 && (
                          <p className="text-[#d97706] font-mono font-bold text-sm"># {player.number}</p>
                        )}
                        <p className="font-semibold text-[#0f172a] text-sm mt-0.5">{player.name}</p>
                        <p className="text-xs text-[#6b7280] font-mono">{player.nationality}</p>
                        {player.isCaptain && (
                          <span className="inline-block mt-1.5 text-[10px] font-mono bg-[#d97706]/15 text-[#d97706] px-2 py-0.5 rounded-sm">
                            Captain
                          </span>
                        )}
                        {player.bio && (
                          <p className="text-xs text-[#4b4540] mt-2 leading-relaxed line-clamp-2">{player.bio}</p>
                        )}
                      </div>
                    ))}
                  </div>
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
        
