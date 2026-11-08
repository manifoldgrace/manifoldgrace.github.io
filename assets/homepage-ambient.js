/*
 * Manifold Grace — original, locally generated ambient sound.
 * No third-party composition, recording, sample or streaming service.
 * Browsers may block sound before a visitor interaction. Never attempt to circumvent that policy.
 * To use a cleared recording instead, set approvedRecordingUrl to a genuine licensed audio path.
 */
(()=>{
 'use strict';
 const button=document.getElementById('mg-music-play');
 if(!button)return;
 const approvedRecordingUrl=''; // Empty until a verified recording is supplied and authorised.
 const AudioCtx=window.AudioContext||window.webkitAudioContext;
 const chords=[
  [50,57,61,64,69],[47,54,57,62,66],[43,50,57,59,66],[45,52,57,62,64],
  [52,59,62,67,71],[43,50,55,59,62],[50,57,61,64,71],[45,52,57,62,69],
  [42,49,54,57,61],[47,54,57,62,64],[43,50,57,59,64],[45,52,55,59,62]
 ];
 // Independent melodic motifs, deliberately not based on the proposed licensed soundtrack.
 const contours=[[74,76,78,81],[78,76,74,73],[71,74,76,78],[73,74,76,81],
 [74,78,81,83],[76,74,71,69],[78,81,83,81],[76,74,73,71],
 [73,76,78,76],[74,76,78,81],[78,76,74,71],[73,74,76,74]];
 let ctx=null,master=null,interval=null,nextStart=0,index=0,playing=false,recording=null;
 const cycleSeconds=7.2;
 const freq=n=>440*Math.pow(2,(n-69)/12);
 function setButton(on,label){
  button.setAttribute('aria-pressed',String(on));
  button.setAttribute('aria-label',label);
  button.title=label;
  const symbol=button.querySelector('svg path');
  if(symbol)symbol.setAttribute('d',on?'M6 4h4v16H6z M14 4h4v16h-4z':'M7 4.5v15l12-7.5z');
  // Existing control is the only playback UI; label supplies screen reader meaning.
 }
 function voice(note,t,duration,volume,kind){
  const osc=ctx.createOscillator(),envelope=ctx.createGain(),filter=ctx.createBiquadFilter();
  osc.type=kind==='pad'?'sine':'triangle';
  osc.frequency.setValueAtTime(freq(note),t);
  filter.type='lowpass';filter.frequency.setValueAtTime(kind==='pad'?1700:2400,t);
  const attack=kind==='pad'?1.7:0.025;
  envelope.gain.setValueAtTime(0,t);
  envelope.gain.linearRampToValueAtTime(volume,t+attack);
  if(kind==='pad'){
   envelope.gain.setValueAtTime(volume,t+Math.max(attack,duration-2.5));
   envelope.gain.linearRampToValueAtTime(0,t+duration);
  }else{
   envelope.gain.exponentialRampToValueAtTime(Math.max(volume*0.15,.0001),t+Math.min(duration-0.15,1.2));
   envelope.gain.linearRampToValueAtTime(0,t+duration);
  }
  osc.connect(filter);filter.connect(envelope);envelope.connect(master);
  osc.start(t);osc.stop(t+duration+0.04);
  osc.onended=()=>{osc.disconnect();filter.disconnect();envelope.disconnect()};
 }
 function score(t,i){
  const c=chords[i],melody=contours[i];
  c.forEach((n,j)=>voice(n,t,cycleSeconds+1.0,j===0?.055:.032,'pad'));
  melody.forEach((n,j)=>voice(n,t+1.15+j*1.42,2.25,.07,'harp'));
  voice(c[0]+12,t+.35,2.2,.038,'harp');
  voice(c[2]+12,t+3.6,2.1,.032,'harp');
 }
 function queue(){
  if(!ctx||ctx.state!=='running'||!playing)return;
  while(nextStart<ctx.currentTime+1.2){
   score(nextStart,index);
   nextStart+=cycleSeconds;
   index=(index+1)%chords.length;
  }
 }
 function initialise(){
  if(ctx||!AudioCtx)return;
  ctx=new AudioCtx();
  master=ctx.createGain();
  master.gain.value=.19; // Low default volume, appropriate for background listening.
  const highpass=ctx.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=90;
  master.connect(highpass);highpass.connect(ctx.destination);
 }
 async function play(){
  if(playing)return true;
  try{
   if(approvedRecordingUrl){
    if(!recording){
     recording=new Audio(approvedRecordingUrl);
     recording.loop=true;recording.preload='auto';recording.volume=.32;
    }
    await recording.play();
   }else{
    if(!AudioCtx){setButton(false,'Audio unavailable in this browser');return false}
    initialise();
    await ctx.resume();
    if(playing)return true; // Avoid double scheduling if browser unblocks a pending load-time attempt on tap.
    if(ctx.state!=='running')throw Error('Audio is not running');
    nextStart=ctx.currentTime+.12;
    playing=true;queue();interval=window.setInterval(queue,280);
   }
   playing=true;setButton(true,'Pause background music');
   return true;
  }catch(e){
   playing=false;setButton(false,'Enable background sound');
   return false;
  }
 }
 function pause(){
  playing=false;if(interval){clearInterval(interval);interval=null}
  if(recording)recording.pause();
  if(ctx&&ctx.state==='running')ctx.suspend().catch(()=>{});
  setButton(false,'Play background music');
 }
 button.addEventListener('click',()=>{playing?pause():play()});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&playing)pause();
 });
 setButton(false,'Enable background sound');
 // Try audible autoplay once; Safari/iOS and many desktop browsers reject until a tap.
 window.addEventListener('load',()=>{play()}, {once:true});
})();
