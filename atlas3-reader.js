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
    "title": "Varier un geste, puis revenir à l'action",
    "essai": "Choisissez un geste ordinaire sans enjeu de sécurité, par exemple déplacer un livre léger sur une table. Faites-le comme d'habitude. Essayez ensuite un petit changement : regarder l'objet avant ou après le début du mouvement, ou introduire une pause. Revenez à votre manière habituelle. Arrêtez si cela devient inconfortable. Dans un échange ordinaire, laissez ensuite l'attention revenir aux paroles de l'autre, sans surveiller votre corps.",
    "observer": "Avez-vous découvert une autre manière de faire ? Le geste habituel vous paraît-il différent ? Rien n'a besoin de changer. Dans la conversation, qu'est-ce que votre interlocuteur vous a réellement appris ?",
    "transposer": "Préparer et varier un geste n'est pas la même chose que l'accomplir lorsqu'une situation le demande. Cette exploration originale permet de distinguer les deux."
  },
  "chapitre-03": {
    "title": "Recevoir une impression, puis choisir d'en parler ou non",
    "essai": "Écoutez un court passage musical ou remarquez un détail de votre environnement, sans rechercher une expérience particulière. Reprenez votre activité. Si vous souhaitez y revenir, situez un instant précis et notez ce que vous aviez remarqué. Une seconde écoute est une nouvelle expérience, pas une preuve de la première.",
    "observer": "Qu'est-ce qui appartient à votre observation, à votre souvenir et à votre interprétation actuelle ? Une seule phrase peut suffire ; vous pouvez aussi ne rien écrire.",
    "transposer": "Pour un carnet de lecture, une répétition ou une conversation : une description située est différente d'un jugement général. Il ne s'agit pas d'un entretien d'explicitation professionnel."
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


  // V10.62 : pratique située dans les territoires IV et V.
  function practiceCompass(id){
    const x=edition15()?.chapters?.[id]?.practice;
    if(!x)return '';
    const rows=x.rows.map(([problem,resource,sectionId,formId])=>
      '<li><p><strong>'+e(problem)+'</strong><br>'+e(resource)+'</p><div class="a3r-mini-links"><button type="button" class="a3r-link" onclick="Atlas3Reader.jumpToSection(\''+e(sectionId)+'\')">Essayer cette piste</button>'+(formId?btn(formId.startsWith('approche/')?'atlas3/'+formId:'atlas3/forme/'+formId,'Approfondir'):'')+'</div></li>'
    ).join('');
    return '<section class="a3r-v15-field" aria-label="Atelier pratique"><div class="a3r-eyebrow">PASSER À LA PRATIQUE</div><h2>'+e(x.title)+'</h2><p><strong>'+e(x.scene)+'</strong> · '+e(x.duration)+' · seul par écrit ou à plusieurs</p>'+
      '<button type="button" class="a3r-link a3r-action" onclick="Atlas3Reader.jumpToSection(\''+e(x.section)+'\')">Ouvrir la scène</button><ol>'+x.steps.map(step=>'<li>'+e(step)+'</li>').join('')+'</ol>'+
      '<details class="a3r-v15-depth"><summary>Choisir une piste selon la difficulté rencontrée</summary><p>Une seule variation par essai ; aucune piste n’est obligatoire.</p><ul>'+rows+'</ul></details><p>'+e(x.retour)+'</p></section>';
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
    const termCard=t=>'<details class="a3r-v15-term"><summary>'+e(t.term)+'</summary><p>'+e(t.definition)+'</p></details>';
    const categories=[...new Set((x.terms||[]).map(t=>t.category).filter(Boolean))];
    const terms=categories.length?categories.map(category=>'<section><h4>'+e(category)+'</h4>'+(x.terms||[]).filter(t=>t.category===category).map(termCard).join('')+'</section>').join('')+(x.terms||[]).filter(t=>!t.category).map(termCard).join(''):(x.terms||[]).map(termCard).join('');
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
      '<section class="a3r-v15-related"><h2>Revenir à des situations, pas à des étiquettes</h2><div class="a3r-mini-links">'+passages+scenes+(['gendlin','winnicott','ansa','feldenkrais'].includes(id)?btn('atlas3/enquete/e01','Enquête E01 · Sentir, jouer, créer'):'')+'</div></section>'+
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

  // Atlas 3 · Jung : les cartes visuelles sont dérivées des deux dossiers Markdown.
  // Les libellés renvoient au lexique unique ; aucun contenu de définition dupliqué.
  const JUNG_VISUAL_CARDS=[{"n":1,"title":"Architecture de la psyché","nodes":{"P":"Psyché : champ total des processus","C":"Conscience","I":"Inconscient","M":"Moi : centre de la conscience","IP":"Inconscient personnel","IC":"Inconscient collectif : hypothèse jungienne","S":"Soi : totalité et principe d'organisation"},"edges":[{"a":"P","b":"C","kind":"line","dash":false,"label":""},{"a":"P","b":"I","kind":"line","dash":false,"label":""},{"a":"C","b":"M","kind":"line","dash":false,"label":""},{"a":"I","b":"IP","kind":"line","dash":false,"label":""},{"a":"I","b":"IC","kind":"line","dash":false,"label":""},{"a":"S","b":"M","kind":"arrow","dash":true,"label":"englobe, excède le moi"},{"a":"S","b":"P","kind":"arrow","dash":true,"label":"désigne la totalité"},{"a":"C","b":"I","kind":"both","dash":false,"label":""}],"levels":[["S"],["P"],["C","I"],["M","IP","IC"]],"note":"Le moi n'est pas le Soi ; le Soi n'est pas un compartiment supplémentaire de l'inconscient. La liaison conscience/inconscient représente leur rapport dynamique, non un accès complet et volontaire. Les deux distinctions de l'inconscient ne sont pas des frontières étanches.","source":"dossier 01, III et IX ; Aïon, chap. I–II [J2]. Notices : moi, conscience, inconscient personnel, inconscient collectif, Soi. La persona et l'ombre font l'objet d'une carte distincte plutôt que d'être assignées à un emplacement anatomique.","terms":["Psyché","Conscience","Moi","Inconscient personnel","Inconscient collectif","Soi"]},{"n":2,"title":"Individuation : deux identifications à distinguer","nodes":{"A":"Persona : adaptation sociale","B":"Moi conscient","C":"Figures et contenus intérieurs","D":"Différenciation","E":"Rapport plus conscient aux rôles et aux contenus","F":"Singularité dans la vie concrète et collective"},"edges":[{"a":"A","b":"B","kind":"arrow","dash":false,"label":"risque : se réduire à son rôle"},{"a":"C","b":"B","kind":"arrow","dash":false,"label":"risque : se prendre pour une figure"},{"a":"B","b":"D","kind":"arrow","dash":false,"label":""},{"a":"D","b":"E","kind":"arrow","dash":false,"label":""},{"a":"E","b":"F","kind":"arrow","dash":false,"label":""},{"a":"F","b":"D","kind":"arrow","dash":true,"label":"processus ouvert, non acquis définitif"}],"levels":[["A","C"],["B"],["D"],["E"],["F"]],"note":"Une persona est aussi une fonction utile. Reconnaître un contenu intérieur ne signifie ni lui obéir ni devoir le jouer. L'individuation ne se confond pas avec l'individualisme. Le schéma synthétise deux risques, non des étapes obligatoires ou une promesse de transformation.","source":"dossier 01, V–VI, VIII–XI ; CW 7 §§ 245–247, 266–267, 296–406 [J1/J1s], Aïon [J2]. Exemple Atlas : une régisseuse peut conserver sa compétence professionnelle sans être tenue de jouer le même rôle dans toutes ses relations.","terms":["Persona","Identification","Individuation","Différenciation","Personnalité mana"]},{"n":3,"title":"Types psychologiques : fonctions et attitudes","nodes":{"F":"Quatre fonctions","J":"Jugement : dites rationnelles","P":"Perception : dites irrationnelles","PE":"Pensée : articuler des concepts","SE":"Sentiment : apprécier une valeur","SA":"Sensation : percevoir le présent","IN":"Intuition : appréhender des possibilités","A":"Deux attitudes","IO":"Introversion : orientation vers le sujet","EX":"Extraversion : orientation vers l'objet","X":"Croisement : huit portraits théoriques"},"edges":[{"a":"F","b":"J","kind":"line","dash":false,"label":""},{"a":"F","b":"P","kind":"line","dash":false,"label":""},{"a":"J","b":"PE","kind":"line","dash":false,"label":""},{"a":"J","b":"SE","kind":"line","dash":false,"label":""},{"a":"P","b":"SA","kind":"line","dash":false,"label":""},{"a":"P","b":"IN","kind":"line","dash":false,"label":""},{"a":"A","b":"IO","kind":"line","dash":false,"label":""},{"a":"A","b":"EX","kind":"line","dash":false,"label":""},{"a":"F","b":"X","kind":"arrow","dash":false,"label":""},{"a":"A","b":"X","kind":"arrow","dash":false,"label":""}],"levels":[["F","A"],["J","P","IO","EX"],["PE","SE","SA","IN"],["X"]],"note":"Sentiment ne veut pas dire émotion intense ; irrationnel ne veut pas dire absurde. Introversion et extraversion ne sont pas des mesures de sociabilité. Les huit portraits ne constituent pas huit catégories exhaustives ; ce schéma n'est pas un test MBTI. La fonction auxiliaire et la fonction inférieure feront l'objet d'une carte secondaire, sans imposer une pile de fonctions moderne.","source":"dossier 02, XV–XVI ; Types psychologiques, chap. X et section 11 [J10–J11]. Atelier existant : une situation, quatre opérations. Correspondance : distinguer le sentiment jungien, le sentir d'Ansa et le felt sense de Gendlin.","terms":["Introversion","Extraversion","Pensée","Sentiment","Sensation","Intuition","Fonction inférieure","Fonction dominante","Fonction auxiliaire"]},{"n":4,"title":"Signe, symbole et travail de l'image","nodes":{"I":"Image, objet ou expression","S":"Signe : renvoi à un contenu déterminé","Y":"Symbole vivant : portée encore ouverte","C":"Contexte et associations singulières","A":"Amplification : rapprochements culturels","H":"Hypothèses interprétatives révisables","O":"L'image conserve une part d'indétermination"},"edges":[{"a":"I","b":"S","kind":"arrow","dash":false,"label":""},{"a":"I","b":"Y","kind":"arrow","dash":false,"label":""},{"a":"Y","b":"C","kind":"arrow","dash":false,"label":""},{"a":"Y","b":"A","kind":"arrow","dash":false,"label":""},{"a":"C","b":"H","kind":"arrow","dash":false,"label":""},{"a":"A","b":"H","kind":"arrow","dash":false,"label":""},{"a":"H","b":"O","kind":"arrow","dash":false,"label":""}],"levels":[["I"],["S","Y"],["C","A"],["H"],["O"]],"note":"Il ne s'agit pas de classer définitivement les objets en signes ou symboles : le rapport du sujet à l'expression importe. L'amplification n'est pas un dictionnaire universel des images et la similarité ne prouve pas une origine commune. Une interprétation n'est pas un fait sur autrui.","source":"dossier 02, XVII–XIX ; Types psychologiques, chap. XI, entrée Symbol [J12] ; CW 7 §§ 121–122 [J1/J9]. Exemple : une assiette supplémentaire peut être un indice déterminé dans un récit ou un motif dont les résonances restent ouvertes. Atlas 4 pourra développer les corpus iconographiques, sans dupliquer cette explication psychologique.","terms":["Symbole vivant","Signe","Amplification","Association"]},{"n":5,"title":"Imagination active et fonction transcendante : deux notions distinctes","nodes":{"I":"Matériau imaginaire","D":"Direction entièrement imposée","P":"Fascination passive","A":"Imagination active : participation consciente","R":"Dialogue / confrontation, maintien d'une position distincte","T":"Fonction transcendante : transformation possible d'une attitude","N":"Nouvelle possibilité de rapport à la situation","V":"Retour aux tâches et relations concrètes"},"edges":[{"a":"I","b":"D","kind":"line","dash":false,"label":""},{"a":"I","b":"P","kind":"line","dash":false,"label":""},{"a":"I","b":"A","kind":"line","dash":false,"label":""},{"a":"A","b":"R","kind":"arrow","dash":false,"label":""},{"a":"R","b":"T","kind":"arrow","dash":true,"label":"peut favoriser"},{"a":"T","b":"N","kind":"arrow","dash":true,"label":"issue non garantie"},{"a":"R","b":"V","kind":"arrow","dash":false,"label":""}],"levels":[["I"],["D","P","A"],["R"],["T","V"],["N"]],"note":"Les trois positions constituent une distinction pédagogique Atlas, pas une classification canonique de Jung. Ce dessin n'est pas un protocole à suivre seul. L'imagination active ne se confond ni avec l'écriture de fiction, ni avec la fonction transcendante. Une image n'établit pas un fait extérieur. La fonction transcendante n'implique pas une synthèse obligatoire.","source":"dossier 03, XXI–XXIX ; CW 7 §§ 341–373 et CW 8 §§ 168–189 [J14–J16]. Pratique Atlas déjà disponible : « laisser la fiction répondre », explicitement distincte de la démarche clinique. Correspondances : Chekhov, Winnicott, IFS — ne pas assimiler leurs méthodes.","terms":["Imagination active","Fonction transcendante","Différenciation","Réalité psychique","Opposés psychiques"]},{"n":6,"title":"Constellation d’un complexe","nodes":{"S":"Situation présente","H":"Résonance possible avec une organisation affective","C":"Constellation : affects, souvenirs, représentations","R":"Modification possible de l'attention et de la conduite","O":"Conditions actuelles et relation réelle"},"edges":[{"a":"S","b":"H","kind":"arrow","dash":false,"label":""},{"a":"H","b":"C","kind":"arrow","dash":false,"label":""},{"a":"C","b":"R","kind":"arrow","dash":false,"label":""},{"a":"S","b":"O","kind":"arrow","dash":false,"label":""},{"a":"O","b":"R","kind":"arrow","dash":false,"label":""}],"levels":[["S"],["H","O"],["C"],["R"]],"note":"Une constellation est une hypothèse sur l’organisation de l’expérience, non un diagnostic déduit d’un comportement. L'autonomie du complexe est relative.","source":"Dossier 01, IV ; CW 8 §§ 194–205 [J6].","terms":["Complexe","Constellation","Libido"]},{"n":7,"title":"Ombre et reconnaissance","nodes":{"I":"Image consciente de soi","E":"Aspects compatibles et reconnus","N":"Aspects écartés, méconnus ou refusés","H":"Ombre : notion jungienne","R":"Reconnaître une possibilité","D":"Discerner : représenter, refuser ou choisir une action"},"edges":[{"a":"I","b":"E","kind":"line","dash":false,"label":""},{"a":"I","b":"N","kind":"line","dash":true,"label":"tension"},{"a":"N","b":"H","kind":"arrow","dash":false,"label":""},{"a":"H","b":"R","kind":"arrow","dash":false,"label":""},{"a":"R","b":"D","kind":"arrow","dash":false,"label":""}],"levels":[["I"],["E","N"],["H"],["R"],["D"]],"note":"L’ombre n’est pas uniquement négative. Reconnaître une disposition ne commande pas de la réaliser. Une conduite théâtrale n’est pas la preuve d’une ombre personnelle.","source":"Dossier 01, VI ; Aïon, chapitre II [J2].","terms":["Ombre","Intégration","Persona"]},{"n":8,"title":"Projection : trois plans à ne pas confondre","nodes":{"A":"Comportement observable d'autrui","J":"Jugement ou interprétation","B":"Affects, attentes et représentations du sujet","V":"Confronter aux faits, au contexte et à la parole de l'autre","P":"Hypothèse de projection"},"edges":[{"a":"A","b":"J","kind":"arrow","dash":false,"label":""},{"a":"B","b":"J","kind":"arrow","dash":false,"label":""},{"a":"J","b":"V","kind":"arrow","dash":false,"label":""},{"a":"B","b":"P","kind":"arrow","dash":true,"label":"attribution subjective méconnue possible"},{"a":"V","b":"P","kind":"arrow","dash":true,"label":"ne suffit pas à la prouver"}],"levels":[["A","B"],["J"],["V"],["P"]],"note":"Un jugement peut être fondé. La projection n’est ni une explication universelle des désaccords ni une permission d’interpréter autrui contre sa parole.","source":"Dossier 01, VI et VIII ; Aïon [J2].","terms":["Projection","Ombre","Réalité psychique"]},{"n":9,"title":"Archétype et image archétypique","nodes":{"A":"Disposition formelle postulée par Jung","I":"Image concrète : rêve, mythe ou création","H":"Histoire personnelle et associations","C":"Transmission culturelle et contexte historique","F":"Forme, matériau et choix artistiques","L":"Lectures possibles, à confronter au contexte"},"edges":[{"a":"A","b":"I","kind":"arrow","dash":true,"label":"peut contribuer"},{"a":"H","b":"I","kind":"arrow","dash":false,"label":""},{"a":"C","b":"I","kind":"arrow","dash":false,"label":""},{"a":"F","b":"I","kind":"arrow","dash":false,"label":""},{"a":"I","b":"L","kind":"arrow","dash":false,"label":""}],"levels":[["A","H","C","F"],["I"],["L"]],"note":"L’archétype n’est pas une image héritée toute faite. Le dessin distingue les niveaux d’analyse et ne postule pas une causalité démontrée. Une similitude entre images ne prouve pas l’existence d’une disposition héréditaire.","source":"Dossier 01, VII ; dossier 04, XXXI–XXXII ; CW 9/I §§ 87–110, 148–155 [J3, J20].","terms":["Archétype","Image archétypique","Inconscient collectif"]},{"n":10,"title":"Le rêve et son contexte","nodes":{"D":"Image ou scène rêvée","A":"Associations singulières","E":"Situation et attitude de la vie éveillée","H":"Hypothèses sur le rapport entre rêve et conscience","C":"Compensation possible","O":"Autres lectures ou indétermination"},"edges":[{"a":"D","b":"A","kind":"arrow","dash":false,"label":""},{"a":"E","b":"H","kind":"arrow","dash":false,"label":""},{"a":"A","b":"H","kind":"arrow","dash":false,"label":""},{"a":"D","b":"H","kind":"arrow","dash":false,"label":""},{"a":"H","b":"C","kind":"arrow","dash":false,"label":""},{"a":"H","b":"O","kind":"arrow","dash":false,"label":""}],"levels":[["D","E"],["A"],["H"],["C","O"]],"note":"Le schéma illustre un mode d’enquête, pas un décodage. Deux rêves présentant le même motif peuvent recevoir des lectures différentes. Le rêve n’est pas une preuve sur le monde extérieur.","source":"Dossier 02, XVIII–XIX ; CW 8 §§ 539–546 [J13].","terms":["Rêve","Association","Amplification"]},{"n":11,"title":"Compensation : plusieurs rapports possibles","nodes":{"A":"Attitude consciente","R":"Rapport possible au matériau onirique","D":"Rêve et associations","O":"Opposition ou contrepoint","V":"Variation ou complément","S":"Confirmation ou renforcement"},"edges":[{"a":"A","b":"R","kind":"arrow","dash":false,"label":""},{"a":"D","b":"R","kind":"arrow","dash":false,"label":""},{"a":"R","b":"O","kind":"arrow","dash":false,"label":""},{"a":"R","b":"V","kind":"arrow","dash":false,"label":""},{"a":"R","b":"S","kind":"arrow","dash":false,"label":""}],"levels":[["A","D"],["R"],["O","V","S"]],"note":"La compensation ne signifie pas systématiquement l’inverse de la vie consciente. Les branches sont une reformulation pédagogique de rapports possibles, non une grille exhaustive ni une loi du rêve.","source":"Dossier 02, XVIII ; On the Nature of Dreams, CW 8 §§ 539–546 [J13].","terms":["Compensation","Rêve"]},{"n":12,"title":"Mandala et quaternité : totalité et composition","nodes":{"M":"Configuration centrée, parfois quadripartite","J":"Lecture jungienne : représentation possible du Soi","T":"Sens religieux ou artistique propre à sa tradition","C":"Composition : centre, périphérie, relations et symétrie","P":"Atelier Atlas 3 : varier les places autour d'un objet"},"edges":[{"a":"M","b":"J","kind":"arrow","dash":false,"label":""},{"a":"M","b":"T","kind":"arrow","dash":false,"label":""},{"a":"M","b":"C","kind":"arrow","dash":false,"label":""},{"a":"C","b":"P","kind":"arrow","dash":false,"label":""}],"levels":[["M"],["J","T","C"],["P"]],"note":"Ces lectures ne sont pas équivalentes. Le mandala rituel conserve son contexte propre. Une figure circulaire ne prouve pas une individuation. Les corpus iconographiques seront étudiés dans Atlas 4.","source":"Dossier 04, XXXIV–XXXV ; Aïon § 117 [J22] ; Concerning Mandala Symbolism [J23, repérage secondaire].","terms":["Mandala","Quaternité","Soi"]},{"n":13,"title":"Alchimie : distinguer l’histoire et la lecture psychologique","nodes":{"H":"Textes, images et opérations alchimiques historiques","M":"Histoire matérielle, savante et religieuse","J":"Interprétation psychologique proposée par Jung","S":"Projections, transformation, opposés, totalité","F":"Transposition artistique Atlas 3 : transformer un matériau","A":"Corpus symbolique : Atlas 4"},"edges":[{"a":"H","b":"M","kind":"arrow","dash":false,"label":""},{"a":"H","b":"J","kind":"arrow","dash":false,"label":""},{"a":"J","b":"S","kind":"arrow","dash":false,"label":""},{"a":"H","b":"F","kind":"arrow","dash":false,"label":""},{"a":"M","b":"A","kind":"arrow","dash":false,"label":""}],"levels":[["H"],["M","J","F"],["A","S"]],"note":"Les termes nigredo, albedo, rubedo et parfois citrinitas ne forment pas une progression obligatoire de la psyché. Ce dessin situe les lectures, sans faire de l’alchimie historique une psychologie déguisée.","source":"Dossier 04, XXXVI ; CW 12 [J24, passages introductifs] ; CW 14 [J25, repérage].","terms":["Alchimie psychologique","Conjonction des opposés (coniunctio)","Prima materia","Opus alchimique"]},{"n":14,"title":"Synchronicité : événement, sens et hypothèse","nodes":{"E":"Deux événements rapportés","S":"Relation signifiante éprouvée par une personne","H":"Hypothèse jungienne d'une connexion acausale","X":"Autres explications à examiner : hasard, causalité, contexte","V":"Expérience subjective de sens"},"edges":[{"a":"E","b":"S","kind":"arrow","dash":false,"label":""},{"a":"S","b":"H","kind":"arrow","dash":true,"label":"ne démontre pas"},{"a":"E","b":"X","kind":"arrow","dash":false,"label":""},{"a":"S","b":"V","kind":"arrow","dash":false,"label":""}],"levels":[["E"],["S","X"],["H","V"]],"note":"Il ne s’agit pas d’une chaîne de preuves. La signification vécue ne prouve ni une connexion acausale ni une destinée. La mécanique quantique ne valide pas cette hypothèse.","source":"Dossier 04, XXXVII ; CW 8 §§ 827–828, 849 [J26].","terms":["Synchronicité","Réalité psychique"]}];
  function jungWrapWords(value,limit){
    const lines=[];let line='';
    for(const word of value.split(/\s+/)){
      if(line && (line+' '+word).length>limit){lines.push(line);line=word;}
      else line+=(line?' ':'')+word;
    }
    if(line)lines.push(line);return lines;
  }
  function jungVisualSvg(card){
    const maxCols=Math.max(...card.levels.map(l=>l.length)),nw=172,gap=34,pad=28,nh=100,vg=76;
    const width=maxCols*nw+(maxCols-1)*gap+2*pad, height=card.levels.length*nh+(card.levels.length-1)*vg+2*pad;
    const pos={};
    card.levels.forEach((row,r)=>row.forEach((id,i)=>{pos[id]={x:(width-(row.length*nw+(row.length-1)*gap))/2+i*(nw+gap),y:pad+r*(nh+vg),r};}));
    const arrow='a3jung-arrow-'+card.n;
    const edges=card.edges.map((edge,i)=>{
      const a=pos[edge.a],b=pos[edge.b];let x1,y1,x2,y2,path;
      if(b.r>a.r){x1=a.x+nw/2;y1=a.y+nh;x2=b.x+nw/2;y2=b.y;const mid=(y1+y2)/2;path='M'+x1+' '+y1+' C'+x1+' '+mid+' '+x2+' '+mid+' '+x2+' '+y2;}
      else if(b.r===a.r){const right=b.x>a.x;x1=a.x+(right?nw:0);x2=b.x+(right?0:nw);y1=a.y+nh/2;y2=b.y+nh/2;path='M'+x1+' '+y1+' L'+x2+' '+y2;}
      else{const lane=12+(i%3)*5;x1=a.x;y1=a.y+nh/2;x2=b.x;y2=b.y+nh/2;path='M'+x1+' '+y1+' H'+lane+' V'+y2+' H'+x2;}
      const dash=edge.dash?' stroke-dasharray="6 5"':'';
      return '<path d="'+path+'" fill="none" stroke="currentColor" stroke-opacity=".65" stroke-width="1.6"'+dash+(edge.kind!=='line'?' marker-end="url(#'+arrow+')"':'')+(edge.kind==='both'?' marker-start="url(#'+arrow+')"':'')+'/>';
    }).join('');
    const boxes=Object.entries(card.nodes).map(([id,label])=>{
      const p=pos[id],lines=jungWrapWords(label,23);
      return '<g><rect x="'+p.x+'" y="'+p.y+'" width="'+nw+'" height="'+nh+'" rx="9" fill="var(--a3jung-node,#252e38)" stroke="var(--a3jung-border,#8293a6)" stroke-width="1.2"/><text x="'+(p.x+nw/2)+'" y="'+(p.y+nh/2-(lines.length-1)*8+4)+'" text-anchor="middle" font-size="12.5" font-weight="500" fill="var(--a3jung-text,#f3f5f7)">'+lines.map((l,i)=>'<tspan x="'+(p.x+nw/2)+'" dy="'+(i?16:0)+'">'+e(l)+'</tspan>').join('')+'</text></g>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+e(card.title)+' : voir la lecture des liens sous le schéma" viewBox="0 0 '+width+' '+height+'" style="display:block;width:100%;min-width:'+Math.max(300,width*.88)+'px;height:auto;color:var(--a3jung-arrow,#aab8c8)"><defs><marker id="'+arrow+'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill="currentColor"/></marker></defs>'+edges+boxes+'</svg>';
  }
  function jungVisualCards(d){
    const entries=(d.terms||[]);
    if(!entries.length)return '';
    const groups=[['Architecture et différenciation',1,2,3,6,7,8],['Images, rêves et création',4,5,9,10,11],['Totalité et pensée tardive',12,13,14]];
    const byId=new Map(JUNG_VISUAL_CARDS.map(c=>[c.n,c]));
    function cardHtml(card){
      const buttons=card.terms.map(term=>{
        const index=entries.findIndex(t=>t.term===term);
        return index<0?'':'<button type="button" class="a3r-link" onclick="Atlas3Reader.openEditorialTerm(\'jung\','+index+')">'+e(term)+'</button>';
      }).join('');
      const links=card.edges.map(edge=>'<li><strong>'+e(card.nodes[edge.a])+'</strong> '+(edge.kind==='both'?'↔':edge.kind==='arrow'?'→':'—')+' '+e(card.nodes[edge.b])+(edge.label?' : '+e(edge.label):'')+'</li>').join('');
      return '<details class="a3r-v15-depth" style="margin:.65rem 0"><summary>'+String(card.n).padStart(2,'0')+' · '+e(card.title)+'</summary><div style="--a3jung-node:#253342;--a3jung-border:#91a5ba;--a3jung-text:#f5f7fa;--a3jung-arrow:#9eafc2;background:#17232f;border-radius:12px;padding:.5rem;max-width:100%;overflow-x:auto;overscroll-behavior-x:contain" role="region" tabindex="0" aria-label="Schéma défilable horizontalement">'+jungVisualSvg(card)+'</div><p><strong>À retenir :</strong> '+e(card.note)+'</p><details><summary>Lecture détaillée des liens</summary><ul>'+links+'</ul><p>Trait discontinu : relation théorique, hypothèse ou réserve selon le libellé.</p></details><h4>Notions à explorer</h4><div class="a3r-mini-links">'+buttons+'</div><p class="a3r-quiet">'+e(card.source)+'</p></details>';
    }
    return '<section class="a3r-editorial-terms" aria-label="Cartes conceptuelles de Jung"><h2>Comprendre Jung en images · 14 schémas</h2><p>Des cartes de lecture complémentaires au dossier intégral. Ouvre un schéma puis explore les notions associées. Sur un écran étroit, fais défiler le dessin horizontalement si nécessaire.</p>'+groups.map(g=>'<section><h3>'+e(g[0])+'</h3>'+g.slice(1).map(n=>cardHtml(byId.get(n))).join('')+'</section>').join('')+'</section>';
  }

  // Dossiers longs et notions cliquables : greffe documentaire sans nouveau menu.
  function editorialExpansion(id){
    const d=window.ATLAS3_FONDATIONS?.docs?.[id];if(!d)return '';
    const entries=(d.terms||[]).map((t,i)=>({t,i}));
    const termButton=({t,i})=>'<button type="button" class="a3r-link" onclick="Atlas3Reader.openEditorialTerm(\''+id+'\','+i+')">'+e(t.term)+'</button>';
    const categories=[...new Set(entries.map(({t})=>t.category).filter(Boolean))];
    const terms=categories.length?categories.map(category=>'<section><h3>'+e(category)+'</h3><div class="a3r-mini-links">'+entries.filter(({t})=>t.category===category).map(termButton).join('')+'</div></section>').join('')+(entries.some(({t})=>!t.category)?'<div class="a3r-mini-links">'+entries.filter(({t})=>!t.category).map(termButton).join('')+'</div>':''):entries.map(termButton).join('');
    return '<section class="a3r-editorial-full" aria-label="Dossier complet"><details class="a3r-section a3r-editorial-details"><summary>'+(d.edition.startsWith('Dossier de lecture')||id==='ansa'?'Lire le dossier de lecture approfondi':'Lire le dossier fondateur')+'</summary>'+
      '<div class="a3r-prose a3r-editorial-prose">'+editorialNotions(d.html,id)+'</div></details>'+
      (id==='jung'?jungVisualCards(d):'')+
      '<div class="a3r-editorial-terms"><h2>Notions à explorer'+(categories.length?' · '+entries.length+' concepts':'')+'</h2>'+(categories.length?terms:'<div class="a3r-mini-links">'+terms+'</div>')+'</div>'+
      '<p class="a3r-quiet">'+e(d.edition)+' · '+e(d.source)+'</p>'+
      '<div id="a3r-notion-modal" class="a3r-modal" hidden onclick="if(event.target===this)Atlas3Reader.closeNotion()"></div></section>';
  }
  function editorialSegments(raw,terms,counts){
    const lower=raw.toLocaleLowerCase('fr'),out=[];let cursor=0;
    const wordChar=c=>!!c&&/[\p{L}\p{N}]/u.test(c);
    while(cursor<raw.length){
      let best=null;
      for(const t of terms){
        if((counts[t.i]||0)>=2||!t.word)continue;
        let at=lower.indexOf(t.word,cursor);
        while(at>=0&&(wordChar(raw[at-1])||wordChar(raw[at+t.word.length])))at=lower.indexOf(t.word,at+1);
        if(at>=0&&(!best||at<best.at||(at===best.at&&t.word.length>best.t.word.length)))best={t,at};
      }
      if(!best){out.push({text:raw.slice(cursor)});break;}
      if(best.at>cursor)out.push({text:raw.slice(cursor,best.at)});
      const stop=best.at+best.t.word.length;
      out.push({text:raw.slice(best.at,stop),i:best.t.i});
      counts[best.t.i]=(counts[best.t.i]||0)+1;cursor=stop;
    }
    return out;
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
      const parts=editorialSegments(node.nodeValue,terms,counts);
      if(!parts.some(p=>p.i!==undefined))continue;
      const f=doc.createDocumentFragment();
      for(const p of parts){
        if(p.i===undefined){f.appendChild(doc.createTextNode(p.text));continue;}
        const btn=doc.createElement('button');btn.type='button';btn.className='a3r-inline-notion';
        btn.textContent=p.text;
        btn.setAttribute('onclick',"Atlas3Reader.openEditorialTerm('"+id+"',"+p.i+")");
        btn.setAttribute('aria-label','Comprendre : '+d.terms[p.i].term);
        f.appendChild(btn);
      }
      node.replaceWith(f);
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
    const counts=sharedCounts||Array(g.terms.length).fill(0),textNodes=[];
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
    const notionCounts=Array(g?.terms?.length||0).fill(0);
    const sections=c.sections.map((s,i)=>`<details class="a3r-section" id="${e(s.id)}"${i===0?' open':''}><summary><span class="a3r-section-count">${String(i+1).padStart(2,'0')}</span><span>${e(s.title)}</span></summary><div class="a3r-prose">${linkSituatedNotions(s.html,id,notionCounts)}</div></details>`).join('');
    const terms=g?.terms?.map((t,i)=>`<button type="button" class="a3r-term-chip" onclick="Atlas3Reader.openNotion('${e(c.id)}',${i})">${e(t.title)}</button>`).join('')||'';
    const readingCompass=g?`<aside class="a3r-compass" aria-label="Boussole du chapitre"><div class="a3r-eyebrow">REPÈRES DE LECTURE · SITUATION VÉCUE</div><p class="a3r-compass-scene">${e(g.scene)}</p><h2>${e(g.question)}</h2><p><strong>Attention :</strong> ${e(g.limit)}</p><details class="a3r-term-collection"><summary>Notions à approfondir dans ce chapitre</summary><div class="a3r-term-list">${terms}</div></details></aside>`:'';
    const courses=guide.routes.filter(r=>r.stops.some(s=>s.path===chapterPath(id))).map(r=>btn(parcoursPath(r.id),r.title)).join('');
    const criticalBlock=k?`<aside class="a3r-critical"><div class="a3r-eyebrow">ÉPROUVER LA QUESTION</div><h2>${e(k.title)}</h2><p class="a3r-critical-intro">Une seconde situation permet de distinguer ce que l’on observe, ce que l’on interprète et les conséquences que l’on en tire.</p>${k.paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}<p class="a3r-critical-limit"><strong>À distinguer :</strong> ${e(k.limit)}</p><button type="button" class="a3r-link" onclick="Atlas3Reader.jumpToSection('${e(k.source)}')">Revenir au passage source</button></aside>`:'';
    const relatedCourses=courses?`<aside class="a3r-course-rel"><div class="a3r-eyebrow">CHEMINS DE LECTURE · FACULTATIFS</div><p>Cette question traverse également un parcours de situations. Vous pouvez y entrer ou poursuivre ce chapitre seul.</p><div class="a3r-mini-links">${courses}</div></aside>`:'';
    const doors=(c.salon_portes||[]).map(d=>doorMap[d]?btn(doorPath(d),doorMap[d].title):'').join('');
    const evidenceHtml=evidence?`<div class="a3r-evidence"><h3>Vérification documentaire ciblée · ${e(evidence.degree)}</h3><p><b>Énoncé :</b> ${e(evidence.claim)}</p><p>${e(evidence.evidence)}</p><p><b>Réserve :</b> ${e(evidence.limit)}</p>${evidence.url?`<p><a href="${e(evidence.url)}" target="_blank" rel="noopener noreferrer">Consulter la source contrôlée</a></p>`:''}<small>Ce contrôle ne certifie pas l'ensemble du chapitre ni des pratiques décrites.</small></div>`:'';
    const bridge=data.passerelles.filter(p=>p.chapter_id===c.id).map(p=>`<aside class="a3r-bridge-card"><div class="a3r-eyebrow">CHEMIN TRANSVERSAL · FACULTATIF</div><h2>${e(p.title)}</h2><p>Un détour vers un autre Atlas pour transformer une question de ce chapitre sans en remplacer la lecture.</p>${btn('atlas3/passerelle/'+p.id,'Emprunter la passerelle','a3r-action')}</aside>`).join('');
    const footerLinks=[prev?btn(chapterPath(prev.id),'Chapitre '+String(prev.number).padStart(2,'0')+' · '+prev.title):'',next?btn(chapterPath(next.id),'Chapitre '+String(next.number).padStart(2,'0')+' · '+next.title):''].filter(Boolean).join('');
    const body=`<div class="a3r-wrap">${crumb('Chapitre '+String(c.number).padStart(2,'0'))}<header class="a3r-hero"><div class="a3r-eyebrow">PARTIE ${e(c.part_id)} · ${e(part?.title || '')} · CHAPITRE ${String(c.number).padStart(2,'0')}</div><h1>${e(c.title)}</h1><div class="a3r-prose a3r-intro">${c.introduction_html}</div></header>${note}${practiceCompass(id)}${readingCompass}${chapterSupplement(id)}${bridge}<div class="a3r-reader-controls"><span>${c.sections.length} sections · lecture libre</span><button type="button" onclick="window.Atlas3Reader.toggleSections(true)">Tout ouvrir</button><button type="button" onclick="window.Atlas3Reader.toggleSections(false)">Tout refermer</button></div><div class="a3r-sections">${sections}</div>${c.pour_poursuivre_html?section('Poursuivre la lecture',`<div class="a3r-prose">${c.pour_poursuivre_html}</div>`):''}${doors?section('Explorer les scènes associées',`<div class="a3r-mini-links">${doors}</div>`):''}${criticalBlock}${relatedCourses}<details class="a3r-sources"><summary>Sources, lectures et limites</summary><div class="a3r-prose">${evidenceHtml}${verifiedAtlas3Sources(c.sources_html)}</div></details><div class="a3r-prevnext">${footerLinks}</div>${btn('atlas3','Revenir aux quinze chapitres')}<div id="a3r-notion-modal" class="a3r-modal" hidden onclick="if(event.target===this)Atlas3Reader.closeNotion()"></div></div>`;
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
      (t.source?'<p class="a3r-quiet">'+e(t.source)+'</p>':'')+'<button class="a3r-link" type="button" onclick="Atlas3Reader.closeNotion()">Revenir à la lecture</button></div>';
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
