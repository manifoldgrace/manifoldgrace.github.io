# Manifold Grace — secure hosting migration (not yet activated)

Status: configuration preparation only. This branch is NOT the active website.

## Security objective

Keep the site inaccessible to anonymous visitors, including direct HTML pages,
CSV, JSON, PDF, images and preview deployments. Preserve all existing content,
research, designs and source history. No browser-side password check is security.

## Hosting

Cloudflare Pages project: `manifold-grace-private` (proposed; availability unverified)
Git repository: `manifoldgrace/manifoldgrace.github.io`
Production branch: `main` after migration approval and testing
Static website: no build command; source/output directory root (`.`), subject
to an asset audit before deployment. Do not deploy secret files or backups.

## Required Cloudflare dashboard configuration

1. Connect the GitHub repository to Cloudflare Pages.
2. Configure the production build: no build command, output directory `.`.
3. Enable Cloudflare Access on BOTH:
   - production `<project>.pages.dev` hostname (exact hostname)
   - wildcard preview `*.<project>.pages.dev` hostnames
4. Create an Access Allow policy restricted to verified authorised email identities.
   Do not include Everyone or broad email-domain policies.
5. Select an identity provider (email one-time PIN or suitable configured identity provider).
   Cloudflare Access uses real provider authentication; do not store passwords in HTML.
6. Configure reasonable session expiration and verify logout/re-login.
7. Test anonymous and permitted sessions on homepage, a deep HTML URL,
   and directly linked PDF, CSV, JSON and image resources, including preview URLs.
8. Audit search engine indexing, caches, past archive copies and any other external
   mirrors. Access cannot retroactively erase previously published content.
9. Only when the new site is demonstrably secured and content-complete:
   disable the original GitHub Pages deployment, make the source repository private
   if supported, and recheck that old public URLs and repository contents are
   no longer independently accessible.
10. Review GitHub Actions, other hosting origins and public copies for bypasses.

## Important limits

- The existing `manifoldgrace.github.io` hostname cannot be protected by a
  Cloudflare Access policy while it continues to serve via GitHub Pages.
- A login visual alone does not protect files or direct URLs.
- The Cloudflare dashboard, account identity, email allowlist and policy changes
  are NOT configured by this repository file.
- Initial Cloudflare Pages deployments may be public before Access is enabled.
  Do not upload confidential material or circulate a preview URL during setup.
- Do not commit email addresses, tokens, passwords or recovery codes.

## Design reference

On the secured site, use a minimal monochrome access journey. The login entry
may be provided by Cloudflare Access; matching an exact custom password form
requires a separate, securely designed authentication layer.

## Verification evidence required before marking complete

- Cloudflare Pages project and deployment URL
- screenshot/config evidence of production and preview Access applications/policies
- unauthenticated 403 or login redirect for direct HTML and asset URLs
- successful authorised session
- original GitHub Pages no longer serving the website
- source repository visibility rechecked
