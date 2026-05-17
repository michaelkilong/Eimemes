'use client';
// app/control-panel-92x/kuki-fc/branches/[id]/page.tsx
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const EMPTY = { name: '', slug: '', city: '', description: '', founded: '', stadium: '', manager: '', logo: '', coverImage: '', active: true };

export default function EditBranchPage() {
  const { id } = useParams() as { id: string };
  const router  = useRouter();
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const logoRef  = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/kuki-fc/branches/${id}`, { credentials: 'include' })
      .then(r => r.json()).then(d => {
        if (d.branch) setForm({
          name: d.branch.name || '', slug: d.branch.slug || '',
          city: d.branch.city || '', description: d.branch.description || '',
          founded: d.branch.founded || '', stadium: d.branch.stadium || '',
          manager: d.branch.manager || '', logo: d.branch.logo || '',
          coverImage: d.branch.coverImage || '', active: d.branch.active ?? true,
        });
      }).finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(field);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      setForm(f => ({ ...f, [field]: data.url }));
      toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(null); }
  };

  const handleSave = async () => {
    if (!form.name || !form.city) { toast.error('Name and city required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/kuki-fc/branches/${id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Branch updated!');
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
            <Link href="/control-panel-92x/kuki-fc/branches" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <h1 className="text-white font-display text-lg font-bold">Edit Branch</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-5xl">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-4">
              <div>
                <label className={labelClass}>Branch Name *</label>
                <input className={inputClass} value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className={labelClass}>URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">/kuki-fc/</span>
                  <input className={`${inputClass} flex-1`} value={form.slug} onChange={set('slug')} />
                </div>
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input className={inputClass} value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} resize-none`} rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Founded</label>
                <input className={inputClass} value={form.founded} onChange={set('founded')} />
              </div>
              <div>
                <label className={labelClass}>Stadium</label>
                <input className={inputClass} value={form.stadium} onChange={set('stadium')} />
              </div>
              <div>
                <label className={labelClass}>Manager</label>
                <input className={inputClass} value={form.manager} onChange={set('manager')} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Status</h3>
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm border text-sm transition-all ${
                  form.active ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-[#2a2f3d] text-slate-400'
                }`}>
                <span className="font-mono text-xs">Active Branch</span>
                <span>{form.active ? '✓' : '✗'}</span>
              </button>
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Club Logo</h3>
              {form.logo && (
                <div className="relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.logo} alt="" className="w-24 h-24 object-cover rounded-full mx-auto" />
                  <button onClick={() => setForm(f => ({ ...f, logo: '' }))}
                    className="absolute top-0 right-8 bg-black/70 text-white rounded-full p-1 hover:bg-red-500"><X size={12} /></button>
                </div>
              )}
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'logo')} />
              <button onClick={() => logoRef.current?.click()} className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2 mb-2" disabled={uploading === 'logo'}>
                <Upload size={13} /> {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
              </button>
              <input className={`${inputClass} text-xs`} placeholder="Or paste URL" value={form.logo} onChange={set('logo')} />
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Cover Image</h3>
              {form.coverImage && (
                <div className="relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="" className="w-full h-32 object-cover rounded-sm" />
                  <button onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500"><X size={12} /></button>
                </div>
              )}
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'coverImage')} />
              <button onClick={() => coverRef.current?.click()} className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2 mb-2" disabled={uploading === 'coverImage'}>
                <Upload size={13} /> {uploading === 'coverImage' ? 'Uploading...' : 'Upload Cover'}
              </button>
              <input className={`${inputClass} text-xs`} placeholder="Or paste URL" value={form.coverImage} onChange={set('coverImage')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      
