// Manifold Grace AI Assurance Studio: private, rate-limited chat gateway.
// Deploy as Cloudflare Worker with separate secrets. Never put API keys on GitHub Pages.
const HEADERS = {"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"};
function json(obj,status=200,origin=""){return new Response(JSON.stringify(obj),{status,headers:{...HEADERS,...(origin?{"access-control-allow-origin":origin,"vary":"Origin"}:{})}})}
function cors(origin){return {...HEADERS,"access-control-allow-origin":origin,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"authorization, content-type","vary":"Origin"}}
export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"";
 const allowed=(env.ALLOWED_ORIGIN||"").replace(/\/$/,"");
 if(!allowed || origin!==allowed)return json({error:"Origin not allowed"},403);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(origin)});
 const url=new URL(request.url);
 if(url.pathname!=="/chat"||request.method!=="POST")return json({error:"Not found"},404,origin);
 if(!env.OPENROUTER_API_KEY||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY||!env.RATE_KV)return json({error:"Chat gateway not configured"},503,origin);
 const auth=request.headers.get("Authorization")||"";
 if(!/^Bearer [A-Za-z0-9._~-]+$/.test(auth))return json({error:"Sign in required"},401,origin);
 const token=auth.slice(7);
 let user;
 try{
  const check=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/auth/v1/user",{headers:{"apikey":env.SUPABASE_ANON_KEY,"Authorization":"Bearer "+token},signal:AbortSignal.timeout(7000)});
  if(!check.ok)return json({error:"Session expired. Sign in again."},401,origin);
  user=await check.json();
  if(!user?.id || !user?.email_confirmed_at)return json({error:"Verified account required"},403,origin);
 }catch{return json({error:"Unable to validate session"},503,origin)}
 const daily=Number(env.DAILY_USER_LIMIT||"12");
 const limit=Number.isInteger(daily)&&daily>0&&daily<=50?daily:12;
 const day=new Date().toISOString().slice(0,10);
 const quotaKey="chat:"+day+":"+user.id;
 try{
  const used=Number(await env.RATE_KV.get(quotaKey)||0);
  if(used>=limit)return json({error:"Daily experimental chat limit reached"},429,origin);
  // KV increments are approximate under concurrent requests. For production, use atomic counters.
  await env.RATE_KV.put(quotaKey,String(used+1),{expirationTtl:172800});
 }catch{return json({error:"Quota store unavailable"},503,origin)}
 let input;
 try{input=await request.json()}catch{return json({error:"Invalid JSON"},400,origin)}
 const messages=input?.messages;
 if(!Array.isArray(messages)||!messages.length||messages.length>12)return json({error:"Provide 1–12 chat messages"},400,origin);
 const clean=[];
 for(const m of messages){
  if(!m || !["user","assistant"].includes(m.role)||typeof m.content!=="string"||!m.content.trim()||m.content.length>4000)return json({error:"Invalid message; maximum 4000 characters"},400,origin);
  clean.push({role:m.role,content:m.content.trim()});
 }
 if(clean.at(-1)?.role!=="user")return json({error:"Last message must be user"},400,origin);
 const total=clean.reduce((n,m)=>n+m.content.length,0);
 if(total>12000)return json({error:"Conversation too long"},400,origin);
 try{
  const upstream=await fetch("https://openrouter.ai/api/v1/chat/completions",{
   method:"POST",
   headers:{"Authorization":"Bearer "+env.OPENROUTER_API_KEY,"Content-Type":"application/json","HTTP-Referer":allowed,"X-Title":"Manifold Grace AI Assurance Studio"},
   body:JSON.stringify({model:"openrouter/free",messages:[{role:"system",content:"You are a research-oriented AI assistant. Distinguish evidence from inference, acknowledge uncertainty, and avoid inventing sources or actions."},...clean],max_tokens:700}),
   signal:AbortSignal.timeout(45000)
  });
  if(!upstream.ok)return json({error:upstream.status===429?"Provider rate limit reached":"Model service unavailable",provider_status:upstream.status},upstream.status===429?429:502,origin);
  const result=await upstream.json();
  const answer=result?.choices?.[0]?.message?.content;
  if(typeof answer!=="string"||!answer.trim())return json({error:"Model returned no text"},502,origin);
  return json({answer:answer.slice(0,12000),model:result.model||"openrouter/free",status:"model_output_not_independently_verified"},200,origin);
 }catch{return json({error:"Model connection failed or timed out"},502,origin)}
}};