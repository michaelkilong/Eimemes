'use client';
// app/control-panel-92x/articles/new/page.tsx
// This file is shared via dynamic route; same component handles create + edit
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { ArrowLeft, Save, Eye, Upload, X, Star, StarOff } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="skeleton h-96 rounded-sm" />,
});

const CATEGORIES = [
  'Football', 'Local', 'Media', 'Fan Culture', 'Transfers',
  'Analysis', 'Opinion', 'Culture', 'Club News', 'Interview',
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: 'Football',
  author: 'Eimemes Desk',
  coverImage: '',
  status: 'draft' as 'draft' | 'published',
  featured: false,
  tags: '',
  seoTitle: '',
  seoDescription: '',
};

export default function ArticleEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params?.id && params.id !== 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load existing article for edit
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetch(`/api/articles/${params.id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.article) {
          const a = d.article;
          setForm({
            title: a.title || '',
            slug: a.slug || '',
            summary: a.summary || '',
            content: a.content || '',
            category: a.category || 'Football',
            author: a.author || 'Eimemes Desk',
            coverImage: a.coverImage || '',
            status: a.status || 'draft',
            featured: a.featured || false,
            tags: (a.tags || []).join(', '),
            seoTitle: a.seoTitle || '',
            seoDescription: a.seoDescription || '',
          });
          setSlugManuallyEdited(true);
        }
      })
      .catch(() => toast.error('Failed to load article'))
      .finally(() => setLoading(false));
  }, [isEdit]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(f => ({
      ...f,
      title,
      slug: slugManuallyEdited ? f.slug : slugify(title, { lower: true, strict: true }),
    }));
  };

  const set = (key: keyof typeof EMPTY_FORM) =>
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
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(f => ({ ...f, coverImage: data.url }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async (publishNow = false) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.summary.trim()) { toast.error('Summary is required'); return; }
    if (!form.content || form.content === '<p></p>') { toast.error('Content is required'); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        status: publishNow ? 'published' : form.status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url   = isEdit ? `/api/articles/${params.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      toast.success(publishNow ? 'Published!' : 'Saved as draft');
      if (!isEdit) router.push('/control-panel-92x/articles');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white
    placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5';

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="skeleton h-12 w-64 mb-6 rounded-sm" />
          <div className="skeleton h-96 rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="border-b border-[#1e2433] bg-[#13171f] px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/control-panel-92x/articles"
              className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-white font-display text-lg font-bold">
                {isEdit ? 'Edit Article' : 'New Article'}
              </h1>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                form.status === 'published' ? 'text-emerald-400' : 'text-slate-500'
              }`}>{form.status}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {form.status === 'published' && form.slug && (
              <a href={`/article/${form.slug}`} target="_blank"
                className="btn-ghost text-xs py-2 px-3 border-[#2a2f3d] text-slate-400">
                <Eye size={13} /> Preview
              </a>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn-ghost text-xs py-2 px-3 border-[#2a2f3d] text-slate-300 disabled:opacity-50"
            >
              <Save size={13} /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn-primary text-xs py-2 px-4 disabled:opacity-50"
            >
              {form.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="xl:col-span-2 space-y-5">
            {/* Title */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Article Title *</label>
              <input
                className={`${inputClass} text-lg font-display`}
                placeholder="Enter a compelling headline..."
                value={form.title}
                onChange={handleTitleChange}
              />
              <div className="mt-3">
                <label className={labelClass}>URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">/article/</span>
                  <input
                    className={`${inputClass} flex-1`}
                    value={form.slug}
                    onChange={e => { setSlugManuallyEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Summary / Deck *</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="A one or two sentence summary shown in article cards and meta tags..."
                value={form.summary}
                onChange={set('summary')}
                maxLength={300}
              />
              <p className="text-[10px] text-slate-600 font-mono mt-1 text-right">
                {form.summary.length}/300
              </p>
            </div>

            {/* Rich text editor */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <label className={labelClass}>Article Body *</label>
              <div className="mt-1">
                <RichTextEditor
                  content={form.content}
                  onChange={html => setForm(f => ({ ...f, content: html }))}
                  placeholder="Start writing your article..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Publish Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} value={form.status} onChange={set('status')}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select className={inputClass} value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Author</label>
                  <input className={inputClass} value={form.author} onChange={set('author')} />
                </div>

                {/* Featured toggle */}
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm border text-sm transition-all ${
                    form.featured
                      ? 'border-[#d97706]/40 bg-[#d97706]/10 text-[#d97706]'
                      : 'border-[#2a2f3d] text-slate-400 hover:border-[#d97706]/30'
                  }`}
                >
                  <span className="font-mono text-xs">Featured article</span>
                  {form.featured ? <Star size={14} /> : <StarOff size={14} />}
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Cover Image</h3>

              {form.coverImage ? (
                <div className="relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover" className="w-full h-36 object-cover rounded-sm" />
                  <button
                    onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : null}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2.5 disabled:opacity-50"
              >
                <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload image'}
              </button>

              <div className="mt-3">
                <label className={labelClass}>Or paste URL</label>
                <input
                  className={inputClass}
                  placeholder="https://..."
                  value={form.coverImage}
                  onChange={set('coverImage')}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Tags</h3>
              <input
                className={inputClass}
                placeholder="football, kuki-fc, grassroots"
                value={form.tags}
                onChange={set('tags')}
              />
              <p className="text-[10px] text-slate-600 font-mono mt-1">Comma separated</p>
            </div>

            {/* SEO */}
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">SEO</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>SEO Title</label>
                  <input className={inputClass} placeholder="Overrides article title in search" value={form.seoTitle} onChange={set('seoTitle')} />
                </div>
                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Search result description..." value={form.seoDescription} onChange={set('seoDescription')} maxLength={160} />
                  <p className="text-[10px] text-slate-600 font-mono mt-1 text-right">{form.seoDescription.length}/160</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
