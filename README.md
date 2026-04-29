# Eimemes — Full-Stack CMS

> Independent digital publication platform. Next.js 14 + MongoDB + JWT. Built for **Eimeme Pvt Ltd**.

---

## 🏗️ Architecture

```
eimemes/
├── app/
│   ├── api/                      # API routes (backend)
│   │   ├── auth/route.ts         # Login / logout / session
│   │   ├── articles/             # CRUD articles
│   │   │   └── [id]/route.ts
│   │   ├── blogs/                # CRUD blog posts
│   │   │   └── [id]/route.ts
│   │   ├── gallery/              # Gallery management
│   │   │   └── [id]/route.ts
│   │   ├── contact/route.ts      # Contact form + inbox
│   │   ├── upload/route.ts       # Image uploads
│   │   └── stats/route.ts        # Dashboard stats
│   │
│   ├── article/[slug]/page.tsx   # Public article detail
│   ├── blog/[slug]/page.tsx      # Public blog post detail
│   ├── blogs/page.tsx            # Public blogs index
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact form
│   ├── page.tsx                  # Homepage (smart empty/populated)
│   │
│   └── control-panel-92x/       # 🔒 ADMIN DASHBOARD
│       ├── page.tsx              # Login
│       ├── dashboard/page.tsx    # Stats overview
│       ├── articles/             # Manage articles
│       │   ├── page.tsx          # List + filter
│       │   ├── new/page.tsx      # Create
│       │   └── [id]/page.tsx     # Edit
│       ├── blogs/                # Manage blog posts
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── gallery/page.tsx      # Manage gallery
│       └── messages/page.tsx     # Contact inbox
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx      # Collapsible sidebar
│   │   └── RichTextEditor.tsx    # TipTap editor
│   ├── articles/
│   │   └── ArticleCard.tsx       # Card + featured components
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── Skeleton.tsx
│
├── lib/
│   ├── mongodb.ts                # DB connection (cached)
│   ├── auth.ts                   # JWT utilities
│   └── models/
│       ├── Article.ts
│       ├── BlogPost.ts
│       └── index.ts              # GalleryItem, ContactMessage, AdminUser
│
├── middleware.ts                 # Admin route protection
└── scripts/
    └── seed.js                   # DB seeder
```

---

## 🗄️ Database Schema

### Article
| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| slug | String | Unique, auto-generated |
| summary | String | Max 300 chars, shown in cards |
| content | String | HTML from TipTap |
| category | String | e.g. Football, Media |
| author | String | Default: Eimemes Desk |
| coverImage | String | URL |
| status | Enum | draft \| published |
| featured | Boolean | Shows in hero |
| tags | [String] | |
| views | Number | Auto-incremented |
| seoTitle | String | Overrides title in search |
| seoDescription | String | Meta description |
| publishedAt | Date | Set on first publish |

### BlogPost
| Field | Type | Notes |
|-------|------|-------|
| title, slug, excerpt | String | |
| content | String | HTML |
| author, authorBio | String | |
| coverImage | String | |
| status | Enum | draft \| published |
| readTime | Number | Auto-computed |
| tags | [String] | |

### GalleryItem
| Field | Type |
|-------|------|
| title, caption | String |
| imageUrl | String |
| category | String |
| status | Enum |
| order | Number |

### ContactMessage
| Field | Type |
|-------|------|
| name, email, subject, message | String |
| read | Boolean |

### AdminUser
| Field | Type |
|-------|------|
| name, email | String |
| password | String (bcrypt) |
| role | admin \| editor |
| lastLogin | Date |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install
```bash
git clone <repo>
cd eimemes
npm install
```

### 2. Environment
```bash
cp .env.example .env.local
# Edit .env.local — set MONGODB_URI and JWT_SECRET
```

### 3. Seed database
```bash
npm run seed
```
Creates:
- Admin user: `admin@eimemes.com` / `eimemes_admin_2025`
- 3 sample articles (published)
- 2 sample blog posts

### 4. Run
```bash
npm run dev
# → http://localhost:3000
# → http://localhost:3000/control-panel-92x (admin)
```

---

## 🚀 Deployment

### Vercel + MongoDB Atlas (recommended)

1. **MongoDB Atlas** — create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
   - Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/eimemes`

2. **Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   Add environment variables in Vercel dashboard:
   - `MONGODB_URI` → Atlas connection string
   - `JWT_SECRET` → Long random string
   - `NEXT_PUBLIC_SITE_URL` → Your Vercel URL

3. **Seed production**
   ```bash
   MONGODB_URI=<atlas-uri> node scripts/seed.js
   ```

### Railway / Render
```bash
# Build command:  npm run build
# Start command:  npm start
# Port:           3000
```

---

## 🔐 Admin Dashboard

| URL | Description |
|-----|-------------|
| `/control-panel-92x` | Login |
| `/control-panel-92x/dashboard` | Stats overview |
| `/control-panel-92x/articles` | Article management |
| `/control-panel-92x/articles/new` | Create article |
| `/control-panel-92x/blogs` | Blog post management |
| `/control-panel-92x/gallery` | Gallery management |
| `/control-panel-92x/messages` | Contact inbox |

**Features:**
- JWT auth via HttpOnly cookies
- Rich text editor (TipTap) with Bold/Italic/Headers/Links/Images
- Draft vs Published toggle (click status badge in list)
- Featured article star toggle
- Image upload to `/public/uploads/`
- SEO metadata fields
- Collapsible sidebar

---

## 🌐 Public Routes

| URL | Description |
|-----|-------------|
| `/` | Homepage — shows empty state or news grid |
| `/article/:slug` | Full article with prose layout |
| `/blogs` | Opinion & longform index |
| `/blog/:slug` | Full blog post |
| `/about` | About Eimemes |
| `/contact` | Contact form |

---

## ✨ Key Features

- **Smart homepage** — empty DB shows About intro; populated DB shows news grid
- **ISR (Incremental Static Regeneration)** — pages revalidate every 60s
- **Slug-based routing** — all content accessible by human-readable URLs
- **No hardcoded data** — 100% database-driven
- **Lazy loading** — images load with `loading="lazy"` + Next.js optimization
- **Skeleton loading states** — smooth perceived performance
- **SEO** — per-page metadata with `generateMetadata`
- **Editorial typography** — Playfair Display + IBM Plex Sans
