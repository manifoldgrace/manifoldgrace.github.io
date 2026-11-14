# AI Assurance Studio — product scaffold v0.1 (14 November 2026)

## Current status
Working **public product page and QA catalogue**. Account form is intentionally disabled until secure identity infrastructure is configured. No model evaluation service, user analytics, paid plans or production guarantees exist yet. No false claims of certification.

## Existing research links
- [Continuous AI Architecture Assurance](../continuous-agent-ai-assurance.html)
- [Modular Platform Architecture](../platform-architecture.html)
- Global AI QA Dossier Working v0.1: 15 pilot cards (T01–T15).
- AI QA Part Two Advanced Assurance v0.2: 12 advanced cards (P2-T16–P2-T27).
- `qa-tests.json` contains titles and source mapping, **not** executable cases.

## Activate account registration (administrator tasks)
1. Create an approved hosted Supabase project (or substitute an independently secured identity provider). This is a future operational decision; **no backend has been provisioned by this repository change**.
2. Enable email confirmation, enforce strong passwords, configure email sending, allowed redirect URLs, MFA where appropriate, abuse controls, rate limits and bot prevention.
3. Apply `schema.sql` and confirm RLS policies are enabled. Test with two test accounts: neither can read, insert under, alter, or delete the other's records.
4. Create a **public** `auth-config.js` file matching `auth-config.example.js`, using ONLY the client-facing URL and publishable/anon key. Never include service-role keys, API secrets or private user data.
5. Add a script tag for `auth-config.js` to `index.html` in this directory **before** `studio.js` loads. The public configuration file remains safe only if RLS is correctly deployed and tested.
6. Verify signup and verification emails, sign-in, sign-out, session refresh, restricted project creation, deletion and recovery on the deployed origin.
7. Add complete privacy notice, retention and deletion workflow, data-subject access procedures, support, accessibility review and security monitoring before public invitations.

## Product roadmap
- M0: Public-facing product, QA catalogue, source lineage and deployment-safe sign-up gateway (this commit).
- M1: Verified user registration, project CRUD and account lifecycle.
- M2: QA test cards become executable independent case definitions with expected behaviour, grading rubrics and blind review.
- M3: Controlled model endpoint adapters, evidence/consent and model version registry.
- M4: Reproducible evaluation runner; immutable run receipts; human review and critical-failure gates.
- M5: Reports, exports, audit trail, API contracts, incident correction and integration with other modular projects.

No M1–M5 milestone should be represented as completed until demonstrated and tested.

## Privacy and security
The product page is static GitHub Pages hosting. Browser-only password forms are never a secure login system without a remote identity provider. Do not save personal data in localStorage. Do not upload sensitive evaluation material to public GitHub. Avoid publishing unsupported claims about third-party models. Verify GitHub commits separately from live deployment.
