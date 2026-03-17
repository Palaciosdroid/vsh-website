-- ============================================================
-- VSH Website – Phase 4: Notification Preferences + Storage
-- ============================================================

-- 1. Add notification preferences to profiles
alter table public.profiles
  add column if not exists notification_contact_email boolean not null default true,
  add column if not exists notification_event_reminder boolean not null default true,
  add column if not exists notification_news boolean not null default false;

-- 2. Create storage bucket for profile photos (run in Supabase Dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- 3. Add reminder_sent_7d and reminder_sent_1d to events for multi-stage reminders
alter table public.events
  add column if not exists reminder_sent_7d boolean not null default false,
  add column if not exists reminder_sent_1d boolean not null default false;

-- 4. Event registrations: allow admins to view all registrations for their events
create policy "Admins can view all event registrations"
  on public.event_registrations for select
  using (public.is_admin());
