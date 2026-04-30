// lib/models/GalleryItem.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  status: 'draft' | 'published';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title:    { type: String, required: true, trim: true },
    caption:  { type: String, default: '' },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'General' },
    status:   { type: String, enum: ['draft', 'published'], default: 'published' },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ status: 1, order: 1 });

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

// ─── ContactMessage ───────────────────────────────────────────────────────────

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

// ─── AdminUser ────────────────────────────────────────────────────────────────

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'writer';
  bio: string;
  avatar: string;
  active: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, select: false },
    role:      { type: String, enum: ['superadmin', 'writer'], default: 'writer' },
    bio:       { type: String, default: '' },
    avatar:    { type: String, default: '' },
    active:    { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

AdminUserSchema.index({ email: 1 });

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
