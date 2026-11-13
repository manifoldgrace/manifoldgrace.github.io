(()=>{
"use strict";
const $=id=>document.getElementById(id);
const elements={search:$("bai-search"),topic:$("bai-topic"),sort:$("bai-sort"),results:$("bai-results"),status:$("bai-status"),count:$("bai-count"),updated:$("bai-updated"),more:$("bai-more")};
let records=[],shown=30;
const categoryOrder=["Governance & regulation","Investment & markets","Infrastructure & chips","Safety & cybersecurity","Workforce & society","Models & research","AI industry"];
const safeUrl=u=>{try{let v=new URL(u);return v.protocol==="https:" && (v.hostname==="bloomberg.com"||v.hostname.endsWith(".bloomberg.com"))?v.href:""}catch{return ""}};
const fmt=d=>{if(!d)return "Publication date unavailable";const v=new Date(d);return Number.isNaN(v.valueOf())?"Publication date unavailable":new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(v)};
function refresh(){
 const q=elements.search.value.trim().toLowerCase(),topic=elements.topic.value,sort=elements.sort.value;
 let rows=records.filter(a=>(!q||[a.title,a.authors,...(a.categories||[])].join(" ").toLowerCase().includes(q))&&(!topic||(a.categories||[]).includes(topic)));
 rows.sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="oldest"?a.published.localeCompare(b.published):b.published.localeCompare(a.published));
 const slice=rows.slice(0,shown);elements.results.replaceChildren();
 for(const a of slice){
  const article=document.createElement("article"),heading=document.createElement("h2"),link=document.createElement("a"),meta=document.createElement("p"),categories=document.createElement("p");
  link.href=safeUrl(a.url);if(!link.href)continue;link.target="_blank";link.rel="noopener noreferrer";link.textContent=a.title;
  heading.append(link);meta.className="dim";meta.textContent=fmt(a.published)+(a.authors?" · "+a.authors:"")+" · Bloomberg";
  categories.className="tags";categories.textContent=(a.categories||[]).join(" · ");
  article.append(heading,meta,categories);elements.results.append(article);
 }
 elements.status.textContent=records.length?(rows.length+" matching stories; "+slice.length+" displayed"):"No collected stories are available yet. The archive will populate after a successful scheduled collection. This is not a claim that Bloomberg has no relevant stories.";
 elements.more.hidden=shown>=rows.length;
}
async function load(){
 try{
 const response=await fetch("assets/bloomberg-ai-index.json",{cache:"no-store"});
 if(!response.ok)throw Error("HTTP "+response.status);
 const obj=await response.json();
 if(!Array.isArray(obj.articles))throw Error("Invalid index format");
 records=obj.articles.filter(a=>a&&a.title&&a.published&&safeUrl(a.url));
 elements.count.textContent=records.length+" source-dated indexed "+(records.length===1?"story":"stories");
 elements.updated.textContent=obj.archive_updated_utc?"Last successful collection: "+new Date(obj.archive_updated_utc).toLocaleString("en-GB",{timeZone:"Europe/London"}):"First successful collection pending";
 let values=new Set(records.flatMap(a=>a.categories||[]));
 for(const cat of [...values].sort((a,b)=>categoryOrder.indexOf(a)-categoryOrder.indexOf(b))){const option=document.createElement("option");option.value=cat;option.textContent=cat;elements.topic.append(option)}
 refresh();
 }catch(error){elements.status.textContent="Archive could not be loaded. View the publisher feed or the collection workflow for current status.";elements.count.textContent="Archive unavailable";elements.updated.textContent="Collection unverified";}
}
for(const e of [elements.search,elements.topic,elements.sort])e.addEventListener("input",()=>{shown=30;refresh()});
elements.more.addEventListener("click",()=>{shown+=30;refresh()});
load();
})();