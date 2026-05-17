'use client';
// app/control-panel-92x/kuki-fc/fixtures/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const EMPTY = { opponent: '', branch: '', date: '', venue: '', competition: 'League', isHome: true, status: 'upcoming', homeScore: '', awayScore: '', result: '', notes: '' };

export default function EditFixturePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm]     = useState(EMPTY);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/kuki-fc/fixtures/${id}`, { credentials: 'include' }).then(r => r.json()).catch(() => ({})),
      fetch('/api/kuki-fc/branches', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/fixtures', { credentials: 'include' }).then(r => r.json()),
    ]).then(([_, b, all]) => {
      setBranches(b.branches || []);
      const fixture = all.fixtures?.find((f: any) => f._id === id);
      if (fixture) setForm({
        opponent: fixture.opponent || '', branch: fixture.branch || '',
        date: fixture.date ? new Date(fixture.date).toISOString().slice(0, 16) : '',
        venue: fixture.venue || '', competition: fixture.competition || 'League',
        isHome: fixture.isHome ?? true, status: fixture.status || 'upcoming',
        homeScore: fixture.homeScore?.toString() ?? '', awayScore: fixture.awayScore?.toString() ?? '',
        result: fixture.result || '', notes: fixture.notes || '',
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.opponent || !form.branch || !form.date) { toast.error('Opponent, branch and date required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        homeScore: form.homeScore !== '' ? Number(form.homeScore) : null,
        awayScore: form.awayScore !== '' ? Number(form.awayScore) : null,
        result: form.result || null,
      };
      const res = await fetch(`/api/kuki-fc/fixtures/${id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Fixture updated!');
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const inputClass = `w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5';

  if (loading) return <div className="admin-layout"><AdminSidebar /><div className="flex-1 p-8"><div className="skeleton h-96 rounded-sm" /></div></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/control-panel-92x/kuki-fc/fixtures" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <h1 className="text-white font-display text-lg font-bold">Edit Fixture</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-6 lg:p-8 max-w-3xl space-y-5">
          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-4">
            <div>
              <label className={labelClass}>Opponent *</label>
              <input className={inputClass} value={form.opponent} onChange={set('opponent')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Branch *</label>
                <select className={inputClass} value={form.branch} onChange={set('branch')}>
                  <option value="">Select branch</option>
                  {branches.map(b => <option key={b._id} value={b.slug}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Competition</label>
                <input className={inputClass} value={form.competition} onChange={set('competition')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date & Time *</label>
                <input type="datetime-local" className={inputClass} value={form.date} onChange={set('date')} />
              </div>
              <div>
                <label className={labelClass}>Venue</label>
                <input className={inputClass} value={form.venue} onChange={set('venue')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Home / Away</label>
                <select className={inputClass} value={form.isHome ? 'home' : 'away'}
                  onChange={e => setForm(f => ({ ...f, isHome: e.target.value === 'home' }))}>
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} value={form.status} onChange={set('status')}>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            {form.status === 'completed' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Home Score</label>
                  <input type="number" className={inputClass} value={form.homeScore} onChange={set('homeScore')} />
                </div>
                <div>
                  <label className={labelClass}>Away Score</label>
                  <input type="number" className={inputClass} value={form.awayScore} onChange={set('awayScore')} />
                </div>
                <div>
                  <label className={labelClass}>Result</label>
                  <select className={inputClass} value={form.result} onChange={set('result')}>
                    <option value="">Select</option>
                    <option value="win">Win</option>
                    <option value="draw">Draw</option>
                    <option value="loss">Loss</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea className={`${inputClass} resize-none`} rows={2} value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
        
