(()=>{"use strict";
const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
const scene=page==="loading-preview.html"?(new URLSearchParams(location.search).get("scene")||"home"):page==="index.html"?"home":(/research|knowledge|learning|information|paper|study|academic|history/.test(page)?"research":(/ai|evaluation|technology|data|software|algorithm|coding/.test(page)?"ai":"home"));
if(window.__mgLoaderInitialized)return;window.__mgLoaderInitialized=true;
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!scene||reduceMotion)return;
const css=`
.mg-loader-screen{position:fixed;inset:0;z-index:2147483646;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;pointer-events:auto;opacity:1;transition:opacity .22s ease}
.mg-loader-screen[hidden]{display:none!important}.mg-loader-screen.is-done{opacity:0}
.mg-loader-art{width:min(52vw,240px);aspect-ratio:1;position:relative;overflow:hidden;perspective:700px;mask-image:radial-gradient(circle,#000 63%,transparent 89%)}
.mg-loader-art .core{position:absolute;inset:10%;border:1px solid #eee;box-shadow:0 0 14px #fff7,inset 0 0 14px #fff4;animation:mg-loader-tunnel 1.25s linear infinite}
.mg-loader-art .core:nth-child(2){inset:21%;animation-delay:-.31s}.mg-loader-art .core:nth-child(3){inset:32%;animation-delay:-.62s}.mg-loader-art .core:nth-child(4){inset:43%;animation-delay:-.93s}
.mg-loader-art::before,.mg-loader-art::after{content:"";position:absolute;inset:-50%;background:repeating-linear-gradient(0deg,transparent 0 18px,#eeeeee9e 19px,transparent 20px 39px),repeating-linear-gradient(90deg,transparent 0 18px,#eeeeee9e 19px,transparent 20px 39px);transform:perspective(500px) rotateX(50deg) scale(1.5);opacity:.36;animation:mg-loader-grid 1.7s linear infinite}
.mg-loader-art::after{transform:rotate(90deg);opacity:.2;animation-direction:reverse}
.mg-loader-screen[data-scene="research"] .core{border-radius:0;transform:rotate(45deg)}.mg-loader-screen[data-scene="ai"] .core{border-radius:50%;border-style:dotted;animation-duration:1s}
.mg-loader-screen[data-scene="ai"] .mg-loader-art::before{transform:rotate(30deg);opacity:.55}
.mg-loader-text{font:500 .65rem/1.5 ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase;color:#ccc}
@keyframes mg-loader-tunnel{from{transform:scale(.45);opacity:.2}55%{opacity:.95}to{transform:scale(1.9);opacity:0}}
@keyframes mg-loader-grid{from{background-position:0 0,0 0}to{background-position:0 40px,40px 0}}

/* Eight recognisably different monochrome scenes; no adjacent repeats. */
.mg-loader-screen[data-pattern="0"] .core{border-radius:2px}
.mg-loader-screen[data-pattern="1"] .mg-loader-art{transform:rotate(45deg)}
.mg-loader-screen[data-pattern="1"] .core{border-radius:0;animation-name:mg-loader-diamond;animation-duration:2s}
.mg-loader-screen[data-pattern="1"] .mg-loader-art::before{transform:rotate(45deg)}
.mg-loader-screen[data-pattern="2"] .core{border-radius:50%;border-style:dashed;animation-name:mg-loader-orbit;animation-duration:2.4s}
.mg-loader-screen[data-pattern="2"] .mg-loader-art::before,.mg-loader-screen[data-pattern="2"] .mg-loader-art::after{border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 22px,#ffffff66 23px 24px,transparent 25px 38px);animation:mg-loader-spin 6s linear infinite}
.mg-loader-screen[data-pattern="3"] .core{border-radius:50%;border-style:dotted;animation-name:mg-loader-pulse;animation-duration:1.4s}
.mg-loader-screen[data-pattern="3"] .mg-loader-art::before,.mg-loader-screen[data-pattern="3"] .mg-loader-art::after{background:radial-gradient(circle,#fff 1.2px,transparent 2.8px);background-size:17px 17px;animation:mg-loader-drift 3s linear infinite}
.mg-loader-screen[data-pattern="4"] .core{border-radius:0;border-style:double;border-width:4px;animation-name:mg-loader-turn;animation-duration:2.8s}
.mg-loader-screen[data-pattern="4"] .mg-loader-art::before,.mg-loader-screen[data-pattern="4"] .mg-loader-art::after{background:repeating-linear-gradient(135deg,transparent 0 16px,#ffffff70 17px,transparent 19px 36px);animation:mg-loader-drift 2s linear infinite}
.mg-loader-screen[data-pattern="5"] .core{border-radius:50%;animation-name:mg-loader-wave;animation-duration:2s}
.mg-loader-screen[data-pattern="5"] .mg-loader-art::before,.mg-loader-screen[data-pattern="5"] .mg-loader-art::after{background:repeating-conic-gradient(from 0deg,#ffffff44 0deg 2deg,transparent 3deg 30deg);border-radius:50%;animation:mg-loader-spin 8s linear infinite}
.mg-loader-screen[data-pattern="6"] .core{border-radius:5px;transform:skew(20deg);animation-name:mg-loader-bars;animation-duration:2s}
.mg-loader-screen[data-pattern="6"] .mg-loader-art::before,.mg-loader-screen[data-pattern="6"] .mg-loader-art::after{background:repeating-linear-gradient(90deg,#ffffff99 0 2px,transparent 2px 13px);animation:mg-loader-drift 1.7s linear infinite}
.mg-loader-screen[data-pattern="7"] .core{clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);border-radius:0;animation-name:mg-loader-hex;animation-duration:2.2s}
.mg-loader-screen[data-pattern="7"] .mg-loader-art::before,.mg-loader-screen[data-pattern="7"] .mg-loader-art::after{background:repeating-radial-gradient(circle at center,#ffffff88 0 1px,transparent 2px 19px);animation:mg-loader-spin 5s linear infinite}
@keyframes mg-loader-diamond{0%{transform:scale(.25) rotate(0);opacity:0}50%{opacity:1}100%{transform:scale(1.8) rotate(90deg);opacity:0}}
@keyframes mg-loader-orbit{0%{transform:rotate(0deg) scale(.7);opacity:.3}50%{opacity:1}100%{transform:rotate(360deg) scale(1.4);opacity:0}}
@keyframes mg-loader-pulse{0%{transform:scale(.3);opacity:0}45%{opacity:1}100%{transform:scale(1.8);opacity:0}}
@keyframes mg-loader-turn{0%{transform:rotate(0) scale(.7);opacity:.1}50%{opacity:1}100%{transform:rotate(180deg) scale(1.5);opacity:0}}
@keyframes mg-loader-wave{0%{transform:scale(.4) rotate(0);opacity:0}50%{opacity:1}100%{transform:scale(1.6) rotate(-120deg);opacity:0}}
@keyframes mg-loader-bars{0%{transform:skew(20deg) translateX(-25%) scale(.5);opacity:0}50%{opacity:1}100%{transform:skew(-20deg) translateX(25%) scale(1.5);opacity:0}}
@keyframes mg-loader-hex{0%{transform:rotate(0) scale(.4);opacity:0}50%{opacity:1}100%{transform:rotate(120deg) scale(1.7);opacity:0}}
@keyframes mg-loader-spin{to{transform:rotate(360deg)}}
@keyframes mg-loader-drift{to{background-position:90px 120px}}

@media(prefers-reduced-motion:reduce){.mg-loader-screen{display:none!important}.mg-loader-art *{animation:none!important}}
`;
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const panel=document.createElement("div");panel.className="mg-loader-screen";panel.dataset.scene=scene;panel.setAttribute("role","presentation");panel.setAttribute("aria-hidden","true");
panel.innerHTML='<div class="mg-loader-art"><i class="core"></i><i class="core"></i><i class="core"></i><i class="core"></i></div><span class="mg-loader-text">Manifold Grace · Loading</span>';
function reveal(){if(panel.classList.contains("is-done"))return;panel.classList.add("is-done");setTimeout(()=>{if(!navigating)panel.remove()},250)}
const sceneFor=(pathname)=>{const p=(pathname.split("/").pop()||"index.html").toLowerCase();return p==="index.html"?"home":(/research|knowledge|learning|information|paper|study|academic|history/.test(p)?"research":(/ai|evaluation|technology|data|software|algorithm|coding/.test(p)?"ai":"home"))};
let navigating=false;
const PATTERN_COUNT=8;
const selectPattern=()=>{
 let previous=-1;try{previous=Number(sessionStorage.getItem("mg-last-loader-pattern")??"-1")}catch{}
 const next=(previous+1)%PATTERN_COUNT;
 try{sessionStorage.setItem("mg-last-loader-pattern",String(next))}catch{}
 panel.dataset.pattern=String(next);
 return next;
};
let handoffPattern=null;
try{const raw=sessionStorage.getItem("mg-loader-pattern-handoff");if(raw!==null){handoffPattern=Number(raw);sessionStorage.removeItem("mg-loader-pattern-handoff")}}catch{}
if(Number.isInteger(handoffPattern)&&handoffPattern>=0&&handoffPattern<PATTERN_COUNT){panel.dataset.pattern=String(handoffPattern)}
else{selectPattern()}
let handoff=false;
try{const t=Number(sessionStorage.getItem("mg-loader-handoff")||0);handoff=Date.now()-t<15000&&Date.now()-t>=0;sessionStorage.removeItem("mg-loader-handoff")}catch{}
function beginNavigation(event){
 if(navigating||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest?.("a[href]");
 if(!link||link.hasAttribute("download")||(link.target&&link.target!=="_self"))return;
 let target;try{target=new URL(link.href,location.href)}catch{return}
 if(target.origin!==location.origin||!/^https?:$/.test(target.protocol))return;
 if(target.pathname===location.pathname&&target.search===location.search&&target.hash)return;
 if(!(target.pathname.endsWith("/")||target.pathname.toLowerCase().endsWith(".html")||target.pathname.toLowerCase().endsWith(".htm")))return;
 event.preventDefault();navigating=true;
 panel.dataset.scene=sceneFor(target.pathname);panel.classList.remove("is-done");
 const pattern=selectPattern();
 if(!panel.isConnected)document.body.appendChild(panel);
 panel.setAttribute("aria-hidden","true");
 window.setTimeout(()=>{try{sessionStorage.setItem("mg-loader-handoff",String(Date.now()));sessionStorage.setItem("mg-loader-pattern-handoff",String(pattern))}catch{}location.assign(target.href)},5000);
}
document.addEventListener("click",beginNavigation,true);
window.addEventListener("pageshow",(e)=>{if(e.persisted){navigating=false;panel.remove()}});

let mounted=false,minimumElapsed=false,fullyLoaded=document.readyState==="complete";
function perhapsReveal(){if(minimumElapsed&&fullyLoaded)reveal()}
function mount(){
 if(mounted)return;
 mounted=true;
 document.body.appendChild(panel);
 if(page==="loading-preview.html")return;
 setTimeout(()=>{minimumElapsed=true;perhapsReveal()},handoff?0:5000);
 // Avoid trapping visitors if a third-party resource never fires its load event.
 setTimeout(reveal,12000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
if(page!=="loading-preview.html")window.addEventListener("load",()=>{fullyLoaded=true;perhapsReveal()},{once:true});
})();