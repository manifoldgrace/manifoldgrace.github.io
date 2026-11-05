# Emerging Horizon — Questions, Evidence and Research Continuation
Date: 5 November 2026
Status: Working public research register. No claim of exhaustive discovery.

## Research-record method
Question → competing explanations → existing contributions → scoped gap check → proposed response → test or review → limits → next experiment → archived correction.

## Confirmed local documentation gap — addressed
The Emerging Horizon directory identified research venues but had no single index combining questions, prior work, confirmed gaps, proposed corrections, and methodological status. This register supplies that missing documentation link. This addresses the publication format, not a global scientific problem.

## Case 1 — Mathematical evaluation scoring
Question: Can reference parsing incorrectly score equivalent answers?
Evidence: EleutherAI issue #4502, reported and reproduced by Max-Reisinger on 1 November 2026. Earlier related work and a reviewer, HarshShroff, are credited in the issue.
Source: https://github.com/EleutherAI/lm-evaluation-harness/issues/4502
Suggested response from the issue: keep reference normalization separate from prediction extraction; add regression cases and version scoring changes.
Status: Reported reproduction upstream; correction and upstream closure not independently verified here.
Next: Recheck upstream changes and reproduce safely using the source project's published tests.

## Case 2 — Long-task capability measurement
Question: How far do AI time-horizon findings generalise across real-world task distributions?
Evidence: Thomas Kwa at METR documented uncertainty, domain dependence, and contextual limitations on 22 January 2026.
Source: https://metr.org/notes/2026-01-22-time-horizon-limitations/
Prior work: https://github.com/METR/eval-analysis-public
Proposed continuation: Domain-stratified and context-sensitive evaluations with human baselines and multiple reliability thresholds.
Status: Existing limitations documented; the proposed continuation is untested.

## Case 3 — Claims, history and evidence
Question: Can source-version and observation-time records improve the handling of historical evidence?
Existing work: AVeriTeC already provides evidence-linked QA, claim metadata and verdict categories.
Source: https://fever.ai/dataset/averitec.html
Proposed continuation: Compare source snapshots, observation and publication time, corrections and provenance links against existing approaches.
Status: Candidate question, NOT a confirmed research gap; comprehensive prior-art review and independent evaluation are pending.

## Case 4 — Independent semantic review
Question: Does the local typed-claim pipeline agree with independently obtained annotations?
Evidence: The project's v1.1 audit records 12 fictional cases and no completed independent reviews.
Existing work: Manifold Grace research architecture decision trace and evaluation handoff, preserved on site.
Proposed response: Two independent reviewers, disagreement analysis, adjudication and frozen reference labels prior to scoring.
Status: Confirmed local validation gap; engineering safeguards are in place but external review remains outstanding.

## Source and ethics requirements
Credit original authors, retain links and dates, label reported issues separately from confirmed fixes, use synthetic examples for public demonstrations, keep historical revisions, and document potential risks before deployment. Use NIST AI RMF, UK government AI assurance guidance, and ISO/IEC 42001 as reference frameworks where relevant, without claiming certification.
