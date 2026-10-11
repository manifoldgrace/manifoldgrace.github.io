# Live acceptance checks

Complete these after migrations and provider configuration. Never run checks against production client records.

- Register accounts A and B; verify emails; reject invalid/expired verification and recovery links.
- Password-only AAL1 must fail reads, writes and uploads on every private table and bucket.
- Verify TOTP; AAL2 A can create ventures, tasks, projects, requests and integration requirements.
- AAL2 B must not read, change, delete or upload into A's records or business UUID paths, including guessed IDs.
- Object downloads require authorised ownership; public bucket/object URLs must not work. Confirm signed links expire.
- Reject oversized uploads, unsupported MIME types and object overwrite. Verify an upload metadata failure cleans up the new object.
- Account A cannot change record identity/business, business owner or task identity. Clients cannot edit activity directly.
- Check each client URL when signed out: no account data is loaded before login and MFA. Preview is labelled and contains sample data only.
- Sign out and confirm private records, document links and unfinished forms disappear. Reload preview and confirm sample changes reset.
- Verify password reset, MFA on recovery, backup authenticator and documented factor-loss recovery.
- Confirm A's two ventures stay separate. Save, sign out, sign in and reload the same records. Refresh on another signed-in device.
- Confirm refresh/switching blocks unsaved brief, shortlist, task, project, request, integration and file selection drafts.
- Verify all reports match saved data and exports exclude passwords, MFA keys, session tokens and document object paths.
- Verify AI/billing/integration pages do not invoke paid APIs or collect payment.
- Finish business contact, privacy terms, deletion support and retention before accepting real clients.
