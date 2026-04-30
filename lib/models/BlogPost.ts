// lib/models/BlogPost.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio: string;
  coverImage: string;
  status: 'draft' | 'published';
  tags: string[];
  readTime: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:    { type: String, required: true, maxlength: 500 },
    content:    { type: String, required: true },
    author:     { type: String, required: true },
    authorBio:  { type: String, default: '' },
    coverImage: { type: String, default: '' },
    status:     { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags:       [{ type: String, trim: true }],
    readTime:   { type: Number, default: 5 },
    views:      { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogPostSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Auto-compute read time (~200 words/min)
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishedAt: -1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
