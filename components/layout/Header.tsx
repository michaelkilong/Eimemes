'use client';
// components/layout/Header.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/articles',  label: 'Articles' },
  { href: '/blogs',     label: 'Opinion' },
  { href: '/gallery',   label: 'Gallery' },
  { href: '/kuki-fc',   label: 'Kuki FC' },
  { href: '/about',     label: 'About' },
  { href: '/contact',   label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="relative">
      {/* Top strip – no border, only background */}
      <div className="bg-[#0f172a]">
        <div className="container flex items-center justify-between py-1.5">
          <span className="text-[11px] text-slate-400 font-mono tracking-wide uppercase">
            {/* optional tagline */}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
        </div>
      </div>

      {/* Logo + hamburger row – no border, just shadow */}
      <div className="shadow-sm">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="https://i.ibb.co/PzfH7bDM/C5717-A91-2593-4374-961-E-76-E18-F1322-DD.jpg"
              alt="Eimemes Logo"
              className="h-[2.4rem] w-[2.4rem] rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="font-display text-[2.4rem] font-black leading-none tracking-tight text-[#0f172a] group-hover:text-[#d97706] transition-colors duration-200">
                Eimemes
              </h1>
              <p className="text-[11px] text-[#6b7280] font-mono uppercase tracking-widest">
                “Eimi te adin, EIMEMES a um e!”
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:editorial@eimemes.com"
              className="hidden md:inline-block text-xs text-[#6b7280] hover:text-[#d97706] transition-colors font-mono"
            >
              editorial@eimemes.com
            </a>
            <button
              className="md:hidden p-2 rounded text-[#1e293b] hover:bg-[#f0ece4] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop navigation – no separator lines */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white shadow-sm">
        <div className="container flex items-center">
          <ul className="flex gap-0">
            {navLinks.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-5 py-3.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'border-b-2 border-[#d97706] text-[#d97706]'
                        : 'border-b-2 border-transparent text-[#4b5563] hover:text-[#1e293b] hover:border-transparent'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile menu – no separator lines */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 bg-white shadow-lg">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[#d97706] bg-[#fef9e6]'
                  : 'text-[#1e293b] hover:text-[#0f172a] hover:bg-[#f8f7f4]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
