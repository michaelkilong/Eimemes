'use client';
// app/control-panel-92x/dashboard/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, PenLine, Image as ImgIcon, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  articles:  { total: number; published: number; draft: number };
  blogs:     { total: number; published: number; draft: number };
  gallery:   number;
  messages:  { unread: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ articles: any[]; blogs: any[] }>({ articles: [], blogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    fetch('/api/auth').then(res => {
      if (!res.ok) router.push('/control-panel-92x');
    });

    // Load stats
    fetch('/api/stats', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setStats(d.stats);
        setRecent({ articles: d.recentArticles || [], blogs: d.recentBlogs || [] });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Articles', value: stats.articles.total, sub: `${stats.articles.published} published`, icon: <FileText size={20} />, color: 'text-blue-400', href: '/control-panel-92x/articles' },
    { label: 'Blog Posts',     value: stats.blogs.total,    sub: `${stats.blogs.published} published`,    icon: <PenLine size={20} />, color: 'text-emerald-400', href: '/control-panel-92x/blogs' },
    { label: 'Gallery Items',  value: stats.gallery,        sub: 'Published items',                       icon: <ImgIcon size={20} />, color: 'text-purple-400', href: '/control-panel-92x/gallery' },
    { label: 'Unread Messages',value: stats.messages.unread,sub: 'Awaiting response',                    icon: <MessageSquare size={20} />, color: 'text-amber-400', href: '/control-panel-92x/messages' },
  ] : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Dashboard</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">Overview of your content</p>
          </div>
          <div className="flex gap-3">
            <Link href="/control-panel-92x/articles/new" className="btn-primary text-xs py-2 px-4">
              <Plus size={14} /> New Article
            </Link>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#13171f] border border-[#1e2433] rounded-sm p-6 skeleton h-28" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map(({ label, value, sub, icon, color, href }) => (
                <Link key={label} href={href}
                  className="bg-[#13171f] border border-[#1e2433] rounded-sm p-6 hover:border-[#d97706]/40 transition-all group"
                >
                  <div className={`${color} mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-xs font-mono text-slate-500">{label}</div>
                  <div className="text-xs text-slate-600 mt-1">{sub}</div>
                </Link>
              ))}
            </div>
          )}

          {/* Recent content tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTable
              title="Recent Articles"
              items={recent.articles}
              href="/control-panel-92x/articles"
              type="article"
            />
            <RecentTable
              title="Recent Blog Posts"
              items={recent.blogs}
              href="/control-panel-92x/blogs"
              type="blog"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentTable({ title, items, href, type }: { title: string; items: any[]; href: string; type: string }) {
  return (
    <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e2433] flex items-center justify-between">
        <h2 className="text-white text-sm font-semibold font-mono">{title}</h2>
        <Link href={href} className="text-[#d97706] text-xs font-mono hover:text-amber-400">View all →</Link>
      </div>
      <div className="divide-y divide-[#1e2433]">
        {items.length === 0 ? (
          <p className="text-slate-600 text-xs font-mono text-center py-8">No content yet</p>
        ) : items.map((item: any) => (
          <div key={item._id} className="px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{item.title}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                {type === 'article' ? item.category : item.author} ·{' '}
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
      status === 'published'
        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
        : 'bg-slate-700/40 text-slate-400 border border-slate-600/20'
    }`}>
      {status}
    </span>
  );
}
