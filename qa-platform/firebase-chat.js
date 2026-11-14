import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-ai.js";
const $=id=>document.getElementById(id);
const config=globalThis.MG_FIREBASE_CHAT||{};
let chat=null, busy=false;
const setStatus=(s)=>{$("status").textContent=s};
function addTurn(role,text){
 const section=document.createElement("div");
 section.className="turn "+(role==="Model"?"model":"user");
 const heading=document.createElement("b");heading.textContent=role;
 const body=document.createElement("div");body.textContent=text;
 section.append(heading,body);$("transcript").append(section);
 $("transcript").scrollTop=$("transcript").scrollHeight;
 return body;
}
function setBusy(value){busy=value;$("send").disabled=value||!chat;$("message").disabled=value||!chat}
function reset(){if(modelInstance){chat=modelInstance.startChat({generationConfig:{maxOutputTokens:700}})}$("transcript").replaceChildren();setStatus(chat?"Ready for a new conversation.":"Connect Firebase AI Logic to enable chat.")}
let modelInstance=null;
const f=config.firebase||{};
const ok=Boolean(f.apiKey&&f.projectId&&f.appId&&config.recaptchaEnterpriseSiteKey);
if(!ok){setStatus("Not connected. Configure a free Firebase project and App Check to enable model responses.");}
else{
 try{
  const app=initializeApp(f);
  initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(config.recaptchaEnterpriseSiteKey),isTokenAutoRefreshEnabled:true});
  const ai=getAI(app,{backend:new GoogleAIBackend()});
  modelInstance=getGenerativeModel(ai,{model:config.model||"gemini-2.5-flash-lite"});
  chat=modelInstance.startChat({generationConfig:{maxOutputTokens:700}});
  $("message").disabled=false;$("send").disabled=false;
  setStatus("Connected to Firebase SDK; send a message to verify model access.");
 }catch(e){setStatus("Initialisation failed. Check Firebase project and App Check configuration.");}
}
$("compose").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!chat||busy)return;
 const input=$("message").value.trim();
 if(!input)return;
 addTurn("You",input);$("message").value="";
 setBusy(true);setStatus("Generating response…");
 try{
   const result=await chat.sendMessage(input);
   const answer=result.response.text();
   addTurn("Model",answer||"The model did not provide a text response.");
   setStatus("Response received.");
 }catch(err){
   addTurn("System","Model request failed. Check the Firebase console, App Check, model availability and free-tier quota.");
   setStatus("Request failed; this turn was not verified. Start a new conversation if retrying.");
   console.error("Firebase AI Logic error:",err);
   chat=modelInstance.startChat({generationConfig:{maxOutputTokens:700}});
 }finally{setBusy(false);$("message").focus()}
});
$("reset").addEventListener("click",reset);
