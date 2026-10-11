-- Apply in the connected Supabase project's SQL editor before enabling the portal.
-- Client data is inaccessible until a verified second-factor session (aal2).
begin;
create table public.agency_businesses (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check(char_length(trim(name)) between 1 and 120),
 stage text not null default 'Idea' check(stage in ('Idea','Validation','Building','Operating')),
 purpose text not null default '' check(char_length(purpose)<=2000),
 audience text not null default '' check(char_length(audience)<=2000),
 offer text not null default '' check(char_length(offer)<=2000),
 milestone text not null default '' check(char_length(milestone)<=500),
 services text[] not null default '{}' check(cardinality(services)<=50),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.agency_tasks (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.agency_businesses(id) on delete cascade,
 title text not null check(char_length(trim(title)) between 1 and 300),
 done boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.agency_activity (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.agency_businesses(id) on delete cascade,
 message text not null,
 created_at timestamptz not null default now()
);
create index on public.agency_businesses(owner_id);
create index on public.agency_tasks(business_id);
create index on public.agency_activity(business_id,created_at desc);
alter table public.agency_businesses enable row level security;
alter table public.agency_tasks enable row level security;
alter table public.agency_activity enable row level security;
revoke all on public.agency_businesses,public.agency_tasks,public.agency_activity from anon,authenticated;
grant select,insert,update,delete on public.agency_businesses,public.agency_tasks to authenticated;
grant select on public.agency_activity to authenticated;
create policy owner_mfa_businesses on public.agency_businesses for all to authenticated
 using (owner_id=(select auth.uid()) and (select auth.jwt()->>'aal')='aal2')
 with check (owner_id=(select auth.uid()) and (select auth.jwt()->>'aal')='aal2');
create policy owner_mfa_tasks on public.agency_tasks for all to authenticated
 using ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())))
 with check ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));
create policy owner_mfa_activity on public.agency_activity for select to authenticated
 using ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));
create function public.agency_business_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.agency_activity(business_id,message) values(NEW.id,
 case when TG_OP='INSERT' then 'Workspace created'
 when NEW.services is distinct from OLD.services then 'Service shortlist updated'
 else 'Business brief updated' end);
 return NEW;
end $$;
create function public.agency_business_timestamp() returns trigger language plpgsql set search_path='' as $$
begin
 if NEW.id<>OLD.id or NEW.owner_id<>OLD.owner_id then raise exception 'Workspace identity cannot change'; end if;
 NEW.created_at=OLD.created_at; NEW.updated_at=now(); return NEW;
end $$;
create trigger agency_business_timestamp before update on public.agency_businesses for each row execute function public.agency_business_timestamp();
create trigger agency_business_changes after insert or update on public.agency_businesses for each row execute function public.agency_business_audit();
create function public.agency_task_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='UPDATE' and (NEW.business_id<>OLD.business_id or NEW.id<>OLD.id) then raise exception 'Task identity cannot change'; end if;
 insert into public.agency_activity(business_id,message) values(NEW.business_id,
 case when TG_OP='INSERT' then 'Task added' when NEW.done then 'Task completed' else 'Task updated' end);
 return NEW;
end $$;
create trigger agency_task_changes after insert or update on public.agency_tasks for each row execute function public.agency_task_audit();
revoke all on function public.agency_business_audit(),public.agency_business_timestamp(),public.agency_task_audit() from public,anon,authenticated;
commit;

