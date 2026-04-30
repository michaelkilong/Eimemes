'use client';
// components/admin/AdminSidebar.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, FileText, PenLine, Image as ImgIcon,
  MessageSquare, LogOut, ExternalLink, ChevronLeft, Menu,
  Users, UserCircle, Shield,
} from 'lucide-react';
import clsx from 'clsx';

const BASE_NAV = [
  { href: '/control-panel-92x/dashboard', label: 'Dashboard', icon: LayoutDashboard, superOnly: false },
  { href: '/control-panel-92x/articles',  label: 'Articles',  icon: FileText,         superOnly: false },
  { href: '/control-panel-92x/blogs',     label: 'Blog Posts',icon: PenLine,          superOnly: false },
  { href: '/control-panel-92x/gallery',   label: 'Gallery',   icon: ImgIcon,          superOnly: true  },
  { href: '/control-panel-92x/messages',  label: 'Messages',  icon: MessageSquare,    superOnly: true  },
  { href: '/control-panel-92x/team',      label: 'Team',      icon: Users,            superOnly: true  },
];

export default function AdminSidebar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const [collapsed, setCollapsed]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole]     = useState<'superadmin' | 'writer' | null>(null);
  const [name, setName]     = useState('');
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) { setRole(d.user.role); setName(d.user.name); }
      });
    fetch('/api/stats', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUnread(d.stats?.messages?.unread ?? 0))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth', { method: 'DELETE' });
    toast.success('Signed out');
    router.push('/control-panel-92x');
  };

  const navItems = BASE_NAV.filter(item => !item.superOnly || role === 'superadmin');

  return (
    <aside className={clsx(
      'flex flex-col bg-[#13171f] border-r border-[#1e2433] transition-all duration-200 min-h-screen sticky top-0 flex-shrink-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1e2433]">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display text-white font-bold text-lg truncate">Eimemes</span>
            {role === 'superadmin' && (
              <Shield size={13} className="text-[#d97706] flex-shrink-0" />
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-slate-300 transition-colors ml-auto flex-shrink-0"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User pill */}
      {name && (
        <Link
          href="/control-panel-92x/account"
          className={clsx(
            'border border-[#1e2433] hover:border-[#2a2f3d] flex items-center gap-2.5 transition-all',
            collapsed ? 'mx-2 mt-3 p-2 rounded-sm justify-center' : 'mx-3 mt-3 px-3 py-2.5 rounded-sm'
          )}
        >
          <div className={clsx(
            'w-7 h-7 rounded-sm flex items-center justify-center font-bold text-sm flex-shrink-0',
            role === 'superadmin' ? 'bg-[#d97706]/20 text-[#d97706]' : 'bg-blue-500/15 text-blue-400'
          )}>
            {name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-medium truncate">{name}</p>
              <p className={clsx(
                'text-[10px] font-mono uppercase tracking-wide',
                role === 'superadmin' ? 'text-[#d97706]' : 'text-blue-400'
              )}>
                {role === 'superadmin' ? 'Super Admin' : 'Writer'}
              </p>
            </div>
          )}
        </Link>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 mt-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active     = pathname.startsWith(href);
          const isMessages = href.includes('messages');
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all relative border',
                active
                  ? 'bg-[#d97706]/15 text-[#d97706] border-[#d97706]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e2433] border-transparent'
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="font-mono text-xs flex-1">{label}</span>}
              {isMessages && unread > 0 && (
                <span className={clsx(
                  'bg-[#d97706] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center flex-shrink-0',
                  collapsed ? 'absolute -top-1 -right-1 w-4 h-4' : 'w-5 h-5'
                )}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1e2433] p-2 space-y-0.5">
        <Link
          href="/control-panel-92x/account"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all border',
            pathname.startsWith('/control-panel-92x/account')
              ? 'bg-[#d97706]/15 text-[#d97706] border-[#d97706]/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-[#1e2433] border-transparent'
          )}
        >
          <UserCircle size={17} className="flex-shrink-0" />
          {!collapsed && <span className="font-mono text-xs">My Account</span>}
        </Link>

        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-slate-500 hover:text-slate-300 hover:bg-[#1e2433] transition-all border border-transparent"
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          {!collapsed && <span className="font-mono text-xs">View site</span>}
        </a>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-50 border border-transparent"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="font-mono text-xs">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
