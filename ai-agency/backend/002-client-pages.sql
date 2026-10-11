-- Apply after 001-client-workspaces.sql. Private records require owner + MFA.
begin;
create table public.agency_records (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.agency_businesses(id) on delete cascade,
 kind text not null check(kind in ('project','request','integration')),
 title text not null check(char_length(trim(title)) between 1 and 160),
 details text not null default '' check(char_length(details)<=3000),
 status text not null default 'Draft' check(status in ('Draft','Active','Completed','Cancelled')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.agency_documents (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.agency_businesses(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 255),
 size bigint not null check(size between 1 and 10485760),
 path text not null unique,
 created_at timestamptz not null default now(),
 check(left(path,char_length(business_id::text)+1)=business_id::text||'/')
);
create index on public.agency_records(business_id,created_at desc);
create index on public.agency_documents(business_id,created_at desc);
alter table public.agency_records enable row level security;
alter table public.agency_documents enable row level security;
revoke all on public.agency_records,public.agency_documents from anon,authenticated;
grant select,insert,update,delete on public.agency_records to authenticated;
grant select,insert,delete on public.agency_documents to authenticated;
create policy owner_mfa_records on public.agency_records for all to authenticated
 using ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())))
 with check ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));
create policy owner_mfa_documents on public.agency_documents for all to authenticated
 using ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())))
 with check ((select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));
create function public.agency_record_guard() returns trigger language plpgsql set search_path='' as $$
begin
 if NEW.id<>OLD.id or NEW.business_id<>OLD.business_id or NEW.kind<>OLD.kind then raise exception 'Record identity cannot change'; end if;
 NEW.created_at=OLD.created_at;NEW.updated_at=now();return NEW;
end $$;
create trigger agency_record_identity before update on public.agency_records for each row execute function public.agency_record_guard();
create function public.agency_extension_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='DELETE' then
 if not exists(select 1 from public.agency_businesses where id=OLD.business_id) then return OLD; end if;
 insert into public.agency_activity(business_id,message) values(OLD.business_id,case when TG_TABLE_NAME='agency_documents' then 'Document record removed' else 'Workspace record removed' end);
 return OLD;
 end if;
 insert into public.agency_activity(business_id,message) values(NEW.business_id,case when TG_TABLE_NAME='agency_documents' then 'Document uploaded' when TG_OP='INSERT' then 'Workspace record added' else 'Workspace record updated' end);
 return NEW;
end $$;
create trigger agency_record_activity after insert or update or delete on public.agency_records for each row execute function public.agency_extension_audit();
create trigger agency_document_activity after insert or delete on public.agency_documents for each row execute function public.agency_extension_audit();
revoke all on function public.agency_record_guard(),public.agency_extension_audit() from public,anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('agency-private','agency-private',false,10485760,array['application/pdf','text/plain','text/csv','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg']);
create policy agency_private_read on storage.objects for select to authenticated
 using (bucket_id='agency-private' and (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id::text=split_part(name,'/',1) and b.owner_id=(select auth.uid())));
create policy agency_private_upload on storage.objects for insert to authenticated
 with check (bucket_id='agency-private' and (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id::text=split_part(name,'/',1) and b.owner_id=(select auth.uid())));
create policy agency_private_remove on storage.objects for delete to authenticated
 using (bucket_id='agency-private' and (select auth.jwt()->>'aal')='aal2' and exists(select 1 from public.agency_businesses b where b.id::text=split_part(name,'/',1) and b.owner_id=(select auth.uid())));
commit;
