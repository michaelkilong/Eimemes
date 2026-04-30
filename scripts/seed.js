#!/usr/bin/env node
// scripts/seed.js
// Run: node scripts/seed.js
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI    = process.env.MONGODB_URI;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI)    { console.error('❌ MONGODB_URI is not set in .env.local');    process.exit(1); }
if (!ADMIN_EMAIL)    { console.error('❌ ADMIN_EMAIL is not set in .env.local');    process.exit(1); }
if (!ADMIN_PASSWORD) { console.error('❌ ADMIN_PASSWORD is not set in .env.local'); process.exit(1); }
if (ADMIN_PASSWORD.length < 8) { console.error('❌ ADMIN_PASSWORD must be at least 8 characters'); process.exit(1); }

// ─── Inline schemas (avoid TS compilation) ─────────────────
const AdminUserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false }, role: { type: String, default: 'admin' },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, summary: String,
  content: String, category: String, author: { type: String, default: 'Eimemes Desk' },
  coverImage: { type: String, default: '' }, status: { type: String, default: 'draft' },
  featured: { type: Boolean, default: false }, tags: [String],
  views: { type: Number, default: 0 }, publishedAt: { type: Date, default: null },
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, excerpt: String,
  content: String, author: String, coverImage: { type: String, default: '' },
  status: { type: String, default: 'draft' }, readTime: { type: Number, default: 3 },
  tags: [String], publishedAt: { type: Date, default: null },
}, { timestamps: true });

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
  const Article   = mongoose.models.Article   || mongoose.model('Article', ArticleSchema);
  const BlogPost  = mongoose.models.BlogPost  || mongoose.model('BlogPost', BlogPostSchema);

  // ─── Admin user ──────────────────────────────────────────
  const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await AdminUser.create({ name: 'Super Admin', email: ADMIN_EMAIL, password: hashed, role: 'superadmin', active: true });
    console.log(`✅ Super Admin created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
  }

  // ─── Sample articles ─────────────────────────────────────
  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    const now = new Date();
    await Article.insertMany([
      {
        title: "Kuki FC's unbeaten run sparks playoff hopes",
        slug: 'kuki-fc-unbeaten-run-playoff-hopes',
        summary: "In front of a packed home crowd, Kuki FC secured a 2-0 victory against Valley Warriors. The team now sits second in the regional standings.",
        content: `<h2>A night to remember</h2><p>Kuki FC delivered another impressive performance at their home ground, securing a commanding 2-0 victory against Valley Warriors in what many are calling their best display of the season.</p><p>Goals from Striker Okonkwo in the 34th minute and midfielder Chen in the 78th minute sealed the win, keeping their unbeaten home record intact.</p><h2>Manager's reaction</h2><p>"The boys were outstanding tonight," said head coach Priya Sharma. "Every single player gave 100 percent. This is what we've been building towards."</p><p>The result means Kuki FC now sit just three points behind league leaders Riverside United, with a game in hand.</p><blockquote>We're not getting ahead of ourselves, but the boys deserve to feel proud tonight. — Coach Priya Sharma</blockquote><h2>Playoff picture</h2><p>With eight games remaining, Kuki FC are well-placed to secure a playoff spot. The upcoming away fixture against Highview United in the League Cup quarter-final will be the true test of their credentials.</p>`,
        category: 'Football', author: 'Eimemes Sports Desk',
        coverImage: 'https://placehold.co/1200x600/0f172a/white?text=Kuki+FC+Victory',
        status: 'published', featured: true, tags: ['kuki-fc', 'football', 'playoffs'],
        publishedAt: now, views: 142,
      },
      {
        title: 'Grassroots football sees record attendance this season',
        slug: 'grassroots-football-record-attendance-season',
        summary: 'Regional leagues across Maharashtra report a 22% growth in attendance this season, driven by a new generation of passionate local fans.',
        content: `<h2>The numbers don't lie</h2><p>This season has been remarkable for grassroots football. Attendances across regional leagues in Maharashtra are up 22% compared to last year, with several clubs reporting sold-out crowds for the first time in their history.</p><p>The trend is being driven by a combination of social media coverage, improved facilities, and the emergence of exciting local talent like Kuki FC.</p>`,
        category: 'Local', author: 'Eimemes Desk',
        coverImage: 'https://placehold.co/1200x600/334155/white?text=Grassroots+Football',
        status: 'published', featured: false, tags: ['grassroots', 'attendance', 'maharashtra'],
        publishedAt: new Date(now.getTime() - 86400000), views: 87,
      },
      {
        title: 'Eimemes launches mentorship programme for young journalists',
        slug: 'eimemes-mentorship-programme-young-journalists',
        summary: 'Eimeme Pvt Ltd has announced five journalism scholarships to support young writers from underrepresented communities in Maharashtra.',
        content: `<h2>Investing in the next generation</h2><p>Eimeme Pvt Ltd has announced the launch of a journalism mentorship programme, providing five fully-funded scholarships to aspiring journalists from underrepresented communities across Maharashtra.</p><p>The programme includes six months of hands-on newsroom experience, mentoring from senior journalists, and a publishing platform for their work.</p>`,
        category: 'Media', author: 'Eimemes Editorial',
        coverImage: 'https://placehold.co/1200x600/0f172a/d97706?text=Mentorship',
        status: 'published', featured: false, tags: ['journalism', 'scholarships', 'media'],
        publishedAt: new Date(now.getTime() - 172800000), views: 56,
      },
    ]);
    console.log('✅ Sample articles created (3 published)');
  } else {
    console.log(`ℹ️  Articles exist (${articleCount}), skipping`);
  }

  // ─── Sample blog posts ────────────────────────────────────
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    const now = new Date();
    await BlogPost.insertMany([
      {
        title: 'The economics of a community football club',
        slug: 'economics-community-football-club',
        excerpt: 'How Kuki FC balances finances, volunteers, and local pride. A deep-dive into the sustainability model that could inspire clubs across India.',
        content: `<h2>Beyond the pitch</h2><p>Running a community football club is nothing like running a professional one. There are no wealthy owners, no TV rights deals, and no transfer budgets. What there is, however, is something more valuable: community ownership and authentic local pride.</p><p>Kuki FC operates on a shoestring budget. Their annual income comes from match day revenue, a modest local sponsorship from a Mumbai-based textile firm, and a small grant from the Maharashtra Football Association.</p><blockquote>Every rupee has to work hard. But that forces creativity — Kuki FC Treasurer, Ananya Desai</blockquote><p>Despite these constraints, the club has managed to build a new changing room, upgrade their pitch, and run a thriving youth academy. The secret? Volunteer power and community fundraising.</p>`,
        author: 'Rohan Mehta', tags: ['football', 'economics', 'community'],
        status: 'published', readTime: 6, publishedAt: new Date(now.getTime() - 259200000),
      },
      {
        title: 'Why independent media matters now more than ever',
        slug: 'why-independent-media-matters',
        excerpt: 'Ownership transparency and editorial trust: the philosophy behind Eimemes and why grassroots journalism is essential in an age of media consolidation.',
        content: `<h2>Trust is earned</h2><p>In an era where media ownership is increasingly concentrated in the hands of a few powerful conglomerates, the role of independent publications has never been more important.</p><p>At Eimemes, we believe transparency is the foundation of trust. That's why we publish our ownership structure, our funding sources, and our editorial guidelines. There are no hidden agendas here — just a commitment to honest, community-focused journalism.</p>`,
        author: 'Eimemes Editorial', tags: ['media', 'journalism', 'independence'],
        status: 'published', readTime: 4, publishedAt: new Date(now.getTime() - 518400000),
      },
    ]);
    console.log('✅ Sample blog posts created (2 published)');
  } else {
    console.log(`ℹ️  Blog posts exist (${blogCount}), skipping`);
  }

  console.log('\n🎉 Seed complete!');
  console.log(`\n🔐 Super Admin login:\n   URL:      http://localhost:3000/control-panel-92x\n   Email:    ${ADMIN_EMAIL}\n   Password: ${ADMIN_PASSWORD}\n`);
  console.log('💡 Add writers via the Team page in the dashboard.\n');
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
