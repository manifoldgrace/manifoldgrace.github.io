# Cross-Domain Evidence Integration and Evaluator Fallibility in Language Models: A Public-Interest Benchmark Protocol
**Status:** Paper initiative and working protocol — November 2026. Not a completed paper, preprint, published experiment or recruited study.

## Concept and rationale
Human life is multidimensional. Real-world reasoning may depend on integrating historical records, causal accounts, cultural meanings, practical expertise, competing human priorities and uncertainty. Established studies document long-context retrieval weaknesses, cultural evaluation gaps and meaningful annotator disagreement. The proposed question is whether an integrated, rights-respecting benchmark exposes cross-domain weaknesses not captured by narrower evaluations.

## Research project
Cross-Domain Epistemic Evaluation and Public Knowledge Contributions. Linked to [life-domain research map](../life-domain-ai-evaluation.html), [AI safety calibration](../ai-safety-filter-calibration.html) and [public research collaboration](../research-collaborations.html#life-domain-evaluation-public-contribution).

## Main research question
Can provenance-aware cross-domain and longitudinal evaluation distinguish missing knowledge, mistaken evaluation criteria and genuinely unsupported contributions more accurately than single-domain, single-context or conventional consensus baselines?

## Subquestions
1. Which errors arise when evidence spans different life domains or time periods?
2. Does source attribution and uncertainty-aware retrieval improve correct revisions without increasing false reassurance?
3. When does disagreement among participants reflect legitimate value conflict, ambiguity or annotation error?
4. Can models distinguish demographic biography from culturally stereotyped inference?
5. Does evaluator self-audit detect invalid rubrics, and how often does it create new errors?
6. What added value, if any, comes from independent multi-model adjudication once extra compute is controlled?
7. Can expertise outside formal publications be tested responsibly while safeguarding privacy and attribution?

## Methods
- Perform gap-first review of the strongest relevant benchmark and evaluation work; record source year, demonstrated finding, limits and contradiction.
- Develop non-identifying synthetic, rights-cleared and public examples across ten life domains, including successful and unsuccessful events, counterfactual cases and contradictory sources.
- Recruit specialist evaluation only after consent and ethics review; do not infer participation or collect personal records by default.
- Compare equal-budget single-context, long-context, retrieval, cross-model and evaluator-self-audit workflows, using independent holdouts and ground truth where appropriate.
- Pre-register risk limits and adjudication procedures; preserve minority correct answers and reasons for uncertainty.
- Report confidence intervals, null results and reproducible case-level errors.

## Measures
Evidence recall and source precision; chronology and causal direction accuracy; sensitivity to evidence position; cultural classification error; inter-rater disagreement preservation; correction rates; false exclusion/false acceptance; adverse safety outcomes; privacy exposure; cost and latency.

## Falsification
The integrated approach fails the primary claim if results are not reproducible or do not improve over matched strong baselines; safety/privacy degradation invalidates claims of net improvement even where task accuracy rises.

## Contribution governance
Submissions are suggestions for research, not consent to model training. Avoid sensitive records, identify licensing and preserve corrections and attribution. Never imply a new participant, collaborating institution, experiment or publication exists without verification.

## Initial cited work (year and URL)
- **2023: NIST AI Risk Management Framework** — Risk, accountability and ongoing evaluation. https://www.nist.gov/itl/ai-risk-management-framework
- **2024: Lost in the Middle** — Limitations of long-context evidence use. https://aclanthology.org/2024.tacl-1.9/
- **2024: CausalBench: Comprehensive causal reasoning benchmark** — Interventions and causal-direction tests. https://aclanthology.org/2024.sighan-1.17/
- **2024: The Perspectivist Paradigm Shift** — Disagreement may reflect interpretive differences. https://aclanthology.org/2024.naacl-long.126/
- **2024: Cultural bias and cultural alignment of large language models** — Cultural variation in output behaviour. https://pmc.ncbi.nlm.nih.gov/articles/PMC11407280/
- **2025: Disentangling Language and Culture** — Separate language from cultural context. https://aclanthology.org/2025.acl-long.1082/
- **2025: NUTMEG: Separating Signal From Noise** — Disagreement-aware annotation and evaluation. https://aclanthology.org/2025.emnlp-main.144/
- **2026: Beyond Consensus: Perspectivist Modeling and Evaluation** — Open challenges in disagreement-aware evaluation. https://aclanthology.org/2026.emnlp-main.2370/

## Manuscript outline
Introduction; domain taxonomy; related work and overlap audit; hypotheses and threat model; dataset construction; baseline architecture; evaluation measures; quantitative findings (not yet available); interpretation and limitations; ethics and public contribution; reproducibility appendices.

## Next planned milestone
Create a small, audited synthetic test set, a baseline table and an evidence-to-claim scoring template; evaluate before expanding to participant-contributed materials.
