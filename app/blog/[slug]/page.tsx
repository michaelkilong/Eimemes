// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { getComments } from '@/app/actions/comments';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, status: 'published' }).lean();
    if (!post) return { title: 'Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eimemes.vercel.app';
    const ogImage = post.coverImage
      ? post.coverImage.startsWith('http')
        ? post.coverImage
        : `${siteUrl}${post.coverImage}`
      : `${siteUrl}/og-default.png`;

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        url: `${siteUrl}/blog/${post.slug}`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [ogImage],
      },
    };
  } catch { return { title: 'Blog' }; }
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  await connectDB();
  const post = await BlogPost.findOneAndUpdate(
    { slug: params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!post) notFound();

  const serialized = JSON.parse(JSON.stringify(post));
  const comments   = await getComments(serialized._id);

  const dateStr = serialized.publishedAt
    ? new Date(serialized.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className={`${serialized.coverImage ? 'relative' : 'bg-[#0f172a]'} py-20`}>
          {serialized.coverImage && (
            <>
              <Image src={serialized.coverImage} alt={serialized.title} fill className="object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-[#0f172a]/60" />
            </>
          )}
          <div className="container relative z-10 max-w-3xl mx-auto text-center text-white">
            <Link href="/blogs"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-6 transition-colors">
              <ArrowLeft size={12} /> Opinion & Blogs
            </Link>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-5">
              {serialized.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-white/60 font-mono flex-wrap">
              <span>{serialized.author}</span>
              {dateStr && <span>{dateStr}</span>}
              <span className="flex items-center gap-1">
                <Clock size={12} /> {serialized.readTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl leading-relaxed font-display italic text-[#2d2926] mb-8 pb-8 border-b border-[#e5e0d8]">
              {serialized.excerpt}
            </p>
            <div className="prose" dangerouslySetInnerHTML={{ __html: serialized.content }} />

            {/* Author card */}
            {serialized.authorBio && (
              <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
                <p className="text-xs font-mono uppercase tracking-widest text-[#6b7280] mb-2">
                  About the author
                </p>
                <p className="font-display text-lg font-bold text-[#0f172a] mb-1">{serialized.author}</p>
                <p className="text-sm text-[#4b4540] leading-relaxed">{serialized.authorBio}</p>
              </div>
            )}

            {/* Tags */}
            {serialized.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {serialized.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-mono bg-[#f0ece4] text-[#4b4540] px-3 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <ShareButtons
              title={serialized.title}
              slug={serialized.slug}
              type="blog"
            />

            {/* Comments */}
            <CommentSection
              postId={serialized._id}
              postType="blog"
              postSlug={serialized.slug}
              postTitle={serialized.title}
              initialComments={comments}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
          
