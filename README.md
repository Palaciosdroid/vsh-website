# VSH — Verband Schweizer Hypnosetherapeuten

Website und Mitgliederportal des **Verbands Schweizer Hypnosetherapeuten** — [v-s-h.ch](https://v-s-h.ch)

Dieses Projekt umfasst die oeffentliche Website (Therapeuten-Verzeichnis, News, Informationsseiten) sowie den geschuetzten Mitglieder- und Admin-Bereich.

---

## Tech Stack

| Technologie | Einsatz |
|---|---|
| **Next.js 16** | App Router, React 19, Server Components |
| **TypeScript** | Durchgehend typisiert |
| **Supabase** | Auth, PostgreSQL + PostGIS, Storage, Row Level Security |
| **Tailwind CSS 4** | Styling mit shadcn/ui Komponenten |
| **Mapbox GL JS** | Therapeuten-Karte mit Umkreissuche |
| **hCaptcha** | Spam-Schutz fuer Kontaktformular |
| **Railway** | Hosting mit Git-Push Auto-Deploy |

---

## Architektur

Das Projekt nutzt den **Next.js App Router** mit folgender Struktur:

```
src/
├── app/
│   ├── admin/              # Admin-Bereich (protected)
│   ├── api/                # API-Routes (Contact, Cron, Events, Geocode, Suche)
│   ├── auth/               # Auth (Login, Callback, Confirm)
│   ├── dashboard/          # Mitglieder-Dashboard (protected)
│   │   ├── dokumente/      # Verbandsdokumente
│   │   ├── einstellungen/  # Kontoeinstellungen
│   │   ├── mitglieder/     # Mitgliederverzeichnis
│   │   ├── nachrichten/    # Kontaktanfragen
│   │   ├── profil/         # Profilbearbeitung
│   │   ├── termine/        # Events & Termine
│   │   └── weiterbildung/  # Weiterbildungs-Katalog
│   ├── therapeuten/        # Therapeuten-Verzeichnis + Detailprofile
│   ├── news/               # News & Blog
│   ├── faq/                # Haeufige Fragen
│   ├── kontakt/            # Kontaktformular
│   ├── ueber-uns/          # Ueber den Verband
│   ├── hypnosetherapie/    # Informationsseite (SEO)
│   ├── mitglied-werden/    # Mitgliedschaft beantragen
│   ├── statuten/           # Verbandsstatuten
│   ├── datenschutz/        # Datenschutzerklaerung
│   └── impressum/          # Impressum
├── components/
│   ├── admin/              # Admin-Komponenten
│   ├── dashboard/          # Dashboard-Komponenten
│   ├── layout/             # Header, Footer
│   ├── therapeuten/        # Karte, Karten, Filter-Sidebar
│   └── ui/                 # shadcn/ui Basiskomponenten
├── lib/
│   ├── supabase/           # Supabase Clients (Browser, Server, Middleware)
│   ├── email.ts            # E-Mail-Versand (SMTP)
│   └── utils.ts            # Hilfsfunktionen (cn)
└── middleware.ts            # Auth-Schutz fuer /dashboard, /admin
```

---

## Getting Started

### Voraussetzungen

- Node.js 20+
- npm
- Supabase-Projekt (lokal oder gehostet)

### Installation

```bash
# 1. Repository klonen
git clone <repository-url>
cd vsh-website

# 2. Abhaengigkeiten installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.local.example .env.local
# .env.local mit eigenen Werten befuellen (siehe Tabelle unten)

# 4. Entwicklungsserver starten
npm run dev
```

Anschliessend oeffnen: [http://localhost:3000](http://localhost:3000)

---

## Umgebungsvariablen

| Variable | Erforderlich | Beschreibung |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ja | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja | Supabase Anonymous Key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Nein | Service Role Key (nur serverseitig, fuer Admin-Operationen) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Nein | Mapbox Public Token (Kartenanzeige) |
| `MAPBOX_SECRET_TOKEN` | Nein | Mapbox Secret Token (Geocoding, nur serverseitig) |
| `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | Nein | hCaptcha Site Key (Kontaktformular) |
| `HCAPTCHA_SECRET` | Nein | hCaptcha Secret (serverseitige Validierung) |
| `SMTP_HOST` | Nein | SMTP-Server fuer E-Mail-Versand |
| `SMTP_PORT` | Nein | SMTP-Port (z.B. 587) |
| `SMTP_USER` | Nein | SMTP-Benutzername |
| `SMTP_PASS` | Nein | SMTP-Passwort |
| `SMTP_FROM` | Nein | Absender-Adresse (z.B. `noreply@v-s-h.ch`) |
| `CRON_SECRET` | Nein | Geheimer Schluessel fuer Cron-Job-Authentifizierung |
| `NEXT_PUBLIC_SITE_URL` | Nein | Oeffentliche URL der Website (z.B. `https://v-s-h.ch`) |

---

## Datenbank

### Migrationen ausfuehren

Die SQL-Migrationen liegen unter `supabase/migrations/` und muessen **in Reihenfolge** ausgefuehrt werden:

1. `00001_initial_schema.sql` — Grundschema (Profiles, Specializations, News, Events, etc.)
2. `00002_search_functions.sql` — Suchfunktionen fuer Therapeuten-Verzeichnis
3. `00003_notification_preferences.sql` — Benachrichtigungseinstellungen

```bash
# Mit Supabase CLI
supabase db push

# Oder manuell im Supabase SQL Editor die Dateien der Reihe nach ausfuehren
```

### Supabase Storage

Einen **Public Bucket** mit dem Namen `avatars` erstellen (fuer Profilbilder der Therapeuten):

```
Supabase Dashboard → Storage → New Bucket → Name: avatars → Public: Yes
```

### Wichtige Tabellen

| Tabelle | Beschreibung |
|---|---|
| `profiles` | Therapeuten-Profile (erweitert auth.users) |
| `specializations` | Spezialisierungen-Katalog |
| `contact_requests` | Kontaktanfragen an Therapeuten |
| `news` | Blog- und News-Beitraege |
| `pages` | CMS-Seiten (Ueber uns, FAQ etc.) |
| `documents` | Verbandsdokumente |
| `events` | Verbandstermine |
| `event_registrations` | Event-Anmeldungen |
| `continuing_education` | Weiterbildungs-Katalog |

---

## Deployment (Railway)

Das Projekt wird auf **Railway** gehostet mit automatischem Deployment:

1. Repository mit Railway verbinden
2. Umgebungsvariablen im Railway Dashboard setzen
3. Bei jedem Push auf `main` wird automatisch gebaut und deployed

Build-Konfiguration (siehe `railway.json`):

```json
{
  "build": { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": { "startCommand": "npm start" }
}
```

---

## Cron Jobs

| Endpoint | Zeitplan | Beschreibung |
|---|---|---|
| `/api/cron/event-reminders` | Taeglich 08:00 CET | Sendet Erinnerungen fuer anstehende Events |

Die Cron-Endpunkte sind durch `CRON_SECRET` geschuetzt. Der Aufruf erfolgt ueber einen externen Cron-Dienst (z.B. Railway Cron, cron-job.org) mit dem Header:

```
Authorization: Bearer <CRON_SECRET>
```

---

## Testing

End-to-End Tests mit **Playwright** (Chromium):

```bash
# Playwright installieren (einmalig)
npm install -D @playwright/test
npx playwright install chromium

# Tests ausfuehren
npx playwright test

# Tests mit UI-Modus
npx playwright test --ui

# Einzelne Test-Datei
npx playwright test e2e/public.spec.ts

# Test-Report anzeigen
npx playwright show-report
```

Die Tests befinden sich unter `e2e/` und decken folgende Bereiche ab:

- **auth.spec.ts** — Login-Seite, Formular-Validierung, Dashboard-Redirect
- **public.spec.ts** — Homepage, Therapeuten-Verzeichnis, Navigation, FAQ, Kontakt
- **search.spec.ts** — Suchseite, Filter, Ergebnisanzeige

---

## Scripts

```bash
npm run dev       # Entwicklungsserver (http://localhost:3000)
npm run build     # Produktions-Build
npm start         # Produktionsserver
npm run lint      # ESLint
```

---

## Phasenplan

| Phase | Beschreibung | Status |
|---|---|---|
| **Phase 1** | Fundament — Setup, Auth, Layout, Datenbank | Abgeschlossen |
| **Phase 2** | Oeffentliche Seiten — SEO, News, CMS-Inhalte | Abgeschlossen |
| **Phase 3** | Therapeuten-Verzeichnis — Mapbox, Suche, Profile | Abgeschlossen |
| **Phase 4** | Mitglieder-Bereich — Dashboard, Self-Service, Events | Abgeschlossen |
| **Phase 5** | Admin & Polish — Verwaltung, E-Mails, Tests | In Arbeit |
