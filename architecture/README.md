# Modular Platform Architecture — Working Register (14 November 2026)

This is a non-destructive structural extension to [Projects & Architecture](../projects.html), [AI Implementation Roadmap](../ai-systems-implementation-roadmap.html), and existing research pages. It does not replace their content.

## Files
- `project-registry.json`: selected project identities, existing page pointers, proposed connections and shared capability gaps.
- `../platform-architecture.html`: accessible public architecture map.

## Meaning of status
A linked website page proves that a project is documented, **not** that code, trained models, integrations, APIs, services or deployments work. Every proposed connection remains unverified until its implementation is inspected and tested.

## Stable design contracts
Each component should eventually declare: stable ID, purpose, input and output schema, ownership, source provenance, intended users, licence, authentication and authorisation, privacy boundaries, version, test results, supported interfaces, dependencies, deployment status, and failure/remedy protocol.

Use stable IDs regardless of a future brand change. Keep conceptual relationships separate from runtime API dependencies. Prefer reusing existing components before building new ones.

## Initial integration candidate
Research Discovery (MG-001) → Evidence Verification (MG-002) → Continuous AI Assurance (MG-003) → Public Demonstration (MG-004). This sequence is a **proposed** first integration, not a completed one.

## Next verification gates
1. Inspect source files per project, not merely website description.
2. Classify each as concept, static demonstration, executable prototype, tested service, or deployed service.
3. Assign interface specifications for the first candidate chain.
4. Add contract tests, accessibility, security, privacy and negative-case evaluation.
5. Record GitHub commit and public deployment verification separately.

## Public-record policy
Exclude personal records, living persons' details, confidential cases, unpublished sensitive data and API secrets. The public architecture is an illustrative technical register.
