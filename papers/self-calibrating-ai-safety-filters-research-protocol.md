# Self-Calibrating AI Safety Filters: Evaluator Fallibility, Knowledge Retention and Manipulation Resistance

**Status:** Research paper initiative and reproducible experimental protocol, established 13 November 2026. Not a completed paper, preprint or validated study.

## Abstract — protocol statement
AI safety filtering affects both the safety and epistemic quality of models. We propose to assess whether a staged, uncertainty-aware filter with evaluator self-audits can lower inappropriate rejection of legitimate information and retain later-validated novelty without increasing unsafe acceptance or susceptibility to adaptive attacks. The study will jointly measure safety, utility, knowledge diversity, calibration and review cost; claims of efficacy remain hypotheses until independently tested.

## Research questions
1. When can a filtering system detect that its own decision boundary is unreliable?
2. Can uncertainty-preserving review recover valid but unconventional inputs that ordinary screening would reject?
3. Does contextual or longitudinal information improve proportionality, and when can it be exploited?
4. How robust are calibration mechanisms to adversarial and out-of-distribution inputs?

## Distinguishing the contribution from prior work
This topic overlaps established overrefusal, prompt-injection, data-quality filtering and uncertainty calibration research. A contribution is **not** merely a new multi-stage filter. The testable proposed distinction is joint evaluation of evaluator self-critique, recoverable knowledge exclusion, downstream safety/utility outcomes and manipulation resistance under changing evidence. Run a formal overlap audit before claiming novelty.

## Method
- Pre-register decision rules, risk tolerances and held-out tests.
- Construct consent-compliant synthetic, public or licensed examples: benign, harmful, ambiguous, novel and adversarial. Do not deploy unsafe material or bypass real controls.
- Compare fixed threshold, conventional classifiers, multi-layer prompt guards, and staged self-audit with optional independent adjudication.
- Preserve uncertainty and provenance, with restricted review queues rather than unexamined inclusion in training.
- Conduct held-out evaluations, distribution-shift trials, disagreement audits and privacy reviews.
- Report false positive and negative rates, overrefusal, attack success, calibration, diversity and value retention, with intervals and error analyses.

## Falsification criteria
The central hypothesis fails if gains are not reproducible across datasets/annotators, if improvement is erased by stronger baselines or costs, or if the approach exceeds pre-registered unsafe acceptance and privacy thresholds.

## Ethics and governance
Training requires affirmative applicable consent. A human review stage is retained for consequential decisions. Public reporting excludes private messages, individual identities and confidential institutional records.

## Existing sources (first publication year)
- NIST AI RMF Generative AI Profile (2024): https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- ScalingFilter: data quality and semantic diversity (2024): https://aclanthology.org/2024.emnlp-main.187/
- No Filter: cultural and socioeconomic diversity in vision-language models (2024): https://proceedings.neurips.cc/paper_files/paper/2024/file/c07d71ff0bc042e4b9acd626a79597fa-Paper-Conference.pdf
- CAPTURE: context-aware prompt injection and over-defence (2025): https://aclanthology.org/2025.llmsec-1.13/
- Adaptive attacks against indirect prompt-injection defences (2025): https://aclanthology.org/2025.naacl-findings.395/
- Understanding and mitigating overrefusal (2025): https://aclanthology.org/2025.emnlp-main.1065/
- PromptGuard: layered injection-resilient framework (2026): https://www.nature.com/articles/s41598-025-31086-y
- Evaluating indirect prompt-injection defences: security and utility (2026): https://www.mdpi.com/2073-431X/15/9/570

## Intended manuscript sections
Introduction; problem formalisation; related work and strongest overlap; threat model; calibration architecture; datasets and adjudication protocol; experiments; results (unwritten); robustness and ablations; limitations and ethics; discussion; reproducibility appendices.

## Interim extension: Context-Augmented Safety Calibration (CASC), 13 November 2026

**Hypothesis:** Selective, provenance-preserving retrieval plus structured multi-pass cross-analysis and evaluator self-audit improves evidence recovery and safe decision calibration relative to equivalent-budget unstructured long-context and standard retrieval-augmented baselines.

**Method:** Use authorised historical records and synthetic cases; preserve time, source, confidence and contradictions in a claim graph. Compare fixed-context, maximal-context, retrieval-only and CASC conditions. Vary evidence position, length, missing records, adversarial distractors, inconsistent claims, and longitudinal conduct records. Test whether a system distinguishes isolated anomalies from patterns without allowing benign history to excuse grave current risks.

**Metrics:** Evidence recall/precision, temporal accuracy, contradiction recall, calibration error, false exclusion, unsafe acceptance, manipulation success, privacy leakage, processing cost and latency. Include independent reviewer adjudication and repeated tests over altered evidence.

**Falsification:** No demonstrated gain over matched baselines, or a worsening of preregistered safety/privacy limits, counts against the hypothesis.

**Prior work:** [Lost in the Middle (2024)](https://aclanthology.org/2024.tacl-1.9/); [Long-context Language Models Fail in Basic Retrieval Tasks (2025)](https://aclanthology.org/2025.findings-emnlp.301/); [Positional Failures in Long-Context LLMs (2026)](https://arxiv.org/abs/2605.23170); [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026). Future ASI timelines are highly uncertain and are not prerequisites for this study.

## External multi-model deliberation experimental arm — 13 November 2026

**Question:** Can independently generated answers from three or four heterogeneous models, followed by provenance-aware critique and selective synthesis, outperform a single verified response without increasing unsafe acceptance, false exclusion or correlated errors?

**Design:** Blind first-pass answers (same question and evidence), independent verification/contradiction/novelty reviews, bounded exchange, separate adjudication permitting unresolved disagreement. Compare with self-consistency, single-model self-checks, retrieval-only and compute-matched multi-model baselines. Evaluate ground-truth accuracy, reliability diagrams, adjudicator failure, evidence provenance, minority-correct recovery, safety and privacy risks, API cost, latency and adversarial persuasion resistance. Require consent before cross-provider sharing of private context.

**Falsification:** No robust, reproducible advantage over equal-budget baselines, or safety/privacy degradation, rejects the proposed superiority. Consensus is not automatically ground truth. This is not itself ASI.

**Relevant prior work:** [Du et al., ICML 2024](https://composable-models.github.io/llm_debate/); [Smit et al., ICML 2024](https://proceedings.mlr.press/v235/smit24a.html); [Zhang et al., 2025](https://arxiv.org/abs/2502.08788); [Wynn et al., 2025](https://arxiv.org/abs/2509.05396); [Chen et al., 2025](https://arxiv.org/abs/2510.20963); [Pitre et al., ICML 2026](https://proceedings.mlr.press/v306/pitre26a.html); [Morante and Romero García-Rubio, 2026](https://link.springer.com/article/10.1007/s44564-026-00040-z).
