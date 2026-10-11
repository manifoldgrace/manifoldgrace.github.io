# Manifold Grace media API

The live website uses https://manifold-grace-media-api.arcaneeft64.chatgpt.site.
The API runs as a Sites Worker with provisioned R2 storage. GitHub Pages remains the frontend.

## Owner uploads

1. Open the upload panel and select your file.
2. Use **Get my upload key** to open `/owner`; sign in with the website owner's ChatGPT account.
3. Copy the key into the upload form. It is not stored in browser storage or source control.
4. Submit. The browser prepares a public derivative, uploads it in 8 MiB parts, and requests validation.
5. Only validated media is listed or publicly served. Failed uploads are removed.

The runtime contains secret `UPLOAD_KEY` and `OWNER_EMAIL` settings; never put either in frontend configuration.
Owner access is checked using the platform-authenticated email header. Public API writes require the private key.

## Supported files and limits

- Images are decoded and re-encoded as PNG to remove source metadata. Maximum prepared image: 25 MiB and 40 megapixels. Originals remain on the owner's device.
- Videos: MP4, MOV and M4V; maximum 512 MiB and five minutes. The browser removes descriptive/location metadata boxes and creation/modification timestamps while preserving sample offsets. The server verifies the resulting container, byte count and duration. Videos containing non-audio/video tracks require a standard MP4/MOV export.
- No transcoding service is used. Playback depends on the codecs supported by the visitor's browser. WebM/OGV require export to MP4/MOV.
- Public filenames contain no original filename. Public captions are the owner-submitted title/context.
- The owner must check visible content before publication.

## Routes

- `GET /api/health` — configuration/storage status
- `GET /api/media?collection=...&slot=...&type=...` — published gallery
- `GET /api/clips` — live-sessions compatibility route
- `POST /api/check` — validate owner key
- `POST /api/uploads` — begin an upload
- `PUT /api/uploads/:id/parts/:number` — upload an exact-size part
- `POST /api/uploads/:id/complete` — assemble and validate before publication
- `DELETE /api/uploads/:id` — abort and clean up
- `GET|HEAD /media/:collection/:id` — published media; supports byte ranges
- `DELETE /media/:collection/:id` — owner removal
- `GET /owner` — authenticated owner key retrieval

Collection allowlist: live-sessions, public-speaking, faith, photos, venture, creative.
Photos and venture slots support at most three images each.

## Source and deployment

`worker.js` is a readable mirror of the deployed service. Its canonical source and hosting manifest are in the Sites project's source repository. Runtime storage bindings and secrets are provisioned there; the former Cloudinary reference integration is no longer used.
Frontend `media-config.js` contains only the public URL. `media-upload-client.js` supplies the shared upload flow and `media-file-tools.js` prepares public derivatives.
