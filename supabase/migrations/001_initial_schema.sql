-- =========================================================
-- CRAFTERIS STUDIO
-- INITIAL DATABASE SCHEMA
-- =========================================================


-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";


-- =========================================================
-- ENUMS
-- =========================================================

do $$
begin
  create type public.user_role as enum ('admin', 'staff');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_status as enum (
    'draft',
    'published',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;


-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text,
  last_name text,

  role public.user_role not null default 'staff',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- SITE SETTINGS
-- =========================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),

  site_name text not null default 'Crafteris',

  email text,
  phone text,
  address text,

  instagram_url text,
  facebook_url text,

  opening_hours jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- PAGE SECTIONS
-- Allows admin to edit general public page content.
-- =========================================================

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),

  page_key text not null,
  section_key text not null,

  eyebrow text,
  title text,
  subtitle text,
  body text,

  image_url text,

  button_label text,
  button_url text,

  is_visible boolean not null default true,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(page_key, section_key)
);


-- =========================================================
-- WORKSHOPS
-- =========================================================

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  slug text not null unique,

  category text not null,

  short_description text,
  description text,

  image_url text,

  duration_minutes integer,

  level text,

  base_price numeric(10,2),

  status public.content_status not null default 'draft',

  is_featured boolean not null default false,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- WORKSHOP SESSIONS
-- Individual dates for workshops.
-- =========================================================

create table if not exists public.workshop_sessions (
  id uuid primary key default gen_random_uuid(),

  workshop_id uuid not null
    references public.workshops(id)
    on delete cascade,

  starts_at timestamptz not null,

  ends_at timestamptz,

  capacity integer not null default 1,

  booked_places integer not null default 0,

  price numeric(10,2),

  is_cancelled boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint workshop_capacity_positive
    check (capacity > 0),

  constraint workshop_booked_places_valid
    check (
      booked_places >= 0
      and booked_places <= capacity
    )
);


-- =========================================================
-- PROGRAMMES / COURSES
-- =========================================================

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  slug text not null unique,

  category text not null,

  short_description text,
  description text,

  image_url text,

  number_of_sessions integer,

  session_duration_minutes integer,

  level text,

  base_price numeric(10,2),

  status public.content_status not null default 'draft',

  is_featured boolean not null default false,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- PROGRAMME DATES
-- =========================================================

create table if not exists public.programme_sessions (
  id uuid primary key default gen_random_uuid(),

  programme_id uuid not null
    references public.programmes(id)
    on delete cascade,

  starts_at timestamptz not null,

  ends_at timestamptz,

  session_number integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- MEMBERSHIP PLANS
-- =========================================================

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  slug text not null unique,

  category text not null,

  description text,

  price numeric(10,2),

  billing_label text,

  included_hours numeric(10,2),

  validity_months integer,

  hours_per_week numeric(10,2),

  features jsonb not null default '[]'::jsonb,

  image_url text,

  status public.content_status not null default 'draft',

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- SHOP PRODUCTS
-- =========================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  slug text not null unique,

  category text not null,

  description text,

  price numeric(10,2) not null,

  image_url text,

  stock_quantity integer,

  status public.content_status not null default 'draft',

  is_featured boolean not null default false,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint product_stock_valid
    check (
      stock_quantity is null
      or stock_quantity >= 0
    )
);


-- =========================================================
-- GIFT VOUCHER OPTIONS
-- =========================================================

create table if not exists public.gift_voucher_options (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  amount numeric(10,2),

  description text,

  is_custom_amount boolean not null default false,

  status public.content_status not null default 'draft',

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- CONTACT ENQUIRIES
-- =========================================================

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),

  first_name text not null,
  last_name text not null,

  email text not null,
  phone text,

  reason text,

  group_size integer,

  message text not null,

  is_read boolean not null default false,

  created_at timestamptz not null default now()
);


-- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

drop trigger if exists set_profiles_updated_at
on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();


drop trigger if exists set_site_settings_updated_at
on public.site_settings;

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();


drop trigger if exists set_page_sections_updated_at
on public.page_sections;

create trigger set_page_sections_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();


drop trigger if exists set_workshops_updated_at
on public.workshops;

create trigger set_workshops_updated_at
before update on public.workshops
for each row execute function public.set_updated_at();


drop trigger if exists set_workshop_sessions_updated_at
on public.workshop_sessions;

create trigger set_workshop_sessions_updated_at
before update on public.workshop_sessions
for each row execute function public.set_updated_at();


drop trigger if exists set_programmes_updated_at
on public.programmes;

create trigger set_programmes_updated_at
before update on public.programmes
for each row execute function public.set_updated_at();


drop trigger if exists set_programme_sessions_updated_at
on public.programme_sessions;

create trigger set_programme_sessions_updated_at
before update on public.programme_sessions
for each row execute function public.set_updated_at();


drop trigger if exists set_membership_plans_updated_at
on public.membership_plans;

create trigger set_membership_plans_updated_at
before update on public.membership_plans
for each row execute function public.set_updated_at();


drop trigger if exists set_products_updated_at
on public.products;

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();


drop trigger if exists set_gift_voucher_options_updated_at
on public.gift_voucher_options;

create trigger set_gift_voucher_options_updated_at
before update on public.gift_voucher_options
for each row execute function public.set_updated_at();


-- =========================================================
-- ADMIN HELPER
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


-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_sections enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_sessions enable row level security;
alter table public.programmes enable row level security;
alter table public.programme_sessions enable row level security;
alter table public.membership_plans enable row level security;
alter table public.products enable row level security;
alter table public.gift_voucher_options enable row level security;
alter table public.contact_enquiries enable row level security;


-- =========================================================
-- PUBLIC READ POLICIES
-- =========================================================

create policy "Public can read site settings"
on public.site_settings
for select
using (true);


create policy "Public can read visible page sections"
on public.page_sections
for select
using (is_visible = true);


create policy "Public can read published workshops"
on public.workshops
for select
using (status = 'published');


create policy "Public can read workshop sessions"
on public.workshop_sessions
for select
using (
  is_cancelled = false
);


create policy "Public can read published programmes"
on public.programmes
for select
using (status = 'published');


create policy "Public can read programme sessions"
on public.programme_sessions
for select
using (true);


create policy "Public can read published memberships"
on public.membership_plans
for select
using (status = 'published');


create policy "Public can read published products"
on public.products
for select
using (status = 'published');


create policy "Public can read published vouchers"
on public.gift_voucher_options
for select
using (status = 'published');


-- =========================================================
-- PROFILE POLICIES
-- =========================================================

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);


create policy "Admins can read all profiles"
on public.profiles
for select
using (public.is_admin());


create policy "Admins can update profiles"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- ADMIN CONTENT POLICIES
-- =========================================================

create policy "Admins manage site settings"
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage page sections"
on public.page_sections
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage workshops"
on public.workshops
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage workshop sessions"
on public.workshop_sessions
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage programmes"
on public.programmes
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage programme sessions"
on public.programme_sessions
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage memberships"
on public.membership_plans
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());


create policy "Admins manage vouchers"
on public.gift_voucher_options
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- CONTACT FORM
-- Anybody can submit an enquiry.
-- Only admins can read/update/delete them.
-- =========================================================

create policy "Anyone can create contact enquiries"
on public.contact_enquiries
for insert
with check (true);


create policy "Admins can read contact enquiries"
on public.contact_enquiries
for select
using (public.is_admin());


create policy "Admins can update contact enquiries"
on public.contact_enquiries
for update
using (public.is_admin())
with check (public.is_admin());


create policy "Admins can delete contact enquiries"
on public.contact_enquiries
for delete
using (public.is_admin());


-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists workshops_status_idx
on public.workshops(status);

create index if not exists workshops_category_idx
on public.workshops(category);

create index if not exists workshop_sessions_start_idx
on public.workshop_sessions(starts_at);

create index if not exists workshop_sessions_workshop_idx
on public.workshop_sessions(workshop_id);

create index if not exists programmes_status_idx
on public.programmes(status);

create index if not exists programme_sessions_programme_idx
on public.programme_sessions(programme_id);

create index if not exists membership_plans_status_idx
on public.membership_plans(status);

create index if not exists products_status_idx
on public.products(status);

create index if not exists products_category_idx
on public.products(category);

create index if not exists page_sections_page_idx
on public.page_sections(page_key);

create index if not exists enquiries_created_idx
on public.contact_enquiries(created_at desc);