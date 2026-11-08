/*
 * Manifold Grace — original instrumental study, "Continuity".
 * A self-contained, browser-synthesised composition, with no samples,
 * borrowed soundtrack melodies, third-party audio, or external libraries.
 * Orchestral-style voices are approximations, not recorded human players.
 * Browser rules may prevent audible autoplay before user interaction.
 */
(()=>{
'use strict';
const button=document.getElementById('mg-music-play');
if(!button)return;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
const approvedRecordingUrl=''; // Reserved for a future recording with verified publication rights.
const hz=n=>440*Math.pow(2,(n-69)/12);
const beat=1.22;
const bar=beat*4;
/*
 * D-major harmonic plan. Each musical block lasts four beats.
 * Unambiguous triads; active melodic notes are chord tones,
 * allowing the parts to blend while phrasing, timbre and dynamics evolve.
 * 32 bars: introduction, two developments, reflective bridge, return,
 * and a full cadence. Last and first chords are both D major for looping.
 */
const H={
 D:{bass:38,notes:[50,54,57,62,66],lead:[74,76,78,81]},
 G:{bass:43,notes:[55,59,62,67,71],lead:[79,81,83,79]},
 Bm:{bass:47,notes:[59,62,66,71,74],lead:[78,74,83,78]},
 A:{bass:45,notes:[57,61,64,69,73],lead:[76,81,85,81]},
 Em:{bass:40,notes:[52,55,59,64,67],lead:[76,79,83,79]},
 Fsm:{bass:42,notes:[54,57,61,66,69],lead:[78,81,85,81]}
};
const plan=[
 'D','G','Bm','A', 'D','G','Em','A',
 'D','Bm','G','A', 'Bm','G','D','A',
 'G','D','Em','A', 'Bm','G','D','A',
 'D','G','Bm','A', 'G','A','D','D'
];
const melody=[
 [74,78,81,78],[79,83,86,79],[78,83,86,83],[81,85,88,81],
 [78,81,86,81],[79,83,86,83],[76,79,83,79],[76,81,85,81],
 [81,86,90,86],[83,86,90,86],[79,83,86,83],[81,85,88,85],
 [83,86,90,86],[83,86,91,86],[81,86,90,86],[81,85,88,85],
 [79,83,86,83],[78,81,86,81],[76,79,83,79],[76,81,85,81],
 [78,83,86,83],[79,83,86,83],[78,81,86,81],[81,85,88,85],
 [81,86,90,86],[79,83,86,83],[83,86,90,86],[81,85,88,85],
 [79,83,86,83],[81,85,88,85],[81,86,90,86],[86,81,78,74]
];
let ctx=null,main=null,dry=null,room=null,recording=null;
let interval=null,playing=false,playBus=null,nextBar=0,barIndex=0,activeVoices=new Set();
let playingPromise=null;
let firstInteractionListening=false;
const firstInteractionOptions={capture:true,passive:true};
function removeFirstInteractionFallback(){
 if(!firstInteractionListening)return;
 firstInteractionListening=false;
 document.removeEventListener('pointerdown',firstInteraction,firstInteractionOptions);
 document.removeEventListener('touchstart',firstInteraction,firstInteractionOptions);
 document.removeEventListener('keydown',firstInteraction,true);
}
function firstInteraction(event){
 if(playing){removeFirstInteractionFallback();return;}
 if(event.type==='keydown' && (event.repeat||event.key==='Tab'||event.key==='Shift'||event.key==='Control'||event.key==='Alt'||event.key==='Meta'))return;
 if(event.target && (button.contains(event.target)||event.target.closest?.('.mg-loader-enable-sound')))return;
 // AudioContext.resume must be invoked directly inside the trusted interaction.
 // In particular, do not await a prior pending autoplay promise before resuming.
 if(ctx&&ctx.state!=='running')ctx.resume().catch(()=>{});
 play();
}
function installFirstInteractionFallback(){
 if(firstInteractionListening||playing)return;
 firstInteractionListening=true;
 document.addEventListener('pointerdown',firstInteraction,firstInteractionOptions);
 document.addEventListener('touchstart',firstInteraction,firstInteractionOptions);
 document.addEventListener('keydown',firstInteraction,true);
}
let startupAttempted=false;
let loaderSoundButton=null;
function loaderPrompt(show){
 const loader=document.querySelector('.mg-loader-screen');
 if(!loader){if(loaderSoundButton)loaderSoundButton.hidden=true;return}
 if(!loaderSoundButton){
  loaderSoundButton=document.createElement('button');
  loaderSoundButton.type='button';
  loaderSoundButton.className='mg-loader-enable-sound';
  loaderSoundButton.textContent='Enable sound';
  loaderSoundButton.setAttribute('aria-label','Enable Manifold Grace homepage music');
  loaderSoundButton.style.cssText='appearance:none;border:1px solid #ffffff99;border-radius:9999px;background:#111;color:#fff;padding:12px 20px;min-height:44px;font:500 13px system-ui;letter-spacing:.02em;cursor:pointer;z-index:2';
  loaderSoundButton.addEventListener('click',()=>{play()});
  loader.appendChild(loaderSoundButton);
 }
 loaderSoundButton.hidden=!show;
}
function label(isOn,message){
 button.setAttribute('aria-pressed',String(isOn));
 button.setAttribute('aria-label',message);
 button.title=message;
 const path=button.querySelector('svg path');
 if(path)path.setAttribute('d',isOn?'M6 4h4v16H6z M14 4h4v16h-4z':'M7 4.5v15l12-7.5z');
}
function initialise(){
 if(ctx)return;
 ctx=new AudioCtx();
 main=ctx.createGain();main.gain.value=.46;
 const limiter=ctx.createDynamicsCompressor();
 limiter.threshold.value=-13;limiter.knee.value=24;limiter.ratio.value=1.8;
 limiter.attack.value=.015;limiter.release.value=.35;
 const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=70;
 main.connect(hp);hp.connect(limiter);limiter.connect(ctx.destination);
 // A modest, short diffuse room gives cohesion without huge, empty reverb tails.
 dry=ctx.createGain();dry.gain.value=.84;dry.connect(main);
 room=ctx.createDelay(1.0);room.delayTime.value=.22;
 const feedback=ctx.createGain();feedback.gain.value=.16;
 const wet=ctx.createGain();wet.gain.value=.13;
 room.connect(wet);wet.connect(main);
 room.connect(feedback);feedback.connect(room);
}
function beginBus(){
 playBus=ctx.createGain();
 playBus.gain.value=1;
 playBus.connect(dry);
 playBus.connect(room);
}
function instrument(note,start,length,amount,type,pan=0){
 if(!ctx||!playBus)return;
 const end=start+length;
 const gain=ctx.createGain();
 const filter=ctx.createBiquadFilter();
 const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
 const freq=hz(note);
 filter.type='lowpass';filter.frequency.value=type==='harp'?2700:type==='wind'?1550:type==='brass'?1150:type==='bass'?1150:1450;filter.Q.value=.56;
 const attack=type==='strings'?.62:type==='choir'?.9:type==='brass'?.9:type==='wind'?.25:type==='bass'?.24:.024;
 const release=type==='harp'?1:type==='wind'?.66:type==='bass'?.72:.9;
 const peak=start+Math.min(attack,length*.4);
 const sustain=Math.max(peak+.05,end-release);
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.linearRampToValueAtTime(Math.max(amount,.0002),peak);
 if(type==='harp'){
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,amount*.18),Math.max(peak+.1,sustain));
 }else{
  gain.gain.setValueAtTime(Math.max(.0002,amount*.87),sustain);
 }
 gain.gain.linearRampToValueAtTime(.0001,end);
 if(panner){filter.connect(panner);panner.pan.value=pan;panner.connect(gain)}
 else filter.connect(gain);
 gain.connect(playBus);
 const oscillators=[];
 const layers=type==='strings'?
  [[0,'sine',.74],[-.045,'triangle',.18],[.045,'sine',.30]]:
 type==='choir'?[[0,'sine',.9],[.03,'sine',.28]]:
 type==='wind'?[[0,'sine',.78],[.014,'triangle',.24]]:
 type==='brass'?[[0,'sine',.78],[.01,'triangle',.28]]:
 type==='bass'?[[0,'sine',.88],[-.01,'triangle',.22]]:
 [[0,'sine',.75],[.006,'triangle',.19]];
 layers.forEach(([cents,shape,level])=>{
  const o=ctx.createOscillator();
  o.type=shape;
  o.frequency.setValueAtTime(freq*Math.pow(2,cents/1200),start);
  const g=ctx.createGain();g.gain.value=level;
  o.connect(g);g.connect(filter);
  o.start(start);o.stop(end+.03);
  oscillators.push(o);
  activeVoices.add(o);
  o.onended=()=>{activeVoices.delete(o);o.disconnect();g.disconnect()};
 });
}
function score(t,i){
 const h=H[plan[i]],notes=h.notes;
 const phase=Math.floor(i/4),strength=[.67,.76,.89,.83,.72,.9,.93,.8][phase];
 const motion=i>=8&&i<16?1.13:i>=24&&i<32?1.08:1;
 const ending=i===31;
 const finishLength=ending?bar-.07:bar-.2;
 // Full middle-register string ensemble with explicit voice-leading.
 notes.forEach((n,j)=>instrument(n,t,finishLength,(j===0?.05:.032)*strength,'strings',[-.52,-.27,0,.25,.5][j]));
 instrument(h.bass,t,bar-.2,.085*strength,'bass',-.16);
 instrument(h.bass+12,t+.18,bar-.48,.033*strength,'strings',-.35);
 // Airy choir-like layer enters in the developed passages: no vocals or words.
 if(i>=4) {
  [notes[2]+12,notes[3]+12].forEach((n,j)=>
   instrument(n,t+.18,bar-.55,.024*strength,'choir',j===0?-.25:.25));
 }
 // A continuous foreground melodic phrase; no need to stretch sparse notes over silence.
 const phrase=melody[i];
 phrase.forEach((n,j)=>{
  const start=t+j*beat+.08;
  instrument(n,start,beat*.98,.067*strength*motion,'wind',.12);
  // Soft harmonic doubling adds body without overpowering the melody.
  if(i>=8&&i<31&&j%2===0)instrument(n-12,start+.07,beat*.88,.025*strength,'strings',.42);
 });
 // Luminous harp arpeggiation: eight regular notes per bar.
 const arp=[0,2,3,4,3,2,1,2];
 arp.forEach((k,j)=>instrument(notes[k]+12,t+j*(beat/2)+.02,beat*.72,.028*strength,'harp',j%2?-.32:.32));
 // Warm brass crescendos are reserved for selected phrases; never constant or bombastic.
 if([7,11,14,23,27,29,30].includes(i)) {
  instrument(notes[2]+12,t+beat*1.2,beat*2.6,.030*strength,'brass',-.15);
  instrument(notes[3]+12,t+beat*1.25,beat*2.5,.026*strength,'brass',.2);
 }
}
function queue(){
 if(!playing||!ctx||ctx.state!=='running')return;
 while(nextBar<ctx.currentTime+.85){
  score(nextBar,barIndex);
  nextBar+=bar;
  barIndex=(barIndex+1)%plan.length;
 }
}
function stop(){
 playing=false;
 if(interval!==null){clearInterval(interval);interval=null}
 if(recording)recording.pause();
 if(ctx&&playBus){
  // Fade existing scheduled notes out instead of leaving them suspended.
  playBus.gain.cancelScheduledValues(ctx.currentTime);
  playBus.gain.setTargetAtTime(.0001,ctx.currentTime,.08);
  playBus=null;
 }
 label(false,'Play background music');
}
async function play(){
 if(playing)return true;
 if(playingPromise)return playingPromise;
 playingPromise=(async()=>{
  try{
   if(approvedRecordingUrl){
    if(!recording){recording=new Audio(approvedRecordingUrl);recording.loop=true;recording.volume=.38}
    await recording.play();
   }else{
    if(!AudioCtx){label(false,'Audio unavailable in this browser');loaderPrompt(false);return false}
    initialise();
    await Promise.race([ctx.resume(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Audio start requires a tap')),900))]);
    if(ctx.state!=='running')throw Error('Audio start blocked');
    beginBus();
    nextBar=ctx.currentTime+.12;barIndex=0;
    playing=true;queue();interval=setInterval(queue,210);
   }
   playing=true;removeFirstInteractionFallback();label(true,'Pause background music');loaderPrompt(false);return true;
  }catch{
   playing=false;installFirstInteractionFallback();label(false,'Enable background sound');loaderPrompt(true);return false;
  }finally{playingPromise=null}
 })();
 return playingPromise;
}
button.addEventListener('click',()=>{playing?stop():play()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop()});
label(false,'Enable background sound');
// Start when the DOM is ready, while the loading screen is still on top.
function attemptEarlyPlayback(){
 if(startupAttempted)return;startupAttempted=true;
 installFirstInteractionFallback();
 play().then(ok=>{if(!ok){installFirstInteractionFallback();loaderPrompt(true)}});
}
if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',attemptEarlyPlayback,{once:true});
}else{
 attemptEarlyPlayback();
}
// If the loader renders later than the first attempt, offer the same user-gesture fallback.
window.addEventListener('load',()=>{
 if(!playing && loaderSoundButton===null)loaderPrompt(true);
},{once:true});
})();
