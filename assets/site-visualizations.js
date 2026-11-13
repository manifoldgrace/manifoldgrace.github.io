/* Manifold Grace: accessible content-derived visual navigation, November 2026.
 * Draws navigation only from visible page headings. Does not infer facts, metrics, causation or ranking.
 */
(()=>{"use strict";
const EXCLUDE=new Set(["index.html","loading-preview.html","public-interest-map.html"]);
const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
if(EXCLUDE.has(page))return;
function ready(){
 if(document.querySelector(".mg-visual-atlas"))return;
 const main=document.querySelector("main");if(!main)return;
 const candidates=[...main.querySelectorAll("h2")].filter(h=>{
   const n=h.closest("nav,footer,aside,[hidden],.mg-visual-atlas,[aria-hidden='true']");
   const style=getComputedStyle(h);
   return !n&&style.display!=="none"&&style.visibility!=="hidden"&&h.textContent.trim().length>3;
 });
 if(candidates.length<3)return;
 const headings=candidates.slice(0,8);
 const used=new Set([...document.querySelectorAll("[id]")].map(el=>el.id));
 headings.forEach((h,i)=>{if(!h.id){let id="mg-map-section-"+(i+1),j=1;while(used.has(id))id="mg-map-section-"+(i+1)+"-"+(++j);h.id=id;used.add(id)}});
 const items=headings.map((h,i)=>({id:h.id,label:h.textContent.replace(/\s+/g," ").trim().slice(0,90),index:i+1}));
 const root=document.createElement("section");root.className="mg-visual-atlas";
 root.setAttribute("aria-label","Visual navigation for this page");
 root.innerHTML='<div class="mg-visual-atlas__header"><div><p class="mg-visual-atlas__eyebrow">Explore this page</p><h2 class="mg-visual-atlas__title">A visual guide to the sections</h2></div><div class="mg-visual-atlas__controls" role="group" aria-label="Choose visual navigation"><button type="button" data-view="map" aria-pressed="true">Topic map</button><button type="button" data-view="sequence" aria-pressed="false">Reading sequence</button></div></div><p class="mg-visual-atlas__note">A map of the headings on this page. Connections show navigation only, not causal or evidentiary relationships.</p><div class="mg-visual-atlas__stage" aria-live="off"></div><p class="mg-visual-atlas__footer">Select a topic to jump to its section. Generated from existing page headings; no statistical values are inferred.</p>';
 const stage=root.querySelector(".mg-visual-atlas__stage");
 const svgNS="http://www.w3.org/2000/svg";const newSvg=(tag,attrs={})=>{let node=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));return node};
 function wrap(s,n=20){const words=s.split(" ");let lines=[],cur="";for(const word of words){if((cur+" "+word).trim().length>n&&cur){lines.push(cur);cur=word}else cur=(cur+" "+word).trim()}if(cur)lines.push(cur);if(lines.length>2){lines=[lines[0],lines.slice(1).join(" ").slice(0,n+4)+"…"]}return lines}
 function map(){
  const W=920,H=315,cx=460,cy=154,rX=348,rY=108;
  const svg=newSvg("svg",{viewBox:"0 0 "+W+" "+H,role:"img","aria-label":"Interactive map of "+items.length+" page topics"});
  const title=newSvg("title");title.textContent="Page topics and section links";svg.appendChild(title);
  const center=newSvg("circle",{cx,cy,r:34,fill:"#101519",stroke:"#a0b5c4","stroke-width":"1.5"});svg.appendChild(center);
  const centerText=newSvg("text",{x:cx,y:cy+4,"text-anchor":"middle",fill:"#fff","font-size":"12"});centerText.textContent="Topics";svg.appendChild(centerText);
  items.forEach((it,i)=>{
   const theta=(2*Math.PI*i/items.length)-Math.PI/2,x=cx+rX*Math.cos(theta),y=cy+rY*Math.sin(theta);
   svg.appendChild(newSvg("path",{d:"M"+cx+" "+cy+"L"+x+" "+y,class:"mg-visual-atlas__edge"}));
   const node=newSvg("g",{class:"mg-visual-atlas__node",role:"link",tabindex:"0","aria-label":"Jump to "+it.label});
   node.appendChild(newSvg("circle",{cx:x,cy:y,r:22}));
   const t=newSvg("text",{x,y:y+4,"text-anchor":"middle",class:"index"});t.textContent=String(it.index).padStart(2,"0");node.appendChild(t);
   const tx=Math.max(65,Math.min(W-65,x)),below=y<cy, lines=wrap(it.label);
   lines.forEach((line,j)=>{const label=newSvg("text",{x:tx,y:y+(below?-31:38)+j*15,"text-anchor":"middle"});label.textContent=line;node.appendChild(label)});
   const go=()=>{const target=document.getElementById(it.id);if(target){target.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});history.replaceState(null,"","#"+encodeURIComponent(it.id))}};
   node.addEventListener("click",go);node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}});svg.appendChild(node);
  });
  stage.replaceChildren(svg);
 }
 function sequence(){
  const rail=document.createElement("div");rail.className="mg-visual-atlas__sequence";
  items.forEach(it=>{const a=document.createElement("a");a.className="mg-visual-atlas__step";a.href="#"+encodeURIComponent(it.id);a.innerHTML='<span class="mg-visual-atlas__step-number">'+String(it.index).padStart(2,"0")+'</span>';const label=document.createElement("span");label.className="mg-visual-atlas__step-label";label.textContent=it.label;a.appendChild(label);rail.appendChild(a)});
  stage.replaceChildren(rail);
 }
 root.querySelectorAll("button[data-view]").forEach(btn=>btn.addEventListener("click",()=>{const v=btn.dataset.view;root.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));v==="map"?map():sequence()}));
 map();
 const first=main.firstElementChild;
 if(first&&first.nextElementSibling){main.insertBefore(root,first.nextElementSibling)}
 else main.appendChild(root);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();