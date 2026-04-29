'use client';
// app/control-panel-92x/blogs/new/page.tsx
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="skeleton h-96 rounded-sm" />,
});

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  author: '', authorBio: '', coverImage: '',
  status: 'draft' as 'draft' | 'published', tags: '',
};

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(f => ({ ...f, title, slug: slugEdited ? f.slug : slugify(title, { lower: true, strict: true }) }));
  };

  const set = (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      setForm(f => ({ ...f, coverImage: data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (publish = false) => {
    if (!form.title || !form.excerpt || !form.author) { toast.error('Title, excerpt and author required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publish ? 'published' : form.status, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      toast.success(publish ? 'Published!' : 'Saved as draft');
      router.push('/control-panel-92x/blogs');
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
            <Link href="/control-panel-92x/blogs" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <h1 className="text-white font-display text-lg font-bold">New Blog Post</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-ghost text-xs py-2 px-3 border-[#2a2f3d] text-slate-300 disabled:opacity-50">
              <Save size={13} /> Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
              Publish
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Post Title *</label>
              <input className={`${inputClass} text-lg font-display`} placeholder="Blog post title..." value={form.title} onChange={handleTitleChange} />
              <div className="mt-3">
                <label className={labelClass}>URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">/blog/</span>
                  <input className={`${inputClass} flex-1`} value={form.slug} onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }} />
                </div>
              </div>
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Excerpt *</label>
              <textarea className={`${inputClass} resize-none`} rows={3} placeholder="A short excerpt for cards and previews..." value={form.excerpt} onChange={set('excerpt')} maxLength={500} />
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Post Body</label>
              <RichTextEditor content={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} placeholder="Write your post..." />
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Author</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input className={inputClass} placeholder="Rohan Mehta" value={form.author} onChange={set('author')} />
                </div>
                <div>
                  <label className={labelClass}>Bio</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Short author bio..." value={form.authorBio} onChange={set('authorBio')} />
                </div>
              </div>
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
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 mb-3">
                <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <label className={labelClass}>Or paste URL</label>
              <input className={inputClass} placeholder="https://..." value={form.coverImage} onChange={set('coverImage')} />
            </div>

            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className={labelClass}>Tags</h3>
              <input className={inputClass} placeholder="opinion, football, culture" value={form.tags} onChange={set('tags')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
