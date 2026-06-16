# Nova Studio — Digital Agency Platform

A fullstack web application for a fictional digital agency: marketing site with services, portfolio, stats and contact form, backed by a real API/database layer, plus a protected admin panel for managing submissions and projects.

Built for the VickyBytes Fullstack Developer Assignment.

**Live deployment:** https://nova-studio-navy.vercel.app
**Admin panel:** https://nova-studio-navy.vercel.app/admin/login (`admin` / `NovaAdmin#2026`)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| UI / Styling | Material UI (MUI v5) + CSS Modules |
| Backend | Next.js API Routes |
| Primary database | PostgreSQL via Prisma ORM |
| Secondary database | MongoDB (analytics events) |
| Auth | JWT (`jsonwebtoken` on the server, `jose` in Edge middleware) + bcrypt password hashing |

## Features

- **Landing page** — animated hero, services, portfolio, stats, contact form, all rendered from real API data (not hardcoded).
- **Services section** — three services (Web Design, Development, Branding) rendered as a numbered, hover-responsive list.
- **Portfolio section** — projects fetched from `/api/projects`, scroll-triggered reveal animation, hover effects, category filtering.
- **Stats section** — metrics fetched from `/api/stats`, animated count-up on scroll into view.
- **Contact form** — client-side validation, posts to `/api/contact`, success/error feedback via snackbar.
- **Admin panel** (`/admin`) — JWT-protected. View all contact submissions, add/delete portfolio projects.
- **Analytics (bonus)** — CTA clicks and page views logged to MongoDB via `/api/analytics`.

## Project Structure

```
nova-studio/
├── app/
│   ├── api/
│   │   ├── projects/          GET, POST  (+ /[id] for DELETE)
│   │   ├── stats/             GET
│   │   ├── contact/           POST
│   │   ├── contacts/          GET (admin)
│   │   ├── auth/login/        POST (admin login)
│   │   └── analytics/         POST (event logging)
│   ├── admin/                 Login + dashboard (Contacts / Projects tabs)
│   ├── page.tsx                Landing page
│   ├── layout.tsx
│   └── theme.ts                 MUI theme
├── components/                  Navbar, Hero, ServicesSection, PortfolioSection,
│                                 StatsSection, ContactForm, admin/*
├── hooks/                       useScrollAnimation, useCountUp
├── lib/                          prisma client, mongodb client, auth helpers
├── prisma/                       schema.prisma, seed.ts
└── middleware.ts                 Edge JWT verification for protected API routes
```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally (or a hosted instance)
- (Optional) MongoDB instance for analytics — the app runs fine without it

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nova_studio"
MONGODB_URI=""                     # optional — leave empty to skip analytics
JWT_SECRET="replace-with-a-long-random-string"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..."   # bcrypt hash of your admin password
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Generate a password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

> Note: dollar signs in `ADMIN_PASSWORD_HASH` must be escaped as `\$` when the value is wrapped in double quotes, otherwise Next.js's `.env` parser drops them.

### 4. Set up the database
```bash
npm run db:generate   # generate Prisma client
npm run db:migrate     # create tables
npm run db:seed        # seed projects + stats
```

### 5. Run the app
```bash
npm run dev
```
App runs at `http://localhost:3000`. Admin panel at `http://localhost:3000/admin/login`.

### Other scripts
```bash
npm run build       # production build
npm run start        # run production build
npm run db:studio    # Prisma Studio GUI for the database
```

## API Documentation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Public | Fetch all portfolio projects |
| POST | `/api/projects` | Admin (JWT) | Add a new project — `{ title, category, imageUrl }` |
| DELETE | `/api/projects/:id` | Admin (JWT) | Delete a project by ID |
| GET | `/api/stats` | Public | Fetch the three headline metrics |
| POST | `/api/contact` | Public | Submit a contact form entry — `{ name, email, message }` |
| GET | `/api/contacts` | Admin (JWT) | View all contact submissions |
| POST | `/api/auth/login` | Public | Admin login — `{ username, password }` → returns JWT |
| POST | `/api/analytics` | Public | Log a `page_view` or `cta_click` event to MongoDB |

Admin-only routes are enforced at the **middleware** level (`middleware.ts`), not just inside the route handler — requests without a valid `Authorization: Bearer <token>` header are rejected with `401` before they reach the handler.

## Database Schema (PostgreSQL / Prisma)

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

MongoDB stores a single `events` collection for analytics (`type`, `page`, `userAgent`, `timestamp`) — kept separate from Postgres since it's unstructured, high-volume, append-only data.

## Design Decisions

- **Postgres for structured data, Mongo for events** — projects, contacts and stats have a fixed shape and relational guarantees matter (e.g. admin deletes); analytics events are write-heavy, schema-light, and disposable, so they don't belong in the same store.
- **JWT over sessions** — stateless auth keeps the admin API routes simple and works cleanly with Next.js Edge middleware, which can verify a token without touching the database on every request.
- **Edge middleware for route protection, not just handler checks** — so an unauthenticated request never reaches Prisma/Mongo at all, rather than relying on every handler remembering to check auth.
- **Validation on both ends** — the contact form and project forms validate client-side for UX (instant feedback) and re-validate server-side because client validation is not security.
- **CSS Modules + MUI's `sx` prop** — MUI handles components and theming consistently; CSS Modules handle the scroll-triggered animation classes (`IntersectionObserver`-driven), since that's simpler to express in plain CSS transitions than via `sx`.
- **No UI component library beyond MUI** — kept the dependency surface small per the assignment's "avoid unnecessary dependencies" guidance.

## Known Limitations

- MongoDB analytics is optional — if `MONGODB_URI` is unset, `/api/analytics` calls are skipped client-side rather than failing.
- No pagination on `/api/contacts` or `/api/projects` — acceptable at current scale, would need cursor-based pagination for production volume.
