# Entity resolution and advanced research vectors — pilot v0.1

**Manifold Grace | 2026-11-06 | Research design, not an operational pipeline**

## Implemented document
- [Zingg-style company matching field definitions](../../schemas/zingg-company-entity-matching.v0.1.json). These fields are a **design and field-mapping example**, **not a runnable Zingg job**. Official Zingg matching types include `EXACT`, `FUZZY` and `DONT_USE`; see [Zingg documentation](https://github.com/zinggAI/zingg/blob/main/docs/stepbystep/configuration/field-definitions.md).
- Matching is performed **only on public legal-entity candidates** in the proposed pilot. Do not build a global human identity registry or infer identity from names alone.
- The existing 300 rows are **candidate research entries**, not 300 audited legal persons. Products, corporate groups, public bodies and distinct legal entities must remain separate categories.

## Candidate workflow
1. Import verified **public** company names, official registry numbers, jurisdictions and historic aliases, with date and source.
2. Stage rows before matching; retain untouched original values and source identifiers.
3. Require explicit reference labelling of candidate pairs; record false positives, false negatives and uncertainty.
4. Generate *proposed* matching clusters, never automatic same-entity assertions.
5. Human reviewer verifies legal entity continuity against authoritative registration evidence.
6. Create separate, source-linked relationships for `renamed_from`, `subsidiary_of`, `acquired_by`, `merged_into`, `product_of` and `controlled_by` rather than misclassifying them as identity.
7. Use historical valid-from/valid-to dates and jurisdiction identifiers; preserve prior source assertions.
8. Publish only reviewed relationships; preserve unresolved conflicts and correction history.

## Five research tracks: evidence versus hypothesis

### 1. Predictive workforce analytics
Research questions: Which workforce analytics products describe retention or attrition predictions? What data and legal bases were used? Could scores influence consequential decisions? **No specific employer misconduct is inferred merely from software capability**. Do not collect employee-level private risk scores into a public repository.

### 2. Synthetic information feedback
Research questions: Does an alleged milestone trace to primary documents? Are web references circular? Does repeated AI-generated content create false corroboration? Investigate model-generated errors with controlled benchmarks. **Repetition is not independent verification**.

### 3. Historical entity resolution
Use Zingg candidate matching as a possible component, then independent authoritative validation of company identities. Distinguish shared owners, shared brands and similar names from the *same legal person*. See [Zingg](https://www.zingg.ai/product/open-source-entity-resolution).

### 4. Software inventories and VEX
Use CycloneDX SBOM for software-component relationships where legitimate evidence is available. [VEX](https://cyclonedx.org/capabilities/vex/) represents security vulnerability exploitability in context. It **does not** itself establish a hiring algorithm is discriminatory, nor establish historical deployment at an employer without installation/asset evidence.

### 5. Knowledge-graph exchange
[KGX](https://github.com/biolink/kgx) supports Biolink-associated graph serializations, including TSV and JSONL. Corporate law, jurisdictions and temporal events require a carefully defined domain mapping and validation rather than assuming automatic semantic compatibility. Evaluate format conversion and preservation of audit provenance with synthetic test graphs.

## Verification gates
- Structural validation: correctly typed fields and references.
- Identity gate: official source identifier, jurisdiction, historical status, human review.
- Historical gate: validity dates, recorded-at dates and as-of queries.
- Evidence gate: independently evaluated source support and contradictions.
- Publication gate: confidentiality and privacy review; avoid public upload of personal files.
- Output gate: the research question, methodology, data limitations and original citations accompany every report.

## Current operational status
**Documentation created only**. No Zingg training, private data ingestion, live stream integration, model scoring, automated founder matching, VEX application assessment, KGX conversion or scheduled releases were performed.

## Sequencing
1. Complete synthetic legal-entity test dataset.
2. Train/test candidate matching only on public or synthetic registry data.
3. Validate historical and legal identity relationships independently.
4. Test KGX graph exports, keeping unresolved claims separately.
5. Consider live integrations when back-end security, authentication, usage rights and measurable evaluation criteria exist.
