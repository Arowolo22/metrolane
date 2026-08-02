-- Metrolane: Supabase schema migration
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Replaces the old MongoDB (users/results) + Cloudinary (photos/PDFs) storage layer.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  department text not null,
  email text not null unique,
  phone text not null,
  password_hash text not null,
  role text not null default 'lecturer' check (role in ('lecturer', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (lower(email));

-- ─────────────────────────────────────────────────────────────
-- results
-- ─────────────────────────────────────────────────────────────
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  student jsonb not null,
  courses jsonb not null,
  summary jsonb not null,
  status text not null default 'Generated' check (status in ('Generated', 'Approved', 'Pending', 'Rejected')),
  filename text not null,
  pdf_url text,
  generated_at timestamptz not null,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists results_matric_idx
  on public.results ((student ->> 'matricNumber'));
create index if not exists results_matric_session_semester_idx
  on public.results ((student ->> 'matricNumber'), (student ->> 'academicSession'), (student ->> 'semester'));
create index if not exists results_status_idx on public.results (status);
create index if not exists results_department_idx
  on public.results ((student ->> 'department'));

-- ─────────────────────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists set_results_updated_at on public.results;
create trigger set_results_updated_at
  before update on public.results
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Row level security
-- The backend talks to Supabase using the service_role key, which bypasses
-- RLS entirely. Enabling RLS with no policies means the anon/publishable
-- key (used by nothing in this app right now, but kept safe by default)
-- cannot read or write these tables directly.
-- ─────────────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.results enable row level security;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant select, insert, update, delete on public.users to service_role;
grant select, insert, update, delete on public.results to service_role;
grant usage, select, update on all sequences in schema public to service_role;

drop policy if exists "service_role_all_access_users" on public.users;
create policy "service_role_all_access_users"
on public.users
for all
to service_role
using (true)
with check (true);

drop policy if exists "service_role_all_access_results" on public.results;
create policy "service_role_all_access_results"
on public.results
for all
to service_role
using (true)
with check (true);

-- ─────────────────────────────────────────────────────────────
-- Storage buckets (replaces Cloudinary)
-- Public buckets so stored URLs behave like the old Cloudinary secure_url
-- (permanently viewable links, no signing required).
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('student-photos', 'student-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('result-pdfs', 'result-pdfs', true)
on conflict (id) do nothing;
