create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  gender text,
  age int,
  height int,
  weight int,
  skin_tone text,
  preferred_styles text[] default '{}',
  city text default 'shanghai',
  reminder_time text default '08:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  category text not null,
  color text not null,
  material text,
  size text,
  brand text,
  price numeric,
  occasions text[] default '{}',
  seasons text[] default '{}',
  style_tags text[] default '{}',
  status text default 'active',
  favorite boolean default false,
  image_uri text,
  notes text,
  worn_count int default 0,
  last_worn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outfits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  item_ids text[] not null,
  occasion text not null,
  style text not null,
  score int default 80,
  note text,
  weather_hint text,
  source text default 'manual',
  tags text[] default '{}',
  last_worn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_clothing_items_updated_at on public.clothing_items;
create trigger trg_clothing_items_updated_at
before update on public.clothing_items
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_outfits_updated_at on public.outfits;
create trigger trg_outfits_updated_at
before update on public.outfits
for each row execute procedure public.set_updated_at();
