# Apex Athletic

A premium, fully animated fitness club website with a complete admin CMS — built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Prisma and PostgreSQL.

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons
- **Animation:** Framer Motion, CSS keyframes, scroll-driven parallax
- **Backend:** Next.js Server Actions + Route Handlers
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Custom JWT session cookies (`jose`) + bcrypt password hashing, role-based (`SUPER_ADMIN`, `ADMIN`, `EDITOR`)

## Getting Started

```bash
npm install

# Point DATABASE_URL (and SESSION_SECRET) at your Postgres instance in .env
npx prisma migrate deploy

# Seed sample content for every section (programs, trainers, memberships,
# schedule, facilities, transformations, testimonials, gallery, FAQs, users, etc.)
npm run db:seed

npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the CMS.

### Seeded admin login

```
Email:    admin@apexathletic.com
Password: Password123!
```

Two additional demo users are seeded to show off role-based access:
`manager@apexathletic.com` (ADMIN) and `editor@apexathletic.com` (EDITOR), same password.

## Project structure

```
app/
  (public)/        marketing site routes (homepage, programs, trainers, membership, schedule, gallery, contact)
  admin/           admin dashboard (auth-gated route group + /admin/login)
  api/upload/      media upload route handler
components/
  ui/              shadcn/ui primitives
  <feature>/       one folder per public section (hero, programs, trainers, schedule, ...)
  admin/           admin-only components (forms, tables, sidebar, media library)
lib/
  actions/         server actions (all mutations + activity logging)
  data/            read-only data-fetching helpers used by Server Components
  auth/            session, password hashing, route guards
  validations/     zod schemas
prisma/
  schema.prisma
  seed.ts
```

## Content model

Every visible section of the site is backed by a database table and editable from `/admin`, including the homepage's section order and visibility (drag-and-drop enable/disable), theme colors and typography, hero content, SEO metadata, navigation, and all content collections (programs, trainers, membership plans, class schedule, facilities, transformations, testimonials, gallery, FAQs).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:seed` | Reset and reseed the database with demo content |
| `npm run db:studio` | Open Prisma Studio |
