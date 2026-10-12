
/* ===================== Archie: original floating guide ===================== */
const ARCH_DEFS=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="aHalo"><stop offset="0" stop-color="#7FE6FF" stop-opacity=".55"/><stop offset=".55" stop-color="#45B5C6" stop-opacity=".18"/><stop offset="1" stop-color="#45B5C6" stop-opacity="0"/></radialGradient>
<linearGradient id="aHead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#D7DEEA"/><stop offset="1" stop-color="#9AA6BA"/></linearGradient>
<linearGradient id="aHat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A0"/><stop offset=".55" stop-color="#F0B93A"/><stop offset="1" stop-color="#B9831E"/></linearGradient>
<linearGradient id="aVisor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14304E"/><stop offset="1" stop-color="#07121F"/></linearGradient>
<radialGradient id="aThr"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".4" stop-color="#7FE6FF"/><stop offset="1" stop-color="#45B5C6" stop-opacity="0"/></radialGradient>
<radialGradient id="rGold" cx="35%" cy="30%"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".55" stop-color="#E0B552"/><stop offset="1" stop-color="#8C6A26"/></radialGradient>
<linearGradient id="rWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D7A86B"/><stop offset="1" stop-color="#7A4E22"/></linearGradient>
<linearGradient id="rBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9CCFF"/><stop offset="1" stop-color="#2F6BC9"/></linearGradient>
<linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5BDC8"/><stop offset="1" stop-color="#5D6673"/></linearGradient>
<linearGradient id="stoneD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6C6470"/><stop offset="1" stop-color="#2C2630"/></linearGradient>
<radialGradient id="uP1" cx="35%" cy="30%"><stop offset="0" stop-color="#D5E6FF"/><stop offset=".6" stop-color="#4A92FF"/><stop offset="1" stop-color="#173C7A"/></radialGradient>
<radialGradient id="uHero" cx="35%" cy="30%"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".6" stop-color="#E0B552"/><stop offset="1" stop-color="#7A5A1E"/></radialGradient>
<radialGradient id="fireG"><stop offset="0" stop-color="#FFF2B0"/><stop offset=".4" stop-color="#FF9A3C"/><stop offset="1" stop-color="#FF5A1E" stop-opacity="0"/></radialGradient>
</defs></svg>`;
document.body.insertAdjacentHTML('afterbegin',ARCH_DEFS);
function archEyes(p){
  const c='#7FE6FF';
  if(p==='cheer')return `<path d="M22 38q3.5-5 7 0M35 38q3.5-5 7 0" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`;
  if(p==='dazed')return `<path d="M22 32l6 6m0-6l-6 6M36 32l6 6m0-6l-6 6" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`;
  if(p==='fight')return `<path d="M21 31l8 3M43 31l-8 3" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><rect class="eye" x="23" y="35" width="6" height="4" rx="2" fill="${c}"/><rect class="eye" x="35" y="35" width="6" height="4" rx="2" fill="${c}"/>`;
  return `<rect class="eye" x="23" y="32" width="6" height="8" rx="3" fill="${c}"/><rect class="eye" x="35" y="32" width="6" height="8" rx="3" fill="${c}"/>`;
}
function spr(pose){
  return `<svg class="spr" viewBox="0 0 64 64" aria-hidden="true"><circle class="halo" cx="32" cy="34" r="30" fill="url(#aHalo)"/>
  <ellipse class="thr" cx="32" cy="57" rx="6" ry="4" fill="url(#aThr)"/>
  <g class="floaty"><circle cx="10.5" cy="37" r="3.2" fill="#45B5C6" stroke="#0B1220" stroke-width="1"/><circle cx="53.5" cy="37" r="3.2" fill="#45B5C6" stroke="#0B1220" stroke-width="1"/>
  <rect x="12" y="20" width="40" height="33" rx="12" fill="url(#aHead)" stroke="#0B1220" stroke-width="1.4"/>
  <rect x="17" y="27" width="30" height="17" rx="7" fill="url(#aVisor)"/>${archEyes(pose)}
  <ellipse cx="25" cy="47.5" rx="5" ry="1.3" fill="#fff" opacity=".5"/>
  <path d="M15 22Q15 7 32 7Q49 7 49 22Z" fill="url(#aHat)" stroke="#6B4E12" stroke-width="1.2"/>
  <rect x="9" y="20" width="46" height="5" rx="2.5" fill="#E9B53A" stroke="#6B4E12" stroke-width="1.1"/>
  <rect x="29.5" y="7.5" width="5" height="13" rx="2.5" fill="#FFF3C4" opacity=".55"/>
  <ellipse cx="23" cy="12.5" rx="4.5" ry="2" fill="#fff" opacity=".55"/></g></svg>`;
}
function archie(pose,say,cls){return `<div class="archie ${pose} ${cls||''}">${spr(pose)}${say?`<div class="bubble"><b>Archie</b>${say}</div>`:''}</div>`;}

/* ===================== resource bar ===================== */
function resIcon(k){
  if(k==='gold')return `<svg viewBox="0 0 20 20"><ellipse cx="10" cy="13" rx="7" ry="3.2" fill="#7A5A1E"/><ellipse cx="10" cy="11" rx="7" ry="3.2" fill="url(#rGold)"/><ellipse cx="10" cy="8" rx="7" ry="3.2" fill="url(#rGold)" stroke="#8C6A26" stroke-width=".6"/></svg>`;
  if(k==='wood')return `<svg viewBox="0 0 20 20"><rect x="6" y="3" width="11" height="14" rx="2" fill="#2F4A6E" stroke="#9EE9FF" stroke-width="1"/><rect x="3" y="5" width="11" height="13" rx="2" fill="#1E3350" stroke="#9EE9FF" stroke-width="1"/><path d="M5.5 10h6M5.5 13h4" stroke="#9EE9FF" stroke-width="1.2"/></svg>`;
  if(k==='food')return `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="url(#rBlue)" stroke="#0B2550" stroke-width=".9"/><path d="M6 10.5l2.6 2.6L14 7.7" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if(k==='banner')return `<svg viewBox="0 0 20 20"><path d="M5 2v16" stroke="#C9A55A" stroke-width="1.6"/><path d="M6 3h10l-3 4 3 4H6z" fill="#DB5A50" stroke="#6B1E19" stroke-width=".8"/></svg>`;
  return `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="url(#uHero)"/><path d="M6 9l2-3 2 2 2-2 2 3" fill="none" stroke="#5B3F0E" stroke-width="1.3"/></svg>`;
}
function capCount(){return TS.filter(t=>{const s=tsStats(t.id);return s.seen&&s.right/s.seen>=0.8;}).length;}
function hudHtml(){
  const pts=Object.values(store.answers).filter(a=>a.last).length*100;
  const hi=store.mocks.length?Math.max(...store.mocks.map(m=>m.pct))+'%':'none yet';
  const wood=Object.keys(store.cards).length;const ready=Math.round(overall(domStats())*100);
  return `<div class="hud" role="group" aria-label="Your progress">
   <span class="res" title="You earn 100 points for every question you currently have right.">${resIcon('gold')}<b>${pts}</b><span class="rl">points</span></span>
   <span class="res" title="Tasks where 80% or more of your latest answers are correct.">${resIcon('food')}<b>${capCount()} of 30</b><span class="rl">tasks mastered</span></span>
   <span class="res" title="Flashcards you have reviewed at least once.">${resIcon('wood')}<b>${wood}</b><span class="rl">cards reviewed</span></span>
   <span class="res" title="Your best mock exam score.">${resIcon('banner')}<span class="rl">best mock</span><b>${hi}</b></span>
   <span class="res hero sp" title="Readiness estimate, weighted by each domain's share of the exam.">${resIcon('hero')}<span class="rl">readiness</span><b>${ready}%</b></span></div>`;
}

/* ===================== Orchestrator Campaign map ===================== */
const OUT_SLOTS={1:[[430,70],[560,58],[395,160],[610,150],[630,300],[400,330],[520,370]],2:[[70,70],[200,55],[300,125],[110,175],[230,190]],
 3:[[705,65],[825,55],[945,75],[725,170],[845,165],[950,205]],4:[[705,330],[825,325],[960,325],[650,465],[790,505],[945,505]],5:[[60,305],[180,285],[280,305],[80,435],[205,425],[150,520]]};
const REGIONS={2:'0,0 380,0 335,215 0,245',1:'335,215 380,0 625,0 665,255 565,405 345,385',3:'625,0 1000,0 1000,265 665,255',5:'0,245 335,215 345,385 305,560 0,560',4:'665,255 1000,265 1000,560 305,560 345,385 565,405'};
const RLAB={1:[500,118],2:[160,118],3:[835,118],4:[722,402],5:[165,365]};
const BOSS_AT={1:[335,255],2:[780,250],3:[505,250],4:[880,420],5:[430,490],6:[290,465]};
const CREEP_AT=[[330,45],[665,115],[40,520],[565,470],[960,140]];
let csel=null;
function tsState(id){const s=tsStats(id);if(!s.seen)return 'fog';const a=s.right/s.seen;return a>=0.8?'own':a>=0.5?'cont':'foe';}
const STC={own:'#4A92FF',cont:'#E2A440',foe:'#DB5A50',fog:'#7A8496'};
const STN={own:'Mastered',cont:'In progress',foe:'Needs work',fog:'Not started yet'};
const SCS={1:'Customer support',2:'Code generation',3:'Multi-agent research',4:'Developer productivity',5:'Claude Code in CI',6:'Data extraction'};
function outposts(){const o=[];for(let d=1;d<=5;d++)TS.filter(t=>t.d===d).forEach((t,i)=>{const p=OUT_SLOTS[d][i];if(p)o.push({t,d,x:p[0],y:p[1],st:tsState(t.id)});});return o;}
function keepIco(col){return `<g class="ico"><ellipse cx="0" cy="13" rx="16" ry="5" fill="#000" opacity=".45"/><ellipse cx="0" cy="12" rx="15" ry="5" fill="none" stroke="${col}" stroke-width="2" opacity=".7"/>
 <rect x="-10" y="-7" width="20" height="19" fill="url(#stone)" stroke="#0A0E15" stroke-width="1"/><path d="M-11-7h5v-5h4v5h4v-5h4v5h5v3h-22z" fill="url(#stone)" stroke="#0A0E15" stroke-width="1"/>
 <rect x="-3" y="3" width="6" height="9" rx="3" fill="#0A0E15"/><path d="M0-12v-13" stroke="#C9A55A" stroke-width="1.5"/><path d="M0-25l11 3.5-11 3.5z" fill="${col}" stroke="#0A0E15" stroke-width=".8"/></g>`;}
function fortIco(hp){return `<g class="ico"><ellipse cx="0" cy="22" rx="30" ry="8" fill="#000" opacity=".5"/>
 <rect x="-24" y="-10" width="48" height="31" fill="url(#stoneD)" stroke="#05070B" stroke-width="1.2"/><rect x="-30" y="-22" width="14" height="43" fill="url(#stoneD)" stroke="#05070B" stroke-width="1.2"/><rect x="16" y="-22" width="14" height="43" fill="url(#stoneD)" stroke="#05070B" stroke-width="1.2"/>
 <path d="M-31-22l7-10 7 10zM15-22l7-10 7 10z" fill="#7A2420" stroke="#05070B" stroke-width="1"/><rect x="-6" y="5" width="12" height="16" rx="6" fill="#120A0A"/><circle cx="-23" cy="-10" r="2" fill="#FF9A3C"/><circle cx="23" cy="-10" r="2" fill="#FF9A3C"/>
 <rect x="-26" y="-44" width="52" height="7" rx="2" fill="#0A0E15" stroke="#05070B"/><rect x="-25" y="-43" width="${Math.max(0,50*hp/100)}" height="5" rx="1.5" fill="#D9473F"/></g>`;}
function creepIco(){return `<g class="ico"><circle class="fire" cx="0" cy="4" r="16" fill="url(#fireG)"/><path d="M-3 8l3-9 3 9z" fill="#FFB347"/>
 <g fill="#5B2A4A" stroke="#14070F" stroke-width="1"><path d="M-20 10l6-16 6 16z"/><path d="M10 10l6-16 6 16z"/><path d="M-6 -6l6-16 6 16z"/></g>
 <g fill="#FF5A4A"><circle cx="-15.5" cy="0" r="1.2"/><circle cx="-12.5" cy="0" r="1.2"/><circle cx="14.5" cy="0" r="1.2"/><circle cx="17.5" cy="0" r="1.2"/><circle cx="-1.5" cy="-16" r="1.2"/><circle cx="1.5" cy="-16" r="1.2"/></g></g>`;}
function campMap(){
  const outs=outposts();const seenPts=outs.filter(o=>o.st!=='fog');
  let regs='',labs='';
  for(const d of [1,2,3,4,5]){
    regs+=`<radialGradient id="rg${d}" cx="50%" cy="45%" r="75%"><stop offset="0" style="stop-color:var(--d${d})" stop-opacity=".34"/><stop offset="1" style="stop-color:var(--d${d})" stop-opacity=".07"/></radialGradient>`;
    const [lx,ly]=RLAB[d];labs+=`<text class="rl" x="${lx}" y="${ly}" text-anchor="middle">D${d} ${DOM[d].s}</text><text class="rl2" x="${lx}" y="${ly+19}" text-anchor="middle">${DOM[d].w}% of the exam</text>`;
  }
  const defs=`<defs>${regs}<filter id="relief" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".007" numOctaves="4" seed="9" result="n"/><feDiffuseLighting in="n" surfaceScale="4" lighting-color="#C7D6E6" result="l"><feDistantLight azimuth="235" elevation="40"/></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/></filter>
   <filter id="fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
   <mask id="fogm"><rect width="1000" height="560" fill="#fff"/><g filter="url(#fb)">${seenPts.map(o=>`<circle cx="${o.x}" cy="${o.y}" r="78" fill="#000"/>`).join('')}${[1,2,3,4,5,6].filter(s=>bossStats(s).seen).map(s=>`<circle cx="${BOSS_AT[s][0]}" cy="${BOSS_AT[s][1]}" r="70" fill="#000"/>`).join('')}</g></mask></defs>`;
  const ground=`<rect width="1000" height="560" fill="#3F5446" filter="url(#relief)"/>${[1,2,3,4,5].map(d=>`<polygon class="reg" points="${REGIONS[d]}" fill="url(#rg${d})"/>`).join('')}`;
  const sel=(k,rx,ry,cy)=>csel===k?`<ellipse class="selc" cx="0" cy="${cy}" rx="${rx}" ry="${ry}"/>`:'';
  const outsH=outs.map(o=>`<g class="hit" transform="translate(${o.x} ${o.y})" data-act="csel" data-k="ts:${o.t.id}" role="button" tabindex="0" aria-label="Task ${o.t.id}, ${STN[o.st]}">${sel('ts:'+o.t.id,22,8,12)}${keepIco(STC[o.st])}<text class="lbl" y="31">${o.t.id}</text><title>${esc(o.t.id+' '+o.t.t)}</title></g>`).join('');
  const bossH=[1,2,3,4,5,6].map(s=>{const [x,y]=BOSS_AT[s];const st=bossStats(s);return `<g class="hit" transform="translate(${x} ${y})" data-act="csel" data-k="boss:${s}" role="button" tabindex="0" aria-label="Exam scenario ${s}: ${esc(SC[s].n)}">${sel('boss:'+s,36,11,22)}${fortIco(st.hp)}<text class="blbl" y="42">S${s}: ${SCS[s]}</text></g>`;}).join('');
  const creepH=CREEP_AT.map((p,i)=>`<g class="hit" transform="translate(${p[0]} ${p[1]})" data-act="csel" data-k="creep:${i}" role="button" tabindex="0" aria-label="Common wrong answer: ${esc(BEASTS[i].name)}">${sel('creep:'+i,24,8,10)}${creepIco()}<title>${esc(BEASTS[i].name)}</title></g>`).join('');
  const fog=`<rect width="1000" height="560" fill="#05080E" opacity=".72" mask="url(#fogm)" pointer-events="none"/>`;
  const route=outs.filter(o=>o.st==='own'||o.st==='cont').map(o=>[o.x,o.y+4]);
  let units='';
  if(route.length>=2){const n=Math.min(6,Math.max(1,route.length-1));
    for(let k=0;k<n;k++){const r=route.slice(k%route.length).concat(route.slice(0,k%route.length));const path='M'+r.map(p=>p.join(' ')).join(' L')+' Z';
      units+=`<g pointer-events="none"><ellipse rx="7" ry="3" cy="7" fill="#000" opacity=".4"/><circle r="6" fill="url(#uP1)" stroke="#0A0E15"/><circle r="2" fill="#fff" opacity=".8"/><animateMotion dur="${16+k*3}s" begin="-${k*4}s" repeatCount="indefinite" path="${path}"/></g>`;}}
  const hp=route.length?route[0]:[505,330];
  const hero=`<g pointer-events="none" transform="translate(${hp[0]+18} ${hp[1]-14})"><g class="bob"><ellipse rx="9" ry="3.5" cy="10" fill="#000" opacity=".45"/><circle r="8" fill="url(#uHero)" stroke="#3A2A08"/><path d="M-4 -1l2-3 2 2 2-2 2 3" fill="none" stroke="#5B3F0E" stroke-width="1.3"/></g></g>`;
  return `<svg class="cmap" viewBox="0 0 1000 560" role="group" aria-label="Exam map. Five domain regions with 30 task markers, six exam scenarios, and five common wrong answers.">${defs}${ground}${labs}${creepH}${outsH}${bossH}${units}${hero}${fog}</svg>`;
}
function miniMap(){
  const outs=outposts();
  return `<svg viewBox="0 0 1000 560" aria-hidden="true"><rect width="1000" height="560" fill="#24332A"/>${[1,2,3,4,5].map(d=>`<polygon points="${REGIONS[d]}" style="fill:var(--d${d})" fill-opacity=".28" stroke="#0A0E15" stroke-width="6"/>`).join('')}
   ${outs.map(o=>`<rect x="${o.x-14}" y="${o.y-14}" width="28" height="28" fill="${STC[o.st]}" opacity="${o.st==='fog'?.45:1}"/>`).join('')}
   ${[1,2,3,4,5,6].map(s=>`<circle cx="${BOSS_AT[s][0]}" cy="${BOSS_AT[s][1]}" r="22" fill="#DB5A50" stroke="#05070B" stroke-width="6"/>`).join('')}
   <rect x="4" y="4" width="992" height="552" fill="none" stroke="#F2D894" stroke-width="8"/></svg>`;
}
const CMDI={atk:'<path d="M5 19l9-9m-2-6l8 8-3 1-6-6zM4 20l3-1-2-2z" fill="none" stroke="#F2D894" stroke-width="1.8" stroke-linejoin="round"/>',
 scout:'<circle cx="12" cy="12" r="3" fill="#9EE9FF"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="#9EE9FF" stroke-width="1.8"/>',
 train:'<path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-5a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h5z" fill="none" stroke="#B5F5C6" stroke-width="1.8"/>',
 rally:'<path d="M6 21V4M6 5h11l-2 4 2 4H6" fill="none" stroke="#F2D894" stroke-width="1.8"/>',
 siege:'<path d="M4 20V9l3 2V7l3 2V5h4v4l3-2v4l3-2v11z" fill="none" stroke="#F3A29C" stroke-width="1.8"/>',
 mock:'<circle cx="12" cy="13" r="8" fill="none" stroke="#F2D894" stroke-width="1.8"/><path d="M12 9v4l3 2M9 2h6" fill="none" stroke="#F2D894" stroke-width="1.8"/>',
 cards:'<rect x="3" y="7" width="13" height="13" rx="2" fill="none" stroke="#B5F5C6" stroke-width="1.8"/><path d="M8 3h11a2 2 0 0 1 2 2v11" fill="none" stroke="#B5F5C6" stroke-width="1.8"/>',
 plan:'<path d="M5 4h14v16H5zM8 9h8M8 13h8M8 17h5" fill="none" stroke="#9EE9FF" stroke-width="1.8"/>',
 coach:'<circle cx="12" cy="12" r="8" fill="none" stroke="#9EE9FF" stroke-width="1.8"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 16.5v.5" fill="none" stroke="#9EE9FF" stroke-width="1.8"/>',
 cancel:'<path d="M6 6l12 12M18 6L6 18" stroke="#AFC0D8" stroke-width="1.8"/>'};
function cmdBtn(c){if(!c)return '<span class="cmd empty" aria-hidden="true"></span>';
  const attrs=Object.entries(c.data||{}).map(([k,v])=>` data-${k}="${esc(String(v))}"`).join('');
  return `<button class="cmd" data-hk="${c.k}" data-act="${c.act}"${attrs} title="${esc(c.tip||c.l)} (hotkey ${c.k})"><span class="hk">${c.k}</span><svg viewBox="0 0 24 24" aria-hidden="true">${CMDI[c.i]}</svg>${esc(c.l)}</button>`;}
function bestDom(){const ds=domStats();let best=1,bs=-1;for(let d=1;d<=5;d++){const g=DOM[d].w*(1-ds[d].ready);if(g>bs){bs=g;best=d;}}return Q.some(q=>store.answers[q.id])?best:0;}
function selPanel(){
  const [kind,id]=(csel||'').split(':');
  let head='',body='',cmds=[];
  const clear={k:'X',l:'Clear selection',i:'cancel',act:'csel',data:{k:''}};
  if(kind==='ts'){
    const t=TS.find(x=>x.id===id),s=tsStats(id),st=tsState(id),acc=s.seen?Math.round(100*s.right/s.seen):0;
    head=`<div class="selhead"><div class="portrait"><svg viewBox="-20 -30 40 50">${keepIco(STC[st])}</svg></div><div><h3>Task ${t.id}</h3><span class="st" style="color:${STC[st]}">${STN[st]}</span></div></div>`;
    body=`<p>${esc(t.t)}.</p><div class="hbar ${acc<50?'foe':acc<80?'mid':''}"><i style="width:${acc}%"></i></div><span class="small muted">${s.seen?`You have answered ${s.seen} of its ${s.total} questions, and ${acc}% of your latest answers are correct.`:`You have not answered any of its ${s.total} questions yet.`} This task belongs to Domain ${t.d}, ${esc(DOM[t.d].n)}, and it counts as mastered at 80%.</span>`;
    cmds=[{k:'A',l:'Practice this task',i:'atk',act:'tsdrill',data:{v:t.id},tip:'Practice the questions for this task'},{k:'R',l:'Practice the domain',i:'rally',act:'quick',data:{d:t.d},tip:'Ten questions from Domain '+t.d},{k:'S',l:'Read the lesson',i:'scout',act:'cguide',data:{v:t.d},tip:'Open the Domain '+t.d+' lesson'},{k:'T',l:'Flashcards',i:'train',act:'cdeck',data:{v:t.d},tip:'Flashcards for Domain '+t.d},null,null,null,null,clear];
  }else if(kind==='boss'){
    const s=+id,b=BOSSES[s],S=SC[s],st=bossStats(s);
    head=`<div class="selhead"><div class="portrait"><svg viewBox="-36 -48 72 76">${fortIco(st.hp)}</svg></div><div><h3>Scenario ${s}: ${esc(S.n)}</h3><span class="st" style="color:#F3A29C">Exam scenario</span></div></div>`;
    body=`<p class="small muted">${esc(S.b)}</p><div class="hbar foe"><i style="width:${st.hp}%"></i></div><span class="small muted">You have answered ${st.right} of its ${st.total} questions correctly. The red bar over the castle shrinks as that number grows.</span>
     <span class="small">These decision rules help most in this scenario:</span><div class="chips">${b.weak.map(r=>`<span>Rule ${r}: ${esc(RULES[r].n)}</span>`).join('')}</div><p class="small">${esc(b.plan)}</p>`;
    cmds=[{k:'A',l:'Practice this scenario',i:'siege',act:'scdrill',data:{v:s},tip:'Ten questions from this scenario'},{k:'S',l:'Read the notes',i:'scout',act:'clib',data:{v:'scenarios'},tip:'Scenario notes'},null,null,null,null,null,null,clear];
  }else if(kind==='creep'){
    const i=+id,b=BEASTS[i];
    head=`<div class="selhead"><div class="portrait"><svg viewBox="-26 -28 52 44">${creepIco()}</svg></div><div><h3>${esc(b.name)}</h3><span class="st" style="color:#E59AD0">Common wrong answer</span></div></div>`;
    body=`<p class="small muted">You will usually meet it here: ${esc(b.habitat)}</p><span class="small">Watch for wording like this:</span><div class="chips">${b.tells.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p class="small"><b>How to beat it.</b> ${esc(b.counter)}</p>`;
    cmds=[{k:'A',l:'Practice spotting it',i:'atk',act:'opendrill',data:{v:'shape'},tip:'The Name the shape drill'},{k:'S',l:'Read rule '+b.rule,i:'scout',act:'clib',data:{v:'playbook'},tip:'The decision rules'},null,null,null,null,null,null,clear];
  }else{
    const ds=domStats(),o=Math.round(overall(ds)*100),bd=bestDom();
    head=`<div class="selhead"><div class="portrait">${spr('idle')}</div><div><h3>Where to start</h3><span class="st" style="color:#9EE9FF">Nothing selected</span></div></div>`;
    body=`<p>Click any marker on the map to see your progress there and practice it. Your readiness is ${o}%, and you have mastered ${capCount()} of the 30 tasks.</p><p class="small muted">${bd?`I recommend Domain ${bd}, ${esc(DOM[bd].n)}, next. It is ${DOM[bd].w}% of the exam and has the most room to grow.`:'I recommend a mixed set of questions first, so the map can show where you stand.'}</p>`;
    cmds=[{k:'A',l:'Start practice',i:'atk',act:'quick',data:{d:bd},tip:'Ten recommended questions'},{k:'M',l:'Mock exam',i:'mock',act:'cgo',data:{v:'mock'},tip:'Full 60-question mock exam'},{k:'T',l:'Flashcards',i:'train',act:'cgo',data:{v:'cards'},tip:'Flashcards'},
      {k:'S',l:'Lessons',i:'scout',act:'cgo',data:{v:'guide'},tip:'Lessons for each domain'},{k:'P',l:'Study plan',i:'plan',act:'clib',data:{v:'plan'},tip:'Four-week study plan'},{k:'H',l:'Ask Archie',i:'coach',act:'coach',tip:'Guided tour'},null,null,null];
  }
  return {head,body,cmds};
}
function questLog(){
  const ds=domStats(),o=overall(ds);
  const q=[{n:'Reach 80% readiness.',p:Math.min(1,o/0.8),v:Math.round(o*100)+'%',main:1}];
  for(let d=1;d<=5;d++){const ts=TS.filter(t=>t.d===d);const c=ts.filter(t=>tsState(t.id)==='own').length;q.push({n:`Master all Domain ${d} tasks.`,p:c/ts.length,v:`${c} of ${ts.length}`});}
  const bd=[1,2,3,4,5,6].filter(s=>bossStats(s).hp<=20).length;q.push({n:'Get 80% right in four of the six scenarios.',p:Math.min(1,bd/4),v:`${bd} of 4`});
  const won=store.mocks.some(m=>(m.scaled||0)>=720);q.push({n:'Score 720 or higher on a mock exam.',p:won?1:0,v:won?'done':'not yet'});
  const gd=Object.values(store.guide.done||{}).filter(Boolean).length;q.push({n:'Finish all five lessons.',p:Math.min(1,gd/5),v:`${gd} of 5`});
  return q.map(x=>`<div class="quest ${x.p>=1?'done':''} ${x.main?'mq':''}"><span class="qc">${x.p>=1?'&#10003;':''}</span><span class="qn">${esc(x.n)}</span><span class="qv">${x.v}</span><div class="hbar"><i style="width:${Math.round(x.p*100)}%"></i></div></div>`).join('');
}
function vMap(){
  const sp=selPanel();const sk=streakHtml();const seenAll=Q.filter(q=>store.answers[q.id]).length;
  return `<div class="pagehead"><h1>Campaign Mode</h1><p>Five domains. Thirty tasks. Select a marker to see your progress and practice. Blue means mastered.</p></div>
  <section class="mapwrap"><div class="mapscroll">${campMap()}</div><div class="maplegend"><span><i style="background:${STC.own}"></i>Mastered</span><span><i style="background:${STC.cont}"></i>In progress</span><span><i style="background:${STC.foe}"></i>Needs work</span><span><i style="background:${STC.fog}"></i>Not started</span><span><i style="background:#7A2420"></i>Exam scenario</span><span><i style="background:#FF9A3C"></i>Common wrong answer</span></div></section>
  <section class="console"><div class="cpanel minimap">${miniMap()}<div class="mm-t">Overview</div></div><div class="cpanel selinfo">${sp.head}${sp.body}</div><div class="cpanel cmdcard" role="group" aria-label="Actions">${sp.cmds.map(cmdBtn).join('')}</div></section>
  <div class="cols two"><section class="panel quests"><h3>Goals</h3>${questLog()}</section>
   <section class="panel stack"><h3>Exam date and streak</h3><div class="fieldlbl">Exam date</div><input type="date" id="examDate" value="${esc(store.examDate)}" aria-label="Exam date">${sk.html}<p class="small muted">You studied on ${sk.n} ${sk.n===1?'day':'days'} in the last 18 weeks, and you have seen ${seenAll} of the ${Q.length} questions. Your progress is saved in this browser only.</p></section></div>`;
}


/* ===================== Home: landing page and mode select ===================== */
const MODES=[
 {k:'1',id:'map',t:'Campaign Mode',i:'map',d:'Find your next move across 30 task markers.',m:'Your progress, mapped',act:'cgo',v:'map'},
 {k:'2',id:'practice',t:'Practice questions',i:'atk',d:'Make the call. See why each answer wins or loses.',m:'10 questions / 10 minutes',act:'quick',v:''},
 {k:'3',id:'cards',t:'Flashcards',i:'train',d:'Keep key facts fresh with spaced repetition.',m:'A five-minute review',act:'cgo',v:'cards'},
 {k:'4',id:'mock',t:'Mock exam',i:'mock',d:'Test your judgment. Get a report by domain.',m:'60 questions / 120 minutes',act:'cgo',v:'mock'},
 {k:'5',id:'learn',t:'Lessons',i:'scout',d:'See the mechanisms, rules, and common traps.',m:'Five domains, explained',act:'cgo',v:'learn'},
 {k:'6',id:'tour',t:'Tour with Archie',i:'coach',d:'See exam concepts at work in this app.',m:'A ten-minute guided tour',act:'coach',v:''}];
const MODE_ART={map:'__ASSET_mode-map__',practice:'__ASSET_mode-practice__',cards:'__ASSET_mode-cards__',mock:'__ASSET_mode-mock__',learn:'__ASSET_mode-learn__',tour:'__ASSET_mode-tour__'};
CMDI.map='<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" fill="none" stroke="#9EE9FF" stroke-width="1.8" stroke-linejoin="round"/>';
const ARCH_TIPS=['Most exam questions turn on one decision rule. When two answers both sound right, ask which rule is in play.',
 'If something must always happen, the right answer usually enforces it in code rather than in the prompt.',
 'Subagents start with a blank slate. Anything they need has to be in their prompt.',
 'A schema guarantees the shape of an answer, not whether it is correct.',
 'Batch processing saves money but can take up to 24 hours, so it never fits a blocking check.',
 'Fix the cheapest root cause first. Better tool descriptions usually beat a new routing layer.'];
let tipI=0;
function vHome(){
  const seen=Q.filter(q=>store.answers[q.id]).length,ds=domStats(),o=Math.round(overall(ds)*100),bd=bestDom(),cap=capCount();
  const fresh=!seen;
  const greet=fresh?'Hi, I am Archie. Pick a mode below, or press 6 and I will show you around first.':`Welcome back. Your readiness is ${o}%, and you have mastered ${cap} of the 30 tasks. I recommend Domain ${bd||1} next.`;
  const cta=fresh?`<button class="btn primary big" data-act="coach">Take the 10-minute tour</button><button class="btn big" data-act="quick" data-d="0">Start practicing now</button>`
    :`<button class="btn primary big" data-act="quick" data-d="${bd}">Continue with Domain ${bd||1}</button><button class="btn big" data-act="cgo" data-v="map">Open Campaign Mode</button>`;
  const modes=MODES.map(m=>`<button class="mode" data-act="${m.act}" ${m.v?`data-v="${m.v}"`:''} ${m.act==='quick'?`data-d="${bd}"`:''} data-mk="${m.k}"><span class="mk" aria-label="Keyboard shortcut ${m.k}">${m.k}</span><span class="mi"><img src="${MODE_ART[m.id]}" alt="" width="240" height="240" loading="lazy"></span><span class="mt">${m.t}</span><span class="md">${m.d}</span><span class="mm">${m.m}</span></button>`).join('');
  const get=[[Q.length,'scenario questions','With answer-by-answer reasoning'],['60','question mock exam','Timed, with a domain report'],[CARDS.length,'flashcards','Spaced repetition built in'],['3','quick drills','Train pattern recognition'],['5','domain lessons','Rules, diagrams, and traps'],[COACH.length,'tour stops','Real concepts in real code']];
  const loop=[['Learn','See a mechanism. Understand the rule.','learn'],['Practice','Make a decision. Read the reasoning.','practice'],['Lock it in','Review the facts. Spot the pattern.','cards'],['Prove it','Take a mock. Find your next focus.','mock']];
  const bridge=[[1,'Claude Agent SDK','Loops, coordinators, and code gates.'],[2,'MCP tools','Clear descriptions and scoped tools.'],[3,'Claude Code','Team configuration and workflows.'],[4,'Claude API','Structured output and batch decisions.'],[5,'Long sessions','Context, sources, and reliability.']];
  const sample=gS(126,'A tool request passes through a code gate. Allowed actions run; blocked actions stop.',gB(10,10,120,44,['Request'])+gP('M130 32 H160')+gB(160,10,120,44,['Code gate'],'rule-gate')+gP('M280 32 H310')+gB(310,10,120,44,['Run'])+gP('M220 54 V84')+gB(160,86,120,36,['Stop']));
  return `<section class="hero2"><div class="hero-bg" aria-hidden="true"><img src="__ASSET_tactical-atlas__" alt="" width="1440" height="814" fetchpriority="high"></div>
   <div class="hero-in"><div class="hero-copy"><span class="kicker">Claude Certified Architect, Foundations</span>
    <h1>Build <span class="keep-word">exam-ready</span> judgment.</h1>
    <p class="lede">See the patterns. Understand the reasoning. Practice Claude's design decisions and watch your progress grow.</p>
    <div class="row hero-actions">${cta}</div></div>
    <div class="hero-guide"><div class="hero-scout">${spr(fresh?'cheer':'idle')}<div class="bubble"><b>Archie</b><span id="archtip">${greet}</span></div></div><div class="first-pattern"><h2>Must always happen? Use a code gate.</h2>${sample}<details class="pattern-reason"><summary>See why this wins</summary><p>${esc(RULES[1].fix)}</p><p class="muted">Stronger wording still leaves enforcement to the model.</p></details></div></div></div>
   <div class="facts"><div><b>60</b><span>questions in 120 minutes</span></div><div><b>720</b><span>out of 1,000 to pass</span></div><div><b>4 of 6</b><span>scenarios appear on your exam</span></div><div><b>${fresh?'5':o+'%'}</b><span>${fresh?'domains and 30 task statements':'your current readiness'}</span></div></div></section>
  <section class="landsec"><div class="sechead"><h2>Choose how you want to study</h2><p>One goal, six ways in. Number keys 1 to 6 jump straight to a mode.</p></div><div class="modes">${modes}</div></section>
  <section class="landsec"><div class="sechead"><h2>What you will get</h2><p>Built from the exam guide and Anthropic's documentation.</p></div>
   <div class="getgrid">${get.map(g=>`<div class="get"><b>${g[0]}</b><span class="gt">${g[1]}</span><p>${g[2]}</p></div>`).join('')}</div></section>
  <section class="landsec"><div class="sechead"><h2>What to expect</h2><p>A repeatable loop, at your pace.</p></div>
   <ol class="loop" aria-label="Study loop">${loop.map(l=>`<li><img src="${MODE_ART[l[2]]}" alt="" width="240" height="240" loading="lazy"><b>${l[0]}</b><p>${l[1]}</p></li>`).join('')}</ol></section>
  <section class="landsec bridge"><div class="sechead"><h2>Know the concept. Choose the mechanism.</h2><p>Learn what works, why it works, and when to use it.</p></div>
   <div class="virtues"><div><b>Decisions, not definitions</b><p>Reason through the tempting wrong answers.</p></div><div><b>Rules you can reuse</b><p>Ten rules. Five wrong-answer patterns.</p></div><div><b>Real applications</b><p>Connect each idea to this app's code.</p></div></div>
   <div class="prodmap">${bridge.map(b=>`<div class="pm" style="--c:var(--d${b[0]})"><span class="domain-seal" aria-hidden="true">${b[0]}</span><div class="domain-name"><span class="pd">Domain ${b[0]} / ${DOM[b[0]].w}% of exam</span><b>${esc(DOM[b[0]].n)}</b></div><span class="pp">${b[1]}</span><p>${b[2]}</p></div>`).join('')}</div></section>
  <section class="landsec endcta"><h2>Ready when you are.</h2><p>Progress saves in this browser. Pick up where you left off.</p><div class="row">${cta}</div></section><footer class="site-note">Unofficial study tool. Not affiliated with or endorsed by Anthropic.</footer>`;
}
setInterval(()=>{const el=document.getElementById('archtip');if(!el||coach.open||document.hidden)return;tipI=(tipI+1)%ARCH_TIPS.length;el.style.opacity=0;setTimeout(()=>{el.textContent=ARCH_TIPS[tipI];el.style.opacity=1;},250);},9000);
document.addEventListener('keydown',e=>{
  if(view!=='home'||coach.open||e.metaKey||e.ctrlKey||e.altKey||!$('#pal').hidden)return;
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='SELECT'||t.tagName==='TEXTAREA'))return;
  const b=document.querySelector(`.mode[data-mk="${e.key}"]`);if(b){e.preventDefault();b.click();}
});

/* ===================== Archie's guided tour ===================== */
const CODE={
loop:`function coachNext(){            // one turn of the tour loop
  const s=COACH[coach.i];
  if(s.end){ coachClose(); return; }    // stop_reason: the plan says we're done
  if(++coach.turns>MAX_TURNS){ coachClose(); return; } // backstop only
  coach.i++; coachStep();               // otherwise act, then loop
}`,
gate:`// Finishing a mock is two steps: a programmatic gate, not a request
else if(a==='mconfirm'){mock.confirm=true;render();} // shows "Submit for scoring?"
else if(a==='mfinish'){finishMock();}                 // reachable only through the gate`,
brief:`// A subagent gets a complete, scoped brief. Nothing is inherited.
else if(a==='tsdrill'){cfg={d:0,sc:0,ts:d.v,mode:'smart',n:0}; ...}
else if(a==='scdrill'){cfg={d:0,sc:+d.v,ts:'',mode:'smart',n:10}; ...}`,
dispatch:`document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return;}
  const a=e.target.closest('[data-act]');if(!a)return;
  act(a.dataset.act,a.dataset);      // route by one distinct name
});`,
scope:`// A task is selected: show only the actions that fit it
cmds=[{l:'Practice this task',act:'tsdrill'}, {l:'Practice the domain',act:'quick'},
      {l:'Read the lesson',act:'cguide'},     {l:'Flashcards',act:'cdeck'}];`,
mcp:`// If an action here were an MCP tool, a failure would come back as data:
{ "isError": true,
  "content": [{ "type": "text", "text": "No questions match ts=2.6" }],
  "errorCategory": "validation", "isRetryable": false }`,
build:`# build.py: stitch the data files into one page
for f in ['q-s1.js', ..., 'q-fix3.js']:
    data += open(f).read()
out = t.replace(PLACEHOLDER, data)   # one self-contained page

$ python3 build.py && node validate.js && python3 test.py`,
claudemd:`# CLAUDE.md (project level, shared by the team)
- Questions live in q-s*.js; options are authored correct-first
- Never use em dashes in content
- Run validate.js before every build

# .claude/rules/questions.md  (paths: "q-*.js")`,
schema:`{ id:"g-10", sc:3, d:1, ts:"1.1", r:4,
  q:"A teammate wants the agent loop to end by setting maxTurns...",
  o:["Terminate on stop_reason being end_turn...", "...", "...", "..."],
  a:[0], e:"The guide calls out arbitrary iteration caps..." }`,
validate:`// validate.js rejects malformed items before they ship
if(!q.a||!q.a.length||q.a.some(i=>i<0||i>=q.o.length))err.push('bad answer idx');
if(!tsRe.test(q.ts)||+q.ts[0]!==q.d)err.push('ts/domain mismatch');
if(new Set(q.o).size!==q.o.length)err.push('dup options');`,
ready:`// Explicit criteria, not "seems ready":
ready: acc * Math.min(1, seen / Math.max(1, 0.6*qs.length))`,
store:`let store={answers:{},cards:{},rate:{},flags:{},mocks:[],days:[],examDate:'',...};
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}`,
prov:`{ t:'slow, latency, expensive', a:'Parallelize, batch, or cache',
  v:'Careful',   // verdict after checking the official guide
  n:'Split this one. Slow or blocking: parallelize on the synchronous API...' }`
};
const COACH=[
 {ch:'Intro',side:'front',view:'home',hl:'.modes',pose:'cheer',t:'Hi, I am Archie, and I will be your guide.',say:'This app is a working example of the ideas the exam tests. I will show you its front end, which is the part you click, and its back end, which is the code and data underneath. Along the way, I will connect each piece to an exam domain. Use the Next button or your arrow keys to move through the tour.'},
 {ch:'Intro',side:'front',view:'map',hl:'.hud',t:'Your progress bar',say:'The bar at the top shows your points, the tasks you have mastered, the flashcards you have reviewed, your best mock score, and your readiness. The app recalculates every number from your saved progress each time a screen loads. Keep that idea in mind, because it comes back in Domain 5.'},
 {ch:'Domain 1',d:1,side:'front',view:'map',hl:'.mapwrap',t:'The map works like a coordinator agent',say:'Domain 1 covers agentic architecture, and it is 27% of the exam. On this map, you act as the coordinator. Each task is a piece of work, and each practice set you start is like a subagent you send out to do that work. The coordinator decides what to send where and then reviews the results, which is the same hub-and-spoke design you will see in Scenario 3.'},
 {ch:'Domain 1',d:1,side:'back',view:'map',hl:'.cmdcard',t:'Subagents start with a blank slate',say:'When you practice a task, the app does not hand the practice set your whole history. Instead, it builds a complete and focused brief that names this task and this mode. Subagents never inherit the coordinator\'s context, so everything they need has to go in their prompt.',code:'brief'},
 {ch:'Domain 1',d:1,side:'back',view:'map',hl:'#coach .cbox',t:'This tour is an agentic loop',say:'Each time you press Next, I check where we are, take an action, and keep going until the plan says to stop. That is the same idea as stopping when stop_reason is end_turn. I also have a turn limit, but it is only a safety net. The exam treats an arbitrary turn limit as the main way to stop as a mistake.',code:'loop'},
 {ch:'Domain 1',d:1,side:'back',view:'mock',hl:'.panel',pose:'fight',t:'Rules that must always hold belong in code',say:'You cannot submit a mock exam by accident, because finishing requires a confirmation step that the code enforces. On the exam, when something must always happen, such as verifying identity before a refund, choose a programmatic gate or hook over a more strongly worded prompt.',code:'gate'},
 {ch:'Domain 2',d:2,side:'back',view:'map',hl:'.cmdcard',t:'Every button works like a named tool',say:'Domain 2 covers tool design and MCP, and it is 18% of the exam. Every button here has one distinct action name, and a single dispatcher routes each click by that name. Models choose tools the same way, by reading names and descriptions. When descriptions are vague or overlap, the model picks the wrong tool, so rewriting them is usually the cheapest first fix.',code:'dispatch'},
 {ch:'Domain 2',d:2,side:'front',view:'map',csel:'ts:1.1',hl:'.cmdcard',t:'Give each agent only the tools it needs',say:'When you select a task, the actions panel shows only the four actions that make sense for it. That is tool scoping. Give each agent the handful of tools its role needs, usually four or five, rather than every tool you have, because accuracy drops as the number of choices grows.',code:'scope'},
 {ch:'Domain 2',d:2,side:'back',view:'map',csel:'',hl:'',t:'Errors should come back as data',say:'If these actions were MCP tools, a failure would come back as structured content. It would include isError, a category, and whether a retry could help. That lets the agent recover or escalate. An empty result is not an error, and a failure that is silently hidden is the worst outcome of all.',code:'mcp'},
 {ch:'Domain 3',d:3,side:'back',view:'library',sub:{library:'plan'},hl:'',t:'How this app was built',say:'Domain 3 covers Claude Code configuration, and it is 20% of the exam. This app was built with Claude Code. A build script combines the data files into one page, a validator checks every question, and a browser test clicks through every screen. In a CI pipeline, you would run the same steps with claude -p and structured output.',code:'build'},
 {ch:'Domain 3',d:3,side:'back',view:'library',sub:{library:'plan'},hl:'',t:'Where team conventions belong',say:'Conventions the whole team shares belong in the project-level CLAUDE.md, and your personal preferences belong in your user-level file. For conventions that apply to files spread across the repo, such as every question file, a path-scoped rule with a glob pattern works better than a CLAUDE.md in each directory.',code:'claudemd'},
 {ch:'Domain 3',d:3,side:'front',view:'guide',sub:{guide:'walk',glevel:3},hl:'.chap',t:'Each lesson works like a skill',say:'Each lesson holds knowledge you open only when you need it, much like a skill that loads on demand. A skill with context: fork runs in isolation, so its long output never clutters the main conversation. The allowed-tools setting controls which tools the skill may use. Those are two separate settings that solve two separate problems.'},
 {ch:'Domain 4',d:4,side:'back',view:'practice',sub:{practice:'q'},hl:'',t:'Every question is structured data',say:'Domain 4 covers prompt engineering and structured output, and it is 20% of the exam. Every question in this app follows one schema, and the validator rejects any question that breaks it. That is the same idea as forcing tool_use with a JSON schema. A schema guarantees the shape of the output, but it cannot guarantee that the content is true.',code:'schema'},
 {ch:'Domain 4',d:4,side:'back',view:'practice',sub:{practice:'q'},hl:'',t:'Validate first, then retry with feedback',say:'Validation catches format and placement errors, and a retry that includes the specific error usually fixes them. If the value is not in the source at all, though, no retry can create it. In that case, allow a null value and flag the record for review. Always ask yourself whether the answer actually exists in the input.',code:'validate'},
 {ch:'Domain 4',d:4,side:'front',view:'map',hl:'.hud',t:'Explicit criteria beat vague instructions',say:'Your readiness score is not a guess. It is your accuracy on your latest answers, discounted until you have seen 60% of a domain\'s questions. When a reviewer gives inconsistent results, as in Scenario 5, the fix works the same way: spell out the criteria and add two to four examples, rather than adding a stricter schema.',code:'ready'},
 {ch:'Domain 5',d:5,side:'back',view:'map',hl:'.hud',t:'Your progress is a case-facts block',say:'Domain 5 covers context management and reliability, and it is 15% of the exam. Your progress lives in a structured object saved in this browser, never in a summary. That is the case-facts pattern. Exact values are kept outside the conversation, so nothing gets blurred when older history is summarized.',code:'store'},
 {ch:'Domain 5',d:5,side:'front',view:'guide',sub:{guide:'trig'},hl:'.trig',t:'Keep track of where each claim came from',say:'Each trigger-word row carries a verdict from checking it against the official exam guide, so you can see where every claim came from. When an agent combines research from several sources, it should keep each claim paired with its source and date. When sources disagree, it should show both rather than quietly picking one.',code:'prov'},
 {ch:'Domain 5',d:5,side:'front',view:'map',hl:'.quests',t:'Be calibrated, not overconfident',say:'Your readiness score stays low until you have seen enough questions, so it does not overstate how ready you are. Hold agents to the same standard. Do not trust a model\'s own confidence score. Check it against labeled examples, and send uncertain or high-stakes cases to a person.'},
 {ch:'Wrap-up',side:'front',view:'map',hl:'.cmdcard',pose:'cheer',end:1,t:'That is the end of the tour',say:'We covered the front end, the back end, and all five exam domains. You can click me in the sidebar or in the corner at any time, and I will pick up where you left off. My advice is to start the recommended practice now, while all of this is fresh.'}
];
const MAX_TURNS=60;
let coach={open:false,i:0,turns:0};
const coachEl=document.createElement('div');coachEl.id='coach';coachEl.hidden=true;document.body.appendChild(coachEl);
const ringEl=document.createElement('div');ringEl.id='cring';ringEl.hidden=true;document.body.appendChild(ringEl);
/* ===================== Archie's dock, hints, and the mobile menu ===================== */
let mnavOpen=true,mnavT=null,lastView=null;
const fairyEl=document.createElement('div');fairyEl.id='fairy';fairyEl.className='docked';
fairyEl.innerHTML=`<button class="fbody" aria-label="Archie, your guide. Click to start the guided tour.">${spr('idle')}</button><div class="fbub" role="status" aria-live="polite" hidden></div>`;
document.body.appendChild(fairyEl);
const mbubEl=document.createElement('div');mbubEl.id='mbub';mbubEl.setAttribute('role','status');mbubEl.setAttribute('aria-live','polite');mbubEl.hidden=true;document.body.appendChild(mbubEl);
const isMobile=()=>window.matchMedia('(max-width: 860px)').matches;
fairyEl.querySelector('.fbody').addEventListener('click',()=>{hideHint();coachOpen();});
function placeFairy(){
  if(isMobile()||fairyEl.hidden)return;
  let x,y;
  if(fairyEl.classList.contains('hover')){x=window.innerWidth-118;y=98;}
  else{const d=document.querySelector('.rail .dock');if(!d)return;const r=d.getBoundingClientRect();x=r.left;y=r.top;}
  fairyEl.style.left=x+'px';fairyEl.style.top=y+'px';
}
function syncFairy(){fairyEl.hidden=coach.open;if(coach.open)hideHint();else placeFairy();}
window.addEventListener('resize',()=>{placeFairy();});

const HFACT=[
 'Anthropic was founded in 2021 as an AI safety and research company, and Claude is its family of AI models.',
 'Constitutional AI is a training method Anthropic developed. The model learns to critique and revise its own answers against a written set of principles.',
 'The transformer architecture behind today\'s large language models was introduced in the 2017 paper "Attention Is All You Need."',
 'Large language models read and write text as tokens, which are chunks of a few characters. Every model has a limit on how many tokens fit in its context window.',
 'Without tools or retrieval, a language model answers only from what it learned in training. Tools and retrieval let it work with fresh or private information.',
 'Lower temperature settings make a model\'s answers more consistent, which helps for classification and data extraction.',
 'Extended thinking lets Claude work through a hard problem step by step before it gives a final answer.',
 'Claude Code is Anthropic\'s agentic coding tool. It reads your codebase, edits files, and runs commands from your terminal.',
 'Prompt caching lets the Claude API reuse a long prompt prefix that does not change, which cuts cost and latency on repeated calls.',
 'Language models can sound confident when they are wrong. That is why high-stakes systems pair them with validation, human review, or both.'];
const HDOM={
 1:['An agent loop keeps calling the model until stop_reason is end_turn. When stop_reason is tool_use, your code runs the tool and sends back a tool_result.',
    'Subagents in Claude Code each run in their own context window, which keeps the main conversation focused on the big picture.',
    'Hooks in Claude Code run your own commands at set points, such as before a tool call, so a rule holds every single time.'],
 2:['MCP, the Model Context Protocol, is an open standard Anthropic introduced in late 2024 for connecting AI applications to tools and data.',
    'An MCP server can offer tools, resources, and prompts. Tools are actions the model can take, and resources are data it can read.',
    'Claude chooses tools largely from their names and descriptions, so a clearer description is often the cheapest fix for a misrouted call.'],
 3:['CLAUDE.md gives Claude Code standing instructions for a project. A project-level file is shared through version control, so the whole team gets it.',
    'Running claude -p uses Claude Code without the interactive interface, which is how teams run it inside CI pipelines.',
    'Plan mode lets Claude Code explore a codebase and propose a plan before it changes any files.'],
 4:['Forcing tool use with a JSON schema guarantees the shape of the output, but the values inside it can still be wrong.',
    'The Message Batches API costs half as much as standard calls and returns results within 24 hours, so it suits work nobody is waiting on.',
    'Anthropic\'s prompting guides recommend XML tags to keep instructions, context, and examples clearly separated.'],
 5:['Summaries save context but lose exact numbers and dates, so keep key facts in a separate structured block that is never summarized.',
    'When several sources disagree, a reliable system shows the conflict with each source attributed instead of quietly picking one number.',
    'A model\'s own confidence score is not a reliable signal. Calibrate against labeled examples and send uncertain cases to a person.']};
const HVIEW={
 home:['Press a number key from 1 to 6 to open a study mode without reaching for the mouse.','If you are new, the tour takes about ten minutes and shows how all five domains apply to real code.','Short daily sessions beat one long cram. Even ten questions a day adds up over four weeks.'],
 map:['Markers turn blue at 80% accuracy on your latest answers. Click a red marker to see exactly what needs work.','Domain 1 is 27% of the exam, so its seven tasks are the best place to spend extra time.','The castles are the six exam scenarios. Four of them will appear on your real exam, chosen at random.'],
 practice:['Read the last sentence of a question first. It tells you what kind of decision you are being asked to make.','When two answers both sound right, look for the one that fixes the root cause with the least new machinery.','Many wrong answers rely on stronger prompt wording when the scenario actually needs a guarantee in code.'],
 cards:['Spaced repetition shows a card again just before you would forget it, so each review counts for more.','Say your answer out loud before you flip the card. Committing to an answer first improves recall.'],
 mock:['The real exam gives you about two minutes per question. If a question takes longer, flag it and move on.','Your scaled score here is an estimate. Aim for 80% on mocks so you have a cushion on exam day.'],
 guide:['Each lesson ends with a practice set. Answering questions right after reading helps the ideas stick.','The trigger words tab maps common phrases in questions to the answer pattern they usually point to.'],
 library:['The ten decision rules cover most of the exam. When you miss a question, find the rule it was testing.','The study plan spreads the work over four weeks. Check off each item as you go to see your progress.']};
const HDRILL={tell:'Spot the tell trains you to link a phrase in a question to one of the ten decision rules.',shape:'Most wrong answers fall into five shapes. Naming the shape lets you rule an option out quickly.',axis:'Pick the axis asks which dimension a mechanism controls. For example, tool_choice controls whether a tool gets called, not what happens after it runs.'};
let lastClick=null,hintSeen=[],hintCool=0,hintHideT=null,hintPend=null,hintsOn=store.hints!==false;
const HTRIG=new Set(['csel','gtab','ltab','ptab','glevel','deck','tsdrill','scdrill','quick','opendrill','cguide','cdeck','clib','flip']);
document.addEventListener('click',e=>{const t=e.target.closest('[data-act],[data-go]');if(!t||t.closest('#fairy,#mbub,#coach,#pal'))return;
  lastClick={act:t.dataset.act||'go',v:t.dataset.v||t.dataset.k||t.dataset.go||'',d:t.dataset.d||'',at:Date.now()};
  if(HTRIG.has(lastClick.act))queueHint(1200);},true);
function hintPool(){
  const ctx=[];let d=0;
  if(view==='map'&&csel){const [k,id]=csel.split(':');
    if(k==='ts')d=+id[0];
    if(k==='boss'){const S=SC[+id];let tr=S.traps.trim();if(!/[.]$/.test(tr))tr+='.';ctx.push({k:'Tip',t:`Scenario ${id} covers a ${S.n.toLowerCase()}. Watch for these traps: ${tr}`});}
    if(k==='creep'){const b=BEASTS[+id];ctx.push({k:'Tip',t:`${b.name}: ${b.counter}`});}}
  if(view==='guide'&&sub.guide==='walk')d=sub.glevel||0;
  if(view==='practice'&&sub.practice==='q'&&sess&&sess.items[sess.i]){const q=byId[sess.items[sess.i].id];if(q)d=q.d;}
  if(!d&&lastClick&&Date.now()-lastClick.at<60000&&+lastClick.d)d=+lastClick.d;
  if(d&&HDOM[d])HDOM[d].forEach(t=>ctx.push({k:`Domain ${d} fact`,t}));
  if(view==='practice'&&HDRILL[sub.practice])ctx.push({k:'Tip',t:HDRILL[sub.practice]});
  (HVIEW[view]||[]).forEach(t=>ctx.push({k:'Tip',t}));
  return {ctx,gen:HFACT.map(t=>({k:'Fact',t}))};
}
function pickHint(){
  const {ctx,gen}=hintPool();const fresh=a=>a.filter(h=>!hintSeen.includes(h.t));
  let pool=fresh(ctx);if(!pool.length||Math.random()<0.3)pool=fresh(gen).length?fresh(gen):pool;
  if(!pool.length){hintSeen=[];pool=ctx.length?ctx:gen;}
  const h=pool[Math.floor(Math.random()*pool.length)];hintSeen.push(h.t);if(hintSeen.length>40)hintSeen.shift();return h;
}
function hintsBlocked(){return !hintsOn||coach.open||document.hidden||(view==='mock'&&mock&&!mock.done)||!$('#pal').hidden;}
function queueHint(ms){clearTimeout(hintPend);hintPend=setTimeout(()=>showHint(false),ms);}
function hintHtml(h){return `<div class="fhd"><b>Archie</b><span class="fk">${esc(h.k)}</span></div><p>${esc(h.t)}</p><div class="fbt"><button type="button" data-h="more">Another one</button><button type="button" data-h="off">Turn off hints</button><button type="button" data-h="close">Close</button></div>`;}
function showHint(force){
  if(hintsBlocked()&&!(force&&hintsOn&&!coach.open))return;
  if(!force&&Date.now()<hintCool)return;
  const h=pickHint();hintCool=Date.now()+20000;clearTimeout(hintHideT);
  if(isMobile()){mbubEl.innerHTML=hintHtml(h);mbubEl.hidden=false;}
  else{const b=fairyEl.querySelector('.fbub');b.hidden=true;b.innerHTML=hintHtml(h);fairyEl.classList.remove('docked');fairyEl.classList.add('hover');placeFairy();
    setTimeout(()=>{if(fairyEl.classList.contains('hover'))b.hidden=false;},reduceMo()?0:700);}
  hintHideT=setTimeout(hideHint,10000);
}
function hideHint(){clearTimeout(hintHideT);mbubEl.hidden=true;const b=fairyEl.querySelector('.fbub');if(b)b.hidden=true;
  if(fairyEl.classList.contains('hover')){fairyEl.classList.remove('hover');fairyEl.classList.add('docked');placeFairy();}}
const reduceMo=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function hintBtn(e){const b=e.target.closest('[data-h]');if(!b)return;const k=b.dataset.h;
  if(k==='more')showHint(true);else if(k==='off'){hintsOn=false;store.hints=false;save();hideHint();}else hideHint();}
fairyEl.addEventListener('click',hintBtn);mbubEl.addEventListener('click',hintBtn);
[fairyEl,mbubEl].forEach(el=>{el.addEventListener('mouseenter',()=>clearTimeout(hintHideT));el.addEventListener('mouseleave',()=>{if(!mbubEl.hidden||fairyEl.classList.contains('hover'))hintHideT=setTimeout(hideHint,5000);});});
function setMnav(open){mnavOpen=open;const n=document.querySelector('.mnav');if(!n)return;n.classList.toggle('open',open);
  const t=n.querySelector('.mnav-tog');t.setAttribute('aria-expanded',String(open));t.setAttribute('aria-label',(open?'Collapse':'Expand')+' the menu');
  const l=n.querySelector('.mnav-links');if(open)l.removeAttribute('inert');else l.setAttribute('inert','');}
function peekMnav(ms){clearTimeout(mnavT);setMnav(true);mnavT=setTimeout(()=>setMnav(false),ms||3500);}
function mnavHtml(){return `<nav class="mnav ${mnavOpen?'open':''}" aria-label="Sections"><button class="mnav-archie" data-act="coach" aria-label="Open Archie, your guide">${spr('idle')}</button><div class="mnav-links" id="mnavlinks" ${mnavOpen?'':'inert'}>${NAV.map(n=>navBtn(n)).join('')}</div><button class="mnav-tog" data-act="mnavtog" aria-controls="mnavlinks" aria-expanded="${mnavOpen}" aria-label="${mnavOpen?'Collapse':'Expand'} the menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></nav>`;}
function afterRender(){
  syncFairy();
  applyMotionPreferences();
  if(view!==lastView){const first=lastView===null;lastView=view;hideHint();if(isMobile())peekMnav(first?4000:3000);queueHint(first?2600:1600);}
}
function applyMotionPreferences(){
  document.querySelectorAll('svg').forEach(svg=>{if(typeof svg.pauseAnimations==='function'){if(reduceMo())svg.pauseAnimations();else svg.unpauseAnimations();}});
}
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',applyMotionPreferences);
function coachOpen(i){coach.open=true;coach.turns=0;if(typeof i==='number')coach.i=i;hideHint();syncFairy();coachStep();}
function coachClose(){coach.open=false;coachEl.hidden=true;ringEl.hidden=true;syncFairy();if(coach.i>=COACH.length-1)coach.i=0;}
function coachNext(){            // one turn of the tour loop
  const s=COACH[coach.i];
  if(s.end){ coachClose(); return; }    // stop_reason: the plan says we're done
  if(++coach.turns>MAX_TURNS){ coachClose(); return; } // backstop only
  coach.i++; coachStep();               // otherwise act, then loop
}
function coachBack(){if(coach.i>0){coach.i--;coachStep();}}
function coachStep(){
  const st=COACH[coach.i];
  if(st.sub)Object.assign(sub,st.sub);
  if('csel' in st)csel=st.csel||null;
  if(st.view&&view!==st.view){if(view==='mock'&&mock&&!mock.done&&st.view!=='mock'){}view=st.view;store.view=view;save();enterNext=true;}
  render();
  const chs=[];COACH.forEach((s,i)=>{if(!chs.find(c=>c.ch===s.ch))chs.push({ch:s.ch,i});});
  const cur=chs.filter(c=>c.i<=coach.i).pop();
  coachEl.innerHTML=`<div class="cbox" role="dialog" aria-label="Archie, your guide"><div class="cfairy">${spr(st.pose||(st.side==='back'?'idle':'idle'))}</div><div class="cmain">
   <div class="chead"><span class="cname">Archie</span><span class="cchip ${st.side}">${st.side==='back'?'Back end':'Front end'}</span>${st.d?`<span class="cchip front" style="color:var(--d${st.d});border-color:var(--d${st.d})">Domain ${st.d}, ${DOM[st.d].w}% of the exam</span>`:''}<span class="cstep">Step ${coach.i+1} of ${COACH.length}</span></div>
   <h3>${esc(st.t)}</h3><p>${fmt(st.say)}</p>${st.code?`<pre class="ccode"><code>${esc(CODE[st.code])}</code></pre>`:''}
   <div class="cbtns"><button class="btn ghost" data-act="cback" ${coach.i?'':'disabled'}>Back</button><button class="btn primary" data-act="cnext">${st.end?'Finish':'Next'}</button>${st.d?`<button class="btn" data-act="cdrill" data-v="${st.d}">Drill Domain ${st.d}</button>`:st.end?`<button class="btn" data-act="cdrill" data-v="${bestDom()}">Run the recommended drill</button>`:''}<span class="sp"></span><button class="btn ghost" data-act="cclose">Close</button></div>
   <div class="cdots" role="group" aria-label="Chapters">${chs.map(c=>`<button data-act="cjump" data-v="${c.i}" ${cur&&cur.ch===c.ch?'aria-current="true"':''}>${c.ch}</button>`).join('')}</div></div></div>`;
  coachEl.hidden=false;
  requestAnimationFrame(()=>coachFocus(true));
}
function coachFocus(scroll){
  const st=COACH[coach.i];if(!coach.open)return;
  const el=st.hl?document.querySelector(st.hl):null;
  if(!el){ringEl.hidden=true;if(scroll&&st.view)window.scrollTo(0,0);return;}
  if(scroll&&!el.closest('#coach')){const r=el.getBoundingClientRect();const room=window.innerHeight-(coachEl.querySelector('.cbox')?.offsetHeight||0)-24;
    const top=window.scrollY+r.top-Math.max(12,Math.min(80,(room-r.height)/2));window.scrollTo(0,Math.max(0,top));}
  const r=el.getBoundingClientRect();
  Object.assign(ringEl.style,{top:(r.top-6)+'px',left:(r.left-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px'});ringEl.hidden=false;
}
window.addEventListener('scroll',()=>{if(coach.open)coachFocus(false);},{passive:true});
window.addEventListener('resize',()=>{if(coach.open)coachFocus(false);});
function extAct(a,d){
  if(a==='mnavtog'){if(mnavOpen){clearTimeout(mnavT);setMnav(false);}else peekMnav(6000);return true;}
  if(a==='ptab'&&(d.v==='cards'||d.v==='mock')){go(d.v);return true;}
  if(a==='ptab'&&view!=='practice'){sub.practice=d.v;dr=null;go('practice');return true;}
  if(a==='gtab'&&view!=='guide'){sub.guide=d.v;go('guide');return true;}
  if(a==='ltab'&&view!=='library'){sub.library=d.v;go('library');return true;}
  if(a==='csel'){csel=d.k||null;render();return true;}
  if(a==='coach'){coachOpen();return true;}
  if(a==='cnext'){coachNext();return true;}
  if(a==='cback'){coachBack();return true;}
  if(a==='cclose'){coachClose();return true;}
  if(a==='cjump'){coach.i=+d.v;coachStep();return true;}
  if(a==='cdrill'){coachClose();act('quick',{d:String(d.v||0)});return true;}
  if(a==='cguide'){openGuide('walk',+d.v);return true;}
  if(a==='cdeck'){cardCfg.d=+d.v;cardQ=null;flipped=false;go('cards');return true;}
  if(a==='clib'){sub.library=d.v;go('library');return true;}
  if(a==='cgo'){go(d.v);return true;}
  return false;
}
document.addEventListener('keydown',e=>{
  if(coach.open){
    if(e.key==='Escape'){coachClose();e.preventDefault();e.stopPropagation();return;}
    const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='SELECT'||t.tagName==='TEXTAREA'))return;
    if(e.key==='ArrowRight'){coachNext();e.preventDefault();e.stopPropagation();return;}
    if(e.key==='ArrowLeft'){coachBack();e.preventDefault();e.stopPropagation();return;}
    return;
  }
  if(view!=='map'||e.metaKey||e.ctrlKey||e.altKey||!$('#pal').hidden)return;
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='SELECT'||t.tagName==='TEXTAREA'))return;
  if(e.key==='Escape'&&csel){csel=null;render();return;}
  if(/^[a-z]$/i.test(e.key)){const b=document.querySelector(`.cmd[data-hk="${e.key.toUpperCase()}"]`);if(b){e.preventDefault();e.stopPropagation();b.click();}}
},true);
