-- Run in the Supabase SQL editor AFTER the migration using two real Auth user UUIDs.
-- Replace the two placeholder UUIDs below. Transaction rolls back all test fixtures.
begin;
select set_config('test.owner_a','11111111-1111-1111-1111-111111111111',true);
select set_config('test.owner_b','22222222-2222-2222-2222-222222222222',true);
insert into public.agency_businesses(id,owner_id,name) values('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',current_setting('test.owner_a')::uuid,'RLS fixture');
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner_a'),'aal','aal1')::text,true);
do $$ begin
 if exists(select 1 from public.agency_businesses) then raise exception 'AAL1 can read businesses'; end if;
 begin
  insert into public.agency_tasks(business_id,title) values('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Must fail');
  raise exception 'AAL1 can create tasks';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner_b'),'aal','aal2')::text,true);
do $$ begin
 if exists(select 1 from public.agency_businesses where id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') then raise exception 'Cross-owner read'; end if;
 if exists(select 1 from public.agency_activity where business_id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') then raise exception 'Cross-owner activity read'; end if;
 begin
  insert into public.agency_tasks(business_id,title) values('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Must fail');
  raise exception 'Cross-owner task write';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner_a'),'aal','aal2')::text,true);
do $$ begin
 if not exists(select 1 from public.agency_businesses where id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') then raise exception 'Owner AAL2 cannot read'; end if;
 begin
  insert into public.agency_activity(business_id,message) values('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Must fail');
  raise exception 'Client can forge activity';
 exception when insufficient_privilege then null; end;
end $$;
insert into public.agency_tasks(business_id,title) values('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Owner can add task');
rollback;
