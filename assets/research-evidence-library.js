/* Evidence-linked research page enhancements. 
 * Titles and links are directly verified where labelled as records.
 * Other disciplines present an explicitly incomplete evidence-audit template, never invented publications.
 */
(() => {
"use strict";
const gh="https://github.com/manifoldgrace/manifoldgrace.github.io/blob/main/research-project-templates/";
const templates=[
["Research gap and question protocol",gh+"01-research-question-template.md","Reusable GitHub template · not an implemented project"],
["AI model evaluation benchmark",gh+"02-ai-model-evaluation-template.md","Reusable GitHub template · not a completed benchmark"],
["Comparative AI case study",gh+"03-comparative-case-study-template.md","Reusable GitHub template · not a completed case study"]
];
const own=[
["The Cosmology of Cognition: Introducing the Adaptive Flow Framework","https://zenodo.org/records/17290625","2025 · Published Zenodo record · cognition / neuroscience / psychology"],
["A Draft on the Delegated Agency and the Moral Outsourcing of Automation","https://zenodo.org/records/17294405","2025 · Preprint · ethics / automation / social systems"],
["London Smart Piezoelectric Flooring Pilot Dossier","https://zenodo.org/records/17439725","2025 · Project dossier · engineering / energy / urban systems"],
["Loyal Residency: An Ethical Framework for Civic Continuity","https://zenodo.org/records/17439986","2025 · Report · public policy / ecological stewardship"]
];
const ownMatch={
"artificial-intelligence":[0,1,2],"mathematics":[],"physics":[2],"chemistry":[],"biology":[0],"astronomy":[],"earth-sciences":[2,3],"electronics":[2],"computer-science":[1,2],"mechanical-engineering":[2],"nanotechnology":[],"robotics":[1,2],"civil-aerospace":[2],"biomedical":[0],"neuroscience":[0],"medicine":[0],"public-health":[3],"agriculture":[3],"veterinary":[],"ecology":[3],"food-science":[],"psychology":[0,1],"sociology":[1,3],"economics":[1,3],"political-science":[1,3],"education":[0,1],"philosophy":[0,1,3],"logic":[1],"history":[3],"linguistics":[],"arts":[0,1],"social-computing":[0,1]
};
const linguistics={
papers:[
["mGPT: Few-Shot Learners Go Multilingual","Oleh Shliazhko et al. · 2024","https://aclanthology.org/2024.tacl-1.4/"],
["Aya Model: An Instruction Finetuned Open-Access Multilingual Language Model","Ahmet Üstün et al. · 2024","https://aclanthology.org/2024.acl-long.845/"],
["A Rigorous Evaluation of LLM Data Generation Strategies for Low-Resource Languages","Tatiana Anikina et al. · 2025","https://aclanthology.org/2025.emnlp-main.418/"],
["PARIKSHA: Human–LLM Evaluator Agreement on Multilingual Data","Ishaan Watts et al. · 2024","https://aclanthology.org/2024.emnlp-main.451/"],
["MUG-Eval: Multilingual Generation Evaluation","2025 · Association for Computational Linguistics","https://aclanthology.org/2025.findings-emnlp.1061/"]
],
cases:[
["EU Institutional LLM for underrepresented European languages","European Commission · Official implementation","https://translation.ec.europa.eu/language-data-and-ai-using-ai-break-down-language-barriers/eu-institutional-llm-prevent-digital-language-extinction_en?prefLang=pl"],
["Yucatec Mayan and Chol translation","Julio Rangel and Norio Kobayashi · 2024","https://aclanthology.org/2024.americasnlp-1.16/"],
["Ainu machine translation","So Miyagawa · 2023","https://aclanthology.org/2023.nlp4dh-1.14/"],
["English–Maltese and Spanish–Basque translation evaluation","Júlia Falcão et al. · 2024","https://aclanthology.org/2024.lrec-main.315/"],
["Indigenous language writing and translation prototypes","Claudio Santos Pinhanez · IBM Research · 2024","https://research.ibm.com/publications/harnessing-the-power-of-llms-to-vitalize-indigenous-languages"]
]};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function line([name,detail,url]){return '<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(name)+'</a><span>'+esc(detail)+'</span></li>';}
function section(title,items,empty){return '<section class="mg-evidence-group"><h2>'+esc(title)+'</h2>'+(items.length?'<ol>'+items.map(line).join("")+'</ol>':'<p class="mg-evidence-empty">'+esc(empty)+'</p>')+'</section>';}
const root=document.getElementById("mg-science-detail");
if(!root)return;
const params=new URLSearchParams(location.search);
if(params.get("type")==="foundation")return;
const topic=params.get("topic")||"";
const pubs=(ownMatch[topic]||[]).map(i=>[own[i][0],own[i][2],own[i][1]]);
const isLang=topic==="linguistics";
const ext=isLang?linguistics.papers:[];
const cases=isLang?linguistics.cases:[];
const main=section("Three GitHub research project templates",templates.map(x=>[x[0],x[2],x[1]]),"");
const pub=section("My published Zenodo research",pubs,"No discipline-specific paper verified for this field. Three publication slots will not be filled with unrelated or unpublished work.");
const papers=section("Five external research papers — alternative authors",ext,"Five discipline-specific external papers require citation and author verification. No sources have been invented.");
const caseStudies=section("Five documented AI case studies",cases,"Five discipline-specific AI case studies require primary-source verification. No deployments or results have been invented.");
root.insertAdjacentHTML("beforeend",'<div class="mg-evidence-library" id="research-evidence-library"><p class="mg-evidence-label">RESEARCH & EVIDENCE DIRECTORY</p>'+main+pub+papers+caseStudies+'</div>');
})();