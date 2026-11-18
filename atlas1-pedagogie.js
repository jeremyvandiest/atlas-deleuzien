/* ATLAS 1 — progression pédagogique V3 : rédaction et lecture extractive. */
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
    const written=hasGuide&&!guide.provenance;
    const extracted=hasGuide&&!!guide.provenance;
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
    // Le corps original de la carte apporte l'explication : une seule amorce pour orienter le lecteur.
    // Les développements du guide demeurent dans les données éditoriales, sans les dupliquer à l'écran.
    const supplement=(meta.type==='route'?'':'<section class="a1ped a1ped-compact" aria-label="Question pour découvrir">'+
      '<h2>Découvrir · '+safe(question)+'</h2>'+
      '<p>'+safe(discovery)+'</p>'+
      '</section>');
    if(!supplement)return edited;
    // Situer d'abord l'auteur ou l'œuvre : le titre et le contexte précèdent la question.
    const afterMain=edited.indexOf(mainMarker)+mainMarker.length;
    const firstSection=edited.indexOf('<section',afterMain);
    if(firstSection>=0 && firstSection-afterMain<350){
      const firstClose=edited.indexOf('</section>',firstSection);
      if(firstClose>=0 && firstClose-firstSection<3500){
        const at=firstClose+'</section>'.length;
        return edited.slice(0,at)+supplement+edited.slice(at);
      }
    }
    return edited.replace(mainMarker,mainMarker+supplement);
  };
  let wrapped=0,manuallyWritten=0,contextualized=0;
  for(const meta of all){
    const original=PAGE_HANDLERS[meta.page];
    if(typeof original!=='function'||original.__a1ped)continue;
    const route=meta.page;
    PAGE_HANDLERS[route]=function(){return block(route,meta,original.apply(this,arguments));};
    PAGE_HANDLERS[route].__a1ped=true;
    wrapped++;
    if(guides[route]&&!guides[route].provenance)manuallyWritten++;
    if(guides[route]?.provenance)contextualized++;
  }
  window.ATLAS1_PEDAGOGY_STATUS={version:'V4',wrapped,manuallyWritten,contextualized,withoutGuide:wrapped-manuallyWritten-contextualized};
  if(typeof current==='function'&&typeof render==='function'){
    const p=String(current()).split('/')[0];
    if(p==='atlas1'||pageSet.has(p))render();
  }
})();