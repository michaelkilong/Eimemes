// app/kuki-fc/[branch]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Calendar, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Branch, Player, Fixture } from '@/lib/models/KukiFC';

type Props = { params: { branch: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug: params.branch, active: true }).lean();
    if (!branch) return { title: 'Not Found' };
    return {
      title: `${branch.name} — Kuki FC`,
      description: branch.description || `${branch.name} branch of Kuki FC based in ${branch.city}.`,
    };
  } catch { return { title: 'Kuki FC' }; }
}

export const revalidate = 60;

async function getData(slug: string) {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug, active: true }).lean();
    if (!branch) return null;
    const [players, upcoming, recent] = await Promise.all([
      Player.find({ branch: slug, active: true }).sort({ position: 1 }).limit(6).lean(),
      Fixture.find({ branch: slug, status: 'upcoming' }).sort({ date: 1 }).limit(3).lean(),
      Fixture.find({ branch: slug, status: 'completed' }).sort({ date: -1 }).limit(3).lean(),
    ]);
    return {
      branch: JSON.parse(JSON.stringify(branch)),
      players: JSON.parse(JSON.stringify(players)),
      upcoming: JSON.parse(JSON.stringify(upcoming)),
      recent: JSON.parse(JSON.stringify(recent)),
    };
  } catch { return null; }
}

export default async function BranchPage({ params }: Props) {
  const data = await getData(params.branch);
  if (!data) notFound();

  const { branch, players, upcoming, recent } = data;

  const resultColors: Record<string, string> = {
    win:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    draw: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    loss: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  // Helper component for a small team badge
  const TeamLogo = ({ logo, name, className }: { logo?: string; name: string; className?: string }) => {
    if (logo) {
      return (
        <Image
          src={logo}
          alt={name}
          width={32}
          height={32}
          className={`object-contain ${className || ''}`}
        />
      );
    }
    return (
      <div className={`w-8 h-8 rounded-full bg-[#f0ece4] flex items-center justify-center ${className || ''}`}>
        <Shield size={16} className="text-[#6b7280]" />
      </div>
    );
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="relative bg-[#0f172a] py-20">
          {branch.coverImage && (
            <>
              <Image src={branch.coverImage} alt={branch.name} fill className="object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-transparent" />
            </>
          )}
          <div className="container relative z-10">
            <Link href="/kuki-fc" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-6 transition-colors">
              <ArrowLeft size={12} /> Kuki FC
            </Link>
            <div className="flex items-center gap-5 mb-4">
              {branch.logo ? (
                <Image src={branch.logo} alt={branch.name} width={72} height={72} className="rounded-full" />
              ) : (
                <div className="w-16 h-16 bg-[#d97706] rounded-full flex items-center justify-center">
                  <span className="text-white font-display font-black text-xl">KFC</span>
                </div>
              )}
              <div>
                <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-1">
                  {branch.city}
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-black text-white">
                  {branch.name}
                </h1>
              </div>
            </div>
            {branch.description && (
              <p className="text-slate-300 max-w-2xl leading-relaxed mb-6">{branch.description}</p>
            )}
            <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-mono">
              {branch.stadium && <span className="flex items-center gap-1"><MapPin size={11} /> {branch.stadium}</span>}
              {branch.manager && <span className="flex items-center gap-1"><Users size={11} /> Manager: {branch.manager}</span>}
              {branch.founded && <span>Founded {branch.founded}</span>}
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="bg-white border-b border-[#e5e0d8] sticky top-0 z-40">
          <div className="container flex gap-0">
            {[
              { href: `/kuki-fc/${params.branch}`, label: 'Overview' },
              { href: `/kuki-fc/${params.branch}/squad`, label: 'Squad' },
              { href: `/kuki-fc/${params.branch}/fixtures`, label: 'Fixtures' },
              { href: `/kuki-fc/${params.branch}/photos`, label: 'Photos' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  href.endsWith(`/${params.branch}`)
                    ? 'border-[#d97706] text-[#d97706]'
                    : 'border-transparent text-[#1e293b] hover:text-[#d97706] hover:border-[#d97706]'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Squad preview (unchanged) */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-[#0f172a] pb-2 border-b-2 border-[#d97706] inline-block">
                    Squad
                  </h2>
                  <Link href={`/kuki-fc/${params.branch}/squad`}
                    className="text-xs text-[#d97706] font-mono flex items-center gap-1">
                    Full squad <ArrowRight size={12} />
                  </Link>
                </div>

                {players.length === 0 ? (
                  <div className="text-center py-10 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
                    <p className="text-[#6b7280] text-sm">Squad not announced yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {players.slice(0, 6).map((player: any) => (
                      <div key={player._id} className="bg-white border border-[#e5e0d8] rounded-sm p-4 text-center">
                        <div className="relative w-14 h-14 rounded-md bg-[#0f172a] mx-auto mb-3 overflow-hidden">
                          {player.photo ? (
                            <Image
                              src={player.photo}
                              alt={player.name}
                              fill
                              className="object-cover object-top"
                              sizes="56px"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-white font-display font-bold text-xl">
                              {player.name.charAt(0)}
                            </span>
                          )}
                          {player.number > 0 && (
                            <div className="absolute top-0.5 right-0.5 bg-[#d97706] text-white font-mono font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                              {player.number}
                            </div>
                          )}
                          {player.isCaptain && (
                            <div className="absolute top-0.5 left-0.5 bg-[#0f172a]/80 text-[#d97706] font-mono text-[8px] uppercase px-1.5 py-0.5 rounded-sm">
                              C
                            </div>
                          )}
                        </div>
                        {player.number > 0 && (
                          <p className="text-[#d97706] font-mono font-bold text-sm mb-0.5">#{player.number}</p>
                        )}
                        <p className="font-semibold text-[#0f172a] text-sm">{player.name}</p>
                        <p className="text-xs text-[#6b7280] font-mono">{player.position}</p>
                        {player.isCaptain && (
                          <span className="text-[10px] font-mono bg-[#d97706]/15 text-[#d97706] px-2 py-0.5 rounded-sm mt-1 inline-block">
                            Captain
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent results – new football-style layout */}
              {recent.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#0f172a] pb-2 border-b-2 border-[#d97706] inline-block mb-6">
                    Recent Results
                  </h2>
                  <div className="space-y-4">
                    {recent.map((fixture: any) => {
                      const isHome = fixture.isHome;
                      const homeTeam = isHome ? `Kuki FC ${params.branch}` : fixture.opponent;
                      const awayTeam = isHome ? fixture.opponent : `Kuki FC ${params.branch}`;
                      const homeLogo = isHome ? branch.logo : fixture.opponentLogo;
                      const awayLogo = isHome ? fixture.opponentLogo : branch.logo;
                      const score = `${fixture.homeScore ?? '-'} – ${fixture.awayScore ?? '-'}`;

                      return (
                        <div key={fixture._id} className="bg-white border border-[#e5e0d8] rounded-sm p-5">
                          {/* Competition & date */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#d97706]">
                              {fixture.competition}
                            </span>
                            <span className="text-[11px] text-[#6b7280] font-mono">
                              {new Date(fixture.date).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Teams & score */}
                          <div className="flex items-center justify-between gap-4">
                            {/* Home team */}
                            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                              <span className="text-xs font-semibold text-[#0f172a] truncate text-right leading-tight">
                                {homeTeam}
                              </span>
                              <TeamLogo logo={homeLogo} name={homeTeam} className="w-7 h-7" />
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 text-center">
                              <span className="inline-block font-display font-black text-xl text-[#0f172a] bg-[#f8f7f4] px-4 py-1 rounded-sm">
                                {score}
                              </span>
                            </div>

                            {/* Away team */}
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <TeamLogo logo={awayLogo} name={awayTeam} className="w-7 h-7" />
                              <span className="text-xs font-semibold text-[#0f172a] truncate leading-tight">
                                {awayTeam}
                              </span>
                            </div>
                          </div>

                          {/* Result badge & venue */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              {fixture.result && (
                                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold ${resultColors[fixture.result]}`}>
                                  {fixture.result}
                                </span>
                              )}
                              {fixture.venue && (
                                <span className="text-[10px] text-[#6b7280] font-mono flex items-center gap-1">
                                  <MapPin size={9} /> {fixture.venue}
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/kuki-fc/${params.branch}/fixtures`}
                              className="text-[10px] text-[#d97706] font-mono hover:underline"
                            >
                              Full fixtures →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <h2 className="font-display text-xl font-bold text-[#0f172a] pb-2 border-b-2 border-[#d97706] inline-block mb-6">
                Upcoming
              </h2>
              {upcoming.length === 0 ? (
                <div className="bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm p-6 text-center">
                  <Calendar size={28} className="text-[#d4cfc7] mx-auto mb-2" />
                  <p className="text-[#6b7280] text-sm">No upcoming fixtures</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((fixture: any) => (
                    <div key={fixture._id} className="bg-white border border-[#e5e0d8] rounded-sm p-4">
                      <p className="text-[#d97706] font-mono text-xs uppercase tracking-wide mb-1">
                        {fixture.competition}
                      </p>
                      <p className="font-display font-bold text-[#0f172a] text-sm mb-2">
                        vs {fixture.opponent}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#6b7280] font-mono">
                        <span>
                          {new Date(fixture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        {fixture.venue && <span><MapPin size={10} className="inline" /> {fixture.venue}</span>}
                        <span>{fixture.isHome ? 'Home' : 'Away'}</span>
                      </div>
                    </div>
                  ))}
                  <Link href={`/kuki-fc/${params.branch}/fixtures`}
                    className="block text-center text-xs text-[#d97706] font-mono mt-2">
                    All fixtures →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
