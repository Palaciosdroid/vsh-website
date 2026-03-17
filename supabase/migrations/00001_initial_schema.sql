-- ============================================================
-- VSH Website – Initial Database Schema
-- ============================================================

-- 1. Extensions
-- ------------------------------------------------------------
create extension if not exists "postgis" with schema "extensions";
create extension if not exists "uuid-ossp" with schema "extensions";

-- 2. Custom Types
-- ------------------------------------------------------------
create type public.user_role as enum ('member', 'admin');
create type public.contact_status as enum ('new', 'in_progress', 'resolved');
create type public.event_status as enum ('draft', 'published', 'cancelled');
create type public.registration_status as enum ('registered', 'waitlist', 'cancelled');
create type public.page_status as enum ('draft', 'published');
create type public.ce_status as enum ('planned', 'open', 'full', 'completed', 'cancelled');

-- 3. Tables
-- ------------------------------------------------------------

-- 3a. Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  title text,
  phone text,
  role public.user_role not null default 'member',
  avatar_url text,
  bio text,
  website text,
  address_street text,
  address_zip text,
  address_city text,
  address_country text default 'CH',
  location extensions.geography(Point, 4326),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'User profiles extending Supabase auth.users';

-- 3b. Specializations
create table public.specializations (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);
comment on table public.specializations is 'Veterinary specializations / Fachgebiete';

-- 3c. Profile <-> Specialization (many-to-many)
create table public.profile_specializations (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  specialization_id uuid not null references public.specializations(id) on delete cascade,
  primary key (profile_id, specialization_id)
);

-- 3d. News / Aktuelles
create table public.news (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.news is 'News articles / Aktuelles';

-- 3e. Pages (CMS-style static pages)
create table public.pages (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  status public.page_status not null default 'draft',
  meta_description text,
  author_id uuid references public.profiles(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.pages is 'CMS static pages';

-- 3f. Documents
create table public.documents (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  file_url text not null,
  file_type text,
  file_size_bytes bigint,
  category text,
  is_members_only boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.documents is 'Downloadable documents and files';

-- 3g. Contact Requests
create table public.contact_requests (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status public.contact_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.contact_requests is 'Contact form submissions';

-- 3h. Events / Veranstaltungen
create table public.events (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  content text,
  cover_image_url text,
  location_name text,
  location_address text,
  location_geo extensions.geography(Point, 4326),
  starts_at timestamptz not null,
  ends_at timestamptz,
  max_participants integer,
  status public.event_status not null default 'draft',
  is_members_only boolean not null default false,
  organizer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.events is 'Events / Veranstaltungen';

-- 3i. Event Registrations
create table public.event_registrations (
  id uuid primary key default extensions.uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.registration_status not null default 'registered',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);
comment on table public.event_registrations is 'Event registrations per user';

-- 3j. Continuing Education / Weiterbildung
create table public.continuing_education (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  content text,
  cover_image_url text,
  location_name text,
  location_address text,
  location_geo extensions.geography(Point, 4326),
  starts_at timestamptz not null,
  ends_at timestamptz,
  max_participants integer,
  credits numeric(5,1),
  price_members numeric(10,2),
  price_non_members numeric(10,2),
  status public.ce_status not null default 'planned',
  organizer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.continuing_education is 'Continuing education courses / Weiterbildung';

-- 4. Indexes
-- ------------------------------------------------------------
create index idx_profiles_location on public.profiles using gist (location);
create index idx_profiles_role on public.profiles (role);
create index idx_news_slug on public.news (slug);
create index idx_news_published on public.news (published, published_at desc);
create index idx_pages_slug on public.pages (slug);
create index idx_pages_status on public.pages (status);
create index idx_events_slug on public.events (slug);
create index idx_events_starts_at on public.events (starts_at);
create index idx_events_status on public.events (status);
create index idx_events_location on public.events using gist (location_geo);
create index idx_ce_slug on public.continuing_education (slug);
create index idx_ce_starts_at on public.continuing_education (starts_at);
create index idx_ce_status on public.continuing_education (status);
create index idx_ce_location on public.continuing_education using gist (location_geo);
create index idx_documents_category on public.documents (category);
create index idx_contact_requests_status on public.contact_requests (status);

-- 5. Updated_at Trigger Function
-- ------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.news
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.pages
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.documents
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.contact_requests
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.event_registrations
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.continuing_education
  for each row execute function public.handle_updated_at();

-- 6. Geocoding Trigger (address → location point)
-- ------------------------------------------------------------
create or replace function public.handle_profile_geocode()
returns trigger as $$
begin
  -- Placeholder: In production, call an external geocoding service.
  -- For now, we ensure location is nullable and can be set via API.
  -- When address fields change and location is not explicitly set,
  -- set location to null so it can be geocoded asynchronously.
  if (
    new.address_street is distinct from old.address_street or
    new.address_zip is distinct from old.address_zip or
    new.address_city is distinct from old.address_city
  ) and new.location is not distinct from old.location then
    new.location = null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger geocode_profile before update on public.profiles
  for each row execute function public.handle_profile_geocode();

-- 7. Auto-create profile on user signup
-- ------------------------------------------------------------
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

-- 8. Row Level Security (RLS)
-- ------------------------------------------------------------

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.specializations enable row level security;
alter table public.profile_specializations enable row level security;
alter table public.news enable row level security;
alter table public.pages enable row level security;
alter table public.documents enable row level security;
alter table public.contact_requests enable row level security;
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

-- 8a. Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (is_public = true);

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- 8b. Specializations (read: everyone, write: admin)
create policy "Specializations are viewable by everyone"
  on public.specializations for select
  using (true);

create policy "Admins can manage specializations"
  on public.specializations for all
  using (public.is_admin());

-- 8c. Profile Specializations
create policy "Profile specializations are viewable by everyone"
  on public.profile_specializations for select
  using (true);

create policy "Users can manage own specializations"
  on public.profile_specializations for all
  using (auth.uid() = profile_id);

create policy "Admins can manage all profile specializations"
  on public.profile_specializations for all
  using (public.is_admin());

-- 8d. News
create policy "Published news is viewable by everyone"
  on public.news for select
  using (published = true);

create policy "Admins can view all news"
  on public.news for select
  using (public.is_admin());

create policy "Admins can manage news"
  on public.news for all
  using (public.is_admin());

-- 8e. Pages
create policy "Published pages are viewable by everyone"
  on public.pages for select
  using (status = 'published');

create policy "Admins can view all pages"
  on public.pages for select
  using (public.is_admin());

create policy "Admins can manage pages"
  on public.pages for all
  using (public.is_admin());

-- 8f. Documents
create policy "Public documents are viewable by everyone"
  on public.documents for select
  using (is_members_only = false);

create policy "Members can view members-only documents"
  on public.documents for select
  using (auth.uid() is not null);

create policy "Admins can manage documents"
  on public.documents for all
  using (public.is_admin());

-- 8g. Contact Requests
create policy "Anyone can create contact requests"
  on public.contact_requests for insert
  with check (true);

create policy "Admins can view and manage contact requests"
  on public.contact_requests for all
  using (public.is_admin());

-- 8h. Events
create policy "Published events are viewable by everyone"
  on public.events for select
  using (status = 'published');

create policy "Admins can view all events"
  on public.events for select
  using (public.is_admin());

create policy "Admins can manage events"
  on public.events for all
  using (public.is_admin());

-- 8i. Event Registrations
create policy "Users can view own registrations"
  on public.event_registrations for select
  using (auth.uid() = user_id);

create policy "Authenticated users can register for events"
  on public.event_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own registration"
  on public.event_registrations for update
  using (auth.uid() = user_id);

create policy "Admins can manage all registrations"
  on public.event_registrations for all
  using (public.is_admin());

-- 8j. Continuing Education
create policy "Published CE courses are viewable by everyone"
  on public.continuing_education for select
  using (status in ('open', 'full', 'completed'));

create policy "Admins can view all CE courses"
  on public.continuing_education for select
  using (public.is_admin());

create policy "Admins can manage CE courses"
  on public.continuing_education for all
  using (public.is_admin());

-- 9. Seed Data: Default specializations
-- ------------------------------------------------------------
insert into public.specializations (name, description) values
  ('Kleintiermedizin', 'Behandlung von Haustieren wie Hunden und Katzen'),
  ('Grosstiermedizin', 'Behandlung von Nutztieren und Pferden'),
  ('Pferdemedizin', 'Spezialisierung auf Pferde'),
  ('Exotische Tiere', 'Behandlung von Reptilien, Vögeln und exotischen Tieren'),
  ('Chirurgie', 'Veterinärchirurgische Eingriffe'),
  ('Dermatologie', 'Hauterkrankungen bei Tieren'),
  ('Kardiologie', 'Herzerkrankungen bei Tieren'),
  ('Onkologie', 'Tumorerkrankungen bei Tieren'),
  ('Neurologie', 'Neurologische Erkrankungen bei Tieren'),
  ('Ophthalmologie', 'Augenerkrankungen bei Tieren'),
  ('Zahnmedizin', 'Zahnbehandlungen bei Tieren'),
  ('Notfallmedizin', 'Notfall- und Intensivmedizin'),
  ('Reproduktionsmedizin', 'Fortpflanzungsmedizin und Geburtshilfe'),
  ('Labordiagnostik', 'Klinische Labordiagnostik'),
  ('Pathologie', 'Veterinärpathologie');
