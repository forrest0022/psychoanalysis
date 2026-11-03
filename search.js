(function(){
const menu=document.querySelector(".site .menu"); if(!menu) return;
const css=document.createElement("style");
css.textContent=`.site .menu .srch{all:unset;cursor:pointer;display:inline-flex;align-items:center;align-self:center;padding:2px;border-bottom:2px solid transparent}
.site .menu .srch svg{width:1.15em;height:1.15em;display:block}
.site .menu .srch:hover{color:#EF82C8}
.site .menu .srch:focus-visible{outline:2px solid #0038FF;outline-offset:3px}
.sx{position:fixed;inset:0;z-index:1000;background:#fff;color:#0E0E0E;overflow:auto;font-family:Archivo,"Helvetica Neue",Arial,sans-serif;padding:40px max(16px,env(safe-area-inset-left,0px)) 80px}
.sx[hidden]{display:none}
.sx .in{max-width:1320px;margin:0 auto}
.sx .bar{display:flex;align-items:center;gap:16px;border-bottom:1.5px solid #0E0E0E;padding-bottom:.6rem}
.sx .bar svg{width:clamp(1.6rem,3.4vw,2.8rem);height:auto;flex:none}
.sx input{all:unset;flex:1;min-width:0;font-weight:800;font-stretch:88%;text-transform:uppercase;font-size:clamp(2rem,5.2vw,4.4rem);line-height:1.1}
.sx input::placeholder{color:#C9C9C4}
.sx .x{all:unset;cursor:pointer;font-size:clamp(1.6rem,3vw,2.4rem);line-height:1;padding:0 4px}
.sx .x:hover{color:#EF82C8}
.sx ul{list-style:none;margin:1.4rem 0 0;padding:0;columns:300px 3;column-gap:28px}
.sx li{break-inside:avoid;margin:0 0 .5em}
.sx li a{color:#0E0E0E;text-decoration:none;display:block;font-weight:600;font-size:clamp(1.25rem,2vw,1.7rem);line-height:1.2;letter-spacing:-.01em}
.sx li a span{display:block;font-weight:500;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:#77776F;margin-top:2px}
.sx li a:hover,.sx li a.act{color:#EF82C8}
.sx .none{margin-top:1.4rem;font-size:1.2rem;color:#77776F}`;
document.head.appendChild(css);
const ico=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>`;
const btn=document.createElement("button"); btn.type="button"; btn.className="srch"; btn.setAttribute("aria-label","Search"); btn.innerHTML=ico; menu.appendChild(btn);
const ov=document.createElement("div"); ov.className="sx"; ov.hidden=true; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Search");
ov.innerHTML=`<div class="in"><div class="bar">${ico}<input type="text" placeholder="Search" aria-label="Search names and schools" autocomplete="off" spellcheck="false"><button type="button" class="x" aria-label="Close search">×</button></div><ul></ul><p class="none" hidden>Nothing found.</p></div>`;
document.body.appendChild(ov);
const inp=ov.querySelector("input"), ul=ov.querySelector("ul"), none=ov.querySelector(".none");
const fold=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let data=null, act=-1;
function load(){ if(data) return Promise.resolve(); return new Promise(r=>{ const s=document.createElement("script"); s.src="search-data.js"; s.onload=()=>{ data=(window.SEARCH||[]).map(e=>({n:e[0],k:e[1],h:e[2],f:fold(e[0]+" "+(e[3]||""))})); r(); }; s.onerror=()=>{data=[];r();}; document.head.appendChild(s); }); }
function run(){ const q=fold(inp.value.trim()); act=-1;
  if(!q){ ul.innerHTML=""; none.hidden=true; return; }
  const words=q.split(/\s+/);
  const hits=data.filter(e=>words.every(w=>e.f.split(/[\s\-().]+/).some(t=>t.startsWith(w))||e.f.includes(w)))
    .sort((a,b)=>(fold(b.n).startsWith(q)-fold(a.n).startsWith(q))||a.n.localeCompare(b.n)).slice(0,60);
  ul.innerHTML=hits.map(e=>`<li><a href="${e.h}">${esc(e.n)}<span>${esc(e.k)}</span></a></li>`).join("");
  none.hidden=!!hits.length; }
function mark(){ const as=[...ul.querySelectorAll("a")]; as.forEach((a,i)=>a.classList.toggle("act",i===act)); if(as[act]) as[act].scrollIntoView({block:"nearest"}); }
function open(){ ov.hidden=false; document.documentElement.style.overflow="hidden"; load().then(run); inp.focus(); inp.select(); }
function close(){ ov.hidden=true; document.documentElement.style.overflow=""; btn.focus({preventScroll:true}); }
btn.addEventListener("click",open);
ov.querySelector(".x").addEventListener("click",close);
inp.addEventListener("input",run);
ul.addEventListener("click",e=>{ if(e.target.closest("a")) { ov.hidden=true; document.documentElement.style.overflow=""; } });
ov.addEventListener("keydown",e=>{ const as=ul.querySelectorAll("a");
  if(e.key==="Escape"){ e.preventDefault(); close(); }
  else if(e.key==="ArrowDown"&&as.length){ e.preventDefault(); act=Math.min(as.length-1,act+1); mark(); }
  else if(e.key==="ArrowUp"&&as.length){ e.preventDefault(); act=Math.max(0,act-1); mark(); }
  else if(e.key==="Enter"&&as.length){ e.preventDefault(); (as[act]||as[0]).click(); } });
document.addEventListener("keydown",e=>{ if(e.key==="/"&&ov.hidden&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){ e.preventDefault(); open(); } });
})();
