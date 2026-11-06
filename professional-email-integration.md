# Manifold Grace — professional email integration and recovery checklist

Status: **staged, not activated**. Updated 2026-11-06.

## Confirmed audit
- Current public site: https://manifoldgrace.github.io/
- GitHub Pages repository does not yet have a `CNAME` custom-domain file.
- No domain was shown as assigned or unassigned in the connected Wix account.
- Gmail searches did not locate purchase/renewal correspondence for `manifoldgrace.org`, `manifoldgrace.com` or `manifoldgrace.co.uk`.
- Wix availability check: `manifoldgrace.org` and `manifoldgrace.co.uk` available at time of check; `manifoldgrace.com` registered to an unverified party.
- This audit does **not** establish that no domain is owned elsewhere.

## Target configuration (pending confirmed ownership and user-approved checkout)
- Preferred professional domain: `manifoldgrace.org` (do not publish ownership or addresses before activation).
- Proposed public recipient aliases: `hello@manifoldgrace.org` and `research@manifoldgrace.org`.
- Inbound: domain email forwarding to a privately held existing Gmail inbox (do not publish or store the destination address in this public repository).
- Optional later: outbound delivery via a verified mailbox/SMTP provider authorised for the domain, configured with SPF, DKIM and DMARC according to the provider's actual instructions.
- Website: configure the GitHub Pages custom domain *only after DNS control is confirmed*; make changes in repository settings and DNS consistently. Maintain GitHub Pages URL until the custom domain is tested.
- Public contact: add contact addresses and navigation only once a send/receive test succeeds.

## Recovery strategy
1. Keep the original Gmail account active: forwarding does not move or erase historical mail.
2. Incoming forwarded branded email should arrive in Gmail; apply a filter that labels incoming mail as **Manifold Grace / Professional Mail** after forwarding is active. Label was created 2026-11-06; filter not yet created.
3. For independent Gmail backup, use Google's data-export facility (Takeout) and select Mail (MBOX), save the resulting archive securely, check the files and keep a separate encrypted copy. Export is a separate user-authorised operation and has **not** been initiated.
4. Forwarded mail needs to be tested from an unrelated sender and checked for spam handling, complete message headers and reply behaviour.
5. Record registrar account recovery methods, renewals, mail-provider recovery credentials, DNS records, and a second trusted recovery method **privately**, never in this repository.
6. Never replace the functioning inbound MX route until the replacement has been tested; maintain an emergency contact route if possible.

## Pending external dependencies
- Confirm ownership or purchase of a domain through a registrar. No purchase has been made.
- Access to domain DNS management.
- Choose a routing/mailbox provider and activate domain verification.
- Provider-issued DNS instructions and Gmail filter configuration.
- Verify receiving, replying, retention, backup, and restore.
- Do not publish inactive `@manifoldgrace.org` addresses or point GitHub Pages at an unowned domain.

## Privacy and limits
Gmail is the intended receiving and recovery inbox, not a public address. Forwarding is not an independent archival backup and does not restore messages already deleted or purged from Gmail. Keep public source files free of email credentials, tokens, account details, address-verification codes and private messages.
