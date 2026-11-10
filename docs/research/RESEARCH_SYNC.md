# Research publication synchronisation
Updated: 10 November 2026
## Data flow
- [Connected Research Library](../../connected-research.html) reads `assets/research/connected-publications.json`.
- Five existing public Zenodo DOIs are explicitly allowlisted. The weekly workflow refreshes their titles and dates from Zenodo REST API. It does **not** discover and publish additional outputs automatically.
- The workflow attempts a read of public ORCID work summaries. It does not expose private ORCID fields or automatically add works.
- Google Docs integration via ChatGPT is available separately for drafting and review. There is **no direct Google Docs-to-website publish job**.
- `approved-google-docs.json` must remain empty until individual documents and versions are cleared for release. No automatic sharing-permission changes.
- A preprint must be deposited explicitly by the author. Website links are not preprint publication or peer review.
## Authorisation before including a new document
Verify the author's permission, public-disclosure approval, copyright/licence, sensitive personal data, source version and appropriate status. Export an approved snapshot; preserve source editing permissions privately; commit only the approved snapshot and metadata. Do not publish an editor URL or grant public write access.
## Sync tests
Run `python scripts/sync_public_research.py`. Verify canonical DOI matching; check the workflow execution log; review changes before adding further identifiers.
## Sources
- https://developers.zenodo.org/
- https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-data-on-a-record/
