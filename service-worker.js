const CACHE_NAME='atlas-v10-50-ecoles-v1-20261124';
const CORE=['./','./index.html','./manifest.webmanifest','./atlas-bull.svg','./atlas-icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./atelier.css','./atlas1-operative.js','./atlas1-pedagogie-data.js','./atlas1-pedagogie.js','./atlas1-pedagogie.css','./atelier.js','./oeuvre.js','./atlas2.css','./atlas2-data.js','./atlas2-content.js','./atlas2-audit.js','./atlas2-relations.js','./atlas2.js','./atlas2-v43-data.js','./atlas-hub.js','./atlas-hub.css','./atlas3.css','./atlas3-content.js','./atlas3-v15.js','./atlas3-reader.js','./atlas3-fondations.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();const cacheKey=url.pathname.endsWith('/atlas2-lecteur-v43.html')?'./atlas2-lecteur-v43.html':'./index.html';caches.open(CACHE_NAME).then(c=>c.put(cacheKey,copy));return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));return;
  }
  if(req.destination==='script'||req.destination==='style'){event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok)caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));return res}).catch(()=>caches.match(req)));return;}
  event.respondWith(caches.match(req).then(cached=>{const network=fetch(req).then(res=>{if(res&&res.ok)caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));return res}).catch(()=>cached);return cached||network}));
});
