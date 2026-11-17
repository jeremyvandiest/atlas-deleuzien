/* ATLAS V10.17 — lecteur éditorial Atlas 3 et passerelle pilote.
 * Greffe après atlas-hub.js : aucune mutation des corpus Atlas 1/2.
 */
(function () {
  'use strict';
  const data = window.ATLAS3_PUBLICATION;
  if (!data || !Array.isArray(data.chapters) || typeof PAGE_HANDLERS === "undefined") {
    console.error('Atlas 3 : prépublication ou navigation indisponible.');
    return;
  }
  const chapterMap = Object.fromEntries(data.chapters.map(c => [c.id, c]));
  const doorMap = Object.fromEntries(data.salon.doors.map(d => [d.id, d]));
  const e = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  const chapterPath = id => 'atlas3/' + id;
  const doorPath = id => 'atlas3/salon/' + id;
  const section = (title, body, cls='') => `<section class="a3r-block ${cls}"><h2>${e(title)}</h2>${body}</section>`;
  const btn = (path, label, cls='') => `<button type="button" class="a3r-link ${cls}" onclick="go('${path}')">${e(label)}</button>`;
  const crumb = (extra='') => `<nav class="a3r-crumb" aria-label="Navigation Atlas 3">${btn('atlas3','Atlas 3 — Sommaire')}${btn('atlas3/salon','Salon des possibles')}${extra ? `<span>${e(extra)}</span>` : ''}</nav>`;
  const note = `<p class="a3r-publication">${e(data.status)}. Les sources et leurs limites sont disponibles dans chaque chapitre.</p>`;
  const C = name => data.chapters.find(c => c.id === name);
  function index(){
    const parts = data.parts.map(part => {
      const links=part.chapters.map(id => {
        const c=chapterMap[id];
        return `<li>${btn(chapterPath(id),String(c.number).padStart(2,'0')+' · '+c.title,'a3r-chapter-link')}</li>`;
      }).join('');
      return `<section class="a3r-part"><div class="a3r-eyebrow">Partie ${e(part.id)}</div><h2>${e(part.title)}</h2><p>${e(part.introduction)}</p><ul>${links}</ul></section>`;
    }).join('');
    const body = `<div class="a3r-wrap">${crumb()}<header class="a3r-hero"><div class="a3r-eyebrow">ATLAS 3 · LE THÉÂTRE DU SENTIR</div><h1>Lire les quinze chapitres</h1><p>${e(data.introduction)}</p></header>${note}<div class="a3r-part-grid">${parts}</div>${section('Entrer dans une scène',`<p>Les sept portes du Salon sont indépendantes : elles proposent des situations, des voix et des formes à explorer, sans parcours imposé.</p>${btn('atlas3/salon','Explorer les sept portes','a3r-action')}`)}${section('Première passerelle',`<p>Depuis le chapitre 05, un détour facultatif par Hume lu par Deleuze permet de transformer une question sur les habitudes. Aucun autre chapitre ne dépend de ce détour.</p>${btn(chapterPath('chapitre-05'),'Lire le chapitre 05')}`)}</div>`;
    return shell(body,{title:'Atlas 3 · Théâtre du sentir',sub:'Cinq parties · Quinze chapitres'});
  }
  function chapter(id){
    const c=chapterMap[id];if(!c)return missing();
    const part=data.parts.find(p=>p.id===c.part_id);
    const pos=data.chapters.findIndex(x=>x.id===id);
    const prev=data.chapters[pos-1], next=data.chapters[pos+1];
    const sections=c.sections.map((s,i)=>`<details class="a3r-section" id="${e(s.id)}"${i===0?' open':''}><summary><span class="a3r-section-count">${String(i+1).padStart(2,'0')}</span><span>${e(s.title)}</span></summary><div class="a3r-prose">${s.html}</div></details>`).join('');
    const doors=(c.salon_portes||[]).map(d=>doorMap[d]?btn(doorPath(d),doorMap[d].title):'').join('');
    const bridge=c.id==='chapitre-05'?`<aside class="a3r-bridge-card"><div class="a3r-eyebrow">PASSERELLE FACULTATIVE · ATLAS 1 ET ATLAS 3</div><h2>L'habitude constitue-t-elle celui qui agit ?</h2><p>Un détour par Hume lu par Deleuze, suivi d'un retour à la scène de Mara et Nils. Il enrichit la question sans remplacer ce chapitre.</p>${btn('atlas3/passerelle/hume-habitude','Emprunter la passerelle','a3r-action')}</aside>`:'';
    const footerLinks=[prev?btn(chapterPath(prev.id),'Chapitre '+String(prev.number).padStart(2,'0')+' · '+prev.title):'',next?btn(chapterPath(next.id),'Chapitre '+String(next.number).padStart(2,'0')+' · '+next.title):''].filter(Boolean).join('');
    const body=`<div class="a3r-wrap">${crumb('Chapitre '+String(c.number).padStart(2,'0'))}<header class="a3r-hero"><div class="a3r-eyebrow">PARTIE ${e(c.part_id)} · ${e(part?.title || '')} · CHAPITRE ${String(c.number).padStart(2,'0')}</div><h1>${e(c.title)}</h1><div class="a3r-prose a3r-intro">${c.introduction_html}</div></header>${note}${bridge}<div class="a3r-reader-controls"><span>${c.sections.length} sections · lecture libre</span><button type="button" onclick="window.Atlas3Reader.toggleSections(true)">Tout ouvrir</button><button type="button" onclick="window.Atlas3Reader.toggleSections(false)">Tout refermer</button></div><div class="a3r-sections">${sections}</div>${c.pour_poursuivre_html?section('Poursuivre la lecture',`<div class="a3r-prose">${c.pour_poursuivre_html}</div>`):''}${doors?section('Explorer les scènes associées',`<div class="a3r-mini-links">${doors}</div>`):''}<details class="a3r-sources"><summary>Sources, lectures et limites</summary><div class="a3r-prose">${c.sources_html}</div></details><div class="a3r-prevnext">${footerLinks}</div>${btn('atlas3','Revenir aux quinze chapitres')}</div>`;
    return shell(body,{title:'Atlas 3 · '+c.title,sub:'Partie '+c.part_id});
  }
  function salon(){
    const cards=data.salon.doors.map(d=>`<article class="a3r-door"><div class="a3r-eyebrow">PORTE ${String(d.number).padStart(2,'0')}</div><h2>${e(d.title)}</h2>${btn(doorPath(d.id),'Entrer dans cette scène','a3r-action')}</article>`).join('');
    return shell(`<div class="a3r-wrap">${crumb()}<header class="a3r-hero"><div class="a3r-eyebrow">ATLAS 3 · ESPACE DE SCÈNES</div><h1>Le Salon des possibles</h1><p>Sept portes, sept propositions autonomes. Aucune n'est un exercice obligatoire ni une expérience dont l'efficacité serait démontrée.</p></header><div class="a3r-door-grid">${cards}</div>${btn('atlas3','Revenir au sommaire')}</div>`,{title:'Atlas 3 · Salon',sub:'Sept portes'});
  }
  function door(id){
    const d=doorMap[id];if(!d)return missing();
    const related=data.relations.filter(r=>r.salon_door_id===id).map(r=>chapterMap[r.chapter_id]).filter(Boolean);
    const links=related.map(c=>btn(chapterPath(c.id),'Chapitre '+String(c.number).padStart(2,'0')+' · '+c.title)).join('');
    const body=`<div class="a3r-wrap">${crumb('Porte '+String(d.number).padStart(2,'0'))}<header class="a3r-hero"><div class="a3r-eyebrow">SALON DES POSSIBLES · PORTE ${String(d.number).padStart(2,'0')}</div><h1>${e(d.title)}</h1><p>Proposition artistique à lire, raconter ou explorer librement. Aucun résultat n'est garanti.</p></header><article class="a3r-prose a3r-door-text">${d.html}</article>${related.length?section('Retrouver la question dans les chapitres',`<div class="a3r-mini-links">${links}</div>`):''}${btn('atlas3/salon','Revenir aux sept portes')}</div>`;
    return shell(body,{title:'Salon · '+d.title,sub:'Atlas 3'});
  }
  function passerelle(id){
    const p=data.passerelles.find(x=>x.id===id);if(!p)return missing();
    const body=`<div class="a3r-wrap a3r-bridge">${crumb('Passerelle Hume')}<header class="a3r-hero"><div class="a3r-eyebrow">PREMIER CHEMIN TRANSVERSAL · PROPOSITION V1</div><h1>Une question traverse deux Atlas</h1><p>Départ du chapitre 05, détour philosophique par Hume lu par Deleuze, retour au Théâtre du sentir. Le lecteur peut rester dans son chapitre sans emprunter ce chemin.</p></header><div class="a3r-bridge-actions">${btn(chapterPath('chapitre-05'),'Revenir au chapitre 05')}${btn('author-hume','Lire la carte Hume dans Atlas 1','a3r-action')}</div><article class="a3r-prose a3r-bridge-text">${p.html}</article><div class="a3r-bridge-actions">${btn(chapterPath('chapitre-05'),'Retour au chapitre 05','a3r-action')}${btn('author-hume','Approfondir Hume dans Atlas 1')}</div><p class="a3r-quiet">Passerelle facultative, réversible et non substitutive. Les Routes philosophiques existantes ne sont pas modifiées.</p></div>`;
    return shell(body,{title:'Passerelle · Hume et l’habitude',sub:'Atlas 1 ↔ Atlas 3'});
  }
  function missing(){return shell(`<div class="a3r-wrap"><h1>Page introuvable</h1>${btn('atlas3','Revenir à Atlas 3')}</div>`,{title:'Atlas 3'});}
  function renderAtlas3(){
    const path=typeof current==='function'?current(): 'atlas3';
    const tail=String(path).replace(/^atlas3\/?/,'');
    if(!tail)return index();
    if(tail==='salon')return salon();
    if(tail.startsWith('salon/'))return door(tail.slice(6));
    if(tail.startsWith('passerelle/'))return passerelle(tail.slice(11));
    if(tail.startsWith('chapitre-'))return chapter(tail);
    return missing();
  }
  window.Atlas3Reader={
    toggleSections(open){
      if(!document || !document.querySelectorAll)return;
      document.querySelectorAll('.a3r-sections .a3r-section').forEach(x => {x.open=!!open;});
    },
    render:renderAtlas3
  };
  PAGE_HANDLERS.atlas3=renderAtlas3;
  // atlas-hub.js a déjà fait son premier rendu : actualiser uniquement si Atlas 3 est affiché.
  if(typeof current==='function' && current().split('/')[0]==='atlas3' && typeof render==='function')render();
})();
