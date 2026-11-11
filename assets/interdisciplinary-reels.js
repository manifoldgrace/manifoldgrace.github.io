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
["social-computing","Human–Computer Interaction","⌨","People, interfaces and sociotechnical systems","interdisciplinary-research-atlas.html"],
["law","Law & Legal Studies","⚖","Legal systems, justice and legal scholarship","research.html"],
["business","Business & Management","▥","Organisations, strategy and enterprise","research.html"],
["accounting","Accounting & Audit","≡","Financial reporting, assurance and controls","research.html"],
["architecture","Architecture & Planning","⌂","Built environments, design and spatial planning","research.html"],
["urban-studies","Urban & Regional Studies","▦","Cities, development and social geography","research.html"],
["theology","Theology & Religious Studies","✦","Religious traditions, texts and philosophical inquiry","research.html"],
["literature","Literature & Literary Studies","✎","Textual expression, interpretation and criticism","research.html"],
["music","Music & Musicology","♫","Sound, composition, performance and cultural study","research.html"],
["film-media","Film, Media & Communication","◫","Media systems, expression and communication","research.html"],
["journalism","Journalism & Documentation","▤","Public information, reporting and documentary evidence","research.html"],
["design","Design & Creative Practice","◈","Design methods, prototyping and applied creativity","research.html"],
["anthropology","Anthropology & Ethnography","◎","Human cultures, experiences and field methods","research.html"],
["geography","Geography & Geospatial Studies","⌖","Place, environments and spatial patterns","research.html"],
["international-relations","International Relations","⊕","Relations among states, institutions and societies","research.html"],
["criminology","Criminology & Justice Studies","⚑","Crime, justice systems and social policy","research.html"],
["social-work","Social Work & Social Care","♡","Community wellbeing, social practice and support","research.html"],
["nursing","Nursing & Allied Health","✚","Care delivery, health systems and clinical practice","research.html"],
["dentistry","Dentistry & Oral Health","◇","Oral health, prevention and clinical interventions","research.html"],
["public-policy","Public Policy & Governance","◉","Public decisions, implementation and evaluation","research.html"],
["manufacturing","Manufacturing & Industrial Design","⚙","Production, fabrication and industrial systems","research.html"],
["construction","Construction & Building Science","▧","Buildings, materials and construction processes","research.html"],
["transport","Transport & Logistics","⇄","Mobility, infrastructure and supply chains","research.html"],
["sport","Sport & Exercise Studies","◌","Human movement, physical performance and wellbeing","research.html"],
["hospitality","Hospitality, Tourism & Services","✧","Service industries, mobility and customer experiences","research.html"],
["library-science","Library & Archival Studies","▤","Knowledge organisation, collections and preservation","research.html"],
["translation","Translation & Interpretation","↔","Cross-language meaning and communication","research.html"],
["digital-humanities","Digital Humanities","⌘","Computational approaches to humanistic inquiry","research.html"],
["science-policy","Science, Technology & Society","∩","Intersections of research, politics and public life","research.html"]
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
const AI_APPLICATIONS = {"artificial-intelligence":"Test reasoning, factual accuracy, robustness and provenance across models.","mathematics":"Use formal verification and theorem-proving assistance; check every derivation independently.","physics":"Analyse simulation outputs and identify candidate relationships in physical measurements.","chemistry":"Model molecular properties and prioritise hypotheses for laboratory testing.","biology":"Analyse biological sequences, images and experimental observations.","astronomy":"Classify observations and detect anomalies in large sky surveys.","earth-sciences":"Combine satellite imagery and environmental measurements for predictive modelling.","electronics":"Assist circuit design review, verification and fault diagnosis.","computer-science":"Evaluate algorithms, code agents and software quality under reproducible tests.","mechanical-engineering":"Support design optimisation and sensor-based condition monitoring.","nanotechnology":"Predict material properties and examine nanoscale imaging data.","robotics":"Study autonomous control, sensor fusion and simulation-to-reality transfer.","civil-aerospace":"Analyse structural sensor data and engineering simulation outputs.","biomedical":"Study biomedical data, image analysis and reliable evidence interpretation.","neuroscience":"Model neural signals and compare computational hypotheses with observed data.","medicine":"Evaluate clinical decision-support tools under appropriate expert and safety oversight.","public-health":"Analyse population datasets and assess prediction fairness and uncertainty.","agriculture":"Evaluate crop monitoring and soil or environmental forecasting systems.","veterinary":"Study image-based triage aids and their limitations with specialist oversight.","ecology":"Classify biodiversity recordings and test environmental forecasting models.","food-science":"Analyse quality-control signals and model food-processing conditions.","psychology":"Evaluate how AI systems affect cognition, trust and decision-making.","sociology":"Study algorithmic effects on social systems using transparent, ethical methods.","economics":"Analyse forecasting reliability and model sensitivity to distributional assumptions.","political-science":"Audit AI-assisted public-service decisions and institutional accountability.","education":"Test learning support, assessment validity and unintended effects of AI tutoring.","philosophy":"Compare AI-generated arguments for logical consistency and epistemic limitations.","logic":"Test formal inference, proof checking and contradictions in AI reasoning.","history":"Use document retrieval and provenance tracking with careful source criticism.","linguistics":"Study language models, meaning, speech technologies and multilingual reliability.","arts":"Evaluate AI-supported creative tools, authorship and cultural interpretation.","social-computing":"Test accessibility, interaction quality and user control in AI interfaces.","law":"Examine the use, limits and evidence requirements of AI in law & legal studies.","business":"Examine the use, limits and evidence requirements of AI in business & management.","accounting":"Examine the use, limits and evidence requirements of AI in accounting & audit.","architecture":"Examine the use, limits and evidence requirements of AI in architecture & planning.","urban-studies":"Examine the use, limits and evidence requirements of AI in urban & regional studies.","theology":"Examine the use, limits and evidence requirements of AI in theology & religious studies.","literature":"Examine the use, limits and evidence requirements of AI in literature & literary studies.","music":"Examine the use, limits and evidence requirements of AI in music & musicology.","film-media":"Examine the use, limits and evidence requirements of AI in film, media & communication.","journalism":"Examine the use, limits and evidence requirements of AI in journalism & documentation.","design":"Examine the use, limits and evidence requirements of AI in design & creative practice.","anthropology":"Examine the use, limits and evidence requirements of AI in anthropology & ethnography.","geography":"Examine the use, limits and evidence requirements of AI in geography & geospatial studies.","international-relations":"Examine the use, limits and evidence requirements of AI in international relations.","criminology":"Examine the use, limits and evidence requirements of AI in criminology & justice studies.","social-work":"Examine the use, limits and evidence requirements of AI in social work & social care.","nursing":"Examine the use, limits and evidence requirements of AI in nursing & allied health.","dentistry":"Examine the use, limits and evidence requirements of AI in dentistry & oral health.","public-policy":"Examine the use, limits and evidence requirements of AI in public policy & governance.","manufacturing":"Examine the use, limits and evidence requirements of AI in manufacturing & industrial design.","construction":"Examine the use, limits and evidence requirements of AI in construction & building science.","transport":"Examine the use, limits and evidence requirements of AI in transport & logistics.","sport":"Examine the use, limits and evidence requirements of AI in sport & exercise studies.","hospitality":"Examine the use, limits and evidence requirements of AI in hospitality, tourism & services.","library-science":"Examine the use, limits and evidence requirements of AI in library & archival studies.","translation":"Examine the use, limits and evidence requirements of AI in translation & interpretation.","digital-humanities":"Examine the use, limits and evidence requirements of AI in digital humanities.","science-policy":"Examine the use, limits and evidence requirements of AI in science, technology & society."};
const FOUNDATION_APPLICATIONS = {"observation":"Assess how AI extracts observations from records, images and sensors.","questioning":"Test whether AI proposes useful, answerable research questions.","reasoning":"Measure inference validity and contradiction detection.","evidence":"Check claim-to-source coverage and independent source support.","measurement":"Evaluate measurement error, calibration and uncertainty.","mathematics":"Verify numerical and symbolic calculations independently.","modelling":"Compare AI-generated models with observed behaviour.","experimentation":"Design controlled comparisons and track reproducibility.","causality":"Distinguish causal evidence from correlation in AI explanations.","systems":"Map feedback loops and multi-system interactions.","verification":"Repeat tests and check correction and provenance histories.","uncertainty":"Test confidence calibration and acknowledgement of limitations.","criticism":"Seek falsifying examples, alternative explanations and counterevidence.","synthesis":"Test whether relevant perspectives are combined without omissions.","discovery":"Evaluate the novelty and testability of generated hypotheses.","ethics":"Assess transparency, oversight and impacts on affected people."};
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
const aiExample=(type==="foundation"?FOUNDATION_APPLICATIONS:AI_APPLICATIONS)[found[0]]||"Explore measurable applications and limitations.";
detail.innerHTML='<div class="mg-science-detail-icon" aria-hidden="true">'+safe(found[2])+'</div><p class="mg-science-kicker">'+(type==="foundation"?"SHARED INTELLECTUAL FOUNDATION":"INTERDISCIPLINARY RESEARCH FIELD")+'</p><h1>'+safe(found[1])+'</h1><p class="mg-science-summary">'+safe(found[3])+'.</p><h2 class="mg-science-subhead">AI and this '+(type==="foundation"?"foundation":"discipline")+'</h2><p class="mg-science-application">'+safe(aiExample)+'</p><p class="mg-science-note">An illustrative research application, not a claim of a funded project, operational laboratory or completed finding.</p><p class="mg-science-links"><a href="'+safe(related)+'">Related research</a><a href="interdisciplinary-research-atlas.html">Research atlas</a><a href="index.html#interdisciplinary-reels">All disciplines and foundations</a></p>';
}else{
detail.innerHTML='<h1>Scientific disciplines and foundations</h1><p>Explore the interdisciplinary research fields and the shared foundations behind them.</p><p><a href="index.html#interdisciplinary-reels">Browse both reels</a></p>';
}
}
})();