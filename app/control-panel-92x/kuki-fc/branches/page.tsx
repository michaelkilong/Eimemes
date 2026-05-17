'use client';
// app/control-panel-92x/kuki-fc/branches/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, ToggleRight, ToggleLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function BranchesAdminPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });
    fetch('/api/kuki-fc/branches', { credentials: 'include' })
      .then(r => r.json()).then(d => setBranches(d.branches || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/kuki-fc/branches/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Deleted'); setBranches(p => p.filter(b => b._id !== id)); }
    else toast.error('Delete failed');
  };

  const toggleActive = async (branch: any) => {
    const res = await fetch(`/api/kuki-fc/branches/${branch._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !branch.active }),
    });
    if (res.ok) setBranches(prev => prev.map(b => b._id === branch._id ? { ...b, active: !b.active } : b));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Branches</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{branches.length} total</p>
          </div>
          <Link href="/control-panel-92x/kuki-fc/branches/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> New Branch
          </Link>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-sm" />)}</div>
          ) : branches.length === 0 ? (
            <div className="text-center py-16 bg-[#13171f] border border-[#1e2433] rounded-sm">
              <p className="text-slate-500 font-mono text-sm mb-4">No branches yet</p>
              <Link href="/control-panel-92x/kuki-fc/branches/new" className="btn-primary text-xs">
                <Plus size={13} /> Add first branch
              </Link>
            </div>
          ) : (
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm divide-y divide-[#1e2433]">
              {branches.map(branch => (
                <div key={branch._id} className="p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-medium text-sm">{branch.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${branch.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/40 text-slate-500'}`}>
                        {branch.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{branch.city} · /{branch.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/kuki-fc/${branch.slug}`} target="_blank"
                      className="p-2 text-slate-500 hover:text-white transition-colors"><Eye size={14} /></a>
                    <button onClick={() => toggleActive(branch)}
                      className={`p-2 transition-colors ${branch.active ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {branch.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <Link href={`/control-panel-92x/kuki-fc/branches/${branch._id}`}
                      className="p-2 text-slate-500 hover:text-[#d97706] transition-colors"><Edit2 size={14} /></Link>
                    <button onClick={() => handleDelete(branch._id, branch.name)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
      
