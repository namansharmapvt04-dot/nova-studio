# Nova Studio

Fullstack digital agency platform built for the VickyBytes assignment.

**Live:** https://nova-studio-navy.vercel.app
**Admin:** https://nova-studio-navy.vercel.app/admin/login

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript |
| UI | Material UI v5 + CSS Modules |
| Backend | Next.js API Routes |
| Database (primary) | PostgreSQL + Prisma ORM |
| Database (analytics) | MongoDB |
| Auth | JWT (jsonwebtoken + jose Edge middleware) + bcrypt |

## Local setup

**Requirements:** Node.js 18+, PostgreSQL

```bash
npm install
```

Create `.env.local` in the root:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/nova_studio"
JWT_SECRET="any-long-random-string"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..."
MONGODB_URI=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

To generate the password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
```

One thing to watch: Next.js strips bare `$` signs from double-quoted `.env` values. Escape them as `\$` in `ADMIN_PASSWORD_HASH`, otherwise the hash loads as an empty string and login always fails.

```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations
npm run db:seed       # seed 6 projects + 3 stats
npm run dev           # http://localhost:3000
```

Admin panel is at `/admin/login`.

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # serve production build
npm run db:studio    # Prisma Studio (visual DB browser)
```

## API

| Method | Route | Auth | Body |
|---|---|---|---|
| GET | /api/projects | public | |
| POST | /api/projects | admin | `{ title, category, imageUrl }` |
| DELETE | /api/projects/:id | admin | |
| GET | /api/stats | public | |
| POST | /api/contact | public | `{ name, email, message }` |
| GET | /api/contacts | admin | |
| POST | /api/auth/login | public | `{ username, password }` |
| POST | /api/analytics | public | `{ type: "page_view" \| "cta_click", page }` |

Admin routes require `Authorization: Bearer <token>`. Auth is enforced in `middleware.ts` at the Edge before requests hit any handler, so unauthenticated requests are rejected with 401 before Prisma is ever called.

## Project structure

```
app/
  api/
    auth/login/       POST - returns JWT
    projects/         GET (public), POST (admin)
    projects/[id]/    DELETE (admin)
    stats/            GET
    contact/          POST
    contacts/         GET (admin)
    analytics/        POST
  admin/              login page + dashboard
  page.tsx            landing page
  layout.tsx
  theme.ts
components/
  Navbar, Hero, ServicesSection, PortfolioSection
  StatsSection, ContactForm
  admin/ ContactsTable, ProjectsManager
hooks/
  useScrollAnimation.ts
  useCountUp.ts
lib/
  prisma.ts, mongodb.ts, auth.ts
middleware.ts
prisma/
  schema.prisma
  seed.ts
```

## Database schema

```prisma
model Project {
  id        Int      @id @default(autoincrement())
  title     String
  category  String
  imageUrl  String
  createdAt DateTime @default(now())
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}

model Stat {
  id    Int    @id @default(autoincrement())
  label String
  value String
}
```

MongoDB holds an `events` collection (`type`, `page`, `userAgent`, `timestamp`) for analytics. Kept separate from Postgres because it's append-only and schema-free.

## Design decisions

**Two databases** — Postgres for anything with relationships or delete operations (projects, contacts, stats). MongoDB for analytics events which are write-heavy, never updated, and don't need joins.

**JWT, not sessions** — stateless, works well with Next.js Edge middleware since verifying a token doesn't require a DB call on every request.

**Middleware-level auth** — `middleware.ts` runs on the Edge and rejects requests before they reach the route handler. This means no route handler can accidentally forget to check auth.

**Validation on both sides** — the contact form validates client-side so users get instant feedback. Server validates again because frontend validation is trivial to bypass.

**CSS Modules for animations** — the scroll-triggered reveals use IntersectionObserver + CSS transitions in plain `.module.css` files. This is cleaner than trying to do `opacity: 0 → 1` transitions through MUI's `sx` prop which doesn't handle class-based state as naturally.
