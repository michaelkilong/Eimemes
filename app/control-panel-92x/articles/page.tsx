'use client';
// app/control-panel-92x/articles/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Star, StarOff, Search } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatDistanceToNow } from 'date-fns';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/articles?${params}&limit=50`, { credentials: 'include' });
      if (!res.ok) { router.push('/control-panel-92x'); return; }
      const data = await res.json();
      setArticles(data.articles || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Article deleted');
      setArticles(prev => prev.filter(a => a._id !== id));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleStatus = async (article: any) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/articles/${article._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setArticles(prev => prev.map(a => a._id === article._id ? data.article : a));
      toast.success(`${newStatus === 'published' ? 'Published!' : 'Moved to draft'}`);
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
        {/* Topbar */}
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Articles</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{articles.length} total</p>
          </div>
          <Link href="/control-panel-92x/articles/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> New Article
          </Link>
        </div>

        <div className="p-8">
          {/* Filters */}
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
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${
                    filter === f
                      ? 'bg-[#d97706] text-white'
                      : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400 hover:border-[#d97706] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e2433]">
                    {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2433]">
                  {filtered.map(article => (
                    <tr key={article._id} className="hover:bg-[#1a1f2b] transition-colors group">
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="flex items-center gap-2">
                          {article.featured && <Star size={12} className="text-[#d97706] flex-shrink-0" />}
                          <span className="text-sm text-slate-200 truncate">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-400 font-mono">{article.category}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleStatus(article)}>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold cursor-pointer ${
                            article.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-700/40 text-slate-400 border border-slate-600/20'
                          }`}>
                            {article.status}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{article.views || 0}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                        {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title={article.featured ? 'Unfeature' : 'Feature'}
                            onClick={() => toggleFeatured(article)}
                            className={`p-1.5 rounded-sm transition-colors ${article.featured ? 'text-[#d97706]' : 'text-slate-500 hover:text-[#d97706]'}`}
                          >
                            {article.featured ? <Star size={14} /> : <StarOff size={14} />}
                          </button>
                          {article.status === 'published' && (
                            <a href={`/article/${article.slug}`} target="_blank"
                              className="p-1.5 rounded-sm text-slate-500 hover:text-white transition-colors">
                              <Eye size={14} />
                            </a>
                          )}
                          <Link href={`/control-panel-92x/articles/${article._id}`}
                            className="p-1.5 rounded-sm text-slate-500 hover:text-[#d97706] transition-colors">
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article._id, article.title)}
                            className="p-1.5 rounded-sm text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
