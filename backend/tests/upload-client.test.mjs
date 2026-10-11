import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const code=await readFile(new URL('../../media-upload-client.js',import.meta.url),'utf8');
async function scenario({failAuth=false,failPart=false}={}){
 const calls=[],parts=[],progress=[];let prepared=0,aborted=false;
 const fakeFile=new File([new Uint8Array(19)],'video.mp4',{type:'video/mp4'});
 const ctx={window:{MANIFOLD_MEDIA_CONFIG:{apiBase:'https://media.example'},ManifoldFileTools:{async prepare(){prepared++;return {file:fakeFile};}}},document:{querySelectorAll(){return [];}},File,Blob,Math,Number,JSON,Error,Promise,
  async fetch(url,options){calls.push({url,options});assert.equal(options.credentials,'omit');assert.equal(options.headers.Authorization,'Bearer test-key');
   if(url.endsWith('/api/check')&&failAuth)return {ok:false,json:async()=>({error:'wrong key'})};
   if(url.endsWith('/api/uploads')){const m=JSON.parse(options.body);assert.equal(m.collection,'creative');assert.equal(m.slot,'music');assert.equal(m.fileBytes,19);return {ok:true,json:async()=>({id:'test-id',partSize:8})};}
   if(options.method==='DELETE')aborted=true;
   return {ok:true,json:async()=>({ok:true})};
  },XMLHttpRequest:class{
   constructor(){this.upload={};}
   open(method,url){this.method=method;this.url=url;}
   setRequestHeader(name,value){if(name==='Authorization')assert.equal(value,'Bearer test-key');}
   send(blob){parts.push({url:this.url,size:blob.size});queueMicrotask(()=>{if(failPart){this.status=500;this.response={error:'part failed'};}else{this.status=200;this.response={partNumber:parts.length,etag:'part-'+parts.length};this.upload.onprogress({lengthComputable:true,loaded:blob.size,total:blob.size});}this.onload();});}
  }};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 let failure=null;try{await ctx.window.ManifoldUpload.upload(fakeFile,'video','test-key',{collection:'creative',slot:'music'},()=>{},n=>progress.push(n));}catch(e){failure=e.message;}
 return {calls,parts,progress,prepared,aborted,failure};
}
const ok=await scenario();assert.equal(ok.failure,null);assert.deepEqual(ok.parts.map(x=>x.size),[8,8,3]);assert.equal(ok.progress.at(-1),100);assert.ok(ok.calls.some(x=>x.url.endsWith('/complete')));
const auth=await scenario({failAuth:true});assert.equal(auth.prepared,0);assert.equal(auth.failure,'wrong key');
const part=await scenario({failPart:true});assert.equal(part.failure,'part failed');assert.equal(part.aborted,true);assert.ok(!part.calls.some(x=>x.url.endsWith('/complete')));
console.log('PASS: frontend chunking, progress, slot routing, key validation and abort cleanup');
