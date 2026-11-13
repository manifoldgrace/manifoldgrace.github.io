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
