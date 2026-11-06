# Synthetic entity-resolution pilot — execution report (2026-11-06)

**Status: TESTED LOCALLY — synthetic-only; not a deployed service or a corporate audit.**

The self-contained Python pilot generated **10,000 fabricated candidate observations** corresponding to **2,500 fabricated legal-entity identifiers** (four observations per identifier). It generated **10,000 candidate-to-entity edges**, exported tabular node and edge data plus schema.org JSON-LD, and passed **five internal invariant checks**. None of the 2,500 entities or relationships constitutes a verified real-world fact.

The code and test outputs were provided to the user as a downloadable ZIP in the conversation; they were **not** uploaded to this GitHub repository by this report. The matching procedure used deliberately pre-labelled synthetic jurisdiction, registry and registration-number keys, not Zingg or trained entity-resolution models.

The original pasted prototype was **not executed unmodified** because it (1) deduplicated people based on names alone, (2) applied a blanket six-year Limitation Act 1980 classification without determining the relevant cause of action, and (3) labelled a fabricated source string as cryptographically verified. Those approaches are not adequate for factual, legal or forensic conclusions.

## Pending

- Independently validate graph serialization against relevant KGX/Biolink shapes and documented semantics.
- Develop synthetic fixtures covering mergers, demergers, name changes, similarly named **different** companies and cross-border distinctions.
- Compare matching precision/recall with labelled test data before using any machine-learning-assisted link proposals.
- Verify official sources and jurisdiction-specific legal status separately from structural graph checks.
- Treat all evidence and identities as unverified unless reviewed by supported source-based methods.
- Keep private employee records, personal correspondence and restricted documents off public GitHub Pages.

This report is additive and does not alter existing candidate or audit records.
