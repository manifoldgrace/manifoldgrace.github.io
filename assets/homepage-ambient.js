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
 [74,78,81,78],[79,83,81,79],[78,83,86,83],[81,85,83,81],
 [78,81,86,81],[79,83,86,83],[76,79,83,79],[76,81,85,81],
 [81,86,90,86],[83,86,88,86],[79,83,86,83],[81,85,88,85],
 [83,86,90,86],[83,86,88,86],[81,86,90,86],[81,85,88,85],
 [79,83,86,83],[78,81,86,81],[76,79,83,79],[76,81,85,81],
 [78,83,86,83],[79,83,86,83],[78,81,86,81],[81,85,88,85],
 [81,86,90,86],[79,83,86,83],[83,86,90,86],[81,85,88,85],
 [79,83,86,83],[81,85,88,85],[81,86,90,86],[86,81,78,74]
];
let ctx=null,main=null,dry=null,room=null,recording=null;
let interval=null,playing=false,playBus=null,nextBar=0,barIndex=0,activeVoices=new Set();
let playingPromise=null;
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
 main=ctx.createGain();main.gain.value=.57;
 const limiter=ctx.createDynamicsCompressor();
 limiter.threshold.value=-16;limiter.knee.value=17;limiter.ratio.value=2.8;
 limiter.attack.value=.015;limiter.release.value=.35;
 const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=70;
 main.connect(hp);hp.connect(limiter);limiter.connect(ctx.destination);
 // A modest, short diffuse room gives cohesion without huge, empty reverb tails.
 dry=ctx.createGain();dry.gain.value=.93;dry.connect(main);
 room=ctx.createDelay(1.0);room.delayTime.value=.18;
 const feedback=ctx.createGain();feedback.gain.value=.22;
 const wet=ctx.createGain();wet.gain.value=.17;
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
 filter.type='lowpass';filter.frequency.value=type==='harp'?4300:type==='wind'?2300:type==='brass'?1400:1900;
 const attack=type==='strings'?0.45:type==='choir'?0.8:type==='brass'?0.95:type==='wind'?0.18:type==='bass'?.18:.012;
 const release=type==='harp'?.8:type==='wind'?.48:type==='bass'?.55:.65;
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
  [[0,'sawtooth',.32],[-.045,'triangle',.56],[.045,'sine',.42]]:
 type==='choir'?[[0,'sine',.8],[.03,'triangle',.22]]:
 type==='wind'?[[0,'triangle',.75],[.014,'sine',.34]]:
 type==='brass'?[[0,'triangle',.74],[.01,'sawtooth',.12]]:
 type==='bass'?[[0,'triangle',.75],[-.01,'sine',.38]]:
 [[0,'triangle',.7],[.006,'sine',.26]];
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
    if(!AudioCtx){label(false,'Audio unavailable in this browser');return false}
    initialise();
    await ctx.resume();
    if(ctx.state!=='running')throw Error('Audio start blocked');
    beginBus();
    nextBar=ctx.currentTime+.12;barIndex=0;
    playing=true;queue();interval=setInterval(queue,210);
   }
   playing=true;label(true,'Pause background music');return true;
  }catch{
   playing=false;label(false,'Enable background sound');return false;
  }finally{playingPromise=null}
 })();
 return playingPromise;
}
button.addEventListener('click',()=>{playing?stop():play()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop()});
label(false,'Enable background sound');
// Attempt autoplay, but respect Safari and other browsers requiring a click.
window.addEventListener('load',()=>{play()},{once:true});
})();
