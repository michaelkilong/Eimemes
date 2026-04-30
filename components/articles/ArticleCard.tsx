'use client';
// components/articles/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    author: string;
    coverImage: string;
    publishedAt: string | null;
    createdAt: string;
  };
  variant?: 'default' | 'horizontal' | 'compact';
}

function timeAgo(date: string | null) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-[#d97706] font-mono">
      {category}
    </span>
  );
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const href = `/article/${article.slug}`;
  const dateStr = timeAgo(article.publishedAt || article.createdAt);
  const imgSrc = article.coverImage || `https://placehold.co/600x400/1e293b/white?text=${encodeURIComponent(article.category)}`;

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex gap-4 bg-white border border-[#e5e0d8] rounded-sm p-4 card-hover">
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            src={imgSrc} alt={article.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="font-display text-sm font-bold leading-snug mt-1 text-[#0f172a] group-hover:text-[#d97706] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-[#6b7280] mt-1 font-mono">{dateStr}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group block border-b border-[#e5e0d8] py-4 last:border-0">
        <CategoryBadge category={article.category} />
        <h3 className="font-display text-base font-bold leading-snug mt-1 text-[#0f172a] group-hover:text-[#d97706] transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-[#6b7280] mt-1 font-mono">{dateStr}</p>
      </Link>
    );
  }

  return (
    <article className="group bg-white border border-[#e5e0d8] rounded-sm overflow-hidden card-hover">
      <Link href={href} className="block">
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={imgSrc} alt={article.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-5">
        <CategoryBadge category={article.category} />
        <Link href={href}>
          <h2 className="font-display text-[1.05rem] font-bold leading-snug mt-2 mb-2 text-[#0f172a] group-hover:text-[#d97706] transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-sm text-[#4b4540] line-clamp-2 leading-relaxed mb-3">{article.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#6b7280] font-mono">{article.author} · {dateStr}</span>
          <Link href={href} className="text-[#d97706] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Read <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FeaturedArticle({ article }: { article: ArticleCardProps['article'] }) {
  const href = `/article/${article.slug}`;
  const dateStr = timeAgo(article.publishedAt || article.createdAt);
  const imgSrc = article.coverImage || `https://placehold.co/1200x600/0f172a/white?text=Feature`;

  return (
    <article className="group bg-white border border-[#e5e0d8] rounded-sm overflow-hidden mb-10 card-hover animate-fade-up">
      <Link href={href} className="block relative w-full overflow-hidden" style={{ height: '420px' }}>
        <Image
          src={imgSrc} alt={article.title} fill
          className="object-cover group-hover:scale-102 transition-transform duration-700"
          sizes="100vw" priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <CategoryBadge category={article.category} />
          <h1 className="font-display text-white text-3xl md:text-4xl font-bold leading-tight mt-2 mb-3 max-w-3xl">
            {article.title}
          </h1>
          <p className="text-white/80 text-sm max-w-2xl line-clamp-2 mb-4">{article.summary}</p>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-xs font-mono">{article.author} · {dateStr}</span>
            <span className="text-[#d97706] text-sm font-semibold flex items-center gap-1">
              Read full story <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
