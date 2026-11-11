/* Evidence-linked research page enhancements. 
 * Three authored paper slots are explicitly proposed, not written or published.
 * Do not attribute published Zenodo work without a verified record and authorisation.
 */
(() => {
"use strict";
const gh="https://github.com/manifoldgrace/manifoldgrace.github.io/blob/main/research-project-templates/";
const templates=[
["Research gap and question protocol",gh+"01-research-question-template.md","Reusable GitHub template · not an implemented project"],
["AI model evaluation benchmark",gh+"02-ai-model-evaluation-template.md","Reusable GitHub template · not a completed benchmark"],
["Comparative AI case study",gh+"03-comparative-case-study-template.md","Reusable GitHub template · not a completed case study"]
];
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
const isLang=topic==="linguistics";
const ext=isLang?linguistics.papers:[];
const cases=isLang?linguistics.cases:[];
const main=section("Three GitHub research project templates",templates.map(x=>[x[0],x[2],x[1]]),"");
const disciplineName=(root.querySelector("h1")?.textContent||"this discipline").trim();
const paperTopics=[
["Research problem and evidence-gap assessment — "+disciplineName,"Proposed paper initiative · no manuscript, DOI or Zenodo publication"],
["Comparative evaluation of AI methods in "+disciplineName,"Proposed paper initiative · subject to literature and feasibility audit"],
["Interdisciplinary synthesis, limits and implications — "+disciplineName,"Proposed paper initiative · originality unverified"]
];
const pub='<section class="mg-evidence-group"><h2>Three proposed author-led paper initiatives</h2><p class="mg-evidence-empty">Research directions for future writing, not completed manuscripts or Zenodo records. No publication links are assigned before an actual deposit.</p><ol>'+paperTopics.map(x=>'<li><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span></li>').join("")+'</ol></section>';
const papers=section("Five external research papers — alternative authors",ext,"Five discipline-specific external papers require citation and author verification. No sources have been invented.");
const caseStudies=section("Five documented AI case studies",cases,"Five discipline-specific AI case studies require primary-source verification. No deployments or results have been invented.");
root.insertAdjacentHTML("beforeend",'<div class="mg-evidence-library" id="research-evidence-library"><p class="mg-evidence-label">RESEARCH & EVIDENCE DIRECTORY</p>'+main+pub+papers+caseStudies+'</div>');
})();