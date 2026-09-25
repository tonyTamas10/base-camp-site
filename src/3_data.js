<script>
(()=>{
'use strict';
/* ================= utilities ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=RM.matches; root.classList.toggle('rm',reduced);
RM.addEventListener&&RM.addEventListener('change',e=>{reduced=e.matches;root.classList.toggle('rm',reduced);BG.kick()});
const isMobile=()=>innerWidth<900;
const pad=n=>String(n).padStart(2,'0');
const mod=(a,n)=>((a%n)+n)%n;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=typeof seed==='string'?hash(seed):seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const shuffle=(r,a)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt=d=>`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtShort=d=>`${d.getDate()} ${MONTHS[d.getMonth()]}`;
const TODAY=new Date(2026,8,24);

/* ================= data (ALL PLACEHOLDER) ================= */
const YEARS=[2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
const SPORTS=[
  {id:'minifootball',name:'Minifootball',code:'mf',kind:'team',squad:8,geo:'mini',unit:'goals'},
  {id:'football',name:'Football',code:'fb',kind:'team',squad:14,geo:'pitch',unit:'goals'},
  {id:'athletics',name:'Athletics',code:'at',kind:'track',geo:'oval',unit:'s'},
  {id:'sprints',name:'Sprints',code:'sp',kind:'track',geo:'lanes',unit:'s'},
];
const SPORT=Object.fromEntries(SPORTS.map(s=>[s.id,s]));
const COUNTS={minifootball:[2,3,4,1,3,5,6,6,7,5],football:[1,1,2,0,1,2,2,3,3,2],athletics:[0,0,1,0,1,1,2,2,3,2],sprints:[0,1,1,0,1,2,2,3,4,3]};
const NAMES={minifootball:['Student Cup','Campus 5s','Night League','Spring Open','Faculty Derby','Winter Indoor Cup','Community 6s'],
  football:['Weekend League','Autumn Open','Amateur 11s','Base Camp Classic'],
  athletics:['Open Track Day','Relay Weekend','Field & Track Meet','Masters Mile'],
  sprints:['Night Sprint','60m Challenge','Straight Line Series','100m Open','Flying 30s']};
const PLACES=['Mărăști','Gheorgheni','Zorilor','Mănăștur','Grigorescu','Centru','Bună Ziua','Iris'];
const ACCENTS=['#FF5B1A','#FFB23F','#C3CFFF','#7FE3C4','#FF6F91'];
const TEAMPOOL=['Lane Six','Someș United','Cetățuia 5','Hoia Runners','Iris Collective','Mărăști Night','Campus Blue','Feleac Athletic','Nord Stars','Turzii Kickers','Grădini FC','Pasaj 7'];
const FIRST=['Andrei','Ioana','Mihai','Ștefan','Radu','Alexandra','Bogdan','Tudor','Maria','Vlad','Elena','Cristian','Ana','Dragoș','Irina','Paul','Sorin','Bianca','Luca','Teodora','Matei','Diana','Horia','Oana','Răzvan','Ilinca'];
const LASTI='ABCDFGHIMNOPRSȘTȚVZ';
const SHOWCASE='mf-2025-1';

const CREST=[['#FF5B1A','#050A2C'],['#F7F7F2','#1C2E9E'],['#C3CFFF','#050A2C'],['#050A2C','#FF5B1A'],['#FFB23F','#050A2C'],['#7FE3C4','#050A2C'],['#1C2E9E','#F7F7F2'],['#FF6F91','#050A2C']];
const EVENTS=[];
SPORTS.forEach(sp=>{
  YEARS.forEach((y,yi)=>{
    const n=COUNTS[sp.id][yi];
    for(let i=0;i<n;i++){
      const id=`${sp.code}-${y}-${i+1}`, r=rng(id);
      const names=NAMES[sp.id];
      let name=names[(i*3+y)%names.length];
      const month=clamp(Math.floor((i+r())*12/n),0,11);
      let date=new Date(y,month,1+Math.floor(r()*27));
      if(id===SHOWCASE){name='Autumn Student Cup';date=new Date(2025,9,18)}
      EVENTS.push({id,sport:sp.id,sp,year:y,name,date,place:pick(r,PLACES),accent:pick(r,ACCENTS)});
    }
  });
});
// make one minifootball event "this week" for the prototype's current-state demo
(()=>{const up=EVENTS.filter(e=>e.sport==='minifootball'&&e.year===2026&&e.date>TODAY).sort((a,b)=>a.date-b.date)[0];if(up){up.date=new Date(2026,8,27);up.name='Student Cup'}})();
EVENTS.forEach(e=>{
  const diff=(e.date-TODAY)/864e5;
  e.status=diff<0?'past':diff<=7?'week':'upcoming';
  e.location=`Cluj-Napoca · ${e.place}`;
  e.participants=details(e).participants;
});
EVENTS.sort((a,b)=>a.date-b.date);
const byId=Object.fromEntries(EVENTS.map(e=>[e.id,e]));
const STATUS_LABEL={past:'Past',week:'This week',upcoming:'Upcoming'};

function personName(r){return `${pick(r,FIRST)} ${LASTI[Math.floor(r()*LASTI.length)]}.`}
function goals(r,l){return Math.min(9,Math.floor(-Math.log(1-r()*.97)*l))}

function details(ev){
  if(ev._d) return ev._d;
  const r=rng('d-'+ev.id), sp=ev.sp;
  let d;
  if(sp.kind==='team'){
    const names=shuffle(r,TEAMPOOL).slice(0,8);
    const teams=names.map((n,k)=>({name:n,code:n.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase(),col:CREST[k],players:Array.from({length:sp.squad},()=>({name:personName(r),g:0}))}));
    const lam=sp.id==='minifootball'?2.1:1.3;
    const pairs=[[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
    const matches=[];
    ['A','B'].forEach((g,gi)=>{
      const gt=teams.slice(gi*4,gi*4+4);
      pairs.forEach((p,k)=>matches.push({stage:`Group ${g}`,round:Math.floor(k/2)+1,a:gt[p[0]],b:gt[p[1]],ga:goals(r,lam),gb:goals(r,lam),group:g}));
    });
    const table=g=>{
      const gt=teams.filter((t,k)=>(g==='A'?k<4:k>=4)).map(t=>({t,P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0}));
      const f=t=>gt.find(x=>x.t===t);
      matches.filter(m=>m.group===g).forEach(m=>{const A=f(m.a),B=f(m.b);A.P++;B.P++;A.GF+=m.ga;A.GA+=m.gb;B.GF+=m.gb;B.GA+=m.ga;
        if(m.ga>m.gb){A.W++;B.L++;A.Pts+=3}else if(m.ga<m.gb){B.W++;A.L++;B.Pts+=3}else{A.D++;B.D++;A.Pts++;B.Pts++}});
      return gt.sort((x,y)=>y.Pts-x.Pts||(y.GF-y.GA)-(x.GF-x.GA)||y.GF-x.GF);
    };
    const tA=table('A'),tB=table('B');
    const ko=(stage,a,b)=>{let ga=goals(r,lam),gb=goals(r,lam),pens=null;if(ga===gb){pens=r()<.5?'a':'b'}const w=ga>gb||pens==='a'?a:b;const m={stage,a,b,ga,gb,pens,w,l:w===a?b:a};matches.push(m);return m};
    const s1=ko('Semi-final',tA[0].t,tB[1].t), s2=ko('Semi-final',tB[0].t,tA[1].t);
    const third=ko('3rd place',s1.l,s2.l), fin=ko('Final',s1.w,s2.w);
    matches.forEach(m=>{for(let k=0;k<m.ga;k++)pick(r,m.a.players).g++;for(let k=0;k<m.gb;k++)pick(r,m.b.players).g++;});
    const scorers=teams.flatMap(t=>t.players.map(p=>({...p,team:t}))).sort((a,b)=>b.g-a.g).slice(0,6);
    const total=matches.reduce((s,m)=>s+m.ga+m.gb,0);
    const d2=new Date(ev.date);d2.setDate(d2.getDate()+1);
    d={kind:'team',teams,matches,tA,tB,s1,s2,third,fin,scorers,total,participants:teams.length*sp.squad,
      schedule:[{day:ev.date,title:'Group stage',slots:[['10:00','Round 1','Groups A & B · 4 matches'],['11:30','Round 2','Groups A & B · 4 matches'],['13:00','Round 3','Groups A & B · 4 matches']]},
                {day:d2,title:'Knockouts',slots:[['10:00','Semi-finals','2 matches'],['12:00','3rd place','1 match'],['13:30','Final','1 match · awards after']]}]};
  } else {
    const dist=sp.id==='sprints'?pick(r,['60m','100m']):pick(r,['100m','200m','400m']);
    const base={'60m':7.1,'100m':11.3,'200m':23.2,'400m':52.5}[dist];
    const clubs=['Unattached',...TEAMPOOL.slice(0,6)];
    const nh=3+Math.floor(r()*4);
    const heats=[];let all=[];
    for(let h=0;h<nh;h++){
      const lanes=[];
      for(let l=1;l<=8;l++){
        if(r()<.12){lanes.push({lane:l,empty:true});continue}
        const a={lane:l,name:personName(r),club:pick(r,clubs),time:+(base*(1+r()*.26+r()*.08)).toFixed(2),heat:h+1};
        lanes.push(a);all.push(a);
      }
      const best=Math.min(...lanes.filter(x=>!x.empty).map(x=>x.time));
      lanes.forEach(x=>{if(!x.empty&&x.time===best)x.first=true});
      heats.push({n:h+1,time:`${10+Math.floor(h*20/60)}:${pad((h*20)%60)}`,lanes,best});
    }
    all.sort((a,b)=>a.time-b.time);
    const gaps=heats.map(h=>{const t=h.lanes.filter(x=>!x.empty).map(x=>x.time).sort((a,b)=>a-b);return {h:h.n,gap:+(t[1]-t[0]).toFixed(2)}}).sort((a,b)=>a.gap-b.gap);
    const lastH=heats[heats.length-1].time.split(':').map(Number);
    const ft=`${lastH[0]+1}:${pad(lastH[1])}`;
    d={kind:'track',dist,base,heats,ranking:all.slice(0,10),fastest:all[0],closest:gaps[0],participants:all.length,
      schedule:[{day:ev.date,title:`${dist} programme`,slots:[...heats.map(h=>[h.time,`Heat ${h.n}`,`${h.lanes.filter(x=>!x.empty).length} athletes`]),[ft,'Final','Fastest 8 across heats']]}]};
  }
  ev._d=d;return d;
}

/* ================= posters (procedural placeholder art) ================= */
const PBG=[['#050A2C','#F7F7F2'],['#FF5B1A','#050A2C'],['#F7F7F2','#050A2C'],['#16248A','#F7F7F2'],['#C3CFFF','#050A2C']];
function posterSVG(ev,uid){
  const r=rng('p'+ev.id),[bg,fg]=pick(r,PBG);
  let acc=ev.accent; if(acc.toLowerCase()===bg.toLowerCase()||(bg==='#FF5B1A'&&acc==='#FF6F91')) acc=bg==='#FF5B1A'?'#F7F7F2':'#FF5B1A';
  if(bg==='#F7F7F2'&&(acc==='#C3CFFF'||acc==='#7FE3C4'))acc='#FF5B1A';
  const rot=(r()*16-8).toFixed(1);
  let geo='';
  const so=`stroke="${fg}" fill="none"`;
  switch(ev.sp?ev.sp.geo:'none'){
    case 'mini': geo=`<g transform="rotate(${rot} 150 210)" ${so} stroke-width="2" opacity=".55"><rect x="20" y="30" width="260" height="380" rx="6"/><line x1="20" y1="220" x2="280" y2="220"/><circle cx="150" cy="220" r="46"/><rect x="85" y="30" width="130" height="60"/><rect x="85" y="350" width="130" height="60"/><circle cx="150" cy="220" r="3" fill="${fg}"/></g>`;break;
    case 'pitch': geo=`<g transform="rotate(${rot} 150 210) scale(1.35) translate(-40 -60)" ${so} stroke-width="1.6" opacity=".5"><rect x="10" y="20" width="280" height="420"/><line x1="10" y1="230" x2="290" y2="230"/><circle cx="150" cy="230" r="54"/><rect x="60" y="20" width="180" height="80"/><rect x="110" y="20" width="80" height="30"/><path d="M110 100 A40 40 0 0 0 190 100"/></g>`;break;
    case 'oval': {let s='';for(let k=0;k<8;k++){const o=k*13;s+=`<rect x="${120+o}" y="${-60+o}" width="${420-o*2}" height="${520-o*2}" rx="${200-o}"/>`}geo=`<g transform="rotate(${rot} 300 200)" ${so} stroke-width="1.5" opacity=".55">${s}</g>`;break}
    case 'lanes': {let s='';for(let k=0;k<9;k++){s+=`<line x1="${-20+k*42}" y1="-20" x2="${40+k*42}" y2="460"/>`;if(k<8)s+=`<text x="${6+k*42}" y="400" font-size="22" fill="${fg}" stroke="none" style="font-family:var(--f-display);font-weight:800">${k+1}</text>`}
      geo=`<g ${so} stroke-width="1.5" opacity=".55">${s}</g><g opacity=".85">${Array.from({length:14},(_,k)=>`<rect x="${k*22}" y="300" width="11" height="11" fill="${k%2?fg:acc}"/><rect x="${k*22+11}" y="311" width="11" height="11" fill="${k%2?acc:fg}"/>`).join('')}</g>`;break}
    default: geo=`<circle cx="150" cy="200" r="90" ${so} stroke-width="2" stroke-dasharray="6 8" opacity=".6"/><text x="150" y="240" text-anchor="middle" font-size="120" fill="${fg}" opacity=".6" style="font-family:var(--f-display);font-weight:900">?</text>`;
  }
  const shape=r()<.5?`<circle cx="${230+r()*40}" cy="${90+r()*60}" r="${38+r()*30}" fill="${acc}"/>`:`<rect x="-10" y="${150+r()*80}" width="340" height="${18+r()*18}" fill="${acc}" transform="rotate(${-rot*1.5} 150 210)"/>`;
  const words=ev.name.toUpperCase().split(' ');const lines=[];let cur='';
  words.forEach(w=>{if((cur+' '+w).trim().length>11&&cur){lines.push(cur);cur=w}else cur=(cur+' '+w).trim()});if(cur)lines.push(cur);
  const title=lines.map((l,k)=>`<text x="20" y="${58+k*40}" font-size="44" fill="${fg}" style="font-family:var(--f-display);font-weight:900;letter-spacing:.01em">${esc(l)}</text>`).join('');
  const yr=String(ev.year);
  return `<svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="300" height="420" fill="${bg}"/>${geo}${shape}${title}
    <text x="-6" y="432" font-size="150" fill="none" stroke="${fg}" stroke-width="1.6" style="font-family:var(--f-display);font-weight:900">${yr}</text>
  </svg>`;
}

/* ================= partner marks (fictional placeholders) ================= */
const MARKS=[
  {w:40,h:40,svg:c=>`<circle cx="20" cy="20" r="18" fill="none" stroke="${c}" stroke-width="3"/><text x="20" y="28" text-anchor="middle" font-size="22" fill="${c}" style="font-family:var(--f-display);font-weight:900">A</text>`},
  {w:210,h:40,svg:c=>`<text x="0" y="31" font-size="32" textLength="205" lengthAdjust="spacingAndGlyphs" fill="${c}" style="font-family:var(--f-display);font-weight:800;letter-spacing:.06em">PARTNER B</text>`},
  {w:130,h:40,svg:c=>`<rect x="0" y="4" width="32" height="32" fill="${c}"/><text x="40" y="28" font-size="20" textLength="88" lengthAdjust="spacingAndGlyphs" fill="${c}" style="font-family:var(--f-body);font-weight:700">Partner C</text>`},
  {w:60,h:40,svg:c=>`<path d="M4 36 L22 4 L30 4 L12 36Z M26 36 L44 4 L52 4 L34 36Z" fill="${c}"/>`},
  {w:170,h:40,svg:c=>`<path d="M2 34 L18 6 L34 34Z" fill="none" stroke="${c}" stroke-width="3"/><text x="44" y="29" font-size="22" fill="${c}" style="font-family:var(--f-mono);font-weight:500">partner_e</text>`},
  {w:40,h:40,svg:c=>`<path d="M20 2 L37 11 L37 29 L20 38 L3 29 L3 11Z" fill="${c}"/><text x="20" y="27" text-anchor="middle" font-size="18" fill="#1C2E9E" style="font-family:var(--f-display);font-weight:900">F</text>`},
  {w:180,h:40,svg:c=>`<text x="0" y="30" font-size="30" fill="${c}" style="font-family:var(--f-body);font-style:italic;font-weight:400">partner g</text>`},
  {w:90,h:40,svg:c=>`<rect x="0" y="6" width="6" height="28" fill="${c}"/><rect x="10" y="12" width="6" height="22" fill="${c}"/><rect x="20" y="2" width="6" height="32" fill="${c}"/><text x="34" y="30" font-size="24" fill="${c}" style="font-family:var(--f-display);font-weight:800">H/Q</text>`},
];
function markHTML(m,i,color,base=34){
  const aspect=m.w/m.h, h=Math.round(base*Math.pow(aspect,-.32)), w=Math.round(h*aspect);
  return `<span class="pmark" role="img" aria-label="Placeholder partner ${String.fromCharCode(65+i)}"><svg width="${w}" height="${h}" viewBox="0 0 ${m.w} ${m.h}" aria-hidden="true">${m.svg(color)}</svg></span>`;
}
