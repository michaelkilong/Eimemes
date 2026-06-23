'use client';
// components/layout/Header.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/blogs',    label: 'Opinion' },
  { href: '/gallery',  label: 'Gallery' },
  { href: '/kuki-fc',  label: 'Kuki FC' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
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
      {/* Top strip */}
      <div className="bg-[#0f172a] border-b border-white/10">
        <div className="container flex items-center justify-between py-1.5">
          <span className="text-[11px] text-slate-400 font-mono tracking-wide uppercase">
            {/* optional tagline */}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
        </div>
      </div>

      {/* Logo + hamburger row */}
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="group flex flex-col gap-0.5">
          <h1 className="font-display text-[2.4rem] font-black leading-none tracking-tight text-[#0f172a] group-hover:text-[#d97706] transition-colors duration-200">
            Eimemes
          </h1>
          <p className="text-[11px] text-[#6b7280] font-mono uppercase tracking-widest">
            “Eimi te adin, EIMEMES a um e!”
          </p>
        </Link>

        {/* Right side: desktop email / hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:editorial@eimemes.com"
            className="hidden md:inline-block text-xs text-[#6b7280] hover:text-[#d97706] transition-colors font-mono"
          >
            editorial@eimemes.com
          </a>

          {/* Hamburger – always visible on mobile, placed here */}
          <button
            className="md:hidden p-2 rounded text-[#1e293b] hover:bg-[#f0ece4] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Desktop nav – glassmorphism effect */}
      <nav className="hidden md:block sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-t border-b border-[#e5e0d8] shadow-sm">
        <div className="container flex items-center">
          <ul className="flex">
            {navLinks.map(({ href, label }) => {
              const active = href === '/'
                ? pathname === '/'
                : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-150 ${
                      active
                        ? 'border-[#d97706] text-[#d97706] font-semibold'
                        : 'border-transparent text-[#1e293b] hover:text-[#d97706] hover:border-[#d97706]'
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

      {/* Mobile menu – slides down from logo row, also glass */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 backdrop-blur-lg bg-white/90 border-b border-[#e5e0d8] shadow-lg">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-medium border-b border-[#f0ece4] ${
                pathname.startsWith(href)
                  ? 'text-[#d97706] bg-[#fef9e6]'
                  : 'text-[#1e293b]'
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
