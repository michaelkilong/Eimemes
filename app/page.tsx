// app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FeaturedArticle, ArticleCard } from '@/components/articles/ArticleCard';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';

export const metadata: Metadata = {
  title: 'Eimemes — Entertainment, Football, Culture',
  description: '“Eimi te adin, Eimems a um e!”.',
};

export const revalidate = 60; // ISR: revalidate every 60s

async function getArticles() {
  try {
    await connectDB();
    const featured = await Article.findOne({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .lean();
    const latest = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(9)
      .select('-content')
      .lean();
    return { featured: featured ?? null, latest: latest ?? [] };
  } catch {
    return { featured: null, latest: [] };
  }
}

export default async function HomePage() {
  const { featured, latest } = await getArticles();
  const hasContent = latest.length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {hasContent ? (
          /* ─── POPULATED STATE ──────────────────────────────────────── */
          <div className="container py-10">
            {/* Featured article */}
            {featured && (
              <FeaturedArticle article={JSON.parse(JSON.stringify(featured))} />
            )}

            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-display font-bold text-[#0f172a] pl-4 border-l-4 border-[#d97706]"
              >
                Latest from the Newsroom
              </h2>
              <Link href="/blogs" className="text-xs text-[#d97706] font-semibold flex items-center gap-1 hover:gap-2 transition-all font-mono">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {latest.slice(0, 6).map((article, i) => (
                <div
                  key={article._id.toString()}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <ArticleCard article={JSON.parse(JSON.stringify(article))} />
                </div>
              ))}
            </div>

            {/* Second row */}
            {latest.length > 6 && (
              <>
                <h2 className="text-xl font-display font-bold text-[#0f172a] pl-4 border-l-4 border-[#d97706] mb-6">
                  More Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latest.slice(6, 9).map((article) => (
                    <ArticleCard key={article._id.toString()} article={JSON.parse(JSON.stringify(article))} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* ─── EMPTY / BRAND STATE ──────────────────────────────────── */
          <EmptyHomepage />
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyHomepage() {
  return (
    <section className="relative text-white py-24 md:py-40 min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/TqdxHX30/19-E99952-7134-413-C-A16-A-B9828878-C15-C.webp')",
        }}
      />

      {/* Fading gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="container relative z-10 text-center max-w-3xl mx-auto">
        <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-5">
          Welcome to
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-black leading-none mb-6">
          Eimemes
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          A digital platform built for and by Eimi youths. Founded in 2025 and wholly owned
          by <strong>Eimeme Pvt Ltd</strong>, we exist to entertain, uplift, and connect a
          generation that deserves its own space on the internet. From memes that hit too
          close to home to content that genuinely guides and inspires — we cover what matters
          to young Eimi people with humour, heart, and zero filter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/about" className="btn-primary text-base px-7 py-3">
            Our Story
          </Link>
          <Link
            href="/contact"
            className="btn-ghost text-base px-7 py-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
