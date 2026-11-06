# Manifold Grace — Master Release Readiness Assessment

**Date:** 2026-11-06  
**Scope:** Review of proposed Source Registry / Interoperable AI Evidence Integrity and Correction Standard v1.0.0 and submitted multi-agency drafts.  
**Disposition:** **NOT READY FOR VERIFIED PRODUCTION RELEASE**. Maintain source architecture as a proposal and existing audited/unaudited distinctions.

## Observed repository state
- Current candidate master index: `data/MASTER_INDEX_candidate_v0.1.json`. The file's own metadata says **300 candidate entries**, **20 sectors**, **0 independently audited entries** and `RESEARCH_CANDIDATES_NOT_VERIFIED`. These are not 300 distinct companies.
- Draft evidence schema: `schemas/evidence-record.schema.json`.
- RDF/SHACL source: `ontology/manifold-grace-research-v0.1.ttl`; synthetic positive/negative fixtures.
- GitHub Actions configuration: `.github/workflows/validate-research-rdf.yml`, checked as present on `main`. Successful GitHub-run result **not established during this review**. No claim of live CI pass is warranted.
- No securely deployed evidence ingestion, PKI-backed C2PA validation, lawful anonymisation workflow, auto-messaging system, or linked production graph has been demonstrated.

## Submitted material and required corrections

### Correspondence (drafts 3–12)
Ten proposed emails to the National Archives, DSIT, parliamentary committees, OSR, NIST, OECD, UNESCO and Open Rights Group were supplied. **They have not been sent.** Recipient addresses and institutional remit should be confirmed immediately before any transmission. The drafts should be adapted to avoid unsupported allegations of coordinated destruction or erasure, unsupported claims of production-grade technical deployment, and incorrect criminal-law generalisations. Attach a public, source-reviewed technical summary only; do not circulate personal records.

### One-step ingestion JavaScript
The pasted example computes a SHA-256 digest locally. That is **not** proof of creation time, author, trustworthy provenance, authenticity, or factual truth. It does not create server-side storage, NER anonymisation, legal vetting, secure submission, malware screening, confidential case handling or verified regulatory routing. The returned label `SERVER_SIDE_NER_ANONYMIZATION_TRIGGERED` is merely a string, not an executed service. Arbitrary document categories should not be assigned blanket retention/limitation periods or enforcement routes. Never upload unredacted payslips, HMRC records, private emails, settlement documents or privileged correspondence to GitHub Pages or public issues.

### Legal interpretation
- `Freedom of Information Act 2000 s77` and `Data Protection Act 2018 s173` describe offences with specified legal elements. Missing records or ordinary policy-based retention expiry does not automatically establish an offence.
- `Limitation Act 1980 s5` addresses particular simple-contract limitation periods, **not** general archival retention and **not** all employment, equality, privacy or administrative claims.
- Any payroll, NMW, holiday-pay, access request and adjustments retention rules require cause, law, entity, status, historical effective date and jurisdiction.
- Do not describe a proposed technical framework as an official standard or claim that an institution has accepted it.

### Candidate index extension
Sectors 11–20, IDs MG-AUD-151 through MG-AUD-300, were included as **research candidate text**. Many URLs are general homepages; some entities are public agencies, product lines or units. This does not satisfy documentary source verification. Do not replace the existing full 300-entry index with a truncated extension; preserve ID and claim status until independently corroborated.

## Release gates

| Gate | Requirement | State |
| --- | --- | --- |
| Candidate inventory | Stable IDs and clearly labelled unaudited leads | DOCUMENTED |
| Structure and schema | Published schema and positive/negative synthetic fixtures | DOCUMENTED |
| CI execution | Verified successful and reproducible Actions runs | NOT CONFIRMED |
| Source claims | Each factual assertion separately supported and reviewed | INCOMPLETE |
| Entity identity | Jurisdiction-scoped registry matching with human checks | DESIGN / PILOT |
| Legal applicability | Historical commencement, revision, jurisdiction and causes | NOT IMPLEMENTED |
| Privacy and security | Threat modelling, access controls, minimisation, secure storage, incident handling | NOT IMPLEMENTED |
| Cryptographic provenance | Trusted C2PA/PKI verification with explicit limitations | NOT IMPLEMENTED |
| Automated correction | Source-backed downstream correction and history | NOT IMPLEMENTED |
| Regulatory outreach | Verified recipients, truthful claims and reviewed tailored drafts | DRAFT ONLY |

## Proposed release strategy

**Version 0.1–0.2 = research and synthetic technical prototypes; version 1.0 = target, not achieved.**

1. Execute and independently inspect the GitHub Actions workflow and validation reports.
2. Add public-only claim/source provenance and contradiction tests.
3. Test difficult synthetic identity cases and replayable events; never automatically merge by name.
4. Implement historical legal status as data and review logic, not universal six-year rules.
5. Build a separate secure backend and complete a privacy/security review **before** any invitation to submit confidential material.
6. Publish a clearly labelled technical proposal and reviewed bibliographic record.
7. Seek independent peer review, then decide readiness for an appropriately scoped versioned release.

### Guiding principle
**No AI system should present the absence of evidence in its accessible knowledge as evidence that the historical event did not occur.** Equally, a cited source or repeated claim is not automatically true.

**No existing repository files, pages, candidate records or visual layouts are modified by this assessment.**
