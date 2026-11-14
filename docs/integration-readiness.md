# Integration readiness — Manifold Grace

Date: 2026-11-14
Status: source-repository guardrails prepared; **no provider OAuth connection or GitHub secret is created by this file**.

## Existing and planned services

| Service | Purpose | Where authorization belongs | Current evidence |
| --- | --- | --- | --- |
| GitHub | Git source and Actions | GitHub App/OAuth permissions | Connected for repository file editing |
| Cloudflare | Pages, Access, existing AI-chat Worker | Cloudflare Dashboard / narrowly scoped GitHub Actions secret | Existing Worker workflow references `CLOUDFLARE_API_TOKEN`; existence/value unverified; site Access is unverified |
| TinyFish | Browser automation | Connected ChatGPT plugin + user's saved browser profile | ChatGPT plugin connected; Cloudflare sign-in not yet verified |
| Firecrawl | Public web content extraction | Firecrawl plugin OAuth, or provider encrypted token if standalone API use is deliberately chosen | Account onboarding screenshot supplied; ChatGPT connection unverified |
| Airtable | Optional structured registers | Airtable plugin OAuth; only if an actual export/sync is required, repo secret | Plugin connection unverified |
| Vercel | Optional *alternative* deployment | Vercel OAuth/project settings | No deployment need while choosing Cloudflare Pages |
| Notion / Todoist / Google Drive | Knowledge, tasks and working documents | Connected app permissions | Already available in ChatGPT; don't duplicate data by default |

## Least privilege and deployment gates

1. Keep private credentials out of static HTML, JavaScript, JSON, markdown, git commits and pull requests.
2. Prefer the first-party ChatGPT plugin connection for interactive Airtable, Firecrawl or TinyFish usage. **Connecting a ChatGPT plugin does not automatically authorize GitHub Actions**.
3. If programmatic GitHub Actions jobs become necessary, create individual encrypted Actions secrets with narrow service tokens; avoid passing a broad token through frontend build variables.
4. Treat every Pages `pages.dev` production and preview deployment as public until independently verified behind an effective Cloudflare Access policy. A `_headers` file is not authentication.
5. Do not turn off GitHub Pages or make the repository private until Cloudflare production **and preview** restrictions are verified and the new site is confirmed complete.
6. Protect *all* deployed files, direct deep links and secondary origins; audit Workers and existing GitHub Actions deployments separately.
7. Verify access and source visibility after migration; do not infer success from a deployment or OAuth confirmation.
8. Avoid automatically publishing scraped research material; require provenance, copyright checks and editorial review.

## Evidence of existing infrastructure

`.github/workflows/deploy-ai-chat.yml` already contains a manually dispatched Cloudflare Worker deployment using an encrypted Actions secret reference, not a completed Cloudflare Pages deployment. Do not overwrite it or assume a token exists.

## Checks for completion

- Cloudflare Pages Git integration deployment URL and status
- Cloudflare Access production and preview app policies
- Unauthenticated requests to deep HTML, PDF, CSS, JS, CSV, JSON and image paths blocked
- Authorized session can load the complete website
- Old `https://manifoldgrace.github.io/` no longer serves the old website
- Repository made private (if applicable and supported); older public copies separately assessed
- No API credentials committed to repository or sent through frontend requests

This document is **not a claim** that any third-party accounts, plugins or policies have been configured.
