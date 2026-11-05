# Independent reviewer handoff (fictional data only)

This is a **reviewer-ready candidate packet**, not an independent accuracy study. The twelve fictional cases were originally written with assistant support. Removing scenario labels avoids a direct hint, but **does not** make the cases independently sourced.

1. Reviewer A uses `reviewer_A_blank_v09.csv`; Reviewer B uses `reviewer_B_blank_v09.csv`. Both work separately from `review_cases_blinded_v09.json`. Do not share model predictions, discuss answers, or compare labels before both files are returned.
2. Relation labels: `contradiction`, `equivalent`, `compatible_temporal`, `distinct_scope`, `evidence_gap`, `insufficient_context`, `not_adjudicated`, `other`. Use `ambiguity_notes` and `rationale` to disclose uncertainty; do not invent missing dates, evidence or scope.
3. Fill the supplied CSV fields for each statement. Keep the reviewer IDs A and B; do not enter real names, email addresses, credentials or confidential records in the annotations.
4. Send the completed CSV files **privately** to the study coordinator, not via public GitHub commits or issues. The coordinator records independent submission dates, keeps originals unchanged, checks agreement using the offline `mg_lab.reviewer_v09` script, and documents disagreement adjudication separately.
5. Freeze adjudicated labels **before** running or revealing model predictions. An independent external evaluation should additionally include a new, independently sourced sample and independent annotation design.

Current result: **0/12 independently reviewed**, not scored. Previous v0.3–v1.1 milestone analyses and code remain separate. [Evaluation milestones](../../ai-research-lab.html#verification-evaluation-milestones-20261105) · [Single execution roadmap](../../research-active-triage-20261105.html#evaluative-implementation-lessons-20261105).
