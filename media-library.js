(() => {
  "use strict";
  const config=window.MANIFOLD_MEDIA_CONFIG||{};
  const API_BASE=String(config.apiBase||"").replace(/\/$/,"");
  const MAX_VIDEO_BYTES=Number(config.maxBytes||536870912);
  const MAX_IMAGE_BYTES=Number(config.maxImageBytes||26214400);
  const MAX_DURATION=Number(config.maxDurationSeconds||300);

  const VIDEO_EXT=new Set(["mp4","webm","mov","m4v","ogv"]);
  const IMAGE_EXT=new Set(["jpg","jpeg","png","webp","avif","heic","heif"]);
  const ext=(name)=>String(name||"").toLowerCase().split(".").pop();

  async function api(path,options={}){
    if(!API_BASE) throw new Error("The secure media API is not connected yet.");
    const response=await fetch(API_BASE+path,{
      ...options,
      headers:{"Content-Type":"application/json",...(options.headers||{})},
      credentials:"omit",cache:"no-store"
    });
    const body=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(body.error||"The media API returned an error.");
    return body;
  }

  function durationOf(file){
    return new Promise((resolve)=>{
      const video=document.createElement("video");
      const url=URL.createObjectURL(file);
      let done=false;
      const finish=(value)=>{
        if(done)return; done=true; URL.revokeObjectURL(url);
        video.removeAttribute("src"); video.load(); resolve(value);
      };
      const timer=setTimeout(()=>finish(null),10000);
      video.preload="metadata";
      video.onloadedmetadata=()=>{clearTimeout(timer);finish(Number.isFinite(video.duration)?video.duration:null);};
      video.onerror=()=>{clearTimeout(timer);finish(null);};
      video.src=url;
    });
  }

  async function preflight(file,type){
    if(!file) throw new Error("Choose a file first.");
    const e=ext(file.name);
    if(type==="video"){
      if(!VIDEO_EXT.has(e)) throw new Error("Use MP4, WebM, MOV, M4V or OGV video.");
      if(file.size>MAX_VIDEO_BYTES) throw new Error("This video exceeds the configured upload-size limit.");
      const d=await durationOf(file);
      if(d!==null&&d>MAX_DURATION+0.25) throw new Error("This video is longer than five minutes.");
      return d;
    }
    if(!IMAGE_EXT.has(e)) throw new Error("Use JPG, PNG, WebP, AVIF, HEIC or HEIF image.");
    if(file.size>MAX_IMAGE_BYTES) throw new Error("This image exceeds the configured upload-size limit.");
    return null;
  }

  function directUpload(url,formData,onProgress){
    return new Promise((resolve,reject)=>{
      const xhr=new XMLHttpRequest();
      xhr.open("POST",url,true); xhr.responseType="json";
      xhr.upload.onprogress=(event)=>{if(event.lengthComputable)onProgress((event.loaded/event.total)*100);};
      xhr.onerror=()=>reject(new Error("The media upload connection failed."));
      xhr.onload=()=>{
        const body=xhr.response||{};
        if(xhr.status>=200&&xhr.status<300)resolve(body);
        else reject(new Error(body.error?.message||body.error||"The media provider rejected the upload."));
      };
      xhr.send(formData);
    });
  }

  function renderItem(item){
    const figure=document.createElement("figure");
    figure.className="media-item";
    let media;
    if(item.mediaType==="image"){
      media=document.createElement("img");
      media.loading="lazy";
      media.alt=item.title||item.description||"Portfolio image";
      media.src=item.url;
    }else{
      media=document.createElement("video");
      media.controls=true; media.preload="metadata"; media.playsInline=true; media.src=item.url;
    }
    figure.appendChild(media);
    if(item.title||item.description||item.recordedDate){
      const cap=document.createElement("figcaption");
      if(item.title){const strong=document.createElement("strong");strong.textContent=item.title;cap.appendChild(strong);}
      const bits=[item.recordedDate,item.topic].filter(Boolean);
      if(bits.length){const meta=document.createElement("small");meta.textContent=bits.join(" · ");cap.appendChild(meta);}
      if(item.description){const p=document.createElement("p");p.textContent=item.description;cap.appendChild(p);}
      figure.appendChild(cap);
    }
    return figure;
  }

  async function refreshGallery(gallery){
    const collection=gallery.dataset.collection;
    const type=gallery.dataset.mediaType||"";
    const slot=gallery.dataset.slot||"";
    const status=gallery.parentElement.querySelector("[data-media-status]");
    gallery.replaceChildren();
    if(!API_BASE){if(status)status.textContent="No media published here yet.";return;}
    try{
      if(status)status.textContent="Loading…";
      const params=new URLSearchParams({collection});
      if(type)params.set("type",type);
      if(slot)params.set("slot",slot);
      const data=await api("/api/media?"+params.toString(),{method:"GET",headers:{}});
      const items=Array.isArray(data.media)?data.media:[];
      items.forEach(item=>gallery.appendChild(renderItem(item)));
      if(status)status.textContent=items.length?items.length+(items.length===1?" published item.":" published items."):"No media published here yet.";
    }catch(_){if(status)status.textContent="Media could not be loaded at the moment.";}
  }

  document.querySelectorAll("[data-media-gallery]").forEach(refreshGallery);

  document.querySelectorAll("form[data-media-upload]").forEach((form)=>{
    const fileInput=form.querySelector('input[type="file"]');
    const status=form.querySelector("[data-upload-status]");
    const progress=form.querySelector("[data-upload-progress]");
    const button=form.querySelector('button[type="submit"]');
    const type=form.dataset.mediaType||"image";
    const collection=form.dataset.collection;
    const slot=form.dataset.slot||"";

    const setStatus=(msg,error=false)=>{if(status){status.textContent=msg;status.classList.toggle("error",error);}};
    const setProgress=(n)=>{if(progress)progress.style.width=Math.max(0,Math.min(100,n||0))+"%";};

    fileInput?.addEventListener("change",async()=>{
      try{const d=await preflight(fileInput.files?.[0],type);setStatus(type==="video"&&d!==null?"Ready · "+Math.round(d)+" seconds.":"Ready to upload.");}
      catch(e){fileInput.value="";setStatus(e.message,true);}
    });

    form.addEventListener("submit",async(event)=>{
      event.preventDefault(); if(button)button.disabled=true; setProgress(0);
      try{
        if(!API_BASE)throw new Error("The uploader is prepared, but the secure media API has not been connected yet.");
        const file=fileInput.files?.[0]; await preflight(file,type);
        const key=form.querySelector('[name="upload_key"]')?.value||"";
        if(!key)throw new Error("Enter the private upload key.");
        const metadata={
          collection,mediaType:type,slot,fileBytes:file.size,
          title:form.querySelector('[name="title"]')?.value?.trim()||"",
          topic:form.querySelector('[name="topic"]')?.value?.trim()||"",
          recordedDate:form.querySelector('[name="recorded_date"]')?.value||"",
          description:form.querySelector('[name="description"]')?.value?.trim()||""
        };
        setStatus("Requesting secure upload signature…");
        const signed=await api("/api/sign",{method:"POST",headers:{"Authorization":"Bearer "+key},body:JSON.stringify(metadata)});
        const fd=new FormData(); fd.append("file",file);
        Object.entries(signed.uploadParams).forEach(([k,v])=>fd.append(k,String(v)));
        fd.append("api_key",signed.apiKey); fd.append("signature",signed.signature);
        setStatus("Uploading securely…");
        const uploaded=await directUpload("https://api.cloudinary.com/v1_1/"+encodeURIComponent(signed.cloudName)+"/"+type+"/upload",fd,setProgress);
        setStatus("Validating before publication…");
        await api("/api/validate",{method:"POST",headers:{"Authorization":"Bearer "+key},body:JSON.stringify({
          publicId:uploaded.public_id,collection,mediaType:type,slot
        })});
        setProgress(100); setStatus("Published successfully.");
        form.reset();
        document.querySelectorAll('[data-media-gallery][data-collection="'+collection+'"]').forEach(refreshGallery);
      }catch(e){setProgress(0);setStatus(e.message||"Upload failed.",true);}
      finally{if(button)button.disabled=false;}
    });
  });
})();