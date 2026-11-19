(function(){
'use strict';
const D=window.__ATLAS2_CANONICAL_PATCH__;
const WC=window.__ATLAS2_WORK_CONTENT__||{};
const REL=window.__ATLAS2_RELATIONS__||{internal:{},comparisons:[]};
if(!D) throw new Error('Atlas 2 : données canoniques introuvables.');
const A=x=>Array.isArray(x)?x:[];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
const arg=()=>decodeURIComponent(current().split('/').slice(1).join('/')||'');
const byId=id=>[...A(D.works),...A(D.transformations),...A(D.configurations),...A(D.forms),...A(D.problems),...A(D.optics).filter(x=>x&&typeof x==='object'),...A(D.laboratories),...A(D.routes)].find(x=>x.id===id);
const work=id=>A(D.works).find(x=>x.id===id);
const laboratory=id=>A(D.laboratories).find(x=>x.id===id);
const route=id=>A(D.routes).find(x=>x.id===id);
const station=id=>work(id)||laboratory(id);
const stationPage=(id,kind)=>kind==='laboratory'||String(id).startsWith('lab-')?'atlas2-lab/'+id:'atlas2-work/'+id;
const label=id=>byId(id)?.title||id;
const opticTitle=o=>typeof o==='string'?o:(o?.title||'');
const optic=id=>A(D.optics).find(o=>o&&typeof o==='object'&&o.id===id);
const caseCards=items=>`<div class="a2-grid">${A(items).map(c=>{const x=typeof c==='string'?{label:c}:c||{};const title=E(x.label||x.title||'CAS');const status=x.status==='STRESS_TEST'?'ÉTUDE COMPARATIVE · DOCUMENTATION PROVISOIRE':'';const kicker=[status,x.operation].filter(Boolean).join(' · ');const op=kicker?`<div class="num">${E(kicker)}</div>`:'';const note=x.note?`<p>${E(x.note)}</p>`:'';return x.ref_id?`<button class="a2-card" onclick="go('${stationPage(x.ref_id,String(x.ref_id).startsWith('lab-')?'laboratory':'work')}')">${op}<h3>${title}</h3>${note}</button>`:`<article class="a2-card">${op}<h3>${title}</h3>${note}</article>`}).join('')}</div>`;
const detailTags=(title,items)=>A(items).length?`<section class="a2-section"><h3>${E(title)}</h3>${tags(items)}</section>`:'';
const textList=(title,items)=>A(items).length?`<section class="a2-section"><h3>${E(title)}</h3><div class="a2-stack">${A(items).map(x=>`<p>→ ${E(x)}</p>`).join('')}</div></section>`:'';


function a2Nav(){
 if(current()!=='atlas2')return `<nav class="a2-nav a2-nav-compact" aria-label="Retour à Atlas 2"><button type="button" class="a2-nav-home" onclick="go('atlas2')">← Accueil d’Atlas 2</button></nav>`;
 const rubrics=[
  ['atlas2-transformations','Transformations','Suivre les changements qui produisent des conséquences : répétition, variation, seuil, réversion.'],
  ['atlas2-configurations','Configurations','Comprendre les relations qui organisent le monde raconté, la composition ou la lecture d’une œuvre.'],
  ['atlas2-forms','Formes et motifs','Observer comment une forme concrète remplit des fonctions différentes selon les œuvres.'],
  ['atlas2-problems','Problèmes','Retrouver une question commune et les réponses singulières que lui donnent plusieurs œuvres.'],
  ['atlas2-optics','Angles de lecture','Examiner le temps, le corps, l’espace ou le style depuis un angle précis.']
 ];
 const routes=A(D.routes).slice().sort((a,b)=>a.order-b.order);
 return `<nav class="a2-nav" aria-label="Explorer Atlas 2">
  ${current()!=='atlas2'?'<button class="a2-nav-home" type="button" onclick="go(\'atlas2\')">← Retour à Atlas 2</button>':''}
  <div class="a2-nav-pair">
   <details class="a2-nav-details"><summary><span>Explorer les rubriques</span><small>Cinq outils pour comprendre ce que produit une œuvre</small></summary>
    <div class="a2-nav-sections a2-nav-simple"><ul>${rubrics.map(([path,label,desc])=>`<li><button type="button" onclick="go('${path}')"><strong>${label}</strong><span>${desc}</span></button></li>`).join('')}</ul></div></details>
   <details class="a2-nav-details"><summary><span>Routes entre les œuvres</span><small>Sept parcours de lecture pour approfondir une question</small></summary>
    <div class="a2-nav-sections a2-nav-simple"><ol class="a2-route-index">${routes.map((r,i)=>`<li><button type="button" onclick="go('atlas2-route/${r.id}')"><span class="a2-route-index-number">${String(i+1).padStart(2,'0')}</span><span class="a2-route-index-copy"><strong>${E(r.title)}</strong><span>${E(r.question||'')}</span></span></button></li>`).join('')}</ol></div></details>
  </div></nav>`;
}
function page(content,title='Atlas 2',sub='Récits et formes'){
 const isHome=current()==='atlas2';
 const where=isHome?'':`<div class="a2-where" aria-label="Vous êtes dans Atlas 2"><button type="button" onclick="go('atlas2')">Atlas 2 · Accueil</button><span> / ${E(title.replace(/^Atlas 2 · /,''))}</span></div>`;
 return shell(`<div class="a2-page">${where}${content}</div>`,{title,sub})
}
function hero(k,t,p){return `<section class="a2-hero"><div class="a2-kicker">${E(k)}</div><h2>${E(t)}</h2><p>${p}</p></section>`}
function machine(items){return `<div class="a2-machine">${A(items).map((x,i)=>`${i?'<b>→</b>':''}<span>${E(x)}</span>`).join('')}</div>`}
function contextBlock(title,text){return text?`<div class="a2-context"><strong>${E(title)}</strong><p>${E(text)}</p></div>`:''}
function tags(items,cls=''){return `<div class="a2-tags">${A(items).map(x=>`<span class="a2-tag ${cls}">${E(x&&typeof x==='object'?(x.label||x.title||''):x)}</span>`).join('')}</div>`}
function caseTags(items){return `<div class="a2-tags">${A(items).map(x=>{const c=x&&typeof x==='object'?x:{label:x};const prefix=c.status==='STRESS_TEST'?'Étude comparative · ':'';const title=E(prefix+(c.label||c.title||''));return c.ref_id?`<button type="button" class="a2-tag a2-tag-link" onclick="go('${stationPage(c.ref_id,String(c.ref_id).startsWith('lab-')?'laboratory':'work')}')">${title}</button>`:`<span class="a2-tag">${title}</span>`}).join('')}</div>`}
function hasStressCases(items){return A(items).some(x=>x&&typeof x==='object'&&x.status==='STRESS_TEST')}
function stressCaseNote(items){return hasStressCases(items)?`<p class="a2-footer-note">Cette étude comparative ouvre une piste supplémentaire, à confronter au film complet.</p>`:''}
function visibleWorkNumber(w){return !(w?.medium==='film'||w?.display_number===false)}
function workNumberLabel(w){return visibleWorkNumber(w)?`ŒUVRE ${String(w.order).padStart(3,'0')}`:''}
function workStatusLabel(w){return w?.status==='PROVISIONAL'?' · PROVISOIRE / À CONFIRMER SUR ŒUVRE COMPLÈTE':''}
function workHeroKicker(w){return (visibleWorkNumber(w)?`${workNumberLabel(w)} · ${w.author}`:`${w.author}`)+workStatusLabel(w)}
function splitParas(t){return String(t||'').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${E(p)}</p>`).join('')}
function connectionPage(id){if(id.startsWith('transformation-'))return `atlas2-transformation/${id}`;if(id.startsWith('config-'))return `atlas2-configuration/${id}`;if(id.startsWith('form-'))return `atlas2-form/${id}`;if(id.startsWith('problem-'))return `atlas2-problem/${id}`;if(id.startsWith('optic-'))return `atlas2-optic/${id}`;return 'atlas2'}
function connectionButtons(ids){return `<div class="a2-tags">${A(ids).map(id=>`<button class="a2-link" onclick="go('${connectionPage(id)}')">${E(label(id))}</button>`).join('')}</div>`}
// Atlas V10.15 : classement par médium de publication de l’œuvre étudiée.
// Les 16 films conservent leur médium canonique. Les quatre œuvres scéniques sont identifiées explicitement.
// Les œuvres écrites restantes constituent le groupe « Littérature ».
const ATLAS2_THEATRE_IDS=new Set(['work-beckett-godot','work-sophocle-oedipe-roi','work-sartre-huis-clos','work-tchekhov-cerisaie']);
function atlas2WorkMedium(w){return w?.medium==='film'?'cinema':ATLAS2_THEATRE_IDS.has(w.id)?'theatre':'litterature'}
function atlas2MediumLabel(w){return ({cinema:'Cinéma',theatre:'Théâtre',litterature:'Littérature'})[atlas2WorkMedium(w)]}
const atlas2CatalogueState={medium:'tous',sort:'order',problem:'tous'};
window.atlas2ChangeCatalogue=function(field,value){if(!['medium','sort','problem'].includes(field))return;atlas2CatalogueState[field]=String(value);if(current()==='atlas2'){const holder=document.getElementById('a2-home-work-list');if(holder)holder.innerHTML=a2HomeWorkList();document.querySelectorAll('[data-a2-medium]').forEach(btn=>{const active=btn.getAttribute('data-a2-medium')===atlas2CatalogueState.medium;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active))});const count=document.querySelector('.a2-catalogue-count');if(count){const n=atlas2FilteredWorks().length;count.textContent=n+' œuvre'+(n>1?'s':'')+' sur '+A(D.works).length;}return;}render()};
function atlas2FilteredWorks(){let works=A(D.works).slice();if(atlas2CatalogueState.medium!=='tous')works=works.filter(w=>atlas2WorkMedium(w)===atlas2CatalogueState.medium);if(atlas2CatalogueState.problem!=='tous')works=works.filter(w=>w.principle?.global_problem_id===atlas2CatalogueState.problem||A(w.primary_connections).includes(atlas2CatalogueState.problem));const collate=(a,b)=>String(a).localeCompare(String(b),'fr',{sensitivity:'base'});if(atlas2CatalogueState.sort==='title')works.sort((a,b)=>collate(a.title,b.title));else if(atlas2CatalogueState.sort==='author')works.sort((a,b)=>collate(a.author,b.author)||collate(a.title,b.title));else works.sort((a,b)=>(a.order??9999)-(b.order??9999));return works;}
function atlas2Select(field,choices){return `<select aria-label="${field==='medium'?'Filtrer par médium':field==='sort'?'Trier les œuvres':'Filtrer par problème'}" onchange="atlas2ChangeCatalogue('${field}',this.value)">${choices.map(([value,label])=>`<option value="${E(value)}" ${atlas2CatalogueState[field]===value?'selected':''}>${E(label)}</option>`).join('')}</select>`}
function atlas2CatalogueFilters(){
 const n=atlas2FilteredWorks().length;
 const media=[['tous','Tout'],['cinema','Cinéma'],['theatre','Théâtre'],['litterature','Littérature']].map(([value,label])=>`<button type="button" class="a2-medium-choice${atlas2CatalogueState.medium===value?' is-active':''}" data-a2-medium="${value}" aria-pressed="${atlas2CatalogueState.medium===value}" onclick="atlas2ChangeCatalogue('medium','${value}')">${label}</button>`).join('');
 return `<div class="a2-catalogue-controls" role="group" aria-label="Explorer les œuvres"><div class="a2-medium-filter"><span class="a2-filter-heading">Médium</span><div class="a2-medium-options" role="group" aria-label="Choisir un médium">${media}</div></div><div class="a2-select-filters"><label>Question${atlas2Select('problem',[['tous','Toutes les questions'],...A(D.problems).map(p=>[p.id,p.title])])}</label><label>Classer${atlas2Select('sort',[['order','Parcours d’origine'],['title','Titre A–Z'],['author','Auteur A–Z']])}</label></div><p class="a2-catalogue-count" aria-live="polite">${n} œuvre${n>1?'s':''} sur ${A(D.works).length}</p></div>`;
}
function workCards(works=A(D.works)){return A(works).map(w=>`<button class="a2-card" onclick="go('atlas2-work/${w.id}')">${visibleWorkNumber(w)?`<div class="num">${E(workNumberLabel(w))}</div>`:''}${w?.status==='PROVISIONAL'?`<div class="num">PROVISOIRE · À CONFIRMER</div>`:''}<h3>${E(w.title)}</h3><p>${E(w.card)}</p><div class="meta">${E(w.author)} · ${E(atlas2MediumLabel(w))}</div></button>`).join('')}

function a2HomeWorkList(){
 const all=atlas2FilteredWorks();
 return `<div class="a2-home-work-list">${all.map(w=>`<button type="button" class="a2-home-work-row" onclick="go('atlas2-work/${w.id}')"><span class="a2-home-work-number">${String(w.order??'').padStart(2,'0')}</span><span class="a2-home-work-copy"><span class="a2-home-work-title">${E(w.title)}</span><span class="a2-home-work-credit">${E(w.author)} · ${E(atlas2MediumLabel(w))}${w.status==='PROVISIONAL'?' · Dossier provisoire':''}</span><span class="a2-home-work-description">${E(w.card)}</span></span></button>`).join('')||'<p>Aucune œuvre ne correspond à ce choix.</p>'}</div>`;
}
function atlas2Home(){
 const n=A(D.works).length;
 return page(`${hero('ATLAS 2','Atlas des récits et des formes','Découvrir une œuvre, comprendre en profondeur ce qu’elle raconte et apprendre à voir ce qui rend sa construction singulière. Les formes, les gestes, les durées et les relations font partie de son récit.')}
  ${a2Nav()}
  <section class="a2-home-corpus" id="a2-work-catalogue"><div class="a2-home-corpus-head"><div><h3>Explorer les ${n} œuvres</h3><p>Choisissez un titre pour entrer dans son dossier complet. Classez les œuvres par titre, auteur, médium ou question étudiée.</p></div></div>
  ${atlas2CatalogueFilters()}
  <div id="a2-home-work-list">${a2HomeWorkList()}</div>
  </section>
  <section class="a2-home-after"><h3>Prolonger la lecture</h3><p>Ces deux chemins servent à passer de la lecture d’une œuvre à l’examen d’un procédé ou d’un écart entre œuvres.</p>
   <div class="a2-home-after-links">
    <button type="button" class="a2-home-deep-link" onclick="go('atlas2-network')"><strong>Comparer des œuvres</strong><span>Deux dossiers, deux passages précis : comprendre comment un même élément produit des effets différents.</span></button>
    <button type="button" class="a2-home-deep-link" onclick="go('atlas2-lab/lab-style-queneau')"><strong>Laboratoire de style</strong><span>Un même événement raconté de trois façons : observer concrètement ce que les mots changent. D’après le principe des Exercices de style de Queneau.</span></button>
   </div>
  </section>`);
}
function atlas2Works(){const filtered=atlas2FilteredWorks();return page(`${hero('ATLAS 2 · ŒUVRES','Œuvres','Chaque dossier explique ce qui arrive dans une œuvre, puis comment ses formes et ses éléments construisent ce récit. Triez les titres pour choisir votre lecture.')}${a2Nav()}${atlas2CatalogueFilters()}<div class="a2-grid">${filtered.length?workCards(filtered):'<p class="a2-catalogue-empty">Aucune œuvre ne répond à cette combinaison de filtres.</p>'}</div>`,'Atlas 2 · Œuvres','Machines narratives et formelles')}
// V10.16 — Chaque connexion est reliée à une rubrique du dossier ou à une Route éditoriale.
// Les comparaisons éditoriales ne se font pas passer pour des Routes verrouillées.
function a2CleanHeading(s){return E(String(s||'').replace(/\s*[→⟶]\s*/g,' — '))}
function a2SummarySentence(s){
 const t=String(s||'').trim();
 const sentences=t.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÜÉÈÎÔŒ«])/);
 return sentences.length>1&&(sentences[0].length+sentences[1].length<365)?sentences.slice(0,2).join(' '):sentences[0]||t;
}
function a2InternalCartography(w,c){
 const headings=A(REL.internal?.[w.id]);
 const sections=A(c?.sections);
 const cards=headings.map((heading,i)=>{
  const idx=sections.findIndex(x=>x[0]===heading);
  if(idx<0)return '';
  return `<article class="a2-relation-node"><div class="a2-relation-overline">ARTICULATION ${i+1} · EXTRAIT DU DOSSIER</div><h4>${a2CleanHeading(heading)}</h4><p>${E(a2SummarySentence(sections[idx][1]))}</p><button class="a2-inline-link" onclick="document.getElementById('a2s-${idx}').scrollIntoView({behavior:'smooth',block:'start'})">Lire le passage complet</button></article>`;
 }).filter(Boolean).join('');
 if(!cards)return '';
 return `<section class="a2-section a2-cartography" id="a2-cartography"><div class="a2-section-lead"><h3>COMMENT LES ÉLÉMENTS S’ARTICULENT</h3><p>Trois points d’appui extraits de cette analyse. Chaque passage permet de remonter au dossier complet ; il ne remplace pas la traversée de l’œuvre.</p></div><div class="a2-relation-grid">${cards}</div></section>`;
}
const a2ComparisonState={work:'tous',kind:'tous'};
window.a2ChangeComparison=function(field,value){if(!['work','kind'].includes(field))return;a2ComparisonState[field]=value;render()};
function a2RelationsOf(id){return A(REL.comparisons).filter(x=>x.a===id||x.b===id)}
function a2ComparisonCard(x,currentId){
 const a=work(x.a),b=work(x.b),other=currentId?work(x.a===currentId?x.b:x.a):null;
 const first=other?other.title:`${a?.title||x.a} / ${b?.title||x.b}`;
 const provisional=x.kind==='exploratoire'||a?.status==='PROVISIONAL'||b?.status==='PROVISIONAL';
 const badge=provisional?'PISTE · ŒUVRE PROVISOIRE':'COMPARAISON ÉDITORIALE PROPOSÉE';
 const anchors=`<div class="a2-cmp-sources"><strong>Passages à confronter :</strong><span>${E(a?.title||x.a)} — ${a2CleanHeading(x.a_section)}</span><span>${E(b?.title||x.b)} — ${a2CleanHeading(x.b_section)}</span></div>`;
 return `<article class="a2-comparison-card"><div class="a2-relation-overline">${badge}</div><h4>${E(x.axis)}</h4><div class="a2-cmp-subtitle">${E(first)}</div><p>${E(x.text)}</p>${anchors}<div class="a2-cmp-actions">${other?`<button class="a2-inline-link" onclick="go('atlas2-work/${other.id}')">Ouvrir ${E(other.title)}</button>`:`<button class="a2-inline-link" onclick="go('atlas2-work/${a.id}')">${E(a.title)}</button><button class="a2-inline-link" onclick="go('atlas2-work/${b.id}')">${E(b.title)}</button>`}</div></article>`;
}
function a2CanonicalRoutesForWork(id){
 const records=[];
 for(const r of A(D.routes)){
  const steps=A(r.steps),i=steps.findIndex(s=>s.ref_id===id);
  if(i<0)continue;
  for(const j of [i-1,i+1]){
   const near=steps[j];if(!near||!work(near.ref_id))continue;
   records.push({route:r,here:steps[i],there:near,other:work(near.ref_id)});
  }
 }
 return records;
}
function a2RouteComparisonCard(row){
 const {route:r,here,there,other}=row;
 return `<article class="a2-route-connection"><div class="a2-relation-overline">ROUTE CANONIQUE · ${E(r.title)}</div><h4>${E(other.title)}</h4><p><strong>Dans cette œuvre :</strong> ${E(here.note)}</p><p><strong>Dans l’autre :</strong> ${E(there.note)}</p><div class="a2-cmp-actions"><button class="a2-inline-link" onclick="go('atlas2-work/${other.id}')">Lire l’autre œuvre</button><button class="a2-inline-link" onclick="go('atlas2-route/${r.id}')">Parcourir la Route</button></div></article>`;
}
function a2CrossCartography(w){
 const editorial=a2RelationsOf(w.id);
 const routes=a2CanonicalRoutesForWork(w.id);
 const routeCards=routes.slice(0,2).map(a2RouteComparisonCard).join('');
 const cmpCards=editorial.slice(0,3).map(x=>a2ComparisonCard(x,w.id)).join('');
 return `<section class="a2-section a2-crosscartography" id="a2-crosscartography"><div class="a2-section-lead"><h3>COMPARER SANS CONFONDRE</h3><p>Deux niveaux distincts : les rapprochements déjà inscrits dans les Routes canoniques, puis des propositions argumentées à partir des analyses individuelles. Les titres communs n’établissent pas à eux seuls une relation.</p></div>${routes.length?`<h4 class="a2-subheading">Dans les Routes canoniques</h4><div class="a2-relation-stack">${routeCards}</div>`:''}${editorial.length?`<h4 class="a2-subheading">Comparaisons proposées</h4><div class="a2-relation-stack">${cmpCards}</div>`:''}${!routes.length&&!editorial.length?'<p>Aucune comparaison argumentée enregistrée pour cette œuvre.</p>':''}<button class="a2-inline-link a2-network-explore" onclick="go('atlas2-network')">Voir les comparaisons d’œuvres</button></section>`;
}
function atlas2Network(){
 const options=[['tous','Toutes les œuvres'],...A(D.works).map(w=>[w.id,w.title])];
 const list=A(REL.comparisons).filter(x=>(a2ComparisonState.work==='tous'||x.a===a2ComparisonState.work||x.b===a2ComparisonState.work)&&(a2ComparisonState.kind==='tous'||(a2ComparisonState.kind==='exploratoire'?x.kind==='exploratoire':x.kind!=='exploratoire')));
 const select=(field,items)=>`<select aria-label="${field==='work'?'Œuvre étudiée':'Statut du rapprochement'}" onchange="a2ChangeComparison('${field}',this.value)">${items.map(([v,t])=>`<option value="${E(v)}" ${a2ComparisonState[field]===v?'selected':''}>${E(t)}</option>`).join('')}</select>`;
 const intro=`<div class="a2-network-intro"><p>Chaque comparaison rapproche deux passages précis de dossiers. Elle montre à la fois ce qui peut être comparé et ce qui change dans la fonction de l’élément étudié.</p></div>`;
 return page(`${hero('ATLAS 2 · CARTOGRAPHIE','Comparer les œuvres','Mettre en regard deux passages précis et expliquer ce que chacun produit dans sa propre œuvre.')}${a2Nav()}${intro}<div class="a2-catalogue-controls a2-network-filters"><label>Partir d’une œuvre${select('work',options)}</label><label>Nature de la proposition${select('kind',[['tous','Tous les rapprochements'],['editorial','Comparaisons argumentées'],['exploratoire','Pistes provisoires']])}</label><p class="a2-catalogue-count">${list.length} comparaison${list.length>1?'s':''} affichée${list.length>1?'s':''} ; 26 propositions éditoriales, dont deux pistes provisoires.</p></div><div class="a2-network-grid">${list.map(x=>a2ComparisonCard(x)).join('')||'<p>Aucune comparaison dans cette sélection.</p>'}</div>`,'Atlas 2 · Comparaisons','Deux œuvres, deux constructions');
}
let a2V43State='idle',a2V43Active=null,a2V43ReturnFocus=null;
function a2V43Ensure(){
 if(Array.isArray(window.__ATLAS2_V43_BOOKS__)&&window.__ATLAS2_V43_BOOKS__.length===30)return true;
 if(a2V43State!=='idle')return false;
 a2V43State='loading';
 const script=document.createElement('script');
 script.src='./atlas2-v43-data.js?v=10.22';
 script.onload=()=>{
  a2V43State=Array.isArray(window.__ATLAS2_V43_BOOKS__)&&window.__ATLAS2_V43_BOOKS__.length===30?'ready':'error';
  if(current().startsWith('atlas2-work/'))render();
 };
 script.onerror=()=>{a2V43State='error';if(current().startsWith('atlas2-work/'))render();};
 document.head.appendChild(script);
 return false;
}
function a2V43Retry(){a2V43State='idle';a2V43Ensure();}
function a2V43LoadingBlock(){
 return `<section class="a2-section"><h3>Lecture approfondie V4.3</h3><p>${a2V43State==='error'?'Le module approfondi ne s’est pas chargé. Le dossier d’origine reste accessible.':'Chargement de la lecture approfondie directement dans Atlas 2…'}</p>${a2V43State==='error'?'<button type="button" class="a2-link" onclick="a2V43Retry()">Réessayer</button>':''}</section>`;
}
function a2V43RenderText(b){
 const root=document.createElement('div');
 root.innerHTML=b.html;
 root.querySelector('h1')?.remove();
 const toc=[];let serial=0;
 for(const h of root.querySelectorAll('h2,h3')){
  const heading=h.textContent.trim();
  const idx=Array.isArray(b.concepts)?b.concepts.findIndex(c=>N(c.anchor_heading)===N(heading)):-1;
  h.id='a2-v43-section-'+serial++;
  if(h.tagName==='H2')toc.push({id:h.id,title:heading});
  if(idx!==-1){
   const btn=document.createElement('button');btn.type='button';btn.className='a2-v43-term';
   btn.textContent='Comprendre cette notion';btn.setAttribute('onclick','a2V43OpenConcept('+idx+')');
   h.appendChild(btn);
  }
 }
 const used=new Set(),terms=A(D.transformations).filter(t=>t.title&&t.title.length>=4).sort((a,b)=>b.title.length-a.title.length);
 for(const p of root.querySelectorAll('p')){
  const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
   if(!node.parentElement||node.parentElement.closest('a,button,code,pre'))continue;
   const raw=node.nodeValue,low=raw.toLocaleLowerCase('fr');
   for(const term of terms){
    if(used.has(term.id))continue;
    const target=term.title.toLocaleLowerCase('fr');let pos=low.indexOf(target);
    while(pos>=0){
     const before=raw[pos-1]||'',after=raw[pos+target.length]||'';
     if(!/[\p{L}\p{N}]/u.test(before)&&!/[\p{L}\p{N}]/u.test(after))break;
     pos=low.indexOf(target,pos+1);
    }
    if(pos<0)continue;
    const frag=document.createDocumentFragment(),btn=document.createElement('button');
    btn.type='button';btn.className='a2-v43-inline-term';btn.textContent=raw.slice(pos,pos+target.length);
    btn.setAttribute('onclick',"a2V43OpenGlobal('"+term.id+"')");
    frag.append(document.createTextNode(raw.slice(0,pos)),btn,document.createTextNode(raw.slice(pos+target.length)));
    node.replaceWith(frag);used.add(term.id);break;
   }
  }
 }
 return {html:root.innerHTML,toc};
}
function a2V43WorkPage(w,b){
 a2V43Active=b;
 const prepared=a2V43RenderText(b);
 const target=A(D.works).find(x=>x.order===Number(b.route?.id?.slice(0,2)));
 const toc=prepared.toc.map(t=>`<button type="button" onclick="document.getElementById('${t.id}')?.scrollIntoView({behavior:'smooth',block:'start'})">${E(t.title)}</button>`).join('');
 const warning=w.status==='PROVISIONAL'?'<p class="a2-v43-warning">Lecture provisoire : la confrontation directe au film complet reste nécessaire.</p>':'';
 return page(`
  ${hero(workHeroKicker(w),w.title,E(w.card))}
  ${a2Nav()}
  <section class="a2-v43-intro">
   <div class="a2-kicker">${b.pilot?'DOSSIER PILOTE · '+E(b.pilot):'DOSSIER APPROFONDI · V4.3'}</div>
   <p>Commencez par la traversée de l’œuvre. Les notions soulignées et les boutons « Comprendre » ouvrent des explications sans quitter cette page.</p>
   ${warning}
   <details class="a2-v43-map"><summary>Sommaire détaillé du dossier</summary><div class="a2-v43-map-list">${toc}</div></details>
  </section>
  <article class="a2-v43-prose" id="a2-v43-prose">${prepared.html}</article>
  <section class="a2-section a2-v43-concepts">
   <h3>NOTIONS À EXPLORER DANS CETTE ŒUVRE</h3>
   <p>Leur signification dépend des scènes et de leur fonction dans la construction de l’œuvre.</p>
   <div class="a2-v43-chips">${A(b.concepts).map((c,i)=>`<button type="button" class="a2-v43-chip" onclick="a2V43OpenConcept(${i})">${E(c.title)}</button>`).join('')}</div>
  </section>
  ${target?`<section class="a2-section a2-v43-route"><h3>POURSUIVRE PAR UNE ROUTE</h3><p>${E(b.route.note)}</p><button type="button" class="a2-link" onclick="go('atlas2-work/${target.id}')">Découvrir ${E(target.title)} dans Atlas 2</button></section>`:''}
  <p class="a2-footer-note">La documentation et les réserves de lecture figurent dans chaque dossier.</p>
  <div id="a2-v43-overlay" class="a2-v43-overlay" hidden onclick="if(event.target===this)a2V43Close()"></div>
 `,'Atlas 2 · '+w.title,'Œuvre et construction formelle');
}
function a2V43Modal(title,description,detailPage){
 const el=document.getElementById('a2-v43-overlay');if(!el)return;
 a2V43ReturnFocus=document.activeElement;
 el.innerHTML=`<div class="a2-v43-dialog" role="dialog" aria-modal="true" aria-labelledby="a2-v43-dialog-title">
  <button type="button" class="a2-v43-close" onclick="a2V43Close()" aria-label="Fermer cette explication">✕</button>
  <div class="a2-kicker">NOTION EXPLIQUÉE · ${E(a2V43Active?.title||'ATLAS 2')}</div>
  <h3 id="a2-v43-dialog-title">${E(title)}</h3><p>${E(description)}</p>
  ${detailPage?`<button type="button" class="a2-link" onclick="a2V43Visit('${detailPage}')">Approfondir dans Atlas 2</button>`:''}
 </div>`;
 el.hidden=false;el.querySelector('.a2-v43-close')?.focus();
}
function a2V43OpenConcept(i){
 const c=A(a2V43Active?.concepts)[Number(i)];
 if(c)a2V43Modal(c.title,c.text);
}
function a2V43OpenGlobal(id){
 const c=byId(id);if(!c)return;
 a2V43Modal(c.title,c.definition||c.question||c.explanation||'Notion transversale : consulter son dossier pour ses usages et limites.',connectionPage(id));
}
function a2V43Close(){
 const el=document.getElementById('a2-v43-overlay');
 if(el){el.hidden=true;el.innerHTML='';}
 if(a2V43ReturnFocus?.isConnected)a2V43ReturnFocus.focus();
}
function a2V43Visit(path){a2V43Close();go(path);}
window.a2V43Retry=a2V43Retry;window.a2V43OpenConcept=a2V43OpenConcept;window.a2V43OpenGlobal=a2V43OpenGlobal;window.a2V43Close=a2V43Close;window.a2V43Visit=a2V43Visit;window.addEventListener('keydown',function(e){
 const o=document.getElementById('a2-v43-overlay');if(!o||o.hidden)return;
 if(e.key==='Escape'){a2V43Close();return;}
 if(e.key!=='Tab')return;
 const controls=[...o.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.getClientRects().length>0);
 if(!controls.length)return;
 const first=controls[0],last=controls[controls.length-1];
 if(!o.contains(document.activeElement)){e.preventDefault();(e.shiftKey?last:first).focus();}
 else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});

function atlas2Work(){
 const id=arg(),w=work(id),c=WC[id];
 if(!w)return page(hero('ERREUR','Œuvre introuvable','Cet identifiant n’existe pas dans Atlas 2.'));
 if(a2V43Ensure()){const b=window.__ATLAS2_V43_BOOKS__.find(x=>Number(x.id.slice(0,2))===Number(w.order));if(b)return a2V43WorkPage(w,b);}
 const v43Entry=a2V43LoadingBlock();
 const jump=(target,label)=>`<button type="button" onclick="document.getElementById('${target}').scrollIntoView({behavior:'smooth',block:'start'})">${label}</button>`;
 const sectionJump=A(c?.sections).map((row,i)=>jump('a2s-'+i,E(row[0]))).join('');
 const hasArticulations=A(REL.internal?.[w.id]).length>0 && A(c?.sections).length>0;
 const toc=`<details class="a2-dossier-map"><summary>Aller directement à une partie du dossier</summary><div class="a2-dossier-map-items">${jump('a2-machine','En quelques mots')}${jump('a2-traversee','Traversée de l’œuvre')}${hasArticulations?jump('a2-cartography','Articulations'):''}${sectionJump}${jump('a2-crosscartography','Comparaisons')}${jump('a2-raccords','Raccords')}</div></details>`;
 return page(`
 ${hero(workHeroKicker(w),w.title,E(w.card))}
 ${v43Entry}
 <section class="a2-dossier-guide" aria-label="Comment lire cette analyse">
  <div class="a2-kicker">VOTRE CHEMIN DE LECTURE</div>
  <h3>Lire cette œuvre sans se perdre</h3>
  <p><strong>Pour commencer :</strong> « En quelques mots » présente le fonctionnement essentiel, puis la « Traversée » suit ce qui arrive dans l’œuvre. Les analyses détaillées viennent ensuite. Les comparaisons sont facultatives : elles n'ont de sens qu'après la lecture singulière.</p>
  ${toc}
 </section>
 <section class="a2-section a2-work-summary" id="a2-machine"><h3>EN QUELQUES MOTS</h3><p class="a2-summary-text">${E(c?.machine_context||w.card)}</p></section>
 <section class="a2-section a2-traversee" id="a2-traversee"><h3>TRAVERSÉE DE L’ŒUVRE</h3>${splitParas(c?.traversee||w.card)}</section>
 ${a2InternalCartography(w,c)}
 ${A(c?.sections).map((row,i)=>`<section class="a2-section" id="a2s-${i}"><h3>${E(row[0])}</h3><p>${E(row[1])}</p></section>`).join('')}
 ${A(c?.special).map(row=>`<section class="a2-section"><h3>${E(row[0])}</h3><p>${E(row[1])}</p></section>`).join('')}
 <section class="a2-section"><h3>OPTIQUES</h3>${tags(w.optics,'optic')}${contextBlock('POURQUOI CES OPTIQUES',c?.optics_context)}${A(w.optic_couplings).length?`<div class="a2-callout"><strong>Couplage</strong>${E(w.optic_couplings.join(' · '))}</div>`:''}</section>
 ${A(w.local_concepts).length?`<section class="a2-section"><h3>NOTIONS LOCALES</h3><p>Indexées par la recherche, sans page globale autonome.</p>${tags(w.local_concepts,'local')}${contextBlock('CONTEXTE DES NOTIONS LOCALES',c?.locals_context)}</section>`:''}
 ${a2CrossCartography(w)}
 <section class="a2-section" id="a2-raccords"><h3>RACCORDS PRINCIPAUX</h3>${connectionButtons(w.primary_connections)}${contextBlock('POURQUOI CES RACCORDS',c?.connections_context)}</section>
 <div class="a2-dossier-end"><p>Vous pouvez vous arrêter ici. Chaque œuvre se suffit à elle-même ; les autres rubriques permettent de prolonger une question, pas de compléter une lecture « obligatoire ».</p><button class="a2-text-link" type="button" onclick="go('atlas2')">Retour aux œuvres et aux Routes</button></div>`,'Atlas 2 · '+w.title,w.author);
}

function atlas2Transformations(){return page(`${hero('ATLAS 2 · TRANSFORMATIONS','Transformations','Dix façons de décrire ce qui change dans une œuvre et produit des conséquences : répéter, varier, franchir un seuil, inverser une relation ou recomposer un monde.')}${a2Nav()}<div class="a2-grid">${A(D.transformations).sort((a,b)=>a.order-b.order).map(t=>`<button class="a2-card" onclick="go('atlas2-transformation/${t.id}')"><div class="num">TRANSFORMATION ${String(t.order).padStart(3,'0')}</div><h3>${E(t.title)}</h3><p>${E(t.definition)}</p></button>`).join('')}</div>`,'Atlas 2 · Transformations','Comprendre ce qui change')}
function atlas2Transformation(){const t=A(D.transformations).find(x=>x.id===arg());if(!t)return atlas2Transformations();const fields=[['Ce que cette transformation produit',t.functions],['Ce qu’elle modifie',t.targets],['Comment elle agit',t.mechanisms]];const moreFields=[['Variantes',t.variants],['Plans d’action',t.planes],['Modes de production',t.production_modes],['Axes de lecture',t.axes]];return page(`<button class="a2-back" onclick="go('atlas2-transformations')">← Transformations</button>${hero('TRANSFORMATION '+String(t.order).padStart(3,'0'),t.title,E(t.definition))}<section class="a2-section"><h3>QUESTION FONCTIONNELLE</h3><p>${E({TRACE:'Qu’est-ce qui continue d’agir après ?',RÉPÉTITION:'Que produit une nouvelle occurrence ?',VARIATION:'Quel écart devient opératoire dans ce qui revient ?',TRANSFORMATION:'Qu’est-ce qui est redistribué ?',SEUIL:'Quand les règles changent-elles ?',RÉVERSION:'Quelle relation change de direction ?',RECOMPOSITION:'Quelle nouvelle organisation se forme après les changements ?',CONDENSATION:'Où plusieurs lignes convergent-elles ?'}[t.title]||'')}</p></section>${fields.filter(x=>A(x[1]).length).map(x=>`<section class="a2-section"><h3>${x[0]}</h3>${tags(x[1])}</section>`).join('')}${moreFields.some(x=>A(x[1]).length)?`<details class="a2-advanced-fields"><summary>Préciser les variantes de ce mécanisme</summary>${moreFields.filter(x=>A(x[1]).length).map(x=>`<div class="a2-advanced-row"><h3>${x[0]}</h3>${tags(x[1])}</div>`).join('')}</details>`:''}<section class="a2-section"><h3>CAS PRINCIPAUX</h3>${caseTags(t.cases?.primary||[])}${stressCaseNote(t.cases?.primary||[])}${A(t.cases?.secondary).length?`<div class="a2-divider"></div><div class="a2-kicker">AUTRES CAS</div>${caseTags(t.cases.secondary)}${stressCaseNote(t.cases.secondary)}`:''}${A(t.cases?.laboratory).length?`<div class="a2-divider"></div><div class="a2-kicker">LABORATOIRE</div>${caseTags(t.cases.laboratory)}`:''}</section><section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(t.structural_connections)}</section>`,'Atlas 2 · '+t.title,'Transformation transversale')}

function atlas2Configurations(){return page(`${hero('ATLAS 2 · CONFIGURATIONS','Configurations','Une configuration réunit les relations qui font tenir une situation. Six dossiers décrivent le monde raconté ; une contrainte de composition montre comment une règle produit des formes ; une configuration de lecture étudie l’organisation de l’information pour le lecteur ou spectateur.')}${a2Nav()}<div class="a2-grid">${A(D.configurations).map(c=>`<button class="a2-card" onclick="go('atlas2-configuration/${c.id}')"><div class="num">${E(c.kind||'CONFIGURATION')} · ${E(c.plane)}</div><h3>${E(c.title)}</h3><p>${E(c.definition||'')}</p><div class="meta">${A(c.cases).length} cas documentés</div></button>`).join('')}</div>`,'Atlas 2 · Configurations','Configurations et opérateurs')}
function atlas2Configuration(){const c=A(D.configurations).find(x=>x.id===arg());if(!c)return atlas2Configurations();return page(`<button class="a2-back" onclick="go('atlas2-configurations')">← Configurations</button>${hero(`${c.kind||'CONFIGURATION'} · ${c.plane}`,c.title,E(c.definition||''))}${textList('CONDITIONS DE TENUE / PRODUCTION',c.conditions)}${textList('DYNAMIQUE',c.dynamics)}${textList('Différences de fonctionnement',c.contrasts)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(c.cases)}</section><section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(c.structural_connections)}</section>`,'Atlas 2 · '+c.title,'Configuration transversale')}
function atlas2Forms(){return page(`${hero('ATLAS 2 · FORMES & MOTIFS','Formes & motifs','Une lettre, une porte, un regard ou un objet peut faire avancer une intrigue, maintenir une attente ou transformer une relation. Chaque œuvre donne à la forme sa fonction propre.')}${a2Nav()}<div class="a2-grid">${A(D.forms).map(f=>`<button class="a2-card" onclick="go('atlas2-form/${f.id}')"><div class="num">FORME GLOBALE</div><h3>${E(f.title)}</h3><p>${E(f.definition||'')}</p><div class="meta">${A(f.functions).join(' · ')}</div></button>`).join('')}</div>`,'Atlas 2 · Formes & motifs','Fonctions singulières des formes')}
function atlas2Form(){const f=A(D.forms).find(x=>x.id===arg());if(!f)return atlas2Forms();return page(`<button class="a2-back" onclick="go('atlas2-forms')">← Formes & motifs</button>${hero('FORME & MOTIF',f.title,E(f.definition||''))}${detailTags('FONCTIONS POSSIBLES',f.functions)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(f.cases)}</section>${textList('Nuances de lecture',[])}<section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(f.structural_connections)}</section>`,'Atlas 2 · '+f.title,'Fonctions variables d’un motif')}
function atlas2Problems(){return page(`${hero('ATLAS 2 · PROBLÈMES','Problèmes','Une même question peut recevoir plusieurs réponses artistiques. Comparez ce qu’elle devient dans la construction singulière de chaque œuvre.')}${a2Nav()}<div class="a2-grid">${A(D.problems).map(p=>`<button class="a2-card" onclick="go('atlas2-problem/${p.id}')"><div class="num">PROBLÈME GLOBAL</div><h3>${E(p.title)}</h3><p>${E(p.question||'')}</p><div class="meta">${A(p.cases).length} cas comparés</div></button>`).join('')}</div>`,'Atlas 2 · Problèmes','Questions transversales')}
function atlas2Problem(){const p=A(D.problems).find(x=>x.id===arg());if(!p)return atlas2Problems();return page(`<button class="a2-back" onclick="go('atlas2-problems')">← Problèmes</button>${hero('PROBLÈME GLOBAL',p.title,E(p.question||''))}<section class="a2-section"><h3>TENSION CONSTITUTIVE</h3><p>${E(p.tension||'')}</p></section>${detailTags('RÉPONSES OBSERVÉES',p.responses)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(p.cases)}</section>${textList('PROBLÈMES VOISINS / DISTINCTIONS',p.neighbors)}`,'Atlas 2 · '+p.title,'Problème transversal')}
function atlas2Optics(){
 const general=new Set(['optic-configuration','optic-transformation']);
 const precise=A(D.optics).filter(o=>!general.has(o.id)),cadres=A(D.optics).filter(o=>general.has(o.id));
 return page(`${hero('ATLAS 2 · ANGLES DE LECTURE','Angles de lecture','Choisir une dimension à observer dans une œuvre : le temps, l’espace, le corps, les ressources, le savoir, la parole ou le style. Chaque angle donne des questions et des exemples pour guider une lecture précise.')}${a2Nav()}
 <div class="a2-grid">${precise.map(o=>`<button type="button" class="a2-card" onclick="go('atlas2-optic/${o.id}')"><h3>${E(opticTitle(o))}</h3><p>${E(o.definition||'')}</p></button>`).join('')}</div>
 <details class="a2-advanced-fields"><summary>Deux angles plus généraux</summary><p>Configuration et transformation peuvent aussi servir de points d’observation. Leurs rubriques respectives approfondissent les mécanismes qu’elles permettent de reconnaître.</p><div class="a2-tags">${cadres.map(o=>`<button type="button" class="a2-link" onclick="go('atlas2-optic/${o.id}')">${E(opticTitle(o))}</button>`).join('')}</div></details>`,'Atlas 2 · Angles de lecture','Observer depuis un angle');
}
function atlas2Optic(){const o=optic(arg());if(!o)return atlas2Optics();return page(`<button class="a2-back" onclick="go('atlas2-optics')">← Angles de lecture</button>${hero('OPTIQUE',o.title,E(o.definition||''))}${textList('QUESTIONS',o.questions)}${textList('Compléter cet angle de lecture',o.blindspots)}${detailTags('COUPLAGES UTILES',o.couplings)}<section class="a2-section"><h3>CAS EXEMPLAIRES</h3>${caseTags(o.cases)}${stressCaseNote(o.cases)}</section>`,'Atlas 2 · '+o.title,'Filtre de lecture')}
function atlas2Routes(){
 const routes=A(D.routes).sort((a,b)=>a.order-b.order);
 return page(`${hero('ATLAS 2 · ROUTES','Routes','Chaque Route suit une question à travers plusieurs œuvres choisies. Les étapes montrent comment un problème change de fonction d’une construction à l’autre.')}${a2Nav()}<section class="a2-grid">${routes.map(r=>`<button class="a2-card" onclick="go('atlas2-route/${r.id}')"><div class="num">ROUTE ${String(r.order).padStart(3,'0')} · ${A(r.steps).length} STATIONS</div><h3>${E(r.title)}</h3><p>${E(r.question||'')}</p><div class="meta">${A(r.focus).map(E).join(' · ')}</div></button>`).join('')}</section>`,'Atlas 2 · Routes','Progressions comparatives')
}
function atlas2Route(){
 const r=route(arg());if(!r)return atlas2Routes();
 const steps=A(r.steps);
 const extensions=A(r.extensions);
 return page(`${hero('ATLAS 2 · ROUTE '+String(r.order).padStart(3,'0'),r.title,E(r.question||''))}<button class="a2-back" onclick="go('atlas2-routes')">← Routes</button>${tags(r.focus)}<section class="a2-section"><div class="a2-kicker">PARCOURS DE LECTURE · ${steps.length} ÉTAPES</div>${steps.map((st,i)=>{const x=station(st.ref_id);return `<div class="a2-route"><div class="step">${i+1}</div><div><h4><button class="a2-link" onclick="go('${stationPage(st.ref_id,st.kind)}')">${E(x?.title||st.ref_id)}</button> · ${E(st.operation)}</h4><p>${E(st.note||'')}</p></div></div>`}).join('')}</section>${extensions.length?`<section class="a2-section"><div class="a2-kicker">PROLONGER LA ROUTE</div><p>Ces œuvres permettent de prolonger la question dans d’autres constructions.</p>${extensions.map(st=>`<button class="a2-link" onclick="go('${stationPage(st.ref_id,st.kind)}')">${E(station(st.ref_id)?.title||st.ref_id)}</button>`).join('')}</section>`:''}`,'Atlas 2 · Route','Parcours comparatif')
}
function atlas2Lab(){
 const examples=[
  {title:'Raconter les faits',text:'Une femme sort du cinéma et s’aperçoit qu’elle a perdu son gant. Un passant le ramasse et le lui rend.',impact:'Les actions suivent leur ordre. Le lecteur reçoit l’événement sans attente particulière.'},
  {title:'Accélérer le rythme',text:'La porte s’ouvre. Le trottoir, la foule. Une main vide. Le gant sous un pas. « Madame ! » Une silhouette s’approche et le rend.',impact:'Les phrases brèves découpent l’instant. Le lecteur doit reconstruire la continuité du geste.'},
  {title:'Épouser une inquiétude',text:'Elle fouille sa poche encore une fois. Le gant est perdu, c’est certain. Lorsqu’un inconnu s’approche en le tenant, elle hésite avant de tendre la main.',impact:'Le point de vue donne du poids à une hésitation. Le même événement devient une petite scène d’incertitude.'}
 ];
 const cards=examples.map((x,i)=>`<article class="a2-lab-variation"><div class="a2-lab-index">${String(i+1).padStart(2,'0')}</div><h3>${E(x.title)}</h3><p>${E(x.text)}</p><div class="a2-lab-effect"><strong>Ce que cela change</strong><p>${E(x.impact)}</p></div></article>`).join('');
 return page(`<button class="a2-back" onclick="go('atlas2')">← Accueil d’Atlas 2</button>${hero('LABORATOIRE · STYLE','Une scène, plusieurs écritures','Pourquoi une scène identique peut-elle devenir neutre, précipitée ou inquiétante selon la façon dont elle est racontée ?')}<section class="a2-section a2-lab-intro"><h3>Pourquoi Queneau ?</h3><p>Dans <em>Exercices de style</em>, Raymond Queneau reprend une situation et la raconte de multiples manières. Cette expérience rend visible une idée fondamentale : le style ne se contente pas d’habiller une histoire, il transforme la façon dont nous la percevons.</p><p>Les trois variations ci-dessous sont des exemples originaux créés pour Atlas 2 ; elles ne reproduisent aucun passage de Queneau.</p></section><section class="a2-lab-demo"><h3>Trois façons de raconter un même événement</h3><p>Point commun : une femme perd son gant à la sortie du cinéma, et un passant le lui rend. Comparez maintenant ce qui change dans la durée, l’attention et l’effet produit.</p><div class="a2-lab-grid">${cards}</div></section><section class="a2-section a2-lab-practice"><h3>À expérimenter</h3><p>Réécrivez cette même scène en ralentissant le temps, ou en ne laissant entendre que les paroles. Puis demandez-vous : qu’est-ce qui est resté identique ? Qu’avez-vous ajouté ? Quel effet la forme crée-t-elle sur le lecteur ?</p><p>Le contraste avec Borges permet d’aller plus loin : des mots identiques peuvent aussi être lus autrement lorsque leur auteur et leur contexte changent. Une forme agit toujours dans une situation de lecture.</p></section>`,'Atlas 2 · Laboratoire de style','Expérience de variation');
}

function integrationChecks(){const out=[];const pass=(cat,msg)=>out.push({kind:'pass',cat,msg}), warn=(cat,msg)=>out.push({kind:'warning',cat,msg}), err=(cat,msg)=>out.push({kind:'error',cat,msg});
 if(typeof NAV!=='undefined'&&NAV.some(n=>n[0]==='atlas2'))pass('INTÉGRATION','Entrée Atlas 2 présente dans le menu.');else err('INTÉGRATION','Entrée Atlas 2 absente du menu.');
 const handlers=['atlas2','atlas2-works','atlas2-work','atlas2-configurations','atlas2-configuration','atlas2-transformations','atlas2-transformation','atlas2-forms','atlas2-form','atlas2-problems','atlas2-problem','atlas2-optics','atlas2-optic','atlas2-routes','atlas2-route','atlas2-lab','atlas2-audit'];handlers.forEach(h=>typeof PAGE_HANDLERS[h]==='function'?pass('NAVIGATION',h+' : destination valide.'):err('NAVIGATION',h+' : handler manquant.'));
 A(D.works).forEach(w=>{const c=WC[w.id];if(c?.traversee&&A(c.sections).length>=6)pass('CONTENU',w.id+' : traversée et modules présents.');else err('CONTENU',w.id+' : contenu canonique incomplet.');});
 const locals=new Set(A(D.local_concepts).map(N));const promoted=Object.keys(PAGE_HANDLERS).filter(h=>locals.has(N(h)));promoted.length?err('GLOBAL / LOCAL','Notion locale promue : '+promoted.join(', ')):pass('GLOBAL / LOCAL','Aucune notion locale transformée en page globale.');
 if(window.__ATLAS2_SEARCH_WRAPPED__)pass('RECHERCHE','Recherche globale greffée.');else err('RECHERCHE','Greffe recherche absente.');
 const pending=A(D.routes).filter(r=>r.status!=='CANONICAL').length;if(pending)err('CONTENU',pending+' route(s) non canoniques.');else pass('CONTENU',A(D.routes).length+' Routes canoniques matérialisées.');
 return out;
}
function atlas2AuditPage(){const core=window.Atlas2Audit?Atlas2Audit.run(D,{scope:'full'}):{errors:[{category:'TECHNIQUE',code:'AUDIT_ENGINE',message:'Moteur audit non chargé'}],warnings:[],passes:[],categories:{},summary:{errors:1,warnings:0,passes:0}};const extra=integrationChecks();const errors=[...core.errors,...extra.filter(x=>x.kind==='error').map(x=>({category:x.cat,code:'INTEGRATION',message:x.msg}))];const warnings=[...core.warnings,...extra.filter(x=>x.kind==='warning').map(x=>({category:x.cat,code:'INTEGRATION',message:x.msg}))];const passes=[...core.passes,...extra.filter(x=>x.kind==='pass').map(x=>({category:x.cat,code:'INTEGRATION',message:x.msg}))];const cats={};[...passes.map(x=>({...x,kind:'pass'})),...warnings.map(x=>({...x,kind:'warning'})),...errors.map(x=>({...x,kind:'error'}))].forEach(x=>{const c=cats[x.category]||(cats[x.category]={pass:0,warning:0,error:0,items:[]});c[x.kind]++;c.items.push(x)});return page(`${hero('CONTRÔLE DE COHÉRENCE','AUDIT ATLAS 2','Contrôle des données canoniques, des destinations, du vocabulaire, de la recherche et de la greffe réelle dans l’application.') }<div class="a2-audit-head"><div><div class="a2-audit-summary"><span class="a2-stat ok">✓ ${passes.length} réussis</span><span class="a2-stat warn">⚠ ${warnings.length} avertissement${warnings.length>1?'s':''}</span><span class="a2-stat err">✕ ${errors.length} erreur${errors.length>1?'s':''}</span></div></div><div>${errors.length===0?'<span class="a2-stat ok">RELEASE : TECHNIQUEMENT VALIDE</span>':'<span class="a2-stat err">RELEASE BLOQUÉE</span>'}</div></div>${Object.entries(cats).sort(([a],[b])=>a.localeCompare(b,'fr')).map(([name,c])=>`<details class="a2-audit-cat" ${c.error||c.warning?'open':''}><summary><span>${E(name)}</span><span>✓ ${c.pass} · ⚠ ${c.warning} · ✕ ${c.error}</span></summary><div class="a2-audit-list">${c.items.map(i=>`<div class="a2-audit-item ${i.kind==='pass'?'ok':i.kind==='warning'?'warn':'err'}">${i.kind==='pass'?'✓':i.kind==='warning'?'⚠':'✕'} ${E(i.message)}</div>`).join('')}</div></details>`).join('')}<div class="a2-callout"><strong>Routes LOCK</strong>7 Routes canoniques matérialisées. Chaque Route contient 3 à 6 stations ; les nouvelles œuvres ne sont jamais ajoutées automatiquement et restent des prolongements tant qu’aucune décision éditoriale ne remplace une station.</div><button class="a2-link" onclick="go('audit')">Ouvrir aussi l’audit Atlas 1</button>`,'Atlas 2 · Audit','Contrôle de cohérence')}

function atlas2Resolve(q){const n=N(q);if(!n)return null;if(['audit atlas 2','audit 2','atlas 2 audit','audit atlas2'].includes(n))return 'atlas2-audit';if(['atlas 2','atlas2','recits et formes','récits et formes'].map(N).includes(n))return 'atlas2';const alias=Object.entries(D.search_aliases||{}).find(([k])=>N(k)===n);if(alias){const target=alias[1];if(target==='__AUDIT__'||String(target).startsWith('__AUDIT_'))return 'atlas2-audit';if(target==='__ATLAS2_ROUTES__')return 'atlas2-routes';const x=byId(target);if(x){if(target.startsWith('work-'))return 'atlas2-work/'+target;if(target.startsWith('transformation-'))return 'atlas2-transformation/'+target;if(target.startsWith('config-'))return 'atlas2-configuration/'+target;if(target.startsWith('form-'))return 'atlas2-form/'+target;if(target.startsWith('problem-'))return 'atlas2-problem/'+target;if(target.startsWith('optic-'))return 'atlas2-optic/'+target;if(target.startsWith('lab-'))return 'atlas2-lab/'+target;if(target.startsWith('route-'))return 'atlas2-route/'+target;}}
 for(const w of A(D.works)){const hay=N([w.title,w.author,...A(w.aliases),...A(w.local_concepts)].join(' '));if(hay.includes(n)||n.includes(N(w.title)))return 'atlas2-work/'+w.id;}
 for(const t of A(D.transformations)){if(N(t.title)===n||N(t.title).includes(n))return 'atlas2-transformation/'+t.id;}
 for(const c of A(D.configurations)){if(N(c.title+' '+(c.definition||'')).includes(n))return 'atlas2-configuration/'+c.id;}
 for(const f of A(D.forms)){if(N(f.title+' '+(f.definition||'')).includes(n))return 'atlas2-form/'+f.id;}
 for(const p of A(D.problems)){if(N(p.title+' '+(p.question||'')).includes(n))return 'atlas2-problem/'+p.id;}
 for(const o of A(D.optics)){if(o&&typeof o==='object'&&N(o.title+' '+(o.definition||'')).includes(n))return 'atlas2-optic/'+o.id;}
 for(const r of A(D.routes)){if(N(r.title).includes(n)||N(r.question).includes(n))return 'atlas2-route/'+r.id;}
 if(n.includes('queneau')||n.includes('exercices de style'))return 'atlas2-lab/lab-style-queneau';return null;
}
window.atlas2SearchNavigate=q=>{const p=atlas2Resolve(q);if(p)go(p);else go('atlas2')};

// Greffe après Atelier : aucune réécriture des pages Atlas 1.
if(typeof NAV!=='undefined'&&!NAV.some(n=>n[0]==='atlas2')){const at=NAV.findIndex(n=>n[0]==='atelier');NAV.splice(at<0?NAV.length:at,0,['atlas2','Atlas 2','Configurations narratives et formelles : œuvres, transformations, motifs, problèmes, optiques et routes.','◇'])}
PAGE_HANDLERS.atlas2=atlas2Home;
PAGE_HANDLERS['atlas2-works']=atlas2Works;
PAGE_HANDLERS['atlas2-network']=atlas2Network;
PAGE_HANDLERS['atlas2-work']=atlas2Work;
PAGE_HANDLERS['atlas2-configurations']=atlas2Configurations;
PAGE_HANDLERS['atlas2-configuration']=atlas2Configuration;
PAGE_HANDLERS['atlas2-transformations']=atlas2Transformations;
PAGE_HANDLERS['atlas2-transformation']=atlas2Transformation;
PAGE_HANDLERS['atlas2-forms']=atlas2Forms;
PAGE_HANDLERS['atlas2-form']=atlas2Form;
PAGE_HANDLERS['atlas2-problems']=atlas2Problems;
PAGE_HANDLERS['atlas2-problem']=atlas2Problem;
PAGE_HANDLERS['atlas2-optics']=atlas2Optics;
PAGE_HANDLERS['atlas2-optic']=atlas2Optic;
PAGE_HANDLERS['atlas2-routes']=atlas2Routes;
PAGE_HANDLERS['atlas2-route']=atlas2Route;
PAGE_HANDLERS['atlas2-lab']=atlas2Lab;
PAGE_HANDLERS['atlas2-audit']=atlas2AuditPage;

const oldHome=PAGE_HANDLERS.home;
PAGE_HANDLERS.home=function(){return shell(`<div class="home-hero"><div class="orn">✥</div><h2>Atlas</h2><div class="gold-rule"></div><p>Penser · Configurer · Concentrer · Trancher.</p></div><div class="search">⌕<input placeholder="Rechercher dans l’Atlas…" onkeydown="if(event.key==='Enter'){searchGlobal(this.value)}"></div><div class="nav-grid">${navCard('authors','◉','Auteurs','Les penseurs et les problèmes que Deleuze leur fait porter.')}${navCard('works','▤','Œuvres · Atlas 1','Les livres reconstruits comme des machines conceptuelles complètes.')}${navCard('concepts','✣','Concepts · Atlas 1','Le fonctionnement des grandes notions et leurs transformations.')}${navCard('glossary','▣','Glossaire · Atlas 1','Termes techniques, usages, raccords et garde-fous.')}${navCard('routes','⌁','Routes · Atlas 1','Transformation argumentée des problèmes à travers les œuvres et auteurs.')}${navCard('interludes','♜','Interludes · Atlas 1','Milieux intellectuels et bifurcations.')}${navCard('atlas2','◇','Atlas 2 · Récits & formes','Œuvres, configurations, transformations, motifs, problèmes, optiques et routes narratives.')}${navCard('atelier','◆','Atelier','Concentrer un problème créatif, éprouver les formes et conserver la généalogie des décisions.')}${navCard('oeuvre','✦','ŒUVRE · décision singulière','Formaliser la forme tranchée, les possibles abandonnés, les contraintes produites et le nouveau problème qui se rouvre.')}</div>`,{home:true,dark:true,title:'Atlas',sub:'PENSER → CONFIGURER → CONCENTRER → TRANCHER'})};

const originalSearch=window.searchGlobal;
window.searchGlobal=function(v){const n=N(v);if(n==='audit'){go('audit');return}const a2=atlas2Resolve(v);if(a2){go(a2);return}return originalSearch(v)};
window.__ATLAS2_SEARCH_WRAPPED__=true;

// Étendre l'Atelier à Atlas 2 sans modifier son stockage.
if(typeof window.atelierAtlasSearch==='function'){
 const oldAtelierSearch=window.atelierAtlasSearch;
 window.atelierAtlasSearch=(pid,sid,q)=>{const box=document.getElementById('atelierAtlasResults');if(!box)return;const n=N(q);if(!n){box.innerHTML='';return}const hits=[];for(const w of A(D.works)){const hay=N([w.title,w.author,...A(w.local_concepts)].join(' '));if(hay.includes(n))hits.push({type:'Atlas 2 · Œuvre',label:w.title,page:'atlas2-work/'+w.id,desc:w.card})}for(const t of A(D.transformations)){if(N(t.title+' '+t.definition).includes(n))hits.push({type:'Atlas 2 · Transformation',label:t.title,page:'atlas2-transformation/'+t.id,desc:t.definition})}for(const c of A(D.configurations)){if(N(c.title+' '+(c.definition||'')).includes(n))hits.push({type:'Atlas 2 · Configuration',label:c.title,page:'atlas2-configuration/'+c.id,desc:c.definition||''})}for(const f of A(D.forms)){if(N(f.title+' '+(f.definition||'')).includes(n))hits.push({type:'Atlas 2 · Forme',label:f.title,page:'atlas2-form/'+f.id,desc:f.definition||''})}for(const p of A(D.problems)){if(N(p.title+' '+(p.question||'')).includes(n))hits.push({type:'Atlas 2 · Problème',label:p.title,page:'atlas2-problem/'+p.id,desc:p.question||''})}for(const o of A(D.optics)){if(o&&typeof o==='object'&&N(o.title+' '+(o.definition||'')).includes(n))hits.push({type:'Atlas 2 · Optique',label:o.title,page:'atlas2-optic/'+o.id,desc:o.definition||''})}if(hits.length){box.innerHTML=hits.slice(0,10).map(h=>`<button class="atelier-atlas-hit" onclick="atelierAttachAtlasResource('${pid}','${sid}','${encodeURIComponent(h.type)}','${encodeURIComponent(h.page)}','${encodeURIComponent(h.label)}')"><b>${E(h.label)}</b><span>${E(h.type)} · ${E(h.desc.slice(0,150))}</span></button>`).join('');return}oldAtelierSearch(pid,sid,q)};
}

renderDrawer();render();
})();
