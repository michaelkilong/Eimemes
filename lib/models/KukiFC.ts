// lib/models/KukiFC.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface IBranch extends Document {
  name: string;
  slug: string;
  city: string;
  logo: string;
  coverImage: string;
  description: string;
  founded: string;
  stadium: string;
  manager: string;
  active: boolean;
  createdAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    city:        { type: String, required: true, trim: true },
    logo:        { type: String, default: '' },
    coverImage:  { type: String, default: '' },
    description: { type: String, default: '' },
    founded:     { type: String, default: '' },
    stadium:     { type: String, default: '' },
    manager:     { type: String, default: '' },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

BranchSchema.index({ slug: 1 });

export const Branch: Model<IBranch> =
  mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

// ─── Player ───────────────────────────────────────────────────────────────────

export interface IPlayer extends Document {
  name: string;
  position: string;
  number: number;
  photo: string;
  bio: string;
  nationality: string;
  age: number;
  branch: string;
  isCaptain: boolean;
  active: boolean;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name:        { type: String, required: true, trim: true },
    position:    { type: String, required: true, enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Manager', 'Coach'] },
    number:      { type: Number, default: 0 },
    photo:       { type: String, default: '' },
    bio:         { type: String, default: '' },
    nationality: { type: String, default: 'Indian' },
    age:         { type: Number, default: 0 },
    branch:      { type: String, required: true },
    isCaptain:   { type: Boolean, default: false },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

PlayerSchema.index({ branch: 1, position: 1 });

export const Player: Model<IPlayer> =
  mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

// ─── Fixture ──────────────────────────────────────────────────────────────────

export interface IFixture extends Document {
  opponent: string;
  opponentLogo: string;
  date: Date;
  venue: string;
  isHome: boolean;
  branch: string;
  competition: string;
  status: 'upcoming' | 'live' | 'completed';
  homeScore: number | null;
  awayScore: number | null;
  result: 'win' | 'draw' | 'loss' | null;
  notes: string;
  createdAt: Date;
}

const FixtureSchema = new Schema<IFixture>(
  {
    opponent:     { type: String, required: true, trim: true },
    opponentLogo: { type: String, default: '' },
    date:         { type: Date, required: true },
    venue:        { type: String, default: '' },
    isHome:       { type: Boolean, default: true },
    branch:       { type: String, required: true },
    competition:  { type: String, default: 'League' },
    status:       { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
    homeScore:    { type: Number, default: null },
    awayScore:    { type: Number, default: null },
    result:       { type: String, enum: ['win', 'draw', 'loss', null], default: null },
    notes:        { type: String, default: '' },
  },
  { timestamps: true }
);

FixtureSchema.index({ branch: 1, date: -1 });
FixtureSchema.index({ status: 1, date: 1 });

export const Fixture: Model<IFixture> =
  mongoose.models.Fixture || mongoose.model<IFixture>('Fixture', FixtureSchema);

// ─── Product ──────────────────────────────────────────────────────────────────

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  inStock: boolean;
  whatsappNumber: string;
  featured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:            { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:     { type: String, default: '' },
    price:           { type: Number, required: true },
    images:          [{ type: String }],
    sizes:           [{ type: String }],
    category:        { type: String, default: 'Apparel', enum: ['Apparel', 'Accessories', 'Footwear', 'Other'] },
    inStock:         { type: Boolean, default: true },
    whatsappNumber:  { type: String, required: true },
    featured:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ inStock: 1, featured: -1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
    
