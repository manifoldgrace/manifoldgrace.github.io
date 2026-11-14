/* Manifold Grace architecture atlas: audited v0.2 browser, paginated for mobile and desktop.
   Forty base families or methods; 1,000 proposed research combinations, not established types. */
(()=>{
 "use strict";
 const DATA="research/relational-awareness/architecture-catalogue-audited-v0.2.json";
 const PAGE_SIZE=25;
 const $=id=>document.getElementById(id);
 const fields=["id","base_family","family_kind","configuration","group","relational_problem","evidence_condition","reasoning_strategy","specialised_components","shared_frameworks","research_status"];
 const rowsBody=$("ra-rows"),familiesBody=$("ra-families-rows"),search=$("ra-search"),group=$("ra-group"),evidence=$("ra-evidence"),strategy=$("ra-strategy"),kind=$("ra-kind"),status=$("ra-status"),pageLabel=$("ra-pagenum"),pageSize=$("ra-page-size"),tableWrap=$("ra-tablewrap");
 if(!rowsBody||!status)return;
 let records=[],families=[],page=0,matched=[];
 const make=(tag,value)=>{const el=document.createElement(tag);if(value!==undefined)el.textContent=String(value);return el};
 function addOptions(select,values){if(!select)return;[...new Set(values.filter(Boolean))].sort().forEach(v=>{const o=make("option",v);o.value=v;select.append(o)})}
 function familyTable(){
  if(!familiesBody)return;
  const frag=document.createDocumentFragment();
  families.forEach((f,i)=>{
   const tr=make("tr");
   tr.append(make("td",String(i+1).padStart(2,"0")));
   const name=make("td"),anchor=make("a",f.name);
   if(/^https:\/\//.test(f.context_url)){anchor.href=f.context_url;anchor.target="_blank";anchor.rel="noopener noreferrer";anchor.title="Context reference, not verification of the 25 scenarios"}else anchor.removeAttribute("href");
   name.append(anchor);
   tr.append(name,make("td",f.kind),make("td",f.category),make("td","25 proposed combinations · unvalidated"));
   frag.append(tr);
  });
  familiesBody.replaceChildren(frag);
 }
 function filtered(){
  const q=(search?.value||"").trim().toLocaleLowerCase();
  return records.filter(r=>
   (!q||[r.id,r.base_family,r.family_kind,r.configuration,r.group,r.specialised_components,r.relational_problem].join(" ").toLocaleLowerCase().includes(q))
   &&(!group?.value||r.group===group.value)
   &&(!evidence?.value||r.evidence_condition===evidence.value)
   &&(!strategy?.value||r.reasoning_strategy===strategy.value)
   &&(!kind?.value||r.family_kind===kind.value)
  );
 }
 function render(){
  matched=filtered();
  const limit=Math.max(10,Math.min(100,Number(pageSize?.value)||PAGE_SIZE));
  const pages=Math.max(1,Math.ceil(matched.length/limit));page=Math.min(Math.max(0,page),pages-1);
  const frag=document.createDocumentFragment();
  for(const r of matched.slice(page*limit,(page+1)*limit)){
   const tr=make("tr");tr.dataset.archiveRow="";tr.dataset.id=r.id;
   fields.forEach(key=>{
    const td=make("td");
    if(key==="base_family"&&/^https:\/\//.test(r.base_family_context_url)){
     const a=make("a",r[key]);a.href=r.base_family_context_url;a.className="ra-wiki";a.target="_blank";a.rel="noopener noreferrer";a.title="Architecture/method context (not independent validation)";td.append(a);
    }else if(key==="research_status"){td.textContent="Proposed · not independently validated"}
    else td.textContent=r[key]||"—";
    tr.append(td);
   });frag.append(tr);
  }
  if(!frag.childNodes.length){const tr=make("tr"),td=make("td","No matching configurations.");td.colSpan=fields.length;tr.append(td);frag.append(tr)}
  rowsBody.replaceChildren(frag);
  const a=matched.length?page*limit+1:0,b=Math.min((page+1)*limit,matched.length);
  status.textContent=a+"–"+b+" of "+matched.length+" matching proposed configurations (1,000 total; 40 base families)";
  pageLabel.textContent="Page "+(page+1)+" of "+pages;
  document.querySelectorAll('[data-page="prev"]').forEach(b=>b.disabled=page===0);
  document.querySelectorAll('[data-page="next"]').forEach(b=>b.disabled=page>=pages-1);
 }
 const reset=()=>{page=0;render()};
 [search,group,evidence,strategy,kind,pageSize].filter(Boolean).forEach(el=>el.addEventListener(el===search?"input":"change",reset));
 document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.page==="next")page++;else page--;render();
  tableWrap?.scrollTo({top:0,left:tableWrap.scrollLeft,behavior:"instant"});
  status.focus?.({preventScroll:true});
 }));
 async function load(){
  try{
   const response=await fetch(DATA,{cache:"no-store"});
   if(!response.ok)throw Error("HTTP "+response.status);
   const json=await response.json();
   if(json.schema_version!=="0.2"||json.records?.length!==1000||json.families?.length!==40)throw Error("Unexpected data shape");
   records=json.records;families=json.families;
   addOptions(group,records.map(r=>r.group));addOptions(evidence,records.map(r=>r.evidence_condition));
   addOptions(strategy,records.map(r=>r.reasoning_strategy));addOptions(kind,records.map(r=>r.family_kind));
   familyTable();render();
  }catch(error){
   status.textContent="Interactive catalogue could not load. The original sample remains below; use the audited CSV download.";
   pageLabel.textContent="Data unavailable";
   console.warn("Architecture atlas catalogue:",error);
  }
 }
 load();
})();