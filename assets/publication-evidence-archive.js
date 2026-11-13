(()=>{"use strict";const $=id=>document.getElementById(id);let records=[],periods=[],max=30;
const fmt=d=>d||"Not recorded";
function safeArchivePath(p){return /^archive\/downloads\/(?:daily|weekly|monthly|yearly)\/[0-9-]+\.pdf$/.test(p) ? p : ""}
function safeHttp(u){try{const a=new URL(u,location.href);return a.protocol==="https:"||a.protocol==="http:"?a.href:""}catch{return ""}}
function link(href,label){let a=document.createElement("a");a.href=href;a.textContent=label;return a}
function renderPeriods(){
 const container=$("archive-periods");container.replaceChildren();
 for(const kind of ["daily","weekly","monthly","yearly"]){
  const group=document.createElement("details"),summary=document.createElement("summary");const selected=periods.filter(p=>p.period===kind);
  summary.textContent=kind[0].toUpperCase()+kind.slice(1)+" downloads ("+selected.length+" periods)";group.append(summary);
  if(kind==="monthly"||kind==="yearly")group.open=true;
  for(const item of selected){const target=safeArchivePath(item.file);if(!target)continue;
   const row=document.createElement("div");row.className="downloads";
   row.append(link(target,item.key+" — "+item.count+" records (PDF)"));group.append(row)}
  if(!selected.length){const p=document.createElement("p");p.className="muted";p.textContent="No generated period PDF verified in the archive manifest.";group.append(p)}
  container.append(group)
 }
}
function renderRecords(){
 let q=$("archive-search").value.trim().toLowerCase(),year=$("archive-year").value;
 let rows=records.filter(r=>(!year||r.recorded_date.slice(0,4)===year)&&(!q||[r.title,r.recorded_date,r.evidence_url].join(" ").toLowerCase().includes(q)));
 let grid=$("archive-stories");grid.replaceChildren();
 for(const r of rows.slice(0,max)){
   const item=document.createElement("article");item.className="story";
   const h=document.createElement("h3"),url=safeHttp(r.source_url);h.append(url?link(url,r.title):document.createTextNode(r.title));
   const p=document.createElement("p");p.textContent="Public log date: "+fmt(r.recorded_date)+" · External article publication date: not independently established";
   item.append(h,p);
   if(r.evidence_url){const e=safeHttp(r.evidence_url);if(e)item.append(link(e,"Evidence source"))}
   grid.append(item)
 }
 $("archive-match-count").textContent=rows.length+" matching recorded items; showing "+Math.min(max,rows.length);
 $("archive-more").hidden=rows.length<=max
}
async function getJSON(path){let r=await fetch(path,{cache:"no-store"});if(!r.ok)throw Error(path+": HTTP "+r.status);return r.json()}
async function init(){
 try{
  const [index,manifest]=await Promise.all([getJSON("archive/metadata/publication-records.json"),getJSON("archive/metadata/periods.json")]);
  if(!Array.isArray(index.records)||!Array.isArray(manifest.periods))throw Error("Invalid archive format");
  records=index.records.filter(r=>r&&r.title&&r.recorded_date&&r.source_url);periods=manifest.periods;
  $("archive-status").textContent="Archive generated "+(manifest.generated_utc||"date unrecorded")+" · "+records.length+" dated public log records · "+periods.length+" period PDFs";
  if(manifest.all_pdf==="archive/downloads/all-records.pdf")$("complete-pdf").hidden=false;
  const years=[...new Set(records.map(r=>r.recorded_date.slice(0,4)))].sort().reverse();for(const y of years){const o=document.createElement("option");o.value=y;o.textContent=y;$("archive-year").append(o)}
  renderPeriods();renderRecords()
 }catch(e){$("archive-status").textContent="Archive outputs are not yet verified as available. The generator and CI workflow exist, but downloadable files require a successful workflow execution.";renderPeriods();$("archive-match-count").textContent="No verified generated index available";}
}
$("archive-search").addEventListener("input",()=>{max=30;renderRecords()});
$("archive-year").addEventListener("change",()=>{max=30;renderRecords()});
$("archive-more").addEventListener("click",()=>{max+=30;renderRecords()});init();
})();