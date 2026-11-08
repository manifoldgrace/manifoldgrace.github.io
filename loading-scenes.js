(()=>{"use strict";
const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
const scene=page==="loading-preview.html"?(new URLSearchParams(location.search).get("scene")||"home"):page==="index.html"?"home":(/research|knowledge|learning|information|paper|study|academic|history/.test(page)?"research":(/ai|evaluation|technology|data|software|algorithm|coding/.test(page)?"ai":"home"));
if(window.__mgLoaderInitialized)return;window.__mgLoaderInitialized=true;
if(!scene||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
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
@media(prefers-reduced-motion:reduce){.mg-loader-screen{display:none!important}.mg-loader-art *{animation:none!important}}
`;
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const panel=document.createElement("div");panel.className="mg-loader-screen";panel.dataset.scene=scene;panel.setAttribute("role","presentation");panel.setAttribute("aria-hidden","true");
panel.innerHTML='<div class="mg-loader-art"><i class="core"></i><i class="core"></i><i class="core"></i><i class="core"></i></div><span class="mg-loader-text">Manifold Grace · Loading</span>';
function reveal(){if(panel.classList.contains("is-done"))return;panel.classList.add("is-done");setTimeout(()=>panel.remove(),250)}
let mounted=false,minimumElapsed=false,fullyLoaded=document.readyState==="complete";
function perhapsReveal(){if(minimumElapsed&&fullyLoaded)reveal()}
function mount(){
 if(mounted)return;
 mounted=true;
 document.body.appendChild(panel);
 if(page==="loading-preview.html")return;
 setTimeout(()=>{minimumElapsed=true;perhapsReveal()},5000);
 // Avoid trapping visitors if a third-party resource never fires its load event.
 setTimeout(reveal,12000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
if(page!=="loading-preview.html")window.addEventListener("load",()=>{fullyLoaded=true;perhapsReveal()},{once:true});
})();