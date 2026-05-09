// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommentSection from '@/components/CommentSection';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, status: 'published' }).lean();
    if (!post) return { title: 'Not Found' };
    return { title: post.title, description: post.excerpt };
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

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className={`${post.coverImage ? 'relative' : 'bg-[#0f172a]'} py-20`}>
          {post.coverImage && (
            <>
              <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-[#0f172a]/60" />
            </>
          )}
          <div className="container relative z-10 max-w-3xl mx-auto text-center text-white">
            <Link href="/blogs"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-6 transition-colors">
              <ArrowLeft size={12} /> Opinion & Blogs
            </Link>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-5">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-white/60 font-mono flex-wrap">
              <span>{post.author}</span>
              {dateStr && <span>{dateStr}</span>}
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl leading-relaxed font-display italic text-[#2d2926] mb-8 pb-8 border-b border-[#e5e0d8]">
              {post.excerpt}
            </p>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Author card */}
            {post.authorBio && (
              <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
                <p className="text-xs font-mono uppercase tracking-widest text-[#6b7280] mb-2">About the author</p>
                <p className="font-display text-lg font-bold text-[#0f172a] mb-1">{post.author}</p>
                <p className="text-sm text-[#4b4540] leading-relaxed">{post.authorBio}</p>
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-mono bg-[#f0ece4] text-[#4b4540] px-3 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments */}
            <CommentSection
              postId={post._id.toString()}
              postType="blog"
              postSlug={post.slug}
              postTitle={post.title}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
