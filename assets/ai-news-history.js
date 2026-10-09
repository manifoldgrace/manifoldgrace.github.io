(() => {
  'use strict';
  const windowEl=document.getElementById('ai-news-window'),track=document.getElementById('ai-news-track');
  if(!windowEl||!track)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let hovering=false,touching=false,last=0,direction=1;
  track.addEventListener('pointerenter',()=>hovering=true);
  track.addEventListener('pointerleave',()=>hovering=false);
  track.addEventListener('touchstart',()=>touching=true,{passive:true});
  track.addEventListener('touchend',()=>touching=false,{passive:true});
  track.addEventListener('touchcancel',()=>touching=false,{passive:true});
  function frame(now){
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(windowEl.open&&!document.hidden&&!reduced.matches&&!hovering&&!touching&&!track.contains(document.activeElement)){
      const end=track.scrollWidth-track.clientWidth;
      if(end>0){track.scrollLeft+=direction*32*dt;if(track.scrollLeft>=end-1)direction=-1;if(track.scrollLeft<=0)direction=1;}
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
