# VSH Website

Offizielle Website der **Vereinigung Schweizer Tierärzte (VSH)**.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage)
- **Database:** PostgreSQL + PostGIS
- **Deployment:** Railway (Git-Push Auto-Deploy)

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Database

Migration files are in `supabase/migrations/`. Apply them via the Supabase Dashboard or CLI:

```bash
supabase db push
```

### Tables

- `profiles` — User profiles (extends auth.users)
- `specializations` — Veterinary specializations
- `profile_specializations` — Many-to-many link
- `news` — News articles
- `pages` — CMS static pages
- `documents` — Downloadable files
- `contact_requests` — Contact form submissions
- `events` — Events / Veranstaltungen
- `event_registrations` — Event registrations
- `continuing_education` — Continuing education courses

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Public pages (news, events, members, etc.)
│   ├── admin/          # Admin area (protected)
│   ├── auth/           # Auth pages (login, callback, confirm)
│   ├── dashboard/      # Member dashboard (protected)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/         # Header, Footer
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── supabase/       # Supabase client (browser, server, middleware)
│   └── utils.ts        # cn() utility
└── middleware.ts        # Auth protection for /dashboard, /admin
```
