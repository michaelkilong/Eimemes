// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import BlogPost from '@/lib/models/BlogPost';
import { GalleryItem, ContactMessage } from '@/lib/models/index';
import { requireAuth, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  try {
    await connectDB();
    const [
      totalArticles, publishedArticles,
      totalBlogs, publishedBlogs,
      totalGallery,
      unreadMessages,
      recentArticles,
      recentBlogs,
    ] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      GalleryItem.countDocuments({ status: 'published' }),
      ContactMessage.countDocuments({ read: false }),
      Article.find().sort({ createdAt: -1 }).limit(5).select('title status category createdAt').lean(),
      BlogPost.find().sort({ createdAt: -1 }).limit(5).select('title status author createdAt').lean(),
    ]);

    return NextResponse.json({
      stats: {
        articles: { total: totalArticles, published: publishedArticles, draft: totalArticles - publishedArticles },
        blogs: { total: totalBlogs, published: publishedBlogs, draft: totalBlogs - publishedBlogs },
        gallery: totalGallery,
        messages: { unread: unreadMessages },
      },
      recentArticles,
      recentBlogs,
    });
  } catch (err) {
    console.error('[STATS]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
