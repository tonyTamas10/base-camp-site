
/* ================= app state ================= */
const S={route:'home',sport:'all',time:'all',deckOpen:false,listMode:false,ready:false};
function filtered(year){
  return EVENTS.filter(e=>(year==null||e.year===year)&&(S.sport==='all'||e.sport===S.sport)&&(S.route!=='events'||S.time==='all'||e.status===S.time));
}
function countFor(year){ if(S.sport==='future') return 0; return filtered(year).length; }

/* ================= THE LOOP — wide dial, top cap only (canvas + a few labels) ================= */
const PAD=60;    // room above the ring for year labels
const Loop=(()=>{
  const el=$('#loop'), band=$('#dband'), cv=$('#dcanvas'), disc=$('#dialDisc'), labels=$('#dlabels'), live=$('#loopLive');
  const cx2=cv.getContext('2d');
  let pos=8, vel=0, target=null, raf=0, last=0, selI=8, settledI=null, version=0, dragging=false, mc=1;
  const G={cx:innerWidth/2,base:innerHeight,c:innerWidth/2,h:120,sp:150}, GT={...G};
  let R=1000, STEP=6, L=0, T=0, BW=0, BH=0, lcx=0, lcy=0, dpr=1, geoKey='';
  let onSettle=()=>{}, onActivate=()=>{};
  const yearOf=i=>YEARS[mod(i,10)];
  const pool=[];
  for(let k=0;k<16;k++){const d=document.createElement('div');d.className='dl';d.innerHTML='<b class="yr"></b><span class="cnt"></span>';labels.appendChild(d);pool.push({el:d,i:null,v:-1,sel:null,o:-1})}
  const counts=()=>YEARS.map(y=>countFor(y));
  let CN=counts();
  function geometry(){
    R=(G.c*G.c+G.h*G.h)/(2*G.h); STEP=G.sp/R*180/Math.PI;
    const m=isMobile(); L=m?0:236; BW=innerWidth-L; BH=G.h+PAD; T=G.base-BH;
    lcx=G.cx-L; lcy=PAD+R;
    const key=`${L}|${BW}|${BH.toFixed(1)}|${T.toFixed(1)}|${R.toFixed(1)}`;
    if(key===geoKey)return; geoKey=key;
    band.style.width=BW+'px';band.style.height=BH.toFixed(1)+'px';
    band.style.transform=`translate3d(${L}px,${T.toFixed(1)}px,0)`;
    dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.round(BW*dpr),h=Math.round(BH*dpr);
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}
    disc.style.clipPath=`circle(${(R+PAD).toFixed(1)}px at ${lcx.toFixed(1)}px ${lcy.toFixed(1)}px)`;
  }
  const P=(a,r)=>{const t=a*Math.PI/180;return [lcx+r*Math.sin(t),lcy-r*Math.cos(t)]};
  function edge(a){const x=Math.abs(R*Math.sin(a*Math.PI/180));return clamp((1-x/(G.c-40))*3.2,0,1)}
  function draw(){
    const x=cx2, focus=root.classList.contains('loop-focus');
    x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,BW,BH);
    const half=Math.asin(Math.min(1,(BW)/R))*180/Math.PI+2;
    const a0=(-90-half)*Math.PI/180,a1=(-90+half)*Math.PI/180;
    // ring + track lanes
    [[0,focus?.85:.5,1.5],[13,.2,1],[26,.13,1],[39,.08,1]].forEach(([d,al,lw])=>{x.beginPath();x.arc(lcx,lcy,R-d,a0,a1);x.strokeStyle=`rgba(247,247,242,${al})`;x.lineWidth=lw;x.stroke()});
    // ticks
    const span=Math.ceil(half/STEP)+1, sel=Math.round(pos);
    x.lineCap='round';
    for(let i=Math.floor(pos)-span;i<=Math.ceil(pos)+span;i++){
      const a=(i-pos)*STEP; if(Math.abs(a)>half)continue;
      const n=CN[mod(i,10)];
      let [p1x,p1y]=P(a,R),[p2x,p2y]=P(a,R-4-n/mc*30);
      x.beginPath();x.moveTo(p1x,p1y);x.lineTo(p2x,p2y);
      x.strokeStyle=i===sel?'#FF5B1A':`rgba(247,247,242,${focus?.85:.6})`;x.lineWidth=i===sel?3:2;x.stroke();
      x.beginPath();
      for(let k=1;k<5;k++){const b=a+k*STEP/5;[p1x,p1y]=P(b,R);[p2x,p2y]=P(b,R-8);x.moveTo(p1x,p1y);x.lineTo(p2x,p2y)}
      x.strokeStyle=`rgba(247,247,242,${focus?.6:.35})`;x.lineWidth=1;x.stroke();
      if(mod(i,10)===0){ // the loop seam between 2026 and 2017
        const b=a-STEP/2;[p1x,p1y]=P(b,R+14);[p2x,p2y]=P(b,R-34);
        x.setLineDash([3,4]);x.beginPath();x.moveTo(p1x,p1y);x.lineTo(p2x,p2y);x.strokeStyle='rgba(247,247,242,.6)';x.lineWidth=1;x.stroke();x.setLineDash([]);
      }
    }
    // soft fade toward both ends
    x.globalCompositeOperation='destination-in';
    const g=x.createLinearGradient(0,0,BW,0),f=Math.min(.16,120/BW);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(f,'#000');g.addColorStop(1-f,'#000');g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g;x.fillRect(0,0,BW,BH);x.globalCompositeOperation='source-over';
  }
  function render(){
    geometry(); draw();
    const half=Math.asin(Math.min(1,(G.c+120)/R))*180/Math.PI;
    const span=Math.ceil(half/STEP)+1, sel=Math.round(pos);
    let k=0;
    for(let i=Math.floor(pos)-span;i<=Math.ceil(pos)+span&&k<pool.length;i++){
      const a=(i-pos)*STEP; if(Math.abs(a)>half)continue;
      const s=pool[k++],[px,py]=P(a,R+30),o=edge(a);
      s.el.style.transform=`translate3d(${px.toFixed(2)}px,${py.toFixed(2)}px,0) translate(-50%,-50%)`;
      if(Math.abs(o-s.o)>.01){s.el.style.opacity=o.toFixed(2);s.o=o}
      if(s.i!==i||s.v!==version){const y=yearOf(i),n=CN[mod(i,10)];s.i=i;s.v=version;
        s.el.firstChild.textContent=y;s.el.lastChild.textContent=`${n} event${n===1?'':'s'}`;s.el.classList.toggle('zero',n===0)}
      const isSel=i===sel; if(s.sel!==isSel){s.el.classList.toggle('is-sel',isSel);s.sel=isSel}
    }
    for(;k<pool.length;k++){const s=pool[k];if(s.o!==0){s.el.style.opacity='0';s.o=0}}
    if(sel!==selI){selI=sel;announce(false)}
  }
  function announce(settled){
    const y=yearOf(selI),n=countFor(y);
    const label=S.sport==='all'?'all sports':S.sport==='future'?'future sports':SPORT[S.sport].name.toLowerCase();
    el.setAttribute('aria-valuenow',y);
    el.setAttribute('aria-valuetext',`${y}, ${n} event${n===1?'':'s'}, ${label}`);
    if(settled)live.textContent=`${y}: ${n} events`;
  }
  function frame(t){
    const dt=Math.min(48,t-(last||t));last=t;const f=dt/16.67;
    let moving=false;
    for(const k in GT){const d=GT[k]-G[k];if(Math.abs(d)>.3){G[k]+=d*Math.min(1,.14*f);moving=true}else G[k]=GT[k]}
    if(!dragging){
      if(target!==null){pos+=(target-pos)*Math.min(1,.16*f);if(Math.abs(target-pos)<.001){pos=target;target=null}else moving=true}
      else if(Math.abs(vel)>.0015){pos+=vel*f;vel*=Math.pow(.92,f);moving=true}
      else if(Math.abs(pos-Math.round(pos))>.001){target=Math.round(pos);vel=0;moving=true}
      else pos=Math.round(pos);
    }
    render();
    if(moving||dragging){raf=requestAnimationFrame(frame)}else{raf=0;last=0;settle()}
  }
  function settle(){const i=Math.round(pos);if(settledI!==i){settledI=i;announce(true);onSettle(yearOf(i),i)}}
  function run(){if(!raf){last=0;raf=requestAnimationFrame(frame)}}
  function goTo(i,instant){vel=0;if(instant||reduced){pos=i;target=null;render();settle();return}target=i;run()}
  function step(d){goTo((target!==null?target:Math.round(pos))+d)}

  /* focus mode: the rest of the page fades while the dial is in use */
  let focusT=0;
  function focus(on){clearTimeout(focusT);const v=on&&!el.classList.contains('hidden');if(root.classList.contains('loop-focus')!==v){root.classList.toggle('loop-focus',v);if(!raf)draw()}}
  disc.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')focus(true)});
  disc.addEventListener('pointerleave',()=>{if(!dragging&&!el.matches(':focus-visible'))focus(false)});
  el.addEventListener('focus',()=>{if(el.matches(':focus-visible'))focus(true)});
  el.addEventListener('blur',()=>focus(false));

  let wcool=0;
  disc.addEventListener('wheel',e=>{
    e.preventDefault();
    let d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(e.deltaMode===1)d*=30;
    if(reduced){const n=performance.now();if(n-wcool<260)return;wcool=n;step(Math.sign(d));return}
    target=null;vel=clamp(vel+d*.0007,-.35,.35);run();
  },{passive:false});

  // drag along the arc: horizontal movement maps 1:1 onto arc length
  const ang=e=>Math.atan2(e.clientX-L-lcx,lcy-(e.clientY-T))*180/Math.PI;
  let pid=null,a0=0,p0=0,la=0,lt=0,vs=0,moved=false;
  disc.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.pointerType==='mouse')return;
    pid=e.pointerId;a0=la=ang(e);p0=pos;lt=performance.now();vs=0;moved=false;dragging=true;target=null;vel=0;
    disc.setPointerCapture(pid);focus(true);run();
  });
  disc.addEventListener('pointermove',e=>{
    if(e.pointerId!==pid)return;
    const a=ang(e);if(Math.abs(a-a0)*R*Math.PI/180>5){if(!moved)disc.classList.add('dragging');moved=true}
    if(!moved)return;
    pos=p0-(a-a0)/STEP;
    const n=performance.now(),dt=Math.max(8,n-lt);vs=.6*vs+.4*(-(a-la)/STEP)*(16.67/dt);la=a;lt=n;
  });
  const end=e=>{
    if(e.pointerId!==pid)return;pid=null;dragging=false;disc.classList.remove('dragging');
    if(e.pointerType!=='mouse')focusT=setTimeout(()=>focus(false),700);
    if(!moved){const i=Math.round(pos+ang(e)/STEP);if(i===Math.round(pos))onActivate();else goTo(i);run();return}
    if(performance.now()-lt>90)vs=0;
    vel=reduced?0:clamp(vs,-.35,.35);if(reduced)target=Math.round(pos);run();
  };
  disc.addEventListener('pointerup',end);disc.addEventListener('pointercancel',end);

  el.addEventListener('keydown',e=>{
    const i=target!==null?target:Math.round(pos);
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();step(1)}
    else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();step(-1)}
    else if(e.key==='Home'){e.preventDefault();goTo(i-mod(i,10))}
    else if(e.key==='End'){e.preventDefault();goTo(i-mod(i,10)+9)}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();onActivate()}
  });

  return {
    el,render:()=>{CN=counts();mc=Math.max(1,...CN);version++;render();announce(false)},
    goTo,step,run,focus,
    get year(){return yearOf(Math.round(target!==null?target:pos))},
    get index(){return Math.round(target!==null?target:pos)},
    get target(){return GT},
    setGeom(g,instant){Object.assign(GT,g);if(instant||reduced){Object.assign(G,g);geoKey=''}render();run()},
    glide(off){if(reduced)return;const i=target!==null?target:Math.round(pos);pos=i-off;vel=0;target=i;run()},
    onSettle(f){onSettle=f},onActivate(f){onActivate=f},
    nearestWithEvents(){const i=Math.round(pos);for(let d=1;d<10;d++){for(const s of [-1,1]){if(countFor(yearOf(i+s*d))>0)return i+s*d}}return null},
    forceSettle(){settledI=null;settle()}
  };
})();

/* ================= THE DECK ================= */
const Deck=(()=>{
  const deck=$('#deck'), cardsEl=$('#deckCards'), ui=$('#deckUi'), head=$('#deckHead'), countEl=$('#deckCount');
  let items=[], idx=0, cards=[], busy=false, token=0;
  const tf=(d,n)=>{
    const m=isMobile();
    if(m){ if(d===0)return['translate3d(0,0,0)',1,1]; if(d<=2)return[`translate3d(0,${d*18}px,${-d*60}px)`,1,1-d*.2]; return['translate3d(0,40px,-200px)',0,.5]; }
    if(d===0)return['translate3d(0,0,0)',1,1]; if(d<=3)return[`translate3d(0,${-d*26}px,${-d*120}px)`,1-d*.08,1-d*.2]; return['translate3d(0,-110px,-520px)',0,.4];
  };
  const EXIT=()=>isMobile()?'translate3d(0,-125%,0) rotate(-5deg)':'translate3d(0,-62%,180px) rotateX(22deg)';
  function apply(){
    const n=cards.length;
    cards.forEach((c,i)=>{const d=mod(i-idx,n);const [t,o,b]=tf(d,n);c.style.setProperty('--t',t);c.style.setProperty('--o',o);c.style.setProperty('--b',b);
      c.style.zIndex=100-d;c.classList.toggle('is-front',d===0);c.setAttribute('aria-hidden',d===0?'false':'true')});
    countEl.innerHTML=n?`<b>${pad(idx+1)}</b> / ${pad(n)}`:'00 / 00';
    $('#deckPrev').disabled=n<2;$('#deckNext').disabled=n<2;$('#deckOpen').disabled=!n;
    if(n){const e=items[idx];$('#deckOpen').setAttribute('aria-label',`Open ${e.name} ${e.year}`)}
    Hub.markCurrent(items[idx]);
  }
  function cardHTML(e){
    return `${e.status!=='past'?`<div class="tags"><span class="tag ${e.status==='week'?'live':'up'}">${STATUS_LABEL[e.status]}</span></div>`:''}
      <div class="poster">${posterSVG(e)}</div>
      <div class="meta"><h3>${esc(e.name)}</h3>
      <div class="row"><span>${fmtShort(e.date)} · ${esc(e.place)}</span><span class="pp" title="Participants">${e.participants}</span></div></div>`;
  }
  function build(list,{loading=true}={}){
    const my=++token;
    items=list; idx=0;
    cardsEl.innerHTML='';cards=[];
    $$('.deck-empty',deck).forEach(x=>x.remove());
    if(!list.length){ empty(); apply(); return; }
    const make=()=>{
      if(my!==token)return;
      cardsEl.innerHTML='';
      cards=list.map((e,i)=>{const c=document.createElement('article');c.className='card no-t';c.style.setProperty('--acc',e.accent);c.innerHTML=cardHTML(e);c.dataset.i=i;
        c.setAttribute('aria-label',`${e.name}, ${e.year}, ${e.location}, ${e.participants} participants`);
        c.style.setProperty('--t','translate3d(0,70%,-260px) scale(.85)');c.style.setProperty('--o',0);cardsEl.appendChild(c);return c});
      void cardsEl.offsetWidth;
      cards.forEach((c,i)=>{ if(reduced){c.classList.remove('no-t')} else setTimeout(()=>c.classList.remove('no-t'),Math.min(i,5)*50) });
      requestAnimationFrame(()=>requestAnimationFrame(apply));
    };
    if(loading&&!reduced){
      cards=[0,1,2].map(i=>{const c=document.createElement('div');c.className='card skeleton';const[t,o,b]=tf(i,3);c.style.setProperty('--t',t);c.style.setProperty('--o',o);c.style.setProperty('--b',b);c.style.zIndex=10-i;cardsEl.appendChild(c);return c});
      countEl.textContent='Loading…';
      setTimeout(make,240);
    } else make();
  }
  function empty(){
    const y=Loop.year, sp=S.sport, box=document.createElement('div');box.className='deck-empty';
    if(sp==='future'){
      box.innerHTML=`<div><div class="ring">+</div><h3>Future sports</h3><p>No events yet. New sports join the Loop as the community asks for them.</p><a class="btn primary" href="#contact">Suggest a sport <span class="arr">→</span></a></div>`;
    } else {
      const lbl=sp==='all'?'':SPORT[sp].name.toLowerCase()+' ';
      const t=S.route==='events'&&S.time!=='all'?` marked “${STATUS_LABEL[S.time].toLowerCase()}”`:'';
      box.innerHTML=`<div><div class="ring">0</div><h3>No ${lbl}events in ${y}${t}</h3><p>The Loop keeps going. Try a neighbouring year or widen the filter.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="btn primary" data-act="nearest">Nearest year with events</button>${S.time!=='all'&&S.route==='events'?'<button class="btn ghost" data-act="alltime">Show all dates</button>':''}</div></div>`;
    }
    deck.appendChild(box);
    box.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;
      if(a.dataset.act==='nearest'){const i=Loop.nearestWithEvents();if(i!==null)Loop.goTo(i)}
      if(a.dataset.act==='alltime'){Hub.setTime('all')}});
  }
  function next(dir=1){
    const n=cards.length; if(n<2||busy)return;
    if(dir>0){
      const old=cards[idx]; idx=mod(idx+1,n);
      if(reduced){apply();return}
      busy=true; old.style.setProperty('--t',EXIT()); old.style.setProperty('--o',0); old.style.zIndex=200;
      cards.forEach(c=>{if(c!==old){}});
      // advance the rest immediately; the old card finishes its exit then slips to the back
      const n2=cards.length;cards.forEach((c,i)=>{if(c===old)return;const d=mod(i-idx,n2);const[t,o,b]=tf(d,n2);c.style.setProperty('--t',t);c.style.setProperty('--o',o);c.style.setProperty('--b',b);c.style.zIndex=100-d;c.classList.toggle('is-front',d===0);c.setAttribute('aria-hidden',d===0?'false':'true')});
      countEl.innerHTML=`<b>${pad(idx+1)}</b> / ${pad(n)}`; Hub.markCurrent(items[idx]);
      setTimeout(()=>{old.classList.add('no-t');old.classList.remove('is-front');apply();const[t]=tf(n-1,n);old.style.setProperty('--t',t);old.style.setProperty('--o',0);void old.offsetWidth;old.classList.remove('no-t');apply();busy=false},340);
    } else {
      idx=mod(idx-1,n); const c=cards[idx];
      if(!reduced){c.classList.add('no-t');c.style.setProperty('--t',EXIT());c.style.setProperty('--o',0);c.style.zIndex=200;void c.offsetWidth;c.classList.remove('no-t')}
      requestAnimationFrame(apply);
    }
  }
  function goToIndex(i){ if(i===idx||!cards.length)return; idx=i; apply(); }
  function open(){ const e=items[idx]; if(e) location.hash='#event-'+e.id; }
  /* wheel advances the deck (the stage itself never scrolls).
     One continuous scroll gesture — a mouse-wheel spin or a trackpad flick,
     which keeps sending events back-to-back with no pause — advances exactly
     one card: once it fires, further deltas in the same gesture are ignored
     until the events stop for a beat, which is what actually ends the gesture. */
  let acc=0,wheelLocked=false,wheelEndT=0;
  cardsEl.addEventListener('wheel',e=>{
    e.preventDefault();
    clearTimeout(wheelEndT);
    wheelEndT=setTimeout(()=>{wheelLocked=false;acc=0},160);
    if(wheelLocked)return;
    acc+=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    if(Math.abs(acc)>40){next(acc>0?1:-1);acc=0;wheelLocked=true}
  },{passive:false});
  /* swipe / drag / tap */
  let pid=null,sy=0,sx=0,dy=0,dragCard=null;
  cardsEl.addEventListener('pointerdown',e=>{
    const c=e.target.closest('.card'); if(!c||c.classList.contains('skeleton'))return;
    if(!c.classList.contains('is-front')){goToIndex(+c.dataset.i);return}
    pid=e.pointerId;sy=e.clientY;sx=e.clientX;dy=0;dragCard=c;cardsEl.setPointerCapture(pid);
  });
  cardsEl.addEventListener('pointermove',e=>{
    if(e.pointerId!==pid||!dragCard)return; dy=e.clientY-sy;
    if(Math.abs(dy)>6){dragCard.classList.add('no-t');dragCard.style.setProperty('--t',`translate3d(0,${dy*.9}px,0) rotate(${dy*-.01}deg)`)}
  });
  const up=e=>{
    if(e.pointerId!==pid||!dragCard)return; pid=null; const c=dragCard; dragCard=null; c.classList.remove('no-t');
    const dx=e.clientX-sx;
    if(Math.abs(dy)<6&&Math.abs(dx)<6){apply();open();return}
    if(dy<-60)next(1); else if(dy>60)next(-1); else apply();
  };
  cardsEl.addEventListener('pointerup',up);cardsEl.addEventListener('pointercancel',up);
  cardsEl.addEventListener('keydown',e=>{
    if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();next(1)}
    else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();next(-1)}
    else if(e.key==='Enter'){e.preventDefault();open()}
  });
  $('#deckPrev').addEventListener('click',()=>next(-1));
  $('#deckNext').addEventListener('click',()=>next(1));
  $('#deckOpen').addEventListener('click',open);
  function layout(){
    const home=S.route==='home', slot=home?$('#deckSlotHome'):$('#deckSlotEvents');
    const rr=slot.getBoundingClientRect(), m=isMobile(), g=Loop.target;
    const cut=g.base-g.h-(m?PAD+6:PAD+10);
    const r={left:rr.left,top:rr.top,width:rr.width,height:Math.max(220,Math.min(rr.bottom,cut)-rr.top)};
    Object.assign(deck.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
    const headH=home?54:0, uiH=56;
    head.hidden=!home;
    const topPad=m?4:(home?56:66), botPad=m?40:8;
    cardsEl.style.top=(headH+topPad)+'px'; cardsEl.style.bottom=(uiH+botPad)+'px'; cardsEl.style.left='0';cardsEl.style.right='0';cardsEl.style.position='absolute';
    Object.assign(ui.style,{left:'50%',bottom:'0',transform:'translateX(-50%)'});
    const ah=r.height-headH-topPad-uiH-botPad, aw=r.width;
    let ch,cw;
    if(m){cw=Math.min(aw-24,440);ch=Math.min(ah,cw*1.5);if(ch<cw*1.1){cw=ch/1.1}}
    else{ch=Math.min(ah,620);cw=ch*.72;if(cw>aw-24){cw=aw-24;ch=cw/.72}}
    deck.style.setProperty('--cw',Math.max(200,cw)+'px');deck.style.setProperty('--ch',Math.max(260,ch)+'px');
    if(cards.length&&!cards[0].classList.contains('skeleton'))apply();
  }
  function setHead(y,n){
    const lbl=S.sport==='all'?'all sports':SPORT[S.sport]?SPORT[S.sport].name:'';
    head.innerHTML=`<h2>${y}<span>${n} event${n===1?'':'s'} · ${esc(lbl)}</span></h2><button class="icon-btn" id="deckClose" aria-label="Close deck"><svg aria-hidden="true"><use href="#i-x"/></svg></button>`;
    $('#deckClose').onclick=()=>Home.closeDeck();
  }
  return {build,layout,setHead,next,open,show(on){deck.classList.toggle('on',on)},focus(){cardsEl.focus({preventScroll:true})},get current(){return items[idx]}};
})();

/* ================= HOME ================= */
const Home={
  openDeck(){
    const y=Loop.year, list=filtered(y);
    S.deckOpen=true; root.classList.add('deck-open');
    Deck.setHead(y,list.length); Deck.show(true); Deck.layout(); Deck.build(list); setTimeout(()=>Deck.focus(),50);
  },
  closeDeck(){ S.deckOpen=false; root.classList.remove('deck-open'); Deck.show(false); Loop.el.focus({preventScroll:true}); }
};

/* ================= EVENTS HUB ================= */
const Hub={
  renderSports(){
    const total=id=>id==='future'?0:EVENTS.filter(e=>id==='all'||e.sport===id).length;
    const chips=[['all','All sports'],...SPORTS.map(s=>[s.id,s.name]),['future','Future sports']];
    $('#evSports').innerHTML=chips.map(([id,n])=>`<button class="chip${id==='future'?' future':''}" data-sport="${id}" aria-pressed="${S.sport===id}">${esc(n)}</button>`).join('');
    $('#navSports').innerHTML=chips.map(([id,n])=>`<li><a href="#events${id==='all'?'':'-'+id}" class="${id==='future'?'future':''}" ${S.route==='events'&&S.sport===id?'aria-current="true"':''}><span>${esc(n)}</span></a></li>`).join('');
  },
  setSport(id){ if(S.sport===id)return; S.sport=id; Loop.render(); this.renderSports(); this.update(); },
  setTime(t){ S.time=t; $$('#timeSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.time===t)); Loop.render(); this.update(); },
  update(){
    $('#evTitle').textContent=S.sport==='all'?'Events':S.sport==='future'?'Future sports':SPORT[S.sport].name;
    if(S.route!=='events')return;
    const y=Loop.year,list=filtered(y), lbl=S.sport==='all'?'All sports':S.sport==='future'?'Future sports':SPORT[S.sport].name;
    $('#evCrumb').innerHTML=`${esc(lbl)} / <b>${y}</b> / ${list.length} event${list.length===1?'':'s'}`;
    $('#evYear').textContent=y;
    const ppl=list.reduce((s,e)=>s+e.participants,0);
    $('#evSum').innerHTML=list.length?`<b>${list.length} event${list.length===1?'':'s'}</b> · ${ppl} participants <span class="ph">placeholder</span>`:'No events for this selection';
    const li=list.map((e,i)=>`<li><button data-i="${i}" data-id="${e.id}"><span>${esc(e.name)}</span><span class="d">${fmtShort(e.date)}${e.status!=='past'?' · '+STATUS_LABEL[e.status].toUpperCase():''}</span></button></li>`).join('');
    $('#evIndex').innerHTML=li; $('#evIndexM').innerHTML=li||'<li class="ev-sumline" style="padding:16px 0">No events for this selection.</li>';
    const key=S.sport+'|'+S.time+'|'+y+'|'+list.map(e=>e.id).join(',');
    if(key===this._key&&$('#deckCards').childElementCount){Deck.layout();return}
    this._key=key; Deck.build(list);
  },
  markCurrent(e){ $$('.ev-index button').forEach(b=>b.setAttribute('aria-current',e&&b.dataset.id===e.id?'true':'false')); }
};
$('#evSports').addEventListener('click',e=>{const b=e.target.closest('[data-sport]');if(!b)return;const id=b.dataset.sport;location.hash=id==='all'?'#events':'#events-'+id});
$('#timeSeg').addEventListener('click',e=>{const b=e.target.closest('[data-time]');if(b)Hub.setTime(b.dataset.time)});
$$('.view-toggle button').forEach(b=>b.addEventListener('click',()=>{S.listMode=b.dataset.view==='list';root.classList.toggle('list-mode',S.listMode);$$('.view-toggle button').forEach(x=>x.setAttribute('aria-pressed',x===b));if(!S.listMode)Deck.layout()}));
['#evIndex','#evIndexM'].forEach(s=>$(s).addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)location.hash='#event-'+b.dataset.id}));

let settleT=0;
Loop.onSettle((y)=>{
  clearTimeout(settleT);
  if(S.route==='events') settleT=setTimeout(()=>Hub.update(),140);
  else if(S.route==='home'&&S.deckOpen){const list=filtered(y);Deck.setHead(y,list.length);Deck.build(list)}
  const ob=$('#openYear'); if(ob){const n=countFor(y);ob.innerHTML=`Open ${y} · ${n} event${n===1?'':'s'}`;ob.disabled=!n}
});
Loop.onActivate(()=>{
  if(S.route==='home'){ if(countFor(Loop.year)) Home.openDeck(); }
  else if(S.route==='events'){ Deck.focus(); }
});

/* ================= NAV ================= */
const navEvents=$('#navEvents'), navSports=$('#navSports');
navEvents.addEventListener('click',()=>{const o=navEvents.getAttribute('aria-expanded')!=='true';navEvents.setAttribute('aria-expanded',o);navSports.hidden=!o;if(o){Hub.renderSports();const f=navSports.querySelector('a');f&&f.focus({preventScroll:true})}});
const menuBtn=$('#menuBtn');
function setMenu(o){root.classList.toggle('nav-open',o);menuBtn.setAttribute('aria-expanded',o);if(o){$('#nav .nav-item').focus()}else if(isMobile())menuBtn.focus({preventScroll:true})}
menuBtn.addEventListener('click',()=>setMenu(true));
$('#navClose').addEventListener('click',()=>setMenu(false));
$('#topbar .tb-link[href="#events"]').addEventListener('click',e=>{ if(isMobile()){e.preventDefault();setMenu(true);navEvents.setAttribute('aria-expanded','true');navSports.hidden=false;Hub.renderSports()} });
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(root.classList.contains('nav-open'))setMenu(false);else if(S.deckOpen)Home.closeDeck()}});
