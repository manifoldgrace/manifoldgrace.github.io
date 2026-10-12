(() => {
'use strict';
const regions = document.querySelectorAll('.travel-tax-country, .travel-tax-region, .travel-tax-area');
const places = document.querySelectorAll('.england-place, .travel-landmark-list > details');
function titleOf(element) {
  return element.querySelector(':scope > summary')?.textContent.trim().replace(/\s*·\s*\d+\s*destinations?$/i,'') || '';
}
function contextOf(element) {
  const parts=[];let current=element;
  while(current){if(current.matches?.('.travel-tax-country')){const name=titleOf(current);if(name&&!parts.includes(name))parts.push(name);}current=current.parentElement;}
  return parts.join(', ');
}
function queryOf(element) {
  if(element.matches('.england-place, .travel-landmark-list > details')) {
    const ownLink=[...element.querySelectorAll('a[href*="openstreetmap.org/search"]')].find(a=>a.closest('details')===element);
    if(ownLink){try {const query=new URL(ownLink.href).searchParams.get('query');if(query)return query;}catch {}}
  }
  const name=titleOf(element), context=contextOf(element);
  return context&&context!==name?name+', '+context:name;
}
function isOpen(zone) {
  for(let parent=zone.parentElement;parent;parent=parent.parentElement){if(parent.tagName==='DETAILS'&&!parent.open)return false;if(parent.hidden)return false;}
  return true;
}
function unload(zone) {
  const iframe=zone.querySelector('iframe');if(iframe)iframe.remove();
  const button=zone.querySelector('button');if(button)button.hidden=false;
  zone.dataset.loaded='false';
}
function load(zone) {
  if(zone.dataset.loaded==='true'||!isOpen(zone))return;
  const frame=document.createElement('iframe');
  frame.title='Interactive map of '+zone.dataset.localMapName;
  frame.src='https://www.google.com/maps?q='+encodeURIComponent(zone.dataset.localMapQuery)+'&z='+zone.dataset.localMapZoom+'&output=embed';
  frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.allowFullscreen=true;frame.className='local-area-map-frame';
  zone.querySelector('.local-area-map-viewport').appendChild(frame);
  zone.querySelector('button').hidden=true;zone.dataset.loaded='true';
}
const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)load(entry.target);});
},{rootMargin:'120px',threshold:.01}):null;
function attach(target,name,query,zoom) {
  const zone=document.createElement('div');zone.className='local-area-map';
  zone.dataset.localMapName=name;zone.dataset.localMapQuery=query;zone.dataset.localMapZoom=String(zoom);zone.dataset.loaded='false';
  const viewport=document.createElement('div');viewport.className='local-area-map-viewport';
  const button=document.createElement('button');button.type='button';button.className='local-area-map-load';button.textContent='Load map of '+name;
  button.addEventListener('click',()=>load(zone));viewport.appendChild(button);zone.appendChild(viewport);
  const foot=document.createElement('div');foot.className='local-area-map-caption';
  const help=document.createElement('span');help.textContent='Pan, pinch or use + / − to explore nearby places.';
  const link=document.createElement('a');link.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open full map ↗';
  foot.appendChild(help);foot.appendChild(link);zone.appendChild(foot);target.appendChild(zone);
  if(observer)observer.observe(zone);
  return zone;
}
places.forEach(place=>{
  const name=titleOf(place);if(!name)return;
  const target=place.querySelector(':scope > .england-place-copy')||place;
  attach(target,name,queryOf(place),place.matches('.england-place')?11:15);
});
regions.forEach(region=>{
  const name=titleOf(region);if(!name||name==='Visitor regions & sites')return;
  const holder=document.createElement('details');holder.className='local-area-map-details';
  const summary=document.createElement('summary');summary.textContent='Map of '+name;holder.appendChild(summary);
  region.querySelector(':scope > summary').after(holder);
  const zoom=region.matches('.travel-tax-country')?4:7;
  attach(holder,name,queryOf(region),zoom);
});
document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
  const zones=details.querySelectorAll('.local-area-map');
  if(!details.open){zones.forEach(unload);return;}
  zones.forEach(zone=>{
    if(observer){observer.unobserve(zone);observer.observe(zone);}
    else {const box=zone.getBoundingClientRect();if(box.top<window.innerHeight+120&&box.bottom>-120)load(zone);}
  });
}));
document.querySelectorAll('[data-local-map-query]').forEach(element=>{
  if(!element.classList.contains('local-area-map'))attach(element,element.dataset.localMapName||element.dataset.localMapQuery,element.dataset.localMapQuery,Number(element.dataset.localMapZoom)||10);
});
})();