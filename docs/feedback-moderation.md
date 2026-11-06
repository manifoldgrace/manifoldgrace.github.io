# Manifold Grace — Feedback moderation and publication

Updated: 2026-11-06

## How the current version works
- The Feedback page uses the **existing Formspree endpoint** already present on the Contact page.
- New feedback arrives privately with the source field `Manifold Grace public feedback moderation`.
- **Nothing is published automatically.** The browser displays only entries in `data/approved-feedback.json` whose `approved` and `publication_permission` fields are both `true`.
- The public site never displays email addresses or internal Formspree submissions.

## Fast moderation process (initial version)
1. Review the Formspree notification/inbox. Check the category, message, explicit public-display choice, name preference, and any personal data.
2. **Private-only feedback:** use it for internal review, but do not add it to the public register.
3. **Approved for public display:** edit `data/approved-feedback.json` in GitHub; append one JSON entry; commit. GitHub Pages will publish the approved entry after deployment.
4. **Declined:** do not add it. Never publish abusive material, private details, or unverifiable serious allegations about individuals.
5. **Correction/removal:** amend or remove the approved entry in the JSON file, then commit. Keep an internal record of why a change was made.

Example record (illustrative only — never publish as a real review):

```json
{
  "approved": true,
  "publication_permission": true,
  "display_name": "Anonymous",
  "category": "Website experience",
  "message": "A genuine visitor comment goes here after approval.",
  "published_on": "2026-11-06"
}
```

Do not put the visitor's email, Formspree receipt, IP address, moderation notes or other private records in this public repository. Use the genuine approval date and avoid altering the meaning of submissions; obtain contributor permission before substantive edits.

## Before merging the review branch
- Preview `feedback.html` in the branch using a local server or GitHub Pages preview if available.
- Check page and footer navigation, keyboard accessibility, mobile layout, validation and non-JavaScript form fallback.
- Submit a **clearly labelled test** with private-only publication selected, confirm Formspree delivery and verify it does **not** appear publicly.
- Test an approved **synthetic, clearly labelled** register entry only on a branch/preview; remove it before merging.
- Confirm the existing contact form still works.

## Next enhancement: one-tap moderation
For an actual **Approve / Decline / Request changes** private dashboard, provision authenticated storage and a secure server-side approval workflow (e.g. a database with authenticated admin roles and Row-Level Security, plus server-side publishing to a public read-only feed). Never put GitHub tokens, Formspree credentials or admin secrets in client-side JavaScript. This is a separate integration, not enabled by the current static GitHub Pages release.
