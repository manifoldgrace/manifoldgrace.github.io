const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff"
};
const BASE_FOLDER = "manifold-grace";
const VIDEO_FORMATS = new Set(["mp4","webm","mov","m4v","ogv"]);
const IMAGE_FORMATS = new Set(["jpg","jpeg","png","webp","avif","heic","heif"]);

const COLLECTIONS = Object.freeze({
  "live-sessions": { types:["video"], maxVideoBytes:536870912, maxDuration:300 },
  "public-speaking": { types:["video","image"], maxVideoBytes:536870912, maxImageBytes:26214400, maxDuration:300 },
  "faith": { types:["video","image"], maxVideoBytes:536870912, maxImageBytes:26214400, maxDuration:300 },
  "photos": { types:["image"], maxImageBytes:26214400, maxPerSlot:3 },
  "venture": { types:["image"], maxImageBytes:26214400, maxPerSlot:3 },
  "creative": { types:["video","image"], maxVideoBytes:536870912, maxImageBytes:26214400, maxDuration:300 }
});

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
      if (origin && origin !== allowedOrigin) return new Response(null,{status:403,headers:cors});
      return new Response(null,{status:204,headers:cors});
    }
    if (origin && origin !== allowedOrigin) return json({error:"Origin not allowed."},403,cors);

    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({ok:true,service:"manifold-media-api",collections:Object.keys(COLLECTIONS)},200,cors);
      }

      if (request.method === "GET" && url.pathname === "/api/clips") {
        const media = await listMedia(env,"live-sessions","video","");
        return json({clips:media},200,{...cors,"Cache-Control":"public, max-age=60"});
      }

      if (request.method === "GET" && url.pathname === "/api/media") {
        const collection = validateCollection(url.searchParams.get("collection"));
        const type = cleanType(url.searchParams.get("type") || "");
        const slot = clean(url.searchParams.get("slot"),80);
        const items = await listMedia(env,collection,type,slot);
        return json({media:items},200,{...cors,"Cache-Control":"public, max-age=60"});
      }

      if (request.method === "POST" && url.pathname === "/api/sign") {
        requireOwner(request,env);
        const body = await safeJson(request);
        const collection = validateCollection(body.collection || "live-sessions");
        const mediaType = validateMediaType(collection,body.mediaType || "video");
        const limits = COLLECTIONS[collection];
        const claimedBytes = Number(body.fileBytes || 0);
        const maxBytes = mediaType === "image"
          ? Number(env.MAX_IMAGE_BYTES || limits.maxImageBytes || 26214400)
          : Number(env.MAX_VIDEO_BYTES || limits.maxVideoBytes || 536870912);

        if (!Number.isFinite(claimedBytes) || claimedBytes <= 0 || claimedBytes > maxBytes) {
          throw httpError(413,"The selected file exceeds the configured upload-size limit.");
        }

        const timestamp = Math.floor(Date.now()/1000);
        const folder = mediaBase(env) + "/" + collection + "/pending";
        const uploadParams = {
          context: makeContext({...body,collection,mediaType}),
          folder,
          timestamp,
          unique_filename:"true",
          use_filename:"true"
        };
        const signature = await cloudinarySignature(uploadParams,env.CLOUDINARY_API_SECRET);
        return json({
          apiKey:env.CLOUDINARY_API_KEY,
          cloudName:env.CLOUDINARY_CLOUD_NAME,
          signature,
          mediaType,
          uploadParams
        },200,cors);
      }

      if (request.method === "POST" && url.pathname === "/api/validate") {
        requireOwner(request,env);
        const body = await safeJson(request);
        const collection = validateCollection(body.collection || "live-sessions");
        const mediaType = validateMediaType(collection,body.mediaType || "video");
        const slot = clean(body.slot,80);
        const limits = COLLECTIONS[collection];
        const publicId = String(body.publicId || "");

        const base = mediaBase(env) + "/" + collection;
        const pendingFolder = base + "/pending";
        const publishedFolder = base + "/published";
        if (!publicId || !publicId.startsWith(pendingFolder + "/")) {
          throw httpError(400,"Invalid media identifier.");
        }

        const resource = await getResource(env,mediaType,publicId);
        const bytes = Number(resource.bytes || 0);
        const format = String(resource.format || "").toLowerCase();
        const maxBytes = mediaType === "image"
          ? Number(env.MAX_IMAGE_BYTES || limits.maxImageBytes || 26214400)
          : Number(env.MAX_VIDEO_BYTES || limits.maxVideoBytes || 536870912);

        let valid = bytes > 0 && bytes <= maxBytes;
        if (mediaType === "image") {
          valid = valid && resource.resource_type === "image" && IMAGE_FORMATS.has(format);
        } else {
          const duration = Number(resource.duration || 0);
          valid = valid &&
            resource.resource_type === "video" &&
            VIDEO_FORMATS.has(format) &&
            duration > 0 &&
            duration <= Number(limits.maxDuration || 300);
        }

        if (!valid) {
          await destroyResource(env,mediaType,publicId);
          throw httpError(422,"The uploaded file failed server-side validation and was removed.");
        }

        if (limits.maxPerSlot && slot) {
          const existing = await listMedia(env,collection,mediaType,slot);
          if (existing.length >= limits.maxPerSlot) {
            await destroyResource(env,mediaType,publicId);
            throw httpError(409,"This portfolio slot already contains the maximum number of published items.");
          }
        }

        const leaf = publicId.slice((pendingFolder + "/").length).replace(/[^a-zA-Z0-9_.-]/g,"-");
        const publishedId = publishedFolder + "/" + leaf;
        await renameResource(env,mediaType,publicId,publishedId);
        const published = await getResource(env,mediaType,publishedId);
        return json({ok:true,item:publicMedia(published)},200,cors);
      }

      return json({error:"Not found."},404,cors);
    } catch (error) {
      const status = Number(error?.status || 500);
      const message = status >= 500 ? "Media service error." : String(error?.message || "Request failed.");
      return json({error:message},status,cors);
    }
  }
};

function mediaBase(env){ return clean(env.MEDIA_FOLDER || BASE_FOLDER,180) || BASE_FOLDER; }
function json(body,status=200,extraHeaders={}){ return new Response(JSON.stringify(body),{status,headers:{...JSON_HEADERS,...extraHeaders}}); }
function httpError(status,message){ const e=new Error(message); e.status=status; return e; }
async function safeJson(request){
  const type=request.headers.get("Content-Type")||"";
  if(!type.toLowerCase().includes("application/json")) throw httpError(415,"JSON required.");
  return request.json().catch(()=>{throw httpError(400,"Invalid JSON.");});
}
function constantTimeEqual(a,b){
  a=String(a||""); b=String(b||""); let mismatch=a.length^b.length;
  const length=Math.max(a.length,b.length);
  for(let i=0;i<length;i++) mismatch|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return mismatch===0;
}
function requireOwner(request,env){
  if(!env.UPLOAD_KEY) throw httpError(500,"Upload authentication is not configured.");
  const auth=request.headers.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!constantTimeEqual(token,env.UPLOAD_KEY)) throw httpError(401,"Upload authentication failed.");
}
function clean(value,max=160){
  return String(value||"").replace(/[|=\\\r\n]+/g," ").replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,max);
}
function validateCollection(value){
  const c=clean(value,80);
  if(!COLLECTIONS[c]) throw httpError(400,"Unknown media collection.");
  return c;
}
function cleanType(value){
  const t=String(value||"").toLowerCase();
  if(!t) return "";
  if(t!=="image"&&t!=="video") throw httpError(400,"Unknown media type.");
  return t;
}
function validateMediaType(collection,value){
  const t=cleanType(value);
  if(!COLLECTIONS[collection].types.includes(t)) throw httpError(400,"Media type not allowed for this collection.");
  return t;
}
function makeContext(body){
  const fields={
    title:clean(body.title,120),
    topic:clean(body.topic,80),
    recorded_date:clean(body.recordedDate,20),
    description:clean(body.description,500),
    collection:clean(body.collection,80),
    media_type:clean(body.mediaType,20),
    slot:clean(body.slot,80)
  };
  return Object.entries(fields).filter(([,v])=>v).map(([k,v])=>k+"="+v).join("|");
}
async function sha1Hex(input){
  const bytes=new TextEncoder().encode(input);
  const digest=await crypto.subtle.digest("SHA-1",bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function cloudinarySignature(params,secret){
  if(!secret) throw httpError(500,"Cloudinary secret is not configured.");
  const canonical=Object.entries(params)
    .filter(([,v])=>v!==undefined&&v!==null&&v!=="")
    .sort(([a],[b])=>a.localeCompare(b))
    .map(([k,v])=>k+"="+String(v)).join("&");
  return sha1Hex(canonical+secret);
}
function basicAuth(env){ return "Basic "+btoa(env.CLOUDINARY_API_KEY+":"+env.CLOUDINARY_API_SECRET); }
async function cloudinaryAdmin(env,path){
  const response=await fetch("https://api.cloudinary.com/v1_1/"+encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)+path,{
    headers:{"Authorization":basicAuth(env),"Accept":"application/json"}
  });
  const body=await response.json().catch(()=>({}));
  if(!response.ok) throw httpError(502,"Media provider lookup failed.");
  return body;
}
async function getResource(env,type,publicId){
  return cloudinaryAdmin(env,"/resources/"+type+"/upload/"+encodeURIComponent(publicId));
}
async function renameResource(env,type,fromPublicId,toPublicId){
  const timestamp=Math.floor(Date.now()/1000);
  const params={from_public_id:fromPublicId,overwrite:"false",timestamp,to_public_id:toPublicId};
  const signature=await cloudinarySignature(params,env.CLOUDINARY_API_SECRET);
  const body=new URLSearchParams({
    from_public_id:fromPublicId,to_public_id:toPublicId,overwrite:"false",
    timestamp:String(timestamp),api_key:env.CLOUDINARY_API_KEY,signature
  });
  const response=await fetch("https://api.cloudinary.com/v1_1/"+encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)+"/"+type+"/rename",{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body
  });
  if(!response.ok) throw httpError(502,"Validated media could not be published.");
}
async function destroyResource(env,type,publicId){
  const timestamp=Math.floor(Date.now()/1000);
  const params={public_id:publicId,timestamp};
  const signature=await cloudinarySignature(params,env.CLOUDINARY_API_SECRET);
  const body=new URLSearchParams({public_id:publicId,timestamp:String(timestamp),api_key:env.CLOUDINARY_API_KEY,signature});
  await fetch("https://api.cloudinary.com/v1_1/"+encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)+"/"+type+"/destroy",{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body
  });
}
function publicMedia(resource){
  const context=resource?.context?.custom||{};
  return {
    id:resource.public_id,
    url:resource.secure_url,
    title:clean(context.title,120),
    topic:clean(context.topic,80),
    recordedDate:clean(context.recorded_date,20),
    description:clean(context.description,500),
    slot:clean(context.slot,80),
    mediaType:String(resource.resource_type||""),
    durationSeconds:Number(resource.duration||0),
    format:String(resource.format||""),
    bytes:Number(resource.bytes||0),
    originalFilename:clean(resource.original_filename,120),
    createdAt:resource.created_at
  };
}
async function listResources(env,collection,type){
  const folder=mediaBase(env)+"/"+collection+"/published";
  const all=[]; let nextCursor="";
  for(let page=0;page<5;page++){
    const query=new URLSearchParams({prefix:folder+"/",max_results:"100",context:"true"});
    if(nextCursor) query.set("next_cursor",nextCursor);
    const data=await cloudinaryAdmin(env,"/resources/"+type+"/upload?"+query.toString());
    all.push(...(Array.isArray(data.resources)?data.resources:[]));
    nextCursor=data.next_cursor||"";
    if(!nextCursor) break;
  }
  return all;
}
async function listMedia(env,collection,type,slot){
  const types=type?[validateMediaType(collection,type)]:COLLECTIONS[collection].types;
  const groups=await Promise.all(types.map(t=>listResources(env,collection,t)));
  return groups.flat()
    .map(publicMedia)
    .filter(item=>!slot||item.slot===slot)
    .sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
}
