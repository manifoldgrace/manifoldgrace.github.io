/* Accessible Manifold Grace content browsing — 2026-11-10 */
(() => {
 "use strict";
 function init() {
  if (document.documentElement.dataset.mgDisclosureReady) return;
  document.documentElement.dataset.mgDisclosureReady = "true";
  document.querySelectorAll("main .grid, main .cards, main .card-grid").forEach(grid => {
   if(grid.closest("[data-no-disclosure],form,.log-day") || grid.dataset.mgShelf)return;
   const nodes=[...grid.children];
   if(nodes.length<7 || nodes.some(n=>!n.matches("article,.card,.link-card,a,.grid-item,div")))return;
   grid.classList.add("mg-book-shelf");
   grid.dataset.mgShelf="true";
   grid.tabIndex=0;
   grid.setAttribute("role","region");
   grid.setAttribute("aria-label","Related cards; scroll horizontally");
   const controls=document.createElement("div");
   controls.className="mg-shelf-controls";
   const caption=document.createElement("span");
   caption.textContent="Browse "+nodes.length+" entries sideways";
   const buttons=[-1,1].map((direction)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="mg-shelf-arrow";
    b.setAttribute("aria-label",direction===1?"Next entries":"Previous entries");
    b.textContent=direction===1?"›":"‹";
    b.addEventListener("click",()=>grid.scrollBy({left:direction*Math.max(260,grid.clientWidth*.8),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}));
    return b;
   });
   controls.append(caption,...buttons);
   grid.before(controls);
   function update(){buttons[0].disabled=grid.scrollLeft<4;buttons[1].disabled=grid.scrollLeft+grid.clientWidth>=grid.scrollWidth-4;}
   grid.addEventListener("scroll",update,{passive:true});
   window.addEventListener("resize",update,{passive:true});
   requestAnimationFrame(update);
  });
  const skip="form,input,textarea,select,iframe,canvas,video,audio,[contenteditable],[role=application],.log-day,.doctoral-project-track,.ai-news-track";
  [...document.querySelectorAll("main > section,main > div > section")].forEach((section,index)=>{
   if(index===0||section.matches(".page-hero,[data-no-disclosure]")||section.querySelector(skip))return;
   const container=[...section.children].find(c=>c.classList.contains("wrap"))||section;
   const children=[...container.children].filter(n=>!n.matches("script,style"));
   const header=children.find(n=>n.matches("h2,h3"));
   if(!header||children.indexOf(header)>2||children.length<7||(container.textContent||"").length<2700)return;
   let keep=children.indexOf(header)+1;
   if(children[keep]?.matches("p")&&children[keep].textContent.length<440)keep++;
   const content=children.slice(keep);
   if(content.length<4||content.some(n=>n.matches("[data-no-disclosure]")))return;
   const details=document.createElement("details");
   details.className="mg-section-disclosure";
   const summary=document.createElement("summary");
   summary.textContent="Explore details and related information";
   const body=document.createElement("div");
   body.className="mg-section-disclosure-content";
   content.forEach(n=>body.append(n));
   details.append(summary,body);
   (children[keep-1]||header).after(details);
  });
  function reveal(){
   if(!location.hash)return;
   let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
   const target=document.getElementById(id);
   if(!target)return;
   for(let p=target.parentElement;p;p=p.parentElement)if(p.matches("details.mg-section-disclosure"))p.open=true;
  }
  reveal();window.addEventListener("hashchange",reveal);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
