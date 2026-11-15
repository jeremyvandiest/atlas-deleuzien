const CACHE_NAME='atlas-2026-11-15-v10-11-atlas1-operative-v10-14-manuel-v8-preserved';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./atelier.css','./atlas1-operative.js','./atelier.js','./oeuvre.js','./atlas2.css','./atlas2-data.js','./atlas2-content.js','./atlas2-audit.js','./atlas2.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy));return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));return;
  }
  event.respondWith(caches.match(req).then(cached=>{const network=fetch(req).then(res=>{if(res&&res.ok)caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));return res}).catch(()=>cached);return cached||network}));
});
