# Manifold Grace — Evidence Audit and Daily Ingestion Protocol

**Version:** 0.1 (working procedure)  
**Established:** 2026-11-06  
**Scope:** Public-source research and appropriately authorised evidence review.  
**Status:** Documentation only; this does not create a secure upload portal, forensic laboratory, legal certification, or automatic regulatory reporting service.

## Purpose

Make the process of verifying historical, institutional, employment and AI-related claims repeatable without treating missing records as proof of non-occurrence. Support traceable corrections and distinguish what a source **says** from what its contents actually **establish**.

**Core maxim:** No AI system should present the absence of evidence in its accessible knowledge as evidence that a historical event did not occur.

## Daily receipt check — before adding a claim

- [ ] **State one narrow claim.** Identify the actor, event, jurisdiction, relevant time range and meaning of any metric.
- [ ] **Separate evidence from interpretation.** Write the original source's supported assertion separately from any hypothesis about motives, causation or wider implications.
- [ ] **Trace the source.** Prefer an identifiable statute, official dataset, original corporate declaration, primary correspondence or another relevant original; record where independence is absent.
- [ ] **Check historical context.** Record publication date, effective/commencement date where relevant, subsequent amendments, retrieval date and geographic applicability.
- [ ] **Identify contradictions.** Log rival versions and differing definitions without silently choosing a preferred account.
- [ ] **Record gaps.** Mark unavailable data as `insufficient_evidence`, never as a proven negative or as evidence of wrongdoing by itself.
- [ ] **Assess privacy and rights.** Never publish personal payroll, medical, disability, migration, confidential company information, source identities or secrets without an appropriate legal basis, authority and safeguards.
- [ ] **Review then publish.** Distinguish pending from reviewed entries. Use links to the cited evidence and a correction note where needed.

## File and provenance intake — when a file is lawfully held

1. Preserve the original bytes separately from any working or redacted copy. Record how and when the file came into custody, and any legitimate restrictions on possession or disclosure.
2. Generate a SHA-256 checksum **on the actual original bytes** before making modifications. Record the checksum, hashing algorithm, file size, file format, acquisition time (including time zone), custodian identifier and storage location.
3. Use a stable evidence identifier. A readable filename can be `YYYY-MM-DD-Issuer-DocumentType-v01.ext`; this is a suggested project convention, **not** a legal requirement or guarantee of compliance with The National Archives.
4. Log every transfer, derivative, redaction and access event. Maintain the original and modified versions distinctly; record new hashes for modified files.
5. Restrict sensitive originals to approved private storage with access controls, backups and proportionate retention. **Do not upload them to public GitHub or GitHub Pages.**
6. Independently evaluate authenticity and completeness. A matching SHA-256 hash shows the bytes match an earlier fingerprint; it **does not** prove genuine authorship, accurate content, a trusted timestamp, or that a document was never altered before first acquisition.

### Optional checksum commands for authorised local files

Linux/macOS: `shasum -a 256 "document.pdf"`  
Windows PowerShell: `Get-FileHash -Algorithm SHA256 -Path "document.pdf"`

Treat any stored fingerprint of a sensitive file as potentially sensitive metadata if it can be correlated with identifiable data. Avoid public disclosure by default.

## Emails (.eml / .msg)

Preserve the unmodified message export including raw headers when lawfully available. Record export method, mailbox/custodian, retrieval time and any attachments; hash each original file as needed.

Examine `Date`, `Message-ID`, `Received` and authentication-related fields, but **do not** infer authenticity solely from header text: some fields can be forged, messages can be forwarded or transformed, and mail clients may export data differently. DKIM verification requires appropriate signed content, signature and keys, and still does not establish the truth of the message's claims. Not every message exposes an original sender IP address. Consult a qualified digital-forensics specialist for contested authenticity.

## Legal cross-references — no automatic offence classification

Record statute, exact provision, jurisdiction, operative dates, governing retention obligation, requester status, evidence of intent where applicable, and plausible alternative explanations.

- [Data Protection Act 2018, section 173](https://www.legislation.gov.uk/ukpga/2018/12/section/173): applies only where statutory elements of the relevant records offence are met; ordinary record loss is not automatically criminal.
- [Freedom of Information Act 2000, section 77](https://www.legislation.gov.uk/ukpga/2000/36/section/77): tied to applicable access requests and relevant authorities/persons; not a universal retention duty.
- [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents): potential accessibility and reasonable-adjustment duties must be analysed in their specific service and factual context; not every postal requirement is inherently unlawful.
- [Public Records Act 1958](https://www.legislation.gov.uk/ukpga/Eliz2/6-7/51/contents): record selection and preservation obligations have defined scope, not universal indefinite retention.
- Retention periods differ by document category, purpose, dates, jurisdiction and applicable legal framework. Never use a generic six-year default.

Record issues for qualified human review; do not auto-route an allegation or automatically publish a conclusion of misconduct.

## Public registry entry

The machine-readable template is [../../schemas/evidence-record.schema.json](../../schemas/evidence-record.schema.json). Minimum claim-level metadata should include:

- Stable record ID, exact claim text, source reference, issuer and source type.
- Jurisdiction; event, publication and retrieval dates.
- Evidence status: `supported`, `contradicted`, `disputed`, or `insufficient_evidence`.
- Review status and method; explicit methodological limitations.
- Access classification and append-only correction history at the publication/workflow level.

**Important:** JSON Schema can validate structure and types; it cannot certify legal compliance, authentic provenance, the truth of a claim or immutability. A public repository is version-controlled but not tamper-proof or guaranteed to be indexed by search engines or AI models.

## Short end-of-session routine

- [ ] Check any new source-to-claim mappings and record corrections.
- [ ] Confirm no confidential files, personal identifiers or sensitive metadata are staged for public commit.
- [ ] Commit small additive changes with a specific message and inspect the resulting diff.
- [ ] Add a dated milestone/lesson learned where findings or methods materially changed.
- [ ] Record unresolved work as discrete open questions, not assumed factual conclusions.

**Pacing:** These checks are a quality gate for submissions, not a requirement to spend hours on administrative work every day. Prioritise progress and appropriate automated testing.

## Related project documentation

- [Evidence documentation index](README.md)
- [Claim-level verification rules](verification-rules.md)
- [Master evidence matrix](master-evidence-matrix.md)
- [Escalation and review design](../governance/escalation-protocol.md)
- [Contribution guidance](../../CONTRIBUTING.md)
