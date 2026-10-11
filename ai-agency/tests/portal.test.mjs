import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {businessInput,taskInput,passwordMatches,connectionReady,mayOpenWorkspace} from '../portal-model.mjs';
test('account configuration fails closed until a hosted provider is connected',()=>{
 assert.equal(connectionReady({supabaseUrl:'',publishableKey:''}),false);
 assert.equal(connectionReady({supabaseUrl:'http://fake.supabase.co',publishableKey:'sb_publishable_test'}),false);
 assert.equal(connectionReady({supabaseUrl:'https://project.supabase.co',publishableKey:'sb_publishable_test'}),true);
});
test('workspace gate rejects unverified and password-only sessions',()=>{
 for(const level of [undefined,null,'aal1',''])assert.equal(mayOpenWorkspace(level),false);
 assert.equal(mayOpenWorkspace('aal2'),true);
});
test('invalid registration cannot proceed',()=>{
 assert.throws(()=>passwordMatches('short','short'));
 assert.throws(()=>passwordMatches('long-password','different-password'));
 assert.doesNotThrow(()=>passwordMatches('long-password','long-password'));
});
test('business/task limits and stage constraints match the data contract',()=>{
 assert.deepEqual(businessInput('  Heritage Bridge  ','Idea'),{name:'Heritage Bridge',stage:'Idea'});
 assert.throws(()=>businessInput('','Idea'));assert.throws(()=>businessInput('Test','Live'));
 assert.throws(()=>businessInput('x'.repeat(121),'Idea'));
 assert.throws(()=>taskInput('   '));assert.throws(()=>taskInput('x'.repeat(301)));
 assert.equal(taskInput('  Validate demand  '),'Validate demand');
});
test('database migration protects every table with ownership and MFA; audit is read-only for clients',()=>{
 const sql=readFileSync(new URL('../backend/001-client-workspaces.sql',import.meta.url),'utf8');
 for(const name of ['agency_businesses','agency_tasks','agency_activity'])assert.match(sql,new RegExp(`alter table public.${name} enable row level security`));
 assert.match(sql,/grant select on public.agency_activity to authenticated/);
 assert.doesNotMatch(sql,/grant (?:all|insert|update|delete).*agency_activity to authenticated/);
 assert.equal((sql.match(/'aal2'/g)||[]).length,5);
 assert.match(sql,/Workspace identity cannot change/);assert.match(sql,/Task identity cannot change/);
});

