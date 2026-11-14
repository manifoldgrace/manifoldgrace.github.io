-- AI Assurance Studio v0.1: run in a dedicated Supabase PostgreSQL project.
-- Required: Auth email confirmation enabled; configure allowed redirect URLs.
-- Never expose a service-role key in the browser.
create extension if not exists pgcrypto;
create table if not exists public.qa_projects (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 120),
 use_case text not null check (char_length(use_case) between 1 and 1200),
 jurisdiction text not null default '' check (char_length(jurisdiction)<=80),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.qa_projects enable row level security;
revoke all on public.qa_projects from anon;
grant select,insert,update,delete on public.qa_projects to authenticated;
drop policy if exists qa_projects_owner_select on public.qa_projects;
create policy qa_projects_owner_select on public.qa_projects for select to authenticated using (owner_id = (select auth.uid()));
drop policy if exists qa_projects_owner_insert on public.qa_projects;
create policy qa_projects_owner_insert on public.qa_projects for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists qa_projects_owner_update on public.qa_projects;
create policy qa_projects_owner_update on public.qa_projects for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists qa_projects_owner_delete on public.qa_projects;
create policy qa_projects_owner_delete on public.qa_projects for delete to authenticated using (owner_id = (select auth.uid()));
create index if not exists qa_projects_owner_created on public.qa_projects(owner_id,created_at desc);
-- Future tables for runs/findings need independent privacy and policy review before launch.
