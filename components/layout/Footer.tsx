// components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div>
            <h3 className="font-display text-white text-2xl font-bold mb-3">Eimemes</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              “EIMEMES - bring all Eimi Youths closer!”
              Join the channel for all the juicy gossip, entertainment, trolls,
              memes, motivational messages, news (not a news channel though),
              laughter and much more. Let’s address the elephant in the room as well.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-mono">Navigate</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/',        label: 'Home' },
                { href: '/blogs',   label: 'Opinion & Blogs' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/about',   label: 'About Eimemes' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#d97706] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-mono">Get in touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:eimemeschatai@gmail.com" className="hover:text-[#d97706] transition-colors">
                  eimemesschatai@gmail.com
                </a>
              </li>
              <li className="text-slate-600"> unavailable</li>
              <li className="text-slate-600">London, UK </li>
              <li>
                <a href="https://twitter.com/eimemes" className="hover:text-[#d97706] transition-colors">
                  @eimemes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} EimemesnPvt Ltd. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-slate-400 transition-colors">Editorial Ethics</Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
