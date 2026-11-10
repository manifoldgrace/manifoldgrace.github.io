# Graphify evaluation — Manifold Grace
Date: 10 November 2026
Status: **trial configured, not evidence of successful Graphify execution or token savings**.

## Existing mission (do not replace)
The published AI systems roadmap specifies modular specialist agents sharing source-grounded private retrieval, a permission broker, model gateway, human approval ledger and cost/error/privacy evaluations. The first implementation priority is the grounded research assistant; later agents cover business intake, education, content publishing, communications and personal information.

## Research hypothesis
H1: For specific repository architecture tasks, a Graphify query returns verifiable code relationships with fewer retrieved tokens than a keyword-search-plus-file-read baseline at comparable answer correctness.
H0: Graphify produces no such improvement, or omits critical relationships.

## First-stage execution
The [Actions workflow](../../.github/workflows/evaluate-graphify.yml) installs the *pinned* open-source `graphifyy==0.9.105` release and invokes `graphify extract . --code-only --no-cluster --out graphify-out` against the public website. The workflow has read-only GitHub permissions. No LLM API credentials or Graphify cloud accounts are supplied. Graph output is uploaded as a seven-day workflow artifact, **not committed to the public website**.
Read `graphify-evaluation.json` and the Actions logs. A failing smoke test means this integration is not operational.

## Comparative tasks — evaluate with fixed question wording
| Task | Ground truth to inspect | Baseline | Graphify |
| --- | --- | --- | --- |
| Identify research-workbench code entrypoints | research-workbench.mjs and test file | filename + grep + direct reads | graph query + cited source lookup |
| Trace public publication sync | connected-research.html, scripts/sync_public_research.py, .github/workflows/sync-public-research.yml | grep references and direct reads | graph query, edge path and source |
| Locate evidence contradiction benchmark | research/evidence-contradiction-benchmark/ | filename search and README | graph query plus verification |
| Identify action approval boundary in AI plans | ai-systems-implementation-roadmap.html | direct document read | **Not assessed in code-only trial** |
| Locate safety-relevant dependencies prior to change | targeted JS function and tests | ripgrep + source read | graph relations and direct verification |

Measure answer correctness, necessary edges found, false connections, source citations, input/output token count (using the **same** model and test question), wall time and graph build cost. A graph cannot be considered better by counting fewer characters alone.

## Adoption gates
1. Review open-source license, pinned release, data handling, package dependencies and supply-chain risk.
2. Confirm the workflow succeeds and inspect generated graph for meaningful nodes, edges and incorrect links.
3. Complete a blind comparison on the same questions and frozen repository revision.
4. Only after passing, optionally configure an authenticated coding agent to **query** the graph. Do not give an agent permission to publish, spend, email, delete or change live accounts without user approval.
5. Keep graph generation distinct from the research-specific evidence/provenance ontology: a code knowledge graph does not establish causal societal evidence.

## Official project
https://github.com/Graphify-Labs/graphify
