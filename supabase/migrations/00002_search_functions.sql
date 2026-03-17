-- ============================================================
-- VSH Website – Phase 3: Search Functions & View Counter
-- ============================================================

-- 1. Proximity search function (PostGIS)
-- Returns therapists within a radius, sorted by distance
-- ============================================================
create or replace function public.search_therapists_nearby(
  search_lat float8,
  search_lng float8,
  radius_km float8 default 50,
  filter_specialization text default null,
  filter_language text default null,
  filter_canton text default null,
  filter_online boolean default null,
  filter_insurance boolean default null,
  sort_by text default 'distance',
  result_limit int default 20,
  result_offset int default 0
)
returns table (
  id uuid,
  slug text,
  first_name text,
  last_name text,
  title text,
  photo_url text,
  bio text,
  city text,
  canton text,
  latitude float8,
  longitude float8,
  specializations text[],
  languages text[],
  insurance_recognized boolean,
  offers_online boolean,
  distance_km float8
)
language plpgsql
stable
security definer
as $$
begin
  return query
  select
    p.id,
    p.slug,
    p.first_name,
    p.last_name,
    p.title,
    p.photo_url,
    p.bio,
    p.city,
    p.canton,
    p.latitude,
    p.longitude,
    p.specializations,
    p.languages,
    p.insurance_recognized,
    p.offers_online,
    round(
      (ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::extensions.geography
      ) / 1000)::numeric, 1
    )::float8 as distance_km
  from public.profiles p
  where
    p.is_published = true
    and p.approval_status = 'approved'
    and p.deactivated_at is null
    and p.location is not null
    and ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::extensions.geography,
      radius_km * 1000 -- meters
    )
    and (filter_specialization is null or p.specializations @> array[filter_specialization])
    and (filter_language is null or p.languages @> array[filter_language])
    and (filter_canton is null or p.canton = filter_canton)
    and (filter_online is null or p.offers_online = filter_online)
    and (filter_insurance is null or p.insurance_recognized = filter_insurance)
  order by
    case when sort_by = 'distance' then
      ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::extensions.geography
      )
    end asc nulls last,
    case when sort_by = 'name' then p.last_name end asc,
    case when sort_by = 'newest' then p.created_at end desc
  limit result_limit
  offset result_offset;
end;
$$;

-- Grant execute to anon and authenticated
grant execute on function public.search_therapists_nearby to anon, authenticated;

-- 2. Increment view count function (atomic)
-- ============================================================
create or replace function public.increment_view_count(profile_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set view_count = view_count + 1
  where id = profile_id
    and is_published = true;
end;
$$;

-- Grant execute to anon and authenticated
grant execute on function public.increment_view_count to anon, authenticated;
