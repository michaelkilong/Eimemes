'use client';
// app/control-panel-92x/kuki-fc/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Calendar, ShoppingBag, MapPin, Plus } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function KukiFCAdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ branches: 0, players: 0, fixtures: 0, products: 0 });

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });

    Promise.all([
      fetch('/api/kuki-fc/branches', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/players', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/fixtures', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/kuki-fc/products', { credentials: 'include' }).then(r => r.json()),
    ]).then(([b, p, f, pr]) => {
      setStats({
        branches: b.branches?.length || 0,
        players:  p.players?.length  || 0,
        fixtures: f.fixtures?.length || 0,
        products: pr.products?.length || 0,
      });
    }).catch(() => {});
  }, []);

  const sections = [
    {
      title: 'Branches',
      count: stats.branches,
      icon: <MapPin size={22} />,
      color: 'text-amber-400',
      href: '/control-panel-92x/kuki-fc/branches',
      newHref: '/control-panel-92x/kuki-fc/branches/new',
      desc: 'Manage Kuki FC branches',
    },
    {
      title: 'Squad',
      count: stats.players,
      icon: <Users size={22} />,
      color: 'text-blue-400',
      href: '/control-panel-92x/kuki-fc/squad',
      newHref: '/control-panel-92x/kuki-fc/squad/new',
      desc: 'Add and manage players',
    },
    {
      title: 'Fixtures',
      count: stats.fixtures,
      icon: <Calendar size={22} />,
      color: 'text-emerald-400',
      href: '/control-panel-92x/kuki-fc/fixtures',
      newHref: '/control-panel-92x/kuki-fc/fixtures/new',
      desc: 'Schedule and results',
    },
    {
      title: 'Shop',
      count: stats.products,
      icon: <ShoppingBag size={22} />,
      color: 'text-purple-400',
      href: '/control-panel-92x/kuki-fc/shop',
      newHref: '/control-panel-92x/kuki-fc/shop/new',
      desc: 'Manage merchandise',
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4">
          <h1 className="text-white font-display text-xl font-bold">Kuki FC</h1>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Manage the club</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {sections.map(({ title, count, icon, color, href, newHref, desc }) => (
              <div key={title} className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
                <div className={`${color} mb-3`}>{icon}</div>
                <p className="text-3xl font-bold text-white mb-1">{count}</p>
                <p className="text-xs font-mono text-slate-500 mb-4">{title}</p>
                <p className="text-xs text-slate-600 mb-4">{desc}</p>
                <div className="flex gap-2">
                  <Link href={href}
                    className="flex-1 text-center text-xs font-mono py-2 border border-[#2a2f3d] text-slate-400 hover:border-[#d97706] hover:text-[#d97706] rounded-sm transition-all">
                    Manage
                  </Link>
                  <Link href={newHref}
                    className="px-3 py-2 bg-[#d97706] text-white rounded-sm text-xs hover:bg-[#b45309] transition-colors">
                    <Plus size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/kuki-fc" target="_blank" className="btn-ghost border-[#2a2f3d] text-slate-400 text-xs">
                View Kuki FC Hub ↗
              </Link>
              <Link href="/kuki-fc/shop" target="_blank" className="btn-ghost border-[#2a2f3d] text-slate-400 text-xs">
                View Shop ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      
