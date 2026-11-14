const $=id=>document.getElementById(id);const authForm=$('auth-form'),authMsg=$('auth-message'),authSubmit=$('auth-submit'),projectForm=$('project-form');let client=null;const cfg=globalThis.MG_QA_AUTH_CONFIG||{};const enabled=typeof cfg.url==='string'&&/^https:\/\//.test(cfg.url)&&typeof cfg.anonKey==='string'&&cfg.anonKey.length>25;function status(message){authMsg.textContent=message}function showSession(session){const signed=Boolean(session?.user);$('workspace-locked').hidden=signed;$('workspace-panel').hidden=!signed;$('signout').hidden=!signed;$('user-identity').textContent=signed?'Signed in: '+(session.user.email||'account'):'';if(signed)loadProjects();window.dispatchEvent(new CustomEvent('mg-auth-session',{detail:{session}}));if(signed&&$('auth-dialog')?.open)$('auth-dialog').close()}async function loadProjects(){if(!client)return;const {data,error}=await client.from('qa_projects').select('id,name,use_case,jurisdiction,created_at').order('created_at',{ascending:false}).limit(50);const ul=$('project-list');ul.replaceChildren();if(error){$('project-message').textContent='Unable to load projects: '+error.message;return}for(const p of data||[]){const li=document.createElement('li');li.textContent=p.name+' — '+p.use_case+' ('+(p.jurisdiction||'unspecified')+')';ul.append(li)}if(!data?.length)ul.append(Object.assign(document.createElement('li'),{textContent:'No projects yet.'}))}
async function initAuth(){if(!enabled)return;try{const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');client=createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});for(const input of authForm.querySelectorAll('input'))input.disabled=false;authSubmit.disabled=false;status('Email sign-in is ready.');$('deployment-status').textContent='Account backend configured. QA evaluation runner remains under development.';const {data}=await client.auth.getSession();showSession(data?.session);client.auth.onAuthStateChange((_event,session)=>{showSession(session)});}catch(e){status('Authentication could not be initialised. Registration is unavailable.')}}initAuth();authForm.addEventListener('change',()=>{const signup=authForm.querySelector('[value=signup]').checked;authSubmit.textContent=signup?'Register securely':'Sign in';authForm.elements.password.autocomplete=signup?'new-password':'current-password'});authForm.addEventListener('submit',async e=>{e.preventDefault();if(!client)return status('Registration is not configured.');const fd=new FormData(authForm);const email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||'');if(password.length<12)return status('Password must contain at least 12 characters.');authSubmit.disabled=true;try{const mode=fd.get('auth-mode');const {data,error}=mode==='signup'?await client.auth.signUp({email,password,options:{emailRedirectTo:new URL('./',location.href).href}}):await client.auth.signInWithPassword({email,password});if(error)throw error;status(mode==='signup'?'If your address is eligible, follow the verification email to complete registration.':'Authentication request completed.');if(data?.session)showSession(data.session)}catch(err){status('Could not complete authentication. Please check the configuration or your details.')}finally{authSubmit.disabled=false;authForm.elements.password.value=''}});$('signout').addEventListener('click',async()=>{if(client)await client.auth.signOut()});projectForm.addEventListener('submit',async e=>{e.preventDefault();if(!client)return;const fd=new FormData(projectForm);const {data:{user},error:authError}=await client.auth.getUser();if(authError||!user){$('project-message').textContent='Please sign in first.';return}const row={owner_id:user.id,name:String(fd.get('name')||'').trim(),use_case:String(fd.get('use_case')||'').trim(),jurisdiction:String(fd.get('jurisdiction')||'').trim()};if(!row.name||!row.use_case)return;const {error}=await client.from('qa_projects').insert(row);$('project-message').textContent=error?'Project was not saved: '+error.message:'Project created.';if(!error){projectForm.reset();loadProjects()}});async function renderTests(){const tbody=$('test-rows');try{const response=await fetch('qa-tests.json');if(!response.ok)throw Error();const d=await response.json();const render=q=>{tbody.replaceChildren();for(const t of d.tests.filter(t=>(t.id+' '+t.title+' '+t.part).toLowerCase().includes(q.toLowerCase()))){const tr=document.createElement('tr');for(const value of [t.id,t.title,'Part '+t.part,t.status]){const td=document.createElement('td');td.textContent=value;tr.append(td)}tbody.append(tr)}if(!tbody.children.length){const tr=document.createElement('tr');const td=document.createElement('td');td.colSpan=4;td.textContent='No matching tests.';tr.append(td);tbody.append(tr)}};render('');$('test-filter').addEventListener('input',e=>render(e.target.value));}catch(e){tbody.textContent='Catalogue unavailable.'}}renderTests();

/* Accessible sign-in dialog and provider-aware OAuth. No provider is presented as active unless explicitly configured. */
const loginDialog=$('auth-dialog'),loginTrigger=$('studio-login-open');
function openLogin(){if(!loginDialog)return;if(typeof loginDialog.showModal==='function'){if(!loginDialog.open)loginDialog.showModal()}else loginDialog.setAttribute('open','');}
function closeLogin(){if(!loginDialog)return;if(typeof loginDialog.close==='function'&&loginDialog.open)loginDialog.close();else loginDialog.removeAttribute('open')}
loginTrigger?.addEventListener('click',openLogin);
document.querySelectorAll('[data-open-auth]').forEach(button=>button.addEventListener('click',openLogin));
$('studio-login-close')?.addEventListener('click',closeLogin);
loginDialog?.addEventListener('click',event=>{if(event.target===loginDialog)closeLogin()});
const configuredOAuth=Array.isArray(cfg.oauthProviders)?cfg.oauthProviders.filter(provider=>['google','apple','github'].includes(provider)):[];
const providerNames={google:'Google',apple:'Apple',github:'GitHub'};
document.querySelectorAll('[data-oauth]').forEach(button=>{
 const provider=button.dataset.oauth;
 if(!configuredOAuth.includes(provider)){button.disabled=true;button.title=providerNames[provider]+' sign-in is not yet configured';return}
 button.disabled=!enabled;
 button.addEventListener('click',async()=>{
  if(!client){status('Authentication is not ready.');return}
  button.disabled=true;
  $('oauth-status').textContent='Connecting to '+providerNames[provider]+'…';
  try{
   const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:new URL('./',location.href).href}});
   if(error)throw error;
  }catch(err){$('oauth-status').textContent=providerNames[provider]+' sign-in is unavailable. You can continue using email.';button.disabled=false}
 });
});
if(configuredOAuth.length)$('oauth-status').textContent='Choose an available sign-in provider, or continue with email.';

/* Keep the device screen free of site-wide research panels; reveal on deliberate request. */
const extras=$('studio-extras'),extrasToggle=$('studio-explore-open'),researchToggle=$('studio-research-open');
function setExtras(open,focusTarget){
 if(!extras)return;
 extras.open=Boolean(open);
 extrasToggle?.setAttribute('aria-expanded',String(Boolean(open)));
 if(open){
  const target=focusTarget?$(focusTarget):extras;
  requestAnimationFrame(()=>target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
 }else document.querySelector('.studio-device')?.scrollIntoView({block:'center',behavior:'smooth'});
}
extrasToggle?.addEventListener('click',()=>setExtras(!extras?.open));
researchToggle?.addEventListener('click',()=>setExtras(true,'research'));
extras?.addEventListener('toggle',()=>extrasToggle?.setAttribute('aria-expanded',String(extras.open)));
document.querySelectorAll('#studio-extras a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setExtras(true,a.getAttribute('href').slice(1))));
if(location.hash&&['workspace','features','catalogue','research'].includes(location.hash.slice(1)))setExtras(true,location.hash.slice(1));
