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
  fs.writeFileSync(path.join(root,'search-data.js'),'window.SEARCH='+JSON.stringify(out)+';\n');
  console.log(out.length+' entries');
})();
