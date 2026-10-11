# Agency.ai — client portal

Minimal buildless HTML/CSS/JavaScript website. No Salesforce or Zapier subscription, paid AI executor, payment provider or SMS gateway is configured. Source files do not contain a personal contact email.

## Pages

Public: `about.html`, `how-it-works.html`, `pricing.html`, `faq.html`, `index.html` (50-service catalogue and copy-only enquiry), `privacy.html`, `terms.html`, `contact.html`, `login.html`.

Client entries: `dashboard.html`, `ventures.html`, `projects.html`, `tasks.html`, `documents.html`, `requests.html`, `services.html`, `ai-features.html`, `reports.html`, `integrations.html`, `billing.html`, `activity.html`, `settings.html`, `help.html`.

Each client entry opens the shared `portal.html` with its selected view. Real account data is only fetched after password login, verified email and a verified mobile authenticator. The database and private storage enforce account ownership and MFA independently of page visibility. Static HTML files themselves are public if hosted publicly: they contain layout and descriptions, never private client records.

## Working features after backend activation

One account with multiple ventures; editable briefs and milestones; tasks and completion; service shortlists; project, request and integration-requirement records with editable statuses; private uploads and one-minute signed download links; reports derived from actual records; JSON export; change activity; password recovery; backup authenticator.

The preview is explicit, unauthenticated and tab-memory only. It resets on reload. Selecting a file records its filename without uploading bytes. No real client data should be entered into the preview.

AI insights, document processing, drafting, external integrations, agency-operator messaging, invoices and payments are **not connected**. Services and requests are planning records. Recording an integration requirement does not connect an account. Billing has no invented invoices or balances. No paid feature can be activated from the UI.

## Activation

1. Upload all files and folders to the intended owner-controlled repository/host.
2. Select an owner-controlled Supabase project and reviewed region. No project has been created by this package.
3. Apply `backend/001-client-workspaces.sql`, then `backend/002-client-pages.sql`, once in a new project. If the first migration already exists, apply only the second. These are setup migrations, not idempotent resets.
4. Configure email/password Auth, email confirmation, TOTP, 12-character minimum passwords, rate limits and verified production email delivery. Configure a verified factor-loss recovery support process.
5. Put only the project URL and publishable/anon key in `portal-config.js`. Never put service-role keys or private secrets in static source.
6. Set the exact deployed `portal.html` URL as Auth Site URL and permitted redirect URL. The entry pages redirect to this shared endpoint so the same tab uses the same session.
7. Test two separate real accounts and MFA levels using `backend/ACCEPTANCE.md` before inviting clients. Complete privacy/controller details, retention, data deletion and support arrangements. The supplied public policy pages clearly describe launch preparation; they are not finished legal policies.

## Hosting and desired address

This package does not register a domain, change repository visibility or buy a plan. A private repository named `AgentAi` is source storage, not proof that `ai-agency.github.io` has been created. That exact GitHub Pages address requires an account or organisation named `ai-agency` with a repository named `ai-agency.github.io`, subject to availability. Public GitHub Pages hosting is available on GitHub Free; hosting from private repositories depends on the GitHub plan. Keep client data out of Git regardless of repository visibility.

## Synchronisation

Successful saves are written to one backend and then reloaded. Refresh workspaces loads changes made elsewhere; it blocks when forms contain unfinished edits. There is no offline queue, background sync or collaborative conflict resolution. Concurrent edits to a single brief use last-write-wins. Each tab requires its own authenticated session. Avoid simultaneous editing of the same brief until version/conflict handling is added.

## Future AI execution

Use a server endpoint for jobs, credentials, ownership and MFA checks, approvals, usage caps and audit results. Paid capability activation must be server-controlled and conditional on an agreed scope and sufficient cleared client payment. Never trust a browser toggle as proof of funding. Keep AI optional so ordinary task, project and report operations do not require model calls.

## Checks

Run `node --check portal.js` and `node --test tests/*.test.mjs` from this directory. Local tests cover inputs, gates, navigation and draft protection; they do not prove the live database or email service is configured. See the real-account acceptance checklist.
