// app/articles/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FeaturedArticle, ArticleCard } from '@/components/articles/ArticleCard';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';

export const metadata: Metadata = {
  title: 'Articles — Eimemes',
  description: 'Latest articles, features, and stories from Eimemes.',
};

export const revalidate = 60;

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

export default async function ArticlesPage() {
  const { featured, latest } = await getArticles();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container py-10">
          {/* Featured article */}
          {featured && (
            <FeaturedArticle article={JSON.parse(JSON.stringify(featured))} />
          )}

          {/* If no articles at all */}
          {latest.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-[#0f172a] mb-3">No articles yet</p>
              <p className="text-[#6b7280] text-sm">
                Check back soon for fresh stories and updates.
              </p>
            </div>
          ) : (
            <>
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-[#0f172a] pl-4 border-l-4 border-[#d97706]">
                  Latest from the Newsroom
                </h2>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
