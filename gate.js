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
  function hex(buf){ return Array.prototype.map.call(new Uint8Array(buf),function(b){return ("0"+b.toString(16)).slice(-2);}).join(""); }
  function build(){
    var g=document.createElement("div"); g.id="tm-gate";
    g.innerHTML='<form><h1><b>Transference</b> <i>Maps</i></h1><p>This site is in a private preview. Enter the password to continue.</p><input type="password" aria-label="Password" placeholder="Password" autocomplete="current-password" autofocus><p class="err" role="alert"></p><button type="submit">Enter</button></form>';
    document.body.appendChild(g);
    var f=g.querySelector("form"), inp=g.querySelector("input"), err=g.querySelector(".err");
    inp.focus();
    f.addEventListener("submit",function(e){ e.preventDefault();
      var v=inp.value.trim().toLowerCase().replace(/\s+/g,"");
      crypto.subtle.digest("SHA-256",new TextEncoder().encode(v)).then(function(b){
        if(hex(b)===H){ try{ localStorage.setItem(KEY,H); }catch(_){} g.remove(); d.classList.remove("tm-locked"); window.dispatchEvent(new Event("resize")); }
        else { err.textContent="That's not it. Try again."; inp.select(); }
      });
    });
  }
  if(document.body) build(); else document.addEventListener("DOMContentLoaded",build);
})();
