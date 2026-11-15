(function(global){
  'use strict';

  const DEFAULTS = {scope:'patch', includeWarnings:true};
  const canonicalOptics = new Set(['CONFIGURATION','TRANSFORMATION','TEMPS','ESPACE','CORPS','RESSOURCES','SAVOIR','ÉNONCIATION','STYLE']);
  const forbiddenActiveTerms = new Set([
    'TRACE NÉGATIVE','RÉPÉTITION PRODUCTIVE','INVERSION FONCTIONNELLE',
    'SEUIL CUMULATIF','TRANSFORMATION ÉVALUATIVE','RÉVERSION ÉPISTÉMIQUE'
  ]);

  function runAtlas2Audit(data, options){
    options = Object.assign({}, DEFAULTS, options||{});
    const report = {errors:[], warnings:[], passes:[], categories:{}, scope:options.scope};
    const cat = name => report.categories[name] || (report.categories[name]={errors:0,warnings:0,passes:0});
    const push = (kind, category, code, message, meta={}) => {
      const item = {kind,category,code,message,...meta};
      report[kind==='error'?'errors':kind==='warning'?'warnings':'passes'].push(item);
      cat(category)[kind==='error'?'errors':kind==='warning'?'warnings':'passes']++;
    };
    const ok = (c,code,msg,meta) => push('pass',c,code,msg,meta);
    const warn = (c,code,msg,meta) => push('warning',c,code,msg,meta);
    const err = (c,code,msg,meta) => push('error',c,code,msg,meta);

    const arr = x => Array.isArray(x) ? x : [];
    const policy = data.audit_policy || {};
    const collections = {
      works: arr(data.works), transformations: arr(data.transformations), configurations: arr(data.configurations),
      forms: arr(data.forms), problems: arr(data.problems), optics: arr(data.optics).filter(x=>x&&typeof x==='object'), laboratories: arr(data.laboratories), routes: arr(data.routes)
    };
    const globalIds = new Set();
    Object.values(collections).forEach(list => list.forEach(x => x && x.id && globalIds.add(x.id)));

    // 1. DATA INTEGRITY
    const ids=[];
    Object.entries(collections).forEach(([name,list])=>list.forEach(item=>{
      if(!item || !item.id) err('DONNÉES','MISSING_ID',`${name}: entrée sans id`);
      else ids.push(item.id);
    }));
    const dup = ids.filter((id,i)=>ids.indexOf(id)!==i);
    if(dup.length) err('DONNÉES','DUPLICATE_ID',`IDs dupliqués: ${[...new Set(dup)].join(', ')}`);
    else ok('DONNÉES','UNIQUE_IDS','Aucun ID dupliqué.');

    const expectedCounts = [
      ['works','required_work_count'],['transformations','required_transformation_count'],['configurations','required_configuration_count'],
      ['forms','required_form_count'],['problems','required_problem_count']
    ];
    expectedCounts.forEach(([key,pkey])=>{
      if(policy[pkey]!=null && collections[key].length!==policy[pkey]) err('DONNÉES','COUNT_'+key.toUpperCase(),`${key}: ${collections[key].length} au lieu de ${policy[pkey]}.`);
      else ok('DONNÉES','COUNT_'+key.toUpperCase(),`${key}: compte conforme (${collections[key].length}).`);
    });
    if(policy.required_optic_count!=null && arr(data.optics).length!==policy.required_optic_count) err('DONNÉES','COUNT_OPTICS',`optiques: ${arr(data.optics).length} au lieu de ${policy.required_optic_count}.`);
    else ok('DONNÉES','COUNT_OPTICS',`optiques: compte conforme (${arr(data.optics).length}).`);

    collections.works.forEach(w=>{
      if(!w.card) err('ŒUVRES','WORK_NO_CARD',`${w.id}: carte manquante.`,{id:w.id});
      else ok('ŒUVRES','WORK_CARD',`${w.id}: carte présente.`,{id:w.id});
      if(!arr(w.machine).length) err('ŒUVRES','WORK_NO_MACHINE',`${w.id}: machine manquante.`,{id:w.id});
      else ok('ŒUVRES','WORK_MACHINE',`${w.id}: machine présente.`,{id:w.id});
      if(!w.author || !w.title) err('ŒUVRES','WORK_IDENTITY',`${w.id}: auteur ou titre manquant.`,{id:w.id});
    });

    // 1B. LOCK — CONDENSATION VISUELLE AUTORISÉE, AUTONOMIE SÉMANTIQUE INTERDITE.
    // Une chaîne, un tag ou un raccord peut rester visuel seulement si son contexte est explicité à proximité sur la fiche.
    if(policy.contextualization_rule_lock || policy.visual_chain_context_required){
      const workContent = global.__ATLAS2_WORK_CONTENT__ || {};
      const minContext = policy.min_context_chars || 120;
      collections.works.forEach(w=>{
        const c=workContent[w.id]||{};
        const checks=[
          ['machine_context','MACHINE_CONTEXT','machine visuelle'],
          ['optics_context','OPTICS_CONTEXT','optiques']
        ];
        if(arr(w.local_concepts).length) checks.push(['locals_context','LOCALS_CONTEXT','notions locales']);
        if(arr(w.primary_connections).length) checks.push(['connections_context','CONNECTIONS_CONTEXT','raccords principaux']);
        checks.forEach(([field,code,label])=>{
          const txt=String(c[field]||'').trim();
          if(txt.length<minContext) err('CONTEXTUALISATION','MISSING_'+code,`${w.id}: ${label} sans contexte explicatif suffisant (${txt.length}/${minContext} caractères).`,{id:w.id,field});
          else if(!/[.!?…](?:\s|$)/.test(txt)) err('CONTEXTUALISATION','NO_SENTENCE_'+code,`${w.id}: ${label} contextualisé par fragments mais sans phrase explicative complète.`,{id:w.id,field});
          else ok('CONTEXTUALISATION',code,`${w.id}: ${label} accompagnés d'un contexte explicatif proche.`,{id:w.id,field});
        });
      });
      ok('CONTEXTUALISATION','VISUAL_CHAIN_RULE_LOCK','Règle LOCK active : les flèches, tags et formules synthétisent ; ils ne portent jamais seuls l’explication.');
    }
    const queneauAsWork = collections.works.some(w => /queneau/i.test((w.author||'')+' '+(w.title||'')));
    if(queneauAsWork) err('ŒUVRES','QUENEAU_AS_WORK','Queneau est classé comme œuvre; il doit rester LABORATOIRE STYLE.');
    else ok('ŒUVRES','QUENEAU_NOT_WORK','Queneau reste LABORATOIRE STYLE et n’est pas enregistré comme œuvre canonique.');
    const queneauLab = collections.laboratories.some(x => /queneau/i.test((x.author||'')+' '+(x.title||'')) && x.status==='LABORATOIRE');
    if(!queneauLab) err('ŒUVRES','QUENEAU_LAB_MISSING','Laboratoire Queneau manquant.');
    else ok('ŒUVRES','QUENEAU_LAB','Laboratoire Queneau présent.');

    // 2. CANONICAL VOCABULARY
    const migrationTerms = new Map(arr(data.migrations).map(m=>[String(m.term||'').toUpperCase(),m]));
    forbiddenActiveTerms.forEach(term=>{
      const existsGlobal = ids.some(id=>String(id).toUpperCase().includes(term.replace(/\s+/g,'-')));
      if(existsGlobal) err('VOCABULAIRE','FORBIDDEN_ACTIVE_TERM',`${term} survit comme catégorie active.`);
      else if(migrationTerms.has(term)) ok('VOCABULAIRE','MIGRATION_'+term,`${term}: migration définie.`);
      else warn('VOCABULAIRE','MISSING_MIGRATION',`${term}: terme interdit sans règle de migration.`);
    });
    ['TRACE','RÉPÉTITION','VARIATION','TRANSFORMATION','SEUIL','RÉVERSION','RECOMPOSITION','CONDENSATION'].forEach(title=>{
      if(!collections.transformations.some(t=>t.title===title)) err('VOCABULAIRE','MISSING_TRANSFORMATION',`${title}: nœud global absent.`);
      else ok('VOCABULAIRE','TRANSFORMATION_'+title,`${title}: nœud global présent.`);
    });

    // 3. GLOBAL / LOCAL
    const localNorm = new Set(arr(data.local_concepts).map(s=>String(s).toLocaleLowerCase('fr')));
    for(const id of globalIds){
      const label = collections.works.concat(collections.transformations,collections.configurations,collections.forms,collections.problems,collections.optics).find(x=>x.id===id)?.title;
      if(label && localNorm.has(String(label).toLocaleLowerCase('fr'))) err('GLOBAL_LOCAL','LOCAL_PROMOTED',`${label}: notion locale promue par erreur.`,{id});
    }
    ok('GLOBAL_LOCAL','LOCAL_INDEX_READY',`${localNorm.size} notions locales indexables sans page globale.`);

    // 4. CONNECTIONS
    const connectionTargets = new Set([...globalIds]);
    collections.works.forEach(w=>{
      const p = arr(w.primary_connections);
      if(p.length > (policy.max_primary_connections||6)) err('RACCORDS','TOO_MANY_PRIMARY',`${w.id}: ${p.length} raccords principaux (max ${policy.max_primary_connections||6}).`,{id:w.id});
      else if(w.status!=='PROVISIONAL' && p.length < (policy.recommended_min_primary_connections||4)) warn('RACCORDS','FEW_PRIMARY',`${w.id}: seulement ${p.length} raccords principaux.`,{id:w.id});
      else ok('RACCORDS','PRIMARY_COUNT',`${w.id}: ${p.length} raccords principaux.`,{id:w.id});
      p.forEach(target=>{
        if(!connectionTargets.has(target)) err('RACCORDS','DEAD_CONNECTION',`${w.id}: raccord vers ${target} inexistant.`,{id:w.id,target});
      });
    });
    collections.transformations.forEach(t=>arr(t.structural_connections).forEach(target=>{
      if(!connectionTargets.has(target)) err('RACCORDS','DEAD_STRUCTURAL_CONNECTION',`${t.id}: arête structurelle vers ${target} inexistante.`,{id:t.id,target});
    }));

    // 5. OPTICS
    const opticTitles = arr(data.optics).map(o=>typeof o==='string'?o:o?.title).filter(Boolean);
    opticTitles.forEach(o=>{
      if(!canonicalOptics.has(o)) err('OPTIQUES','UNKNOWN_OPTIC',`${o}: optique inconnue.`);
    });
    collections.works.forEach(w=>{
      arr(w.optics).forEach(o=>{ if(!canonicalOptics.has(o)) err('OPTIQUES','UNKNOWN_WORK_OPTIC',`${w.id}: optique inconnue ${o}.`,{id:w.id}); });
      if(arr(w.optics).length > (policy.max_strong_optics||5)) warn('OPTIQUES','TOO_MANY_OPTICS',`${w.id}: ${arr(w.optics).length} optiques fortes.`,{id:w.id});
    });
    if(new Set(opticTitles).size!==opticTitles.length) err('OPTIQUES','DUPLICATE_OPTIC_TITLE','Titres d’optiques dupliqués.');
    else ok('OPTIQUES','OPTIC_SET','Liste canonique des optiques contrôlée.');

    // 6. PROBLEMS
    const problemIds = new Set(collections.problems.map(x=>x.id));
    collections.works.forEach(w=>{
      const p=w.principle||{};
      if(p.global_problem_id && !problemIds.has(p.global_problem_id)) err('PROBLÈMES','UNKNOWN_GLOBAL_PROBLEM',`${w.id}: problème global inconnu ${p.global_problem_id}.`,{id:w.id});
      if(p.local && p.global_problem_id) err('PROBLÈMES','LOCAL_PROMOTED_PROBLEM',`${w.id}: problème local possède un global_problem_id.`,{id:w.id});
      if(p.related_problem_id && !problemIds.has(p.related_problem_id)) err('PROBLÈMES','UNKNOWN_RELATED_PROBLEM',`${w.id}: problème lié inconnu ${p.related_problem_id}.`,{id:w.id});
    });

    // 6B. QUALITATIVE COMPLETENESS OF TRANSVERSAL COLLECTIONS
    const caseRefs = new Set([...collections.works.map(x=>x.id),...collections.laboratories.map(x=>x.id)]);
    const checkCaseProvenance = (category,item,cases) => {
      if(!policy.case_provenance_required) return;
      arr(cases).forEach(c=>{
        if(!c || typeof c!=='object') return;
        const label=String(c.label||c.title||'');
        if(c.ref_id){
          if(c.status==='STRESS_TEST') err(category,'STRESS_CASE_HAS_REF',`${item.id}: le cas ${label||c.ref_id} est marqué STRESS_TEST mais possède déjà un ref_id canonique.`,{id:item.id,target:c.ref_id});
          return;
        }
        if(c.status!=='STRESS_TEST') err(category,'UNMARKED_EXTERNAL_CASE',`${item.id}: cas externe « ${label||'sans libellé'} » sans statut STRESS_TEST.`,{id:item.id});
        else {
          ok(category,'STRESS_CASE_PROVENANCE',`${item.id}: cas stress-test explicitement signalé — ${label}.`,{id:item.id});
          if(c.medium!=='film') warn(category,'STRESS_CASE_MEDIUM',`${item.id}: cas STRESS_TEST « ${label} » sans medium=film.`,{id:item.id});
          if(/ŒUVRE\s*\d+/i.test(label)) err(category,'STRESS_CASE_NUMBERED',`${item.id}: un film de stress-test ne doit pas porter de numéro visible — ${label}.`,{id:item.id});
        }
      });
    };
    const checkCases = (category,item,min) => {
      const cs=arr(item.cases);
      if(cs.length < min) err(category,'TOO_FEW_CASES',`${item.id}: ${cs.length} cas documentés ; minimum ${min}.`,{id:item.id});
      else ok(category,'CASES_COMPLETE',`${item.id}: ${cs.length} cas documentés.`,{id:item.id});
      cs.forEach(c=>{ if(c && typeof c==='object' && c.ref_id && !caseRefs.has(c.ref_id)) err(category,'DEAD_CASE_REF',`${item.id}: cas vers ${c.ref_id} inexistant.`,{id:item.id,target:c.ref_id}); });
      checkCaseProvenance(category,item,cs);
    };
    collections.configurations.forEach(c=>{
      if(!c.definition) err('CONFIGURATIONS','MISSING_DEFINITION',`${c.id}: définition manquante.`,{id:c.id}); else ok('CONFIGURATIONS','DEFINITION',`${c.id}: définition présente.`,{id:c.id});
      if(arr(c.conditions).length < (policy.min_configuration_conditions||2)) err('CONFIGURATIONS','MISSING_CONDITIONS',`${c.id}: conditions insuffisantes.`,{id:c.id}); else ok('CONFIGURATIONS','CONDITIONS',`${c.id}: conditions documentées.`,{id:c.id});
      if(!arr(c.dynamics).length) err('CONFIGURATIONS','MISSING_DYNAMICS',`${c.id}: dynamique manquante.`,{id:c.id}); else ok('CONFIGURATIONS','DYNAMICS',`${c.id}: dynamique documentée.`,{id:c.id});
      if(!arr(c.contrasts).length) warn('CONFIGURATIONS','MISSING_CONTRAST',`${c.id}: contraste / garde-fou absent.`,{id:c.id}); else ok('CONFIGURATIONS','CONTRAST',`${c.id}: contraste documenté.`,{id:c.id});
      checkCases('CONFIGURATIONS',c,policy.min_configuration_cases||3);
    });
    collections.forms.forEach(f=>{
      if(!f.definition) err('FORMES','MISSING_DEFINITION',`${f.id}: définition manquante.`,{id:f.id}); else ok('FORMES','DEFINITION',`${f.id}: définition présente.`,{id:f.id});
      if(arr(f.functions).length < (policy.min_form_functions||3)) err('FORMES','MISSING_FUNCTIONS',`${f.id}: fonctions insuffisantes.`,{id:f.id}); else ok('FORMES','FUNCTIONS',`${f.id}: fonctions variables documentées.`,{id:f.id});
      if(!arr(f.guardrails).length) warn('FORMES','MISSING_GUARDRAILS',`${f.id}: garde-fou absent.`,{id:f.id}); else ok('FORMES','GUARDRAILS',`${f.id}: garde-fous présents.`,{id:f.id});
      checkCases('FORMES',f,policy.min_form_cases||3);
    });
    collections.problems.forEach(p=>{
      if(!p.question) err('PROBLÈMES','MISSING_QUESTION',`${p.id}: question manquante.`,{id:p.id}); else ok('PROBLÈMES','QUESTION',`${p.id}: question présente.`,{id:p.id});
      if(!p.tension) err('PROBLÈMES','MISSING_TENSION',`${p.id}: tension constitutive manquante.`,{id:p.id}); else ok('PROBLÈMES','TENSION',`${p.id}: tension documentée.`,{id:p.id});
      if(arr(p.responses).length < (policy.min_problem_responses||2)) err('PROBLÈMES','MISSING_RESPONSES',`${p.id}: réponses comparatives insuffisantes.`,{id:p.id}); else ok('PROBLÈMES','RESPONSES',`${p.id}: réponses observées documentées.`,{id:p.id});
      checkCases('PROBLÈMES',p,policy.min_problem_cases||3);
    });
    collections.optics.forEach(o=>{
      if(!o.definition) err('OPTIQUES','MISSING_DEFINITION',`${o.id}: définition manquante.`,{id:o.id}); else ok('OPTIQUES','DEFINITION',`${o.id}: définition présente.`,{id:o.id});
      if(arr(o.questions).length < (policy.min_optic_questions||2)) err('OPTIQUES','MISSING_QUESTIONS',`${o.id}: questions insuffisantes.`,{id:o.id}); else ok('OPTIQUES','QUESTIONS',`${o.id}: questions documentées.`,{id:o.id});
      if(!arr(o.blindspots).length) warn('OPTIQUES','MISSING_BLINDSPOT',`${o.id}: angle mort non documenté.`,{id:o.id}); else ok('OPTIQUES','BLINDSPOT',`${o.id}: angle mort documenté.`,{id:o.id});
      if(!arr(o.couplings).length) warn('OPTIQUES','MISSING_COUPLINGS',`${o.id}: aucun couplage utile.`,{id:o.id}); else ok('OPTIQUES','COUPLINGS',`${o.id}: couplages documentés.`,{id:o.id});
      if(arr(o.cases).length < (policy.min_optic_cases||3)) err('OPTIQUES','TOO_FEW_CASES',`${o.id}: cas exemplaires insuffisants.`,{id:o.id}); else ok('OPTIQUES','CASES_COMPLETE',`${o.id}: cas exemplaires documentés.`,{id:o.id});
    });

    // Provenance is explicit for non-integrated films used as comparative stress-tests.
    collections.transformations.forEach(t=>{
      const tc=t.cases||{};
      Object.values(tc).forEach(list=>checkCaseProvenance('TRANSFORMATIONS',t,list));
    });
    collections.optics.forEach(o=>checkCaseProvenance('OPTIQUES',o,o.cases));

    // Editorial exclusions from the qualitative audit: these prevent weak/mistyped cases from silently returning.
    const exclusions=policy.semantic_case_exclusions||{};
    const transversalById=new Map([...collections.configurations,...collections.forms,...collections.problems,...collections.transformations,...collections.optics].map(x=>[x.id,x]));
    const labelsFor = item => {
      if(!item) return [];
      if(Array.isArray(item.cases)) return item.cases.map(c=>typeof c==='string'?c:(c?.label||c?.title||''));
      if(item.cases && typeof item.cases==='object') return Object.values(item.cases).flatMap(list=>arr(list).map(c=>typeof c==='string'?c:(c?.label||c?.title||'')));
      return [];
    };
    Object.entries(exclusions).forEach(([id,patterns])=>{
      const item=transversalById.get(id);
      if(!item){ err('QUALITATIF','EXCLUSION_NODE_MISSING',`${id}: nœud visé par un garde-fou qualitatif introuvable.`); return; }
      const labels=labelsFor(item);
      arr(patterns).forEach(pattern=>{
        const bad=labels.find(x=>String(x).toLocaleLowerCase('fr').includes(String(pattern).toLocaleLowerCase('fr')));
        if(bad) err('QUALITATIF','EXCLUDED_CASE_RETURNED',`${id}: cas éditorialement exclu revenu — ${bad}.`,{id});
        else ok('QUALITATIF','CASE_EXCLUSION',`${id}: exclusion maintenue — ${pattern}.`,{id});
      });
    });
    if(policy.film_visible_numbering===false) ok('SURFACE','FILM_NUMBERING_POLICY','Films : aucun numéro visible autorisé sur la surface utilisateur.');
    else warn('SURFACE','FILM_NUMBERING_POLICY','La règle de non-numérotation visible des films n’est pas verrouillée.');

    // Validate structural connections beyond transformations.
    [...collections.configurations,...collections.forms].forEach(x=>arr(x.structural_connections).forEach(target=>{
      if(!connectionTargets.has(target)) err('RACCORDS','DEAD_STRUCTURAL_CONNECTION',`${x.id}: arête structurelle vers ${target} inexistante.`,{id:x.id,target});
    }));

    // 7. CONFIGURATION DE LECTURE
    const reading = collections.configurations.find(c=>c.id==='config-lecture');
    if(!reading) err('CONFIGURATIONS','READING_CONFIG_MISSING','CONFIGURATION DE LECTURE absente.');
    else if(reading.plane!=='LECTURE') err('CONFIGURATIONS','READING_CONFIG_PLANE','CONFIGURATION DE LECTURE doit être sur le plan LECTURE.');
    else ok('CONFIGURATIONS','READING_CONFIG','CONFIGURATION DE LECTURE présente et séparée du MONDE.');

    // 8. FORMS
    const canonicalForms = new Set(['form-porte-acces','form-chambre-espace-interieur','form-document-inscription','form-corps-marque','form-ressource-argent-credit']);
    collections.forms.forEach(f=>{ if(!canonicalForms.has(f.id)) err('FORMES','EXTRA_GLOBAL_FORM',`${f.id}: forme globale non canonique.`); });
    if(collections.forms.length===5) ok('FORMES','FORM_COUNT','Cinq formes globales, sans promotion de motif local.');

    // 9. SEARCH REGRESSION ON PATCH ALIASES
    const aliases = data.search_aliases||{};
    const expectedSearch = {
      'audit':'__AUDIT__','centre indirect':'work-faulkner-bruit-fureur','clinamen':'work-perec-vie-mode-emploi',
      'auto-inclusion':'transformation-auto-inclusion','inversion fonctionnelle':'transformation-reversion',
      'trace contractuelle':'transformation-trace','queneau':'lab-style-queneau','pierre ménard':'work-borges-pierre-menard',
      'dorian gray':'work-wilde-dorian-gray','substitution transformationnelle':'work-wilde-dorian-gray',
      'huis clos':'work-sartre-huis-clos','circuit de dépendances croisées':'work-sartre-huis-clos',
      'a serious man':'work-coen-serious-man','fitzcarraldo':'work-herzog-fitzcarraldo','aguirre':'work-herzog-aguirre',
      'une femme sous influence':'work-cassavetes-woman-influence','blow-up':'work-antonioni-blow-up','la montagne sacrée':'work-jodorowsky-holy-mountain',
      'vol au-dessus d’un nid de coucou':'work-forman-cuckoos-nest','jeanne dielman':'work-akerman-jeanne-dielman','akira':'work-otomo-akira',
      'variation':'transformation-variation','recomposition':'transformation-recomposition',
      'configuration métastable':'config-metastable','contrainte génératrice':'config-contrainte-generatrice',
      'optique savoir':'optic-savoir'
    };
    Object.entries(expectedSearch).forEach(([q,target])=>{
      if(aliases[q]!==target) err('RECHERCHE','SEARCH_REGRESSION',`Recherche « ${q} »: attendu ${target}, obtenu ${aliases[q]||'∅'}.`,{query:q,target});
      else ok('RECHERCHE','SEARCH_'+q,`Recherche « ${q} » → ${target}.`);
    });

    // 10. ROUTES — curated, scalable, never exhaustive.
    const expectedRoutes = policy.required_route_count_full_app || 7;
    if(collections.routes.length!==expectedRoutes) err('ROUTES','ROUTE_COUNT',`Routes: ${collections.routes.length} au lieu de ${expectedRoutes}.`);
    else ok('ROUTES','ROUTE_COUNT',`Routes: ${expectedRoutes} présentes.`);
    const minStations=policy.route_min_stations||3, maxStations=policy.route_max_stations||6;
    const routeStationIds=new Set([...collections.works.map(x=>x.id),...collections.laboratories.map(x=>x.id)]);
    collections.routes.forEach(r=>{
      if(r.status!=='CANONICAL') err('ROUTES','ROUTE_NOT_CANONICAL',`${r.id}: statut ${r.status||'∅'} au lieu de CANONICAL.`,{id:r.id});
      else ok('ROUTES','ROUTE_CANONICAL',`${r.id}: contenu canonique matérialisé.`,{id:r.id});
      if(!r.title||!r.question) err('ROUTES','ROUTE_IDENTITY',`${r.id}: titre ou question manquante.`,{id:r.id});
      const steps=arr(r.steps);
      if(steps.length<minStations||steps.length>maxStations) err('ROUTES','ROUTE_STATION_COUNT',`${r.id}: ${steps.length} stations ; attendu ${minStations}–${maxStations}.`,{id:r.id});
      else ok('ROUTES','ROUTE_STATION_COUNT',`${r.id}: ${steps.length} stations, conforme à la règle ${minStations}–${maxStations}.`,{id:r.id});
      const refs=steps.map(s=>s.ref_id);
      const dups=refs.filter((id,i)=>refs.indexOf(id)!==i);
      if(dups.length) err('ROUTES','ROUTE_DUPLICATE_STATION',`${r.id}: station dupliquée ${[...new Set(dups)].join(', ')}.`,{id:r.id});
      steps.forEach((st,i)=>{
        if(!st.ref_id||!routeStationIds.has(st.ref_id)) err('ROUTES','ROUTE_DEAD_STATION',`${r.id} étape ${i+1}: destination ${st.ref_id||'∅'} inexistante.`,{id:r.id,target:st.ref_id});
        if(!st.operation||!st.note) err('ROUTES','ROUTE_INCOMPLETE_STEP',`${r.id} étape ${i+1}: opération ou note manquante.`,{id:r.id});
      });
      const ext=arr(r.extensions);
      ext.forEach(st=>{ if(st.ref_id && !routeStationIds.has(st.ref_id)) err('ROUTES','ROUTE_DEAD_EXTENSION',`${r.id}: prolongement ${st.ref_id} inexistant.`,{id:r.id,target:st.ref_id}); });
    });
    if(policy.route_new_works_auto_add===false) ok('ROUTES','ROUTE_NO_AUTO_ADD','Nouvelles œuvres : aucun ajout automatique aux Routes.');
    else err('ROUTES','ROUTE_AUTO_ADD_POLICY','La règle de non-ajout automatique aux Routes n’est pas verrouillée.');
    if(policy.route_extensions_are_noncanonical===true) ok('ROUTES','ROUTE_EXTENSIONS_POLICY','Les prolongements restent hors du parcours canonique.');
    else err('ROUTES','ROUTE_EXTENSIONS_POLICY','Les prolongements ne sont pas explicitement séparés du parcours canonique.');

    // 11. SIGNATURES OF THE CANONICAL WORK MACHINES
    const signatures = {
      'work-kafka-metamorphose':['transformation corporelle'],
      'work-flaubert-madame-bovary':['répétition','usure','dette'],
      'work-stevenson-jekyll-hyde':['répétition','renforcement','réversion de dépendance'],
      'work-perrault-barbe-bleue':['franchissement','trace'],
      'work-beckett-godot':['reconduction'],
      'work-borges-pierre-menard':['configuration historique','requalification'],
      'work-faulkner-bruit-fureur':['perspectives partielles','recoupements'],
      'work-perec-vie-mode-emploi':['règle de parcours','unité distribuée'],
      'work-sophocle-oedipe-roi':['enquête','auto-inclusion'],
      'work-wilde-dorian-gray':['vœu de substitution','double régime','réversion terminale'],
      'work-sartre-huis-clos':['circuit de dépendances croisées','ouverture réelle de la porte','reconduction'],
      'work-coen-serious-man':['recherche d’une explication commune','consultations rabbiniques','nouvelle ouverture de l’incertitude'],
      'work-herzog-fitzcarraldo':['contrainte géographique','bateau par-dessus la montagne','recomposition du désir artistique'],
      'work-herzog-aguirre':['mutinerie','souveraineté imaginaire','radeau final'],
      'work-cassavetes-woman-influence':['tentatives de normalisation','internement','recomposition provisoire'],
      'work-antonioni-blow-up':['agrandissements successifs','hypothèse de meurtre','disparition du corps'],
      'work-jodorowsky-holy-mountain':['opérations de dépouillement','immortels révélés comme mannequins','appareil cinématographique'],
      'work-forman-cuckoos-nest':['variations introduites','lobotomie de McMurphy','sortie de Chief'],
      'work-akerman-jeanne-dielman':['micro-écarts','propagation des variations','stase finale'],
      'work-otomo-akira':['activation et amplification','perte de contrôle du support corporel','reconfiguration après catastrophe']
    };
    collections.works.forEach(w=>{
      const m=arr(w.machine).join(' ').toLocaleLowerCase('fr');
      arr(signatures[w.id]).forEach(s=>{
        if(!m.includes(String(s).toLocaleLowerCase('fr'))) err('ŒUVRES','MACHINE_SIGNATURE',`${w.id}: signature « ${s} » absente de la machine.`,{id:w.id});
      });
    });
    ok('ŒUVRES','MACHINE_SIGNATURES',`Signatures des ${collections.works.length} machines canoniques contrôlées.`);

    report.summary = {
      errors:report.errors.length, warnings:report.warnings.length, passes:report.passes.length,
      valid:report.errors.length===0,
      releaseReady:report.errors.length===0 && (options.scope!=='full' || !policy.release_requires_zero_errors || report.errors.length===0)
    };
    return report;
  }

  function formatAtlas2Audit(report){
    const lines=[];
    lines.push(`AUDIT ATLAS 2 — ${report.summary.errors} erreur(s) · ${report.summary.warnings} avertissement(s) · ${report.summary.passes} contrôles réussis`);
    const cats=Object.keys(report.categories).sort();
    cats.forEach(c=>{
      const x=report.categories[c];
      lines.push(`${c}: ✓ ${x.passes} · ⚠ ${x.warnings} · ✕ ${x.errors}`);
    });
    if(report.errors.length){ lines.push('', 'ERREURS'); report.errors.forEach(x=>lines.push(`✕ [${x.category}] ${x.code} — ${x.message}`)); }
    if(report.warnings.length){ lines.push('', 'AVERTISSEMENTS'); report.warnings.forEach(x=>lines.push(`⚠ [${x.category}] ${x.code} — ${x.message}`)); }
    return lines.join('\n');
  }

  global.Atlas2Audit = {run:runAtlas2Audit, format:formatAtlas2Audit};
  if(typeof module!=='undefined' && module.exports) module.exports=global.Atlas2Audit;
})(typeof window!=='undefined'?window:globalThis);
