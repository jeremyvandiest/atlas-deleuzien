/* ATLAS 1 — progression pédagogique V1, non destructive. */
(function(){
  'use strict';
  if(typeof PAGE_HANDLERS==='undefined'||typeof AUTHORS==='undefined'||typeof WORKS==='undefined')return;
  const guides=window.ATLAS1_PEDAGOGY_GUIDES||{};
  const safe=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const strip=s=>String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&[a-zA-Z#0-9]+;/g,' ').replace(/\s+/g,' ').trim();
  const all=[...AUTHORS.map(x=>({...x,type:'author'})),...WORKS.map(x=>({...x,type:'work'})),...(typeof ROUTES!=='undefined'?ROUTES:[]).map(x=>({...x,type:'route'})),...(typeof INTERLUDES!=='undefined'?INTERLUDES:[]).map(x=>({...x,type:'interlude'}))];
  const pageSet=new Set(all.map(x=>x.page));
  const buttons=(links=[])=>links.filter(p=>pageSet.has(p)||typeof PAGE_HANDLERS[p]==='function').map(p=>{
    const ref=all.find(x=>x.page===p);
    const title=(ref?.name||ref?.title||p);
    return '<button type="button" class="a1ped-link" onclick="go(\''+safe(p)+'\')">'+safe(title)+'</button>';
  }).join('');
  const intro=(label,txt)=>'<div class="a1ped-level"><div class="a1ped-level-title">'+label+'</div><p>'+safe(txt)+'</p></div>';
  const block=(page,meta,body)=>{
    const hasGuide=!!guides[page];
    const guide=guides[page];
    const original=body;
    const mainMarker='<main class="main">';
    if(!original.includes(mainMarker))return original;
    const headings=[];
    let serial=0;
    const slug=page.replace(/[^a-zA-Z0-9_-]/g,'-');
    const edited=original.replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi,(whole,attrs,inner)=>{
      const title=strip(inner);
      if(!title||headings.length>=35)return whole;
      const existing=attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
      const id=existing?existing[1]:'a1ped-'+slug+'-'+serial++;
      headings.push({title,id});
      return existing?whole:'<h3'+attrs+' id="'+id+'">'+inner+'</h3>';
    });
    let firstParagraph='';
    const mainText=edited.slice(edited.indexOf(mainMarker)+mainMarker.length);
    const candidates=[...mainText.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map(m=>strip(m[1])).filter(t=>t.length>95&&t.length<1500);
    firstParagraph=(candidates[0]||'').slice(0,650);
    const metaDescription=String(meta.desc||'').trim();
    const title=meta.name||meta.title||'';
    const secondParagraph=(candidates[1]||'').slice(0,800);
    const thirdParagraph=(candidates[2]||'').slice(0,800);
    const discovery=hasGuide?guide.scene:(metaDescription||firstParagraph);
    const question=hasGuide?guide.lead:(meta.type==='work'?'Quel problème ce livre construit-il, et comment Deleuze en fait-il avancer la réponse ?':meta.type==='route'?'Comment ce même problème change-t-il lorsqu’il passe d’une pensée à une autre ?':meta.type==='interlude'?'En quoi ce milieu intellectuel éclaire-t-il les transformations opérées par Deleuze ?':'Quel problème ce penseur permet-il à Deleuze de reformuler ?');
    const mechanism=hasGuide?guide.mechanism:(firstParagraph||metaDescription||'Commencer par le premier mouvement du dossier : déterminer le problème philosophique avant d’étudier les notions.');
    const deep=hasGuide?guide.deeper:(secondParagraph||thirdParagraph||'Continuer la lecture intégrale : ne pas isoler un concept de ses arguments, de ses objections et de ses sources.');
    const limits=hasGuide?guide.limit:'Ce guide est une orientation éditoriale à partir du dossier existant, pas une lecture critique supplémentaire de ses sources. Distinguer la philosophie de l’auteur de ce que Deleuze en retient.';
    const links=hasGuide?buttons(guide.links):'';
    const toc=headings.slice(0,12).map(h=>'<li><button type="button" onclick="document.getElementById(\''+h.id+'\')?.scrollIntoView({behavior:\'smooth\',block:\'start\'})">'+safe(h.title)+'</button></li>').join('');
    const supplement='<section class="a1ped" aria-label="Parcours de lecture pédagogique">'+
      '<div class="a1ped-kicker">ATLAS 1 · ENTRER DANS LA LECTURE</div>'+
      '<h2>'+safe(title)+' : découvrir, comprendre, approfondir</h2>'+
      '<p class="a1ped-intro">L’enjeu n’est pas une histoire neutre de la philosophie, mais ce que Deleuze découvre, déplace ou transforme dans cette pensée. Les analyses originales suivent intégralement.</p>'+
      intro('1 · Découvrir : '+safe(question),discovery)+
      '<details class="a1ped-depth" open><summary>2 · Comprendre ce qui se transforme</summary><p>'+safe(mechanism)+'</p></details>'+
      '<details class="a1ped-depth"><summary>3 · Approfondir sans perdre les nuances</summary><p>'+safe(deep)+'</p><p class="a1ped-limit"><strong>À distinguer :</strong> '+safe(limits)+'</p>'+
      (links?'<div class="a1ped-links">'+links+'</div>':'')+'</details>'+
      (toc?'<details class="a1ped-depth"><summary>Sommaire de la carte détaillée</summary><ol class="a1ped-toc">'+toc+'</ol></details>':'')+
      '<p class="a1ped-disclaimer">'+(hasGuide?'Introduction éditoriale rédigée pour cette entrée.':'Orientation guidée à partir du contenu existant ; approfondissement éditorial individuel encore nécessaire.')+'</p>'+
      '</section>';
    return edited.replace(mainMarker,mainMarker+supplement);
  };
  let wrapped=0,manuallyWritten=0;
  for(const meta of all){
    const original=PAGE_HANDLERS[meta.page];
    if(typeof original!=='function'||original.__a1ped)continue;
    const route=meta.page;
    PAGE_HANDLERS[route]=function(){return block(route,meta,original.apply(this,arguments));};
    PAGE_HANDLERS[route].__a1ped=true;
    wrapped++;
    if(guides[route])manuallyWritten++;
  }
  const homeOriginal=PAGE_HANDLERS.atlas1;
  if(typeof homeOriginal==='function'&&!homeOriginal.__a1ped){
    PAGE_HANDLERS.atlas1=function(){
      const html=homeOriginal();
      const marker='<main class="main">';
      const guide='<section class="a1ped-home"><div class="a1ped-kicker">ATLAS 1 · PREMIERS REPÈRES</div><h2>Commencer sans connaître Deleuze</h2>'+
        '<p>Trois lectures pour rencontrer le problème d’un sujet qui se forme, celui des conditions de la pensée, puis celui de la différence. Les cartes complètes et les routes restent indépendantes.</p>'+
        '<div class="a1ped-links">'+buttons(['author-hume','author-kant','route-difference'])+'</div></section>';
      return html.includes(marker)?html.replace(marker,marker+guide):html;
    };
    PAGE_HANDLERS.atlas1.__a1ped=true;
  }
  window.ATLAS1_PEDAGOGY_STATUS={version:'V1',wrapped,manuallyWritten,otherEntries:wrapped-manuallyWritten};
  if(typeof current==='function'&&typeof render==='function'){
    const p=String(current()).split('/')[0];
    if(p==='atlas1'||pageSet.has(p))render();
  }
})();