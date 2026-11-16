(function(){
'use strict';
// No alteration to Atlas 1 source content; home() is the pre-existing Deleuzian landing page.
const originalAtlas1Home=home;
PAGE_HANDLERS.atlas1=originalAtlas1Home;
const territories=[
  ['01','Atlas deleuzien','L’histoire de la philosophie vue par Deleuze. Auteurs, œuvres, concepts, routes et interludes.','atlas1'],
  ['02','Récits et formes','La singularité des œuvres, leurs configurations, leurs transformations et leurs relations.','atlas2'],
  ['03','Théâtre du sentir','Sensibilité, mémoire, intériorité, jeu, expression et rencontre.','atlas3']
];
PAGE_HANDLERS.home=function(){
  const cards=territories.map(([num,title,desc,path])=>`<button class="atlas-hub-card" onclick="go('${path}')"><span class="atlas-hub-num">${num}</span><h3>${title}</h3><p>${desc}</p><span class="atlas-hub-visit">ENTRER DANS L’ATLAS ›</span></button>`).join('');
  return shell(`<div class="atlas-hub"><div class="atlas-hub-head"><div class="atlas-hub-eyebrow">Trois territoires autonomes</div><h2>ATLAS</h2><p>Parcourir les pensées, explorer les œuvres et approfondir l’expérience vécue.</p></div><div class="atlas-hub-grid">${cards}</div><div class="atlas-hub-foot">Chaque Atlas garde son objet, ses sources et sa méthode. Leurs rapprochements ne remplacent pas les analyses.</div></div>`,{home:true,dark:true,title:'Atlas',sub:'Explorer trois territoires'});
};
const territories3=[
 ['01','Vie sensible et corporelle','Attention aux sensations, présence physique, émotions, atmosphères et dimension éprouvée de l’existence.'],
 ['02','Introspection et connaissance de soi','Habitudes, réactions, désirs, contradictions et conditionnements, sans réduire l’expérience à une quête de performance.'],
 ['03','Mémoire et culture de l’imaginaire','Souvenirs, rencontres, paysages, voix, œuvres et impressions sensibles ; leur place dans la mémoire et dans la narration.'],
 ['04','Théâtre et possibilités d’expression','Jeu de rôles, parole, voix, personnages, registres émotionnels et improvisation ; comment une forme jouée déplace l’expérience.'],
 ['05','Conversation et relation humaine','Écoute, présence, spontanéité, altérité et invention relationnelle ; la rencontre comme événement imprévisible.']
];
PAGE_HANDLERS.atlas3=function(){
 const cards=territories3.map(([num,title,desc])=>`<article class="atlas3-territory"><div class="kicker">TERRITOIRE ${num}</div><h3>${title}</h3><p>${desc}</p></article>`).join('');
 return shell(`<div class="atlas3-page"><div class="atlas3-hero"><div class="atlas3-kicker">ATLAS 3 · FONDATION V1 · CORPUS EN CONSTRUCTION</div><h2>Théâtre du sentir</h2><p>Un laboratoire vivant de l’existence, où la sensation, la mémoire, la philosophie, l’imaginaire, le jeu et la relation se rencontrent. Ni école de thérapie, ni programme d’optimisation, ni technique théâtrale fermée.</p></div><div class="atlas3-idea"><blockquote>La sensibilité nourrit le jeu, et le jeu intensifie la sensibilité.</blockquote><p>Principe du document fondateur · 15 novembre 2026</p></div><h3 class="atlas3-section-title">Cinq territoires d’exploration</h3><div class="atlas3-territories">${cards}</div><aside class="atlas3-note"><h3>Un projet encore ouvert</h3><p>Ce premier espace reprend uniquement l’architecture du document fondateur. Les analyses de Luis Ansa, Yalom, de l’IFS et des pratiques du jeu devront être reconstruites à partir des sources avant leur intégration. Aucune méthode quotidienne n’est imposée. Les expériences privées ne sont pas publiées sur ce site.</p></aside><button class="nav-card" onclick="go('home')"><span class="nav-ic">⌂</span><span><h3>Revenir aux trois Atlas</h3><p>Choisir un autre territoire sans confondre leurs objets.</p></span><span class="chev">›</span></button></div>`,{title:'Atlas 3 · Théâtre du sentir',sub:'Sentir, jouer, rencontrer'});
};
const groupedNav=[
 ['home','Accueil','Choisir un territoire.','⌂'],
 ['atlas1','Atlas 1 · Deleuze','Histoire de la philosophie vue par Deleuze.','Ⅰ'],
 ['atlas2','Atlas 2 · Récits et formes','Œuvres, configurations, transformations.','Ⅱ'],
 ['atlas3','Atlas 3 · Théâtre du sentir','Expériences, mémoire, jeu, relation.','Ⅲ']
];
NAV.splice(0,NAV.length,...groupedNav);
// Single entry for Atelier: ŒUVRE is placed INSIDE it as a subordinate navigation link.
const navButton=(path,title,desc,mark,cls='')=>`<button class="drawer-link ${cls}" onclick="closeDrawer();go('${path}')"><b>${mark}&nbsp; ${title}</b><span>${desc}</span></button>`;
renderDrawer=function(){const drawer=document.getElementById('drawerNav');if(!drawer)return;drawer.innerHTML=`<div class="drawer-section-label">Explorer</div>${groupedNav.map(([path,title,desc,mark])=>navButton(path,title,desc,mark)).join('')}<div class="drawer-divider"></div><div class="drawer-section-label">Atelier de création</div>${navButton('atelier','Atelier','Projets, sessions, tests et décisions.','◆')}${navButton('oeuvre','ŒUVRE','Les décisions retenues et leurs conséquences.','✦','drawer-subitem')}`};
renderDrawer();render();
})();
