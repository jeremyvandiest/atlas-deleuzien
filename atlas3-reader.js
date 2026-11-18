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
  const crumb = (extra='') => `<nav class="a3r-crumb" aria-label="Navigation Atlas 3">${btn('atlas3','Atlas 3 — Sommaire')}${btn('atlas3/salon','Salon des possibles')}${extra ? `<span>${e(extra)}</span>` : ''}</nav>`;
  const note = `<p class="a3r-publication">${e(data.status)}. Les sources et leurs limites sont disponibles dans chaque chapitre.</p>`;
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
  function chapterSupplement(id){
    const ed=edition15(),x=ed&&ed.chapters&&ed.chapters[id];if(!x)return '';
    const paragraphs=[
      ['La question',x.question],
      ['Une situation concrète',x.situation],
      ['Faire varier une seule condition',x.variation],
      ['Ce que la forme rend sensible',x.forme],
      ['Contre-épreuve : ce qu’il ne faut pas conclure',x.contrepreuve],
      ['Revenir à la situation',x.retour]
    ];
    const blocks=paragraphs.map((p,i)=>
      '<div class="a3r-v15-step"><h3>'+e(p[0])+'</h3><p>'+e(p[1])+'</p></div>'
    ).join('');
    const sourceLinks=(x.sources||[]).map(id=>ed.bibliography.find(b=>b.id===id)).filter(Boolean).map(s=>
      '<li><a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.title)+'</a><p>'+e(s.detail)+'</p><small>'+e(s.status)+'</small></li>'
    ).join('');
    return '<section class="a3r-v15-field" aria-label="Enquête située du chapitre"><div class="a3r-eyebrow">ÉDITION V1.5 · LE SENTIR À L’ÉPREUVE DES FORMES</div>'+
      '<h2>'+e(x.title)+'</h2><p class="a3r-v15-lead">Une enquête à lire, ou à explorer librement. Aucune émotion n’est demandée ; la situation précède l’interprétation.</p>'+
      '<div class="a3r-v15-steps">'+blocks+'</div>'+
      '<details class="a3r-v15-sources"><summary>Repères et limites documentaires</summary><ul>'+sourceLinks+'</ul><p>Ces rapprochements sont éditoriaux. Ils ne constituent pas une validation expérimentale ni une attribution d’exercices originaux aux auteurs.</p></details>'+formsForChapter(id)+'</section>';
  }
  function doorSupplement(id){
    const ed=edition15(),x=ed&&ed.scenes&&ed.scenes[id];if(!x)return '';
    const acts=x.partitions.map((p,i)=>
      '<details class="a3r-v15-partition"'+(i===0?' open':'')+'><summary><span class="a3r-section-count">'+String(i+1).padStart(2,'0')+'</span>'+e(p.title)+'</summary>'+
      '<p>'+e(p.instruction)+'</p><p class="a3r-v15-watch"><strong>À regarder :</strong> '+e(p.regarder)+'</p></details>'
    ).join('');
    return '<section class="a3r-v15-field a3r-v15-salon" aria-label="Partitions facultatives"><div class="a3r-eyebrow">ÉDITION V1.5 · TROIS PARTITIONS</div>'+
      '<h2>Agir, réagir, composer</h2><p class="a3r-v15-lead">'+e(x.question)+'</p>'+acts+
      '<p class="a3r-v15-guard"><strong>Limite :</strong> '+e(x.guard)+'</p><p class="a3r-v15-lead">Chaque partition est une création d’Atlas 3, non la reproduction d’un exercice canonique. On peut simplement lire la pièce.</p></section>';
  }
  function enquiriesIndex(){
    const ed=edition15();if(!ed)return '';
    const links=ed.enquiries.map(x=>'<li>'+btn('atlas3/enquete/'+x.id,x.title)+'</li>').join('');
    return '<section class="a3r-v15-enquiries"><div class="a3r-eyebrow">POUR PROLONGER · PARCOURS LIBRES V1.5</div>'+
      '<h2>Trois enquêtes sur les formes</h2><p>'+e(ed.principle)+'</p><ul>'+links+'</ul>'+
      '<details><summary>Ce que cette édition n’affirme pas</summary><p>'+ed.limits.map(e).join('</p><p>')+'</p></details></section>';
  }

  function formsIndex(){
    const ed=edition15();if(!ed||!Array.isArray(ed.forms))return '';
    const cards=ed.forms.map(x=>'<div class="a3r-v15-form-card"><strong>'+e(x.title)+'</strong><p>'+e(x.problem)+'</p>'+
      btn('atlas3/forme/'+x.id,'Lire ce dossier')+'</div>').join('');
    return '<details class="a3r-v15-library"><summary>Bibliothèque des formes · '+ed.forms.length+' dossiers de lecture</summary>'+
      '<p>Une tradition n’est pas un mode d’emploi universel. Chaque dossier distingue son problème, ce qu’elle fait travailler et ses limites.</p>'+
      '<div class="a3r-v15-form-grid">'+cards+'</div></details>';
  }
  function formsForChapter(id){
    const ed=edition15();if(!ed||!ed.forms)return '';
    const forms=ed.forms.filter(x=>x.related.includes(id));if(!forms.length)return '';
    return '<nav class="a3r-v15-form-links" aria-label="Formes associées à cette question"><strong>Formes pour approfondir</strong><div>'+
      forms.map(x=>btn('atlas3/forme/'+x.id,x.title)).join('')+'</div></nav>';
  }
  function formPage(id){
    const ed=edition15(),x=ed&&ed.forms&&ed.forms.find(z=>z.id===id);
    if(!x)return missing();
    const ref=ed.bibliography.find(b=>b.id===x.source);
    const panels=[['Le problème de départ',x.problem],['Ce que cette approche fait travailler',x.operation],
      ['Situation originale pour éprouver la différence',x.scene],['Le contrepoint avec les autres formes',x.contrast],
      ['Ce qu’il serait abusif de conclure',x.limit]]
      .map(t=>'<section class="a3r-v15-step"><h3>'+e(t[0])+'</h3><p>'+e(t[1])+'</p></section>').join('');
    const related=x.related.map(id=>ed.chapters[id]?
      btn('atlas3/'+id,'Chapitre '+id.slice(-2)+' · '+ed.chapters[id].title):'').join('');
    const scenes=x.salon.map(id=>data.salon.doors.find(z=>z.id===id)?btn('atlas3/salon/'+id,data.salon.doors.find(z=>z.id===id).title):'').join('');
    const source=ref?'<details class="a3r-v15-sources"><summary>Repère bibliographique et statut</summary><a href="'+e(ref.url)+'" target="_blank" rel="noopener noreferrer">'+e(ref.title)+'</a>'+
      '<p>'+e(ref.detail)+'</p><p>'+e(ref.status)+'</p></details>':'';
    const body='<div class="a3r-wrap">'+crumb('Forme théâtrale')+
      '<header class="a3r-hero"><div class="a3r-eyebrow">BIBLIOTHÈQUE DES FORMES · V1.5</div><h1>'+e(x.title)+'</h1><p>'+e(x.work)+'</p></header>'+
      '<article class="a3r-v15-field">'+panels+source+'</article>'+
      '<section class="a3r-v15-related"><h2>Revenir à l’expérience</h2><p>La pratique et l’œuvre restent distinctes de ce dossier de lecture.</p><div class="a3r-mini-links">'+related+scenes+'</div></section>'+
      btn('atlas3','Revenir au Théâtre du sentir')+'</div>';
    return shell(body,{title:'Atlas 3 · '+x.title,sub:'Bibliothèque des formes'});
  }

  function enquiry(id){
    const ed=edition15(),route=ed&&ed.enquiries.find(x=>x.id===id);if(!route)return missing();
    const rows=route.steps.map((step,i)=>
      '<li class="a3r-course-step"><div class="a3r-course-step-index">'+String(i+1).padStart(2,'0')+'</div><div><h3>'+e(step[1])+'</h3><p>'+e(step[2])+'</p>'+btn(step[0],'Ouvrir cette étape','a3r-action')+'</div></li>'
    ).join('');
    const body='<div class="a3r-wrap">'+crumb('Enquête sur les formes')+'<header class="a3r-hero"><div class="a3r-eyebrow">ENQUÊTE TRANSVERSALE · ÉDITION V1.5</div>'+
      '<h1>'+e(route.title)+'</h1><p>'+e(route.question)+'</p></header><p class="a3r-v15-lead">'+e(route.intro)+'</p>'+
      '<ol class="a3r-course-steps">'+rows+'</ol><p class="a3r-v15-guard"><strong>À ne pas confondre :</strong> '+e(route.limit)+'</p>'+
      btn('atlas3','Revenir à Atlas 3')+'</div>';
    return shell(body,{title:'Atlas 3 · '+route.title,sub:'Enquête sur les formes'});
  }

  function index(){
    const doors=data.salon.doors.map(d=>{
      const first=(d.html.match(/^<p><em>([\s\S]*?)<\/em><\/p>/)||[])[1]||'Une proposition sensible, libre et facultative.';
      const desc=first.replace(/<[^>]*>/g,'');
      return `<li><button type="button" class="a3r-practice-door" onclick="go('${doorPath(d.id)}')"><span class="a3r-practice-door-num">${String(d.number).padStart(2,'0')}</span><span class="a3r-practice-door-copy"><strong>${e(d.title)}</strong><span>${e(desc)}</span></span></button></li>`;
    }).join('');
    const parts=data.parts.map(part=>{
      const links=part.chapters.map(id=>{
        const c=chapterMap[id];
        return `<li>${btn(chapterPath(id),String(c.number).padStart(2,'0')+' · '+c.title,'a3r-chapter-link')}</li>`;
      }).join('');
      return `<section class="a3r-part"><div class="a3r-eyebrow">Partie ${e(part.id)}</div><h3>${e(part.title)}</h3><p>${e(part.introduction)}</p><ul>${links}</ul></section>`;
    }).join('');
    const courseCards=guide.routes.map((r,i)=>`<button type="button" class="a3r-course-card" onclick="go('${parcoursPath(r.id)}')"><span class="a3r-eyebrow">PARCOURS ${String(i+1).padStart(2,'0')} · FACULTATIF</span><strong>${e(r.title)}</strong><span>${e(r.question)}</span><small>${r.stops.length} étapes · situations et chapitres</small></button>`).join('');
    const body=`<div class="a3r-wrap">${crumb()}<header class="a3r-hero"><div class="a3r-eyebrow">ATLAS 3 · LE THÉÂTRE DU SENTIR</div><h1>Le Théâtre du sentir</h1><p>Explorer ce que nos sensations, habitudes, souvenirs, gestes et rencontres font à notre manière d'habiter une situation. Les scènes précèdent les explications ; aucune transformation n'est obligatoire.</p></header>${note}<details class="a3r-atlas-aim"><summary>Quel est l'objet propre de cet Atlas ?</summary><p>${e(guide.thesis)}</p><p>${e(guide.difference)}</p><p class="a3r-aim-limit">${e(guide.limitations)}</p></details>
      <section class="a3r-practice-first" aria-labelledby="a3r-practice-heading"><div class="a3r-eyebrow">01 · COMMENCER PAR L’EXPÉRIENCE</div><h2 id="a3r-practice-heading">Le Salon des possibles</h2><p class="a3r-entry-intro">Sept micro-scènes à découvrir ; leur lecture suffit et le jeu demeure facultatif.</p><ol class="a3r-practice-list">${doors}</ol>${btn('atlas3/salon','Découvrir le Salon des possibles')}</section>
      <section class="a3r-courses" aria-labelledby="a3r-courses-heading"><div class="a3r-eyebrow">02 · SUIVRE UNE QUESTION</div><h2 id="a3r-courses-heading">Quatre parcours d'expérience</h2><p class="a3r-entry-intro">Chaque parcours part d'une situation ou d'une scène, puis change la question. Ils ne sont pas des programmes à réussir et aucun n'est nécessaire pour lire un chapitre.</p><div class="a3r-course-grid">${courseCards}</div></section>${enquiriesIndex()}${formsIndex()}
      <section class="a3r-theory-after" aria-labelledby="a3r-theory-heading"><div class="a3r-eyebrow">03 · POUR APPROFONDIR</div><h2 id="a3r-theory-heading">Les quinze chapitres</h2><p class="a3r-entry-intro">Une lecture peut prolonger une expérience, la contredire ou simplement ouvrir un autre problème. Les chapitres restent accessibles indépendamment du Salon.</p><div class="a3r-part-grid">${parts}</div></section>
      <section class="a3r-transversal-after"><div class="a3r-eyebrow">04 · CHEMINS TRANSVERSAUX</div><h2>Circuler entre les Atlas</h2><p class="a3r-entry-intro">Deux détours facultatifs permettent de revenir à une question autrement. Ils ne remplacent ni les œuvres ni les chapitres.</p><div class="a3r-mini-links">${data.passerelles.map(p=>btn('atlas3/passerelle/'+p.id,p.title)).join('')}</div></section>
    </div>`;
    return shell(body,{title:'Atlas 3 · Théâtre du sentir',sub:'Le Salon · Les chapitres · Les chemins'});
  }
  function chapter(id){
    const c=chapterMap[id];if(!c)return missing();
    const evidence=sourceAudit.chapters[id];
    const part=data.parts.find(p=>p.id===c.part_id);
    const g=guide.chapters[id];
    const k=critical.chapters[id];
    const pos=data.chapters.findIndex(x=>x.id===id);
    const prev=data.chapters[pos-1], next=data.chapters[pos+1];
    const sections=c.sections.map((s,i)=>`<details class="a3r-section" id="${e(s.id)}"${i===0?' open':''}><summary><span class="a3r-section-count">${String(i+1).padStart(2,'0')}</span><span>${e(s.title)}</span></summary><div class="a3r-prose">${s.html}</div></details>`).join('');
    const terms=g?.terms?.map((t,i)=>`<button type="button" class="a3r-term-chip" onclick="Atlas3Reader.openNotion('${e(c.id)}',${i})">${e(t.title)}</button>`).join('')||'';
    const readingCompass=g?`<aside class="a3r-compass" aria-label="Boussole du chapitre"><div class="a3r-eyebrow">REPÈRES DE LECTURE · SITUATION VÉCUE</div><p class="a3r-compass-scene">${e(g.scene)}</p><h2>${e(g.question)}</h2><p><strong>Attention :</strong> ${e(g.limit)}</p><details class="a3r-term-collection"><summary>Deux notions à approfondir dans ce chapitre</summary><div class="a3r-term-list">${terms}</div></details></aside>`:'';
    const courses=guide.routes.filter(r=>r.stops.some(s=>s.path===chapterPath(id))).map(r=>btn(parcoursPath(r.id),r.title)).join('');
    const criticalBlock=k?`<aside class="a3r-critical"><div class="a3r-eyebrow">CONTRE-ÉPREUVE · LECTURE CRITIQUE V1.3</div><h2>${e(k.title)}</h2><p class="a3r-critical-intro">Une situation pour mettre à l'épreuve la lecture sans en faire un diagnostic ni une vérité de l'expérience.</p>${k.paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}<p class="a3r-critical-limit"><strong>À distinguer :</strong> ${e(k.limit)}</p><button type="button" class="a3r-link" onclick="Atlas3Reader.jumpToSection('${e(k.source)}')">Revenir au passage source</button></aside>`:'';
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
  function openNotion(chapterId,index){
    const g=guide.chapters[chapterId],t=g?.terms?.[index];
    const modal=document.getElementById('a3r-notion-modal');
    if(!modal||!t)return;
    termSource=t.section_id;
    termFocus=document.activeElement;
    modal.innerHTML=`<div class="a3r-notion-dialog" role="dialog" aria-modal="true" aria-labelledby="a3r-notion-title"><button class="a3r-notion-close" type="button" onclick="Atlas3Reader.closeNotion()" aria-label="Fermer la notion">✕</button><div class="a3r-eyebrow">NOTION SITUÉE · ${e(g.title)}</div><h2 id="a3r-notion-title">${e(t.title)}</h2><p>${e(t.text)}</p><button class="a3r-link" type="button" onclick="Atlas3Reader.goToNotionSource()">Lire le passage dans le chapitre</button></div>`;
    modal.hidden=false;modal.querySelector('.a3r-notion-close')?.focus();
  }
  function goToNotionSource(){
    const id=termSource;closeNotion();
    const d=document.getElementById(id);
    if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});d.querySelector('summary')?.focus();}
  }
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.getElementById('a3r-notion-modal')?.hidden===false)closeNotion();});
  function jumpToSection(id){
    const x=document.getElementById(id);if(!x)return;
    x.open=true;x.scrollIntoView({behavior:'smooth',block:'start'});x.querySelector('summary')?.focus();
  }
  window.Atlas3Reader={
    closeNotion,openNotion,goToNotionSource,jumpToSection,
    toggleSections(open){
      if(!document || !document.querySelectorAll)return;
      document.querySelectorAll('.a3r-sections .a3r-section').forEach(x => {x.open=!!open;});
    },
    render:renderAtlas3
  };
  PAGE_HANDLERS.atlas3=renderAtlas3;
  // Charger la nouvelle édition indépendamment du grand index historique.
  // Le premier affichage reste possible si le fichier n'est pas disponible.
  if(!edition15() && typeof document!=='undefined' && document.head){
    const editionScript=document.createElement('script');
    editionScript.src='./atlas3-v15.js';
    editionScript.async=true;
    editionScript.onload=()=>{
      if(!edition15())return;
      data.status='Édition V1.5 — conditions, formes et contre-épreuves ; sources en cours de contrôle';
      if(typeof current==='function' && String(current()).split('/')[0]==='atlas3' && typeof render==='function')render();
    };
    editionScript.onerror=()=>console.warn('Atlas 3 V1.5 : supplément indisponible, édition V1.4.1 maintenue.');
    document.head.appendChild(editionScript);
  }else if(edition15()){
    data.status='Édition V1.5 — conditions, formes et contre-épreuves ; sources en cours de contrôle';
  }
  // atlas-hub.js a déjà fait son premier rendu : actualiser uniquement si Atlas 3 est affiché.
  if(typeof current==='function' && current().split('/')[0]==='atlas3' && typeof render==='function')render();
})();
