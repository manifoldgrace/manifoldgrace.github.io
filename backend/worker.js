const ORIGIN='https://manifoldgrace.github.io';
const PART_SIZE=8*1024*1024;
const COLLECTIONS={'live-sessions':['video'],'public-speaking':['image','video'],faith:['image','video'],photos:['image'],venture:['image'],creative:['image','video']};
const ID=/^[a-f0-9-]{36}$/;
function error(status,message){const e=new Error(message);e.status=status;throw e;}
function clean(value,max=160){return String(value||'').replace(/[<>\x00-\x1f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);}
function json(value,status=200,headers={}){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
async function owner(request,env){
 if(!env.UPLOAD_KEY)error(503,'Upload authentication is unavailable.');
 const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');
 const digest=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
 const [a,b]=await Promise.all([digest(token),digest(env.UPLOAD_KEY)]);let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];
 if(mismatch)error(401,'The private upload key is incorrect. Use “Get my upload key” to retrieve it.');
}
async function body(request){if(!(request.headers.get('Content-Type')||'').includes('application/json'))error(415,'JSON required.');const text=await request.text();if(text.length>30000)error(413,'Request too large.');try{return JSON.parse(text);}catch(_){error(400,'Invalid JSON.');}}
function collection(value){if(!Object.hasOwn(COLLECTIONS,value))error(400,'Unknown collection.');return value;}
function metadata(b){
 const c=collection(b.collection||'live-sessions');const t=b.mediaType||'video';if(!COLLECTIONS[c].includes(t))error(400,'This collection does not accept that media type.');
 const size=Number(b.fileBytes);const limit=t==='image'?26214400:536870912;
 if(!Number.isSafeInteger(size)||size<=0||size>limit)error(413,'The selected file exceeds the upload-size limit.');
 const mime=b.contentType;if(!(t==='image'?['image/png']:['video/mp4','video/quicktime']).includes(mime))error(415,'Upload a prepared PNG image or MP4/MOV video.');
 return {collection:c,mediaType:t,fileBytes:size,contentType:mime,slot:clean(b.slot,80),title:clean(b.title,120),topic:clean(b.topic,120),description:clean(b.description,500),recordedDate:/^\d{4}-\d{2}-\d{2}$/.test(b.recordedDate||'')?b.recordedDate:''};
}
async function session(env,id){if(!ID.test(id))error(404,'Upload not found.');const object=await env.BUCKET.get('sessions/'+id);if(!object)error(404,'Upload session expired.');const value=await object.json();if(value.expires<Date.now())error(410,'Upload session expired. Please retry.');return value;}
async function listing(env,c,type='',slot=''){
 const result=[];let cursor;
 do{const page=await env.BUCKET.list({prefix:'records/'+c+'/',limit:200,...(cursor?{cursor}:{})});
  // Bound concurrent reads and memory; no file bodies are read for a gallery.
  for(let i=0;i<page.objects.length;i+=12){const rows=await Promise.all(page.objects.slice(i,i+12).map(async x=>{const o=await env.BUCKET.get(x.key);return o?o.json():null;}));for(const r of rows)if(r&&(!type||r.mediaType===type)&&(!slot||r.slot===slot))result.push(r);}
  cursor=page.truncated?page.cursor:undefined;
 }while(cursor&&result.length<500);
 return result.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,500);
}
async function validatePng(env,key,size){
 const o=await env.BUCKET.get(key);const bytes=new Uint8Array(await o.arrayBuffer());const view=new DataView(bytes.buffer);
 if(bytes.length!==size||bytes.length<33||[137,80,78,71,13,10,26,10].some((n,i)=>bytes[i]!==n))error(422,'The image is not a valid prepared PNG.');
 const allowed=new Set(['IHDR','IDAT','IEND','sRGB','gAMA','cHRM','pHYs']);let offset=8,header=false,data=false,end=false;
 while(offset<bytes.length){
  if(offset+12>bytes.length)error(422,'Incomplete PNG image.');const length=view.getUint32(offset);const type=String.fromCharCode(...bytes.slice(offset+4,offset+8));
  if(offset+12+length>bytes.length||!allowed.has(type))error(422,'The image contains unsupported or private metadata.');
  if(!header&&type!=='IHDR')error(422,'Invalid PNG header.');
  if(type==='IHDR'){if(header||length!==13)error(422,'Invalid PNG header.');header=true;const w=view.getUint32(offset+8),h=view.getUint32(offset+12);if(!w||!h||w*h>40000000)error(422,'Image dimensions exceed the limit.');}
  if(type==='IDAT')data=true;
  if(type==='IEND'){if(length||offset+12!==bytes.length)error(422,'Invalid PNG ending.');end=true;}
  offset+=12+length;
 }
 if(!header||!data||!end)error(422,'Incomplete PNG image.');
}
async function validateVideo(env,key,size){
 const source={size,slice(start,end){return {async arrayBuffer(){const o=await env.BUCKET.get(key,{range:{offset:start,length:end-start}});if(!o)error(422,'Video missing.');return o.arrayBuffer();}};}};
 try{return await inspectIsoMedia(source);}catch(e){error(422,e.message);}
}
async function ownerPage(request,env){
 const user=request.headers.get('oai-authenticated-user-id');
 if(!user)return Response.redirect(new URL('/signin-with-chatgpt?return_to=%2Fowner',request.url).href,302);
 const mail=(request.headers.get('oai-authenticated-user-email')||'').toLowerCase();
 if(mail!==env.OWNER_EMAIL)error(403,'This upload key is available only to the website owner.');
 const nonce=crypto.randomUUID();
 return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Upload access | Manifold Grace</title><style>body{margin:0;background:#0a0a0a;color:#f5f3ee;font:17px/1.6 system-ui}main{max-width:640px;margin:8vh auto;padding:24px}p{color:#aaa7a1}input{box-sizing:border-box;width:100%;padding:14px;background:#151515;border:1px solid #555;color:white;font:inherit}button,a{display:inline-block;padding:12px 18px;margin:16px 8px 0 0;background:#f5f3ee;border:0;color:#111;font:inherit;cursor:pointer;text-decoration:none}label{display:block;margin-bottom:8px}</style><main><p>MANIFOLD GRACE · OWNER ACCESS</p><h1>Your private upload key</h1><p>Copy this key into the upload form on your website. It is available here only after you sign in as the owner. Keep it private.</p><label for="key">Upload key</label><input id="key" type="password" readonly autocomplete="off"><button id="copy">Copy key</button><button id="show">Show key</button><p id="status" role="status"></p><a href="https://manifoldgrace.github.io/creative.html">Return to Creative</a></main><script nonce="${nonce}">const key=${JSON.stringify(env.UPLOAD_KEY)};const input=document.getElementById('key');input.value=key;document.getElementById('show').onclick=()=>{input.type=input.type==='password'?'text':'password';document.getElementById('show').textContent=input.type==='password'?'Show key':'Hide key';};document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(key);document.getElementById('status').textContent='Copied. Paste it into the private upload key field.';}catch(_){input.type='text';input.select();document.getElementById('status').textContent='Select and copy the key above.';}};</script></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Content-Security-Policy':`default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; frame-ancestors 'none'; base-uri 'none'`,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
}
export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get('Origin');
 const cors={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'GET,HEAD,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type,Range','Access-Control-Expose-Headers':'Content-Length,Content-Range,Accept-Ranges','Access-Control-Max-Age':'86400','Vary':'Origin'};
 if(origin&&origin!==ORIGIN&&origin!==url.origin)return json({error:'Origin not allowed.'},403,cors);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 try{
  if(url.pathname==='/owner'&&request.method==='GET')return await ownerPage(request,env);
  if(url.pathname==='/api/health')return json({ok:!!env.BUCKET&&!!env.UPLOAD_KEY,service:'manifold-media-api',storage:!!env.BUCKET,maxVideoBytes:536870912,maxDurationSeconds:300,partSize:PART_SIZE},200,cors);
  if(!env.BUCKET)error(503,'Media storage is not connected.');
  if(url.pathname==='/api/check'&&request.method==='POST'){await owner(request,env);return json({ok:true},200,cors);}
  if(request.method==='GET'&&['/api/media','/api/clips'].includes(url.pathname)){
   const c=url.pathname==='/api/clips'?'live-sessions':collection(url.searchParams.get('collection'));const media=await listing(env,c,url.searchParams.get('type')||'',url.searchParams.get('slot')||'');
   return json(url.pathname==='/api/clips'?{clips:media}:{media},200,cors);
  }
  if(url.pathname==='/api/uploads'&&request.method==='POST'){
   await owner(request,env);const m=metadata(await body(request));
   if(['photos','venture'].includes(m.collection)&&m.slot&&(await listing(env,m.collection,'image',m.slot)).length>=3)error(409,'This portfolio slot already has three published images.');
   const id=crypto.randomUUID(),key='files/'+id;const upload=await env.BUCKET.createMultipartUpload(key,{httpMetadata:{contentType:m.contentType}});
   await env.BUCKET.put('sessions/'+id,JSON.stringify({...m,id,key,uploadId:upload.uploadId,expires:Date.now()+2*3600000}));return json({id,partSize:PART_SIZE},201,cors);
  }
  const part=url.pathname.match(/^\/api\/uploads\/([a-f0-9-]+)\/parts\/(\d+)$/);
  if(part&&request.method==='PUT'){
   await owner(request,env);const s=await session(env,part[1]);const n=Number(part[2]),count=Math.ceil(s.fileBytes/PART_SIZE);if(n<1||n>count)error(400,'Invalid upload part.');
   const expected=n===count?s.fileBytes-(count-1)*PART_SIZE:PART_SIZE;const length=Number(request.headers.get('Content-Length'));if(length&&length!==expected)error(400,'Upload part has the wrong size.');
   const data=await request.arrayBuffer();if(data.byteLength!==expected)error(400,'Upload part has the wrong size.');
   const uploaded=await env.BUCKET.resumeMultipartUpload(s.key,s.uploadId).uploadPart(n,data);return json(uploaded,200,cors);
  }
  const complete=url.pathname.match(/^\/api\/uploads\/([a-f0-9-]+)\/complete$/);
  if(complete&&request.method==='POST'){
   await owner(request,env);const s=await session(env,complete[1]);const b=await body(request);const count=Math.ceil(s.fileBytes/PART_SIZE);
   if(!Array.isArray(b.parts)||b.parts.length!==count||b.parts.some((p,i)=>p.partNumber!==i+1||typeof p.etag!=='string'))error(400,'Upload parts are incomplete.');
   const stored=await env.BUCKET.resumeMultipartUpload(s.key,s.uploadId).complete(b.parts);
   try{
    if(stored.size!==s.fileBytes)error(422,'The uploaded file size does not match.');let info={};
    if(s.mediaType==='image')await validatePng(env,s.key,stored.size);else info=await validateVideo(env,s.key,stored.size);
    if(['photos','venture'].includes(s.collection)&&s.slot&&(await listing(env,s.collection,'image',s.slot)).length>=3)error(409,'This portfolio slot already has three published images.');
    const item={id:s.id,collection:s.collection,mediaType:s.mediaType,slot:s.slot,title:s.title,topic:s.topic,description:s.description,recordedDate:s.recordedDate,contentType:s.contentType,bytes:stored.size,publishedAt:new Date().toISOString(),url:url.origin+'/media/'+s.collection+'/'+s.id,...info};
    await env.BUCKET.put('records/'+s.collection+'/'+s.id+'.json',JSON.stringify(item));await env.BUCKET.delete('sessions/'+s.id);return json({ok:true,item},201,cors);
   }catch(e){await env.BUCKET.delete([s.key,'sessions/'+s.id]);throw e;}
  }
  const abort=url.pathname.match(/^\/api\/uploads\/([a-f0-9-]+)$/);
  if(abort&&request.method==='DELETE'){
   await owner(request,env);const s=await session(env,abort[1]);await env.BUCKET.resumeMultipartUpload(s.key,s.uploadId).abort().catch(()=>{});await env.BUCKET.delete(['sessions/'+s.id,s.key]);return json({ok:true},200,cors);
  }
  const media=url.pathname.match(/^\/media\/([a-z-]+)\/([a-f0-9-]{36})$/);
  if(media&&['GET','HEAD','DELETE'].includes(request.method)){
   const c=collection(media[1]),id=media[2];const recordKey='records/'+c+'/'+id+'.json';const record=await env.BUCKET.get(recordKey);if(!record)error(404,'Media not found.');const item=await record.json();
   if(request.method==='DELETE'){await owner(request,env);await env.BUCKET.delete([recordKey,'files/'+id]);return json({ok:true},200,cors);}
   const file=await env.BUCKET.head('files/'+id);if(!file)error(404,'Media not found.');
   let start=0,end=file.size-1,status=200;const range=request.headers.get('Range');
   if(range){const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{...cors,'Content-Range':'bytes */'+file.size}});
    if(!m[1])start=Math.max(0,file.size-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}
    if(start>end||start>=file.size)return new Response(null,{status:416,headers:{...cors,'Content-Range':'bytes */'+file.size}});status=206;
   }
   const headers={...cors,'Content-Type':item.contentType,'Accept-Ranges':'bytes','Content-Length':String(end-start+1),'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff','Content-Disposition':'inline; filename="portfolio.'+(item.mediaType==='image'?'png':item.contentType==='video/quicktime'?'mov':'mp4')+'"',...(status===206?{'Content-Range':`bytes ${start}-${end}/${file.size}`}:{})};
   const object=request.method==='HEAD'?null:await env.BUCKET.get('files/'+id,{range:{offset:start,length:end-start+1}});return new Response(object?.body||null,{status,headers});
  }
  if(url.pathname==='/'&&request.method==='GET')return new Response('Manifold Grace media service. Owner upload access: /owner',{headers:{'Content-Type':'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff'}});
  return json({error:'Not found.'},404,cors);
 }catch(e){if(!e.status)console.error('Media request failed',url.pathname,e.message);return json({error:e.status?e.message:'The media service could not complete the request. Please retry.'},e.status||500,cors);}
}};

  async function inspectIsoMedia(source, patch) {
    const containers=new Set(['moov','trak','mdia','minf','stbl','edts','dinf','mvex','moof','traf','mfra']);
    const privateBoxes=new Set(['udta','meta','uuid','loci','XMP_','exif','Exif','©xyz','©nam','©ART','©too','©day','cprt']);
    let boxes=0,duration=null,hasMovie=false,hasVideo=false,hasData=false;
    const fail=(message)=>{throw new Error(message);};
    async function bytes(start,length){const b=new Uint8Array(await source.slice(start,start+length).arrayBuffer());if(b.length!==length)fail('The video file is incomplete.');return b;}
    async function scan(start,end,depth=0){
      if(depth>12)fail('This video has an unsupported container structure.');
      let offset=start;
      while(offset<end){
        if(++boxes>2000||end-offset<8)fail('This video has an invalid or unsupported container.');
        let h=await bytes(offset,Math.min(32,end-offset));let v=new DataView(h.buffer);let size=v.getUint32(0);const type=String.fromCharCode(...h.slice(4,8));let header=8;
        if(size===1){if(h.length<16)fail('Invalid video box.');size=Number(v.getBigUint64(8));header=16;}
        if(size===0)size=end-offset;
        if(!Number.isSafeInteger(size)||size<header||offset+size>end)fail('The video file has invalid box sizes.');
        const data=offset+header;
        if(privateBoxes.has(type)||type==='free'||type==='skip'){
          if(patch){const replacement=new Uint8Array(header);replacement.set(h.slice(0,header));replacement.set([102,114,101,101],4);patch(offset,header,replacement);patch(data,size-header,null);}
          else if(privateBoxes.has(type))fail('Export a clean MP4/MOV without location or descriptive metadata.');
        }else if(containers.has(type)){
          if(type==='moov')hasMovie=true;
          await scan(data,offset+size,depth+1);
        }else if(['mvhd','tkhd','mdhd'].includes(type)){
          const info=await bytes(data,Math.min(40,size-header));const d=new DataView(info.buffer);const version=info[0];
          if(version!==0&&version!==1)fail('Unsupported video timestamp format.');
          const stampBytes=version===1?16:8;
          if(info.length<4+stampBytes)fail('Incomplete video timestamps.');
          if(patch)patch(data+4,stampBytes,null);
          else if(info.slice(4,4+stampBytes).some(n=>n!==0))fail('Video metadata was not removed. Please retry the upload.');
          if(type==='mvhd'){
            const at=version===1?20:12;if(info.length<at+(version===1?12:8))fail('Incomplete video duration.');
            const scale=d.getUint32(at);const ticks=version===1?Number(d.getBigUint64(at+4)):d.getUint32(at+4);
            if(scale>0)duration=ticks/scale;
          }
        }else if(type==='hdlr'){
          if(size-header<12)fail('Incomplete video track.');const handler=String.fromCharCode(...(await bytes(data+8,4)));
          if(handler==='vide')hasVideo=true;
          else if(handler!=='soun')fail('Export a standard MP4/MOV with video and audio tracks only.');
        }else if(type==='mdat')hasData=true;
        offset+=size;
      }
    }
    await scan(0,source.size);
    if(!hasMovie||!hasData||!hasVideo||!Number.isFinite(duration)||duration<=0)fail('Use a complete MP4/MOV video with a readable duration.');
    if(duration>300)fail('This video is longer than five minutes.');
    return {durationSeconds:duration};
  }
