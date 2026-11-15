/* ATLAS 1 OPÉRATOIRE — V10.11
   Couche méthodologique invisible : diagnostics -> familles -> opérateurs -> runs -> état -> gate Atlas 2.
   Important : cette couche ne remplace pas le corpus Atlas 1 visible et ne scénarise jamais.
*/
(function(){
'use strict';

const A1_DIAGNOSTICS=Object.freeze([
 {id:'D1',label:'Confusion de niveaux',priority:2,families:['problematisation'],detects:'Plusieurs réalités de nature différente sont traitées sous un même terme ou comme degrés d’une même chose.'},
 {id:'D2',label:'Interprétation prématurée',priority:1,families:['suspend_interpretation','multiply'],detects:'Un élément reçoit une signification, une intention ou une fonction non encore établie par le matériau.'},
 {id:'D3',label:'Causalité supposée',priority:1,families:['qualify_relations'],detects:'Une succession, une trace, une proximité ou une corrélation est traitée comme cause.'},
 {id:'D4',label:'Centralisation excessive',priority:3,families:['multiply','anti_totalization'],detects:'Un élément devient centre explicatif parce qu’il est spectaculaire, dense ou commode.'},
 {id:'D5',label:'Totalisation',priority:3,families:['multiply','anti_totalization'],detects:'Des différences sont rabattues sur une unité ou une explication finale qui les épuise.'},
 {id:'D6',label:'Psychologisation',priority:3,families:['assemblage','forces_processes'],detects:'Une configuration relationnelle, sociale, matérielle ou institutionnelle est rabattue sur l’intériorité d’un sujet.'},
 {id:'D7',label:'Forme / fonction héritée',priority:4,families:['declishing'],detects:'Une forme narrative ou sensible très codée reconduit automatiquement sa fonction dominante.'},
 {id:'D8',label:'Après-coup',priority:1,families:['problematisation','anti_retrospection'],detects:'Un résultat tardif est projeté rétrospectivement comme vérité ou intention déjà présente à l’origine.'},
 {id:'D9',label:'Abstraction excessive',priority:4,families:['actualization'],detects:'Le problème reste conceptuel et ne rencontre pas encore de conditions matérielles, temporelles ou sensibles.'},
 {id:'D10',label:'Solution stérile',priority:4,families:['process_power','suspend_interpretation'],detects:'Une proposition remplit une fonction immédiate puis s’épuise sans produire de nouvelles conséquences.'},
 {id:'D11',label:'Sur-détermination',priority:2,families:['anti_totalization','qualify_relations'],detects:'Trop d’éléments expliquent trop directement les autres ; l’architecture devient excessivement parfaite.'},
 {id:'D12',label:'Sous-détermination',priority:2,families:['problematisation','assemblage','forces_processes'],detects:'Des éléments sont juxtaposés sans relations, conditions ou différences suffisamment qualifiées.'}
]);

const A1_FAMILIES=Object.freeze({
 problematisation:{label:'Construire / déplacer le problème'},
 suspend_interpretation:{label:'Suspendre l’interprétation prématurée'},
 multiply:{label:'Multiplier sans totaliser'},
 qualify_relations:{label:'Qualifier les relations'},
 assemblage:{label:'Cartographier les agencements'},
 forces_processes:{label:'Cartographier forces et processus'},
 anti_totalization:{label:'Empêcher la totalisation'},
 declishing:{label:'Défaire la reconduction formelle'},
 anti_retrospection:{label:'Empêcher l’après-coup'},
 actualization:{label:'Préparer l’actualisation matérielle'},
 process_power:{label:'Tester la puissance d’un processus'}
});

function op(id,sourceWork,family,label,activation,operation,allowed,forbidden,guardrails,sourceRefs=[]){
 return Object.freeze({id,sourceWork,family,label,activation:Object.freeze(activation),operation,outputsAllowed:Object.freeze(allowed),outputsForbidden:Object.freeze(forbidden),guardrails:Object.freeze(guardrails),sourceRefs:Object.freeze(sourceRefs)});
}

const A1_OPERATORS=Object.freeze([
 op('BERG_TEST_PROBLEM','Le Bergsonisme','problematisation','Tester le problème',{diagnostics:['D1','D8','D12']},'Examiner si la formulation impose déjà des catégories ou une fausse solution ; reconstruire la question avant de chercher des réponses.',['distinction','problem_reformulation','elimination'],['scene','plot_solution'],['Un problème mal posé ne devient pas bon par une réponse ingénieuse.','Ne pas appeler Bergson par simple présence du mot mémoire.'],['Le Bergsonisme · intuition / faux problèmes']),
 op('BERG_DECOMPOSE_MIXTURE','Le Bergsonisme','problematisation','Décomposer le mixte',{diagnostics:['D1']},'Séparer les réalités de nature différente que le matériau traite comme degrés d’une même chose.',['distinction','condition'],['plot_solution','author_intention'],['Différence de nature ≠ simple différence de degré.'],['Le Bergsonisme · méthode de division']),
 op('DR_VICEDICTION','Différence et répétition','problematisation','Vice-diction',{diagnostics:['D9','D12']},'Repérer les singularités, prolonger plusieurs lignes puis ajouter les conditions qui déterminent davantage le problème sans calculer une solution déjà donnée.',['distinction','condition','problem_reformulation'],['scene','plot_solution'],['Déterminer davantage ≠ totaliser.'],['Différence et répétition · Idée-problème / vice-diction']),
 op('DR_DRAMATIZE','Différence et répétition','actualization','Dramatiser le problème',{diagnostics:['D9']},'Demander qui, combien, où, quand, comment, à quelle vitesse et à quel seuil pour rendre déterminables les dynamismes d’actualisation.',['condition','material_constraint'],['finished_scene','symbolic_key'],['Dramatisation ≠ mise en scène métaphorique ajoutée après coup.'],['Différence et répétition · dramatisation']),
 op('LDS_SERIES','Logique du sens','multiply','Mettre en séries',{diagnostics:['D2','D4','D5','D11'],requires:['au moins deux ensembles hétérogènes','relation non déjà établie comme causalité']},'Construire plusieurs séries fonctionnelles et examiner leurs décalages, répétitions et communications sans chercher de signification centrale.',['series','resonance','distinction','indeterminate_relation'],['scene','plot_solution','symbolic_key','author_intention'],['Série ≠ liste thématique.','Résonance ≠ causalité.','Communication ≠ identité.'],['Logique du sens · séries 6–10']),
 op('LDS_PROPOSITION','Logique du sens','suspend_interpretation','Dissocier les dimensions d’un énoncé',{diagnostics:['D2']},'Séparer ce qu’un énoncé désigne, manifeste, signifie et produit comme sens sans convertir ce dernier niveau en intention cachée.',['distinction','resonance','problem_reformulation'],['author_intention','symbolic_key'],['Sens ≠ signification cachée.'],['Logique du sens · proposition / sens']),
 op('LDS_PRESERVE_UNEXHAUSTED','Logique du sens','anti_totalization','Préserver l’inépuisé',{diagnostics:['D5','D10','D11']},'Distinguer ce qui doit être décidé pour que l’œuvre se dénoue de ce qui peut rester problématique et actif sans incohérence.',['active_residue','tension','condition'],['artificial_hidden_information','plot_solution'],['Inépuisé ≠ information artificiellement cachée.','Dénouement ≠ élucidation intégrale.'],['Logique du sens · problème / solutions']),
 op('PROUST_SIGN','Proust et les signes','suspend_interpretation','Distinguer signe / indice',{diagnostics:['D2','D10']},'Tester si un élément rapproche d’une solution déjà constituée ou force à construire / transformer le problème lui-même.',['requalification','problem_reformulation','reserve'],['symbolic_key'],['Signe ≠ message conventionnel.','Un élément peut rester réserve sans être promu.'],['Proust et les signes · apprentissage des signes']),
 op('PROUST_TRANSVERSAL','Proust et les signes','anti_totalization','Construire une unité transversale',{diagnostics:['D4','D5','D11']},'Faire communiquer des fragments ou séries sans les supprimer dans une totalité préalable.',['resonance','tension','relation'],['master_explanation'],['Transversalité ≠ totalisation.'],['Proust et les signes · transversalité']),
 op('SPINOZA_EFFECT_CAUSE','Spinoza selon Deleuze','qualify_relations','Séparer effet observé / cause inférée',{diagnostics:['D3','D11']},'Distinguer ce qui est effectivement observé de la cause que l’on en déduit ; rétrograder toute inférence non soutenue.',['qualified_relation','elimination','confidence_change'],['invented_cause'],['Quantité de signes ≠ connaissance adéquate des causes.'],['Spinoza · signes / imagination / notions communes']),
 op('SPINOZA_RELATIONS','Spinoza selon Deleuze','assemblage','Cartographier les rapports',{diagnostics:['D6','D12']},'Définir un individu ou une situation par les rapports, compositions, décompositions et affects plutôt que par une essence psychologique.',['relation','condition','requalification'],['psychological_essence'],['Rapport ≠ trait de caractère.'],['Spinoza · corps / affects / rapports']),
 op('NIETZ_APPROPRIATIONS','Nietzsche et la philosophie','forces_processes','Identifier les appropriations',{diagnostics:['D6','D12']},'Prendre un même phénomène et déterminer quelles forces s’en emparent et ce qu’il devient sous chacune.',['force_map','requalification','variation'],['intrinsic_value'],['Sens ≠ propriété intrinsèque.','Pluralisme ≠ opinion arbitraire.'],['Nietzsche et la philosophie · sens / forces']),
 op('NIETZ_EVALUATE_VALUE','Nietzsche et la philosophie','forces_processes','Retourner l’évaluation',{diagnostics:['D6','D7','D12']},'Quand une valeur paraît aller de soi, demander quelle manière d’évaluer et quel mode d’existence la produisent.',['force_map','problem_reformulation','tension'],['moral_judgment'],['Évaluer ≠ juger selon une valeur transcendante.'],['Nietzsche et la philosophie · généalogie / valeur']),
 op('FOUCAULT_ENUNCIATION','Foucault','multiply','Reconstruire le champ d’énonciation',{diagnostics:['D2','D4','D6']},'Examiner un énoncé par ses rapports collatéraux, positions de sujet/objet/concept et pratiques ou institutions complémentaires.',['relation','position_map','requalification'],['author_intention','isolated_phrase_meaning'],['Énoncé ≠ phrase.'],['Foucault · archiviste / énoncé']),
 op('FOUCAULT_ARCHIVE','Foucault','problematisation','Distinguer document / archive',{diagnostics:['D1','D5']},'Distinguer l’ensemble de documents des règles qui gouvernent apparition, sélection, transformation et disparition des énoncés.',['distinction','problem_reformulation'],['archive_equals_storage'],['Archive ≠ dépôt de documents.'],['Foucault · archive']),
 op('KAFKA_DESYMBOLIZE','Kafka. Pour une littérature mineure','suspend_interpretation','Désymboliser',{diagnostics:['D2','D4','D7']},'Suspendre « que signifie cet élément ? » et inventorier ce qu’il permet, bloque, connecte, fait circuler ou transforme.',['function_map','relation','reserve'],['symbolic_key','master_metaphor'],['Désymboliser ≠ interdire toute résonance.'],['Kafka · anti-interprétation']),
 op('KAFKA_ASSEMBLAGE','Kafka. Pour une littérature mineure','assemblage','Cartographier l’agencement',{diagnostics:['D4','D6','D12']},'Cartographier corps, objets, infrastructures, énoncés, règles, flux, désirs et institutions sans sujet central organisateur.',['assemblage_map','relation','connector'],['psychological_center'],['Agencement ≠ décor social autour d’un sujet.'],['Kafka · agencement']),
 op('KAFKA_CONNECTORS','Kafka. Pour une littérature mineure','multiply','Suivre les connecteurs',{diagnostics:['D4','D12']},'Repérer les éléments qui font passer d’un segment ou régime à un autre sans les promouvoir automatiquement en pivots narratifs.',['connector','relation','requalification'],['automatic_plot_pivot'],['Connecteur ≠ centre.'],['Kafka · segments / séries / connecteurs']),
 op('KAFKA_MINORIZE','Kafka. Pour une littérature mineure','declishing','Minorer une forme',{diagnostics:['D7'],requires:['fonction actuelle suffisamment qualifiée']},'Identifier l’usage dominant d’une forme héritée puis tester comment son usage, ses connexions ou son régime d’énonciation peuvent changer sans supprimer nécessairement la forme.',['function_shift','variation','tension'],['forced_weirdness'],['Mineur ≠ marginal ni original par définition.','Ne pas minorer avant d’avoir qualifié la fonction actuelle.'],['Kafka · littérature mineure']),
 op('BACON_CLICHE','Francis Bacon. Logique de la sensation','declishing','Identifier les clichés préexistants',{diagnostics:['D7'],requires:['fonction actuelle suffisamment qualifiée']},'Repérer les images, scènes, métaphores et associations qui arrivent déjà toutes faites avant la composition.',['cliche_map','risk'],['automatic_replacement'],['Identifier un cliché ne commande pas de le supprimer.'],['Francis Bacon. Logique de la sensation · cliché']),
 op('BACON_DIAGRAM','Francis Bacon. Logique de la sensation','declishing','Introduire un diagramme local',{diagnostics:['D7','D10'],requires:['cliché ou organisation prévisible identifiée']},'Perturber localement une organisation trop prévisible afin de rendre possible une relation non pré-donnée, sans convertir l’ensemble en chaos arbitraire.',['variation','new_relation','formal_risk'],['randomness_for_originality'],['Diagramme ≠ chaos.','Catastrophe locale et contrôlée.'],['Francis Bacon. Logique de la sensation · diagramme']),
 op('BACON_FORCE','Francis Bacon. Logique de la sensation','actualization','Rendre une force sensible',{diagnostics:['D9','D10']},'Chercher quelle forme sensible permet de faire éprouver une force ou une relation sans l’illustrer discursivement.',['material_constraint','perceptual_operation'],['explanatory_symbol'],['Violence de sensation ≠ violence de scène représentée.'],['Francis Bacon. Logique de la sensation · forces / sensation']),
 op('CINEMA_SENSORIMOTOR','Cinéma 1 / Cinéma 2','declishing','Tester le schème sensori-moteur',{diagnostics:['D7','D10'],requires:['fonction actuelle suffisamment qualifiée']},'Tester si perception, compréhension et action s’enchaînent automatiquement ; observer ce que produit une rupture ou un retard de cette liaison.',['temporal_relation','action_gap','variation'],['mandatory_inaction'],['Crise sensori-motrice ≠ interdiction de l’action.'],['Cinéma 1 / Cinéma 2 · crise de l’image-action']),
 op('CINEMA_INTERSTICE','Cinéma 2','anti_totalization','Produire un interstice',{diagnostics:['D3','D5','D11']},'Lorsque deux éléments sont reliés trop immédiatement, tester un intervalle où leur relation reste active sans être expliquée par un raccord causal ou herméneutique.',['interstice','resonance','indeterminate_relation'],['artificial_obscurity'],['Interstice ≠ suppression arbitraire d’information.'],['Cinéma 2 · coupures / interstices']),
 op('CINEMA_RECOGNITION','Cinéma 2','suspend_interpretation','Tester la reconnaissance',{diagnostics:['D2','D10']},'Lorsqu’une forme revient, tester si elle reste réellement identique ou si son retour oblige à reconstruire ce que l’on croyait reconnaître.',['requalification','variation'],['twist_for_twist'],['Retour de forme ≠ identité de statut.'],['Cinéma 2 · reconnaissance / cristal']),
 op('AO_AFTERWARD','L’Anti-Œdipe','anti_retrospection','Refuser l’après-coup',{diagnostics:['D8']},'Empêcher qu’un résultat produit tardivement soit présenté comme vérité originaire ou intention cachée depuis le début.',['elimination','confidence_change','problem_reformulation'],['retro_totalization'],['Requalification du passé ≠ vérité finale déjà contenue dans l’origine.'],['L’Anti-Œdipe · après-coup / rabattement']),
 op('AO_FLOWS','L’Anti-Œdipe','assemblage','Cartographier flux et coupures',{diagnostics:['D6','D12']},'Suivre entrées, sorties, coupures, reprises, appropriations et flux techniques, sociaux, économiques ou affectifs d’une machine réelle.',['flow_map','cut','relation'],['machine_as_metaphor'],['Machine ≠ métaphore.'],['L’Anti-Œdipe · machines / flux / coupures']),
 op('MP_ARBORESCENCE','Mille Plateaux','anti_totalization','Tester l’arborescence',{diagnostics:['D4','D5','D11']},'Détecter si une hiérarchie centrale a été imposée au matériau par commodité et rouvrir des lignes latérales réellement soutenues.',['decentralization','new_relation','reserve'],['rhizome_as_style'],['Rhizome ≠ désordre.','Carte ≠ modèle à décalquer.'],['Mille Plateaux · rhizome / cartographie']),
 op('CC_PROCESS','Critique et clinique','process_power','Diagnostiquer le processus',{diagnostics:['D10','D12']},'Examiner ce qu’une proposition met en mouvement, où ce processus se bloque et quelles nouvelles possibilités il produit au-delà de sa fonction immédiate.',['process_map','elimination','excess'],['quality_score'],['Efficacité immédiate ≠ puissance de processus.'],['Critique et clinique · processus / blocage / possibilité de vie']),
 op('QLP_PLAN','Qu’est-ce que la philosophie ?','problematisation','Identifier le plan de travail',{diagnostics:['D1','D9']},'Distinguer problème conceptuel, fonction de référence, forme sensible et décision artistique afin qu’ils ne soient pas évalués avec les mêmes critères.',['distinction','level_map'],['discipline_reduction'],['Concept ≠ proposition.','Percept ≠ perception.','Affect ≠ émotion.'],['Qu’est-ce que la philosophie ? · plans / interférences'])
]);

const A1_STOP_REASONS=Object.freeze(['SATURATION','PROTECTION','INSUFFICIENT_MATERIAL']);
const A1_OUTPUT_STATUS=Object.freeze(['strong_constraint','fertile_displacement','counter_test']);
const A1_MATERIAL_STATUS=Object.freeze(['active','reserve','resonant','active_residue','inactive']);
const A1_REROUTE_TYPES=Object.freeze(['precision','contradiction','displacement']);
const A1_CONFLICT_TYPES=Object.freeze(['convergence','complementarity','productive_tension','application_error']);
const QUALIFY_BEFORE_DECLICHAGE=true;

function uniq(arr){return [...new Set((arr||[]).filter(Boolean))]}
function diagnosticById(id){return A1_DIAGNOSTICS.find(d=>d.id===id)}
function operatorById(id){return A1_OPERATORS.find(o=>o.id===id)}

function ensureAtlas1State(session){
 if(!session.atlas1State)session.atlas1State={
  version:'10.11',status:'not_run',currentProblems:[],acquiredDistinctions:[],qualifiedRelations:[],strongConstraints:[],fertileDisplacements:[],counterTests:[],productiveTensions:[],materialStatus:{active:[],reserve:[],resonant:[],activeResidue:[],inactive:[]},diagnostics:[],selectedOperators:[],operationRuns:[],rejectedOperators:[],spawnedDiagnostics:[],stopReason:null,lastRunAt:null,updatedAt:null
 };
 return session.atlas1State;
}

function deterministicDiagnostics(session){
 const out=[];const lines=session.lines||[];const candidates=session.candidates||[];const materials=session.materials||[];const resources=session.resources||[];const decisions=session.decisions||[];
 const add=(id,reason,evidence=[])=>{if(!out.some(x=>x.id===id))out.push({id,reason,evidence,source:'structural',confidence:'mechanical'})};
 const untyped=lines.filter(l=>String(l.elements||'').trim()&&!String(l.relationType||'').trim());
 if(untyped.length)add('D3',`${untyped.length} ligne(s) condensée(s) n’ont pas encore de nature de relation qualifiée.`,untyped.map(x=>x.id));
 const weakContext=lines.filter(l=>String(l.elements||'').includes('→')&&!String(l.context||'').trim());
 if(weakContext.length)add('D12',`${weakContext.length} ligne(s) utilisent une condensation sans contexte suffisant.`,weakContext.map(x=>x.id));
 const activeCandidates=candidates.filter(c=>!['rejected','demoted'].includes(c.status));
 if(lines.length&&activeCandidates.length>=3){const counts=lines.map(l=>({id:l.id,n:activeCandidates.filter(c=>(c.supportsLines||[]).includes(l.id)).length}));const top=counts.sort((a,b)=>b.n-a.n)[0];if(top&&top.n===activeCandidates.length)add('D4','Tous les candidats actifs passent par la même ligne : risque de centralisation mécanique.',[top.id]);}
 const overfit=activeCandidates.filter(c=>(c.supportsLines||[]).length===lines.length&&lines.length>=4);
 if(overfit.length>=2)add('D11','Plusieurs candidats prétendent porter la totalité des lignes actives : risque de sur-détermination.',overfit.map(x=>x.id));
 const sterile=activeCandidates.filter(c=>{const t=c.tests||{};return ['low',''].includes(t.consequence?.level||'')&&['low',''].includes(t.excess?.level||'')});
 if(sterile.length)add('D10',`${sterile.length} candidat(s) ont faible conséquence et faible excédent : tester leur puissance de processus.`,sterile.map(x=>x.id));
 const abstract=activeCandidates.filter(c=>{const t=c.tests||{};return (t.materiality?.level||'')==='low'});
 if(abstract.length)add('D9',`${abstract.length} candidat(s) restent faiblement matérialisés.`,abstract.map(x=>x.id));
 const undecidedHyp=materials.filter(m=>m.status==='hypothesis');
 if(undecidedHyp.length&&decisions.length)add('D2','Des hypothèses restent présentes alors que des décisions existent : vérifier qu’aucune n’a été promue implicitement en fait.',undecidedHyp.map(x=>x.id));
 const weakA1=resources.filter(r=>r.atlas==='atlas1'&&String(r.reason||'').trim().split(/\s+/).filter(Boolean).length<6);
 if(weakA1.length)add('D12','Des raccords Atlas 1 sont trop peu contextualisés pour produire une opération fiable.',weakA1.map(x=>x.id));
 return out.sort((a,b)=>(diagnosticById(a.id)?.priority||9)-(diagnosticById(b.id)?.priority||9));
}

function selectOperators(diagnostics,{max=5}={}){
 const ids=uniq((diagnostics||[]).map(x=>typeof x==='string'?x:x.id));
 const familyScores={};
 ids.forEach(id=>{const d=diagnosticById(id);(d?.families||[]).forEach(f=>familyScores[f]=(familyScores[f]||0)+(5-(d.priority||4)))});
 const rankedFamilies=Object.entries(familyScores).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 const chosen=[];const usedSource=new Set();
 for(const family of rankedFamilies){
  const candidates=A1_OPERATORS.filter(o=>o.family===family&&(o.activation.diagnostics||[]).some(d=>ids.includes(d)));
  if(!candidates.length)continue;
  let pick=candidates.find(o=>!usedSource.has(o.sourceWork))||candidates[0];
  if(QUALIFY_BEFORE_DECLICHAGE&&family==='declishing'){
   const epistemic=ids.some(id=>['D1','D2','D3','D8','D11','D12'].includes(id));
   if(epistemic)continue;
  }
  if(!chosen.some(o=>o.id===pick.id)){chosen.push(pick);usedSource.add(pick.sourceWork)}
  if(chosen.length>=max)break;
 }
 return chosen;
}

function preRoute(session){
 const state=ensureAtlas1State(session);const diagnostics=deterministicDiagnostics(session);const operators=selectOperators(diagnostics);
 state.diagnostics=diagnostics;
 state.selectedOperators=operators.map(o=>({id:o.id,label:o.label,sourceWork:o.sourceWork,family:o.family,status:'selected'}));
 state.status=diagnostics.length?'pre_routed':'no_structural_alert';state.lastRunAt=new Date().toISOString();state.updatedAt=state.lastRunAt;
 return state;
}

function recordOperationRun(session,payload){
 const state=ensureAtlas1State(session);const operator=operatorById(payload.operatorId);if(!operator)throw new Error('Opérateur Atlas 1 inconnu : '+payload.operatorId);
 const run={id:'a1run_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7),operatorId:operator.id,sourceWork:operator.sourceWork,inputState:payload.inputState||'',evidenceUsed:uniq(payload.evidenceUsed),status:payload.status||'productive',delta:payload.delta||[],spawnedDiagnostics:uniq(payload.spawnedDiagnostics),rejectedInferences:payload.rejectedInferences||[],outputStatus:A1_OUTPUT_STATUS.includes(payload.outputStatus)?payload.outputStatus:'fertile_displacement',createdAt:new Date().toISOString()};
 state.operationRuns.push(run);
 if(run.status==='non_productive')state.rejectedOperators.push({operatorId:operator.id,reason:payload.reason||'NO_SIGNIFICANT_DELTA',at:run.createdAt});
 if(run.status==='productive'){
  if(run.outputStatus==='strong_constraint')state.strongConstraints.push(...(run.delta||[]));
  else if(run.outputStatus==='counter_test')state.counterTests.push(...(run.delta||[]));
  else state.fertileDisplacements.push(...(run.delta||[]));
 }
 state.spawnedDiagnostics=uniq([...state.spawnedDiagnostics,...run.spawnedDiagnostics]);state.status='running';state.updatedAt=run.createdAt;
 return run;
}

function reroute(session){
 const state=ensureAtlas1State(session);const existing=new Set(state.selectedOperators.map(x=>x.id));const diagnostics=[...state.diagnostics,...state.spawnedDiagnostics.map(id=>({id,source:'reroute'}))];
 const next=selectOperators(diagnostics,{max:5}).filter(o=>!existing.has(o.id));
 next.forEach(o=>state.selectedOperators.push({id:o.id,label:o.label,sourceWork:o.sourceWork,family:o.family,status:'selected_reroute'}));state.updatedAt=new Date().toISOString();return next;
}

function setStopReason(session,reason){if(!A1_STOP_REASONS.includes(reason))throw new Error('Motif d’arrêt Atlas 1 invalide');const state=ensureAtlas1State(session);state.stopReason=reason;state.status=reason==='INSUFFICIENT_MATERIAL'?'insufficient':'stabilized';state.updatedAt=new Date().toISOString();return state}

function atlas2Gate(session){
 const state=ensureAtlas1State(session);const blockers=[];
 if(!String(session.activeProblem||'').trim())blockers.push('problème initial absent');
 if(state.status==='not_run')blockers.push('Atlas 1 non exécuté');
 if(state.diagnostics.some(d=>d.id==='D3')&&(session.lines||[]).some(l=>l.elements&&!l.relationType))blockers.push('relations condensées non qualifiées');
 if(!state.stopReason&&state.status==='running')blockers.push('cycle Atlas 1 encore ouvert');
 return {ready:blockers.length===0,blockers,stateSummary:{status:state.status,stopReason:state.stopReason,diagnostics:state.diagnostics.length,runs:state.operationRuns.length,strongConstraints:state.strongConstraints.length,fertileDisplacements:state.fertileDisplacements.length,productiveTensions:state.productiveTensions.length}};
}

function validateSemanticPayload(payload){
 const errors=[];if(!payload||typeof payload!=='object')return ['payload absent'];
 (payload.diagnostics||[]).forEach(d=>{if(!diagnosticById(d.id))errors.push('diagnostic inconnu '+d.id);if(!String(d.reason||'').trim())errors.push('diagnostic '+d.id+' sans raison')});
 (payload.runs||[]).forEach(r=>{if(!operatorById(r.operatorId))errors.push('opérateur inconnu '+r.operatorId);if(r.status==='productive'&&!(r.delta||[]).length)errors.push('run productif sans delta '+r.operatorId)});
 if(payload.stopReason&&!A1_STOP_REASONS.includes(payload.stopReason))errors.push('stopReason invalide');return errors;
}

window.ATLAS1_OPERATIVE=Object.freeze({
 version:'10.11',diagnostics:A1_DIAGNOSTICS,families:A1_FAMILIES,operators:A1_OPERATORS,stopReasons:A1_STOP_REASONS,outputStatus:A1_OUTPUT_STATUS,materialStatus:A1_MATERIAL_STATUS,rerouteTypes:A1_REROUTE_TYPES,conflictTypes:A1_CONFLICT_TYPES,qualifyBeforeDeclichage:QUALIFY_BEFORE_DECLICHAGE,
 diagnosticById,operatorById,ensureState:ensureAtlas1State,deterministicDiagnostics,selectOperators,preRoute,recordOperationRun,reroute,setStopReason,atlas2Gate,validateSemanticPayload
});
})();
