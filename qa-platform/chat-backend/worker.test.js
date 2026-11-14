import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';

const base='https://manifoldgrace.github.io';
const url='https://example.workers.dev/chat';
const makeEnv=()=>{
 let count=0;
 return {
 ALLOWED_ORIGIN:base,
 SUPABASE_URL:'https://example.supabase.co',
 SUPABASE_ANON_KEY:'public-test-key',
 OPENROUTER_API_KEY:'fake-provider-key',
 DAILY_USER_LIMIT:'12',
 RATE_KV:{
 async get(){return String(count)},
 async put(_key,value){count=Number(value)}
 }
 }};
const req=(body,origin=base,token='valid')=>new Request(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
const history={messages:[{role:'user',content:'Test question'}]};
test('rejects unknown origin before calling provider',async()=>{
 const r=await worker.fetch(req(history,'https://evil.example'),makeEnv());
 assert.equal(r.status,403);
});
test('requires user authorization',async()=>{
 const r=await worker.fetch(req(history,base,''),makeEnv());
 assert.equal(r.status,401);
});
test('fails closed when provider credentials are unavailable',async()=>{
 const env=makeEnv();delete env.OPENROUTER_API_KEY;
 const r=await worker.fetch(req(history),env);
 assert.equal(r.status,503);
});
test('returns model text after validated authentication',async()=>{
 const previous=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async(input,opts)=>{
  const u=String(input);calls.push(u);
  if(u.endsWith('/auth/v1/user'))return new Response(JSON.stringify({id:'u1',email_confirmed_at:'2026-11-14T00:00:00Z'}),{status:200});
  if(u.includes('openrouter.ai'))return new Response(JSON.stringify({model:'test-free-model',choices:[{message:{content:'Verified test reply'}}]}),{status:200});
  throw Error('unexpected URL');
 };
 try{
  const r=await worker.fetch(req(history),makeEnv());
  assert.equal(r.status,200);
  assert.equal((await r.json()).answer,'Verified test reply');
  assert.equal(calls.length,2);
 }finally{globalThis.fetch=previous}
});
test('rejects unverified accounts and never calls provider',async()=>{
 const prev=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({id:'u1',email_confirmed_at:null}),{status:200})};
 try{const r=await worker.fetch(req(history),makeEnv());assert.equal(r.status,403);assert.equal(calls,1)}finally{globalThis.fetch=prev}
});
test('rejects invalid chat content',async()=>{
 const prev=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({id:'u1',email_confirmed_at:'today'}),{status:200});
 try{
 const r=await worker.fetch(req({messages:[{role:'admin',content:'hi'}]}),makeEnv());
 assert.equal(r.status,400);
 }finally{globalThis.fetch=prev}
});
