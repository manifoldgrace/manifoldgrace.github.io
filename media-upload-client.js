(() => {
  'use strict';
  const base=String(window.MANIFOLD_MEDIA_CONFIG?.apiBase||'').replace(/\/$/,'');
  async function request(path,key,body,method='POST'){
    let response;
    try{response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:body?JSON.stringify(body):undefined,credentials:'omit',cache:'no-store'});}
    catch(_){throw new Error('The upload service could not be reached. Check your connection and retry.');}
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||'The upload service returned an error.');return result;
  }
  async function upload(file,type,key,metadata,status,progress){
    if(!base)throw new Error('The upload service is not configured.');
    if(!key)throw new Error('Enter your private upload key. Use “Get my upload key” if needed.');
    await request('/api/check',key);
    status('Preparing a public copy and removing hidden metadata…');
    const prepared=await window.ManifoldFileTools.prepare(file,type);
    const limit=type==='image'?26214400:536870912;
    if(prepared.file.size<=0||prepared.file.size>limit)throw new Error('The prepared file exceeds the upload-size limit.');
    const session=await request('/api/uploads',key,{...metadata,mediaType:type,fileBytes:prepared.file.size,contentType:prepared.file.type});
    try{
      const parts=[];const total=prepared.file.size;const partSize=session.partSize;
      for(let offset=0,index=1;offset<total;offset+=partSize,index++){
        const blob=prepared.file.slice(offset,Math.min(total,offset+partSize));
        status('Uploading part '+index+' of '+Math.ceil(total/partSize)+'…');
        const part=await new Promise((resolve,reject)=>{
          const xhr=new XMLHttpRequest();xhr.open('PUT',base+'/api/uploads/'+session.id+'/parts/'+index);xhr.responseType='json';xhr.timeout=180000;
          xhr.setRequestHeader('Authorization','Bearer '+key);xhr.setRequestHeader('Content-Type','application/octet-stream');
          xhr.upload.onprogress=e=>{if(e.lengthComputable)progress((offset+e.loaded)/total*95);};
          xhr.onerror=()=>reject(new Error('Upload connection interrupted. Please retry.'));
          xhr.ontimeout=()=>reject(new Error('The upload timed out. Please retry.'));
          xhr.onload=()=>{const b=xhr.response||{};if(xhr.status>=200&&xhr.status<300)resolve(b);else reject(new Error(b.error||'The upload part was rejected.'));};xhr.send(blob);
        });parts.push(part);
      }
      status('Validating the uploaded file before publication…');
      const result=await request('/api/uploads/'+session.id+'/complete',key,{parts});progress(100);return result;
    }catch(error){await request('/api/uploads/'+session.id,key,null,'DELETE').catch(()=>{});throw error;}
  }
  // Key is obtained only after owner sign-in; it is never stored in browser storage.
  for(const form of document.querySelectorAll('form[data-media-upload], #uploadForm')){
    const input=form.querySelector('input[name="upload_key"], #uploadKey');
    if(!input)continue;
    input.autocomplete='off';
    const link=document.createElement('a');link.className='text-link';link.href=base+'/owner';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Get my upload key ↗';
    input.parentElement.append(link);
  }
  window.ManifoldUpload={upload};
})();
