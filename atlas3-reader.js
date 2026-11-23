/* ATLAS V10.17 — lecteur éditorial Atlas 3 et passerelle pilote.
 * Greffe après atlas-hub.js : aucune mutation des corpus Atlas 1/2.
 */
(function () {
  'use strict';
  const data = window.ATLAS3_PUBLICATION;
  const salonEdition=window.ATLAS3_SALON_V2||{scenes:[]};
  const sourceAudit=window.ATLAS3_SOURCE_AUDIT_V14||{chapters:{}};
  if (!data || !Array.isArray(data.chapters) || typeof PAGE_HANDLERS === "undefined") {
    console.error('Atlas 3 : prépublication ou navigation indisponible.');
    return;
  }
  const chapterMap = Object.fromEntries(data.chapters.map(c => [c.id, c]));
  const guide = window.ATLAS3_GUIDE_V12 || {chapters:{},routes:[],thesis:'',limitations:'',difference:''};
  const critical=window.ATLAS3_CRITICAL_V13||{chapters:{}};
  const doorMap = Object.fromEntries(data.salon.doors.map(d => [d.id, d]));
  const e = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  const chapterPath = id => 'atlas3/' + id;
  const doorPath = id => 'atlas3/salon/' + id;
  const parcoursPath = id => 'atlas3/parcours/' + id;
  const section = (title, body, cls='') => `<section class="a3r-block ${cls}"><h2>${e(title)}</h2>${body}</section>`;
  const btn = (path, label, cls='') => `<button type="button" class="a3r-link ${cls}" onclick="go('${path}')">${e(label)}</button>`;
  const crumb = (extra='') => `<nav class="a3r-crumb" aria-label="Navigation Atlas 3">${btn('atlas3','Accueil d’Atlas 3')}${extra ? `<span>${e(extra)}</span>` : ''}</nav>`;
  const note = ''; // Les numéros de version et mentions internes restent hors du lecteur.
  const C = name => data.chapters.find(c => c.id === name);

  // Les noms de notes internes dans les bibliographies ne sont pas des URL publiques.
  // Corriger les anciens faux liens sans toucher au texte ni à la provenance.
  function verifiedAtlas3Sources(input){
    return String(input||'').replace(/<a\b[^>]*href=["']http:\/\/Atlas3_([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,(_,filename,label)=>{
      const chapter=filename.match(/^Chapitre_(\d\d)_/i);
      if(chapter){
        const id='chapitre-'+chapter[1];
        if(chapterMap[id])return `<button type="button" class="a3r-source-internal" onclick="go('atlas3/${id}')">${e(label)} · lire dans Atlas 3</button>`;
      }
      if(/^Le_Salon_des_possibles_/i.test(filename))return `<button type="button" class="a3r-source-internal" onclick="go('atlas3/salon')">${e(label)} · ouvrir le Salon</button>`;
      return `<span class="a3r-source-unpublished" title="Document de travail cité, non publié dans l'application">${e(label)} <small>— archive de travail non accessible ici</small></span>`;
    });
  }


  /* V1.5 : supplément de situations et de formes ; aucun changement au corpus source. */
  function edition15(){return window.ATLAS3_V15||null;}

  /* Exercices originaux : expérience située, regard critique et transposition dans la vie ordinaire.
     Aucun exercice ne constitue une méthode clinique ni une consigne de performance. */
  const lifePractices={
  "chapitre-01": {
    "title": "Distinguer une sensation d'une interprétation",
    "essai": "En arrivant dans un lieu familier ou nouveau, prenez quelques instants pour relever trois faits perceptibles : une lumière, un bruit, un appui, une température. Formulez séparément l'impression générale qui vous vient. Si c'est possible, modifiez un seul élément matériel, par exemple votre place.",
    "observer": "Qu'avez-vous réellement perçu ? Qu'aviez-vous déjà supposé ? L'impression a-t-elle changé après ce petit déplacement ?",
    "transposer": "Utile lorsque vous prenez rapidement un endroit, une ambiance ou une personne pour « accueillant » ou « hostile ». Il ne s'agit pas de mépriser une intuition, mais d'en distinguer les indices."
  },
  "chapitre-02": {
    "title": "Écouter au lieu de vérifier sa propre présence",
    "essai": "Dans une conversation sans enjeu particulier, essayez pendant un échange de porter l'attention sur la dernière phrase de votre interlocuteur plutôt que sur votre posture, votre répartie ou l'image que vous donnez. Répondez à ce que vous avez entendu, sans chercher une réponse parfaite.",
    "observer": "Quelle information nouvelle avez-vous réellement reçue ? Qu'est-ce qui vous a échappé lorsque vous contrôliez votre manière d'être ?",
    "transposer": "À explorer dans une discussion ordinaire, une répétition ou un travail collectif. Être attentif n'oblige ni à fixer l'autre ni à être disponible à tout moment."
  },
  "chapitre-03": {
    "title": "Laisser une expérience rester ordinaire",
    "essai": "Pendant une minute, remarquez un détail banal : un reflet sur une table, une variation de température, un bruit au loin. N'essayez ni de prolonger l'impression ni d'en tirer une révélation. Reprenez ensuite votre activité.",
    "observer": "Quelque chose a-t-il simplement été remarqué ? Ou rien de notable n'est-il arrivé ? Les deux réponses sont possibles.",
    "transposer": "Cette expérience aide à sortir de l'idée qu'un moment de présence doit nécessairement être intense, apaisant ou transformateur."
  },
  "chapitre-04": {
    "title": "Observer ses rôles sans chercher un « vrai moi »",
    "essai": "Choisissez une information banale que vous pourriez communiquer à un ami, à un collègue ou à un inconnu. Imaginez ou formulez deux manières de la dire selon le destinataire, sans changer les faits.",
    "observer": "Quels mots, gestes ou niveaux de précision se déplacent avec la relation ? Qu'est-ce qui reste constant ?",
    "transposer": "Dans la vie quotidienne, changer de registre ne signifie pas forcément se trahir. La question est plutôt de comprendre ce que chaque situation demande et ce qu'elle vous permet."
  },
  "chapitre-05": {
    "title": "Rendre visible un automatisme",
    "essai": "Choisissez une habitude sans conséquence importante — votre place à table, l'ordre d'une petite tâche, votre chemin dans une pièce — et faites-la autrement une seule fois. Ne cherchez pas à transformer toute votre routine.",
    "observer": "À quel moment êtes-vous revenu spontanément vers l'ancienne façon de faire ? Était-ce une commodité, une contrainte réelle ou une préférence ?",
    "transposer": "Quand une réaction paraît « être vous », observer ses circonstances permet parfois de distinguer une habitude utile d'une possibilité de choix."
  },
  "chapitre-06": {
    "title": "Choisir lorsque le temps est limité",
    "essai": "Devant un créneau réellement court et trois tâches possibles, décidez laquelle mérite ce temps et lesquelles peuvent attendre. Prenez votre décision sans chercher ensuite à justifier chacune des options écartées.",
    "observer": "Qu'est-ce que la limite a rendu plus clair ? A-t-elle changé l'importance de la tâche ou seulement l'urgence ressentie ?",
    "transposer": "La conscience d'une limite peut éclairer des priorités personnelles ; elle ne commande pas d'optimiser chaque minute."
  },
  "chapitre-07": {
    "title": "Accueillir un souvenir qui vient de lui-même",
    "essai": "Si une odeur, une musique ou un lieu fait surgir spontanément un souvenir ordinaire, remarquez quel détail du présent l'a appelé. Vous pouvez le noter en quelques mots, puis revenir à ce que vous faisiez. Inutile de chercher volontairement un souvenir.",
    "observer": "Qu'est-ce qui appartient à la sensation présente, et qu'est-ce que la mémoire ajoute ? Le souvenir s'est-il imposé ou n'est-il pas venu ?",
    "transposer": "Permet d'observer les liens entre expérience et mémoire sans faire de la reviviscence émotionnelle un exercice ni une obligation."
  },
  "chapitre-08": {
    "title": "Distinguer les faits du récit que l'on en fait",
    "essai": "Reprenez un événement mineur de la journée : une attente, un objet égaré, un retard. Écrivez une phrase décrivant ce qui s'est passé, puis une phrase décrivant ce que cela a signifié pour vous. Imaginez enfin ce qu'un autre participant aurait pu remarquer.",
    "observer": "Quels éléments sont communs aux versions, et quels éléments dépendent du point de vue ? Avez-vous confondu une hypothèse sur l'autre avec son expérience réelle ?",
    "transposer": "À utiliser pour relire un malentendu léger sans prétendre connaître à l'avance les intentions d'autrui."
  },
  "chapitre-09": {
    "title": "Donner une forme concrète à l'imaginaire",
    "essai": "Prenez un objet ordinaire et imaginez, le temps d'un geste, qu'il est particulièrement fragile ou lourd, sans modifier l'objet lui-même. Portez-le de deux manières et observez les choix de mouvement, de rythme et de distance.",
    "observer": "Qu'est-ce qui a changé dans l'action grâce à cette hypothèse ? Qu'est-ce qui n'a pas changé dans la réalité de l'objet ?",
    "transposer": "L'imagination peut élargir les manières d'agir ou de créer sans que l'on doive attribuer un sens psychologique caché à chaque geste."
  },
  "chapitre-10": {
    "title": "Partir d'une action plutôt que fabriquer un état",
    "essai": "Dans une situation simple, formulez ce que vous voulez faire concrètement : demander une précision, transmettre une information, proposer un horaire. Distinguez cette action d'un état que vous aimeriez ressentir, comme « être à l'aise » ou « avoir confiance ».",
    "observer": "Que s'est-il passé lorsque vous avez agi ? La réponse de l'autre a-t-elle déplacé votre objectif ? L'émotion a-t-elle changé ou non ?",
    "transposer": "Dans les interactions, comme sur scène, les actes peuvent être travaillés directement ; le sentiment qui les accompagne ne se commande pas."
  },
  "chapitre-11": {
    "title": "Entendre ce que la formulation transforme",
    "essai": "Prononcez à voix basse « On a encore le temps » en marquant d'abord une pause après « encore », puis en laissant la phrase couler. Imaginez dans quel contexte l'une ou l'autre version pourrait retenir, rassurer ou reporter une décision.",
    "observer": "Qu'est-ce qui change avec l'accent, la durée et l'adresse ? Quels effets restent seulement supposés tant qu'un autre n'a pas répondu ?",
    "transposer": "Avant une conversation délicate, explorer plusieurs formulations peut aider à choisir une parole plus juste sans prétendre contrôler son effet."
  },
  "chapitre-12": {
    "title": "Inventer à partir d'une contrainte réelle",
    "essai": "Choisissez un petit problème quotidien qui admet plusieurs solutions : une activité à organiser avec peu de temps ou un espace limité. Fixez les contraintes effectives, puis imaginez deux façons de procéder sans supprimer ces contraintes.",
    "observer": "Quelle possibilité n'apparaissait pas tant que vous cherchiez une solution idéale ? Quel obstacle reste réel ?",
    "transposer": "L'improvisation ne signifie pas agir au hasard : elle consiste à répondre avec les moyens et les partenaires présents."
  },
  "chapitre-13": {
    "title": "Faire place à une réponse inattendue",
    "essai": "Dans une conversation ordinaire, posez une question ouverte dont vous n'avez pas décidé la réponse à l'avance. Écoutez sans ramener immédiatement ce qui est dit à votre propre exemple ; laissez à l'autre le choix de ne pas développer.",
    "observer": "Qu'avez-vous appris que vous ne pouviez pas prévoir ? À quel moment vouliez-vous reprendre la direction de l'échange ?",
    "transposer": "La rencontre suppose une différence irréductible entre deux personnes ; elle n'exige ni dévoilement intime ni accord."
  },
  "chapitre-14": {
    "title": "Écouter et poser une limite",
    "essai": "Représentez-vous une demande quotidienne à laquelle vous ne pouvez pas répondre favorablement. Formulez un refus bref et courtois, puis une alternative éventuelle si vous souhaitez réellement en proposer une. Il peut s'agir d'une répétition solitaire.",
    "observer": "Le refus devient-il moins clair lorsque vous cherchez à vous justifier longuement ? Qui supporte le coût du refus dans la situation envisagée ?",
    "transposer": "Comprendre une demande ne crée pas l'obligation d'y consentir. Le rapport d'autorité et les conséquences concrètes comptent dans la manière de répondre."
  },
  "chapitre-15": {
    "title": "Construire quelque chose sans effacer l'autre",
    "essai": "Dans une petite décision partagée — organiser un repas, une sortie ou une activité — partez d'une proposition d'autrui et ajoutez une contribution qui la transforme sans l'annuler. Si l'idée ne vous convient pas, dites clairement où se situe le désaccord.",
    "observer": "Qu'est-ce qui a véritablement été inventé ensemble ? Quels choix appartiennent encore à chacun ?",
    "transposer": "Créer à plusieurs n'oblige pas à fusionner les intentions. Un accord vivant peut aussi conserver des écarts."
  }
};
  function lifePracticeForChapter(id){
    const x=lifePractices[id];if(!x)return '';
    return '<section class="a3r-v16-practice" aria-label="Expérimenter dans la vie quotidienne">'+
      '<div class="a3r-eyebrow">4 · ESSAYER DANS SA VIE</div><h3>'+e(x.title)+'</h3>'+
      '<p class="a3r-v16-practice-step"><strong>Une expérience possible</strong>'+e(x.essai)+'</p>'+
      '<p class="a3r-v16-practice-step"><strong>À observer</strong>'+e(x.observer)+'</p>'+
      '<p class="a3r-v16-practice-step"><strong>Ce que cela peut éclairer</strong>'+e(x.transposer)+'</p>'+
      '<p class="a3r-v16-practice-foot">Proposition facultative : observer ce qui arrive suffit ; aucun résultat n’est attendu.</p>'+
      '</section>';
  }


  function chapterSupplement(id){
    const ed=edition15(),x=ed&&ed.chapters&&ed.chapters[id];if(!x)return '';
    const sources=(x.sources||[]).map(id=>ed.bibliography.find(b=>b.id===id)).filter(Boolean).map(s=>
      '<li><a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.title)+'</a><p>'+e(s.detail)+'</p><small>'+e(s.status)+'</small></li>'
    ).join('');
    return '<section class="a3r-v15-field a3r-levels" aria-label="Entrer progressivement dans ce chapitre"><div class="a3r-eyebrow">REPÈRES POUR LA LECTURE</div>'+
      '<h2>'+e(x.title)+'</h2>'+
      '<div class="a3r-v15-step a3r-discovery"><h3>1 · Découvrir : une situation concrète</h3><p>'+e(x.situation)+'</p><p class="a3r-v15-watch"><strong>La question :</strong> '+e(x.question)+'</p></div>'+
      '<details class="a3r-v15-depth" open><summary>2 · Comprendre ce qui change</summary><p>'+e(x.variation)+'</p><p><strong>Revenir à la scène :</strong> '+e(x.retour)+'</p></details>'+
      '<details class="a3r-v15-depth"><summary>3 · Approfondir la forme et les limites</summary><p>'+e(x.forme)+'</p><p><strong>Contre-épreuve :</strong> '+e(x.contrepreuve)+'</p>'+
      '<div class="a3r-v15-sources"><strong>Repères documentaires (statuts distincts)</strong><ul>'+sources+'</ul></div></details>'+
      lifePracticeForChapter(id)+formsForChapter(id)+approachesForChapter(id)+'</section>';
  }
  function doorSupplement(id){
    const ed=edition15(),x=ed&&ed.scenes&&ed.scenes[id];if(!x)return '';
    const acts=x.partitions.map((p,i)=>
      '<details class="a3r-v15-partition"'+(i===0?' open':'')+'><summary><span class="a3r-section-count">'+String(i+1).padStart(2,'0')+'</span>'+e(p.title)+'</summary>'+
      '<p>'+e(p.instruction)+'</p><p class="a3r-v15-watch"><strong>À regarder :</strong> '+e(p.regarder)+'</p></details>'
    ).join('');
    return '<section class="a3r-v15-field a3r-v15-salon" aria-label="Partitions facultatives"><div class="a3r-eyebrow">TROIS VARIATIONS DE JEU</div>'+
      '<h2>Agir, réagir, composer</h2><p class="a3r-v15-lead">'+e(x.question)+'</p>'+acts+
      '<p class="a3r-v15-guard"><strong>Limite :</strong> '+e(x.guard)+'</p><p class="a3r-v15-lead">Ces trois partitions sont des créations pédagogiques d’Atlas 3. Elles offrent plusieurs façons de lire, d’observer ou de jouer cette scène.</p></section>';
  }
  function enquiriesIndex(){
    const ed=edition15();if(!ed)return '';
    const parcours=guide.routes.map(r=>'<li>'+btn(parcoursPath(r.id),r.title)+'</li>').join('');
    const enquete=ed.enquiries.map(x=>'<li>'+btn('atlas3/enquete/'+x.id,x.title)+'</li>').join('');
    return '<details class="a3r-v15-library a3r-pathways"><summary>Explorer par une question · parcours et enquêtes</summary>'+
      '<p>Les parcours relient une scène à plusieurs chapitres. Les enquêtes interrogent des problèmes de jeu et la circulation entre expérience vécue et création, sans fusionner les traditions.</p>'+
      '<div class="a3r-pathway-groups"><section><h3>Quatre parcours de situations</h3><ul>'+parcours+'</ul></section>'+
      '<section><h3>'+ed.enquiries.length+' enquêtes pour approfondir</h3><ul>'+enquete+'</ul></section></div></details>';
  }

  function approachesForChapter(id){
    const ed=edition15();if(!ed?.approaches)return '';
    const relevant=ed.approaches.filter(x=>(x.related||[]).includes(id));
    if(!relevant.length)return '';
    return '<nav class="a3r-v15-form-links" aria-label="Approches sensibles, philosophiques et cliniques"><strong>Approches complémentaires</strong><div>'+
      relevant.map(x=>btn('atlas3/approche/'+x.id,x.title)).join('')+'</div></nav>';
  }
  function approachesIndex(){
    const ed=edition15();if(!ed?.approaches)return '';
    const cards=ed.approaches.map(x=>'<button type="button" class="a3r-approach-choice" onclick="go(\'atlas3/approche/'+x.id+'\')"><strong>'+e(x.title)+'</strong>'+
      '<small>'+e(x.domain)+'</small><span>'+e(x.question)+'</span></button>').join('');
    return '<section class="a3r-approaches-index"><h2>'+ed.approaches.length+' approches pour approfondir</h2><p>Ansa, Gendlin, Winnicott, Jung, l’IFS, Buber et Yalom abordent des problèmes distincts du sentir, du jeu, de la création et de la relation. Chaque fiche conserve sa méthode, ses sources et ses limites.</p>'+ 
      '<div class="a3r-v15-form-grid">'+cards+'</div></section>';
  }
  function approachPage(id){
    const ed=edition15(),x=ed?.approaches?.find(z=>z.id===id);if(!x)return missing();
    const terms=(x.terms||[]).map(t=>'<details class="a3r-v15-term"><summary>'+e(t.term)+'</summary><p>'+e(t.definition)+'</p></details>').join('');
    const sources=(x.links||[]).map(t=>'<li><a href="'+e(t.url)+'" target="_blank" rel="noopener noreferrer">'+e(t.label)+'</a><small>'+e(t.kind)+'</small></li>').join('');
    const passages=(x.related||[]).map(id=>ed.chapters[id]?
      btn('atlas3/'+id,'Chapitre '+id.slice(-2)+' · '+ed.chapters[id].title):'').join('');
    const scenes=(x.scenes||[]).map(id=>doorMap[id]?btn('atlas3/salon/'+id,doorMap[id].title):'').join('');
    const content='<div class="a3r-wrap">'+crumb('Approche du sentir')+
      '<header class="a3r-hero"><div class="a3r-eyebrow">APPROCHES DU SENTIR</div><h1>'+e(x.title)+'</h1><p>'+e(x.domain)+'</p></header>'+
      '<article class="a3r-v15-field a3r-levels"><div class="a3r-v15-step a3r-discovery"><h3>1 · Découvrir</h3><p>'+e(x.intro)+'</p><p><strong>Question :</strong> '+e(x.question)+'</p></div>'+
      '<details class="a3r-v15-depth" open><summary>2 · Comprendre l’apport de cette approche</summary><p>'+e(x.principle)+'</p><h3>Une situation pour en éprouver la portée</h3><p>'+e(x.example)+'</p></details>'+
      '<details class="a3r-v15-depth"><summary>3 · Approfondir : concepts, contradictions et limites</summary><p>'+e(x.counter)+'</p><p><strong>Limite :</strong> '+e(x.boundary)+'</p>'+
      (terms&&!window.ATLAS3_FONDATIONS?.docs?.[id]?'<h3>Notions à déplier</h3><div class="a3r-v15-term-list">'+terms+'</div>':'')+
      '<div class="a3r-v15-sources"><h3>Sources et statuts</h3><p>'+e(x.source)+'</p><ul>'+sources+'</ul></div></details></article>'+
      editorialExpansion(id)+
      '<section class="a3r-v15-related"><h2>Revenir à des situations, pas à des étiquettes</h2><div class="a3r-mini-links">'+passages+scenes+(['gendlin','winnicott'].includes(id)?btn('atlas3/enquete/e01','Enquête E01 · Sentir, jouer, créer'):'')+'</div></section>'+
      btn('atlas3','Revenir au Théâtre du sentir')+'</div>';
    return shell(content,{title:'Atlas 3 · '+x.title,sub:'Dossier critique'});
  }

  function formsIndex(){
    const ed=edition15();if(!ed||!Array.isArray(ed.forms))return '';
    const cards=ed.forms.map(x=>'<div class="a3r-v15-form-card"><strong>'+e(x.title)+'</strong><p>'+e(x.problem)+'</p>'+
      btn('atlas3/forme/'+x.id,'Lire ce dossier')+'</div>').join('');
    return '<details class="a3r-v15-library"><summary>Écoles et formes de théâtre · '+ed.forms.length+' dossiers</summary>'+ 
      '<p>Découvrir le problème propre à chaque tradition, ses moyens de jeu, une situation concrète et les textes qui la documentent.</p>'+ 
      '<div class="a3r-v15-form-grid">'+cards+'</div></details>';
  }
  function formsForChapter(id){
    const ed=edition15();if(!ed||!ed.forms)return '';
    const forms=ed.forms.filter(x=>x.related.includes(id));if(!forms.length)return '';
    return '<nav class="a3r-v15-form-links" aria-label="Formes associées à cette question"><strong>Formes pour approfondir</strong><div>'+
      forms.map(x=>btn('atlas3/forme/'+x.id,x.title)).join('')+'</div></nav>';
  }

  // Dossiers longs et notions cliquables : greffe documentaire sans nouveau menu.
  function editorialExpansion(id){
    const d=window.ATLAS3_FONDATIONS?.docs?.[id];if(!d)return '';
    const terms=(d.terms||[]).map((t,i)=>'<button type="button" class="a3r-link" onclick="Atlas3Reader.openEditorialTerm(\''+id+'\','+i+')">'+e(t.term)+'</button>').join('');
    return '<section class="a3r-editorial-full" aria-label="Dossier complet"><details class="a3r-section a3r-editorial-details"><summary>'+(['gendlin','winnicott'].includes(id)?'Lire le dossier de lecture approfondi':'Lire le dossier fondateur intégral')+'</summary>'+
      '<div class="a3r-prose a3r-editorial-prose">'+editorialNotions(d.html,id)+'</div></details>'+
      '<div class="a3r-editorial-terms"><h2>Notions à explorer</h2><div class="a3r-mini-links">'+terms+'</div></div>'+
      '<p class="a3r-quiet">'+e(d.edition)+' · '+e(d.source)+'</p>'+
      '<div id="a3r-notion-modal" class="a3r-modal" hidden onclick="if(event.target===this)Atlas3Reader.closeNotion()"></div></section>';
  }
  function editorialNotions(html,id){
    const d=window.ATLAS3_FONDATIONS?.docs?.[id],doc=typeof document==='object'?document:null;
    if(!doc?.createTreeWalker||!d?.terms?.length||typeof NodeFilter==='undefined')return html;
    const tpl=doc.createElement('template');tpl.innerHTML=String(html||'');
    const terms=d.terms.map((t,i)=>({i,word:t.term.toLocaleLowerCase('fr')})).sort((a,b)=>b.word.length-a.word.length);
    const counts={},nodes=[],walk=doc.createTreeWalker(tpl.content,NodeFilter.SHOW_TEXT);
    while(walk.nextNode()){
      const node=walk.currentNode,parent=node.parentElement;
      if(parent&&node.nodeValue.trim()&&!parent.closest('button,a,h1,h2,h3,h4,summary,code,pre,script,style,table'))nodes.push(node);
    }
    for(const node of nodes){
      const raw=node.nodeValue,lower=raw.toLocaleLowerCase('fr');
      let best=null;
      for(const t of terms){
        if((counts[t.i]||0)>=2)continue;
        const at=lower.indexOf(t.word);if(at<0)continue;
        const before=at?raw[at-1]:'',after=raw[at+t.word.length]||'';
        if((before&&/[\p{L}\p{N}]/u.test(before))||(after&&/[\p{L}\p{N}]/u.test(after)))continue;
        if(!best||at<best.at)best={t,at};
      }
      if(!best)continue;
      const f=doc.createDocumentFragment();f.appendChild(doc.createTextNode(raw.slice(0,best.at)));
      const btn=doc.createElement('button');btn.type='button';btn.className='a3r-inline-notion';
      btn.textContent=raw.slice(best.at,best.at+best.t.word.length);
      btn.setAttribute('onclick',"Atlas3Reader.openEditorialTerm('"+id+"',"+best.t.i+")");
      btn.setAttribute('aria-label','Comprendre : '+d.terms[best.t.i].term);
      f.appendChild(btn);f.appendChild(doc.createTextNode(raw.slice(best.at+best.t.word.length)));
      node.replaceWith(f);counts[best.t.i]=(counts[best.t.i]||0)+1;
    }
    return tpl.innerHTML;
  }

  function formPage(id){
    const ed=edition15(),x=ed?.forms?.find(z=>z.id===id);if(!x)return missing();
    const ref=ed.bibliography.find(z=>z.id===x.source);
    const related=x.related.map(id=>ed.chapters[id]?btn('atlas3/'+id,'Chapitre '+id.slice(-2)+' · '+ed.chapters[id].title):'').join('');
    const scenes=x.salon.map(id=>doorMap[id]?btn('atlas3/salon/'+id,doorMap[id].title):'').join('');
    const reference=ref?'<div class="a3r-v15-sources"><h3>Document et statut de vérification</h3><a href="'+e(ref.url)+'" target="_blank" rel="noopener noreferrer">'+e(ref.title)+'</a>'+
      '<p>'+e(ref.detail)+'</p><small>'+e(ref.status)+'</small></div>':'';
    const body='<div class="a3r-wrap">'+crumb('Forme théâtrale')+
      '<header class="a3r-hero"><div class="a3r-eyebrow">ÉCOLES ET FORMES DE THÉÂTRE</div><h1>'+e(x.title)+'</h1><p>'+e(x.work)+'</p></header>'+
      '<article class="a3r-v15-field a3r-levels">'+
      '<div class="a3r-v15-step a3r-discovery"><h3>1 · Découvrir : quel problème cette tradition rencontre-t-elle ?</h3><p>'+e(x.problem)+'</p></div>'+
      '<details class="a3r-v15-depth" open><summary>2 · Comprendre ce que cette école fait travailler</summary><p>'+e(x.operation)+'</p><h3>Une situation de découverte</h3><p>'+e(x.scene)+'</p></details>'+
      '<details class="a3r-v15-depth"><summary>3 · Approfondir : singularité, contrepoint et limite</summary><p>'+e(x.contrast)+'</p><p><strong>Ce qu’il ne faut pas conclure :</strong> '+e(x.limit)+'</p>'+reference+'</details></article>'+editorialExpansion(id)+
      '<section class="a3r-v15-related"><h2>Revenir à l’expérience</h2><p>La situation présentée est une création pédagogique d’Atlas 3. Les textes de chaque école permettent d’en approfondir les méthodes historiques.</p><div class="a3r-mini-links">'+related+scenes+'</div></section>'+
      btn('atlas3','Revenir au Théâtre du sentir')+'</div>';
    return shell(body,{title:'Atlas 3 · '+x.title,sub:'Bibliothèque des formes'});
  }

  function enquiry(id){
    const ed=edition15(),route=ed&&ed.enquiries.find(x=>x.id===id);if(!route)return missing();
    const rows=route.steps.map((step,i)=>
      '<li class="a3r-course-step"><div class="a3r-course-step-index">'+String(i+1).padStart(2,'0')+'</div><div><h3>'+e(step[1])+'</h3><p>'+e(step[2])+'</p>'+btn(step[0],'Ouvrir cette étape','a3r-action')+'</div></li>'
    ).join('');
    const kind=id==='e01'?'ENQUÊTE · SENTIR ET JOUER':'ENQUÊTE SUR LES FORMES';
    const body='<div class="a3r-wrap">'+crumb(id==='e01'?'Enquête transversale':'Enquête sur les formes')+'<header class="a3r-hero"><div class="a3r-eyebrow">'+kind+'</div>'+
      '<h1>'+e(route.title)+'</h1><p>'+e(route.question)+'</p></header><p class="a3r-v15-lead">'+e(route.intro)+'</p>'+
      '<ol class="a3r-course-steps">'+rows+'</ol>'+editorialExpansion(id)+'<p class="a3r-v15-guard"><strong>Pour préciser :</strong> '+e(route.limit)+'</p>'+
      btn('atlas3','Revenir à Atlas 3')+'</div>';
    return shell(body,{title:'Atlas 3 · '+route.title,sub:'Enquête sur les formes'});
  }

  function index(){
    const parts=data.parts.map(part=>{
      const links=part.chapters.map(id=>{const c=chapterMap[id];return '<li>'+btn(chapterPath(id),String(c.number).padStart(2,'0')+' · '+c.title,'a3r-chapter-link')+'</li>';}).join('');
      return '<section class="a3r-part"><div class="a3r-eyebrow">Partie '+e(part.id)+'</div><h3>'+e(part.title)+'</h3><p>'+e(part.introduction)+'</p><ul>'+links+'</ul></section>';
    }).join('');
    const body=`<div class="a3r-wrap"><header class="a3r-hero"><h1>Le Théâtre du sentir</h1><p>Se connaître, s’exprimer et rencontrer : explorer ses sensations, ses habitudes, ses façons d’imaginer, d’agir et d’entrer en relation. Le théâtre ouvre des possibilités d’expérience, mais aucune pratique artistique préalable n’est nécessaire.</p></header>
      <section class="a3r-theory-after" aria-labelledby="a3r-theory-heading"><h2 id="a3r-theory-heading">Explorer sa propre expérience</h2><p class="a3r-entry-intro">Quinze chapitres répartis en cinq parties : partir d’une situation concrète, comprendre ce qu’elle révèle, approfondir les idées, puis essayer une variation dans sa vie quotidienne. Choisissez la question qui vous concerne ; aucun ordre n’est imposé.</p><div class="a3r-part-grid">${parts}</div></section>
      ${approachesIndex()}
      <section class="a3r-transversal-after"><h2>Passerelles entre les trois Atlas</h2><p>Aborder une question du sentir par la création de concepts dans Atlas 1 ou par la construction des œuvres dans Atlas 2.</p><div class="a3r-mini-links">${data.passerelles.map(p=>btn('atlas3/passerelle/'+p.id,p.title)).join('')}</div></section>
      <section class="a3r-salon-portal"><h2>Le Salon des possibles</h2><p>Sept scènes originales à lire, observer ou interpréter. Les personnages, les gestes et les variations de jeu deviennent la matière d’une exploration sensible.</p>${btn('atlas3/salon','Explorer les sept scènes','a3r-action')}</section>
      ${enquiriesIndex()}
      ${formsIndex()}
    </div>`;
    return shell(body,{title:'Atlas 3 · Théâtre du sentir',sub:'Se connaître · S’exprimer · Rencontrer'});
  }

  // V1.6.2 : notions dans le texte, pas seulement dans la boussole.
  // Conserver la structure HTML : pas de remplacements dans les balises ou les liens.
  const situatedAliases={
    'chapitre-01':[['sensation','représentation'],['impression']],
    'chapitre-02':[['attention divisée','division de l’attention'],['surveillance de soi']],
    'chapitre-03':[['réception'],['transformation vécue']],
    'chapitre-04':[['moi sociaux','moi social'],['présentation de soi']],
    'chapitre-05':[['habitude'],['parties','personnages']],
    'chapitre-06':[['finitude'],['responsabilité']],
    'chapitre-07':[['mémoire involontaire'],['mémoire-habitude','souvenir-habitude']],
    'chapitre-08':[['reconstruction narrative'],['témoignage','fiction']],
    'chapitre-09':[['monde possible','faire comme si'],['empathie','appropriation']],
    'chapitre-10':[['action dramatique'],['si imaginaire']],
    'chapitre-11':[['acte de parole','actes de parole'],['silence']],
    'chapitre-12':[['proposition de jeu','offre'],['partition ouverte']],
    'chapitre-13':[['considération intérieure'],['Je–Tu','Je–Cela']],
    'chapitre-14':[['écoute'],['refus']],
    'chapitre-15':[['invention commune'],['désaccord']]
  };
  function linkSituatedNotions(fragment,chapterId,sharedCounts){
    const g=guide.chapters[chapterId],doc=typeof document==='object'?document:null;
    if(!g?.terms?.length||!doc?.createElement||!doc?.createTreeWalker||typeof NodeFilter==='undefined')return fragment;
    const tpl=doc.createElement('template');
    tpl.innerHTML=String(fragment||'');
    const terms=g.terms.flatMap((t,i)=>{
      const choices=[t.title,...(situatedAliases[chapterId]?.[i]||[])];
      return [...new Set(choices)].filter(s=>s.length>=4).map(s=>({i,needle:s.toLocaleLowerCase('fr')}));
    }).sort((a,b)=>b.needle.length-a.needle.length);
    const counts=sharedCounts||[0,0],textNodes=[];
    const walker=doc.createTreeWalker(tpl.content,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode,parent=node.parentElement;
      if(!parent||!node.nodeValue.trim()||parent.closest('button,a,h1,h2,h3,summary,code,pre,script,style'))continue;
      textNodes.push(node);
    }
    for(const node of textNodes){
      const raw=node.nodeValue,lower=raw.toLocaleLowerCase('fr');
      let best=null;
      for(const term of terms){
        if(counts[term.i]>=3)continue;
        const pos=lower.indexOf(term.needle);
        if(pos<0)continue;
        const a=pos===0?'':raw[pos-1],b=raw[pos+term.needle.length]||'';
        if((a&&/[\p{L}\p{N}]/u.test(a))||(b&&/[\p{L}\p{N}]/u.test(b)))continue;
        if(!best||pos<best.pos||(pos===best.pos&&term.needle.length>best.term.needle.length))best={pos,term};
      }
      if(!best)continue;
      const frag=doc.createDocumentFragment();
      const label=raw.slice(best.pos,best.pos+best.term.needle.length);
      frag.appendChild(doc.createTextNode(raw.slice(0,best.pos)));
      const button=doc.createElement('button');
      button.type='button';
      button.className='a3r-inline-notion';
      button.textContent=label;
      button.setAttribute('onclick',"Atlas3Reader.openNotion('"+chapterId+"',"+best.term.i+")");
      button.setAttribute('aria-label','Comprendre la notion : '+g.terms[best.term.i].title);
      frag.appendChild(button);
      frag.appendChild(doc.createTextNode(raw.slice(best.pos+best.term.needle.length)));
      node.replaceWith(frag);counts[best.term.i]++;
    }
    return tpl.innerHTML;
  }

  function chapter(id){
    const c=chapterMap[id];if(!c)return missing();
    const evidence=sourceAudit.chapters[id];
    const part=data.parts.find(p=>p.id===c.part_id);
    const g=guide.chapters[id];
    const k=critical.chapters[id];
    const pos=data.chapters.findIndex(x=>x.id===id);
    const prev=data.chapters[pos-1], next=data.chapters[pos+1];
    const notionCounts=[0,0];
    const sections=c.sections.map((s,i)=>`<details class="a3r-section" id="${e(s.id)}"${i===0?' open':''}><summary><span class="a3r-section-count">${String(i+1).padStart(2,'0')}</span><span>${e(s.title)}</span></summary><div class="a3r-prose">${linkSituatedNotions(s.html,id,notionCounts)}</div></details>`).join('');
    const terms=g?.terms?.map((t,i)=>`<button type="button" class="a3r-term-chip" onclick="Atlas3Reader.openNotion('${e(c.id)}',${i})">${e(t.title)}</button>`).join('')||'';
    const readingCompass=g?`<aside class="a3r-compass" aria-label="Boussole du chapitre"><div class="a3r-eyebrow">REPÈRES DE LECTURE · SITUATION VÉCUE</div><p class="a3r-compass-scene">${e(g.scene)}</p><h2>${e(g.question)}</h2><p><strong>Attention :</strong> ${e(g.limit)}</p><details class="a3r-term-collection"><summary>Deux notions à approfondir dans ce chapitre</summary><div class="a3r-term-list">${terms}</div></details></aside>`:'';
    const courses=guide.routes.filter(r=>r.stops.some(s=>s.path===chapterPath(id))).map(r=>btn(parcoursPath(r.id),r.title)).join('');
    const criticalBlock=k?`<aside class="a3r-critical"><div class="a3r-eyebrow">ÉPROUVER LA QUESTION</div><h2>${e(k.title)}</h2><p class="a3r-critical-intro">Une seconde situation permet de distinguer ce que l’on observe, ce que l’on interprète et les conséquences que l’on en tire.</p>${k.paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}<p class="a3r-critical-limit"><strong>À distinguer :</strong> ${e(k.limit)}</p><button type="button" class="a3r-link" onclick="Atlas3Reader.jumpToSection('${e(k.source)}')">Revenir au passage source</button></aside>`:'';
    const relatedCourses=courses?`<aside class="a3r-course-rel"><div class="a3r-eyebrow">CHEMINS DE LECTURE · FACULTATIFS</div><p>Cette question traverse également un parcours de situations. Vous pouvez y entrer ou poursuivre ce chapitre seul.</p><div class="a3r-mini-links">${courses}</div></aside>`:'';
    const doors=(c.salon_portes||[]).map(d=>doorMap[d]?btn(doorPath(d),doorMap[d].title):'').join('');
    const evidenceHtml=evidence?`<div class="a3r-evidence"><h3>Vérification documentaire ciblée · ${e(evidence.degree)}</h3><p><b>Énoncé :</b> ${e(evidence.claim)}</p><p>${e(evidence.evidence)}</p><p><b>Réserve :</b> ${e(evidence.limit)}</p>${evidence.url?`<p><a href="${e(evidence.url)}" target="_blank" rel="noopener noreferrer">Consulter la source contrôlée</a></p>`:''}<small>Ce contrôle ne certifie pas l'ensemble du chapitre ni des pratiques décrites.</small></div>`:'';
    const bridge=data.passerelles.filter(p=>p.chapter_id===c.id).map(p=>`<aside class="a3r-bridge-card"><div class="a3r-eyebrow">CHEMIN TRANSVERSAL · FACULTATIF</div><h2>${e(p.title)}</h2><p>Un détour vers un autre Atlas pour transformer une question de ce chapitre sans en remplacer la lecture.</p>${btn('atlas3/passerelle/'+p.id,'Emprunter la passerelle','a3r-action')}</aside>`).join('');
    const footerLinks=[prev?btn(chapterPath(prev.id),'Chapitre '+String(prev.number).padStart(2,'0')+' · '+prev.title):'',next?btn(chapterPath(next.id),'Chapitre '+String(next.number).padStart(2,'0')+' · '+next.title):''].filter(Boolean).join('');
    const body=`<div class="a3r-wrap">${crumb('Chapitre '+String(c.number).padStart(2,'0'))}<header class="a3r-hero"><div class="a3r-eyebrow">PARTIE ${e(c.part_id)} · ${e(part?.title || '')} · CHAPITRE ${String(c.number).padStart(2,'0')}</div><h1>${e(c.title)}</h1><div class="a3r-prose a3r-intro">${c.introduction_html}</div></header>${note}${readingCompass}${chapterSupplement(id)}${bridge}<div class="a3r-reader-controls"><span>${c.sections.length} sections · lecture libre</span><button type="button" onclick="window.Atlas3Reader.toggleSections(true)">Tout ouvrir</button><button type="button" onclick="window.Atlas3Reader.toggleSections(false)">Tout refermer</button></div><div class="a3r-sections">${sections}</div>${c.pour_poursuivre_html?section('Poursuivre la lecture',`<div class="a3r-prose">${c.pour_poursuivre_html}</div>`):''}${doors?section('Explorer les scènes associées',`<div class="a3r-mini-links">${doors}</div>`):''}${criticalBlock}${relatedCourses}<details class="a3r-sources"><summary>Sources, lectures et limites</summary><div class="a3r-prose">${evidenceHtml}${verifiedAtlas3Sources(c.sources_html)}</div></details><div class="a3r-prevnext">${footerLinks}</div>${btn('atlas3','Revenir aux quinze chapitres')}<div id="a3r-notion-modal" class="a3r-modal" hidden onclick="if(event.target===this)Atlas3Reader.closeNotion()"></div></div>`;
    return shell(body,{title:'Atlas 3 · '+c.title,sub:'Partie '+c.part_id});
  }
  function parcours(id){
    const r=guide.routes.find(x=>x.id===id);
    if(!r)return missing();
    const steps=r.stops.map((s,i)=>`<li class="a3r-course-step"><div class="a3r-course-step-index">${String(i+1).padStart(2,'0')}</div><div><h3>${e(s.label)}</h3><p>${e(s.note)}</p>${btn(s.path,'Entrer dans cette étape','a3r-action')}</div></li>`).join('');
    const body=`<div class="a3r-wrap">${crumb('Parcours facultatif')}<header class="a3r-hero"><div class="a3r-eyebrow">PARCOURS D'EXPÉRIENCE · ${r.stops.length} ÉTAPES</div><h1>${e(r.title)}</h1><p>${e(r.question)}</p></header><div class="a3r-course-intro"><p>${e(r.introduction)}</p><p>Aucune étape n'est obligatoire. Il ne s'agit ni d'un test ni d'un programme de transformation.</p></div><ol class="a3r-course-steps">${steps}</ol>${btn('atlas3','Revenir au Théâtre du sentir')}</div>`;
    return shell(body,{title:'Atlas 3 · '+r.title,sub:'Parcours libre'});
  }
  function salon(){
    const cards=data.salon.doors.map(d=>`<article class="a3r-door"><div class="a3r-eyebrow">PORTE ${String(d.number).padStart(2,'0')}</div><h2>${e(d.title)}</h2>${btn(doorPath(d.id),'Entrer dans cette scène','a3r-action')}</article>`).join('');
    return shell(`<div class="a3r-wrap">${crumb()}<header class="a3r-hero"><div class="a3r-eyebrow">ATLAS 3 · ESPACE DE SCÈNES</div><h1>Le Salon des possibles</h1><p>Sept petites pièces autonomes à lire ou jouer, chacune construite autour d'une situation et d'un événement. Les propositions de jeu initiales restent accessibles.</p></header><div class="a3r-door-grid">${cards}</div>${btn('atlas3','Revenir au sommaire')}</div>`,{title:'Atlas 3 · Salon',sub:'Sept portes'});
  }
  function door(id){
    const d=doorMap[id];if(!d)return missing();
    const newScene=salonEdition.scenes.find(s=>s.id===id);
    const stage=newScene?`<article class="a3r-scene" aria-label="Nouvelle pièce originale"><div class="a3r-eyebrow">SALON V2 · ${e(newScene.form)}</div><h2>${e(newScene.title)}</h2><p class="a3r-scene-cast">${e(newScene.cast)}</p>${newScene.parts.map((text,i)=>`<div class="a3r-scene-part"><p>${e(text)}</p></div>`).join('')}<details class="a3r-scene-interpretation"><summary>Comprendre ce qui se joue</summary><p>${e(newScene.reading)}</p><p><strong>Limite de lecture :</strong> ${e(newScene.limit)}</p></details></article>`:'';
    const oldScene=newScene?`<details class="a3r-original-scene"><summary>Explorer librement : proposition initiale</summary><div class="a3r-prose">${d.html}</div></details>`:`<article class="a3r-prose a3r-door-text">${d.html}</article>`;
    const related=data.relations.filter(r=>r.salon_door_id===id).map(r=>chapterMap[r.chapter_id]).filter(Boolean);
    const links=related.map(c=>btn(chapterPath(c.id),'Chapitre '+String(c.number).padStart(2,'0')+' · '+c.title)).join('');
    const body=`<div class="a3r-wrap">${crumb('Porte '+String(d.number).padStart(2,'0'))}<header class="a3r-hero"><div class="a3r-eyebrow">SALON DES POSSIBLES · PORTE ${String(d.number).padStart(2,'0')}</div><h1>${e(d.title)}</h1><p>Une petite pièce originale à lire, puis éventuellement à jouer ; l’exploration initiale reste facultative.</p></header>${stage}${doorSupplement(id)}${oldScene}${related.length?section('Retrouver la question dans les chapitres',`<div class="a3r-mini-links">${links}</div>`):''}${btn('atlas3/salon','Revenir aux sept portes')}</div>`;
    return shell(body,{title:'Salon · '+d.title,sub:'Atlas 3'});
  }
  function passerelle(id){
    const p=data.passerelles.find(x=>x.id===id);if(!p)return missing();
    const c=chapterMap[p.chapter_id];if(!c)return missing();
    const target=p.atlas2_target?{path:'atlas2-work/'+p.atlas2_target,label:'Lire Jeanne Dielman dans Atlas 2',sub:'Atlas 2 ↔ Atlas 3'}:
      p.atlas1_target?{path:p.atlas1_target,label:'Lire Hume dans Atlas 1',sub:'Atlas 1 ↔ Atlas 3'}:null;
    const jump=target?btn(target.path,target.label,'a3r-action'):'';
    const back=btn(chapterPath(c.id),'Revenir au chapitre '+String(c.number).padStart(2,'0'));
    const bridgeText=p.html.replace(/^<h1>[\s\S]*?<\/h1>\s*/,'');
    const body=`<div class="a3r-wrap a3r-bridge">${crumb('Passerelle')}<header class="a3r-hero"><div class="a3r-eyebrow">CHEMIN TRANSVERSAL · PROPOSITION ÉDITORIALE</div><h1>${e(p.title)}</h1><p>Un détour facultatif depuis le chapitre ${String(c.number).padStart(2,'0')}. La question change ; aucun Atlas n'est réduit à l'autre.</p></header><div class="a3r-bridge-actions">${back}${jump}</div><article class="a3r-prose a3r-bridge-text">${bridgeText}</article><div class="a3r-bridge-actions">${back}${jump}</div><p class="a3r-quiet">Passerelle facultative et réversible. Le statut de consultation des sources et les lectures originales demeurent distincts.</p></div>`;
    return shell(body,{title:'Passerelle · '+p.title,sub:target?.sub||'Atlas 3'});
  }
  function missing(){return shell(`<div class="a3r-wrap"><h1>Page introuvable</h1>${btn('atlas3','Revenir à Atlas 3')}</div>`,{title:'Atlas 3'});}
  function renderAtlas3(){
    const path=typeof current==='function'?current(): 'atlas3';
    const tail=String(path).replace(/^atlas3\/?/,'');
    if(!tail)return index();
    if(tail.startsWith('parcours/'))return parcours(tail.slice(9));
    if(tail.startsWith('enquete/'))return enquiry(tail.slice(8));
    if(tail.startsWith('forme/'))return formPage(tail.slice(6));
    if(tail.startsWith('approche/'))return approachPage(tail.slice(9));
    if(tail==='salon')return salon();
    if(tail.startsWith('salon/'))return door(tail.slice(6));
    if(tail.startsWith('passerelle/'))return passerelle(tail.slice(11));
    if(tail.startsWith('chapitre-'))return chapter(tail);
    return missing();
  }
  let termSource=null,termFocus=null;
  function closeNotion(){
    const modal=document.getElementById('a3r-notion-modal');if(!modal)return;
    modal.hidden=true;modal.innerHTML='';
    if(termFocus?.isConnected)termFocus.focus();
  }

  function openEditorialTerm(id,index){
    const d=window.ATLAS3_FONDATIONS?.docs?.[id],t=d?.terms?.[index],modal=document.getElementById('a3r-notion-modal');
    if(!modal||!t)return;
    termSource=null;termFocus=document.activeElement;
    modal.innerHTML='<div class="a3r-notion-dialog" role="dialog" aria-modal="true" aria-labelledby="a3r-notion-title">'+
      '<button class="a3r-notion-close" type="button" onclick="Atlas3Reader.closeNotion()" aria-label="Fermer la notion">✕</button>'+
      '<div class="a3r-eyebrow">NOTION SITUÉE</div><h2 id="a3r-notion-title">'+e(t.term)+'</h2><p>'+e(t.definition)+'</p>'+
      '<button class="a3r-link" type="button" onclick="Atlas3Reader.closeNotion()">Revenir à la lecture</button></div>';
    modal.hidden=false;modal.querySelector('.a3r-notion-close')?.focus();
  }

  function openNotion(chapterId,index){
    const g=guide.chapters[chapterId],t=g?.terms?.[index];
    const routes=guide.routes.filter(r=>r.stops.some(s=>s.path===chapterPath(chapterId))).slice(0,2);
    const modal=document.getElementById('a3r-notion-modal');
    if(!modal||!t)return;
    termSource=t.section_id;
    termFocus=document.activeElement;
    modal.innerHTML=`<div class="a3r-notion-dialog" role="dialog" aria-modal="true" aria-labelledby="a3r-notion-title"><button class="a3r-notion-close" type="button" onclick="Atlas3Reader.closeNotion()" aria-label="Fermer la notion">✕</button><div class="a3r-eyebrow">NOTION SITUÉE · ${e(g.title)}</div><h2 id="a3r-notion-title">${e(t.title)}</h2><p>${e(t.text)}</p><button class="a3r-link" type="button" onclick="Atlas3Reader.goToNotionSource()">Lire le passage dans le chapitre</button>${routes.length?`<div class="a3r-notion-related"><strong>Chemins pour prolonger :</strong>${routes.map(r=>btn(parcoursPath(r.id),r.title)).join("")}</div>`:""}</div>`;
    modal.hidden=false;modal.querySelector('.a3r-notion-close')?.focus();
  }
  function goToNotionSource(){
    const id=termSource;closeNotion();
    const d=document.getElementById(id);
    if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});d.querySelector('summary')?.focus();}
  }
  window.addEventListener('keydown',event=>{
    const modal=document.getElementById('a3r-notion-modal');
    if(!modal||modal.hidden)return;
    if(event.key==='Escape'){closeNotion();return;}
    if(event.key!=='Tab')return;
    const controls=[...modal.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.getClientRects().length>0);
    if(!controls.length)return;
    const first=controls[0],last=controls[controls.length-1];
    if(!modal.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();}
    else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  function jumpToSection(id){
    const x=document.getElementById(id);if(!x)return;
    x.open=true;x.scrollIntoView({behavior:'smooth',block:'start'});x.querySelector('summary')?.focus();
  }
  window.Atlas3Reader={
    closeNotion,openNotion,openEditorialTerm,goToNotionSource,jumpToSection,
    toggleSections(open){
      if(!document || !document.querySelectorAll)return;
      document.querySelectorAll('.a3r-sections .a3r-section').forEach(x => {x.open=!!open;});
    },
    render:renderAtlas3
  };
  PAGE_HANDLERS.atlas3=renderAtlas3;

  // Lecture complète : les fiches existantes restent utilisables hors connexion.
  if(typeof document!=='undefined'&&!window.ATLAS3_FONDATIONS){
    const fullScript=document.createElement('script');
    fullScript.src='./atlas3-fondations.js';fullScript.async=true;
    fullScript.onload=()=>{
      if(typeof current==='function'&&current().split('/')[0]==='atlas3'&&typeof render==='function')render();
    };
    fullScript.onerror=()=>console.warn('Atlas 3 : dossiers intégraux indisponibles ; fiches courtes conservées.');
    document.head.appendChild(fullScript);
  }

  // Charger la nouvelle édition indépendamment du grand index historique.
  // Le premier affichage reste possible si le fichier n'est pas disponible.
  if(!edition15() && typeof document!=='undefined' && document.head){
    const editionScript=document.createElement('script');
    editionScript.src='./atlas3-v15.js';
    editionScript.async=true;
    editionScript.onload=()=>{
      if(!edition15())return;
      data.status='Édition '+edition15().version+' — expériences, formes, approches et sources critiques';
      if(typeof current==='function' && String(current()).split('/')[0]==='atlas3' && typeof render==='function')render();
    };
    editionScript.onerror=()=>console.warn('Atlas 3 V1.6 : supplément indisponible, édition V1.4.1 maintenue.');
    document.head.appendChild(editionScript);
  }else if(edition15()){
    data.status='Édition '+edition15().version+' — expériences, formes, approches et sources critiques';
  }
  // atlas-hub.js a déjà fait son premier rendu : actualiser uniquement si Atlas 3 est affiché.
  if(typeof current==='function' && current().split('/')[0]==='atlas3' && typeof render==='function')render();
})();
