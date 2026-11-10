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
  // Breadth first: maintain all topic content and headings in their original document order.
  // Provide a compact navigation overview; expansion is opt-in only when authors
  // explicitly use native <details> for supplementary material.
  const main=document.querySelector("main");
  if(main && !main.querySelector("[data-mg-topic-overview]")) {
   const blocks=[...main.querySelectorAll("section")].filter(section=>
    !section.closest("details,form,[data-no-disclosure],.log-day") &&
    section.querySelector(":scope > .wrap > h2,:scope > h2")
   );
   const headings=blocks.map(section=>{
    const heading=section.querySelector(":scope > .wrap > h2,:scope > h2");
    if(!heading)return null;
    if(!section.id) {
     const slug=(heading.textContent||"topic").toLowerCase().normalize("NFKD")
      .replace(/[^a-z0-9 ]/g,"").trim().replace(/\s+/g,"-").slice(0,65);
     let id="topic-"+(slug||"section"),n=2;
     while(document.getElementById(id))id="topic-"+slug+"-"+n++;
     section.id=id;
    }
    return {id:section.id,title:(heading.textContent||"").trim()};
   }).filter(item=>item?.title);
   if(headings.length>=5) {
    const nav=document.createElement("nav");
    nav.className="mg-topic-overview";
    nav.dataset.mgTopicOverview="true";
    nav.setAttribute("aria-label","On this page: explore topics");
    const label=document.createElement("p");
    label.className="mg-topic-overview-label";
    label.textContent="Explore topics on this page";
    const links=document.createElement("div");
    links.className="mg-topic-overview-links";
    headings.forEach(item=>{
     const a=document.createElement("a");
     a.href="#"+encodeURIComponent(item.id);
     a.textContent=item.title;
     links.append(a);
    });
    nav.append(label,links);
    const hero=main.querySelector(":scope > .page-hero,:scope > section.page-hero");
    if(hero)hero.after(nav);else main.prepend(nav);
   }
  }
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
