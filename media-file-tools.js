/* Public derivatives only: preserve private originals on the owner's device. */
(() => {
  'use strict';
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
  async function prepare(file,type){
    if(type==='image'){
      const image=new Image();const url=URL.createObjectURL(file);
      try{
        await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('This image cannot be opened. Export it as JPG or PNG and retry.'));image.src=url;});
        if(image.naturalWidth*image.naturalHeight>40000000)throw new Error('This image exceeds 40 megapixels. Resize it before uploading.');
        const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
        canvas.getContext('2d').drawImage(image,0,0);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
        if(!blob)throw new Error('The image could not be prepared.');
        return {file:new File([blob],'portfolio.png',{type:'image/png'}),durationSeconds:null};
      }finally{URL.revokeObjectURL(url);}
    }
    const extension=file.name.toLowerCase().split('.').pop();
    if(!['mp4','mov','m4v'].includes(extension))throw new Error('Export this video as MP4 or MOV before uploading.');
    const patches=[];const info=await inspectIsoMedia(file,(start,length,value)=>{if(length)patches.push({start,length,value});});
    patches.sort((a,b)=>a.start-b.start);
    const pieces=[];let offset=0;const zeros=new Uint8Array(65536);
    for(const p of patches){
      if(p.start<offset)throw new Error('Overlapping video metadata.');
      pieces.push(file.slice(offset,p.start));
      if(p.value)pieces.push(p.value);
      else for(let n=p.length;n>0;n-=Math.min(n,zeros.length))pieces.push(zeros.slice(0,Math.min(n,zeros.length)));
      offset=p.start+p.length;
    }
    pieces.push(file.slice(offset));
    return {file:new File(pieces,extension==='mov'?'portfolio.mov':'portfolio.mp4',{type:extension==='mov'?'video/quicktime':'video/mp4'}),...info};
  }
  window.ManifoldFileTools={prepare,inspectIsoMedia};
})();
