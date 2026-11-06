# Master Evidence Matrix — Draft v0.1

**Created:** 2026-11-06  
**Project:** Manifold Grace  
**Research window:** 2007–2027 (2027 future/prospective)  
**Status:** research framework, not an exhaustive audit or deployed platform.

## Seven interoperability pillars

1. Persistent, traceable source identifiers and provenance.
2. Cross-claim contradiction detection.
3. Historical as-of-date and version-aware retrieval.
4. Verified correction history and lawful downstream notification.
5. Explicit evidence-gap and uncertainty disclosure.
6. Independent evaluation and reproducible tests.
7. Safeguards against cross-institutional harms, with privacy, human review and accessible redress.

## Source-led examples

| Record | Claim supported by source | Source | Evidence class | Limitation |
|---|---|---|---|---|
| MG-SF-2022 | Salesforce reported cumulative pay adjustments exceeding US$22m by 2022 | [Salesforce 2022 report](https://www.salesforce.com/uk/news/stories/2022-equal-pay-update-the-salesforce-approach-to-pay-fairness/) | Corporate declaration | Not independently audited payroll data |
| MG-AD-2018 | Adobe reported global gender pay parity and adjustments involving fewer than 5% of employees and under 0.2% of payroll | [Adobe statement](https://blog.adobe.com/en/publish/2018/10/22/global-pay-parity-how-we-got-there) | Corporate declaration | Specific pay-comparison scope; not overall wage-gap elimination |
| MG-UK-GPG-2017 | Relevant gender pay-gap reporting regulations were made in 2017 | [2017 SI](https://www.legislation.gov.uk/uksi/2017/172/contents/made) | Original legislation | Scope, commencement and later amendments matter |
| MG-UK-PTC-2023 | Predictable Terms Act was enacted in 2023 | [2023 Act](https://www.legislation.gov.uk/ukpga/2023/46/enacted) | Original legislation | Enactment is not commencement; verify repeal separately |
| MG-UK-CARER-2023 | Carer's Leave Act was enacted in 2023 | [2023 Act](https://www.legislation.gov.uk/ukpga/2023/18/contents/enacted) | Original legislation | Operative entitlements depend on implementing rules |

Amounts described as “more than” or “under” must remain inequalities rather than being stored as exact measurements.

## Open questions, NOT established findings

- Whether corporate DEI and AI initiatives were deliberately coordinated for a shared undisclosed purpose.
- Whether particular institutions illegally destroyed records or discriminated against specific employees.
- Whether named London technology employers employed majority-minority engineering teams in 2007–2018.
- Whether specific population groups were recruited to build technological infrastructure and then intentionally excluded.

Do not turn those investigative leads into factual findings without direct evidence.

## Record design

Evidence entries capture a narrowly defined claim, source URL, source type, historical event date, source publication date, retrieval time, issuing body, jurisdiction, methodological limitations, review status, corrections and access restrictions. A hash verifies integrity of an identified copy, not its authenticity, lawful provenance or immutability.

No general public ingestion of payroll, medical, immigration or whistleblower documents is enabled. Confidential evidence requires independently assessed secure handling.

See [verification rules](verification-rules.md) and [JSON Schema](../../schemas/evidence-record.schema.json).
