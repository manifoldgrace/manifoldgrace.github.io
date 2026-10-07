# Manifold Grace media backend

This folder is a reference backend for the **Live Sessions & Debates** page.

## Architecture

The public site stays on GitHub Pages. GitHub Pages is static and should **not** contain API secrets or an upload token.

The upload flow is therefore split:

1. The owner selects one video in `live-sessions.html`.
2. The browser requests a signed upload from this Worker.
3. The Worker checks the private `UPLOAD_KEY` and signs a Cloudinary upload without exposing `CLOUDINARY_API_SECRET`.
4. The browser sends the video **directly to Cloudinary over HTTPS** into a private-to-the-site `pending` folder.
5. The browser sends the resulting `public_id` back to `/api/validate`.
6. The Worker fetches authoritative media metadata and rejects/deletes files that are longer than 300 seconds, too large, or in a disallowed format.
7. A valid clip is moved from `pending` to the `published` folder. Only that folder is exposed by `GET /api/clips`, so an interrupted validation request cannot accidentally publish an unchecked upload.
8. `GET /api/clips` returns a sanitised public list for the website.

## Security properties

- No Cloudinary API secret is committed to GitHub.
- The private upload key is a Worker secret, not JavaScript source.
- The page does not store the upload key in localStorage or sessionStorage.
- Uploads are signed server-side and sent directly to the media provider.
- Origin checks restrict normal browser calls to the configured Manifold Grace origin.
- Authentication is still required even if an attacker spoofs an Origin header.
- Metadata is sanitised before signing and before returning to the public page.
- The signing endpoint also checks the browser-reported file size to prevent accidental oversized uploads before transfer; server-side metadata remains authoritative.
- Server-side checks are authoritative for duration, byte size, media type and format.
- Unvalidated uploads never appear in the public feed.
- Invalid uploads are deleted.
- Public output is JSON only and the frontend inserts text with `textContent`, reducing XSS risk.
- Playback is opt-in: no autoplay.

## Required secrets / variables

Configure the Worker with:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` **as a secret**
- `UPLOAD_KEY` **as a long random secret**
- `ALLOWED_ORIGIN=https://manifoldgrace.github.io`
- optional `MEDIA_FOLDER=manifold-grace/live-sessions`
- optional `MAX_VIDEO_BYTES=536870912`

Never place `UPLOAD_KEY` or `CLOUDINARY_API_SECRET` in `media-config.js`.

## Deployment outline

1. Create a Cloudinary account/project and obtain its cloud name and API credentials.
2. Create a Cloudflare Worker and deploy `worker.js`.
3. Add the variables/secrets above in Worker settings (or with Wrangler).
4. Test `GET /api/health`.
5. Put the Worker HTTPS URL in `media-config.js` as `apiBase`.
6. Redeploy GitHub Pages.
7. Test with a short expendable clip before using original material.

The page is intentionally non-destructive while `apiBase` is blank: visitors can view the prepared interface, but no upload can occur until a secure backend is explicitly connected.
