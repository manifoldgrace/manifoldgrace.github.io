# Historical Entity Resolution — Pilot Design v0.1

**Manifold Grace | 2026-11-06 | Status: proposed, not deployed**

## Problem

The 300 candidate entries represent names for corporations, public bodies, subsidiaries, products and business divisions. Some overlap. The registry must avoid converting 300 candidate **rows** into a claim of 300 distinct audited **legal persons**.

## Minimal data model

- **candidate_id** — immutable research-row identifier, e.g. `MG-AUD-008`.
- **entity_id** — stable internal identifier only **after** sufficient identity resolution, otherwise null.
- **entity_type** — legal_entity | public_body | product | business_unit | corporate_group | unresolved.
- **display_name** and **name_history** — each name change with source and effective date; do not collapse historical naming.
- **registry_identifiers** — official registration reference and issuing jurisdiction where available; these require verification.
- **relationships** — typed, source-linked and time-scoped: `same_legal_entity_as`, `subsidiary_of`, `product_of`, `business_unit_of`, `acquired_by`, `successor_of`.
- **valid_from / valid_to** — dates the relationship is believed to hold, with uncertainty where appropriate.
- **observed_at / recorded_at / source_published_at** — distinguish source retrieval, project record entry and publication dates.
- **claim_id / evidence_id** — separately track factual assertions and original cited documents.
- **review_status / uncertainty / correction_history** — preserve independent review and revisions.

## Resolution rules

1. **No automatic merge by company name, shared domain, similar logo or AI-generated description.**
2. Same legal-entity IDs can be linked when supported by authentic official registration material; do not infer unique global equivalence from ambiguous local IDs.
3. Products remain distinct records with `product_of` relations rather than being counted as extra legal entities.
4. Retain both entries when a company appears across sectors, and link to one reviewed entity ID if evidence justifies it.
5. Mergers, demergers, acquisitions and changes of control are **different legal and temporal events**; preserve event type and dates.
6. Use a **manual review gate** when an entity link is uncertain. Record candidate matches without treating them as confirmed identity.
7. Link all published material claims to dated supporting source records, not just company homepages.
8. Avoid collecting people's protected characteristics or private employment documentation in this public register.

## Pilot cases from candidate names (unreviewed)

- SAP (`MG-AUD-008`), SAP SuccessFactors (`MG-AUD-064`), SAP Fieldglass (`MG-AUD-172`).
- Oracle (`MG-AUD-007`) and Oracle HCM (`MG-AUD-065`).
- Salesforce (`MG-AUD-009`) and Agentforce (`MG-AUD-210`).
- UiPath (`MG-AUD-104`) and UiPath RPA (`MG-AUD-201`).
- UPS (`MG-AUD-117`) and UPS (`MG-AUD-247`).

These are **potentially linked candidate rows**, not audited legal relationships.

## Acceptance tests for future implementation

- Duplicate labels generate review candidates but never silently merge.
- Date-specific queries do not apply contemporary ownership to earlier periods.
- Product, business unit, legal entity and corporate group counts are reported separately.
- Unknown relationships remain `unresolved` with explanatory metadata.
- Changes preserve provenance, original assertion and correction history.
- The exported graph can reconstruct which sources supported an assertion **at a specified historical date**.
- Data publication excludes confidential information and controls access to any lawful sensitive processing.
- A structural validator cannot mark a factual assertion `verified`; verification requires review and source support.

## Relevant literature

See [Technical Bibliography](TECHNICAL_BIBLIOGRAPHY.md), especially Lei et al. (2025) on structural/textual retrieval and Vitali & Pasqual (2026) on attributed statements.
