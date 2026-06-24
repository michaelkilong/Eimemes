// app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Eimemes — Entertainment, Football, Culture',
  description: '“Eimi te adin, Eimems a um e!”.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        {/* Hero section that fills available space */}
        <section className="relative flex-1 flex items-center bg-[#0f172a] text-white overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://i.ibb.co/TqdxHX30/19-E99952-7134-413-C-A16-A-B9828878-C15-C.webp')",
            }}
          />

          {/* Fading gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="container relative z-10 text-center max-w-4xl mx-auto py-16">
            <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-5">
              Welcome to
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-none mb-6">
              Eimemes
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              A digital platform built for and by Eimi youths. Founded in 2025 and wholly owned
              by <strong>Eimeme Pvt Ltd</strong>, we exist to entertain, uplift, and connect a
              generation that deserves its own space on the internet. From memes that hit too
              close to home to content that genuinely guides and inspires — we cover what matters
              to young Eimi people with humour, heart, and zero filter.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center w-48 h-12 text-base font-semibold rounded-sm transition-colors bg-[#d97706] text-white hover:bg-[#b45309] leading-none"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-48 h-12 text-base font-semibold rounded-sm transition-colors bg-white text-[#0f172a] hover:bg-slate-200 leading-none"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
