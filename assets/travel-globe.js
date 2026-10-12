(() => {
'use strict';
const root = document.getElementById('travel-globe');
if (!root) return;
const canvas = root.querySelector('canvas'), ctx = canvas.getContext('2d');
const select = root.querySelector('[data-globe-select]');
const label = root.querySelector('[data-globe-name]');
const detail = root.querySelector('[data-globe-detail]');
const guide = root.querySelector('[data-globe-guide]');
const map = root.querySelector('[data-globe-map]');
const status = root.querySelector('[data-globe-status]');
const zoomLabel = root.querySelector('[data-globe-zoom-label]');
const pins = [{"name":"South of France","lat":43.7,"lon":7.26,"kind":"Travel notebook","fact":"How do coastal communities balance visitors, water use, local livelihoods and environmental care?","href":"#globe-notebook-0"},{"name":"Paris","lat":48.86,"lon":2.35,"kind":"Travel notebook","fact":"Who feels welcome in public space, museums and digital services, and whose histories are represented?","href":"#globe-notebook-1"},{"name":"New York & the Bronx","lat":40.85,"lon":-73.87,"kind":"Travel notebook","fact":"How do neighbourhood identity, migration, housing and access to opportunity shape different experiences of the same city?","href":"#globe-notebook-2"},{"name":"Ghana","lat":5.56,"lon":-0.2,"kind":"Travel notebook","fact":"How can family knowledge and local voices inform collaboration, respectful innovation and the questions I take into heritage research?","href":"#globe-notebook-3"},{"name":"Devon","lat":50.72,"lon":-3.53,"kind":"Travel notebook","fact":"What do rural and coastal places reveal about conservation, transport and access to services?","href":"#globe-notebook-4"},{"name":"Germany","lat":51.17,"lon":10.45,"kind":"Travel notebook","fact":"What questions about vocational learning, infrastructure and industrial innovation would be useful to explore locally?","href":"#globe-notebook-5"},{"name":"Austria","lat":47.52,"lon":14.55,"kind":"Travel notebook","fact":"How might cultural institutions and landscape management inform creative access and responsible technology?","href":"#globe-notebook-6"},{"name":"Italy","lat":42.5,"lon":12.5,"kind":"Travel notebook","fact":"How do communities preserve cultural heritage while sustaining everyday livelihoods and welcoming visitors?","href":"#globe-notebook-7"},{"name":"Spain","lat":40.42,"lon":-3.7,"kind":"Travel notebook","fact":"How do language, regional identity and visitor economies shape participation and everyday community life?","href":"#globe-notebook-8"},{"name":"Menorca","lat":39.95,"lon":4.05,"kind":"Travel notebook","fact":"What can island life teach me about water, waste, mobility and the limits of growth?","href":"#globe-notebook-9"},{"name":"Scotland","lat":56.49,"lon":-4.2,"kind":"Travel notebook","fact":"How can local identity, landscape and questions of governance inform respectful community engagement?","href":"#globe-notebook-10"},{"name":"Norfolk","lat":52.63,"lon":1.3,"kind":"Travel notebook","fact":"How do coastal and wetland places help frame questions about adaptation, conservation and community resilience?","href":"#globe-notebook-11"},{"name":"Cambridge","lat":52.21,"lon":0.12,"kind":"Travel notebook","fact":"How can research communities share knowledge and make innovation useful beyond their institutions?","href":"#globe-notebook-12"},{"name":"Bradford","lat":53.8,"lon":-1.76,"kind":"Travel notebook","fact":"How do industrial heritage and varied community perspectives inform representation, opportunity and belonging?","href":"#globe-notebook-13"},{"name":"Birmingham","lat":52.49,"lon":-1.89,"kind":"Travel notebook","fact":"What can a large urban community reveal about skills, mobility, enterprise and collaboration?","href":"#globe-notebook-14"},{"name":"Amsterdam","lat":52.37,"lon":4.9,"kind":"Travel notebook","fact":"What questions about shared streets, water and public space can inform accessible systems and responsible design?","href":"#globe-notebook-15"},{"name":"Rome","lat":41.9028,"lon":12.4964,"kind":"Destination guide","fact":"Rome is Italy’s capital, on the River Tiber.","href":"#world-place-europe-rome"},{"name":"Barcelona","lat":41.3874,"lon":2.1686,"kind":"Destination guide","fact":"Barcelona is a Mediterranean coastal city in Catalonia, Spain.","href":"#world-place-europe-barcelona"},{"name":"Athens","lat":37.9838,"lon":23.7275,"kind":"Destination guide","fact":"Athens is Greece’s capital and home to the Acropolis.","href":"#world-place-europe-athens"},{"name":"Accra","lat":5.6037,"lon":-0.187,"kind":"Destination guide","fact":"Accra is Ghana’s capital, on the Gulf of Guinea.","href":"#world-place-africa-accra"},{"name":"Cape Town","lat":-33.9249,"lon":18.4241,"kind":"Destination guide","fact":"Cape Town is a coastal city in South Africa, beside Table Mountain.","href":"#world-place-africa-cape-town"},{"name":"Marrakech","lat":31.6295,"lon":-7.9811,"kind":"Destination guide","fact":"Marrakech is an inland city in Morocco, known for its historic medina.","href":"#world-place-africa-marrakech"},{"name":"Cairo","lat":30.0444,"lon":31.2357,"kind":"Destination guide","fact":"Cairo is Egypt’s capital, on the River Nile.","href":"#world-place-africa-cairo"},{"name":"Zanzibar","lat":-6.1659,"lon":39.2026,"kind":"Destination guide","fact":"Zanzibar is an island region of Tanzania in the Indian Ocean.","href":"#world-place-africa-zanzibar"},{"name":"Tokyo","lat":35.6762,"lon":139.6503,"kind":"Destination guide","fact":"Tokyo is Japan’s capital and lies on the island of Honshu.","href":"#world-place-asia-tokyo"},{"name":"Singapore","lat":1.3521,"lon":103.8198,"kind":"Destination guide","fact":"Singapore is a city-state in Southeast Asia.","href":"#world-place-asia-singapore"},{"name":"Bangkok","lat":13.7563,"lon":100.5018,"kind":"Destination guide","fact":"Bangkok is Thailand’s capital, on the Chao Phraya River.","href":"#world-place-asia-bangkok"},{"name":"Bali","lat":-8.4095,"lon":115.1889,"kind":"Destination guide","fact":"Bali is an Indonesian island, east of Java.","href":"#world-place-asia-bali"},{"name":"Dubai","lat":25.2048,"lon":55.2708,"kind":"Destination guide","fact":"Dubai is a city and emirate in the United Arab Emirates.","href":"#world-place-asia-dubai"},{"name":"New York City","lat":40.7128,"lon":-74.006,"kind":"Destination guide","fact":"New York City is in New York State and comprises five boroughs, including the Bronx.","href":"#world-place-north-america-new-york-city"},{"name":"Toronto","lat":43.6532,"lon":-79.3832,"kind":"Destination guide","fact":"Toronto is the capital of Ontario, on Lake Ontario.","href":"#world-place-north-america-toronto"},{"name":"Vancouver","lat":49.2827,"lon":-123.1207,"kind":"Destination guide","fact":"Vancouver is a coastal city in British Columbia, Canada.","href":"#world-place-north-america-vancouver"},{"name":"Mexico City","lat":19.4326,"lon":-99.1332,"kind":"Destination guide","fact":"Mexico City is Mexico’s capital, in the country’s central highlands.","href":"#world-place-north-america-mexico-city"},{"name":"Cancún","lat":21.1619,"lon":-86.8515,"kind":"Destination guide","fact":"Cancún is on Mexico’s Caribbean coast, in the state of Quintana Roo.","href":"#world-place-north-america-cancu-n"},{"name":"Rio de Janeiro","lat":-22.9068,"lon":-43.1729,"kind":"Destination guide","fact":"Rio de Janeiro is a coastal city in south-east Brazil.","href":"#world-place-south-america-rio-de-janeiro"},{"name":"Buenos Aires","lat":-34.6037,"lon":-58.3816,"kind":"Destination guide","fact":"Buenos Aires is Argentina’s capital, beside the Río de la Plata.","href":"#world-place-south-america-buenos-aires"},{"name":"Lima","lat":-12.0464,"lon":-77.0428,"kind":"Destination guide","fact":"Lima is Peru’s capital, on the Pacific coast.","href":"#world-place-south-america-lima"},{"name":"Cusco","lat":-13.5319,"lon":-71.9675,"kind":"Destination guide","fact":"Cusco is a city in the Peruvian Andes and was the capital of the Inca Empire.","href":"#world-place-south-america-cusco"},{"name":"Cartagena","lat":10.391,"lon":-75.4794,"kind":"Destination guide","fact":"Cartagena is a port city on Colombia’s Caribbean coast.","href":"#world-place-south-america-cartagena"},{"name":"Sydney","lat":-33.8688,"lon":151.2093,"kind":"Destination guide","fact":"Sydney is the capital of New South Wales, on Australia’s east coast.","href":"#world-place-oceania-sydney"},{"name":"Melbourne","lat":-37.8136,"lon":144.9631,"kind":"Destination guide","fact":"Melbourne is the capital of Victoria, in south-east Australia.","href":"#world-place-oceania-melbourne"},{"name":"Auckland","lat":-36.8485,"lon":174.7633,"kind":"Destination guide","fact":"Auckland is a city on New Zealand’s North Island.","href":"#world-place-oceania-auckland"},{"name":"Queenstown","lat":-45.0312,"lon":168.6626,"kind":"Destination guide","fact":"Queenstown is on New Zealand’s South Island, beside Lake Wakatipu.","href":"#world-place-oceania-queenstown"},{"name":"Fiji","lat":-17.7134,"lon":178.065,"kind":"Destination guide","fact":"Fiji is an island country in the South Pacific.","href":"#world-place-oceania-fiji"},{"name":"Antarctic Peninsula","lat":-65,"lon":-64,"kind":"Destination guide","fact":"The Antarctic Peninsula extends northwards towards South America and is a major region for Antarctic ship visits.","href":"#world-place-antarctica-antarctic-peninsula"},{"name":"South Shetland Islands","lat":-62,"lon":-58,"kind":"Destination guide","fact":"The South Shetland Islands lie north of the Antarctic Peninsula.","href":"#world-place-antarctica-south-shetland-islands"},{"name":"Deception Island","lat":-62.97,"lon":-60.65,"kind":"Destination guide","fact":"Deception Island is an active volcanic island in the South Shetland Islands.","href":"#world-place-antarctica-deception-island"},{"name":"Port Lockroy","lat":-64.825,"lon":-63.494,"kind":"Destination guide","fact":"Historic Base A at Port Lockroy is on Goudier Island and is preserved as a museum.","href":"#world-place-antarctica-port-lockroy"},{"name":"Ross Sea","lat":-75,"lon":175,"kind":"Destination guide","fact":"The Ross Sea is an Antarctic sea visited by some expedition voyages from Australia or New Zealand.","href":"#world-place-antarctica-ross-sea"}];
const RAD = Math.PI / 180;
let latitude = 25, longitude = 0, zoom = 1, width = 500, height = 500, radius = 210;
let land = [], visiblePins = [], chosen = -1, frame = 0, drag = null;
const vector = (lon, lat) => { const c = Math.cos(lat * RAD); return [c * Math.sin(lon * RAD), Math.sin(lat * RAD), c * Math.cos(lon * RAD)]; };
pins.forEach(p => { p.vector = vector(p.lon, p.lat); });
function project(v) {
  const c = Math.cos(longitude * RAD), s = Math.sin(longitude * RAD);
  const horizontal = v[0] * c - v[2] * s;
  const depth = v[0] * s + v[2] * c;
  const cl = Math.cos(latitude * RAD), sl = Math.sin(latitude * RAD);
  return {x: width / 2 + radius * horizontal, y: height / 2 - radius * (v[1] * cl - depth * sl), z: v[1] * sl + depth * cl};
}
function schedule() { if (!ctx) return; if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); }); }
function line(points) {
  let started = false;
  for (const v of points) {
    const p = project(v);
    if (p.z >= 0) { if (!started) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); started = true; }
    else started = false;
  }
}
function draw() {
  ctx.clearRect(0,0,width,height);
  ctx.save();
  ctx.beginPath(); ctx.arc(width/2,height/2,radius,0,Math.PI*2); ctx.clip();
  const ocean = ctx.createRadialGradient(width*.35,height*.28,0,width/2,height/2,radius);
  ocean.addColorStop(0,'#315f65'); ocean.addColorStop(.7,'#173f49'); ocean.addColorStop(1,'#092831');
  ctx.fillStyle=ocean; ctx.fillRect(0,0,width,height);
  ctx.beginPath(); ctx.strokeStyle='#739798'; ctx.lineWidth=.55;
  for(let lat=-60;lat<=60;lat+=30){const pts=[];for(let lon=-180;lon<=180;lon+=3)pts.push(vector(lon,lat));line(pts);}
  for(let lon=-180;lon<180;lon+=30){const pts=[];for(let lat=-90;lat<=90;lat+=3)pts.push(vector(lon,lat));line(pts);}
  ctx.stroke();
  ctx.fillStyle='#a8c6b2';ctx.beginPath();
  for (const v of land) { const p=project(v); if(p.z>.015) {const dot=Math.max(.55,radius*.0068*Math.sqrt(p.z));ctx.moveTo(p.x+dot,p.y);ctx.arc(p.x,p.y,dot,0,Math.PI*2);} }
  ctx.fill();
  visiblePins = pins.map((pin,index)=>({...project(pin.vector),pin,index})).filter(p=>p.z>.02).sort((a,b)=>a.z-b.z);
  const paint = p => {
    const selected=p.index===chosen, size=selected?8:5;
    ctx.beginPath();ctx.arc(p.x,p.y,size+3,0,Math.PI*2);ctx.fillStyle='#123a43';ctx.fill();
    ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fillStyle=selected?'#fff3cb':p.pin.kind==='Travel notebook'?'#ee9971':'#f2c768';ctx.fill();
    ctx.strokeStyle='#fff6de';ctx.lineWidth=selected?2:1;ctx.stroke();
  };
  visiblePins.filter(p=>p.index!==chosen).forEach(paint);
  const selected=visiblePins.find(p=>p.index===chosen);if(selected)paint(selected);
  ctx.restore();
  ctx.beginPath();ctx.arc(width/2,height/2,radius,0,Math.PI*2);ctx.strokeStyle='#719494';ctx.lineWidth=1.5;ctx.stroke();
}
function resize() {
  const box=canvas.getBoundingClientRect();width=Math.max(240,box.width);height=width;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  radius=width*.43*zoom;schedule();
}
function setZoom(value) { zoom=Math.max(.8,Math.min(1.8,value));radius=width*.43*zoom;zoomLabel.textContent=Math.round(zoom*100)+'%';schedule(); }
function turn(dx,dy) { longitude=((longitude+dx+540)%360)-180;latitude=Math.max(-85,Math.min(85,latitude+dy));schedule(); }
function choose(index,center) {
  const p=pins[index];if(!p)return;
  chosen=index;select.value=String(index);label.textContent=p.name;
  detail.textContent=p.fact;guide.href=p.href;guide.textContent=p.kind==='Travel notebook'?'Read this travel notebook entry ↓':'Open this destination entry ↓';
  map.href='https://www.openstreetmap.org/?mlat='+p.lat+'&mlon='+p.lon+'#map=8/'+p.lat+'/'+p.lon;
  status.textContent=p.kind+' · '+p.name;
  if(center){longitude=p.lon;latitude=p.lat;}schedule();
}
for(const kind of ['Travel notebook','Destination guide']) {
  const group=document.createElement('optgroup');group.label=kind;
  pins.forEach((p,i)=>{if(p.kind===kind){const option=document.createElement('option');option.value=String(i);option.textContent=p.name;group.appendChild(option);}});
  select.appendChild(group);
}
select.addEventListener('change',()=>{if(select.value!=='')choose(Number(select.value),true);});
guide.addEventListener('click',()=>{if(guide.getAttribute('href')?.startsWith('#globe-notebook-'))document.querySelector('[data-filter="All"]')?.click();});
canvas.addEventListener('pointerdown',event=>{
  if (event.button !== 0 || drag) return;
  const box=canvas.getBoundingClientRect(),x=event.clientX-box.left,y=event.clientY-box.top;
  if(Math.hypot(x-width/2,y-height/2)>radius) return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false};
  canvas.setPointerCapture(event.pointerId);canvas.classList.add('is-dragging');
});
canvas.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>7)drag.moved=true;
  if(drag.moved)turn(-dx*180/(radius*Math.PI),dy*180/(radius*Math.PI));
  drag.x=event.clientX;drag.y=event.clientY;
});
function release(event,cancel) {
  if(!drag||drag.id!==event.pointerId)return;
  const moved=drag.moved;drag=null;canvas.classList.remove('is-dragging');
  if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  if(cancel||moved)return;
  const box=canvas.getBoundingClientRect(),x=event.clientX-box.left,y=event.clientY-box.top;
  const nearest=visiblePins.reduce((best,p)=>{const distance=Math.hypot(x-p.x,y-p.y);return distance<best.distance?{p,distance}:best;},{p:null,distance:20});
  if(nearest.p)choose(nearest.p.index,false);
}
canvas.addEventListener('pointerup',event=>release(event,false));
canvas.addEventListener('pointercancel',event=>release(event,true));
canvas.addEventListener('lostpointercapture',()=>{drag=null;canvas.classList.remove('is-dragging');});
canvas.addEventListener('keydown',event=>{
  const directions={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,12],ArrowDown:[0,-12]};
  if(directions[event.key]){event.preventDefault();turn(...directions[event.key]);}
  else if(event.key==='+'||event.key==='='){event.preventDefault();setZoom(zoom+.2);}
  else if(event.key==='-'){event.preventDefault();setZoom(zoom-.2);}
});
root.querySelectorAll('[data-globe-turn]').forEach(button=>button.addEventListener('click',()=>{const values=button.dataset.globeTurn.split(',').map(Number);turn(...values);}));
root.querySelector('[data-globe-zoom-in]').addEventListener('click',()=>setZoom(zoom+.2));
root.querySelector('[data-globe-zoom-out]').addEventListener('click',()=>setZoom(zoom-.2));
root.querySelector('[data-globe-reset]').addEventListener('click',()=>{latitude=25;longitude=0;chosen=-1;select.value='';label.textContent='Choose a place';detail.textContent='Swipe the globe, tap a pin or choose a destination above to open its entry.';guide.removeAttribute('href');guide.textContent='';map.removeAttribute('href');status.textContent='Globe reset.';setZoom(1);});
if(!ctx){status.textContent='Use the place selector and links to explore destinations.';return;}
resize();
if(typeof ResizeObserver==='function')new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
fetch('assets/travel-globe-land.json').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();}).then(data=>{
  const binary=atob(data.coordinates), bytes=Uint8Array.from(binary,c=>c.charCodeAt(0)), view=new DataView(bytes.buffer);
  land=[];for(let i=0;i<bytes.length;i+=4)land.push(vector(view.getInt16(i,true)/data.scale,view.getInt16(i+2,true)/data.scale));schedule();
}).catch(()=>{status.textContent='Coastline detail is unavailable; destination pins and the place selector still work.';});
})();