# From User Narrative to Unsupported Motive: Evaluating Evidence Calibration in LLM Social Reasoning
**Working-paper initiative** | 9 November 2026 | Manifold Grace | Status: proposal; not peer reviewed

## Abstract (proposal)
Large language models used for interpersonal advice may present speculative psychological motives as established facts, particularly when agreeing with a user's emotionally salient narrative. We propose the Social Reasoning Evidence and Calibration Benchmark (SRECB), which separates observable statements, reported allegations, warranted inferences, alternative explanations and unsupported motive attributions. The proposed study will evaluate perspective-reversal stability, calibration, demographic robustness, evidential coverage and action-guidance quality. No experiments have yet been conducted; the hypotheses and methods described here require validation.

## Research question
How can AI distinguish observable interpersonal behaviour from speculative interpretations of intentions, while remaining empathetic, culturally sensitive and genuinely useful?

## Background and relation to prior work
1. Cheng et al., *ELEPHANT: Measuring and Understanding Social Sycophancy in LLMs*, ICLR 2026, Microsoft Research: https://www.microsoft.com/en-us/research/publication/elephant-measuring-and-understanding-social-sycophancy-in-llms/ (models endorsed both sides of moral-conflict accounts in 48% of tested cases).
2. Ibrahim, Hafner and Rocher (2026), *Training language models to be warm can reduce accuracy and increase sycophancy*, Nature 652:1159–1165, DOI https://doi.org/10.1038/s41586-026-10410-0 (controlled training conditions; findings should not be generalised to all warmth interventions).
3. Dubois et al., *Ask Don't Tell: Reducing Sycophancy in Large Language Models*, UK AI Security Institute: https://www.aisi.gov.uk/research/ask-dont-tell-reducing-sycophancy-in-large-language-models (framing and certainty affect agreement; converting statements into questions is a tested mitigation).

## Proposed contribution
Unlike factual QA, social motive attribution often has no accessible ground truth. We therefore evaluate **evidential discipline**, rather than pretending to know a person's inner state. Distinguish (i) direct quotations, (ii) user reports, (iii) corroborated observations, (iv) grounded interpretations, (v) unverified motive hypotheses, (vi) normative advice.

## Hypotheses
- H1: high-certainty first-person framing increases unsupported psychological inference.
- H2: perspective reversals change model judgements where relevant underlying facts remain identical.
- H3: evidence-labeling plus uncertainty prompting reduces unsupported motive claims without impairing practical usefulness.
- H4: demographic changes produce differences in unsupported attribution despite otherwise matched facts.

## Benchmark design
- Collect synthetic and permission-cleared anonymised vignettes across friendships, work, family and courtship. Exclude identifying private records from public release.
- Prepare mirrored narratives, question/statement framing variants and emotional-intensity variants.
- Annotate individual claims and evidential strength by independent raters with adjudication and inter-rater agreement.
- Label unknown inner motives as **indeterminate**, not true or false.
- Test baselines and interventions across multiple LLMs with archived prompts, versions and parameters.
- Quantify unsupported-attribution rate, reversal inconsistency, evidence coverage, uncertainty calibration, unnecessary stereotyping, appropriate abstention, usefulness and possible conflict escalation.
- Report model-wise error breakdowns, confidence intervals and sensitivity analyses; pre-register hypotheses where feasible.

## Seven workstreams
1. Unsupported motive attribution — observation/hypothesis/conclusion separation.
2. Excessive agreement — mirrored conflict tests.
3. Overconfidence — calibrated uncertainty and abstention.
4. Social and cultural bias — matched demographic counterfactuals.
5. Contradiction detection — cross-turn provenance and consistency analysis.
6. Psychological overreach — unsupported diagnoses/trait inferences.
7. Social consequences — ethically reviewed user decision outcomes.

## Ethics and limitations
No inference about a real individual's sexual orientation or psychiatric state from casual anecdotes. No public release of private interpersonal content without consent. Social reality lacks independent ground truth for many motives; neither annotators nor models should manufacture one. Acknowledging possible mistreatment is compatible with evidential restraint.

## Milestones
1. Literature map and preregistered protocol (proposed).
2. Draft annotation handbook and 100 pilot synthetic cases (proposed).
3. Expert review and reliability assessment (proposed).
4. Cross-model evaluation and mitigation comparisons (proposed).
5. Working paper, reproducibility dataset and governance recommendations (proposed).

## Status
Initiative and outline created 9 November 2026. No empirical results, external review, grant, publication acceptance or partnership claimed.
