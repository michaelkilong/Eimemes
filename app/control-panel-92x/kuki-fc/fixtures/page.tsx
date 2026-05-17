'use client';
// app/control-panel-92x/kuki-fc/fixtures/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function FixturesAdminPage() {
  const router = useRouter();
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });
    Promise.all([
      fetch('/api/kuki-fc/fixtures', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/branches', { credentials: 'include' }).then(r => r.json()),
    ]).then(([f, b]) => {
      setFixtures(f.fixtures || []);
      setBranches(b.branches || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this fixture?')) return;
    const res = await fetch(`/api/kuki-fc/fixtures/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Deleted'); setFixtures(p => p.filter(f => f._id !== id)); }
    else toast.error('Failed');
  };

  const filtered = fixtures.filter(f => filter === 'all' || f.branch === filter);

  const resultColors: Record<string, string> = {
    win:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    draw: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    loss: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Fixtures</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{fixtures.length} total</p>
          </div>
          <Link href="/control-panel-92x/kuki-fc/fixtures/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Fixture
          </Link>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${filter === 'all' ? 'bg-[#d97706] text-white' : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400'}`}>
              All
            </button>
            {branches.map(b => (
              <button key={b._id} onClick={() => setFilter(b.slug)}
                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${filter === b.slug ? 'bg-[#d97706] text-white' : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400'}`}>
                {b.city}
              </button>
            ))}
          </div>

          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">No fixtures yet</p>
                <Link href="/control-panel-92x/kuki-fc/fixtures/new" className="btn-primary text-xs">
                  <Plus size={13} /> Add fixture
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1e2433]">
                {filtered.map(fixture => (
                  <div key={fixture._id} className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white text-sm font-medium">vs {fixture.opponent}</span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border ${
                          fixture.status === 'live' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
                          fixture.status === 'completed' ? 'bg-slate-700/40 text-slate-400 border-slate-600/20' :
                          'bg-blue-500/15 text-blue-400 border-blue-500/20'
                        }`}>{fixture.status}</span>
                        {fixture.result && (
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold ${resultColors[fixture.result]}`}>
                            {fixture.result}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
                        <span>{new Date(fixture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>{fixture.branch}</span>
                        <span>{fixture.competition}</span>
                        {fixture.status === 'completed' && (
                          <span className="text-[#d97706] font-bold">{fixture.homeScore} – {fixture.awayScore}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/control-panel-92x/kuki-fc/fixtures/${fixture._id}`}
                        className="p-2 text-slate-500 hover:text-[#d97706] transition-colors"><Edit2 size={14} /></Link>
                      <button onClick={() => handleDelete(fixture._id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
                                                                                   }
              
