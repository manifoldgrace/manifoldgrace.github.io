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
const beat=1.13;
const bar=beat*4;
/*
 * Original composition: "A Gentle Ascent" (2026).
 * Independent melodic material. No quoted phrases or interpolations.
 * Flowing 32-bar through-composed arc: invitation (1–8), companionship
 * (9–16), widening outlook (17–24), and an affirmative return (25–32).
 * Bass inversions let the harmony move in steps rather than leap.
 */
const H={
 D:{bass:38,notes:[50,54,57,62,66]},
 AonC:{bass:49,notes:[49,52,57,61,64]},
 Bm:{bass:47,notes:[47,54,59,62,66]},
 G:{bass:43,notes:[43,50,55,59,62]},
 GonB:{bass:47,notes:[47,50,55,59,62]},
 Em:{bass:40,notes:[52,55,59,64,67]},
 A:{bass:45,notes:[45,52,57,61,64]},
 DonF:{bass:42,notes:[54,57,62,66,69]}
};
const plan=[
 'D','AonC','Bm','G', 'Em','GonB','A','D',
 'D','DonF','G','A', 'Bm','G','Em','A',
 'G','D','AonC','Bm', 'G','Em','A','D',
 'D','G','Bm','A', 'G','A','D','D'
];
// Lead contour indices from the local chord; transformed by register rather
// than reusing a fixed four-note pattern across every bar.
const gestures=[
 [0,1,2,3],[1,2,3,2],[0,2,1,3],[2,1,0],
 [1,2,3,1],[0,1,3,2],[2,3,2,1],[1,2,0],
 [0,2,3,2],[1,2,3,2],[2,3,1,2],[1,3,2],
 [0,1,3,2],[3,2,1,2],[0,2,1],[1,2,3,1],
 [2,1,3,2],[0,1,2,3],[2,3,1,2],[1,3,2,1],
 [0,1,3,2],[2,1,0],[1,2,3,2],[3,2,1,0],
 [0,1,2,3],[1,3,2,3],[0,2,3,2],[3,2,1,2],
 [1,2,3,2],[2,3,2,1],[1,2,3,3],[2,1,0]
];
const noteRhythms=[
 [[.14,.88],[1.24,.96],[2.37,1.18],[3.52,.47]],
 [[.06,1.24],[1.47,.59],[2.28,.88],[3.26,.7]],
 [[.1,.63],[.89,1.05],[2.14,.71],[3.08,.78]],
 [[.08,1.46],[1.94,.9],[3.03,.79]],
 [[.06,.73],[1.01,.76],[2.04,1.3],[3.61,.34]],
 [[.11,1.22],[1.57,.79],[2.55,.65],[3.32,.62]],
 [[.15,.89],[1.24,1.21],[2.68,.66],[3.48,.43]],
 [[.13,1.47],[1.9,1.16],[3.43,.44]]
];
function voicePitch(h,index,octave=0){
 // Expressive but tempered, avoiding excessively shrill top notes.
 const notes=[h.notes[1],h.notes[2],h.notes[3],h.notes[4]];
 let p=notes[index%4]+12+octave;
 while(p>84)p-=12;
 while(p<69)p+=12;
 return p;
}
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
 filter.type='lowpass';filter.frequency.value=type==='harp'?3200:type==='wind'?2100:type==='brass'?1250:type==='bass'?950:type==='choir'?1050:1800;filter.Q.value=.56;
 const attack=type==='strings'?.28:type==='choir'?.85:type==='brass'?.55:type==='wind'?.105:type==='bass'?.085:.012;
 const release=type==='harp'?.62:type==='wind'?.32:type==='bass'?.48:type==='strings'?.59:.8;
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
  [[0,'triangle',.40],[-.045,'sine',.62],[.045,'sine',.25]]:
 type==='choir'?[[0,'sine',.9],[.03,'sine',.28]]:
 type==='wind'?[[0,'sine',.60],[.014,'triangle',.38]]:
 type==='brass'?[[0,'sine',.78],[.01,'triangle',.28]]:
 type==='bass'?[[0,'sine',.88],[-.01,'triangle',.22]]:
 [[0,'triangle',.42],[.006,'sine',.60]];
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
 const h=H[plan[i]],n=h.notes,section=Math.floor(i/8);
 const sectionGain=[.78,.87,.93,.88][section];
 const breath=[.94,1.03,.97,1.04,.96,1.01,1.04,.98][i%8];
 const g=sectionGain*breath;
 const final=i===31,opening=i<4;
 // Strings move in interdependent phrases instead of one continuous organ-like chord.
 const stringParts=[
  [n[0]+12,0,bar*.95,.039,-.46],
  [n[1]+12,.12,bar*.83,.033,-.22],
  [n[2]+12,.31,bar*.72,.030,.13],
  [n[3],.47,bar*.67,.030,.43]
 ];
 stringParts.forEach(([pitch,offset,len,amp,pan])=>
  instrument(pitch,t+offset*beat,len,amp*g,'strings',pan));
 // Connected cello and bass support. Bass changes at the harmonic transition;
 // the upper line adds movement and a sense of community without percussion.
 instrument(h.bass,t+.03*beat,bar*.9,.070*g,'bass',-.21);
 instrument(n[0]+12,t+.22*beat,bar*.76,.027*g,'strings',-.16);
 const cello=[n[1],n[2],n[1],n[3]];
 const positions=[.15,1.16,2.22,3.15];
 cello.forEach((p,j)=>{
  if(opening&&j===3)return;
  instrument(p+12,t+(positions[j]+.035*((i+j)%3))*beat,beat*(j===1?1.22:.9),.023*g,'wind',-.33);
 });
 // A unique melodic gesture in each bar, with rubato-like offsets and breaths.
 // Flute / oboe-like colour carries the foreground (never a clockwork arpeggio).
 const gesture=gestures[i],timing=noteRhythms[i%noteRhythms.length];
 gesture.forEach((k,j)=>{
  const [offset,duration]=timing[j];
  const smallShift=((i*7+j*3)%5-2)*.022;
  const dynamic=(j===gesture.length-1?.84:j===0?.88:1.0);
  instrument(voicePitch(h,k),t+(offset+smallShift)*beat,
   duration*beat*.98,.058*g*dynamic,'wind',.19);
 });
 // Antiphonal response in a second, quieter voice: deliberate dialogue.
 if(i>=4&&i<31&&i%2===1){
  instrument(voicePitch(h,(i+2)%4,-12),t+2.52*beat,1.25*beat,.023*g,'wind',-.08);
 }
 // Harp provides occasional glints, never mechanically ticking on every beat.
 const harpTouches=(i%4===0)?[[.11,0],[1.75,2],[3.38,1]]:
  (i%4===1)?[[.22,1],[2.72,3]]:
  (i%4===2)?[[.58,0],[2.06,2],[3.54,1]]:
  [[.27,2],[2.56,1]];
 harpTouches.forEach(([offset,k],j)=>
  instrument(voicePitch(h,k),t+(offset+.028*j)*beat,beat*(j===0?1.36:1.02),
  .025*g,'harp',j%2===0?-.23:.29));
 // Woodwind-like ensemble and lightly breathed choir enter gradually.
 if(i>=8&&i<=29){
  instrument(n[2]+12,t+.65*beat,2.78*beat,.015*g,'choir',-.12);
  if(i>=16)instrument(n[1]+12,t+1.07*beat,2.12*beat,.015*g,'choir',.16);
 }
 // Warm restrained horns only at the ends of four-bar phrases.
 if([7,11,15,19,23,27,30].includes(i)){
  instrument(n[2]+12,t+1.0*beat,2.68*beat,.024*g,'brass',-.12);
  instrument(n[1]+12,t+1.35*beat,2.3*beat,.020*g,'brass',.23);
 }
 // Closing bar settles into a clear major tonic, a warm completed cadence.
 if(final){
  instrument(62,t+.03,bar*.97,.041,'strings',-.34);
  instrument(69,t+.12,bar*.85,.029,'wind',.24);
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
