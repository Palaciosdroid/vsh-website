# VSH — Verband Schweizer Hypnosetherapeuten

Offizielle Website des **Verbands Schweizer Hypnosetherapeuten (VSH)** — [v-s-h.ch](https://v-s-h.ch)

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage)
- **Database:** PostgreSQL + PostGIS (Umkreissuche)
- **Karten:** Mapbox GL JS (Phase 3)
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

Migration files are in `supabase/migrations/`. Apply via Supabase CLI:

```bash
supabase db push
```

### Tables

| Tabelle | Beschreibung |
|---------|-------------|
| `profiles` | Therapeuten-Profile (extends auth.users) |
| `specializations` | Spezialisierungen-Katalog |
| `contact_requests` | Kontaktanfragen an Therapeuten |
| `news` | Blog/News-Beiträge |
| `pages` | CMS-Seiten (Über uns, FAQ etc.) |
| `documents` | Verbandsdokumente |
| `events` | Verbandstermine |
| `event_registrations` | Event-Anmeldungen |
| `continuing_education` | Weiterbildungs-Katalog |

## Phasenplan

- **Phase 1:** Fundament (Setup, Auth, Layout, DB) ✅
- **Phase 2:** Öffentliche Seiten (SEO, News, CMS)
- **Phase 3:** Therapeuten-Verzeichnis (Mapbox, Suche, Profile)
- **Phase 4:** Mitglieder-Bereich (Dashboard, Self-Service)
- **Phase 5:** Admin & Polish (Verwaltung, E-Mails, Tests)

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin-Bereich (protected)
│   ├── auth/               # Auth (Login, Callback, Confirm)
│   ├── dashboard/          # Mitglieder-Dashboard (protected)
│   ├── therapeuten/        # Therapeuten-Verzeichnis + Profile
│   ├── news/               # News-Übersicht + Detail
│   ├── ueber-uns/          # Über den Verband
│   ├── kontakt/            # Kontaktformular
│   ├── faq/                # Häufige Fragen
│   ├── hypnosetherapie/    # Info-Seite (SEO)
│   ├── mitglied-werden/    # Mitgliedschaft
│   ├── statuten/           # Verbandsstatuten
│   ├── datenschutz/        # Datenschutzerklärung
│   ├── impressum/          # Impressum
│   └── ...
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # shadcn/ui Komponenten
├── lib/
│   ├── supabase/           # Supabase Client (Browser, Server, Middleware)
│   └── utils.ts            # cn() Utility
└── middleware.ts            # Auth-Schutz für /dashboard, /admin
```
