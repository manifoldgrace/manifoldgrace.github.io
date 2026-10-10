(() => {
"use strict";
const root=document.getElementById("brainAtlas");
if(!root)return;
const methods=[
{id:"mri",short:"MRI",title:"Structural MRI",group:"Anatomy",signal:"Magnetic resonance · tissue contrast",measures:"Detailed brain anatomy and differences between soft tissues.",limit:"Does not directly record moment-to-moment electrical firing.",visual:"Grayscale-style anatomical cross-section."},
{id:"ct",short:"CT",title:"CT scan",group:"Anatomy",signal:"X-ray attenuation",measures:"Cross-sectional brain and skull anatomy; useful in time-sensitive clinical imaging.",limit:"Uses ionising radiation and generally offers less soft-tissue contrast than MRI.",visual:"Bright skull ring with darker brain tissue."},
{id:"fmri",short:"fMRI",title:"Functional MRI (BOLD)",group:"Indirect function",signal:"Blood-oxygen-level-dependent changes",measures:"Changes in the BOLD signal linked indirectly to neural activity.",limit:"A BOLD map is not a recording of individual neurons firing.",visual:"Activation-colour overlays on anatomy, with a signal trend."},
{id:"diffusion",short:"Diffusion MRI",title:"Diffusion MRI / tractography",group:"Connections",signal:"Water diffusion direction",measures:"Water movement used to estimate white-matter organisation.",limit:"Reconstructed streamlines are not literal photographs of nerve fibres.",visual:"Colour-coded estimated fibre orientations."},
{id:"pet",short:"PET",title:"Positron emission tomography",group:"Molecular",signal:"Positron-emitting radiotracer",measures:"Tracer-dependent molecular or metabolic distribution in the brain.",limit:"Colours depend on tracer and display settings; PET does not simply show thoughts.",visual:"Colour-coded tracer uptake over anatomy."},
{id:"spect",short:"SPECT",title:"Single-photon emission CT",group:"Molecular",signal:"Gamma-emitting radiotracer",measures:"Tracer distribution, including cerebral perfusion in some examinations.",limit:"The physiological interpretation depends on which tracer is used.",visual:"Schematic gamma-camera acquisition and tracer map."},
{id:"eeg",short:"EEG",title:"Electroencephalography",group:"Neural signals",signal:"Electrical potentials at scalp",measures:"Very fast voltage changes associated with brain electrical activity.",limit:"Scalp signals do not pinpoint every active neuron or provide anatomical slices.",visual:"Head electrodes and several time-series traces."},
{id:"meg",short:"MEG",title:"Magnetoencephalography",group:"Neural signals",signal:"Tiny neural-current-generated magnetic fields",measures:"Millisecond-scale magnetic signals recorded around the head.",limit:"Source locations are inferred using models; the sensors do not take an MRI-like image.",visual:"Sensor arrangement and fast magnetic signal."},
{id:"fnirs",short:"fNIRS",title:"Functional near-infrared spectroscopy",group:"Indirect function",signal:"Near-infrared light absorption",measures:"Estimates changes in oxygenated and deoxygenated haemoglobin near the cortex.",limit:"Limited depth; signal can include scalp and other non-neural influences.",visual:"Light-source optodes and paired oxygenation curves."},
{id:"tcd",short:"Doppler",title:"Transcranial Doppler ultrasound",group:"Blood flow",signal:"Ultrasound Doppler frequency shift",measures:"Direction and velocity of blood in major cerebral arteries.",limit:"Measures arterial flow, not neural activity or a full image of brain tissue.",visual:"Probe, cerebral vessel and blood-velocity spectrum."}
];
const btns=root.querySelector("#brainAtlasTabs"),rail=root.querySelector("#brainAtlasRail"),img=root.querySelector("#brainAtlasImage");
const title=root.querySelector("#brainAtlasTitle"),group=root.querySelector("#brainAtlasGroup");
const signal=root.querySelector("#brainAtlasSignal"),measure=root.querySelector("#brainAtlasMeasures"),limit=root.querySelector("#brainAtlasLimit"),note=root.querySelector("#brainAtlasVisualNote");
const count=root.querySelector("#brainAtlasCount"),prev=root.querySelector("#brainAtlasPrevious"),next=root.querySelector("#brainAtlasNext");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
let current=0;
function make(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;}
for(let i=0;i<methods.length;i++){
 const m=methods[i];
 const button=make("button","brain-atlas-tab",m.short);
 button.type="button";button.id="brainAtlasTab"+i;button.setAttribute("role","tab");
 button.setAttribute("aria-controls","brainAtlasPanel");button.setAttribute("aria-selected",String(!i));
 button.tabIndex=i?-1:0;button.dataset.index=String(i);
 button.title=m.title;button.addEventListener("click",()=>show(i));
 button.addEventListener("keydown",e=>{let d=0;if(e.key==="ArrowRight")d=1;else if(e.key==="ArrowLeft")d=-1;else if(e.key==="Home")d=-100;else if(e.key==="End")d=100;else return;e.preventDefault();show(Math.max(0,Math.min(methods.length-1,d===100?methods.length-1:d===-100?0:current+d)),true);});
 btns.append(button);
 const thumb=make("button","brain-atlas-thumb");thumb.type="button";thumb.dataset.index=String(i);thumb.setAttribute("aria-label","View "+m.title);
 const picture=make("img");picture.src="assets/learning/brain-modalities/"+m.id+".svg";picture.alt="";picture.loading=i?"lazy":"eager";picture.width=160;picture.height=90;
 thumb.append(picture,make("span","",m.short));thumb.addEventListener("click",()=>show(i));rail.append(thumb);
}
const buttons=[...btns.querySelectorAll("button")],thumbs=[...rail.querySelectorAll("button")];
const motion=()=>reduced.matches?"instant":"smooth";
function show(i,focus=false){
 current=(i+methods.length)%methods.length;
 const m=methods[current];
 img.src="assets/learning/brain-modalities/"+m.id+".svg";
 img.alt="Original educational "+m.title+" illustration showing "+m.visual.toLowerCase()+" Not clinical or patient-derived imaging.";
 title.textContent=m.title;group.textContent=m.group;signal.textContent=m.signal;measure.textContent=m.measures;limit.textContent=m.limit;
 note.textContent="Visual: "+m.visual;
 count.textContent=(current+1)+" / "+methods.length;
 buttons.forEach((b,j)=>{b.setAttribute("aria-selected",String(j===current));b.tabIndex=j===current?0:-1;});
 thumbs.forEach((b,j)=>b.setAttribute("aria-pressed",String(j===current)));
 thumbs[current].scrollIntoView({block:"nearest",inline:"nearest",behavior:motion()});
 if(focus)buttons[current].focus({preventScroll:true});
}
prev.addEventListener("click",()=>show(current-1));
next.addEventListener("click",()=>show(current+1));
let downX=null;
img.addEventListener("pointerdown",e=>{if(e.pointerType==="touch")downX=e.clientX;});
img.addEventListener("pointerup",e=>{if(downX===null)return;const delta=e.clientX-downX;downX=null;if(Math.abs(delta)>45)show(current+(delta<0?1:-1));});
img.addEventListener("pointercancel",()=>{downX=null;});
root.querySelector("#brainAtlasPanel").addEventListener("keydown",e=>{if(e.target.closest("button"))return;if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();show(current+(e.key==="ArrowRight"?1:-1));}});
show(0);
})();