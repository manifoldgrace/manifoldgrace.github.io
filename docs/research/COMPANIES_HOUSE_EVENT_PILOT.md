# Companies House event validation — synthetic pilot
**Manifold Grace | 2026-11-06 | Tested offline, not deployed**

## Results
A Python structural preflight processed five fabricated Companies House-style events: **four structurally accepted** and **one flagged for review**. Five internal test assertions passed; the accompanying Turtle shape parsed successfully to 62 RDF triples with rdflib. This is **not** an executed SHACL-engine conformance test or a live API connection. The downloadable script and synthetic fixtures were provided in the conversation, not installed as a live website component.

## Implemented artifacts
- [SHACL candidate shapes](../../schemas/companies-house-stream.shacl.ttl) for company-profile event envelopes and changed company profiles.
- Local Python preflight with fabricated names, numbers, event timestamps, deletion event, one missing registration number and missing optional jurisdiction.
- Synthetic output and tests were packaged for downloading in the originating chat.

## Critical technical distinctions
- Actual Companies House stream events include `event.fields_changed`, `event.published_at`, `event.timepoint`, `event.type`, `resource_id`, `resource_kind`, `resource_uri` and optionally `data`. Do not model only an `event_id`.
- The documented stream is a **long-running line-delimited HTTP response**; it must not be presumed to be standard browser SSE frame syntax.
- Companies House advises using **snapshots plus subsequent stream events**, durable timepoint checkpointing, controlled reconnection and rate-limit handling.
- No automatic legal-entity merges, founder attribution, limitation-period decisions or change-of-control conclusions.
- Missing country/jurisdiction information creates a review flag, not automatic invalidation of an otherwise conforming event.
- A `deleted` event may lack the profile `data`; it is not evidence of intentional historical concealment.
- All incoming evidence remains `NOT_AUDITED / UNVERIFIED_SOURCE_TEXT` pending separate source review.
- Passing SHACL structural checks is not cryptographic verification or factual/forensic validation.
- Any production API key belongs on a secured backend and must never be embedded in public GitHub Pages.

## Source documentation
- [Companies House streaming overview](https://developer-specs.company-information.service.gov.uk/streaming-api/guides/overview)
- [Company profile stream schema](https://developer-specs.company-information.service.gov.uk/streaming-api/resources/companyprofilestream)
- [W3C SHACL Recommendation](https://www.w3.org/TR/shacl/)

## Next tasks
Execute full SHACL validation using a compatible validator, add realistic event-to-RDF mapping, implement durable replay and event idempotency, and exercise all processing against a controlled synthetic dataset before any authenticated live integration.
