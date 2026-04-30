// lib/models/Article.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  status: 'draft' | 'published';
  featured: boolean;
  tags: string[];
  views: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary:        { type: String, required: true, maxlength: 300 },
    content:        { type: String, required: true },
    category:       { type: String, required: true, trim: true },
    author:         { type: String, required: true, default: 'Eimemes Desk' },
    coverImage:     { type: String, default: '' },
    status:         { type: String, enum: ['draft', 'published'], default: 'draft' },
    featured:       { type: Boolean, default: false },
    tags:           [{ type: String, trim: true }],
    views:          { type: Number, default: 0 },
    seoTitle:       { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    publishedAt:    { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate publishedAt on status change to published
ArticleSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes for performance
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ featured: 1, status: 1 });

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
