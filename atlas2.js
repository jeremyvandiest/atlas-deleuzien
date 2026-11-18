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
const caseCards=items=>`<div class="a2-grid">${A(items).map(c=>{const x=typeof c==='string'?{label:c}:c||{};const title=E(x.label||x.title||'CAS');const status=x.status==='STRESS_TEST'?'STRESS-TEST · FILM':'';const kicker=[status,x.operation].filter(Boolean).join(' · ');const op=kicker?`<div class="num">${E(kicker)}</div>`:'';const note=x.note?`<p>${E(x.note)}</p>`:'';return x.ref_id?`<button class="a2-card" onclick="go('${stationPage(x.ref_id,String(x.ref_id).startsWith('lab-')?'laboratory':'work')}')">${op}<h3>${title}</h3>${note}</button>`:`<article class="a2-card">${op}<h3>${title}</h3>${note}</article>`}).join('')}</div>`;
const detailTags=(title,items)=>A(items).length?`<section class="a2-section"><h3>${E(title)}</h3>${tags(items)}</section>`:'';
const textList=(title,items)=>A(items).length?`<section class="a2-section"><h3>${E(title)}</h3><div class="a2-stack">${A(items).map(x=>`<p>→ ${E(x)}</p>`).join('')}</div></section>`:'';


function a2Nav(){
  const groups=[
    ['Lire et circuler',[
      ['atlas2-works','Œuvres','Ouvrir un dossier précis et étudier comment il fonctionne.'],
      ['atlas2-routes','Routes','Suivre une question à travers quelques œuvres choisies.']]],
    ['Comprendre les mécanismes',[
      ['atlas2-transformations','Transformations','Nommer ce qui persiste, varie ou se recompose.'],
      ['atlas2-configurations','Configurations','Observer les relations qui font tenir un monde ou une situation.'],
      ['atlas2-forms','Formes & motifs','Distinguer les fonctions d’un même élément selon les œuvres.']]],
    ['Approfondir ou comparer',[
      ['atlas2-network','Connexions','Comparer deux œuvres sur des passages argumentés.'],
      ['atlas2-problems','Problèmes','Retrouver une question examinée dans plusieurs œuvres.'],
      ['atlas2-optics','Optiques','Choisir un angle de lecture et en reconnaître les limites.']]]
  ];
  return `<nav class="a2-nav" aria-label="Orientation dans l'Atlas 2">
    ${current()!=='atlas2'?'<button class="a2-nav-home" type="button" onclick="go(\'atlas2\')">← Revenir à l’accueil d’Atlas 2</button>':''}
    <details class="a2-nav-details"><summary><span>Explorer les autres rubriques</span><small>Leur utilité, sans obligation de tout parcourir</small></summary>
    <div class="a2-nav-sections">${groups.map(([heading,items])=>`<section><h3>${heading}</h3><ul>${items.map(([path,label,desc])=>`<li><button type="button" onclick="go('${path}')"><strong>${label}</strong><span>${desc}</span></button></li>`).join('')}</ul></section>`).join('')}</div></details>
    </nav>`;
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
function caseTags(items){return `<div class="a2-tags">${A(items).map(x=>{const c=x&&typeof x==='object'?x:{label:x};const prefix=c.status==='STRESS_TEST'?'STRESS-TEST · ':'';return `<span class="a2-tag">${E(prefix+(c.label||c.title||''))}</span>`}).join('')}</div>`}
function hasStressCases(items){return A(items).some(x=>x&&typeof x==='object'&&x.status==='STRESS_TEST')}
function stressCaseNote(items){return hasStressCases(items)?`<p class="a2-footer-note">STRESS-TEST · Cas comparatif utilisé pour éprouver le nœud ; le film n’est pas encore intégré comme ŒUVRE canonique.</p>`:''}
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
window.atlas2ChangeCatalogue=function(field,value){if(!['medium','sort','problem'].includes(field))return;atlas2CatalogueState[field]=String(value);render()};
function atlas2FilteredWorks(){let works=A(D.works).slice();if(atlas2CatalogueState.medium!=='tous')works=works.filter(w=>atlas2WorkMedium(w)===atlas2CatalogueState.medium);if(atlas2CatalogueState.problem!=='tous')works=works.filter(w=>w.principle?.global_problem_id===atlas2CatalogueState.problem||A(w.primary_connections).includes(atlas2CatalogueState.problem));const collate=(a,b)=>String(a).localeCompare(String(b),'fr',{sensitivity:'base'});if(atlas2CatalogueState.sort==='title')works.sort((a,b)=>collate(a.title,b.title));else if(atlas2CatalogueState.sort==='author')works.sort((a,b)=>collate(a.author,b.author)||collate(a.title,b.title));else works.sort((a,b)=>(a.order??9999)-(b.order??9999));return works;}
function atlas2Select(field,choices){return `<select aria-label="${field==='medium'?'Filtrer par médium':field==='sort'?'Trier les œuvres':'Filtrer par problème'}" onchange="atlas2ChangeCatalogue('${field}',this.value)">${choices.map(([value,label])=>`<option value="${E(value)}" ${atlas2CatalogueState[field]===value?'selected':''}>${E(label)}</option>`).join('')}</select>`}
function atlas2CatalogueFilters(){const n=atlas2FilteredWorks().length;return `<div class="a2-catalogue-controls" role="group" aria-label="Filtres du catalogue"><label>Médium${atlas2Select('medium',[['tous','Tous les médiums'],['cinema','Cinéma'],['theatre','Théâtre'],['litterature','Littérature']])}</label><label>Problème${atlas2Select('problem',[['tous','Tous les problèmes'],...A(D.problems).map(p=>[p.id,p.title])])}</label><label>Ordre${atlas2Select('sort',[['order','Parcours d’origine'],['title','Titre A–Z'],['author','Auteur A–Z']])}</label><p class="a2-catalogue-count">${n} œuvre${n>1?'s':''} sur ${A(D.works).length}</p></div>`}
function workCards(works=A(D.works)){return A(works).map(w=>`<button class="a2-card" onclick="go('atlas2-work/${w.id}')">${visibleWorkNumber(w)?`<div class="num">${E(workNumberLabel(w))}</div>`:''}${w?.status==='PROVISIONAL'?`<div class="num">PROVISOIRE · À CONFIRMER</div>`:''}<h3>${E(w.title)}</h3><p>${E(w.card)}</p><div class="meta">${E(w.author)} · ${E(atlas2MediumLabel(w))}</div></button>`).join('')}

function a2HomeWorkList(){
  const all=A(D.works).slice().sort((a,b)=>(a.order??9999)-(b.order??9999));
  return `<div class="a2-home-work-list">${all.map(w=>`<button type="button" class="a2-home-work-row" onclick="go('atlas2-work/${w.id}')"><span class="a2-home-work-number">${String(w.order??'').padStart(2,'0')}</span><span class="a2-home-work-copy"><span class="a2-home-work-title">${E(w.title)}</span><span class="a2-home-work-credit">${E(w.author)} · ${E(atlas2MediumLabel(w))}${w.status==='PROVISIONAL'?' · Dossier provisoire':''}</span><span class="a2-home-work-description">${E(w.card)}</span></span></button>`).join('')}</div>`;
}
function atlas2Home(){
  const workCount=A(D.works).length, transformations=A(D.transformations).length;
  return page(`${hero('ATLAS 2','Atlas des récits et des formes','Découvrir ce que font les œuvres : comment un geste, une forme ou une durée modifient le récit, les relations et notre lecture.')}
  <section class="a2-section" aria-label="Lectures approfondies V4.3"><div class="a2-kicker">NOUVELLE ÉDITION · 28 DOSSIERS</div><h3>Lire les œuvres en profondeur</h3><p>Les 28 dossiers approfondis se parcourent dans un lecteur dédié, avec notions contextualisées cliquables et routes. Kafka et Jeanne Dielman conservent leurs dossiers pilotes dans l’Atlas.</p><p><a class="a2-link" style="display:inline-block;text-decoration:none" href="./atlas2-lecteur-v43.html">Explorer les 28 dossiers V4.3</a></p></section>
  <section class="a2-home-guidance" aria-labelledby="a2-guidance-title">
    <div class="a2-kicker">VOTRE POINT DE DÉPART</div><h3 id="a2-guidance-title">Par où commencer ?</h3>
    <p>Il n’est pas nécessaire de connaître la cartographie avant de lire. Deux portes suffisent ; les autres notions deviennent utiles au fil des œuvres.</p>
    <div class="a2-entry-options">
      <button type="button" class="a2-entry-choice" onclick="document.getElementById('a2-work-catalogue').scrollIntoView({behavior:'smooth',block:'start'})"><span class="a2-entry-index">01 · SI UNE ŒUVRE VOUS ATTIRE</span><strong>Entrer par une œuvre</strong><span>Lire ce qui se passe, puis découvrir comment ses éléments agissent.</span><span class="a2-entry-cta">Voir les ${workCount} œuvres</span></button>
      <button type="button" class="a2-entry-choice" onclick="go('atlas2-routes')"><span class="a2-entry-index">02 · SI VOUS NE SAVEZ PAS QUOI CHOISIR</span><strong>Suivre une Route</strong><span>Une question, quelques œuvres et un chemin de lecture déjà composé.</span><span class="a2-entry-cta">Choisir parmi les 7 Routes</span></button>
    </div>
  </section>
  <section class="a2-home-backbone" aria-labelledby="a2-backbone-title">
    <div class="a2-kicker">POUR COMPRENDRE · COLONNE VERTÉBRALE</div><h3 id="a2-backbone-title">À quoi servent les ${transformations} transformations ?</h3>
    <p>Ce sont des outils pour décrire <em>ce qui agit</em> dans une œuvre, pas une liste de thèmes à y retrouver à tout prix.</p>
    <p class="a2-backbone-example"><strong>Un exemple :</strong> dans <em>Jeanne Dielman</em>, la répétition des tâches apprend au spectateur un rythme. Un petit retard ou un geste déplacé devient alors perceptible : c’est la <em>variation</em> rendue sensible par la <em>répétition</em>. Leur fonction dépend du film lui-même.</p>
    <button type="button" class="a2-text-link" onclick="go('atlas2-transformations')">Comprendre la colonne vertébrale de l’Atlas</button>
  </section>
  ${a2Nav()}
  <section class="a2-home-corpus" id="a2-work-catalogue"><div class="a2-home-corpus-head"><div><div class="a2-kicker">ENTRER DANS LE CORPUS</div><h3>Les ${workCount} œuvres</h3><p>Tous les titres sont ici, sans devoir les lire dans l’ordre. Ouvrir une œuvre suffit pour commencer.</p></div><button type="button" class="a2-text-link" onclick="go('atlas2-works')">Filtrer</button></div>
    <div class="a2-search"><input aria-label="Rechercher dans Atlas 2" placeholder="Chercher une œuvre ou une notion…" onkeydown="if(event.key==='Enter')atlas2SearchNavigate(this.value)"><button type="button" class="a2-link" onclick="atlas2SearchNavigate(this.previousElementSibling.value)">Chercher</button></div>
    ${a2HomeWorkList()}
  </section>
  <section class="a2-home-after"><div class="a2-kicker">ALLER PLUS LOIN</div><h3>Quand une question apparaît</h3><p>Les connexions et les outils de lecture sont disponibles dans le sommaire « Explorer les autres rubriques ». Ils n’ont pas à précéder la rencontre avec une œuvre.</p><div class="a2-home-after-links"><button type="button" class="a2-text-link" onclick="go('atlas2-network')">Comparer des œuvres</button><button type="button" class="a2-text-link" onclick="go('atlas2-lab/lab-style-queneau')">Laboratoire Queneau</button></div></section>
  <p class="a2-footer-note">Règle de lecture : les œuvres d’abord. Même motif ≠ même fonction. Les catégories ne remplacent pas l’analyse.</p>`);
}
function atlas2Works(){const filtered=atlas2FilteredWorks();return page(`${hero('ATLAS 2 · ŒUVRES','Œuvres','Chaque œuvre est présentée comme une machine singulière. Les filtres portent sur le médium et le problème étudié, sans modifier les analyses.')}${a2Nav()}${atlas2CatalogueFilters()}<div class="a2-grid">${filtered.length?workCards(filtered):'<p class="a2-catalogue-empty">Aucune œuvre ne répond à cette combinaison de filtres.</p>'}</div>`,'Atlas 2 · Œuvres','Machines narratives et formelles')}
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
 return `<section class="a2-section a2-crosscartography" id="a2-crosscartography"><div class="a2-section-lead"><h3>COMPARER SANS CONFONDRE</h3><p>Deux niveaux distincts : les rapprochements déjà inscrits dans les Routes canoniques, puis des propositions argumentées à partir des analyses individuelles. Les titres communs n’établissent pas à eux seuls une relation.</p></div>${routes.length?`<h4 class="a2-subheading">Dans les Routes canoniques</h4><div class="a2-relation-stack">${routeCards}</div>`:''}${editorial.length?`<h4 class="a2-subheading">Comparaisons proposées</h4><div class="a2-relation-stack">${cmpCards}</div>`:''}${!routes.length&&!editorial.length?'<p>Aucune comparaison argumentée enregistrée pour cette œuvre.</p>':''}<button class="a2-inline-link a2-network-explore" onclick="go('atlas2-network')">Explorer toutes les connexions d’Atlas 2</button></section>`;
}
function atlas2Network(){
 const options=[['tous','Toutes les œuvres'],...A(D.works).map(w=>[w.id,w.title])];
 const list=A(REL.comparisons).filter(x=>(a2ComparisonState.work==='tous'||x.a===a2ComparisonState.work||x.b===a2ComparisonState.work)&&(a2ComparisonState.kind==='tous'||(a2ComparisonState.kind==='exploratoire'?x.kind==='exploratoire':x.kind!=='exploratoire')));
 const select=(field,items)=>`<select aria-label="${field==='work'?'Œuvre étudiée':'Statut du rapprochement'}" onchange="a2ChangeComparison('${field}',this.value)">${items.map(([v,t])=>`<option value="${E(v)}" ${a2ComparisonState[field]===v?'selected':''}>${E(t)}</option>`).join('')}</select>`;
 const intro=`<div class="a2-network-intro"><p><strong>Les œuvres demeurent premières.</strong> Chaque comparaison ci-dessous s’appuie sur deux rubriques précises des dossiers et met en évidence un écart, pas une équivalence automatique. Ces lectures éditoriales sont proposées à la discussion ; les sept Routes constituent un ensemble distinct, déjà organisé et verrouillé.</p><button class="a2-inline-link" onclick="go('atlas2-routes')">Lire les sept Routes canoniques</button></div>`;
 return page(`${hero('ATLAS 2 · CARTOGRAPHIE','Connexions entre œuvres','Comparer des mécanismes précis, localiser les passages qui fondent le rapprochement et respecter les différences de fonction.')}${a2Nav()}${intro}<div class="a2-catalogue-controls a2-network-filters"><label>Partir d’une œuvre${select('work',options)}</label><label>Nature de la proposition${select('kind',[['tous','Tous les rapprochements'],['editorial','Comparaisons argumentées'],['exploratoire','Pistes provisoires']])}</label><p class="a2-catalogue-count">${list.length} comparaison${list.length>1?'s':''} affichée${list.length>1?'s':''} ; 26 propositions éditoriales, dont deux pistes provisoires.</p></div><div class="a2-network-grid">${list.map(x=>a2ComparisonCard(x)).join('')||'<p>Aucune comparaison dans cette sélection.</p>'}</div>`,'Atlas 2 · Connexions','Cartographie comparée des œuvres');
}
function atlas2Work(){
 const id=arg(),w=work(id),c=WC[id];
 if(!w)return page(hero('ERREUR','Œuvre introuvable','Cet identifiant n’existe pas dans Atlas 2.'));
 const v43Entry=(w.id==='work-kafka-metamorphose'||w.id==='work-akerman-jeanne-dielman')?'':`<section class="a2-section" aria-label="Édition approfondie V4.3"><div class="a2-kicker">DOSSIER ÉDITORIAL APPROFONDI · V4.3</div><h3>Continuer la lecture de cette œuvre</h3><p>Retrouvez la traversée complète, les analyses de scènes et de formes, les notions expliquées et une route discrète vers une autre œuvre.</p><p><a class="a2-link" style="display:inline-block;text-decoration:none" href="./atlas2-lecteur-v43.html#${String(w.order).padStart(2,'0')}">Ouvrir le dossier V4.3</a></p>${w.status==='PROVISIONAL'?'<p class="a2-footer-note">Dossier documentaire provisoire : vérification directe du film complet encore nécessaire.</p>':''}</section>`;
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

function atlas2Transformations(){return page(`${hero('ATLAS 2 · TRANSFORMATIONS','Transformations','Dix opérateurs transversaux. VARIATION et RECOMPOSITION sont désormais distinctes de RÉPÉTITION et TRANSFORMATION ; les variantes restent des axes internes.')}${a2Nav()}<div class="a2-grid">${A(D.transformations).sort((a,b)=>a.order-b.order).map(t=>`<button class="a2-card" onclick="go('atlas2-transformation/${t.id}')"><div class="num">TRANSFORMATION ${String(t.order).padStart(3,'0')}</div><h3>${E(t.title)}</h3><p>${E(t.definition)}</p></button>`).join('')}</div>`,'Atlas 2 · Transformations','Backbone transversal')}
function atlas2Transformation(){const t=A(D.transformations).find(x=>x.id===arg());if(!t)return atlas2Transformations();const fields=[['VARIANTES',t.variants],['FONCTIONS',t.functions],['CIBLES',t.targets],['PLANS',t.planes],['MODES DE PRODUCTION',t.production_modes],['MÉCANISMES',t.mechanisms],['AXES',t.axes]];return page(`<button class="a2-back" onclick="go('atlas2-transformations')">← Transformations</button>${hero('TRANSFORMATION '+String(t.order).padStart(3,'0'),t.title,E(t.definition))}<section class="a2-section"><h3>QUESTION FONCTIONNELLE</h3><p>${E({TRACE:'Qu’est-ce qui continue d’agir après ?',RÉPÉTITION:'Que produit une nouvelle occurrence ?',VARIATION:'Quel écart devient opératoire dans ce qui revient ?',TRANSFORMATION:'Qu’est-ce qui est redistribué ?',SEUIL:'Quand les règles changent-elles ?',RÉVERSION:'Quelle relation change de direction ?',RECOMPOSITION:'Quelle nouvelle organisation se forme après les changements ?',CONDENSATION:'Où plusieurs lignes convergent-elles ?'}[t.title]||'')}</p></section>${fields.filter(x=>A(x[1]).length).map(x=>`<section class="a2-section"><h3>${x[0]}</h3>${tags(x[1])}</section>`).join('')}<section class="a2-section"><h3>CAS PRINCIPAUX</h3>${caseTags(t.cases?.primary||[])}${stressCaseNote(t.cases?.primary||[])}${A(t.cases?.secondary).length?`<div class="a2-divider"></div><div class="a2-kicker">AUTRES CAS</div>${caseTags(t.cases.secondary)}${stressCaseNote(t.cases.secondary)}`:''}${A(t.cases?.laboratory).length?`<div class="a2-divider"></div><div class="a2-kicker">LABORATOIRE</div>${caseTags(t.cases.laboratory)}`:''}</section>${A(t.guardrails).map(g=>`<div class="a2-callout"><strong>Garde-fou</strong>${E(g)}</div>`).join('')}<section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(t.structural_connections)}</section>`,'Atlas 2 · '+t.title,'Transformation transversale')}

function atlas2Configurations(){return page(`${hero('ATLAS 2 · CONFIGURATIONS','Configurations','Six configurations du MONDE, un opérateur de configuration au plan COMPOSITION et une CONFIGURATION DE LECTURE séparée. Chaque nœud possède désormais définition, conditions de tenue, dynamique, contrastes et cas.')}${a2Nav()}<div class="a2-grid">${A(D.configurations).map(c=>`<button class="a2-card" onclick="go('atlas2-configuration/${c.id}')"><div class="num">${E(c.kind||'CONFIGURATION')} · ${E(c.plane)}</div><h3>${E(c.title)}</h3><p>${E(c.definition||'')}</p><div class="meta">${A(c.cases).length} cas documentés</div></button>`).join('')}</div>`,'Atlas 2 · Configurations','Configurations et opérateurs')}
function atlas2Configuration(){const c=A(D.configurations).find(x=>x.id===arg());if(!c)return atlas2Configurations();return page(`<button class="a2-back" onclick="go('atlas2-configurations')">← Configurations</button>${hero(`${c.kind||'CONFIGURATION'} · ${c.plane}`,c.title,E(c.definition||''))}${textList('CONDITIONS DE TENUE / PRODUCTION',c.conditions)}${textList('DYNAMIQUE',c.dynamics)}${textList('CONTRASTES / GARDE-FOUS',c.contrasts)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(c.cases)}</section><section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(c.structural_connections)}</section>`,'Atlas 2 · '+c.title,'Configuration transversale')}
function atlas2Forms(){return page(`${hero('ATLAS 2 · FORMES & MOTIFS','Formes & motifs','Cinq formes globales. Chaque page suit leurs fonctions variables : même motif ≠ même fonction, et aucune signification sans configuration.')}${a2Nav()}<div class="a2-grid">${A(D.forms).map(f=>`<button class="a2-card" onclick="go('atlas2-form/${f.id}')"><div class="num">FORME GLOBALE</div><h3>${E(f.title)}</h3><p>${E(f.definition||'')}</p><div class="meta">${A(f.functions).join(' · ')}</div></button>`).join('')}</div>`,'Atlas 2 · Formes & motifs','Même motif ≠ même fonction')}
function atlas2Form(){const f=A(D.forms).find(x=>x.id===arg());if(!f)return atlas2Forms();return page(`<button class="a2-back" onclick="go('atlas2-forms')">← Formes & motifs</button>${hero('FORME & MOTIF',f.title,E(f.definition||''))}${detailTags('FONCTIONS POSSIBLES',f.functions)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(f.cases)}</section>${textList('GARDE-FOUS',f.guardrails)}<section class="a2-section"><h3>RACCORDS STRUCTURELS</h3>${connectionButtons(f.structural_connections)}</section>`,'Atlas 2 · '+f.title,'Fonctions variables d’un motif')}
function atlas2Problems(){return page(`${hero('ATLAS 2 · PROBLÈMES','Problèmes','Six problèmes transversaux. Une page PROBLÈME compare des réponses différentes apportées par les œuvres sans transformer la question en théorie maîtresse.')}${a2Nav()}<div class="a2-grid">${A(D.problems).map(p=>`<button class="a2-card" onclick="go('atlas2-problem/${p.id}')"><div class="num">PROBLÈME GLOBAL</div><h3>${E(p.title)}</h3><p>${E(p.question||'')}</p><div class="meta">${A(p.cases).length} cas comparés</div></button>`).join('')}</div>`,'Atlas 2 · Problèmes','Questions transversales')}
function atlas2Problem(){const p=A(D.problems).find(x=>x.id===arg());if(!p)return atlas2Problems();return page(`<button class="a2-back" onclick="go('atlas2-problems')">← Problèmes</button>${hero('PROBLÈME GLOBAL',p.title,E(p.question||''))}<section class="a2-section"><h3>TENSION CONSTITUTIVE</h3><p>${E(p.tension||'')}</p></section>${detailTags('RÉPONSES OBSERVÉES',p.responses)}<section class="a2-section"><h3>CAS COMPARÉS</h3>${caseCards(p.cases)}</section>${textList('PROBLÈMES VOISINS / DISTINCTIONS',p.neighbors)}`,'Atlas 2 · '+p.title,'Problème transversal')}
function atlas2Optics(){return page(`${hero('ATLAS 2 · OPTIQUES','Optiques','Une optique est un filtre de lecture, pas une théorie maîtresse. Chaque page indique ce qu’elle fait voir, les questions qu’elle pose, ses angles morts et ses couplages utiles.')}${a2Nav()}<div class="a2-grid">${A(D.optics).map(o=>`<button class="a2-card" onclick="go('atlas2-optic/${o.id}')"><div class="num">OPTIQUE</div><h3>${E(opticTitle(o))}</h3><p>${E(o.definition||'')}</p><div class="meta">Couplages : ${A(o.couplings).join(' · ')}</div></button>`).join('')}</div>`,'Atlas 2 · Optiques','Filtres de lecture')}
function atlas2Optic(){const o=optic(arg());if(!o)return atlas2Optics();return page(`<button class="a2-back" onclick="go('atlas2-optics')">← Optiques</button>${hero('OPTIQUE',o.title,E(o.definition||''))}${textList('QUESTIONS',o.questions)}${textList('ANGLES MORTS / GARDE-FOUS',o.blindspots)}${detailTags('COUPLAGES UTILES',o.couplings)}<section class="a2-section"><h3>CAS EXEMPLAIRES</h3>${caseTags(o.cases)}${stressCaseNote(o.cases)}</section>`,'Atlas 2 · '+o.title,'Filtre de lecture')}
function atlas2Routes(){
 const routes=A(D.routes).sort((a,b)=>a.order-b.order);
 return page(`${hero('ATLAS 2 · ROUTES','Routes','Parcours éditoriaux courts : 3 à 6 stations choisies pour faire progresser une question. Une route n’est jamais exhaustive et une nouvelle œuvre n’y est jamais ajoutée automatiquement.')}${a2Nav()}<div class="a2-callout"><strong>RÈGLE LOCK</strong>ROUTE = 3–6 STATIONS CURATÉES. Les autres œuvres liées apparaissent comme prolongements ; elles ne gonflent pas la route canonique.</div><section class="a2-grid">${routes.map(r=>`<button class="a2-card" onclick="go('atlas2-route/${r.id}')"><div class="num">ROUTE ${String(r.order).padStart(3,'0')} · ${A(r.steps).length} STATIONS</div><h3>${E(r.title)}</h3><p>${E(r.question||'')}</p><div class="meta">${A(r.focus).map(E).join(' · ')}</div></button>`).join('')}</section>`,'Atlas 2 · Routes','Progressions comparatives')
}
function atlas2Route(){
 const r=route(arg());if(!r)return atlas2Routes();
 const steps=A(r.steps);
 const extensions=A(r.extensions);
 return page(`${hero('ATLAS 2 · ROUTE '+String(r.order).padStart(3,'0'),r.title,E(r.question||''))}<button class="a2-back" onclick="go('atlas2-routes')">← Routes</button>${tags(r.focus)}<section class="a2-section"><div class="a2-kicker">PARCOURS CANONIQUE · ${steps.length} STATIONS</div>${steps.map((st,i)=>{const x=station(st.ref_id);return `<div class="a2-route"><div class="step">${i+1}</div><div><h4><button class="a2-link" onclick="go('${stationPage(st.ref_id,st.kind)}')">${E(x?.title||st.ref_id)}</button> · ${E(st.operation)}</h4><p>${E(st.note||'')}</p></div></div>`}).join('')}</section>${extensions.length?`<section class="a2-section"><div class="a2-kicker">PROLONGER LA ROUTE</div><p>Ces œuvres sont liées à la question mais ne font pas partie du parcours canonique.</p>${extensions.map(st=>`<button class="a2-link" onclick="go('${stationPage(st.ref_id,st.kind)}')">${E(station(st.ref_id)?.title||st.ref_id)}</button>`).join('')}</section>`:''}<div class="a2-callout"><strong>RÈGLE DE SCALABILITÉ</strong>Ajouter une œuvre à Atlas 2 ne modifie pas cette Route. Une station ne change que si une décision éditoriale explicite remplace un cas par un autre.</div>`,'Atlas 2 · Route','Parcours comparatif')
}
function atlas2Lab(){return page(`<button class="a2-back" onclick="go('atlas2')">← Atlas 2</button>${hero('LABORATOIRE · STYLE','Raymond Queneau — Exercices de style','Un même matériau narratif est soumis à des opérations de variation. Queneau calibre la page STYLE et reste un LABORATOIRE séparé du corpus des œuvres.') }<section class="a2-section"><h3>MACHINE</h3>${machine(['MATIÈRE','OPÉRATIONS','SURFACE'])}<div class="a2-callout"><strong>STYLE V2</strong>MATIÈRE → OPÉRATIONS → SURFACE × CONFIGURATION D’INSERTION → EFFET</div>${contextBlock('LECTURE DE LA MACHINE','La matière narrative demeure suffisamment reconnaissable pour que les opérations appliquées à sa formulation puissent être comparées. La chaîne visuelle ne vaut donc pas comme explication autonome : elle résume un processus dans lequel une opération transforme la surface, tandis que la configuration d’insertion détermine la fonction et l’effet de cette variation.')}</section><section class="a2-section"><h3>FONCTION DANS ATLAS 2</h3><p>Le laboratoire permet de distinguer ce qui demeure invariant, ce qui varie et à quelle échelle l’opération stylistique agit. Il sert de calibration pour ne pas confondre style, simple surface et processus de production.</p></section><section class="a2-section"><h3>CONTRASTE BORGES</h3><p>Queneau : matière narrative relativement stable → surfaces variées. Borges : surface verbalement identique → trajectoires et configurations différentes → effets différents. Ce contraste empêche de réduire STYLE à une liste de procédés de surface.</p></section>`,'Atlas 2 · Queneau','Laboratoire STYLE')}

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
