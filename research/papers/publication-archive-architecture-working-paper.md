# Working paper initiative A — A provenance-preserving publication archive generator
**Manifold Grace research manuscript, initiated 13 November 2026. Status: design and implementation documentation; not peer reviewed, accepted, or published in a scholarly venue.**

## Research problem
Websites can publish extensive daily material without offering a durable, accessible, period-based catalogue. Researchers must distinguish missing sources, missing catalogues, changed URLs and actual publication omissions.

## Research question
Can a versioned, source-linked publication index with daily, weekly, monthly and annual downloadable bundles improve discoverability, longitudinal comparison and evidentiary continuity compared with scrolling archive pages?

## Architectural contribution
The implemented educational reference uses a public dated HTML log as owned source data, extracts only visible record titles and links, preserves its recorded dates, deduplicates rows, generates structured JSON and CSV, and generates period PDF indexes. A GitHub Actions pipeline can regenerate outputs and preserve changes as commits. The independent HTML browser permits searching without requiring PDF extraction.

## Source and code provenance
This generator was authored for this project, **not cloned from another repository**. Its upstream dependencies are Python 3 (Python Software Foundation), Beautiful Soup 4 (Leonard Richardson; package version pinned in CI) for HTML parsing, ReportLab 4 (ReportLab and contributors; BSD licensed) for PDF construction, and GitHub Actions for controlled CI execution. The source generator is [scripts/build_publication_archive.py](../../scripts/build_publication_archive.py). Code reuse is subject to the accompanying project-specific source licence and dependency terms.

Related standards and sources:
- UK Intellectual Property Office, *Exceptions to copyright* (original publication **12 June 2014**, updated **4 January 2021**): https://www.gov.uk/guidance/exceptions-to-copyright
- W3C, *WCAG 2.2 Recommendation* (**5 October 2023**, subsequently updated **12 December 2024**): https://www.w3.org/TR/wcag/
- NISO, *JATS 1.4* (**31 October 2024**): https://www.niso.org/publications/z3996-2024-jats
- Crossref, REST metadata API (living documentation; no original publication date claimed): https://www.crossref.org/documentation/retrieve-metadata/rest-api/
- Library of Congress, Chronicling America API migration (**2025** service change): https://www.loc.gov/apis/additional-apis/chronicling-america-api/

## Proposed evaluation, not completed results
Compare baseline manual navigation with the archive interface in measured time-to-source, provenance accuracy, accessibility task success, search recall and record completeness. Compare PDF and HTML/JSON task completion, incorporating assistive-technology users with consent. Run reproducible source-change and regression tests. Report missed entries, false duplicates, date mismatches and inaccessible outputs. Independent sample audits are required before claiming archive completeness.

## Current implementation limitation
The initial demonstration indexes **dated public productivity-log entries**, not all news stories and not external article bodies. Their log dates must not be relabelled as original publication dates of external sources. PDF/UA conformance and successful CI deployment require separate verification.

## Next research extensions
Documented publisher adapters under explicit licence or permission; original-publication versus revised-date records; DOI and persistent identifier resolution; corpus deduplication by content provenance; signed build artefacts; accessibility audit; scalable full-text archive only when rights permit; machine learning evaluation based on lawful, independently validated datasets.

## Correction and attribution policy
Keep an immutable source commit, preserve the versioned research question and error log, avoid private personal data, and correct prior interpretations visibly rather than silently replacing them.
## Dated source register and evidentiary roles — added 13 November 2026

The following references provide authoritative foundations; they are not presented as experimental proof of this initiative:

| Original publication or status | Source URL | Relevance |
|---|---|---|
| 12 June 2014 | https://www.gov.uk/guidance/exceptions-to-copyright | UK lawful-access and non-commercial text/data-mining scope; article redistribution not automatically authorised |
| 5 October 2023; revised 12 December 2024 | https://www.w3.org/standards/history/WCAG22/ | Web accessibility and accurate standard-version history |
| 31 October 2024 | https://www.niso.org/publications/z3996-2024-jats | JATS XML scholarly-archive interchange standard |
| 3 February 2022 | https://csrc.nist.gov/pubs/sp/800/218/final | Secure software development and auditable CI/CD practice |
| 26 January 2023 | https://www.nist.gov/itl/ai-risk-management-framework | AI risk evaluation and governance |
| 24 July 2024 | https://doi.org/10.1038/s41586-024-07566-y | Peer-reviewed recursive-training model collapse; not ASI failure prediction |
| 2025 collection API transition | https://www.loc.gov/apis/additional-apis/chronicling-america-api/ | Multi-decade digitised newspaper archive implementation |
| Living documentation | https://www.crossref.org/documentation/retrieve-metadata/rest-api/ | Scholarly metadata and subsequent updates |
| Living documentation | https://docs.github.com/en/actions | CI pipeline implementation, not proof of success without logs |
| Living documentation | https://docs.reportlab.com/developerfaqs/ | PDF-generation dependency |
| Living documentation | https://www.crummy.com/software/BeautifulSoup/ | HTML parsing dependency |

**Chronology correction:** WCAG 2.2 first became a Recommendation on **5 October 2023**; **12 December 2024** is a subsequent Recommendation update, not the first release. Any earlier wording stating otherwise should be read with this correction. Maintain the original publication date and any amendments separately.
