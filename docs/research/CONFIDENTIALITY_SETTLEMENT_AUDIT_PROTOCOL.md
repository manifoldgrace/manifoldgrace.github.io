# Confidentiality and Settlement Practices — Research Audit Protocol v0.1

**Manifold Grace | 2026-11-06 | Draft research method — not a finding of wrongdoing**

## Research question
How have confidentiality clauses, NDAs and settlement agreements influenced the availability, reporting and independent scrutiny of workplace disputes across employers, sectors, jurisdictions and historical periods?

## Hypotheses (unverified)
1. Some agreements may restrict public access to potentially relevant historical evidence.
2. The scope of lawful protected disclosures differs by legal regime and effective date.
3. Organisations may vary in how they document, review and explain permitted reporting routes.
4. Public indicators (e.g. pay gaps and workplace policies) cannot alone establish the number or merit of confidential disputes.

## Required analytical distinctions
- A confidentiality agreement does not itself establish misconduct, coercion, discrimination or concealment.
- Agreements have different purposes: legitimate privacy, trade secrets, commercial settlements, employee protections and dispute resolution.
- Employee protections and statutory exceptions vary by jurisdiction, provision, date, status and case facts.
- Personal testimony, a contract clause, an employer admission, a regulatory finding and a court judgment have different evidentiary weight.
- Absence of accessible records is not evidence that no event occurred; nor is it proof of deliberate erasure.
- A hash or file timestamp does not establish historical truth or lawful disclosure.
- The 2025 Employment Rights Act contains confidentiality-related provisions, but **do not presume their commencement or retrospective effect** without checking the current commencement instruments.

## Public-only audit questions
1. Which contractual clauses and restrictions are described in official guidance or published judgments?
2. What reporting to regulators, police, legal advisers or tribunals remains permissible?
3. Are there applicable protected pay-disclosure or whistleblowing safeguards?
4. Which jurisdiction's laws applied to the particular worker, organisation and agreement?
5. What were the enactment, commencement, amendment and repeal dates of each provision?
6. How were disputes reported statistically, if at all, without identifying confidential claimants?
7. What evidence is independently available (judgments, annual reports, regulator findings)?
8. Could publication or even collection expose personal, confidential, privileged or restricted information?
9. What would substantiate an allegation that a clause was used improperly?
10. Which conclusions remain uncertain or are contradicted by other evidence?

## Minimal public register fields
`audit_track_id`, `question_id`, `legal_entity_id` (if verified), `jurisdiction`, `period_start`, `period_end`, `agreement_category`, `regulatory_rule_id`, `legal_status_as_of`, `public_source_id`, `assertion_id`, `assertion_status`, `source_date`, `retrieved_date`, `evidence_limitations`, `reviewer_notes`, `privacy_classification`, `correction_history`.

All actual agreements, personal case identifiers and confidential exhibits stay **out of this public GitHub repository**. Even metadata can identify parties when cases are small; review aggregation and suppression requirements.

## Legal anchor points for review
- Solicitors Regulation Authority, *Use of non-disclosure agreements* (warning notice updated 2024-08-06): https://www.sra.org.uk/solicitors/guidance/non-disclosure-agreements-ndas
- Equality Act 2010, section 77, discussions about pay: https://www.legislation.gov.uk/ukpga/2010/15/section/77
- Employment Rights Act 2025, section 24, contractual duties of confidentiality relating to harassment and discrimination: https://www.legislation.gov.uk/ukpga/2025/36/section/24 — text of enacted provision; **commencement must be separately checked**.

## Companion tracks for future study
- **External consultancy and assurance:** procurement independence, declared conflicts, certification criteria, follow-up measures; do not assume certification is a concealment mechanism.
- **Knowledge management and automation:** approved processing purposes, documented model data flows, worker agreements, measured employment outcomes; do not assume all internal communications were used for AI training.
- **Retention and migration:** Slack and other platform settings, approved retention periods, holds and export controls; expiry or deletion alone does not prove deliberate destruction or unlawfulness. Slack documents variable retention by plan and administrator configuration: https://slack.com/help/articles/203457187-Customize-data-retention-in-Slack

## Acceptance criteria
- Clear provenance for every factual claim.
- Separate `verified_public_source`, `unverified_hypothesis`, `disputed` and `unresolved` research states.
- No automated inference of intent or misconduct from confidentiality, procurement or deletion practices alone.
- No solicitation or publication of confidential correspondence, personnel data, privileged legal advice or identifiable whistleblower details.
- Preserve original public-source wording, change history and legal effective dates.
- Require professional legal review before publishing case-specific allegations or advising disclosure in a particular case.

**Status: draft methodology only. No live data ingestion, confidential submissions, claims review or legal evaluation performed.**
