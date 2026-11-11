/* Global News — homepage-native, source-linked news metadata via the open GDELT DOC API.
 * Not a publisher's own feed or original reporting. Dates are GDELT indexed dates.
 * No third-party photographs, videos, text bodies or fabricated summaries.
 */
(() => {
"use strict";
const PROVIDERS=[
["Al Jazeera","AJ","https://www.aljazeera.com/","aljazeera.com"],
["Associated Press","AP","https://apnews.com/","apnews.com"],
["BBC News","BBC","https://www.bbc.com/news","bbc.com"],
["CBC News","CBC","https://www.cbc.ca/news","cbc.ca"],
["CNA","CNA","https://www.channelnewsasia.com/","channelnewsasia.com"],
["Deutsche Welle","DW","https://www.dw.com/en/top-stories/s-9097","dw.com"],
["Euronews","EN","https://www.euronews.com/","euronews.com"],
["France 24","F24","https://www.france24.com/en/","france24.com"],
["The Guardian","G","https://www.theguardian.com/international","theguardian.com"],
["NHK World Japan","NHK","https://www3.nhk.or.jp/nhkworld/en/news/","nhk.or.jp"],
["NPR","NPR","https://www.npr.org/sections/news/","npr.org"],
["The New York Times","NYT","https://www.nytimes.com/section/world","nytimes.com"],
["Reuters","R","https://www.reuters.com/world/","reuters.com"],
["Sky News","SKY","https://news.sky.com/world","news.sky.com"]
].sort((a,b)=>a[0].localeCompare(b[0]));
const REGIONS=["All regions","Africa","Americas","Asia Pacific","Europe","Middle East","United Kingdom","World"];
const $=id=>document.getElementById(id);
const E={providers:$("mg-news-providers"),regions:$("mg-news-regions"),feed:$("mg-news-headlines"),source:$("mg-news-source"),status:$("mg-news-status"),views:$("mg-news-views"),drawer:$("mg-news-drawer"),title:$("mg-news-drawer-title"),meta:$("mg-news-drawer-meta"),summary:$("mg-news-drawer-summary"),link:$("mg-news-drawer-link"),close:$("mg-news-drawer-close")};
if(!E.providers||!E.regions||!E.feed||!E.source||!E.views)return;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isHttp=u=>{try{return /^https?:$/.test(new URL(u).protocol)}catch{return false}};
const state={selected:"all",region:"All regions",view:"cards",stories:[],busy:false,source:"",updated:""};
const cache=new Map();let requestVersion=0,previousFocus=null;
function normaliseRegion(url){
let path="";try{path=decodeURIComponent(new URL(url).pathname.toLowerCase())}catch{return "World"}
if(/\/(africa|afrique)(\/|-|$)/.test(path))return "Africa";
if(/\/(asia|china|india|japan|singapore|australia|pacific)(\/|-|$)/.test(path))return "Asia Pacific";
if(/\/(europe|europa)(\/|-|$)/.test(path))return "Europe";
if(/\/(middle-east|middle_east|middleeast|moyen-orient)(\/|-|$)/.test(path))return "Middle East";
if(/\/(us|usa|america|americas|canada|latin-america|latin_america)(\/|-|$)/.test(path))return "Americas";
if(/\/(uk|united-kingdom|england|scotland|wales|northern-ireland)(\/|-|$)/.test(path))return "United Kingdom";
return "World";
}
function publisherFor(url){
try{const h=new URL(url).hostname.toLowerCase();
return PROVIDERS.find(p=>h===p[3]||h.endsWith("."+p[3]));}catch{return null}
}
function fromGDELT(article){
if(!article || !isHttp(article.url) || !article.title)return null;
const p=publisherFor(article.url);
if(!p)return null;
const d=String(article.seendate||"");
let when="";
if(/^\d{14}$/.test(d))when=d.slice(0,4)+"-"+d.slice(4,6)+"-"+d.slice(6,8)+"T"+d.slice(8,10)+":"+d.slice(10,12)+":"+d.slice(12,14)+"Z";
const pathRegion=normaliseRegion(article.url);
const region=(pathRegion==="World" && state.region!=="All regions" && state.region!=="World")?state.region:pathRegion;
return {provider:p[0],url:article.url,title:String(article.title).slice(0,220),published:when,region,classification:pathRegion==="World"&&region!=="World"?"search-keyword":"publisher-url-path",source:"GDELT indexed article"};
}
function uniq(items){
const seen=new Set();
return items.filter(x=>{if(!x||seen.has(x.url))return false;seen.add(x.url);return true});
}
function visibleStories(){
let rows=state.stories.filter(x=>state.region==="All regions"||state.region==="World"||x.region===state.region);
rows.sort((a,b)=>String(b.published).localeCompare(String(a.published)));
if(state.selected!=="all")return rows.slice(0,5);
const counts={};
return rows.filter(x=>(counts[x.provider]=(counts[x.provider]||0)+1)<=5).slice(0,60);
}
function labelDate(s){
if(!s)return "Date unavailable";
const d=new Date(s);
return Number.isNaN(d.getTime())?"Date unavailable":d.toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"});
}
function renderControls(){
const ps=E.providers.scrollLeft,rs=E.regions.scrollLeft;
E.providers.innerHTML='<button type="button" class="mg-news-pill" data-p="all" aria-pressed="'+(state.selected==="all")+'"><span class="mg-news-mark">ALL</span>All newsrooms</button>'+PROVIDERS.map((p,i)=>'<button type="button" class="mg-news-pill" data-p="'+i+'" aria-pressed="'+(String(i)===state.selected)+'"><span class="mg-news-mark">'+esc(p[1])+'</span>'+esc(p[0])+'</button>').join("");
E.regions.innerHTML=REGIONS.map(region=>'<button type="button" class="mg-news-region" data-r="'+esc(region)+'" aria-pressed="'+(state.region===region)+'">'+esc(region)+'</button>').join("");
E.providers.scrollLeft=ps;E.regions.scrollLeft=rs;
E.views.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===state.view)));
}
function renderStories(){
E.feed.className="mg-news-story-area "+(state.view==="cards"?"mg-news-story-cards":"mg-news-story-list");
const stories=visibleStories();
if(state.busy && !stories.length){E.feed.innerHTML='<p class="mg-news-empty">Loading recently indexed news from the selected source…</p>';return;}
if(!stories.length){E.feed.innerHTML='<p class="mg-news-empty">No recent indexed stories for this selection. Choose another newsroom or region, or visit the publisher directly.</p>';return;}
E.feed.innerHTML=stories.map((a,i)=>'<article class="mg-news-story">'+(state.view==="cards"?'<div class="mg-news-thumb mg-news-thumb-empty" aria-hidden="true">'+esc((PROVIDERS.find(p=>p[0]===a.provider)||["","NEWS"])[1])+'</div>':'')+'<div class="mg-news-story-copy"><span class="mg-news-story-meta">'+esc(a.provider)+' · '+esc(a.region)+(a.classification==='search-keyword'?' (topic match)':'')+' · '+esc(labelDate(a.published))+'</span><span class="mg-news-story-title">'+esc(a.title)+'</span></div><a class="mg-news-story-open" href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Read '+esc(a.title)+' on '+esc(a.provider)+'">Read story ↗</a></article>').join("");
}
function render(){
renderControls();
E.source.href=state.selected==="all"?"https://www.gdeltproject.org/":PROVIDERS[Number(state.selected)][2];
E.source.textContent=state.selected==="all"?"How these stories are indexed":("Visit "+PROVIDERS[Number(state.selected)][0]);
E.status.textContent=(state.busy?"Updating… · ":"")+state.stories.length+" indexed articles · "+(state.updated?("indexed "+state.updated+" · "):"")+"Metadata from GDELT, not a publisher ranking";
renderStories();
}
function queryFor(){
const terms=state.selected==="all"?
PROVIDERS.map(p=>"domain:"+p[3]).join(" OR "):
"domain:"+PROVIDERS[Number(state.selected)][3];
const regionWords={"Africa":"Africa","Americas":"America","Asia Pacific":"Asia","Europe":"Europe","Middle East":"\"Middle East\"","United Kingdom":"Britain"};
const suffix=regionWords[state.region]?" "+regionWords[state.region]:"";
return (state.selected==="all"?"("+terms+")":terms)+suffix;
}
async function load(){
const query=queryFor(),v=++requestVersion;
if(cache.has(query)){state.stories=cache.get(query);state.updated="cached this visit";state.busy=false;render();return;}
state.stories=[];state.busy=true;state.updated="";render();
const params=new URLSearchParams({query,mode:"artlist",maxrecords:state.selected==="all"?"250":"35",format:"json",timespan:"2d"});
const url="https://api.gdeltproject.org/api/v2/doc/doc?"+params.toString();
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),16000);
try{
const res=await fetch(url,{signal:controller.signal,cache:"no-store"});
if(!res.ok)throw Error("Unavailable "+res.status);
const json=await res.json();
if(v!==requestVersion)return;
const rows=uniq((Array.isArray(json.articles)?json.articles:[]).map(fromGDELT));
cache.set(query,rows);state.stories=rows;state.updated=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"});
}catch(error){
if(v!==requestVersion)return;
const saved=window.__mgNewsFallback;
if(Array.isArray(saved))state.stories=saved;
state.updated=state.stories.length?"Last available snapshot":"Live source temporarily unavailable";
}finally{
clearTimeout(timer);
if(v===requestVersion){state.busy=false;render();}
}
}
E.providers.addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(!b)return;state.selected=b.dataset.p;load();});
E.regions.addEventListener("click",e=>{const b=e.target.closest("[data-r]");if(!b)return;state.region=b.dataset.r;load();});
E.views.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(!b)return;state.view=b.dataset.view;render();});
render();load();
})();