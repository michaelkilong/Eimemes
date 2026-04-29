'use client';
// app/control-panel-92x/blogs/[id]/page.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="skeleton h-96 rounded-sm" />,
});

const EMPTY = { title: '', slug: '', excerpt: '', content: '', author: '', authorBio: '', coverImage: '', status: 'draft' as 'draft' | 'published', tags: '' };

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/blogs/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (!d.post) return;
        const p = d.post;
        setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, author: p.author, authorBio: p.authorBio || '', coverImage: p.coverImage || '', status: p.status, tags: (p.tags || []).join(', ') });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
    if (res.ok) { const data = await res.json(); setForm(f => ({ ...f, coverImage: data.url })); toast.success('Uploaded'); }
    setUploading(false);
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publish ? 'published' : form.status, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success(publish ? 'Published!' : 'Saved');
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
            <Link href="/control-panel-92x/blogs" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <div>
              <h1 className="text-white font-display text-lg font-bold">Edit Blog Post</h1>
              <span className={`text-[10px] font-mono uppercase ${form.status === 'published' ? 'text-emerald-400' : 'text-slate-500'}`}>{form.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {form.status === 'published' && (
              <a href={`/blog/${form.slug}`} target="_blank" className="btn-ghost text-xs py-2 px-3 border-[#2a2f3d] text-slate-400"><Eye size={13} /> View</a>
            )}
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-ghost text-xs py-2 px-3 border-[#2a2f3d] text-slate-300"><Save size={13} /> Save</button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-xs py-2 px-4">{form.status === 'published' ? 'Update' : 'Publish'}</button>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Title</label>
              <input className={`${inputClass} text-lg font-display`} value={form.title} onChange={set('title')} />
              <div className="mt-3">
                <label className={labelClass}>Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">/blog/</span>
                  <input className={`${inputClass} flex-1`} value={form.slug} onChange={set('slug')} />
                </div>
              </div>
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Excerpt</label>
              <textarea className={`${inputClass} resize-none`} rows={3} value={form.excerpt} onChange={set('excerpt')} />
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Content</label>
              <RichTextEditor content={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5 space-y-3">
              <h3 className={labelClass}>Author</h3>
              <input className={inputClass} value={form.author} onChange={set('author')} placeholder="Author name" />
              <textarea className={`${inputClass} resize-none`} rows={2} value={form.authorBio} onChange={set('authorBio')} placeholder="Author bio" />
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Status</h3>
              <select className={inputClass} value={form.status} onChange={set('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Cover Image</h3>
              {form.coverImage && (
                <div className="relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="" className="w-full h-36 object-cover rounded-sm" />
                  <button onClick={() => setForm(f => ({ ...f, coverImage: '' }))} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500"><X size={12} /></button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 mb-3"><Upload size={13} /> Upload</button>
              <input className={inputClass} placeholder="Or paste URL" value={form.coverImage} onChange={set('coverImage')} />
            </div>
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Tags</h3>
              <input className={inputClass} value={form.tags} onChange={set('tags')} placeholder="comma, separated" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
