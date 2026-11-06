# 300-entry candidate register: implementation status

**Version:** 0.1 — 2026-11-06  
**Status:** validated candidate dataset prepared separately; **not a completed independent audit**.

The 300 numbered research candidates represent 20 sectors, including businesses, public authorities, subsidiaries, product lines and operating divisions. They are **not 300 independently verified companies**. Their original descriptive claims and source homepage links are not sufficient to prove internal processes, workforce demographics, causation or document-retention duties.

## Current validation

- 300 sequential IDs (`MG-AUD-001` to `MG-AUD-300`) across 20 sectors (15 numbered entries per sector).
- Candidate statuses: `NOT_AUDITED`, `UNVERIFIED_SOURCE_TEXT`; retention rule: `NOT_ASSESSED`.
- Exact repeated names identified: UiPath (104/201), Automation Anywhere (105/202), UPS (117/247).
- Other group/product overlaps still require historically dated ownership checks. Do not silently erase or count them as independently established companies.
- A local JSON candidate index, accompanying Draft 2020-12 schema, and validation report passed structural validation. **Those complete artefacts have not been committed to this repository as part of this status note.**
- Completed substantive claim audits: **0/300**. A schema pass does not authenticate a claim.

## Publication requirements

Each organization/claim needs a specific, dated original source; claim-specific rationale and scope; relevant jurisdiction; independent reviewer or disclosed reviewer limitations; status and correction history. Homepage links are navigation leads only.

UK Limitation Act 1980 does **not** create a universal six-year corporate records retention duty. Record retention must be checked by record type, jurisdiction, applicable law and operative dates. Likewise, criminal intent must never be inferred merely from absent or deleted records.

## Technical security boundary

A client-side JavaScript routine that computes SHA-256 and returns JSON is **only local pre-validation**: it does not validate authorship, establish a trusted timestamp, perform malware detection, anonymise personal information, store evidence securely, or operate a server-side ingestion pipeline. This public GitHub Pages website is not a safe intake for unredacted HR records, correspondence, payslips, health records or other sensitive documents.

A future private ingestion service requires a data-protection assessment and legal basis, clearly defined controller responsibilities, secure authenticated backend, request size limits, malware scanning, encryption, access controls, retention/deletion controls, audit events, secure receipt/acknowledgement, and tested redaction with human review. No such service is represented as currently active.

## Connected procedures

- [Corporate Audit Register Status](CORPORATE_AUDIT_REGISTER_STATUS.md)
- [Evidence Audit Protocol](AUDIT_PROTOCOL.md)
- [Cross-Model Consistency Guide](CROSS_MODEL_CONSISTENCY_GUIDE.md)

This page is additive and does not overwrite existing layouts, navigational structures or substantive research files.
