-- =========================================================
-- CRAFTERIS STUDIO
-- CURRENT SCHEMA UPDATES
-- Migration: 002
--
-- Run AFTER:
--   001_initial_schema.sql
--
-- Purpose:
-- Bring the original schema up to the current live
-- Crafteris Studio Supabase structure.
-- =========================================================


-- =========================================================
-- PAGE SECTIONS
-- Additional CMS fields added after the initial schema.
-- =========================================================

alter table public.page_sections
add column if not exists secondary_button_label text;

alter table public.page_sections
add column if not exists secondary_button_url text;

alter table public.page_sections
add column if not exists content jsonb
not null
default '{}'::jsonb;

alter table public.page_sections
add column if not exists admin_label text;

alter table public.page_sections
add column if not exists section_type text;


-- Ensure each section key is unique inside a page.

create unique index if not exists
page_sections_page_key_section_key_unique
on public.page_sections (
  page_key,
  section_key
);


-- =========================================================
-- PRODUCTS
-- Current application uses the newer "stock" field.
--
-- The old stock_quantity column is intentionally kept
-- because it still exists in the current live database.
-- =========================================================

alter table public.products
add column if not exists stock integer
not null
default 0;


-- Ensure stock can never be negative.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_stock_nonnegative'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
    add constraint products_stock_nonnegative
    check (stock >= 0);
  end if;
end
$$;


-- =========================================================
-- CONTACT ENQUIRIES
--
-- The current live database contains:
--   first_name
--   last_name
--   names
--
-- first_name and last_name are now nullable.
-- =========================================================

alter table public.contact_enquiries
add column if not exists names text;

alter table public.contact_enquiries
alter column first_name drop not null;

alter table public.contact_enquiries
alter column last_name drop not null;


-- =========================================================
-- ADMIN HELPER FUNCTION
--
-- This is the current working version.
-- Keep search_path = public.
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


-- Allow Supabase browser roles to call the helper function.

revoke all
on function public.is_admin()
from public;

grant execute
on function public.is_admin()
to anon, authenticated;


-- =========================================================
-- CURRENT RLS POLICIES
--
-- Old policies are removed first so this migration can
-- recreate the current live policy configuration.
-- =========================================================


-- =========================================================
-- CONTACT ENQUIRIES
-- =========================================================

drop policy if exists
"Anyone can create contact enquiries"
on public.contact_enquiries;

drop policy if exists
"Public can submit contact enquiries"
on public.contact_enquiries;

drop policy if exists
"Admins can read contact enquiries"
on public.contact_enquiries;

drop policy if exists
"Admins can update contact enquiries"
on public.contact_enquiries;

drop policy if exists
"Admins can delete contact enquiries"
on public.contact_enquiries;


create policy
"Public can submit contact enquiries"
on public.contact_enquiries
for insert
to anon, authenticated
with check (true);


create policy
"Admins can read contact enquiries"
on public.contact_enquiries
for select
to public
using (public.is_admin());


create policy
"Admins can update contact enquiries"
on public.contact_enquiries
for update
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Admins can delete contact enquiries"
on public.contact_enquiries
for delete
to public
using (public.is_admin());


-- =========================================================
-- SITE SETTINGS
--
-- Current configuration uses separate policies rather
-- than one broad ALL policy.
-- =========================================================

drop policy if exists
"Admins manage site settings"
on public.site_settings;

drop policy if exists
"Admins can insert site settings"
on public.site_settings;

drop policy if exists
"Admins can update site settings"
on public.site_settings;

drop policy if exists
"Admins can delete site settings"
on public.site_settings;

drop policy if exists
"Public can read site settings"
on public.site_settings;


create policy
"Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);


create policy
"Admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());


create policy
"Admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


create policy
"Admins can delete site settings"
on public.site_settings
for delete
to authenticated
using (public.is_admin());


-- =========================================================
-- PAGE SECTIONS
-- =========================================================

drop policy if exists
"Admins manage page sections"
on public.page_sections;

drop policy if exists
"Public can read visible page sections"
on public.page_sections;


create policy
"Admins manage page sections"
on public.page_sections
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read visible page sections"
on public.page_sections
for select
to public
using (is_visible = true);


-- =========================================================
-- WORKSHOPS
-- =========================================================

drop policy if exists
"Admins manage workshops"
on public.workshops;

drop policy if exists
"Public can read published workshops"
on public.workshops;


create policy
"Admins manage workshops"
on public.workshops
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read published workshops"
on public.workshops
for select
to public
using (
  status = 'published'::public.content_status
);


-- =========================================================
-- WORKSHOP SESSIONS
--
-- Public users may only see sessions belonging to a
-- published workshop, and cancelled sessions are hidden.
-- =========================================================

drop policy if exists
"Admins manage workshop sessions"
on public.workshop_sessions;

drop policy if exists
"Public can read workshop sessions"
on public.workshop_sessions;


create policy
"Admins manage workshop sessions"
on public.workshop_sessions
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read workshop sessions"
on public.workshop_sessions
for select
to public
using (
  is_cancelled = false
  and exists (
    select 1
    from public.workshops
    where workshops.id =
      workshop_sessions.workshop_id
      and workshops.status =
        'published'::public.content_status
  )
);


-- =========================================================
-- PROGRAMMES
-- =========================================================

drop policy if exists
"Admins manage programmes"
on public.programmes;

drop policy if exists
"Public can read published programmes"
on public.programmes;


create policy
"Admins manage programmes"
on public.programmes
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read published programmes"
on public.programmes
for select
to public
using (
  status = 'published'::public.content_status
);


-- =========================================================
-- PROGRAMME SESSIONS
--
-- Public users may only see sessions belonging to a
-- published programme.
-- =========================================================

drop policy if exists
"Admins manage programme sessions"
on public.programme_sessions;

drop policy if exists
"Public can read programme sessions"
on public.programme_sessions;


create policy
"Admins manage programme sessions"
on public.programme_sessions
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read programme sessions"
on public.programme_sessions
for select
to public
using (
  exists (
    select 1
    from public.programmes
    where programmes.id =
      programme_sessions.programme_id
      and programmes.status =
        'published'::public.content_status
  )
);


-- =========================================================
-- MEMBERSHIP PLANS
-- =========================================================

drop policy if exists
"Admins manage memberships"
on public.membership_plans;

drop policy if exists
"Public can read published memberships"
on public.membership_plans;


create policy
"Admins manage memberships"
on public.membership_plans
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read published memberships"
on public.membership_plans
for select
to public
using (
  status = 'published'::public.content_status
);


-- =========================================================
-- PRODUCTS
-- =========================================================

drop policy if exists
"Admins manage products"
on public.products;

drop policy if exists
"Public can read published products"
on public.products;


create policy
"Admins manage products"
on public.products
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read published products"
on public.products
for select
to public
using (
  status = 'published'::public.content_status
);


-- =========================================================
-- GIFT VOUCHERS
-- =========================================================

drop policy if exists
"Admins manage vouchers"
on public.gift_voucher_options;

drop policy if exists
"Public can read published vouchers"
on public.gift_voucher_options;


create policy
"Admins manage vouchers"
on public.gift_voucher_options
for all
to public
using (public.is_admin())
with check (public.is_admin());


create policy
"Public can read published vouchers"
on public.gift_voucher_options
for select
to public
using (
  status = 'published'::public.content_status
);


-- =========================================================
-- PROFILES
-- =========================================================

drop policy if exists
"Users can read own profile"
on public.profiles;

drop policy if exists
"Admins can read all profiles"
on public.profiles;

drop policy if exists
"Admins can update profiles"
on public.profiles;


create policy
"Users can read own profile"
on public.profiles
for select
to public
using (
  auth.uid() = id
);


create policy
"Admins can read all profiles"
on public.profiles
for select
to public
using (
  public.is_admin()
);


create policy
"Admins can update profiles"
on public.profiles
for update
to public
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- =========================================================
-- STORAGE BUCKET
--
-- Current live project has one public bucket:
--
--   studio-media
--
-- Public bucket means files can be displayed through
-- their public URLs.
--
-- Upload / update / delete management remains restricted
-- to authenticated admins.
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'studio-media',
  'studio-media',
  true
)
on conflict (id)
do update set
  public = excluded.public;


-- =========================================================
-- STORAGE POLICIES
-- =========================================================

drop policy if exists
"Admins can view studio media"
on storage.objects;

drop policy if exists
"Admins can upload studio media"
on storage.objects;

drop policy if exists
"Admins can update studio media"
on storage.objects;

drop policy if exists
"Admins can delete studio media"
on storage.objects;


create policy
"Admins can view studio media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'studio-media'
  and public.is_admin()
);


create policy
"Admins can upload studio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'studio-media'
  and public.is_admin()
);


create policy
"Admins can update studio media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'studio-media'
  and public.is_admin()
)
with check (
  bucket_id = 'studio-media'
  and public.is_admin()
);


create policy
"Admins can delete studio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'studio-media'
  and public.is_admin()
);


-- =========================================================
-- API SCHEMA CACHE
-- =========================================================

notify pgrst, 'reload schema';


-- =========================================================
-- END OF MIGRATION
-- =========================================================