// Browser client: no API keys or provider credentials stored here.
const c=id=>document.getElementById(id);
const cfg=globalThis.MG_QA_AUTH_CONFIG||{};
const chatCfg=globalThis.MG_QA_CHAT_CONFIG||{};
const endpoint=typeof chatCfg.endpoint==="string"&&/^https:\/\//.test(chatCfg.endpoint)?chatCfg.endpoint.replace(/\/$/,""):"";
let supabase=null, history=[];
function state(message){c("chat-status").textContent=message}
function bubble(role,content){const el=document.createElement("p");el.className="chat-line "+role;const b=document.createElement("strong");b.textContent=role==="user"?"You: ":"Model: ";el.append(b,document.createTextNode(content));c("chat-log").append(el);el.scrollIntoView({block:"nearest"});}
async function initialise(){
 if(!endpoint){state("Model backend not configured. Chat is not active.");return}
 if(!cfg.url||!cfg.anonKey){state("Account system not configured. Sign-in is required before chat.");return}
 try{
  const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
  supabase=createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data}=await supabase.auth.getSession();
  if(!data.session){state("Please sign in through Create account / Sign in above.");return}
  c("chat-send").disabled=false;c("chat-input").disabled=false;state("Ready to send to a free hosted model. Responses may be inaccurate; do not enter confidential information.");
 }catch{state("Could not initialise chat sign-in.")}
}
c("chat-form").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!supabase||!endpoint)return;
 const input=c("chat-input"),value=input.value.trim();
 if(!value)return;
 const {data}=await supabase.auth.getSession();
 if(!data?.session?.access_token){state("Session expired. Sign in again.");return}
 const next=[...history,{role:"user",content:value}].slice(-12);
 c("chat-send").disabled=true;input.disabled=true;state("Requesting model response…");
 try{
  const response=await fetch(endpoint+"/chat",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+data.session.access_token},body:JSON.stringify({messages:next})});
  const body=await response.json();
  if(!response.ok)throw Error(body.error||"Request failed");
  bubble("user",value);bubble("assistant",body.answer);
  history=[...next,{role:"assistant",content:body.answer}].slice(-12);input.value="";
  c("chat-model").textContent="Model: "+body.model+" · Response unverified";
  state("Response received.");
 }catch(error){state(error.message||"Chat request failed. No message was added to history.")}
 finally{c("chat-send").disabled=false;input.disabled=false;input.focus()}
});
c("chat-clear").addEventListener("click",()=>{history=[];c("chat-log").replaceChildren();c("chat-model").textContent="No messages in this browser session.";state("Conversation cleared from this page.");});
initialise();
