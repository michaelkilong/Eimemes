'use client';
// app/control-panel-92x/kuki-fc/shop/[id]/page.tsx
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const CATEGORIES = ['Apparel', 'Accessories', 'Footwear', 'Other'];
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const EMPTY = { name: '', slug: '', description: '', price: '', category: 'Apparel', whatsappNumber: '', inStock: true, featured: false, sizes: [] as string[], images: [] as string[] };

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/kuki-fc/products/${id}`, { credentials: 'include' })
      .then(r => r.json()).then(d => {
        if (d.product) setForm({
          name: d.product.name || '', slug: d.product.slug || '',
          description: d.product.description || '',
          price: d.product.price?.toString() || '',
          category: d.product.category || 'Apparel',
          whatsappNumber: d.product.whatsappNumber || '',
          inStock: d.product.inStock ?? true,
          featured: d.product.featured ?? false,
          sizes: d.product.sizes || [],
          images: d.product.images || [],
        });
      }).finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleSize = (size: string) =>
    setForm(f => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size] }));

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
      toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, imageUrl.trim()] }));
    setImageUrl('');
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.whatsappNumber) { toast.error('Name, price and WhatsApp required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/kuki-fc/products/${id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Product updated!');
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
            <Link href="/control-panel-92x/kuki-fc/shop" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <h1 className="text-white font-display text-lg font-bold">Edit Product</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-5xl">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-4">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input className={inputClass} value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">/kuki-fc/shop/</span>
                  <input className={`${inputClass} flex-1`} value={form.slug} onChange={set('slug')} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} resize-none`} rows={4} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (₹) *</label>
                  <input type="number" className={inputClass} value={form.price} onChange={set('price')} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select className={inputClass} value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number *</label>
                <input className={inputClass} placeholder="+91 98765 43210" value={form.whatsappNumber} onChange={set('whatsappNumber')} />
              </div>
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Sizes</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map(size => (
                  <button key={size} type="button" onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-sm text-xs font-mono border transition-all ${form.sizes.includes(size) ? 'bg-[#d97706] border-[#d97706] text-white' : 'border-[#2a2f3d] text-slate-400'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Images</label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-20 object-cover rounded-sm" />
                      <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">×</button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-[#d97706] text-white px-1 rounded-sm font-mono">Main</span>}
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 mb-3 disabled:opacity-50">
                <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <div className="flex gap-2">
                <input className={`${inputClass} flex-1`} placeholder="Or paste image URL" value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addImageUrl()} />
                <button onClick={addImageUrl} className="btn-ghost border-[#2a2f3d] text-slate-400 text-xs px-3"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-3">
              <h3 className={labelClass}>Settings</h3>
              <button onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm border text-sm transition-all ${form.inStock ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-[#2a2f3d] text-slate-400'}`}>
                <span className="font-mono text-xs">In Stock</span><span>{form.inStock ? '✓' : '✗'}</span>
              </button>
              <button onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm border text-sm transition-all ${form.featured ? 'border-[#d97706]/40 bg-[#d97706]/10 text-[#d97706]' : 'border-[#2a2f3d] text-slate-400'}`}>
                <span className="font-mono text-xs">Featured</span><span>{form.featured ? '★' : '☆'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
                                                                         
