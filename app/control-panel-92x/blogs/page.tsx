'use client';
// app/control-panel-92x/blogs/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Search, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/blogs?${params}&limit=50`, { credentials: 'include' });
      if (!res.ok) { router.push('/control-panel-92x'); return; }
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Deleted'); setPosts(p => p.filter(b => b._id !== id)); }
    else toast.error('Delete failed');
  };

  const toggleStatus = async (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/blogs/${post._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(prev => prev.map(p => p._id === post._id ? data.post : p));
      toast.success(newStatus === 'published' ? 'Published!' : 'Moved to draft');
    }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Blog Posts</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{posts.length} total</p>
          </div>
          <Link href="/control-panel-92x/blogs/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> New Post
          </Link>
        </div>

        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] font-mono"
                placeholder="Search posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${
                    filter === f ? 'bg-[#d97706] text-white' : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400 hover:border-[#d97706] hover:text-white'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">No posts found</p>
                <Link href="/control-panel-92x/blogs/new" className="btn-primary text-xs">
                  <Plus size={13} /> Write your first post
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e2433]">
                    {['Title', 'Author', 'Read time', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2433]">
                  {filtered.map(post => (
                    <tr key={post._id} className="hover:bg-[#1a1f2b] transition-colors group">
                      <td className="px-5 py-3.5 max-w-xs">
                        <span className="text-sm text-slate-200 truncate block">{post.title}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{post.author}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock size={10} /> {post.readTime}m
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleStatus(post)}>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold cursor-pointer ${
                            post.status === 'published' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/40 text-slate-400 border border-slate-600/20'
                          }`}>{post.status}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {post.status === 'published' && (
                            <a href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-slate-500 hover:text-white">
                              <Eye size={14} />
                            </a>
                          )}
                          <Link href={`/control-panel-92x/blogs/${post._id}`} className="p-1.5 text-slate-500 hover:text-[#d97706]">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(post._id, post.title)} className="p-1.5 text-slate-500 hover:text-red-400">
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
