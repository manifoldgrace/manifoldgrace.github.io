# Evidence and Contradiction Evaluation Harness

**Engineering artefact — 10 November 2026.** An executable, dependency-free evaluation fixture for testing whether evidence **supports**, **contradicts** or is **insufficient** to establish a claim. The harness extends existing claim-to-evidence work with reusable scoring infrastructure.

## Implemented outputs
- Twelve public, synthetic and author-labelled claim/evidence cases, with challenge tags and rationale.
- A deliberately weak lexical baseline and a reusable evaluator accepting predictions from another model.
- Accuracy, macro-F1, class-wise F1, confusion matrix and challenge-slice accuracy in JSON.
- No network, package installation or personal datasets needed.

## Reproduce
```bash
python evaluate.py
python evaluate.py --output baseline-results.json
python evaluate.py --predictions model-predictions.json --output comparison.json
```
The prediction file is a JSON object with fixture IDs as keys and labels `supports`, `contradicts`, `insufficient` as values. The lexical baseline is designed to be inspectable, not competitive.

## Research question
When do automated systems mistake lexical similarity for evidential support, especially across temporal changes, causal overreach, source independence, negation or quantifier mismatch?

**Falsification criterion:** Improvement is not established by higher accuracy on these public examples. Validate on newly authored, independently adjudicated, unseen cases across domains; compare majority-class, lexical and NLI baselines; report variation, per-slice results, uncertainty and error analysis. A system may merely remember fixtures or exploit template patterns.

## Interpretation and ethics
The dataset is a small **practice fixture**, not a contamination-free benchmark, independently labelled gold standard, deployed model assessment or demonstration of model safety. No foundation model was evaluated in the initial artefact. Keep private manuscripts and user records out of public examples. Version model, data, prompt and evaluator, preserve provenance and licences, and report refusals and abstentions.

## Research context and related work
- [MLCommons AILuminate](https://mlcommons.org/ailuminate/): established cross-industry AI evaluation and stewardship.
- [AILuminate Safety 1.2](https://mlcommons.org/ailuminate/safety/): versioning and the need for comparable scoring.
- [PyTorch contributor guide](https://github.com/pytorch/pytorch/contribute): a route to external open-source collaboration.

Related existing site work: [interactive research systems](../../ai-systems-demonstrations.html), [research programmes](../../research.html), [implementation roadmap](../../ai-systems-implementation-roadmap.html).

This package supplies implemented research infrastructure; additional benchmarking is an extension, not a claim that no research has begun.
