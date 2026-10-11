import {businessInput, taskInput, passwordMatches, connectionReady, mayOpenWorkspace} from './portal-model.mjs';
const $ = id => document.getElementById(id);
let client, user, mode = 'register', demo = false, businesses = [], tasks = [], activity = [], selected, factorId, recovering = false, routing = false, busy = false;
const samples = new Map();
let records=[], documents=[];
const views = ['auth','mfa','recovery','dashboard'];
function show(view) { views.forEach(id => $(id).hidden = id !== view); }
function status(text) { $('status').textContent = text; }
function element(tag,text,cls) { const e=document.createElement(tag); e.textContent=text; if(cls)e.className=cls; return e; }
function unwrap(result) { if(result.error) throw result.error; return result.data; }
async function run(action,button) { if(busy)return; busy=true; if(button)button.disabled=true; status(''); try { await action(); } catch(e) { status(e.message || 'Unable to complete that action. Please retry.'); if(!$('dashboard').hidden)$('sync-state').textContent=demo?'Preview · not saved to an account':'Action failed · retry to confirm the latest data'; } finally { busy=false; if(button)button.disabled=false; } }
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
    show('dashboard');selectView(new URLSearchParams(location.search).get('view')||'overview');$('identity').textContent=user.email;$('security-text').textContent='Email verified · authenticator verified for this session.';$('backup-factor').hidden=false;
    businesses=unwrap(await client.from('agency_businesses').select('*').order('created_at'));selected=businesses.some(b=>b.id===selected)?selected:businesses[0]?.id;await render();
  } finally {routing=false;}
}
$('mfa-form').onsubmit=e=>{e.preventDefault();run(async()=>{unwrap(await client.auth.mfa.challengeAndVerify({factorId,code:$('code').value.trim()}));await route();},e.submitter);};
$('recovery-form').onsubmit=e=>{e.preventDefault();run(async()=>{passwordMatches($('new-password').value,$('new-confirm').value);unwrap(await client.auth.updateUser({password:$('new-password').value}));$('recovery-form').reset();recovering=false;await route();status('Password updated.');},e.submitter);};
$('backup-factor').onclick=()=>run(async()=>{show('mfa');$('code').value='';await setupFactor();},$('backup-factor'));
function clearPrivateState(){['business-title','stage','milestone-text'].forEach(id=>$(id).textContent='');$('metrics').replaceChildren();records=[];documents=[];['project','request','integration','document'].forEach(k=>$(k+'-form').reset());['project-list','request-list','integration-list','document-list','report-summary'].forEach(id=>$(id).replaceChildren());$('sync-state').textContent='Not connected';businesses=[];tasks=[];activity=[];selected=undefined;factorId=undefined;user=undefined;$('business-list').replaceChildren();$('task-list').replaceChildren();$('activity-list').replaceChildren();$('brief-form').reset();$('workspace').hidden=true;$('empty').hidden=false;$('identity').textContent='';$('secret').value='';$('qr').removeAttribute('src');$('code').value='';}
document.querySelectorAll('[data-signout]').forEach(b=>b.onclick=()=>run(async()=>{if(demo){demo=false;samples.clear();clearPrivateState();show('auth');$('notice').textContent=connectionReady(window.AGENCY_PORTAL_CONFIG)?'Account service connected.':'Registration is awaiting account-service activation. Try the sample dashboard below.';return;}unwrap(await client.auth.signOut());recovering=false;clearPrivateState();show('auth');},b));
function sample(b){if(!samples.has(b.id))samples.set(b.id,{tasks:[],activity:[],records:[],documents:[]});return samples.get(b.id);}
function record(b,text){sample(b).activity.unshift({id:crypto.randomUUID(),message:text,created_at:new Date().toISOString()});}
$('demo').onclick=()=>{if(busy)return;demo=true;businesses=[{id:'demo-business',name:'Purposed Endeavours',stage:'Idea',purpose:'Connect people with knowledge, skills, opportunities and networks.',audience:'To define',offer:'To validate',milestone:'Choose one community need to test.',services:[]}];selected='demo-business';show('dashboard');selectView(new URLSearchParams(location.search).get('view')||'overview');$('identity').textContent='Sample client · dashboard preview';$('notice').textContent='Preview only · sample data in this tab · no account created · no agents running.';$('security-text').textContent='Preview has no login, cloud storage or two-factor authentication.';$('backup-factor').hidden=true;run(render);};
$('add-toggle').onclick=()=>{$('business-form').hidden=!$('business-form').hidden;};
$('template').onchange=()=>{$('business-name').value=$('template').value;};
$('business-form').onsubmit=e=>{e.preventDefault();run(async()=>{const input=businessInput($('business-name').value,$('business-stage').value);let b;if(demo){b={...input,id:crypto.randomUUID(),purpose:'',audience:'',offer:'',milestone:'',services:[]};businesses.push(b);record(b,'Workspace created');}else{b=unwrap(await client.from('agency_businesses').insert({...input,owner_id:user.id}).select().single());businesses.push(b);}selected=b.id;$('business-form').reset();$('business-form').hidden=true;await render();status('Business workspace created.');},e.submitter);};
function ensureSaved(){
  const b=businesses.find(x=>x.id===selected);
  if(!b)return;
  const briefChanged=['purpose','audience','offer','milestone'].some(k=>$(k).value.trim()!==(b[k]||''))||$('edit-stage').value!==b.stage;
  const checked=[...document.querySelectorAll('#service-options input:checked')].map(c=>c.value);
  const servicesChanged=checked.length!==b.services.length||checked.some(s=>!b.services.includes(s));
  const extendedDraft=['project','request','integration'].some(k=>[...$(k+'-form').querySelectorAll('input,textarea')].some(e=>e.value.trim()))||$('document-file').files.length;
  if(extendedDraft||briefChanged||servicesChanged||$('task-title').value.trim()||(!$('business-form').hidden&&$('business-name').value.trim()))throw Error('Save your changes or clear the unfinished form before switching or refreshing workspaces.');
}
$('refresh').onclick=()=>run(async()=>{
  ensureSaved();
  if(!demo){businesses=unwrap(await client.from('agency_businesses').select('*').order('created_at'));selected=businesses.some(b=>b.id===selected)?selected:businesses[0]?.id;}
  await render();status(demo?'Sample workspace refreshed.':'Latest saved workspaces loaded.');
},$('refresh'));
async function render(){
  const list=$('business-list');list.replaceChildren();businesses.forEach(b=>{const btn=element('button',b.name);btn.type='button';btn.setAttribute('aria-pressed',String(b.id===selected));btn.onclick=()=>run(async()=>{ensureSaved();selected=b.id;await render();});list.append(btn);});
  const b=businesses.find(x=>x.id===selected);$('empty').hidden=Boolean(b);$('workspace').hidden=!b;if(!b){$('sync-state').textContent=demo?'Preview · not saved to an account':'Connected · no workspaces yet';return;}
  $('sync-state').textContent=demo?'Preview · not saved to an account':'Loading saved workspace…';
  if(demo){tasks=sample(b).tasks;activity=sample(b).activity;records=sample(b).records;documents=sample(b).documents;}else{[tasks,activity,records,documents]=await Promise.all([client.from('agency_tasks').select('*').eq('business_id',b.id).order('created_at').then(unwrap),client.from('agency_activity').select('*').eq('business_id',b.id).order('created_at',{ascending:false}).limit(50).then(unwrap),client.from('agency_records').select('*').eq('business_id',b.id).order('created_at',{ascending:false}).then(unwrap),client.from('agency_documents').select('*').eq('business_id',b.id).order('created_at',{ascending:false}).then(unwrap)]);}
  $('business-title').textContent=b.name;$('stage').textContent=b.stage+' · business development';$('milestone-text').textContent=b.milestone||'Set your first milestone in the business brief.';
  const metrics=$('metrics');metrics.replaceChildren();[[tasks.filter(t=>!t.done).length,'Open tasks'],[tasks.filter(t=>t.done).length,'Completed tasks'],[b.services.length,'Services shortlisted']].forEach(([n,label])=>{const el=element('div','', 'metric');el.append(element('b',String(n)),element('span',label));metrics.append(el);});
  ['purpose','audience','offer','milestone'].forEach(k=>$(k).value=b[k]||'');$('edit-stage').value=b.stage;
  $('task-list').replaceChildren();tasks.forEach(t=>{const li=document.createElement('li'),label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=t.done;check.onchange=()=>run(async()=>{const done=check.checked;if(demo){t.done=done;record(b,done?'Task completed':'Task reopened');}else unwrap(await client.from('agency_tasks').update({done}).eq('id',t.id).eq('business_id',b.id));await render();},check);label.append(check,element('span',t.title));li.append(label);$('task-list').append(li);});if(!tasks.length)$('task-list').append(element('li','No tasks yet. Add a next action.'));
  document.querySelectorAll('#service-options input').forEach(c=>c.checked=b.services.includes(c.value));
  $('activity-list').replaceChildren();activity.forEach(a=>$('activity-list').append(element('li',new Date(a.created_at).toLocaleString()+' · '+a.message)));if(!activity.length)$('activity-list').append(element('li','No changes recorded yet.'));
  renderExtensions(b);
  $('sync-state').textContent=demo?'Preview · not saved to an account':'Saved data loaded · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+' · refresh for changes made elsewhere';
}
$('brief-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),change={};['purpose','audience','offer','milestone'].forEach(k=>change[k]=$(k).value.trim());change.stage=$('edit-stage').value;if(demo){Object.assign(b,change);record(b,'Business brief updated');}else Object.assign(b,unwrap(await client.from('agency_businesses').update(change).eq('id',b.id).select().single()));await render();status('Brief saved.');},e.submitter);};
$('task-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),title=taskInput($('task-title').value);if(demo){sample(b).tasks.push({id:crypto.randomUUID(),title,done:false});record(b,'Task added');}else unwrap(await client.from('agency_tasks').insert({business_id:b.id,title}));$('task-form').reset();await render();status('Task added.');},e.submitter);};
$('services-form').onsubmit=e=>{e.preventDefault();run(async()=>{const b=businesses.find(x=>x.id===selected),services=[...document.querySelectorAll('#service-options input:checked')].map(c=>c.value);if(demo){b.services=services;record(b,'Service shortlist updated');}else Object.assign(b,unwrap(await client.from('agency_businesses').update({services}).eq('id',b.id).select().single()));await render();status('Shortlist saved. No agent has been activated.');},e.submitter);};
function selectView(view){
 const allowed=[...document.querySelectorAll('[data-view]')].map(b=>b.dataset.view);
 if(!allowed.includes(view))view='overview';
 document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==view);
}
document.querySelectorAll('[data-view]').forEach(btn=>btn.onclick=()=>selectView(btn.dataset.view));
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


function renderExtensions(b){
 for(const kind of ['project','request','integration']){
  const list=$(kind+'-list');list.replaceChildren();
  records.filter(r=>r.kind===kind).forEach(r=>{
   const li=element('li','');li.append(element('strong',r.title),element('p',r.details||''));
   const label=element('label','Status'),select=document.createElement('select');
   for(const name of ['Draft','Active','Completed','Cancelled']){const o=element('option',name);o.value=name;select.append(o);}select.value=r.status;
   select.onchange=()=>run(async()=>{const value=select.value;if(demo){r.status=value;record(b,kind+' status updated');}else unwrap(await client.from('agency_records').update({status:value}).eq('id',r.id).eq('business_id',b.id));await render();},select);
   label.append(select);li.append(label);list.append(li);
  });if(!list.children.length)list.append(element('li','No '+kind+' records yet.'));
 }
 const list=$('document-list');list.replaceChildren();
 documents.forEach(d=>{const li=element('li',d.name+' · '+Math.ceil(d.size/1024)+' KB');if(!demo){const download=element('button','Prepare download','secondary');download.type='button';download.onclick=()=>run(async()=>{const data=unwrap(await client.storage.from('agency-private').createSignedUrl(d.path,60));const a=element('a','Open document (link expires in one minute)');a.href=data.signedUrl;a.target='_blank';a.rel='noopener noreferrer';li.append(a);},download);li.append(download);}list.append(li);});if(!documents.length)list.append(element('li','No documents yet.'));
 const report=$('report-summary');report.replaceChildren();
 [[records.filter(r=>r.kind==='project').length,'Projects'],[tasks.length?Math.round(100*tasks.filter(t=>t.done).length/tasks.length)+'%':'0%','Tasks completed'],[documents.length,'Documents']].forEach(([n,label])=>{const e=element('div','','metric');e.append(element('b',String(n)),element('span',label));report.append(e);});
}
for(const kind of ['project','request','integration'])$(kind+'-form').onsubmit=e=>{e.preventDefault();run(async()=>{
 const b=businesses.find(x=>x.id===selected),form=e.currentTarget||$(kind+'-form');
 const title=form.elements.title.value.trim(),details=form.elements.details.value.trim();if(!title||title.length>160||details.length>3000)throw Error('Enter a title and details within the shown limits.');
 const row={business_id:b.id,kind,title,details,status:'Draft'};
 if(demo){sample(b).records.unshift({...row,id:crypto.randomUUID()});record(b,kind+' recorded');}else unwrap(await client.from('agency_records').insert(row));
 form.reset();await render();status('Saved. No external action has been activated.');
},e.submitter);};
$('document-form').onsubmit=e=>{e.preventDefault();run(async()=>{
 const b=businesses.find(x=>x.id===selected),file=$('document-file').files[0];
 const types={pdf:'application/pdf',txt:'text/plain',csv:'text/csv',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'};
 const ext=file?.name.split('.').pop().toLowerCase();if(!file||!types[ext]||file.size>10*1024*1024||!file.size)throw Error('Choose a supported, non-empty file of up to 10 MB.');
 if(demo){sample(b).documents.unshift({id:crypto.randomUUID(),name:file.name,size:file.size});record(b,'Sample document name recorded');}
 else{const path=b.id+'/'+crypto.randomUUID()+'.'+ext;unwrap(await client.storage.from('agency-private').upload(path,file,{contentType:types[ext],upsert:false}));
  try{unwrap(await client.from('agency_documents').insert({business_id:b.id,name:file.name.slice(0,255),size:file.size,path}));}catch(error){await client.storage.from('agency-private').remove([path]);throw error;}}
 $('document-form').reset();await render();status(demo?'Filename recorded in preview. No file uploaded.':'Private document uploaded.');
},e.submitter);};
$('export-report').onclick=()=>{const b=businesses.find(x=>x.id===selected);const blob=new Blob([JSON.stringify({business:{name:b.name,stage:b.stage,purpose:b.purpose,audience:b.audience,offer:b.offer,milestone:b.milestone,services:b.services},tasks:tasks.map(t=>({title:t.title,done:t.done})),records:records.map(r=>({kind:r.kind,title:r.title,details:r.details,status:r.status})),documents:documents.map(d=>({name:d.name,size:d.size})),generatedAt:new Date().toISOString(),preview:demo},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='agency-workspace-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('settings-reset').onclick=()=>run(async()=>{if(demo)throw Error('Password reset is available after creating a real account.');unwrap(await client.auth.resetPasswordForEmail(user.email,{redirectTo:location.origin+location.pathname}));status('Password reset email requested. Check your inbox.');},$('settings-reset'));
