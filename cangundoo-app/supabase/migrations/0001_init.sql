create extension if not exists "pgcrypto";

create type public.user_role as enum ('buyer', 'seller', 'admin');
create type public.property_status as enum ('draft', 'published', 'archived');
create type public.message_type as enum ('text', 'ai_suggestion');

create table if not exists public.users (
  id uuid primary key references auth.users(id),
  name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  role user_role default 'buyer',
  push_token text,
  created_at timestamptz default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  title text not null,
  description text,
  price_kz numeric not null,
  location text not null,
  city text,
  property_type text not null,
  bedrooms int default 0,
  bathrooms int default 0,
  area_m2 int default 0,
  status property_status default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  created_at timestamptz default now()
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.users(id),
  seller_id uuid not null references public.users(id),
  property_id uuid not null references public.properties(id),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.users(id),
  content text not null,
  type message_type default 'text',
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.user_favorites (
  user_id uuid not null references public.users(id),
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, property_id)
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  type text not null,
  payload jsonb,
  response jsonb,
  created_at timestamptz default now()
);

alter table public.properties
  add constraint properties_price_positive check (price_kz > 0);

create index if not exists properties_city_idx on public.properties(city);
create index if not exists properties_type_idx on public.properties(property_type);
create index if not exists properties_status_idx on public.properties(status);

-- Row Level Security policies
alter table public.users enable row level security;
create policy "Users can manage own profile" on public.users
  for select using (auth.uid() = id)
  with check (auth.uid() = id);

alter table public.properties enable row level security;
create policy "Published properties accessible" on public.properties
  for select using (status = 'published' or auth.uid() = user_id);
create policy "Users manage own properties" on public.properties
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.property_images enable row level security;
create policy "Owners manage property images" on public.property_images
  using (auth.uid() = (select user_id from public.properties where id = property_id))
  with check (auth.uid() = (select user_id from public.properties where id = property_id));

alter table public.chats enable row level security;
create policy "Participants access chats" on public.chats
  using (auth.uid() in (buyer_id, seller_id))
  with check (auth.uid() in (buyer_id, seller_id));

alter table public.messages enable row level security;
create policy "Participants send and read messages" on public.messages
  using (auth.uid() in (select buyer_id from public.chats where id = chat_id) or auth.uid() in (select seller_id from public.chats where id = chat_id))
  with check (auth.uid() in (select buyer_id from public.chats where id = chat_id) or auth.uid() in (select seller_id from public.chats where id = chat_id));

alter table public.user_favorites enable row level security;
create policy "Users manage favorites" on public.user_favorites
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
