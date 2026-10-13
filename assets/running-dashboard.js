(() => {
  'use strict';
  const examples = [
    {name:'Example 5 km',distance:'5.00 km',time:'30:00',pace:'6:00',path:'M200 260L200 100L500 100L650 200L650 260Z',splits:[['1','1 km','6:10','6:10'],['2','1 km','6:05','6:05'],['3','1 km','6:00','6:00'],['4','1 km','5:55','5:55'],['5','1 km','5:50','5:50']]},
    {name:'Example 10 km',distance:'10.00 km',time:'1:00:00',pace:'6:00',path:'M200 260L200 70L700 70L760 250L650 400L300 400L200 260Z',splits:[['First half','5 km','30:30','6:06'],['Second half','5 km','29:30','5:54']]},
    {name:'Example half marathon',distance:'21.10 km',time:'2:06:36',pace:'6:00',path:'M200 260L100 100L450 50L800 100L800 400L450 450L100 400L200 260Z',splits:[['1','5 km','30:00','6:00'],['2','5 km','30:00','6:00'],['3','5 km','30:00','6:00'],['4','5 km','30:00','6:00'],['Finish','1.1 km','6:36','6:00']]}
  ];
  const el=id=>document.getElementById(id);
  document.querySelectorAll('[data-run]').forEach(button=>button.addEventListener('click',()=>{
    const d=examples[Number(button.dataset.run)];
    document.querySelectorAll('[data-run]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    for(const key of ['title','distance','time','pace'])el('run-'+key).textContent=key==='title'?d.name:d[key];
    el('run-route').setAttribute('d',d.path);el('run-splits').replaceChildren();
    d.splits.forEach(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});el('run-splits').append(tr);});
  }));
  const map=el('run-map'),layer=el('run-map-layer');let zoom=1,x=0,y=0,drag;
  function render(){layer.setAttribute('transform',`translate(${x} ${y}) translate(450 250) scale(${zoom}) translate(-450 -250)`);el('run-map-status').textContent=Math.round(zoom*100)+'%';}
  function scale(amount){zoom=Math.max(.75,Math.min(3,zoom+amount));render();}
  el('run-zoom-in').addEventListener('click',()=>scale(.25));el('run-zoom-out').addEventListener('click',()=>scale(-.25));el('run-reset').addEventListener('click',()=>{zoom=1;x=y=0;render();});
  map.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};map.setPointerCapture(e.pointerId);});
  map.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const r=map.getBoundingClientRect();x+=(e.clientX-drag.x)*900/r.width;y+=(e.clientY-drag.y)*500/r.height;drag.x=e.clientX;drag.y=e.clientY;render();});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>map.addEventListener(type,()=>{drag=null;}));
  map.addEventListener('keydown',e=>{const move={ArrowLeft:[30,0],ArrowRight:[-30,0],ArrowUp:[0,30],ArrowDown:[0,-30]}[e.key];if(move){e.preventDefault();x+=move[0];y+=move[1];render();}else if(e.key==='+'||e.key==='='){e.preventDefault();scale(.25);}else if(e.key==='-'){e.preventDefault();scale(-.25);}});
  document.querySelector('[data-run="0"]').click();render();
})();
