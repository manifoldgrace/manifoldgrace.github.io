(() => {
"use strict";
const P=[["Al Jazeera","https://www.aljazeera.com/","AJ","Qatar / international"],["Associated Press","https://apnews.com/","AP","United States / international"],["BBC News","https://www.bbc.com/news","BBC","United Kingdom / international"],["CBC News","https://www.cbc.ca/news","CBC","Canada / international"],["CNA","https://www.channelnewsasia.com/","CNA","Singapore / Asia"],["Deutsche Welle","https://www.dw.com/en/top-stories/s-9097","DW","Germany / international"],["Euronews","https://www.euronews.com/","EN","Europe / international"],["France 24","https://www.france24.com/en/","F24","France / international"],["The Guardian","https://www.theguardian.com/international","G","United Kingdom / international"],["NHK World Japan","https://www3.nhk.or.jp/nhkworld/en/news/","NHK","Japan / international"],["NPR","https://www.npr.org/sections/news/","NPR","United States / international"],["The New York Times","https://www.nytimes.com/section/world","NYT","United States / international"],["Reuters","https://www.reuters.com/world/","R","United Kingdom / international"],["Sky News","https://news.sky.com/world","SKY","United Kingdom / international"]];
const root=document.getElementById("mg-news-providers"),stories=document.getElementById("mg-news-headlines"),source=document.getElementById("mg-news-source"),status=document.getElementById("mg-news-status");
if(!root||!stories||!source||!status)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let feed=null,selected=0;
function render(){
root.innerHTML=P.map(([name,url,mark,region],i)=>'<button type="button" role="tab" class="mg-news-pill" id="mg-news-tab-'+i+'" aria-controls="mg-news-headlines" aria-selected="'+(i===selected)+'" title="'+esc(region)+'" data-index="'+i+'"><span class="mg-news-mark" aria-hidden="true">'+esc(mark)+'</span><span>'+esc(name)+'</span></button>').join("");
const p=P[selected],entries=(feed&&feed[p[0]]&&Array.isArray(feed[p[0]].items))?feed[p[0]].items.slice(0,5):[];
source.href=p[1];source.textContent="Open "+p[0]+" latest news";
if(entries.length){
stories.innerHTML=entries.map(item=>'<li><a href="'+esc(item.url)+'" target="_blank" rel="noopener noreferrer">'+esc(item.title)+'</a><small>'+esc(item.published||"")+'</small></li>').join("");
status.textContent="Five latest available licensed headlines · source: "+p[0]+" · "+esc(feed.updated||"");
}else{
stories.innerHTML='<li class="mg-news-unavailable">Live headlines are not syndicated here until publisher permissions and a reliable update service are confirmed. Use the direct newsroom link for current coverage.</li>';
status.textContent="Publisher directory · no live headlines claimed";
}
root.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{selected=Number(b.dataset.index);render();}));
}
render();
fetch("assets/news-headlines.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>{if(data&&data.licensed===true&&data.providers){feed={...data.providers,updated:data.updated};render();}}).catch(()=>{});
})();