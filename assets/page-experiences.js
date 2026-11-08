/* Manifold Grace — additive page-specific reading companions (2026-11-08).
 * No external libraries, no motion loops, no replacements or hidden content.
 * Each experience is progressive enhancement: ordinary page links remain usable. */
(()=>{'use strict';
const modes={
 'research.html':{type:'finder',name:'Research explorer',intro:'Find a research theme, then follow its existing citations and project links.',hint:'Search research sections'},
 'heritage.html':{type:'corridor',name:'Heritage corridors',intro:'Move between the existing historical corridors without changing the archival record.'},
 'creative.html':{type:'cards',name:'Creative pathways',intro:'Follow a discipline through the existing music, community and visual research sections.'},
 'information-science.html':{type:'compare',name:'Evidence connections',intro:'Select two existing topics to cross-check their methods and supporting evidence.'},
 'public-interest-ai.html':{type:'paths',name:'Public-interest participation',intro:'Choose the relevant pathway; existing registration and assessment forms remain untouched.'},
 'professional.html':{type:'finder',name:'Professional evidence navigator',intro:'Locate documented experience and follow its sources.',hint:'Search experience and evidence'},
 'faith.html':{type:'reader',name:'Reading companion',intro:'Use a quieter reading width or follow an existing section. The text is unchanged.'},
 'productivity-log.html':{type:'diary',name:'Daily diary navigator',intro:'Jump to a dated entry while keeping every original entry in chronological order.'},
 'team.html':{type:'paths',name:'Team and participation',intro:'Explore the existing culture and volunteer information without changing the form.'},
 'careers.html':{type:'finder',name:'Career disciplines explorer',intro:'Search proposed disciplines and read each description. This does not imply current vacancies.',hint:'Search potential disciplines'}
};
const key=decodeURIComponent(location.pathname.split('/').pop()||'');
const config=modes[key];if(!config)return;
const main=document.querySelector('main');if(!main||document.getElementById('mg-experience'))return;
const headings=[...main.querySelectorAll('h2,h3')].filter(h=>!h.closest('header,footer,[hidden],template,form') && h.textContent.trim().length>2);
const intro=main.querySelector('.page-hero')||main.firstElementChild;
if(!intro||!headings.length)return;
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,65);
let assigned=0;
const entries=headings.map(h=>{
 let id=h.id||h.closest('section[id],article[id]')?.id;
 if(!id){id='mg-reading-'+slug(h.textContent.trim())+'-'+(++assigned);h.id=id;}
 return {id,title:h.textContent.replace(/\s+/g,' ').trim(),h};
}).filter(e=>e.title.length>2);
const root=document.createElement('section');root.id='mg-experience';root.className='mg-exp';root.setAttribute('aria-label',config.name);
const inside=document.createElement('div');inside.className='mg-exp-inner';
const details=document.createElement('details');details.className='mg-exp-details';
const summary=document.createElement('summary');summary.textContent=config.name;details.appendChild(summary);
const p=document.createElement('p');p.className='mg-exp-intro';p.textContent=config.intro;details.appendChild(p);
const panel=document.createElement('div');panel.className='mg-exp-panel';details.appendChild(panel);
inside.appendChild(details);root.appendChild(inside);
intro.insertAdjacentElement('afterend',root);
const style=document.createElement('style');
style.textContent=`
#mg-experience{position:relative;clear:both;background:transparent;border-bottom:1px solid #ffffff24;color:inherit}
#mg-experience .mg-exp-inner{width:min(1080px,92%);margin:0 auto;padding:13px 0}
#mg-experience summary{cursor:pointer;font-weight:650;font-size:.92rem;color:inherit;list-style:revert;min-height:33px}
#mg-experience summary:focus-visible,#mg-experience a:focus-visible,#mg-experience button:focus-visible,#mg-experience input:focus-visible,#mg-experience select:focus-visible{outline:2px solid #8fc4ff;outline-offset:3px}
#mg-experience .mg-exp-intro{max-width:75ch;margin:8px 0 15px;font-size:.9rem;line-height:1.6;color:#d0d0d0}
#mg-experience .mg-exp-panel{padding:0 0 10px}
#mg-experience .mg-exp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:8px}
#mg-experience .mg-exp-link{display:block;border:1px solid #ffffff3a;border-radius:10px;padding:10px 12px;text-decoration:none;color:#b7d8ff;background:#ffffff08;line-height:1.4;font-size:.87rem}
#mg-experience .mg-exp-link:hover{border-color:#8fc4ff;background:#ffffff14}
#mg-experience .mg-exp-label{display:block;margin:8px 0 4px;font-size:.83rem}
#mg-experience input,#mg-experience select{width:100%;max-width:450px;min-height:42px;border:1px solid #777;background:#171717;color:#fff;border-radius:8px;padding:8px 12px;font:inherit}
#mg-experience button{min-height:42px;border:1px solid #888;border-radius:9px;background:#242424;color:#fff;font:inherit;padding:8px 14px;cursor:pointer}
#mg-experience .mg-exp-row{display:flex;gap:10px;flex-wrap:wrap;align-items:end}
#mg-experience .mg-exp-field{flex:1 1 210px}
#mg-experience .mg-exp-status{font-size:.8rem;color:#d2d2d2;margin:8px 0}
#mg-experience .mg-exp-reader-active{font-weight:700}
body.mg-exp-reading main>section:not(#mg-experience) .wrap{max-width:820px}
body.mg-exp-reading main p,body.mg-exp-reading main li{line-height:1.85}
@media(prefers-reduced-motion:reduce){#mg-experience *{scroll-behavior:auto!important;transition:none!important}}
@media print{#mg-experience{display:none!important}}
`;
document.head.appendChild(style);
function el(tag,cls,txt){const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node;}
function link(e){const a=el('a','mg-exp-link',e.title);a.href='#'+encodeURIComponent(e.id);return a;}
function list(items,max=20){const grid=el('div','mg-exp-grid');items.slice(0,max).forEach(e=>grid.appendChild(link(e)));return grid;}
function choose(items,label){const field=el('label','mg-exp-field');field.appendChild(el('span','mg-exp-label',label));const sel=el('select');items.forEach(e=>{const o=el('option',null,e.title);o.value=e.id;sel.appendChild(o)});field.appendChild(sel);return {field,sel};}
function go(id){const target=document.getElementById(id);if(!target)return;target.scrollIntoView({block:'start',behavior:'instant'});history.replaceState(null,'','#'+encodeURIComponent(id));}
const preferred=(terms)=>{const re=new RegExp(terms,'i');const found=entries.filter(e=>re.test(e.title));return found.length?found:entries.slice(0,5)};
switch(config.type){
case 'finder':{
 const field=el('label');field.appendChild(el('span','mg-exp-label',config.hint));
 const input=el('input');input.type='search';input.placeholder='Type to locate an existing section';field.appendChild(input);panel.appendChild(field);
 const status=el('p','mg-exp-status');status.setAttribute('role','status');panel.appendChild(status);
 const grid=el('div','mg-exp-grid');panel.appendChild(grid);
 function render(){const q=input.value.trim().toLocaleLowerCase();grid.replaceChildren();const matched=entries.filter(e=>e.title.toLocaleLowerCase().includes(q));matched.slice(0,18).forEach(e=>grid.appendChild(link(e)));status.textContent=matched.length+' section'+(matched.length===1?'':'s')+' available; all original content remains below.';}
 input.addEventListener('input',render);render();break;}
case 'corridor':{
 const found=preferred('corridor|lineage|grandparent|archives|timeline|record|heritage');panel.appendChild(list(found,16));break;}
case 'cards':{
 panel.appendChild(list(preferred('discipline|listening|priory|creative|visual|music|roots'),10));break;}
case 'compare':{
 const a=choose(entries,'First topic'),b=choose(entries,'Second topic');if(entries.length>1)b.sel.selectedIndex=1;
 const row=el('div','mg-exp-row');row.append(a.field,b.field);
 const goA=el('button',null,'Read first'),goB=el('button',null,'Read second');goA.type=goB.type='button';goA.addEventListener('click',()=>go(a.sel.value));goB.addEventListener('click',()=>go(b.sel.value));row.append(goA,goB);panel.appendChild(row);break;}
case 'paths':{
 const options=key==='team.html'?preferred('culture|wellbeing|flexibility|inclusive|volunteer'):preferred('get involved|register|assessment|discover');
 panel.appendChild(list(options,10));break;}
case 'reader':{
 const button=el('button',null,'Use focused reading width');button.type='button';button.setAttribute('aria-pressed','false');
 button.addEventListener('click',()=>{const on=document.body.classList.toggle('mg-exp-reading');button.textContent=on?'Restore original reading width':'Use focused reading width';button.setAttribute('aria-pressed',String(on));});
 panel.appendChild(button);panel.appendChild(list(entries,12));break;}
case 'diary':{
 const days=[...main.querySelectorAll('.log-day[id]')].map(node=>({id:node.id,title:node.querySelector('h2')?.textContent?.trim()||node.id}));
 panel.appendChild(list(days,60));break;}
}
})();
