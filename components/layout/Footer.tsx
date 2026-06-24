// components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 mt-0">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div>
            <h3 className="font-display text-white text-2xl font-bold mb-3">Eimemes</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Join the channel for all the juicy gossip, entertainment,
              trolls, memes, motivational messages, news (not a news channel though),
              laughter and much more. Let’s address the elephant in the room as well.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-mono">Navigate</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/',          label: 'Home' },
                { href: '/blogs',     label: 'Opinion & Blogs' },
                { href: '/gallery',   label: 'Gallery' },
                { href: '/kuki-fc',   label: 'Kuki FC' },
                { href: '/kuki-fc/shop', label: 'Kuki FC Shop' },
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
                  eimemeschatai@gmail.com
                </a>
              </li>
              <li className="text-slate-600">unavailable</li>
              <li className="text-slate-600">London, UK</li>
              <li>
                <a href="https://www.instagram.com/eimemes____?igsh=MXduZm5oc2p5ZWVhNA==" className="hover:text-[#d97706] transition-colors">
                  @eimemes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal — moved up from bottom bar */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-mono">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#d97706] transition-colors">
                  Editorial Ethics
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#d97706] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#d97706] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — now just copyright */}
        <div className="pt-6 text-center md:text-left text-xs text-slate-600">
          <span>© {new Date().getFullYear()} Eimemes Pvt Ltd. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
