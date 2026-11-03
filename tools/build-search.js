// Regenerates search-data.js from the live page data. Run: node tools/build-search.js (from a dir with playwright)
const {chromium}=require('playwright'); const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..'), url=f=>'file://'+path.join(root,f);
(async()=>{ const b=await chromium.launch(), p=await b.newPage();
  await p.route(/goatcounter|zgo\.at|fonts\.g|d3/,r=>r.abort());
  await p.goto(url('schools.html')); const s=await p.evaluate(()=>({N,T}));
  await p.goto(url('names.html')); const d=await p.evaluate(()=>({people:DATA.people,full}));
  await b.close();
  const out=[];
  d.people.forEach(x=>out.push([d.full[x.id]||x.name,"Analyst","analysts.html#"+x.id]));
  Object.entries(s.N).forEach(([k,n])=>out.push([n.name,"School","schools.html#"+k,n.full]));
  const seen=new Set();
  Object.entries(s.N).forEach(([k,n])=>n.th.forEach(t=>{ if(seen.has(t)) return; seen.add(t);
    out.push([s.T[t][0],"Thinker · "+n.name,"schools.html#"+k+"/"+t]); }));
  Object.entries(s.N).forEach(([k,n])=>(n.br||[]).forEach(t=>{ if(seen.has(t)) return; seen.add(t);
    out.push([s.T[t][0],"Thinker · "+n.name,"schools.html#"+k+"/"+t]); }));
  // Which analysts on the web are key thinkers on the Schools page
  const fold=x=>x.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z ]/g,"").trim();
  const links={};
  d.people.forEach(x=>{ const nm=[d.full[x.id]||x.name,x.name].map(fold);
    const t=Object.keys(s.T).find(k=>nm.includes(fold(s.T[k][0]))); if(!t) return;
    const L=[]; Object.entries(s.N).forEach(([k,n])=>{ if(n.th.includes(t)) L.push([k,n.name,t,0]); });
    Object.entries(s.N).forEach(([k,n])=>{ if((n.br||[]).includes(t)) L.push([k,n.name,t,1]); });
    if(L.length) links[x.id]=L; });
  fs.writeFileSync(path.join(root,'school-links.js'),'window.SCHOOLS_OF='+JSON.stringify(links)+';\n');
  fs.writeFileSync(path.join(root,'search-data.js'),'window.SEARCH='+JSON.stringify(out)+';\n');
  console.log(out.length+' entries');
})();
