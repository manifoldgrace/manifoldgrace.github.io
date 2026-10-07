# Manifold Grace media backend

This folder contains the reference backend for secure owner uploads used across Manifold Grace.

## Collections

The Worker supports allow-listed collections:

- `live-sessions` — video, maximum 5 minutes
- `public-speaking` — video or image
- `faith` — video or image
- `photos` — image only, maximum 3 published images per named slot
- `venture` — image only, maximum 3 published images per named slot
- `creative` — video or image

## Architecture

GitHub Pages remains static and contains no API secret.

1. The owner selects media in a page form.
2. The browser requests a signed upload from the Worker using the private `UPLOAD_KEY`.
3. The Worker validates the collection, media type and claimed file size, then signs a Cloudinary upload without exposing `CLOUDINARY_API_SECRET`.
4. The browser uploads directly to Cloudinary over HTTPS into that collection's `pending` folder.
5. The browser sends the resulting public ID to `/api/validate`.
6. The Worker reads authoritative provider metadata and validates media type, format, byte size and (for video) duration.
7. Portfolio slot limits are checked server-side where configured.
8. Valid media is moved to `published`; invalid media is removed.
9. `GET /api/media` returns sanitised published metadata only.

The legacy `GET /api/clips` route remains for the Live Sessions page.

## Security properties

- Cloudinary API secret and private upload key are never committed to GitHub.
- The page does not store the private upload key in localStorage or sessionStorage.
- Only allow-listed collections and media types can be signed.
- Server-side validation is authoritative.
- Unvalidated uploads do not appear in public galleries.
- Invalid media is deleted.
- Public output is JSON and frontend captions are inserted with DOM text nodes rather than arbitrary HTML.
- Browser-origin checks restrict normal site traffic to Manifold Grace; authentication is still required for writes.
- Media playback is opt-in and does not autoplay.

## Required Worker configuration

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` as a secret
- `UPLOAD_KEY` as a long random secret
- `ALLOWED_ORIGIN=https://manifoldgrace.github.io`
- optional `MEDIA_FOLDER=manifold-grace`
- optional `MAX_VIDEO_BYTES=536870912`
- optional `MAX_IMAGE_BYTES=26214400`

Never put `UPLOAD_KEY` or `CLOUDINARY_API_SECRET` in `media-config.js`.

## Deployment

1. Create the Cloudinary project.
2. Deploy `worker.js` to a Cloudflare Worker.
3. Add the variables and secrets above in Worker settings.
4. Test `GET /api/health`.
5. Put the Worker HTTPS URL into `media-config.js` as `apiBase`.
6. Test first with expendable media before using originals.

Until `apiBase` is configured, the public pages remain readable and upload forms fail safely rather than exposing credentials or pretending an upload succeeded.
