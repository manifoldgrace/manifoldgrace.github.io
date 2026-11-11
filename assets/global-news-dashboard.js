/* Compact global news viewer. Safe by default: no fabricated headlines, images, dates or automatic third-party embeds. */
(() => {
"use strict";
const providers=[
["Al Jazeera","AJ","https://www.aljazeera.com/","Middle East"],
["Associated Press","AP","https://apnews.com/","Americas"],
["BBC News","BBC","https://www.bbc.com/news","Europe"],
["CBC News","CBC","https://www.cbc.ca/news","Americas"],
["CNA","CNA","https://www.channelnewsasia.com/","Asia Pacific"],
["Deutsche Welle","DW","https://www.dw.com/en/top-stories/s-9097","Europe"],
["Euronews","EN","https://www.euronews.com/","Europe"],
["France 24","F24","https://www.france24.com/en/","Europe"],
["The Guardian","G","https://www.theguardian.com/international","Europe"],
["NHK World Japan","NHK","https://www3.nhk.or.jp/nhkworld/en/news/","Asia Pacific"],
["NPR","NPR","https://www.npr.org/sections/news/","Americas"],
["The New York Times","NYT","https://www.nytimes.com/section/world","Americas"],
["Reuters","R","https://www.reuters.com/world/","Europe"],
["Sky News","SKY","https://news.sky.com/world","Europe"]
].sort((a,b)=>a[0].localeCompare(b[0]));
const regions=["All regions","Africa","Americas","Asia Pacific","Europe","Middle East","Worldwide"];
const id=(x)=>document.getElementById(x);
const els={providers:id("mg-news-providers"),regions:id("mg-news-regions"),feed:id("mg-news-headlines"),source:id("mg-news-source"),status:id("mg-news-status"),views:id("mg-news-views"),drawer:id("mg-news-drawer"),drawerTitle:id("mg-news-drawer-title"),drawerMeta:id("mg-news-drawer-meta"),drawerSummary:id("mg-news-drawer-summary"),drawerLink:id("mg-news-drawer-link"),close:id("mg-news-drawer-close")};
if(!els.providers||!els.regions||!els.feed||!els.views||!els.source)return;
const safe=(s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isSafeUrl=(x)=>{try{const u=new URL(x);return /^https?:$/.test(u.protocol)}catch{return false}};
const state={provider:0,region:"All regions",view:"list",feed:null};
let previousFocus=null;
function entriesFor(){
const p=providers[state.provider];
const raw=state.feed?.providers?.[p[0]]?.items;
if(!Array.isArray(raw))return [];
return raw.filter(x=>x && typeof x.title==="string" && isSafeUrl(x.url))
.filter(x=>state.region==="All regions"||state.region==="Worldwide"||x.region===state.region)
.sort((a,b)=>new Date(b.published||0)-new Date(a.published||0))
.slice(0,5);
}
function renderControls(){
const providerScroll=els.providers.scrollLeft,regionScroll=els.regions.scrollLeft;
els.providers.innerHTML=providers.map((p,i)=>'<button class="mg-news-pill" type="button" data-p="'+i+'" aria-pressed="'+(state.provider===i)+'"><span class="mg-news-mark" aria-hidden="true">'+safe(p[1])+'</span><span>'+safe(p[0])+'</span></button>').join("");
els.regions.innerHTML=regions.map(x=>'<button class="mg-news-region" type="button" data-r="'+safe(x)+'" aria-pressed="'+(state.region===x)+'">'+safe(x)+'</button>').join("");
els.providers.scrollLeft=providerScroll;
els.regions.scrollLeft=regionScroll;
els.views.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===state.view)));
}
function renderFeed(){
const p=providers[state.provider],items=entriesFor();
els.source.href=p[2];
els.source.textContent="Visit "+p[0];
els.feed.className="mg-news-story-area "+(state.view==="cards"?"mg-news-story-cards":"mg-news-story-list");
if(!items.length){
els.feed.innerHTML='<p class="mg-news-empty">No verified syndicated headlines available for this selection. Open the publisher’s newsroom for current reporting.</p>';
els.status.textContent="Publisher directory · live headlines not connected";
return;
}
els.status.textContent=items.length+" available headline"+(items.length!==1?"s":"")+" · "+p[0]+" · last feed update "+safe(state.feed.updated||"not supplied");
els.feed.innerHTML=items.map((item,i)=>{
const pic=item.image && isSafeUrl(item.image) && item.image_authorised===true?'<img class="mg-news-thumb" src="'+safe(item.image)+'" loading="lazy" alt="">':'<span class="mg-news-thumb mg-news-thumb-empty" aria-hidden="true">'+safe(p[1])+'</span>';
const tag=item.media_type==="video"?'Video · ':'';
return '<button class="mg-news-story" type="button" data-story="'+i+'">'+(state.view==="cards"?pic:"")+'<span class="mg-news-story-copy"><span class="mg-news-story-meta">'+safe(p[0])+' · '+safe(tag+String(item.region||"World"))+' · '+safe(item.published||"Date unavailable")+'</span><span class="mg-news-story-title">'+safe(item.title)+'</span>'+(item.summary?'<span class="mg-news-story-desc">'+safe(item.summary)+'</span>':'')+'</span><span class="mg-news-story-open" aria-hidden="true">↗</span></button>';
}).join("");
}
function showStory(i){
const item=entriesFor()[i];if(!item||!els.drawer)return;
previousFocus=document.activeElement;
els.drawerTitle.textContent=item.title;
els.drawerMeta.textContent=providers[state.provider][0]+" · "+(item.region||"World")+" · "+(item.published||"Date unavailable");
els.drawerSummary.textContent=item.summary||"Open the original source for the article and full context.";
els.drawerLink.href=item.url;
els.drawer.hidden=false;
document.body.classList.add("mg-news-drawer-open");
els.close?.focus();
}
function closeStory(){if(!els.drawer)return;els.drawer.hidden=true;document.body.classList.remove("mg-news-drawer-open");previousFocus?.focus?.();}
function render(){renderControls();renderFeed();}
els.providers.addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(!b)return;state.provider=Number(b.dataset.p);render();});
els.regions.addEventListener("click",e=>{const b=e.target.closest("[data-r]");if(!b)return;state.region=b.dataset.r;render();});
els.views.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(!b)return;state.view=b.dataset.view;render();});
els.feed.addEventListener("click",e=>{const b=e.target.closest("[data-story]");if(b)showStory(Number(b.dataset.story));});
els.close?.addEventListener("click",closeStory);
els.drawer?.addEventListener("click",e=>{if(e.target===els.drawer)closeStory();});
document.addEventListener("keydown",e=>{if(els.drawer&&!els.drawer.hidden){if(e.key==="Escape")closeStory();if(e.key==="Tab"){const link=els.drawerLink,close=els.close;if(e.shiftKey&&document.activeElement===close){e.preventDefault();link.focus();}else if(!e.shiftKey&&document.activeElement===link){e.preventDefault();close.focus();}}}});
render();
fetch("assets/news-headlines.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>{
 if(x?.licensed===true && x.providers && typeof x.providers==="object"){
  // Publishing rights, data freshness and images remain the operator's responsibility.
  state.feed=x;renderFeed();
 }
}).catch(()=>{});
})();