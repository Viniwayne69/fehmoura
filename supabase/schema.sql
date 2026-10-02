-- =====================================================================
-- DJ Feh Moura — estrutura do banco de dados (Supabase / PostgreSQL)
-- Cole tudo no Supabase em: SQL Editor > New query > Run
-- =====================================================================

-- ---------- Eventos da agenda ----------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  title       text not null,
  city        text not null,
  venue       text,
  ticket_url  text,
  status      text not null default 'confirmado'
              check (status in ('confirmado','ultimos','esgotado','cancelado')),
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists events_starts_at_idx on public.events (starts_at);

-- ---------- Fotos da galeria ----------
create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  path        text not null,            -- caminho no bucket "galeria"
  url         text not null,            -- URL pública
  alt         text not null default '',
  category    text not null default 'clubes'
              check (category in ('clubes','festivais','privados')),
  featured    boolean not null default false,
  position    integer not null default 0,
  width       integer,
  height      integer,
  created_at  timestamptz not null default now()
);
create index if not exists photos_position_idx on public.photos (position);

-- ---------- Pedidos de contratação (mini-CRM) ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  event_type  text,
  event_date  date,
  city        text,
  message     text,
  status      text not null default 'novo'
              check (status in ('novo','conversa','fechado','recusado')),
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------- Configurações do site (linha única) ----------
create table if not exists public.settings (
  id           integer primary key default 1 check (id = 1),
  instagram    text,
  whatsapp     text,
  email        text,
  spotify      text,
  youtube      text,
  soundcloud   text,
  bio          text,
  presskit_url text,
  updated_at   timestamptz not null default now()
);

insert into public.settings (id, instagram, whatsapp)
values (1, 'https://www.instagram.com/fehmouura/', '5581995709892')
on conflict (id) do nothing;

-- =====================================================================
-- Segurança (RLS): o público só lê o que deve; só a equipe logada edita
-- =====================================================================
alter table public.events   enable row level security;
alter table public.photos   enable row level security;
alter table public.leads    enable row level security;
alter table public.settings enable row level security;

drop policy if exists "publico le eventos publicados" on public.events;
create policy "publico le eventos publicados" on public.events
  for select using (published = true);
drop policy if exists "equipe gerencia eventos" on public.events;
create policy "equipe gerencia eventos" on public.events
  for all to authenticated using (true) with check (true);

drop policy if exists "publico le fotos" on public.photos;
create policy "publico le fotos" on public.photos
  for select using (true);
drop policy if exists "equipe gerencia fotos" on public.photos;
create policy "equipe gerencia fotos" on public.photos
  for all to authenticated using (true) with check (true);

drop policy if exists "publico envia pedido" on public.leads;
create policy "publico envia pedido" on public.leads
  for insert to anon, authenticated with check (status = 'novo');
drop policy if exists "equipe gerencia pedidos" on public.leads;
create policy "equipe gerencia pedidos" on public.leads
  for all to authenticated using (true) with check (true);

drop policy if exists "publico le configuracoes" on public.settings;
create policy "publico le configuracoes" on public.settings
  for select using (true);
drop policy if exists "equipe edita configuracoes" on public.settings;
create policy "equipe edita configuracoes" on public.settings
  for update to authenticated using (true) with check (true);

-- =====================================================================
-- Armazenamento de fotos e press kit
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('galeria', 'galeria', true)
on conflict (id) do nothing;

drop policy if exists "publico ve arquivos" on storage.objects;
create policy "publico ve arquivos" on storage.objects
  for select using (bucket_id = 'galeria');
drop policy if exists "equipe envia arquivos" on storage.objects;
create policy "equipe envia arquivos" on storage.objects
  for insert to authenticated with check (bucket_id = 'galeria');
drop policy if exists "equipe atualiza arquivos" on storage.objects;
create policy "equipe atualiza arquivos" on storage.objects
  for update to authenticated using (bucket_id = 'galeria');
drop policy if exists "equipe apaga arquivos" on storage.objects;
create policy "equipe apaga arquivos" on storage.objects
  for delete to authenticated using (bucket_id = 'galeria');
