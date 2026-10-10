(() => {
"use strict";
const questions=[["Algebra","Solve 3x + 5 = 20.","5","Subtract 5, then divide by 3."],["Functions","For f(x)=x²−1, find f(3).","8","3²−1=8."],["Trigonometry","What is sin(30°)?","0.5","The exact value is 1/2."],["Differentiation","For y=x³, find dy/dx at x=2.","12","dy/dx=3x²; 3×4=12."],["Integration","Find the integral of 2x from 0 to 3.","9","Antiderivative x²; 9−0=9."],["Probability","A fair die is rolled. Probability of an even number?","0.5","Three outcomes out of six."],["Statistics","Find the mean of 2, 4, 6, 8.","5","Sum 20 divided by 4."],["Mechanics","Speed is 4 m/s for 6 s. Distance in metres?","24","For constant speed, distance=speed×time."],["Linear algebra","The determinant of [[2,1],[3,4]]?","5","ad−bc=8−3=5."],["Limits","Limit of (x²−1)/(x−1) as x approaches 1?","2","Cancel x−1 away from 1, leaving x+1."],["Calculus bridge","Derivative of ln(x) at x=2?","0.5","The derivative is 1/x."],["Complex numbers","What is i²?","-1","i is defined by i²=−1."],["Differential equations","For dy/dx=2x and y(0)=3, find y(2).","7","y=x²+C; C=3."],["Numerical methods","One Newton step for x²−2=0, starting at x=1?","1.5","x₁=x₀−f(x₀)/f′(x₀)=1−(−1)/2."],["Discrete maths","How many subsets does a set of three elements have?","8","A set with n elements has 2ⁿ subsets."],["Probability bridge","Two independent fair coin flips: probability both heads?","0.25","1/2×1/2=1/4."]];
const $=id=>document.getElementById(id);
let writable=true;
function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:fallback;}catch{return fallback;}}
let sessions=read("mg-learning-sessions-v1",[]).filter(x=>x&&typeof x.task==="string"&&typeof x.seconds==="number").slice(-500);
let goals=read("mg-learning-cpd-v1",["Azure certification","AWS certification","Cybersecurity certification","R programming course certificate","Refresher certificates"].map(title=>({title,status:"Planned"}))).filter(x=>x&&typeof x.title==="string");
function save(key,data){try{localStorage.setItem(key,JSON.stringify(data));}catch{writable=false;}}
function cell(row,value){const td=document.createElement("td");td.textContent=value;row.append(td);}
function render(){
 const body=$("practice-history");body.replaceChildren();
 sessions.slice(-30).reverse().forEach(x=>{const tr=document.createElement("tr");cell(tr,new Date(x.date).toLocaleString());cell(tr,x.task);cell(tr,x.correct?"Yes":"No");cell(tr,x.seconds.toFixed(1));body.append(tr);});
 const correct=sessions.filter(x=>x.correct).length;
 $("practice-summary").textContent=sessions.length? sessions.length+" attempts · "+Math.round(100*correct/sessions.length)+"% correct":"No recorded attempts yet.";
 const plot=$("progress-plot");plot.replaceChildren();
 sessions.slice(-20).forEach((x,i)=>{const bar=document.createElement("span");bar.style.height=x.correct?"100%":"8%";bar.title=x.task+": "+(x.correct?"correct":"incorrect")+", "+x.seconds.toFixed(1)+" seconds";const label=document.createElement("small");label.textContent=i+1;bar.append(label);plot.append(bar);});
 plot.setAttribute("aria-label",sessions.length?"Recent attempts, each scored correct or incorrect; different tasks are not directly comparable.":"No recorded practice data.");
}
let attempt=null;
function openAttempt(prompt,expected,task,explanation,memory=false){
 attempt={expected,task,explanation,memory,started:performance.now()};
 $("practice-area").hidden=false;$("practice-prompt").textContent=prompt;$("practice-status").textContent="";
 $("practice-form").hidden=memory;$("memory-hide").hidden=!memory;$("practice-answer").value="";
 if(!memory)$("practice-answer").focus();
}
document.querySelectorAll("[data-practice]").forEach(button=>button.addEventListener("click",()=>{
 const q=questions[Number(button.dataset.practice)];
 $("learning-practice").open=true;openAttempt(q[1],q[2],q[0],q[3]);$("practice-area").scrollIntoView({block:"center",behavior:"auto"});
}));
$("memory-start").addEventListener("click",()=>{
 const seq=Array.from({length:5},()=>Math.floor(Math.random()*9)+1).join(" ");
 openAttempt("Study this sequence: "+seq,seq,"Five-number recall","The sequence was "+seq+".",true);
});
$("memory-hide").addEventListener("click",()=>{
 if(!attempt)return;attempt.started=performance.now();$("practice-prompt").textContent="Enter the five numbers in order, separated by spaces.";
 $("memory-hide").hidden=true;$("practice-form").hidden=false;$("practice-answer").focus();
});
function numeric(value){const t=value.trim();if(/^-?\d+(\.\d+)?\s*\/\s*-?\d+(\.\d+)?$/.test(t)){const [a,b]=t.split("/").map(Number);return b? a/b:NaN;}return /^-?\d+(\.\d+)?$/.test(t)?Number(t):NaN;}
$("practice-form").addEventListener("submit",event=>{
 event.preventDefault();if(!attempt)return;const current=attempt;attempt=null;
 const answer=$("practice-answer").value.trim();
 const correct=current.memory?answer.replace(/[,\s]+/g," ").trim()===current.expected:Math.abs(numeric(answer)-Number(current.expected))<1e-9;
 const seconds=(performance.now()-current.started)/1000;
 sessions.push({date:new Date().toISOString(),task:current.task,correct,seconds});sessions=sessions.slice(-500);save("mg-learning-sessions-v1",sessions);render();
 $("practice-status").textContent=(correct?"Correct. ":"Try again after reviewing. ")+current.explanation+" Time: "+seconds.toFixed(1)+" seconds."+(writable?"":" Browser storage is unavailable; export before leaving.");
 $("practice-form").hidden=true;
});
$("practice-cancel").addEventListener("click",()=>{attempt=null;$("practice-area").hidden=true;});
function exportCSV(rows,name){const quote=value=>'"'+String(value).replace(/^[=+@-]/,"'"+String(value).charAt(0)).replaceAll('"','""')+'"';const data=rows.map(row=>row.map(quote).join(",")).join("\r\n");const url=URL.createObjectURL(new Blob(["\ufeff"+data],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$("export-sessions").addEventListener("click",()=>exportCSV([["Session","Task","Correct","Seconds"],...sessions.map(x=>[x.date,x.task,x.correct,x.seconds.toFixed(1)])],"learning-practice.csv"));
function renderGoals(){
 const list=$("cpd-list");list.replaceChildren();
 goals.forEach((goal,i)=>{const row=document.createElement("div");row.className="cpd-row";const title=document.createElement("strong");title.textContent=goal.title;row.append(title);const select=document.createElement("select");select.setAttribute("aria-label","Status for "+goal.title);
 ["Planned","Exploring","Studying","Assessment booked","Completed"].forEach(status=>{const option=document.createElement("option");option.value=status;option.textContent=status;option.selected=status===goal.status;select.append(option);});
 select.addEventListener("change",()=>{goal.status=select.value;save("mg-learning-cpd-v1",goals);});row.append(select);
 const remove=document.createElement("button");remove.type="button";remove.textContent="Remove";remove.setAttribute("aria-label","Remove "+goal.title);remove.addEventListener("click",()=>{goals.splice(i,1);save("mg-learning-cpd-v1",goals);renderGoals();});row.append(remove);list.append(row);});
}
$("cpd-add").addEventListener("submit",event=>{event.preventDefault();const title=$("cpd-title").value.trim();if(!title)return;goals.push({title,status:"Planned"});save("mg-learning-cpd-v1",goals);$("cpd-title").value="";renderGoals();});
$("cpd-export").addEventListener("click",()=>exportCSV([["Learning goal","Status"],...goals.map(x=>[x.title,x.status])],"cpd-learning-plan.csv"));
render();renderGoals();
})();
(() => {
"use strict";
const modes=[["Memory palace","Place one item at each familiar location; walk the route mentally.","Strong mnemonic evidence for trained tasks; generalisation varies.","Front door → hallway → kitchen → garden","loci"],["Spaced repetition","Retrieve, check feedback, then return after an increasing interval.","Strong evidence for distributed practice.","Revisit after one day, three days, then seven days.","space"],["Active recall","Hide the source and retrieve before checking the answer.","Strong evidence, especially with corrective feedback.","Answer before revealing your study list.","recall"],["Chunking","Group related items into meaningful units that suit your capacity.","Grouping helps encoding; no universal five-to-seven-item rule.","Build two or three meaningful groups.","chunk"],["Acronyms & acrostics","Use initial letters to create a memorable cue.","Useful for particular lists; check full meanings too.","Write an acronym or a sentence using initials.","acronym"],["Explain simply","Explain the idea to a beginner, then identify missing steps.","Related to self-explanation; the named Feynman routine is not independently guaranteed.","Write a plain-language explanation.","teach"],["Mind mapping","Connect a central idea to labelled branches and relationships.","An organisation tool; add retrieval rather than copying alone.","Write branches as Parent → Child → Example.","map"],["Link & story","Connect items in a vivid story, keeping their order clear.","A mnemonic aid whose benefit depends on task and use.","Write a short story including every item.","story"],["Multi-sensory engagement","Combine a relevant image, spoken phrase or movement with meaning.","Benefits depend on the task; this is not learning-style matching.","Optional: read aloud or sketch; avoid sensory overload.","sense"],["Blank-page recall","Reconstruct keywords on blank paper, then check and correct.","A format of retrieval practice, rather than a distinct validated treatment.","Write remembered keywords before revealing the source.","blank"]];
const $=id=>document.getElementById(id);
let mode=0, started=0, items=[], ready=false;
let records=[];try{records=JSON.parse(localStorage.getItem("mg-memory-studio-v1")||"[]");if(!Array.isArray(records))records=[];}catch{}
records=records.filter(x=>x&&typeof x.mode==="string"&&Number.isFinite(x.total)&&Number.isFinite(x.correct)).slice(-300);
function history(){
 const node=$("studio-history");node.replaceChildren();
 records.slice(-15).reverse().forEach(r=>{const p=document.createElement("p");p.textContent=r.mode+" · "+r.correct+"/"+r.total+" · "+r.seconds.toFixed(1)+" s · "+(r.effort||"effort not rated")+" · review "+(Date.now()>=r.due?"due now":new Date(r.due).toLocaleDateString());node.append(p);});
}
function choose(n){mode=n;$("studio-title").textContent=modes[n][0];$("studio-instruction").textContent=modes[n][3];}
document.querySelectorAll("[data-memory-mode]").forEach(b=>b.addEventListener("click",()=>{choose(Number(b.dataset.memoryMode));$("memory-studio").open=true;$("studio-title").scrollIntoView({block:"center"});}));
$("studio-start").addEventListener("click",()=>{
 items=$("studio-source").value.split("\n").map(x=>x.trim()).filter(Boolean);
 if(!items.length){$("studio-status").textContent="Add at least one study item.";return;}
 ready=false;$("studio-source").hidden=false;$("studio-cue").hidden=false;$("studio-hide").hidden=false;$("studio-recall-label").hidden=true;$("studio-check").hidden=true;$("studio-score").hidden=true;$("studio-feedback").replaceChildren();$("studio-status").textContent="Study your items and prepare your cue. Hide when ready.";
});
$("studio-hide").addEventListener("click",()=>{
 $("studio-source").hidden=true;$("studio-cue").hidden=true;$("studio-hide").hidden=true;$("studio-recall-label").hidden=false;$("studio-recall").value="";$("studio-check").hidden=false;started=performance.now();$("studio-recall").focus();
});
$("studio-check").addEventListener("click",()=>{
 const elapsed=(performance.now()-started)/1000;
 $("studio-feedback").textContent="Source: "+items.join(" · ");
 $("studio-source").hidden=false;$("studio-cue").hidden=false;$("studio-score").hidden=false;$("studio-correct").max=items.length;$("studio-check").hidden=true;ready=elapsed;
});
$("studio-save").addEventListener("click",()=>{
 if(ready===false)return;const correct=Number($("studio-correct").value);
 if(!Number.isInteger(correct)||correct<0||correct>items.length){$("studio-status").textContent="Enter a whole number from 0 to "+items.length+".";return;}
 const previous=records.filter(x=>x.mode===modes[mode][0]&&x.signature===items.join("\n")).length;
 const days=[1,3,7][Math.min(previous,2)];
 records.push({mode:modes[mode][0],signature:items.join("\n"),total:items.length,correct,seconds:ready,effort:$("studio-effort").value,date:new Date().toISOString(),due:Date.now()+days*86400000});
 records=records.slice(-300);ready=false;
 try{localStorage.setItem("mg-memory-studio-v1",JSON.stringify(records));$("studio-status").textContent="Recorded "+correct+"/"+items.length+". Next review in "+days+" day(s).";}catch{$("studio-status").textContent="Recorded for this visit. Storage unavailable: export before leaving.";}
 $("studio-score").hidden=true;history();
});
$("studio-export").addEventListener("click",()=>{
 const rows=[["Technique","Items","Correct","Seconds","Effort","Attempt","Review due"],...records.map(r=>[r.mode,r.total,r.correct,r.seconds.toFixed(1),r.effort,r.date,new Date(r.due).toISOString()])];
 const data=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([data],{type:"text/csv"}));const a=document.createElement("a");a.href=url;a.download="memory-studio.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
choose(0);history();
document.querySelectorAll(".gallery").forEach(gallery=>{
 const figures=Array.from(gallery.querySelectorAll("figure"));if(figures.length<2)return;
 gallery.classList.add("carousel");let index=0,timer=null;
 const controls=document.createElement("div");controls.className="carousel-controls";
 const status=document.createElement("span");status.setAttribute("aria-live","polite");
 function show(n){index=(n+figures.length)%figures.length;figures.forEach((f,i)=>f.hidden=i!==index);status.textContent=(index+1)+" / "+figures.length;}
 function button(label,action){const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",action);controls.append(b);return b;}
 const pause=button("Play · 8 seconds",()=>{if(timer){clearInterval(timer);timer=null;pause.textContent="Play · 8 seconds";}else{timer=setInterval(()=>show(index+1),8000);pause.textContent="Pause";}});
 button("Previous",()=>show(index-1));button("Next",()=>show(index+1));controls.append(status);gallery.before(controls);show(0);
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(!reduce&&gallery.closest(".lab-illustrations, #research-context, #brain-methods"))pause.click();
 gallery.addEventListener("focusin",()=>{if(timer){clearInterval(timer);timer=null;pause.textContent="Play · 8 seconds";}});
});
})();
