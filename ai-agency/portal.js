import {businessInput, taskInput, passwordMatches, connectionReady, mayOpenWorkspace} from './portal-model.mjs';
const $ = id => document.getElementById(id);
let client, user, mode = 'register', demo = false, businesses = [], tasks = [], activity = [], selected, factorId, recovering = false, routing = false;
const samples = new Map();
const views = ['auth','mfa','recovery','dashboard'];
function show(view) { views.forEach(id => $(id).hidden = id !== view); }
function status(text) { $('status').textContent = text; }
function element(tag,text,cls) { const e=document.createElement(tag); e.textContent=text; if(cls)e.className=cls; return e; }
function unwrap(result) { if(result.error) throw result.error; return result.data; }
async function run(action,button) { if(button)button.disabled=true; status(''); try { await action(); } catch(e) { status(e.message || 'Unable to complete that action. Please retry.'); } finally { if(button)button.disabled=false; } }
function setMode(next) { mode=next; document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode))); const register=mode==='register'; $('auth-title').textContent=register?'Start with your email':'Welcome back'; $('auth-submit').textContent=register?'Create account':'Sign in'; ['confirm-label','consent-label','password-help'].forEach(id=>$(id).hidden=!register); $('confirm').required=register; $('consent').required=register; $('password').autocomplete=register?'new-password':'current-password'; $('password').minLength=register?12:1; $('forgot').hidden=register; }
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('auth-form').onsubmit=e=>{e.preventDefault();run(async()=>{if(!client)throw Error('Account service has not been connected yet.'); const email=$('email').value.trim(); const password=$('password').value; if(mode==='register'){passwordMatches(password,$('confirm').value);const data=unwrap(await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}));$('password').value='';$('confirm').value='';if(data.session)await route();else status('Check your inbox for the verification email. After confirming it, sign in here to set up your authenticator.');}else{unwrap(await client.auth.signInWithPassword({email,password}));$('password').value='';await route();}},$('auth-submit'));};
$('forgot').onclick=()=>run(async()=>{if(!$('email').reportValidity())return;unwrap(await client.auth.resetPasswordForEmail($('email').value.trim(),{redirectTo:location.origin+location.pathname}));status('If this address has an account, a password reset email will arrive. Check your inbox.');},$('forgot'));
async function setupFactor() {
  const factors=unwrap(await client.auth.mfa.listFactors());
  // Remove abandoned enrollments only; never remove a verified factor.
  for(const f of factors.all.filter(x=>x.factor_type==='totp'&&x.status==='unverified')) unwrap(await client.auth.mfa.unenroll({factorId:f.id}));
  const data=unwrap(await client.auth.mfa.enroll({factorType:'totp',friendlyName:'Authenticator '+new Date().toISOString()}));factorId=data.id;
  $('qr').src=data.totp.qr_code.startsWith('data:')?data.totp.qr_code:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(data.totp.qr_code);
  $('qr').hidden=false;$('secret-label').hidden=false;$('secret').value=data.totp.secret;
  $('mfa-help').textContent='Scan the QR code with your authenticator app, or enter the manual setup key on this phone. Enter the six-digit code to finish.';
}
async function route() {
  if(routing)return; routing=true;
  try { const data=unwrap(await client.auth.getUser()); user=data.user; if(!user){show('auth');return;}
    const aal=unwrap(await client.auth.mfa.getAuthenticatorAssuranceLevel());
    if(!mayOpenWorkspace(aal.currentLevel)) {show('mfa');$('code').value='';const factors=unwrap(await client.auth.mfa.listFactors());if(factors.totp.length){factorId=factors.totp[0].id;$('qr').hidden=true;$('secret-label').hidden=true;$('secret').value='';$('mfa-help').textContent='Open your authenticator app and enter the six-digit code for this account.';}else await setupFactor();return;}
    $('qr').removeAttribute('src');$('qr').hidden=true;$('secret').value='';$('secret-label').hidden=true;
    if(recovering){show('recovery');return;}
    show('dashboard');$('identity').textContent=user.email;$('security-text').textContent='Email verified · authenticator verified for this session.';$('backup-factor').hidden=false;
    businesses=unwrap(await client.from('agency_businesses').select('*').order('created_at'));selected=businesses.some(b=>b.id===selected)?selected:businesses[0]?.id;await render();
  } finally {routing=false;}
}
$('mfa-form').onsubmit=e=>{e.preventDefault();run(async()=>{unwrap(await client.auth.mfa.challengeAndVerify({factorId,code:$('code').value.trim()}));await route();},e.submitter);};
$('recovery-form').onsubmit=e=>{e.preventDefault();run(async()=>{passwordMatches($('new-password').value,$('new-confirm').value);unwrap(await client.auth.updateUser({password:$('new-password').value}));$('recovery-form').reset();recovering=false;await route();status('Password updated.');},e.submitter);};
$('backup-factor').onclick=()=>run(async()=>{show('mfa');$('code').value='';await setupFactor();},$('backup-factor'));
function clearPrivateState(){businesses=[];tasks=[];activity=[];selected=undefined;factorId=undefined;user=undefined;$('business-list').replaceChildren();$('task-list').replaceChildren();$('activity-list').replaceChildren();$('brief-form').reset();$('workspace').hidden=true;$('empty').hidden=false;$('identity').textContent='';$('secret').value='';$('qr').removeAttribute('src');$('code').value='';}
document.querySelectorAll('[data-signout]').forEach(b=>b.onclick=()=>run(async()=>{if(demo){demo=false;samples.clear();clearPrivateState();show('auth');$('notice').textContent=connectionReady(window.AGENCY_PORTAL_CONFIG)?'Account service connected.':'Registration is awaiting account-service activation. Try the sample dashboard below.';return;}unwrap(await client.auth.signOut());recovering=false;clearPrivateState();show('auth');},b));
function sample(b){if(!samples.has(b.id))samples.set(b.id,{tasks:[],activity:[]});return samples.get(b.id);}
function record(b,text){sample(b).activity.unshift({id:crypto.randomUUID(),message:text,created_at:new Date().toISOString()});}
$('demo').onclick=()=>{demo=true;businesses=[{id:'demo-business',name:'Purposed Endeavours',stage:'Idea',purpose:'Connect people with knowledge, skills, opportunities and networks.',audience:'To define',offer:'To validate',milestone:'Choose one community need to test.',services:[]}];selected='demo-business';show('dashboard');$('identity').textContent='Sample client · dashboard preview';$('notice').textContent='Preview only · sample data in this tab · no account created · no agents running.';$('security-text').textContent='Preview has no login, cloud storage or two-factor authentication.';$('backup-factor').hidden=true;run(render);};
$('add-toggle').onclick=()=>{$('business-form').hidden=!$('business-form').hidden;};
$('template').onchange=()=>{$('business-name').value=$('template').value;};
$('business-form').onsubmit=e=>{e.preventDefault();run(async()=>{const input=businessInput($('business-name').value,$('business-stage').value);let b;if(demo){b={...input,id:crypto.randomUUID(),purpose:'',audience:'',offer:'',milestone:'',services:[]};businesses.push(b);record(b,'Workspace created');}else{b=unwrap(await client.from('agency_businesses').insert({...input,owner_id:user.id}).select().single());businesses.push(b);}selected=b.id;$('business-form').reset();$('business-form').hidden=true;await render();status('Business workspace created.');},e.submitter);};
async function render(){
  const list=$('business-list');list.replaceChildren();businesses.forEach(b=>{const btn=element('button',b.name);btn.type='button';btn.setAttribute('aria-pressed',String(b.id===selected));btn.onclick=()=>run(async()=>{selected=b.id;await render();});list.append(btn);});
  const b=businesses.find(x=>x.id===selected);$('empty').hidden=Boolean(b);$('workspace').hidden=!b;if(!b)return;
  if(demo){tasks=sample(b).tasks;activity=sample(b).activity;}else{[tasks,activity]=await Promise.all([client.from('agency_tasks').select('*').eq('business_id',b.id).order('created_at').then(unwrap),client.from('agency_activity').select('*').eq('business_id',b.id).order('created_at',{ascending:false}).limit(50).then(unwrap)]);}
  $('business-title').textContent=b.name;$('stage').textContent=b.stage+' · business development';$('milestone-text').textContent=b.milestone||'Set your first milestone in the business brief.';
  const metrics=$('metrics');metrics.replaceChildren();[[tasks.filter(t=>!t.done).length,'Open tasks'],[tasks.filter(t=>t.done).length,'Completed tasks'],[b.services.length,'Services shortlisted']].forEach(([n,label])=>{const el=element('div','', 'metric');el.append(element('b',String(n)),element('span',label));metrics.append(el);});
  ['purpose','audience','offer','milestone'].forEach(k=>$(k).value=b[k]||'');$('edit-stage').value=b.stage;
  $('task-list').replaceChildren();tasks.forEach(t=>{const li=document.createElement('li'),label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=t.done;check.onchange=()=>run(async()=>{const done=check.checked;if(demo){t.done=done;record(b,done?'Task completed':'Task reopened');}else unwrap(await client.from('agency_tasks').update({done}).eq('id',t.id).eq('business_id',b.id));await render();},check);label.append(check,element('span',t.title));li.append(label);$('task-list').append(li);});if(!tasks.length)$('task-list').append(element('li','No tasks yet. Add a next action.'));
  document.querySelectorAll('#service-options input').forEach(c=>c.checked=b.services.includes(c.value));
  $('activity-list').replaceChildren();activity.forEach(a=>$('activity-list').append(element('li',new Date(a.created_at).toLocaleString()+' · '+a.message)));if(!activity.length)$('activity-list').append(element('li','No changes recorded yet.'));
}
$('brief-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),change={};['purpose','audience','offer','milestone'].forEach(k=>change[k]=$(k).value.trim());change.stage=$('edit-stage').value;if(demo){Object.assign(b,change);record(b,'Business brief updated');}else Object.assign(b,unwrap(await client.from('agency_businesses').update(change).eq('id',b.id).select().single()));await render();status('Brief saved.');},e.submitter);};
$('task-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),title=taskInput($('task-title').value);if(demo){sample(b).tasks.push({id:crypto.randomUUID(),title,done:false});record(b,'Task added');}else unwrap(await client.from('agency_tasks').insert({business_id:b.id,title}));$('task-form').reset();await render();status('Task added.');},e.submitter);};
$('services-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),services=[...document.querySelectorAll('#service-options input:checked')].map(c=>c.value);if(demo){b.services=services;record(b,'Service shortlist updated');}else Object.assign(b,unwrap(await client.from('agency_businesses').update({services}).eq('id',b.id).select().single()));await render();status('Shortlist saved. No agent has been activated.');},e.submitter);};
document.querySelectorAll('[data-view]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-view]').forEach(b=>{if(b===btn)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==btn.dataset.view);});
async function init(){
  const catalogue=await fetch('./',{cache:'no-cache'});if(!catalogue.ok)throw Error('Unable to load the service catalogue. Reload to try again.');const html=new DOMParser().parseFromString(await catalogue.text(),'text/html');html.querySelectorAll('input[name="service"]').forEach(s=>{const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.value=s.value;label.append(check,element('span',s.value));$('service-options').append(label);});
  const config=window.AGENCY_PORTAL_CONFIG;if(!connectionReady(config)){$('notice').textContent='Registration is awaiting account-service activation. Try the sample dashboard below.';return;}
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm');
  client=createClient(config.supabaseUrl,config.publishableKey,{auth:{storage:sessionStorage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  $('auth-fields').disabled=false;$('notice').textContent='Private client workspaces · email verification and authenticator required.';
  client.auth.onAuthStateChange((event,session)=>{if(event==='PASSWORD_RECOVERY')recovering=true;if(event==='SIGNED_OUT'){clearPrivateState();show('auth');}else if(['SIGNED_IN','PASSWORD_RECOVERY'].includes(event)&&session&&!demo)setTimeout(()=>run(route),0);});
  const session=unwrap(await client.auth.getSession());if(session.session)await route();
}
run(init);
