'use client';
// app/control-panel-92x/gallery/page.tsx
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, Trash2, Plus, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface GalleryItem { _id: string; title: string; caption: string; imageUrl: string; category: string; status: string; }

const EMPTY_FORM = { title: '', caption: '', imageUrl: '', category: 'General', status: 'published' };

export default function AdminGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/gallery', { credentials: 'include' });
    if (!res.ok) { router.push('/control-panel-92x'); return; }
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      setForm(f => ({ ...f, imageUrl: data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAdd = async () => {
    if (!form.title || !form.imageUrl) { toast.error('Title and image are required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add');
      toast.success('Item added');
      setShowForm(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Deleted'); setItems(prev => prev.filter(i => i._id !== id)); }
  };

  const toggleStatus = async (item: GalleryItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/gallery/${item._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setItems(prev => prev.map(i => i._id === item._id ? { ...i, status: newStatus } : i));
  };

  const inputClass = `w-full bg-[#0d0f14] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5';

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Gallery</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{items.length} items</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="p-8">
          {/* Add form modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
              <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-display text-lg font-bold">Add Gallery Item</h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Title *</label>
                    <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Match action photo..." />
                  </div>
                  <div>
                    <label className={labelClass}>Caption</label>
                    <input className={inputClass} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Player celebrating goal..." />
                  </div>
                  <div>
                    <label className={labelClass}>Image *</label>
                    {form.imageUrl ? (
                      <div className="relative mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.imageUrl} alt="" className="w-full h-40 object-cover rounded-sm" />
                        <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500"><X size={12} /></button>
                      </div>
                    ) : null}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <button onClick={() => fileRef.current?.click()} className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 mb-2" disabled={uploading}>
                      <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload image'}
                    </button>
                    <input className={inputClass} placeholder="Or paste image URL..." value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Category</label>
                      <input className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowForm(false)} className="btn-ghost border-[#2a2f3d] text-slate-400 text-sm py-2.5 flex-1">Cancel</button>
                    <button onClick={handleAdd} disabled={saving} className="btn-primary text-sm py-2.5 flex-1 justify-center disabled:opacity-50">
                      {saving ? 'Adding...' : 'Add to Gallery'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-48 rounded-sm" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 font-mono text-sm mb-4">No gallery items yet</p>
              <button onClick={() => setShowForm(true)} className="btn-primary text-xs"><Plus size={13} /> Add first item</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <div key={item._id} className="group relative bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => toggleStatus(item)} className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm border ${item.status === 'published' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-slate-400 border-slate-600/40 bg-slate-700/20'}`}>
                      {item.status}
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/20 border border-red-500/30 rounded-sm text-red-400 hover:bg-red-500/30 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-300 font-medium truncate">{item.title}</p>
                    {item.caption && <p className="text-[10px] text-slate-600 truncate mt-0.5">{item.caption}</p>}
                    <p className="text-[10px] text-slate-600 font-mono mt-1">{item.category}</p>
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
