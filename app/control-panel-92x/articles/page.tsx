'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Star, StarOff, Search } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [role, setRole]         = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const authRes  = await fetch('/api/auth', { credentials: 'include' });
      const authData = await authRes.json();
      if (!authRes.ok) { router.push('/control-panel-92x'); return; }
      setRole(authData.user?.role || '');
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res  = await fetch(`/api/articles?${params}&limit=50`, { credentials: 'include' });
      const data = await res.json();
      setArticles(data.articles || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Article deleted');
      setArticles(prev => prev.filter(a => a._id !== id));
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleStatus = async (article: any) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/articles/${article._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setArticles(prev => prev.map(a => a._id === article._id ? data.article : a));
      toast.success(newStatus === 'published' ? 'Published!' : 'Moved to draft');
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleFeatured = async (article: any) => {
    const res = await fetch(`/api/articles/${article._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !article.featured }),
    });
    if (res.ok) {
      const data = await res.json();
      setArticles(prev => prev.map(a => a._id === article._id ? data.article : a));
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Articles</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{articles.length} total</p>
          </div>
          <Link href="/control-panel-92x/articles/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> New Article
          </Link>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] font-mono"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${
                    filter === f ? 'bg-[#d97706] text-white' : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400 hover:border-[#d97706]'
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">No articles found</p>
                <Link href="/control-panel-92x/articles/new" className="btn-primary text-xs">
                  <Plus size={13} /> Create your first article
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1e2433]">
                {filtered.map(article => (
                  <div key={article._id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      {article.featured && <Star size={13} className="text-[#d97706] flex-shrink-0 mt-0.5" />}
                      <span className="text-sm text-slate-200 font-medium flex-1">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-slate-500 font-mono">{article.category}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500 font-mono">{article.views || 0} views</span>
                      <button onClick={() => toggleStatus(article)}>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
                          article.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-700/40 text-slate-400 border border-slate-600/20'
                        }`}>{article.status}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {role === 'superadmin' && (
                        <button onClick={() => toggleFeatured(article)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono border transition-all ${
                            article.featured ? 'border-[#d97706]/40 text-[#d97706] bg-[#d97706]/10' : 'border-[#2a2f3d] text-slate-500'
                          }`}>
                          {article.featured ? <StarOff size={12} /> : <Star size={12} />}
                          {article.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}
                      {article.status === 'published' && (
                        <a href={`/article/${article.slug}`} target="_blank"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono border border-[#2a2f3d] text-slate-400 hover:text-white transition-all">
                          <Eye size={12} /> View
                        </a>
                      )}
                      <Link href={`/control-panel-92x/articles/${article._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono border border-[#2a2f3d] text-slate-400 hover:text-[#d97706] hover:border-[#d97706]/40 transition-all">
                        <Edit2 size={12} /> Edit
                      </Link>
                      {role === 'superadmin' && (
                        <button onClick={() => handleDelete(article._id, article.title)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono border border-[#2a2f3d] text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
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
