(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const labels={"potential-departure":"Potential departure","justified":"Justified decision","insufficient-evidence":"Insufficient evidence","corrected":"Correction completed"};
let cases=[],active=0,answers={};const state={filter:"all"};
const escape=s=>String(s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const answerCount=()=>Object.keys(answers).length;
function eligible(){return cases.map((c,i)=>({c,i})).filter(({c})=>state.filter==="all"||c.expected===state.filter||c.sector===state.filter);}
function render(){
 const list=eligible();if(!list.length){$("#case-stage").innerHTML="<p>No cases in this category.</p>";return;}
 if(!list.some(x=>x.i===active))active=list[0].i;
 const c=cases[active],done=answers[c.id],total=cases.length,correct=Object.entries(answers).filter(([id,a])=>cases.find(x=>x.id===id)?.expected===a).length;
 $("#case-current").textContent=String(active+1).padStart(2,"0");
 $("#case-total").textContent=String(total).padStart(2,"0");
 $("#answered").textContent=answerCount()+" / "+total;
 $("#correct").textContent=String(correct);
 $("#percent").textContent=answerCount()?Math.round(100*correct/answerCount())+"%":"—";
 $("#progress-fill").style.width=(answerCount()/total*100)+"%"; $(".pj-progress-track").setAttribute("aria-valuenow",String(answerCount()));
 $("#case-index").innerHTML=list.map(({c:x,i})=>'<button type="button" class="case-index-item '+(i===active?"is-active ":"")+(answers[x.id]?"is-done":"")+'" data-index="'+i+'" aria-label="Open case '+escape(x.id)+'" '+(i===active?'aria-current="step"':"")+'><span class="index-dot"></span><span>'+escape(x.id.slice(-3))+'</span></button>').join("");
 $("#case-index").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{active=+b.dataset.index;render();}));
 const pick=done||null;
 $("#case-stage").innerHTML=`
 <div class="case-topline"><span class="issue-label">${escape(c.sector)}</span><span class="case-id">${escape(c.id)} / SYNTHETIC</span></div>
 <h2 class="case-title">${escape(c.title)}</h2>
 <p class="case-deck">Follow the sequence. Decide whether the documented facts justify a procedural concern, a legitimate outcome, an incomplete assessment or a completed correction.</p>
 <ol class="event-stream">${c.events.map((event,i)=>'<li><span class="event-num">0'+(i+1)+'</span><span>'+escape(event)+'</span></li>').join("")}</ol>
 <div class="decision-prompt"><span class="section-index">01 / CLASSIFICATION</span><h3>What does this record support?</h3>
 <div class="outcome-grid" role="group" aria-label="Select your assessment">${Object.keys(labels).map(key=>'<button type="button" data-label="'+key+'" class="outcome-option '+(pick===key?"selected":"")+'" '+(done?"disabled":"")+' aria-pressed="'+(pick===key)+'"><span class="option-mark"></span>'+escape(labels[key])+'</button>').join("")}</div>
 </div>
 <div id="case-feedback" aria-live="polite">${done?feedback(c,done):'<p class="hint">Choose a classification to reveal the reference rationale. Your answers are stored only for this page session.</p>'}</div>
 <div class="case-actions"><button type="button" class="action-link" id="case-prev">← Previous</button><button type="button" class="action-next" id="case-next">Next case <span aria-hidden="true">↗</span></button></div>`;
 $$("#case-stage .outcome-option").forEach(b=>b.addEventListener("click",()=>{if(answers[c.id])return;answers[c.id]=b.dataset.label;render();}));
 $("#case-prev").disabled=active===0;
 $("#case-prev").addEventListener("click",()=>{active=Math.max(0,active-1);render();});
 $("#case-next").addEventListener("click",()=>{active=(active+1)%total;render();});
}
function feedback(c,a){const ok=a===c.expected;return '<div class="feedback '+(ok?"yes":"no")+'"><span class="feedback-eyebrow">'+(ok?"REFERENCE MATCH":"REVIEW DIFFERENCE")+'</span><strong>Reference: '+escape(labels[c.expected])+'</strong><p>'+escape(c.rationale)+'</p><div class="feedback-grid"><div><span>Decision pivot</span><p>'+escape(c.pivot)+'</p></div><div><span>Counter-consideration</span><p>'+escape(c.counterpoint)+'</p></div></div><small>Author-labelled synthetic scenario; expert validation pending.</small></div>';}
function bind(){
 $("#filter").addEventListener("change",e=>{state.filter=e.target.value;render();});
 $("#reset-benchmark").addEventListener("click",()=>{if(!confirm("Reset your 20-case session responses?"))return;answers={};active=0;state.filter="all";$("#filter").value="all";render();});
 $("#download-dataset").addEventListener("click",()=>{window.location.href="data/pjil-synthetic-cases-v01.json";});
 $("#download-results").addEventListener("click",()=>{const payload={schema_version:"1.0",source:"Synthetic Procedural Justice Benchmark",answered:answerCount(),correct:Object.entries(answers).filter(([id,a])=>cases.find(x=>x.id===id)?.expected===a).length,responses:Object.entries(answers).map(([id,label])=>({id,predicted:label,reference:cases.find(c=>c.id===id)?.expected}))};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const href=URL.createObjectURL(blob);const a=document.createElement("a");a.href=href;a.download="pjil-session-results.json";a.click();setTimeout(()=>URL.revokeObjectURL(href),1500);});
}
fetch("data/pjil-synthetic-cases-v01.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json();}).then(data=>{if(!Array.isArray(data.cases)||data.cases.length!==20)throw Error("unexpected case count");cases=data.cases;bind();render();$("#app-status").hidden=true;$("#benchmark-ui").hidden=false;}).catch(()=>{$("#app-status").textContent="The dataset could not be loaded. Open the JSON source directly or try again after deployment.";$("#fallback-data").hidden=false;});
})();