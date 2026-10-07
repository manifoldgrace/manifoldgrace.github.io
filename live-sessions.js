(() => {
  "use strict";

  const config = window.MANIFOLD_MEDIA_CONFIG || {};
  const API_BASE = String(config.apiBase || "").replace(/\/$/, "");
  const MAX_DURATION = Number(config.maxDurationSeconds || 300);
  const MAX_BYTES = Number(config.maxBytes || 536870912);
  const ALLOWED_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "ogv"]);
  const ALLOWED_MIME = new Set([
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v",
    "video/ogg"
  ]);

  const $ = (id) => document.getElementById(id);
  const form = $("uploadForm");
  const fileInput = $("videoFile");
  const status = $("uploadStatus");
  const progress = $("uploadProgress");
  const clipGrid = $("clipGrid");
  const clipStatus = $("clipStatus");
  const uploadButton = $("uploadButton");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  function setProgress(percent) {
    const safe = Math.max(0, Math.min(100, Number(percent) || 0));
    progress.style.width = safe + "%";
    progress.parentElement.setAttribute("aria-hidden", safe === 0 ? "true" : "false");
  }

  function extensionOf(name) {
    const parts = String(name || "").toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function fileTypeAllowed(file) {
    return ALLOWED_MIME.has(file.type) || ALLOWED_EXTENSIONS.has(extensionOf(file.name));
  }

  function readDuration(file) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      let finished = false;

      const done = (value) => {
        if (finished) return;
        finished = true;
        URL.revokeObjectURL(url);
        video.removeAttribute("src");
        video.load();
        resolve(value);
      };

      const timer = setTimeout(() => done(null), 10000);
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        clearTimeout(timer);
        done(Number.isFinite(video.duration) ? video.duration : null);
      };
      video.onerror = () => {
        clearTimeout(timer);
        done(null);
      };
      video.src = url;
    });
  }

  async function preflightFile(file) {
    if (!file) throw new Error("Choose a video file first.");
    if (!fileTypeAllowed(file)) {
      throw new Error("Use MP4, WebM, MOV/QuickTime, M4V or OGV video.");
    }
    if (file.size <= 0) throw new Error("The selected file is empty.");
    if (file.size > MAX_BYTES) {
      throw new Error("This file exceeds the configured upload-size limit.");
    }

    const duration = await readDuration(file);
    if (duration !== null && duration > MAX_DURATION + 0.25) {
      throw new Error("This clip is longer than five minutes.");
    }
    return duration;
  }

  function xhrUpload(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.responseType = "json";
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress((event.loaded / event.total) * 100);
      };
      xhr.onerror = () => reject(new Error("The video upload connection failed."));
      xhr.onload = () => {
        const body = xhr.response || {};
        if (xhr.status >= 200 && xhr.status < 300) resolve(body);
        else reject(new Error(body.error?.message || body.error || "The media provider rejected the upload."));
      };
      xhr.send(formData);
    });
  }

  async function api(path, options = {}) {
    if (!API_BASE) throw new Error("The secure media API is not connected yet.");
    const response = await fetch(API_BASE + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      credentials: "omit",
      cache: "no-store"
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "The media API returned an error.");
    return body;
  }

  function buildClipCard(clip) {
    const article = document.createElement("article");
    article.className = "video-card";

    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.src = clip.url;
    video.setAttribute("aria-label", clip.title || "Live-session clip");

    const body = document.createElement("div");
    body.className = "video-card-body";

    const title = document.createElement("h3");
    title.textContent = clip.title || clip.originalFilename || "Live-session excerpt";
    body.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "video-meta";
    const bits = [clip.recordedDate, clip.topic, clip.durationSeconds ? Math.round(clip.durationSeconds) + " sec" : null].filter(Boolean);
    meta.textContent = bits.join(" · ");
    if (meta.textContent) body.appendChild(meta);

    if (clip.description) {
      const description = document.createElement("p");
      description.textContent = clip.description;
      body.appendChild(description);
    }

    article.append(video, body);
    return article;
  }

  async function loadClips() {
    clipGrid.replaceChildren();
    if (!API_BASE) {
      clipStatus.textContent = "No clips published yet. The page is ready; the secure media API still needs to be connected.";
      return;
    }

    try {
      clipStatus.textContent = "Loading published clips…";
      const data = await api("/api/clips", { method: "GET", headers: {} });
      const clips = Array.isArray(data.clips) ? data.clips : [];
      if (!clips.length) {
        clipStatus.textContent = "No clips published yet.";
        return;
      }
      clipStatus.textContent = clips.length + (clips.length === 1 ? " published clip." : " published clips.");
      clips.forEach((clip) => clipGrid.appendChild(buildClipCard(clip)));
    } catch (error) {
      clipStatus.textContent = "Published clips could not be loaded at the moment.";
    }
  }

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    setProgress(0);
    if (!file) return setStatus("Choose a clip when you are ready.");
    try {
      setStatus("Checking " + file.name + "…");
      const duration = await preflightFile(file);
      const durationText = duration === null ? "Duration will be verified by the server." : "Duration " + Math.round(duration) + " seconds.";
      setStatus("Ready: " + file.name + ". " + durationText);
    } catch (error) {
      setStatus(error.message, true);
      fileInput.value = "";
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    uploadButton.disabled = true;
    setProgress(0);

    try {
      if (!API_BASE) throw new Error("The uploader interface is ready, but the secure media API has not been connected yet.");

      const file = fileInput.files?.[0];
      await preflightFile(file);

      const uploadKey = $("uploadKey").value;
      if (!uploadKey) throw new Error("Enter the private upload key.");

      const metadata = {
        title: $("clipTitle").value.trim(),
        topic: $("clipTopic").value.trim(),
        recordedDate: $("clipDate").value,
        description: $("clipDescription").value.trim(),
        fileBytes: file.size
      };
      if (!metadata.title) throw new Error("Add a title for this clip.");

      setStatus("Requesting a secure one-time upload signature…");
      const signed = await api("/api/sign", {
        method: "POST",
        headers: { "Authorization": "Bearer " + uploadKey },
        body: JSON.stringify(metadata)
      });

      const formData = new FormData();
      formData.append("file", file);
      Object.entries(signed.uploadParams).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append("api_key", signed.apiKey);
      formData.append("signature", signed.signature);

      setStatus("Uploading directly to secure media storage…");
      const uploaded = await xhrUpload(
        "https://api.cloudinary.com/v1_1/" + encodeURIComponent(signed.cloudName) + "/video/upload",
        formData,
        setProgress
      );

      setStatus("Validating duration, format and size on the server…");
      await api("/api/validate", {
        method: "POST",
        headers: { "Authorization": "Bearer " + uploadKey },
        body: JSON.stringify({ publicId: uploaded.public_id })
      });

      setProgress(100);
      setStatus("Published successfully.");
      $("uploadKey").value = "";
      fileInput.value = "";
      form.reset();
      await loadClips();
    } catch (error) {
      setProgress(0);
      setStatus(error.message || "Upload failed.", true);
    } finally {
      uploadButton.disabled = false;
    }
  });

  loadClips();
})();