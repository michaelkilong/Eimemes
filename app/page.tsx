// app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Newspaper, PenLine, Users } from 'lucide-react';
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
          /* ─── EMPTY / ABOUT STATE ──────────────────────────────────── */
          <EmptyHomepage />
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyHomepage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0f172a] text-white py-24 md:py-36 relative overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%), repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-5">
                      </p>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-none mb-6">
            Eimemes
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            "EIMEMES - bringing Eimi Youth closer"
            
            Join us for all the juicy gossip, entertainment, trolls, memes, motivational messages, news (not a news channel though), laughter and much more. Let’s address the elephant in the room as well.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-primary text-base px-7 py-3">
              Our Story
            </Link>
            <Link href="/contact" className="btn-ghost text-base px-7 py-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Newspaper size={28} className="text-[#d97706]" />,
              title: 'Original Reporting',
              body: 'On-the-ground stories from local leagues, community clubs, and the people who make grassroots sport thrive.',
            },
            {
              icon: <PenLine size={28} className="text-[#d97706]" />,
              title: 'Opinion & Longform',
              body: 'Thoughtful essays and cultural criticism exploring what sport means to the communities that live it.',
            },
            {
              icon: <Users size={28} className="text-[#d97706]" />,
              title: 'Community First',
              body: 'Amplifying voices from the terraces, the training pitches, and the fan communities that drive real football.',
            },
          ].map(({ icon, title, body }, i) => (
            <div
              key={title}
              className="bg-white border border-[#e5e0d8] rounded-sm p-7 animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="font-display text-xl font-bold text-[#0f172a] mb-3">{title}</h3>
              <p className="text-sm text-[#4b4540] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="bg-[#fef9e6] border-y border-[#e5e0d8] py-16">
        <div className="container max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[#d97706] mb-4">About us</p>
          <h2 className="font-display text-3xl font-bold text-[#0f172a] mb-5">
            Wholly owned by Eimemes Pvt Ltd
          </h2>
          <p className="text-[#4b4540] leading-relaxed mb-8">
            Based in Mumbai, our team of journalists and contributors operate with full editorial independence.
            We are committed to factual storytelling, deep analysis, and elevating community voices —
            including the rise of Kuki FC.
          </p>
          <Link href="/about" className="btn-primary">
            Read our mission <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
