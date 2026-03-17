-- ============================================================
-- VSH Website – Initial Database Schema
-- Verband Schweizer Hypnosetherapeuten (v-s-h.ch)
-- ============================================================

-- 1. Extensions
-- ------------------------------------------------------------
create extension if not exists "postgis" with schema "extensions";
create extension if not exists "uuid-ossp" with schema "extensions";

-- 2. Custom Types
-- ------------------------------------------------------------
create type public.membership_type as enum ('ordentlich', 'ehrenmitglied', 'in_ausbildung');
create type public.approval_status as enum ('pending', 'approved', 'rejected');
create type public.deactivation_reason as enum ('manual', 'membership_expired', 'admin_action');
create type public.event_type as enum ('gv', 'workshop', 'weiterbildung', 'stammtisch', 'sonstiges');
create type public.registration_status as enum ('angemeldet', 'abgesagt', 'warteliste');
create type public.ce_category as enum ('hypnose', 'coaching', 'psychologie', 'medizin', 'business', 'sonstiges');
create type public.ce_format as enum ('praesenz', 'online', 'hybrid');
create type public.user_role as enum ('member', 'admin');

-- 3. Tables
-- ------------------------------------------------------------

-- 3a. Profiles (Therapeuten-Profile, extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text unique,
  title text,
  first_name text,
  last_name text,
  bio text,
  photo_url text,
  gallery_urls text[],
  email text,
  phone text,
  website text,
  street text,
  zip text,
  city text,
  canton text,
  country text not null default 'CH',
  latitude float8,
  longitude float8,
  location extensions.geography(Point, 4326),
  languages text[] default '{de}',
  specializations text[],
  certifications text[],
  insurance_recognized boolean not null default false,
  offers_online boolean not null default false,
  membership_type public.membership_type not null default 'ordentlich',
  membership_since date,
  membership_expires_at date,
  approval_status public.approval_status not null default 'pending',
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  deactivated_at timestamptz,
  deactivation_reason public.deactivation_reason,
  is_verified boolean not null default false,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  view_count int4 not null default 0,
  contact_count int4 not null default 0,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Therapeuten-Profile (extends auth.users)';

-- 3b. Specializations (Spezialisierungen-Katalog)
create table public.specializations (
  id uuid primary key default extensions.uuid_generate_v4(),
  name_de text not null,
  name_fr text,
  name_it text,
  slug text unique not null,
  icon text,
  sort_order int4 not null default 0
);
comment on table public.specializations is 'Spezialisierungen-Katalog für Hypnotherapie';

-- 3c. Contact Requests (Kontaktanfragen an Therapeuten)
create table public.contact_requests (
  id uuid primary key default extensions.uuid_generate_v4(),
  therapist_id uuid references public.profiles(id) on delete cascade,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table public.contact_requests is 'Kontaktanfragen von Besuchern an Therapeuten';

-- 3d. News (Blog/News-Beiträge)
create table public.news (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.news is 'Blog/News-Beiträge des Verbands';

-- 3e. Pages (Statische Seiten / CMS)
create table public.pages (
  id uuid primary key default extensions.uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  content text,
  meta_title text,
  meta_description text,
  updated_at timestamptz not null default now()
);
comment on table public.pages is 'CMS-Seiten (Über uns, Statuten, FAQ etc.)';

-- 3f. Documents (Verbandsdokumente)
create table public.documents (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  file_url text not null,
  is_public boolean not null default false,
  category text,
  created_at timestamptz not null default now()
);
comment on table public.documents is 'Verbandsdokumente (öffentlich + intern)';

-- 3g. Events (Verbandstermine)
create table public.events (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  event_type public.event_type not null default 'sonstiges',
  start_date timestamptz not null,
  end_date timestamptz,
  location_name text,
  location_address text,
  is_online boolean not null default false,
  online_link text,
  max_participants int4,
  registration_deadline timestamptz,
  cost decimal(10,2) not null default 0,
  is_published boolean not null default false,
  reminder_sent boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.events is 'Verbandstermine (GV, Workshops, Stammtisch etc.)';

-- 3h. Event Registrations (Anmeldungen)
create table public.event_registrations (
  id uuid primary key default extensions.uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.registration_status not null default 'angemeldet',
  notes text,
  registered_at timestamptz not null default now(),
  constraint unique_registration unique (event_id, user_id)
);
comment on table public.event_registrations is 'Event-Anmeldungen (1 pro Mitglied pro Event)';

-- 3i. Continuing Education (Weiterbildungs-Katalog)
create table public.continuing_education (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  provider text,
  provider_url text,
  category public.ce_category not null default 'hypnose',
  format public.ce_format not null default 'praesenz',
  duration text,
  cost_info text,
  is_vsh_recognized boolean not null default false,
  recognition_details text,
  contact_email text,
  is_published boolean not null default false,
  sort_order int4 not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.continuing_education is 'Weiterbildungs-Katalog (nur für Mitglieder sichtbar)';

-- 4. Indexes
-- ------------------------------------------------------------
create index idx_profiles_slug on public.profiles (slug);
create index idx_profiles_location on public.profiles using gist (location);
create index idx_profiles_approval on public.profiles (approval_status);
create index idx_profiles_published on public.profiles (is_published);
create index idx_profiles_canton on public.profiles (canton);
create index idx_news_slug on public.news (slug);
create index idx_news_published on public.news (is_published, published_at desc);
create index idx_pages_slug on public.pages (slug);
create index idx_events_start_date on public.events (start_date);
create index idx_events_published on public.events (is_published);
create index idx_documents_category on public.documents (category);
create index idx_contact_requests_therapist on public.contact_requests (therapist_id);
create index idx_ce_category on public.continuing_education (category);
create index idx_ce_published on public.continuing_education (is_published);

-- 5. Trigger Functions
-- ------------------------------------------------------------

-- 5a. Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.news
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.pages
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.continuing_education
  for each row execute function public.handle_updated_at();

-- 5b. Auto-update location from lat/lng (PostGIS)
create or replace function public.update_location()
returns trigger as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location := ST_SetSRID(ST_MakePoint(new.longitude, new.latitude), 4326)::extensions.geography;
  else
    new.location := null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_profile_location before insert or update of latitude, longitude on public.profiles
  for each row execute function public.update_location();

-- 5c. Auto-generate slug from name
create or replace function public.generate_profile_slug()
returns trigger as $$
declare
  base_slug text;
  final_slug text;
  counter int := 0;
begin
  if new.first_name is not null and new.last_name is not null then
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          unaccent(new.first_name || '-' || new.last_name),
          '[^a-z0-9\-]', '-', 'g'
        ),
        '-+', '-', 'g'
      )
    );
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;

    loop
      exit when not exists (
        select 1 from public.profiles where slug = final_slug and id != new.id
      );
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    end loop;

    new.slug := final_slug;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger generate_slug before insert or update of first_name, last_name on public.profiles
  for each row execute function public.generate_profile_slug();

-- 5d. Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Row Level Security (RLS)
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.specializations enable row level security;
alter table public.contact_requests enable row level security;
alter table public.news enable row level security;
alter table public.pages enable row level security;
alter table public.documents enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.continuing_education enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- 6a. Profiles
create policy "Published profiles are viewable by everyone"
  on public.profiles for select
  using (is_published = true and approval_status = 'approved' and deactivated_at is null);

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Members can view all member profiles"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- 6b. Specializations (read: everyone, write: admin)
create policy "Specializations viewable by everyone"
  on public.specializations for select
  using (true);

create policy "Admins can manage specializations"
  on public.specializations for all
  using (public.is_admin());

-- 6c. Contact Requests
create policy "Anyone can create contact requests"
  on public.contact_requests for insert
  with check (true);

create policy "Therapists can view own contact requests"
  on public.contact_requests for select
  using (auth.uid() = therapist_id);

create policy "Therapists can update own contact requests"
  on public.contact_requests for update
  using (auth.uid() = therapist_id);

create policy "Admins can manage all contact requests"
  on public.contact_requests for all
  using (public.is_admin());

-- 6d. News
create policy "Published news viewable by everyone"
  on public.news for select
  using (is_published = true);

create policy "Admins can manage news"
  on public.news for all
  using (public.is_admin());

-- 6e. Pages
create policy "Pages viewable by everyone"
  on public.pages for select
  using (true);

create policy "Admins can manage pages"
  on public.pages for all
  using (public.is_admin());

-- 6f. Documents
create policy "Public documents viewable by everyone"
  on public.documents for select
  using (is_public = true);

create policy "Members can view all documents"
  on public.documents for select
  using (auth.uid() is not null);

create policy "Admins can manage documents"
  on public.documents for all
  using (public.is_admin());

-- 6g. Events
create policy "Published events viewable by members"
  on public.events for select
  using (auth.uid() is not null and is_published = true);

create policy "Admins can manage events"
  on public.events for all
  using (public.is_admin());

-- 6h. Event Registrations
create policy "Users can view own registrations"
  on public.event_registrations for select
  using (auth.uid() = user_id);

create policy "Authenticated users can register"
  on public.event_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own registration"
  on public.event_registrations for update
  using (auth.uid() = user_id);

create policy "Admins can manage all registrations"
  on public.event_registrations for all
  using (public.is_admin());

-- 6i. Continuing Education
create policy "Published CE viewable by members"
  on public.continuing_education for select
  using (auth.uid() is not null and is_published = true);

create policy "Admins can manage CE"
  on public.continuing_education for all
  using (public.is_admin());

-- 7. Seed Data: Spezialisierungen
-- ------------------------------------------------------------
insert into public.specializations (name_de, slug, icon, sort_order) values
  ('Raucherentwöhnung', 'raucherentwoehnung', 'cigarette-off', 1),
  ('Gewichtsreduktion', 'gewichtsreduktion', 'scale', 2),
  ('Angst & Phobien', 'angst-phobien', 'shield-alert', 3),
  ('Schmerztherapie', 'schmerztherapie', 'heart-pulse', 4),
  ('Schlafstörungen', 'schlafstoerungen', 'moon', 5),
  ('Selbstvertrauen', 'selbstvertrauen', 'sparkles', 6),
  ('Stressbewältigung', 'stressbewaeltigung', 'brain', 7),
  ('Prüfungsangst', 'pruefungsangst', 'graduation-cap', 8),
  ('Kindhypnose', 'kindhypnose', 'baby', 9),
  ('Geburtsvorbereitung', 'geburtsvorbereitung', 'heart-handshake', 10),
  ('Trauerbegleitung', 'trauerbegleitung', 'hand-heart', 11),
  ('Suchttherapie', 'suchttherapie', 'pill', 12),
  ('Sporthypnose', 'sporthypnose', 'dumbbell', 13),
  ('Tinnitus', 'tinnitus', 'ear', 14),
  ('Allergie-Behandlung', 'allergie-behandlung', 'flower-2', 15),
  ('Regressionstherapie', 'regressionstherapie', 'history', 16);

-- 8. Seed Data: Default CMS Pages
-- ------------------------------------------------------------
insert into public.pages (slug, title, content, meta_title, meta_description) values
  ('ueber-uns', 'Über den Verband', '# Über den VSH

Der Verband Schweizer Hypnosetherapeuten (VSH) setzt sich für die Qualitätssicherung und Professionalisierung der Hypnosetherapie in der Schweiz ein.

## Mission

Wir fördern die Anerkennung der Hypnosetherapie als wirksame Behandlungsmethode und setzen uns für hohe Ausbildungsstandards ein.

## Geschichte

Der VSH wurde gegründet, um Hypnosetherapeuten in der Schweiz eine gemeinsame Plattform zu bieten.', 'Über den VSH – Verband Schweizer Hypnosetherapeuten', 'Der VSH setzt sich für die Qualitätssicherung und Professionalisierung der Hypnosetherapie in der Schweiz ein.'),
  ('statuten', 'Statuten', '# Verbandsstatuten

Die aktuellen Statuten des VSH können als PDF heruntergeladen werden.', 'Statuten – VSH', 'Die Statuten des Verbands Schweizer Hypnosetherapeuten.'),
  ('hypnosetherapie', 'Was ist Hypnosetherapie?', '# Was ist Hypnosetherapie?

Hypnosetherapie ist eine wissenschaftlich anerkannte Behandlungsmethode, die den natürlichen Zustand der Trance nutzt, um positive Veränderungen im Denken, Fühlen und Verhalten zu bewirken.

## Wie funktioniert Hypnose?

In der Hypnose wird ein Zustand fokussierter Aufmerksamkeit und tiefer Entspannung erreicht. In diesem Zustand ist das Unterbewusstsein besonders aufnahmefähig für positive Suggestionen und Veränderungsimpulse.

## Anwendungsgebiete

- Raucherentwöhnung
- Gewichtsreduktion
- Angst und Phobien
- Schmerztherapie
- Schlafstörungen
- Stressbewältigung
- und viele weitere...

## Ist Hypnose sicher?

Ja. Hypnosetherapie, durchgeführt von einem qualifizierten Therapeuten, ist eine sichere Behandlungsmethode. Sie behalten jederzeit die Kontrolle und können die Hypnose selbst beenden.', 'Was ist Hypnosetherapie? – VSH', 'Erfahren Sie alles über Hypnosetherapie: Wie sie funktioniert, Anwendungsgebiete und Wirksamkeit.'),
  ('faq', 'Häufige Fragen', '# Häufige Fragen (FAQ)

## Zur Hypnosetherapie

**Kann jeder hypnotisiert werden?**
Die meisten Menschen können hypnotisiert werden. Die Tiefe der Trance variiert von Person zu Person.

**Verliere ich die Kontrolle?**
Nein. Sie sind jederzeit bei Bewusstsein und können die Hypnose selbst beenden.

**Wie viele Sitzungen brauche ich?**
Das hängt vom Anliegen ab. Für Raucherentwöhnung reichen oft 1–3 Sitzungen, bei komplexeren Themen können mehr Sitzungen nötig sein.

## Zum Verband

**Wie werde ich VSH-Mitglied?**
Sie müssen eine anerkannte Ausbildung in Hypnosetherapie nachweisen. Details finden Sie unter «Mitglied werden».

**Was kostet die Mitgliedschaft?**
Die Beiträge sind abhängig vom Mitgliedschaftstyp. Details erfahren Sie im Antragsformular.', 'FAQ – Häufige Fragen zur Hypnosetherapie | VSH', 'Antworten auf häufige Fragen zur Hypnosetherapie und zum Verband Schweizer Hypnosetherapeuten.'),
  ('datenschutz', 'Datenschutzerklärung', '# Datenschutzerklärung

*(Platzhalter – muss rechtlich geprüft und ergänzt werden)*', 'Datenschutz – VSH', 'Datenschutzerklärung des Verbands Schweizer Hypnosetherapeuten.'),
  ('impressum', 'Impressum', '# Impressum

**Verband Schweizer Hypnosetherapeuten (VSH)**

*(Adresse und weitere Angaben ergänzen)*', 'Impressum – VSH', 'Impressum des Verbands Schweizer Hypnosetherapeuten.');
