// app/kuki-fc/[branch]/fixtures/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import { Branch, Fixture } from '@/lib/models/KukiFC';

// ✅ Mark params as a Promise
type Props = { params: Promise<{ branch: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ Await the promise
  const { branch } = await params;
  return { title: `Fixtures — Kuki FC ${branch}` };
}

export const revalidate = 60;

async function getData(slug: string) {
  try {
    await connectDB();
    const branch = await Branch.findOne({ slug, active: true }).lean();
    if (!branch) return null;
    const [upcoming, completed] = await Promise.all([
      Fixture.find({ branch: slug, status: { $in: ['upcoming', 'live'] } }).sort({ date: 1 }).lean(),
      Fixture.find({ branch: slug, status: 'completed' }).sort({ date: -1 }).lean(),
    ]);
    return {
      branch: JSON.parse(JSON.stringify(branch)),
      upcoming: JSON.parse(JSON.stringify(upcoming)),
      completed: JSON.parse(JSON.stringify(completed)),
    };
  } catch { return null; }
}

export default async function FixturesPage({ params }: Props) {
  // ✅ Await params before destructuring
  const { branch: slug } = await params;
  const data = await getData(slug);

  if (!data) notFound();
  const { branch, upcoming, completed } = data;

  const resultStyles: Record<string, string> = {
    win:  'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20',
    draw: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
    loss: 'bg-red-500/15 text-red-400 border border-red-500/20',
  };

  // Use the resolved branch name (or slug) for display
  const branchDisplayName = branch.name || (slug.charAt(0).toUpperCase() + slug.slice(1));

  const FixtureRow = ({ fixture }: { fixture: any }) => (
    <div className="bg-white border border-[#e5e0d8] rounded-sm p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d97706]">
              {fixture.competition}
            </span>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border ${
              fixture.status === 'live'
                ? 'bg-red-500/15 text-red-400 border-red-500/20 animate-pulse'
                : 'bg-slate-100 text-[#6b7280] border-[#e5e0d8]'
            }`}>
              {fixture.status === 'live' ? '● LIVE' : fixture.status}
            </span>
            {fixture.isHome
              ? <span className="text-[10px] font-mono bg-[#0f172a] text-white px-2 py-0.5 rounded-sm">Home</span>
              : <span className="text-[10px] font-mono bg-[#f0ece4] text-[#4b4540] px-2 py-0.5 rounded-sm">Away</span>
            }
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="font-display font-bold text-[#0f172a] text-lg">
              Kuki FC {branchDisplayName}
            </span>
            {fixture.status === 'completed' ? (
              <span className="font-display font-black text-2xl text-[#d97706]">
                {fixture.homeScore} – {fixture.awayScore}
              </span>
            ) : (
              <span className="font-mono text-[#6b7280] text-sm">vs</span>
            )}
            <span className="font-display font-bold text-[#0f172a] text-lg">{fixture.opponent}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6b7280] font-mono flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(fixture.date).toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
              })}
              {' '}
              {new Date(fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {fixture.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {fixture.venue}
              </span>
            )}
          </div>
          {fixture.notes && <p className="text-xs text-[#4b4540] mt-2 italic">{fixture.notes}</p>}
        </div>

        {fixture.result && (
          <span className={`flex-shrink-0 text-sm font-mono uppercase font-bold px-3 py-1 rounded-sm ${resultStyles[fixture.result]}`}>
            {fixture.result}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <Link href={`/kuki-fc/${slug}`}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-5 transition-colors">
              <ArrowLeft size={12} /> {branch.name}
            </Link>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Fixtures & Results</h1>
            <p className="text-slate-400 font-mono text-sm">{branch.name} · {branch.city}</p>
          </div>
        </div>

        {/* Branch nav */}
        <div className="bg-white border-b border-[#e5e0d8]">
          <div className="container flex gap-0">
            {[
              { href: `/kuki-fc/${slug}`, label: 'Overview' },
              { href: `/kuki-fc/${slug}/squad`, label: 'Squad' },
              { href: `/kuki-fc/${slug}/fixtures`, label: 'Fixtures' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  href.endsWith('/fixtures')
                    ? 'border-[#d97706] text-[#d97706]'
                    : 'border-transparent text-[#1e293b] hover:text-[#d97706]'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="container py-12 space-y-12">
          {/* Upcoming */}
          <div>
            <h2 className="font-display text-2xl font-bold text-[#0f172a] border-l-4 border-[#d97706] pl-4 mb-6">
              Upcoming Fixtures
            </h2>
            {upcoming.length === 0 ? (
              <div className="text-center py-12 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
                <Calendar size={32} className="text-[#d4cfc7] mx-auto mb-3" />
                <p className="text-[#6b7280] text-sm">No upcoming fixtures scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((f: any) => <FixtureRow key={f._id} fixture={f} />)}
              </div>
            )}
          </div>

          {/* Results */}
          {completed.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] border-l-4 border-[#d97706] pl-4 mb-6">
                Results
              </h2>
              <div className="space-y-4">
                {completed.map((f: any) => <FixtureRow key={f._id} fixture={f} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
