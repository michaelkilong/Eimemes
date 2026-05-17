'use client';
// app/control-panel-92x/kuki-fc/squad/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function SquadAdminPage() {
  const router = useRouter();
  const [players, setPlayers]   = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });

    Promise.all([
      fetch('/api/kuki-fc/players', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/branches', { credentials: 'include' }).then(r => r.json()),
    ]).then(([p, b]) => {
      setPlayers(p.players || []);
      setBranches(b.branches || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from squad?`)) return;
    const res = await fetch(`/api/kuki-fc/players/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Removed'); setPlayers(p => p.filter(pl => pl._id !== id)); }
    else toast.error('Failed');
  };

  const filtered = players.filter(p =>
    (filter === 'all' || p.branch === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const positionColors: Record<string, string> = {
    Goalkeeper: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    Defender:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Midfielder: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Forward:    'text-red-400 bg-red-500/10 border-red-500/20',
    Manager:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Coach:      'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Squad</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{players.length} players</p>
          </div>
          <Link href="/control-panel-92x/kuki-fc/squad/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Player
          </Link>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] font-mono"
                placeholder="Search players..." value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
              value={filter} onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Branches</option>
              {branches.map(b => <option key={b._id} value={b.slug}>{b.name}</option>)}
            </select>
          </div>

          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">No players found</p>
                <Link href="/control-panel-92x/kuki-fc/squad/new" className="btn-primary text-xs">
                  <Plus size={13} /> Add first player
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1e2433]">
                {filtered.map(player => (
                  <div key={player._id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0 font-display font-bold text-white">
                      {player.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-white text-sm font-medium">{player.name}</span>
                        {player.number > 0 && <span className="text-[#d97706] font-mono text-xs">#{player.number}</span>}
                        {player.isCaptain && <span className="text-[10px] font-mono bg-[#d97706]/15 text-[#d97706] px-1.5 py-0.5 rounded-sm">Captain</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
                        <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase ${positionColors[player.position] || 'text-slate-400 bg-slate-700/20 border-slate-600/20'}`}>
                          {player.position}
                        </span>
                        <span>{player.branch}</span>
                        <span>{player.nationality}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/control-panel-92x/kuki-fc/squad/${player._id}`}
                        className="p-2 text-slate-500 hover:text-[#d97706] transition-colors"><Edit2 size={14} /></Link>
                      <button onClick={() => handleDelete(player._id, player.name)}
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
      
