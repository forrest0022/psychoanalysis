// Private preview: a light password screen for the beta. Not real security; it keeps out anyone who just finds the link.
(function(){
  var H="d070fe5a68b56d73cebb9de9d09f3d572108f510785a929695137013e4671ef7", KEY="tm-ok";
  try{ if(localStorage.getItem(KEY)===H) return; }catch(_){}
  var d=document.documentElement; d.classList.add("tm-locked");
  var css=document.createElement("style");
  css.textContent="html.tm-locked body>*:not(#tm-gate){display:none!important}"+
  "#tm-gate{position:fixed;inset:0;z-index:9999;background:#fff;color:#0E0E0E;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Archivo,'Helvetica Neue',Arial,sans-serif}"+
  "#tm-gate form{width:min(420px,100%);display:flex;flex-direction:column;gap:18px}"+
  "#tm-gate h1{margin:0;font-size:1.4rem;letter-spacing:.01em;text-transform:uppercase}#tm-gate h1 b{font-weight:800}#tm-gate h1 i{font-style:normal;font-weight:400}"+
  "#tm-gate p{margin:0;color:#55554F;font-size:15px;line-height:1.5}"+
  "#tm-gate input{font:inherit;font-size:18px;border:0;border-bottom:2.4px solid #0E0E0E;padding:6px 0;outline:none;background:transparent}"+
  "#tm-gate input:focus{border-bottom-color:#EF82C8}"+
  "#tm-gate button{align-self:flex-start;font:inherit;font-weight:600;border:0;border-radius:999px;background:#0E0E0E;color:#fff;padding:.55em 1.3em;cursor:pointer}"+
  "#tm-gate button:hover{background:#EF82C8;color:#0E0E0E}#tm-gate .err{color:#FF5A1F;min-height:1.2em}";
  (document.head||d).appendChild(css);
  // plain-JavaScript SHA-256, so the check works on http:// pages and older browsers too
  function sha256(str){
    function r(n,x){return (x>>>n)|(x<<(32-n));}
    var K=[],Hh=[],i,j,primes=0,c=2;
    while(primes<64){ var ok=true; for(j=2;j*j<=c;j++) if(c%j===0){ok=false;break;} if(ok){ if(primes<8) Hh[primes]=(Math.pow(c,1/2)*4294967296)|0; K[primes++]=(Math.pow(c,1/3)*4294967296)|0; } c++; }
    var bytes=unescape(encodeURIComponent(str)), l=bytes.length, words=[];
    for(i=0;i<l;i++) words[i>>2]|=(bytes.charCodeAt(i)&255)<<((3-i%4)*8);
    words[l>>2]|=0x80<<((3-l%4)*8); words[((l+8)>>6<<4)+15]=l*8;
    for(i=0;i<words.length;i+=16){
      var w=[],a=Hh[0],b=Hh[1],cc=Hh[2],dd=Hh[3],e=Hh[4],f=Hh[5],gg=Hh[6],hh=Hh[7];
      for(j=0;j<64;j++){
        if(j<16) w[j]=words[i+j]|0; else { var s0=r(7,w[j-15])^r(18,w[j-15])^(w[j-15]>>>3), s1=r(17,w[j-2])^r(19,w[j-2])^(w[j-2]>>>10); w[j]=(w[j-16]+s0+w[j-7]+s1)|0; }
        var t1=(hh+(r(6,e)^r(11,e)^r(25,e))+((e&f)^(~e&gg))+K[j]+w[j])|0, t2=((r(2,a)^r(13,a)^r(22,a))+((a&b)^(a&cc)^(b&cc)))|0;
        hh=gg; gg=f; f=e; e=(dd+t1)|0; dd=cc; cc=b; b=a; a=(t1+t2)|0;
      }
      Hh[0]=(Hh[0]+a)|0;Hh[1]=(Hh[1]+b)|0;Hh[2]=(Hh[2]+cc)|0;Hh[3]=(Hh[3]+dd)|0;Hh[4]=(Hh[4]+e)|0;Hh[5]=(Hh[5]+f)|0;Hh[6]=(Hh[6]+gg)|0;Hh[7]=(Hh[7]+hh)|0;
    }
    var out=""; for(i=0;i<8;i++) out+=("00000000"+(Hh[i]>>>0).toString(16)).slice(-8); return out;
  }
  function build(){
    var g=document.createElement("div"); g.id="tm-gate";
    g.innerHTML='<form><h1><b>Transference</b> <i>Maps</i></h1><p>This site is in a private preview. Enter the password to continue.</p><input type="password" aria-label="Password" placeholder="Password" autocomplete="current-password" autofocus><p class="err" role="alert"></p><button type="submit">Enter</button></form>';
    document.body.appendChild(g);
    var f=g.querySelector("form"), inp=g.querySelector("input"), err=g.querySelector(".err");
    inp.focus();
    f.addEventListener("submit",function(e){ e.preventDefault();
      var v=inp.value.trim().toLowerCase().replace(/\s+/g,"");
      var h=sha256(v);
      if(h===H){ var saved=false; try{ localStorage.setItem(KEY,H); saved=localStorage.getItem(KEY)===H; }catch(_){}
        // reload so the maps lay out at full size (they measured themselves while hidden)
        if(saved) location.reload(); else { g.remove(); d.classList.remove("tm-locked"); try{ window.dispatchEvent(new Event("resize")); }catch(_){} } }
      else { err.textContent="That's not it. Try again."; inp.select(); }
    });
  }
  if(document.body) build(); else document.addEventListener("DOMContentLoaded",build);
})();
