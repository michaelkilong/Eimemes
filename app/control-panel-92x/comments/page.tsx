'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MessageCircle, Trash2, ExternalLink, Search } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Comment {
  _id: string;
  name: string;
  email: string;
  comment: string;
  postTitle: string;
  postSlug: string;
  postType: 'article' | 'blog';
  createdAt: string;
}

const timeAgo = (dateStr: string) => {
  try {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const mins  = Math.floor(diff / 60000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch { return ''; }
};

export default function CommentsAdminPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | 'article' | 'blog'>('all');

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });

    fetch('/api/comments', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/comments/${id}`, {
      method: 'DELETE', credentials: 'include'
    });
    if (res.ok) {
      toast.success('Deleted');
      setComments(prev => prev.filter(c => c._id !== id));
    } else {
      toast.error('Failed to delete');
    }
  };

  const filtered = comments.filter(c => {
    const matchesFilter = filter === 'all' || c.postType === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.comment.toLowerCase().includes(search.toLowerCase()) ||
      c.postTitle?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Comments</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{comments.length} total</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] font-mono"
                placeholder="Search comments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'article', 'blog'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide transition-all ${
                    filter === f
                      ? 'bg-[#d97706] text-white'
                      : 'bg-[#13171f] border border-[#2a2f3d] text-slate-400 hover:border-[#d97706]'
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
                <MessageCircle size={36} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 font-mono text-sm">No comments yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1e2433]">
                {filtered.map(c => (
                  <div key={c._id} className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-[#d97706]/20 text-[#d97706] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white text-sm font-medium">{c.name}</span>
                          <span className="text-slate-500 text-xs font-mono ml-2">{c.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-slate-600 font-mono">{timeAgo(c.createdAt)}</span>
                        <a
                          href={`/${c.postType === 'blog' ? 'blog' : 'article'}/${c.postSlug}`}
                          target="_blank"
                          className="p-1.5 text-slate-500 hover:text-white transition-colors"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed pl-11">{c.comment}</p>
                    <div className="pl-11 flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold ${
                        c.postType === 'article'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {c.postType}
                      </span>
                      <span className="text-xs text-slate-500 truncate">{c.postTitle}</span>
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
