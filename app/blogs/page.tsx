// app/blogs/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export const metadata: Metadata = {
  title: 'Opinion & Longform',
  description: 'Thoughtful essays, opinion pieces, and longform journalism from the Eimemes team.',
};

export const revalidate = 60;

async function getPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(20)
      .select('-content')
      .lean();
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="container py-12">
        {/* Page header */}
        <div className="mb-10 pb-8 border-b border-[#e5e0d8]">
          <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-2">The Eimemes Blog</p>
          <h1 className="font-display text-4xl font-bold text-[#0f172a]">Opinion & Longform</h1>
          <p className="text-[#4b4540] mt-3 max-w-xl">
            Essays, analysis, and cultural writing from our journalists and contributors.
          </p>
        </div>

        {posts.length === 0 ? (
          <EmptyBlogs />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {posts.map((post: any, i: number) => (
              <BlogCard key={post._id.toString()} post={JSON.parse(JSON.stringify(post))} featured={i === 0} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function BlogCard({ post, featured }: { post: any; featured: boolean }) {
  const href = `/blog/${post.slug}`;
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  if (featured && post.coverImage) {
    return (
      <article className="bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative w-full min-h-64 md:min-h-80">
            <Image
              src={post.coverImage} alt={post.title} fill
              className="object-cover" sizes="50vw"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-3">Featured Essay</p>
            <h2 className="font-display text-2xl font-bold text-[#0f172a] leading-tight mb-3">
              <Link href={href} className="hover:text-[#d97706] transition-colors">{post.title}</Link>
            </h2>
            <p className="text-sm text-[#4b4540] leading-relaxed mb-5">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-[#6b7280] font-mono mb-5">
              <span>{post.author}</span>
              <span>{dateStr}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} min read</span>
            </div>
            <Link href={href} className="btn-primary self-start">
              Continue reading <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white border border-[#e5e0d8] rounded-sm p-6 md:p-8 card-hover animate-fade-up">
      <div className="flex gap-6">
        {post.coverImage && (
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm hidden sm:block">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="96px" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-[#0f172a] mb-2 leading-snug">
            <Link href={href} className="hover:text-[#d97706] transition-colors">{post.title}</Link>
          </h2>
          <div className="flex items-center gap-4 text-xs text-[#6b7280] font-mono mb-3">
            <span>{post.author}</span>
            <span>{dateStr}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} min read</span>
          </div>
          <p className="text-sm text-[#4b4540] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          <Link href={href} className="text-[#d97706] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Continue reading <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyBlogs() {
  return (
    <div className="py-20 text-center">
      <p className="font-display text-2xl text-[#0f172a] mb-3">No posts yet</p>
      <p className="text-[#6b7280] text-sm">
        Our writers are working on some great pieces. Check back soon.
      </p>
    </div>
  );
}
