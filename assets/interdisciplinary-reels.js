/* Research field and shared-foundation reels. Isolated from the Earth iframe. */
(() => {
"use strict";
const D = [
["artificial-intelligence","Artificial Intelligence","◎","Computational intelligence, learning and reasoning","ai-research-lab.html"],
["mathematics","Mathematics & Statistics","∑","Formal patterns, proof and quantitative inference","research.html"],
["physics","Physics & Quantum Science","⚛","Matter, energy, fields and physical laws","research.html"],
["chemistry","Chemistry","⌬","Molecular structure, reactions and materials","research.html"],
["biology","Biology & Genetics","♧","Living systems and inheritance","research.html"],
["astronomy","Astronomy & Cosmology","☼","Celestial phenomena and the universe","research.html"],
["earth-sciences","Earth & Environmental Science","◌","Planetary systems, climate and geoscience","research.html"],
["electronics","Electronics & Hardware","▣","Circuits, devices and electronic systems","research.html"],
["computer-science","Computer Science","⌘","Algorithms, computation and software systems","ai-research-lab.html"],
["mechanical-engineering","Mechanical & Systems Engineering","⚙","Physical mechanisms and integrated systems","research.html"],
["nanotechnology","Materials & Nanotechnology","◇","Properties and engineering of matter at small scales","research.html"],
["robotics","Robotics & Cybernetics","⌥","Control, feedback, machines and autonomy","research.html"],
["civil-aerospace","Civil & Aerospace Engineering","△","Infrastructure, structures and flight systems","research.html"],
["biomedical","Biomedical Science","✚","Biological processes and health research","research.html"],
["neuroscience","Neuroscience","◉","Nervous systems and neural processes","research.html"],
["medicine","Medicine & Clinical Research","✦","Clinical evidence and care interventions","research.html"],
["public-health","Public Health & Epidemiology","⊕","Population health and distribution of disease","research.html"],
["agriculture","Agricultural Science","❧","Crop, soil and agricultural systems","research.html"],
["veterinary","Veterinary Science","♧","Animal health and biological research","research.html"],
["ecology","Ecology & Conservation","❈","Ecosystems, species and biodiversity","research.html"],
["food-science","Food Science & Biotechnology","⌬","Food systems and biological technologies","research.html"],
["psychology","Psychology & Cognitive Science","◈","Mind, behaviour and cognitive processes","research.html"],
["sociology","Sociology & Anthropology","◯","Societies, cultures and institutions","research.html"],
["economics","Economics & Finance","∿","Resources, markets and economic decisions","research.html"],
["political-science","Political Science & Public Administration","⚖","Governance, institutions and public decisions","government-arms.html"],
["education","Education & Learning Sciences","▤","Teaching, learning and assessment","research.html"],
["philosophy","Philosophy & Ethics","φ","Knowledge, values and reasoned argument","research.html"],
["logic","Formal Logic & Epistemology","⊢","Validity, inference and the justification of knowledge","research.html"],
["history","History & Archaeology","⌛","Evidence about human pasts and material culture","heritage.html"],
["linguistics","Linguistics & Information Studies","λ","Language, meaning and information organisation","research.html"],
["arts","Arts & Cultural Research","✧","Creative practices, cultural expression and analysis","research.html"],
["social-computing","Human–Computer Interaction","⌨","People, interfaces and sociotechnical systems","interdisciplinary-research-atlas.html"]
];
const F = [
["observation","Observation","◎","Identify and describe phenomena"],
["questioning","Questioning","?","Formulate problems and researchable inquiries"],
["reasoning","Logic & Reasoning","⊢","Evaluate arguments, inference and contradictions"],
["evidence","Evidence","▤","Ground claims in relevant evidence"],
["measurement","Measurement","⌁","Characterise quantities and properties"],
["mathematics","Mathematics","∑","Express formal and quantitative relations"],
["modelling","Modelling","◇","Represent processes and systems"],
["experimentation","Experimentation & Testing","⚗","Test hypotheses and explanations"],
["causality","Causality","⇢","Examine causal relations and mechanisms"],
["systems","Systems Thinking","⌘","Understand interactions and feedback"],
["verification","Verification & Reproducibility","✓","Check findings and methods"],
["uncertainty","Uncertainty","≈","State limits, assumptions and confidence"],
["criticism","Criticism & Falsification","≠","Probe weaknesses and alternative explanations"],
["synthesis","Synthesis","⨁","Integrate results and perspectives"],
["discovery","Creativity & Discovery","✧","Generate original questions and approaches"],
["ethics","Ethics & Accountability","⚖","Consider impacts and responsibilities"]
];
const safe = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const linkFor = (item, type) => "scientific-interdisciplinary.html?type="+type+"&topic="+encodeURIComponent(item[0]);
function card(item, type){return '<a class="mg-atlas-tile" href="'+linkFor(item,type)+'" aria-label="Explore '+safe(item[1])+'"><span class="mg-atlas-icon" aria-hidden="true">'+safe(item[2])+'</span><span class="mg-atlas-label">'+safe(item[1])+'</span></a>';}
document.querySelectorAll("[data-atlas-reel]").forEach(el=>{
const type=el.getAttribute("data-atlas-reel");const items=type==="foundation"?F:D;
const group=items.map(i=>card(i,type)).join("");
el.innerHTML='<div class="mg-atlas-motion"><div class="mg-atlas-group">'+group+'</div><div class="mg-atlas-group" aria-hidden="true">'+group+'</div></div>';
el.querySelectorAll('[aria-hidden="true"] a').forEach(a=>a.setAttribute("tabindex","-1"));
let touched=false;el.addEventListener("touchstart",()=>{touched=true;el.classList.add("mg-atlas-paused")},{passive:true});
el.addEventListener("touchend",()=>{if(touched)el.classList.remove("mg-atlas-paused")},{passive:true});
});
const detail=document.getElementById("mg-science-detail");
if(detail){
const p=new URLSearchParams(location.search),type=p.get("type")==="foundation"?"foundation":"discipline",list=type==="foundation"?F:D,found=list.find(x=>x[0]===p.get("topic"));
if(found){
document.title=found[1]+" — Interdisciplinary Research | Manifold Grace";
const related = type==="foundation"?"research-questions-gaps-solutions.html":found[4];
detail.innerHTML='<div class="mg-science-detail-icon" aria-hidden="true">'+safe(found[2])+'</div><p class="mg-science-kicker">'+(type==="foundation"?"SHARED INTELLECTUAL FOUNDATION":"INTERDISCIPLINARY RESEARCH FIELD")+'</p><h1>'+safe(found[1])+'</h1><p class="mg-science-summary">'+safe(found[3])+'.</p><p class="mg-science-note">Explore how artificial intelligence may interact with this area. This is a research-navigation topic, not a claim of an active laboratory or completed project.</p><p class="mg-science-links"><a href="'+safe(related)+'">Related research</a><a href="interdisciplinary-research-atlas.html">Research atlas</a><a href="index.html#interdisciplinary-reels">All disciplines and foundations</a></p>';
}else{
detail.innerHTML='<h1>Scientific disciplines and foundations</h1><p>Explore the interdisciplinary research fields and the shared foundations behind them.</p><p><a href="index.html#interdisciplinary-reels">Browse both reels</a></p>';
}
}
})();