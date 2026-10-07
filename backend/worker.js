const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" };
const DEFAULT_FOLDER = "manifold-grace/live-sessions";
const DEFAULT_MAX_BYTES = 536870912;
const ALLOWED_FORMATS = new Set(["mp4", "webm", "mov", "m4v", "ogv"]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://manifoldgrace.github.io";
    const cors = {
      "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      if (origin && origin !== allowedOrigin) return new Response(null, { status: 403, headers: cors });
      return new Response(null, { status: 204, headers: cors });
    }

    if (origin && origin !== allowedOrigin) {
      return json({ error: "Origin not allowed." }, 403, cors);
    }

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({ ok: true, service: "manifold-media-api" }, 200, cors);
      }

      if (request.method === "GET" && url.pathname === "/api/clips") {
        const clips = await listClips(env);
        return json({ clips }, 200, { ...cors, "Cache-Control": "public, max-age=60" });
      }

      if (request.method === "POST" && url.pathname === "/api/sign") {
        requireOwner(request, env);
        const body = await safeJson(request);
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = env.MEDIA_FOLDER || DEFAULT_FOLDER;
        const context = makeContext(body);
        const uploadParams = {
          context,
          folder,
          timestamp,
          unique_filename: "true",
          use_filename: "true"
        };
        const signature = await cloudinarySignature(uploadParams, env.CLOUDINARY_API_SECRET);
        return json({
          apiKey: env.CLOUDINARY_API_KEY,
          cloudName: env.CLOUDINARY_CLOUD_NAME,
          signature,
          uploadParams
        }, 200, cors);
      }

      if (request.method === "POST" && url.pathname === "/api/validate") {
        requireOwner(request, env);
        const body = await safeJson(request);
        const publicId = String(body.publicId || "");
        const folder = env.MEDIA_FOLDER || DEFAULT_FOLDER;
        if (!publicId || !publicId.startsWith(folder + "/")) {
          throw httpError(400, "Invalid media identifier.");
        }

        const resource = await getResource(env, publicId);
        const maxBytes = Number(env.MAX_VIDEO_BYTES || DEFAULT_MAX_BYTES);
        const duration = Number(resource.duration || 0);
        const bytes = Number(resource.bytes || 0);
        const format = String(resource.format || "").toLowerCase();

        const valid =
          resource.resource_type === "video" &&
          duration > 0 &&
          duration <= 300 &&
          bytes > 0 &&
          bytes <= maxBytes &&
          ALLOWED_FORMATS.has(format);

        if (!valid) {
          await destroyResource(env, publicId);
          throw httpError(422, "The uploaded file failed server-side video validation and was removed.");
        }

        return json({ ok: true, clip: publicClip(resource) }, 200, cors);
      }

      return json({ error: "Not found." }, 404, cors);
    } catch (error) {
      const status = Number(error?.status || 500);
      const message = status >= 500 ? "Media service error." : String(error?.message || "Request failed.");
      return json({ error: message }, status, cors);
    }
  }
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function safeJson(request) {
  const type = request.headers.get("Content-Type") || "";
  if (!type.toLowerCase().includes("application/json")) throw httpError(415, "JSON required.");
  return await request.json().catch(() => { throw httpError(400, "Invalid JSON."); });
}

function constantTimeEqual(a, b) {
  a = String(a || "");
  b = String(b || "");
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

function requireOwner(request, env) {
  if (!env.UPLOAD_KEY) throw httpError(500, "Upload authentication is not configured.");
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!constantTimeEqual(token, env.UPLOAD_KEY)) throw httpError(401, "Upload authentication failed.");
}

function clean(value, max) {
  return String(value || "")
    .replace(/[|=\\\r\n]+/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function makeContext(body) {
  const fields = {
    title: clean(body.title, 120),
    topic: clean(body.topic, 80),
    recorded_date: clean(body.recordedDate, 20),
    description: clean(body.description, 500)
  };
  return Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => key + "=" + value)
    .join("|");
}

async function sha1Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function cloudinarySignature(params, secret) {
  if (!secret) throw httpError(500, "Cloudinary secret is not configured.");
  const canonical = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => key + "=" + String(value))
    .join("&");
  return sha1Hex(canonical + secret);
}

function basicAuth(env) {
  return "Basic " + btoa(env.CLOUDINARY_API_KEY + ":" + env.CLOUDINARY_API_SECRET);
}

async function cloudinaryAdmin(env, path) {
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/" + encodeURIComponent(env.CLOUDINARY_CLOUD_NAME) + path,
    { headers: { "Authorization": basicAuth(env), "Accept": "application/json" } }
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw httpError(502, "Media provider lookup failed.");
  return body;
}

async function getResource(env, publicId) {
  return cloudinaryAdmin(env, "/resources/video/upload/" + encodeURIComponent(publicId));
}

async function destroyResource(env, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const signature = await cloudinarySignature(params, env.CLOUDINARY_API_SECRET);
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: env.CLOUDINARY_API_KEY,
    signature
  });
  await fetch(
    "https://api.cloudinary.com/v1_1/" + encodeURIComponent(env.CLOUDINARY_CLOUD_NAME) + "/video/destroy",
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
  );
}

function publicClip(resource) {
  const context = resource?.context?.custom || {};
  return {
    id: resource.public_id,
    url: resource.secure_url,
    title: clean(context.title, 120),
    topic: clean(context.topic, 80),
    recordedDate: clean(context.recorded_date, 20),
    description: clean(context.description, 500),
    durationSeconds: Number(resource.duration || 0),
    format: String(resource.format || ""),
    bytes: Number(resource.bytes || 0),
    originalFilename: clean(resource.original_filename, 120),
    createdAt: resource.created_at
  };
}

async function listClips(env) {
  const folder = env.MEDIA_FOLDER || DEFAULT_FOLDER;
  const all = [];
  let nextCursor = "";

  for (let page = 0; page < 5; page++) {
    const query = new URLSearchParams({
      prefix: folder + "/",
      max_results: "100",
      context: "true"
    });
    if (nextCursor) query.set("next_cursor", nextCursor);

    const data = await cloudinaryAdmin(env, "/resources/video/upload?" + query.toString());
    all.push(...(Array.isArray(data.resources) ? data.resources : []));
    nextCursor = data.next_cursor || "";
    if (!nextCursor) break;
  }

  return all
    .filter((resource) =>
      Number(resource.duration || 0) > 0 &&
      Number(resource.duration || 0) <= 300 &&
      ALLOWED_FORMATS.has(String(resource.format || "").toLowerCase())
    )
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .map(publicClip);
}
