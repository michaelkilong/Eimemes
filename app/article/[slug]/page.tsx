// app/article/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArticleCard } from '@/components/articles/ArticleCard';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import { getComments } from '@/app/actions/comments';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const article = await Article.findOne({ slug: params.slug, status: 'published' }).lean();
    if (!article) return { title: 'Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eimemes.vercel.app';
    const ogImage = article.coverImage
      ? article.coverImage.startsWith('http')
        ? article.coverImage
        : `${siteUrl}${article.coverImage}`
      : `${siteUrl}/og-default.png`;

    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        type: 'article',
        url: `${siteUrl}/article/${article.slug}`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [ogImage],
      },
    };
  } catch { return { title: 'Article' }; }
}

export const revalidate = 60;

async function getArticle(slug: string) {
  try {
    await connectDB();
    const article = await Article.findOne({ slug, status: 'published' }).lean();
    const related = article
      ? await Article.find({
          status: 'published',
          category: article.category,
          _id: { $ne: article._id },
        }).limit(3).select('-content').lean()
      : [];
    const comments = article
      ? await getComments(article._id.toString())
      : [];
    return { article: article ?? null, related, comments };
  } catch {
    return { article: null, related: [], comments: [] };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { article, related, comments } = await getArticle(params.slug);
  if (!article) notFound();

  const serialized = JSON.parse(JSON.stringify(article));
  const imgSrc = serialized.coverImage || `https://placehold.co/1200x600/0f172a/white?text=Eimemes`;
  const dateStr = serialized.publishedAt
    ? new Date(serialized.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  return (
    <>
      <Header />
      <main>
        {/* Hero image */}
        <div className="relative w-full bg-[#0f172a]" style={{ height: '480px' }}>
          <Image
            src={imgSrc} alt={serialized.title} fill
            className="object-cover opacity-80" priority sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <Link href="/"
                className="inline-flex items-center gap-1.5 text-white/60 text-xs hover:text-white mb-4 font-mono transition-colors">
                <ArrowLeft size={12} /> Home
              </Link>
              <span className="block text-[#d97706] font-mono text-xs uppercase tracking-widest mb-3">
                {serialized.category}
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                {serialized.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Meta bar */}
        <div className="border-b border-[#e5e0d8] bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center gap-5 text-xs text-[#6b7280] font-mono">
            <span>By <strong className="text-[#0f172a]">{serialized.author}</strong></span>
            {dateStr && <span>{dateStr}</span>}
            <span className="flex items-center gap-1"><Eye size={12} /> {serialized.views || 0} views</span>
            {serialized.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {serialized.tags.map((tag: string) => (
                  <span key={tag} className="bg-[#f0ece4] text-[#4b4540] px-2 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article body */}
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl leading-relaxed text-[#2d2926] font-display italic mb-8 pb-8 border-b border-[#e5e0d8]">
              {serialized.summary}
            </p>
            <div className="prose" dangerouslySetInnerHTML={{ __html: serialized.content }} />

            {/* Share buttons */}
            <ShareButtons
              title={serialized.title}
              slug={serialized.slug}
              type="article"
            />

            {/* Comments */}
            <CommentSection
              postId={serialized._id}
              postType="article"
              postSlug={serialized.slug}
              postTitle={serialized.title}
              initialComments={comments}
            />
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="bg-[#f8f7f4] border-t border-[#e5e0d8] py-16">
            <div className="container">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] border-l-4 border-[#d97706] pl-4 mb-8">
                More in {serialized.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel: any) => (
                  <ArticleCard key={rel._id.toString()} article={JSON.parse(JSON.stringify(rel))} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
      
