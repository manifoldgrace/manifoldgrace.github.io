# Cross-Model Consistency Check — Engineering and Research Guide

**Manifold Grace | Version 0.1 | 2026-11-06**  
**Status:** reproducible research procedure; **not** an operational cross-provider API, live monitoring service or independently validated benchmark.

## Objective

Evaluate whether different AI systems, when asked the same bounded question, provide source-supported, historically accurate, sufficiently complete and appropriately qualified answers. Record contradictions, omissions, provenance and corrections without assuming that differences in emphasis amount to falsehood or that data gaps prove deliberate concealment.

**Research maxim:** An AI system's inability to retrieve evidence of an event is not evidence that the event never occurred.

## 1. Define a test case

Choose one public-interest historical or technical question. Record:

- `case_id`, `case_version`, date and evaluation purpose.
- Exact user-facing question, jurisdiction, people/organisations, event date window and required evidence types.
- Expected atomic claims **derived from independent sources** where available, not from another model's output.
- Source URLs, original publication dates, retrieval timestamps, relevant amendments and archive versions.
- A list of genuinely unresolved or disputed questions. Keep hypotheses separate.
- Data protection and copyright conditions. Use public or synthetic examples for first tests.

Suggested case: “What were the stated scopes, findings and methodological limits of Salesforce's 2022 equal-pay disclosures?” Do **not** assert that the underlying employer data was independently audited unless that fact is evidenced.

## 2. Control comparison conditions

Use one identical prompt across at least three named systems where access is available. If models provide tools, record whether web browsing/retrieval is enabled, and avoid comparing a browsing model with a non-browsing model as though they had identical evidence access.

Record for each run:

- Provider, product, model name/version as exposed, and response date/time (UTC).
- New conversation or established context; region/language and any relevant system settings.
- Whether browsing, connected files or search tools were enabled.
- The **exact** prompt and the entire resulting answer, including cited URLs.
- Any refusals, rate limits, inaccessible sources, model updates or retrieval failures.

Do not claim the results are a controlled comparison of model weights when retrieval, settings and provider configurations differ. Repeat runs if measuring response variability; one answer per provider is only an exploratory snapshot.

### Reusable prompt

> Investigate [EXACT QUESTION]. Give a dated, source-linked account with original publication or commencement dates and explicit jurisdiction. Identify each substantive factual claim, distinguish primary sources from reporting and inference, explain relevant missing evidence and contradictions, and describe what is unknown. Do not treat inaccessible evidence as proof that an event did not occur. Do not claim independent verification where the source is only an institutional declaration.

## 3. Evaluate each atomic claim

Create one row **per claim, per model response**. Do not score an answer solely on tone, verbosity or how critical it sounds.

| Dimension | Evaluation question |
| --- | --- |
| Claim support | Does the cited source support the exact factual assertion? |
| Source provenance | Is the source identifiable, dated and accessible to the reviewer? |
| Temporal accuracy | Are enactment, commencement, reporting and repeal dates distinguished? |
| Scope | Is the relevant population, region, company division or time frame correct? |
| Evidence gaps | Are material unknowns and source limitations disclosed? |
| Contradictions | Are relevant conflicting sources acknowledged and evaluated? |
| Corrections | When corrected, does the model acknowledge and accurately reflect the source? |
| Privacy and safety | Does the analysis avoid exposing confidential or personal evidence? |

For each factual claim, classify `supported`, `contradicted`, `disputed` or `insufficient_evidence`, with a rationale. Use `not_evaluated` when review has not occurred. Record reviewer identity/role and date. A provider's failure to mention a fact may be important, but **not every omitted detail is a harmful omission**; assess relevance to the exact question.

### Example scoring (pilot only)

- **Supported-claim fraction:** supported evaluated claims / all evaluated substantive factual claims.
- **Material-omission fraction:** materially required reference claims omitted / all reference claims marked material.
- **Unsupported-certainty count:** confident factual assertions marked contradicted or insufficient evidence without a clear qualification.
- **Citation integrity fraction:** independently checked citations supporting their associated claims / citations evaluated.

Do not publish these exploratory ratios as statistically representative performance rankings. Define materiality before seeing outputs, track reviewer disagreements and provide denominators and sample sizes.

## 4. Perform the proposed “grid audits”

**Interoperability schema review:** Convert a public statement into atomic claims and structured metadata. Check identifier stability, source type, published/effective dates, version history, measurement definitions and source links. Record missing fields as `not_disclosed` or `not_found`; do not label the omission deliberate without evidence.

**Regulatory cross-check:** Compare an institution's compliance statement with the precise statutory provision, jurisdiction and operative date. Where internal implementation cannot be observed, document the limit rather than infer non-compliance.

**Redaction test:** Use a wholly synthetic email, payslip or memo with invented names and identifiers. Identify names, email addresses, dates, account identifiers and indirect re-identification clues. Compare manual redaction with a proposed automated detector. Inspect the output; named-entity recognition is fallible and does not guarantee anonymisation. Keep real sensitive documents out of the public repository.

## 5. Record disagreements and corrections

Use [sample run template](cross-model-run-template.json) to record the test's configuration and model results. Treat a reference answer as a reviewable evidence baseline, not universal truth.

For each material disagreement:

1. Capture both claims verbatim in the private working record, within applicable copyright and confidentiality boundaries.
2. Trace both to their cited sources, preserving dates and jurisdiction.
3. Identify whether the disagreement is factual, definitional, temporal, a difference in evidence access, or interpretation.
4. Record the conclusion or classify as unresolved.
5. If retested, preserve the first run and document the model's later correction separately.

**No automatic correction propagation:** Publishing an amended file here does not automatically update other AI providers' models or retrieval systems.

## 6. Maintain a proportionate risk and gap ledger

Use descriptive categories instead of declaring every evidence gap an “existential risk”:

- `source_unavailable`, `source_conflict`, `historical_version_missing`, `unsupported_claim`, `citation_mismatch`, `privacy_risk`, `accessibility_barrier`, `possible_recordkeeping_issue`.

Assign severity according to **evidence, impact, likelihood and reversibility**, with a reviewer and follow-up action. Statutory breaches and malicious intent need separate legal/factual review. Escalate only through an appropriate confirmed channel; never automatically publish identifying personal records or file allegations from an unverified source.

## 7. Weekly practice: complete one case, not endless administration

1. Pick a single bounded historical question and prepare the reference sources.
2. Run identical prompts across available models, recording conditions.
3. Evaluate five to ten material atomic claims and their citations.
4. Make one schema mapping or synthetic redaction check.
5. Log disagreements, one methodological lesson, and any corrected entry.
6. Commit a **new or narrowly changed** research record; inspect the diff and protect existing website content.

If only one model is available, complete the source-to-claim check first and mark cross-model comparison `pending`. This procedure is optional research practice, not an obligation to audit daily.

## 8. Publication and versioning

Public outputs should contain the question, method, dates, configurations, source-backed findings, limitations, and carefully redacted excerpts. Keep any sensitive working files separately with lawful access controls. Preserve version history in Git, but do not claim Git hosting is immutable, permanent, or automatically indexed by search engines.

A published claim of model superiority requires a designed evaluation with adequate sampling, inter-reviewer agreement and reproducible metrics—not a handful of screenshots.

## Related documents

- [Evidence Audit Protocol](AUDIT_PROTOCOL.md)
- [Verification and correction rules](verification-rules.md)
- [Evidence JSON Schema](../../schemas/evidence-record.schema.json)
- [Master Evidence Matrix](master-evidence-matrix.md)
