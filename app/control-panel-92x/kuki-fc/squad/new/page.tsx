'use client';
// app/control-panel-92x/kuki-fc/squad/new/page.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Manager', 'Coach'];
const EMPTY = { name: '', position: 'Midfielder', number: '', nationality: 'Indian', age: '', branch: '', bio: '', photo: '', isCaptain: false };

export default function NewPlayerPage() {
  const router = useRouter();
  const [form, setForm]       = useState(EMPTY);
  const [branches, setBranches] = useState<any[]>([]);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/kuki-fc/branches', { credentials: 'include' })
      .then(r => r.json()).then(d => setBranches(d.branches || []));
  }, []);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      setForm(f => ({ ...f, photo: data.url }));
      toast.success('Photo uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.position || !form.branch) { toast.error('Name, position and branch required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/kuki-fc/players', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, number: Number(form.number) || 0, age: Number(form.age) || 0 }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Player added!');
      router.push('/control-panel-92x/kuki-fc/squad');
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const inputClass = `w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5';

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/control-panel-92x/kuki-fc/squad" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <h1 className="text-white font-display text-lg font-bold">Add Player</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Player'}
          </button>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-5xl">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input className={inputClass} placeholder="Player name" value={form.name} onChange={set('name')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Position *</label>
                  <select className={inputClass} value={form.position} onChange={set('position')}>
                    {POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Branch *</label>
                  <select className={inputClass} value={form.branch} onChange={set('branch')}>
                    <option value="">Select branch</option>
                    {branches.map(b => <option key={b._id} value={b.slug}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Shirt Number</label>
                  <input type="number" className={inputClass} placeholder="10" value={form.number} onChange={set('number')} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" className={inputClass} placeholder="22" value={form.age} onChange={set('age')} />
                </div>
                <div>
                  <label className={labelClass}>Nationality</label>
                  <input className={inputClass} placeholder="Indian" value={form.nationality} onChange={set('nationality')} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea className={`${inputClass} resize-none`} rows={3}
                  placeholder="Short player bio..." value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, isCaptain: !f.isCaptain }))}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sm border text-sm transition-all ${
                  form.isCaptain ? 'border-[#d97706]/40 bg-[#d97706]/10 text-[#d97706]' : 'border-[#2a2f3d] text-slate-400'
                }`}
              >
                <span className="font-mono text-xs">Captain</span>
                <span className={`w-4 h-4 rounded-sm border flex items-center justify-center ${form.isCaptain ? 'bg-[#d97706] border-[#d97706]' : 'border-[#2a2f3d]'}`}>
                  {form.isCaptain && <span className="text-white text-[10px]">✓</span>}
                </span>
              </button>
            </div>
          </div>

          <div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Player Photo</h3>
              {form.photo && (
                <div className="relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.photo} alt="" className="w-32 h-32 object-cover rounded-full mx-auto" />
                  <button onClick={() => setForm(f => ({ ...f, photo: '' }))}
                    className="absolute top-0 right-8 bg-black/70 text-white rounded-full p-1 hover:bg-red-500">
                    <X size={12} />
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 mb-3 disabled:opacity-50">
                <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <label className={labelClass}>Or paste URL</label>
              <input className={inputClass} placeholder="https://..." value={form.photo} onChange={set('photo')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
