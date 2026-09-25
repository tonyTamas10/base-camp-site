
/* ================= EVENT PAGE (modular) ================= */
const MODULES={
  team:['story','stats','schedule','teams','groups','bracket','results','players','venue','gallery','partners','status','related'],
  track:['story','stats','schedule','heats','rankings','records','venue','gallery','partners','status','related'],
};
const LABELS={story:'Story',stats:'Numbers',schedule:'Schedule',teams:'Teams',groups:'Groups',bracket:'Bracket',results:'Results',players:'Players',heats:'Heats & lanes',rankings:'Rankings',records:'Records',venue:'Venue',gallery:'Gallery',partners:'Partners',status:'Registration',related:'Next on the Loop'};
function crestHTML(t){return `<span class="crest" style="background:linear-gradient(135deg,${t.col[0]} 0 62%,${t.col[1]} 62%);color:${t.col[1]}" aria-hidden="true">${esc(t.code)}</span>`}
function matchHTML(m,final){const aw=m.w===m.a,bw=m.w===m.b;return `<div class="match${final?' final':''}"><div class="mr${aw?' w':''}"><span>${esc(m.a.name)}</span><span class="s">${m.ga}${m.pens==='a'?' (p)':''}</span></div><div class="mr${bw?' w':''}"><span>${esc(m.b.name)}</span><span class="s">${m.gb}${m.pens==='b'?' (p)':''}</span></div></div>`}
function tableHTML(rows,g){return `<div class="tbl-wrap"><table class="t resolve compact" data-rv="resolve"><caption>Group ${g}</caption><thead><tr><th>#</th><th>Team</th><th>GD</th><th>Pts</th></tr></thead><tbody>${rows.map((x,i)=>`<tr class="${i<2?'q':''}"><td>${i+1}</td><td>${esc(x.t.name)}</td><td>${x.GF-x.GA>0?'+':''}${x.GF-x.GA}</td><td class="pts">${x.Pts}</td></tr>`).join('')}</tbody></table></div>`}
function mapSVG(ev){
  const r=rng('m'+ev.id);let s='';
  for(let i=0;i<14;i++){const y=r()*300;s+=`<path d="M-10 ${y.toFixed(0)} L410 ${(y+(r()-.5)*80).toFixed(0)}" stroke="#fff" stroke-width="${2+r()*6}"/>`}
  for(let i=0;i<10;i++){const x=r()*400;s+=`<path d="M${x.toFixed(0)} -10 L${(x+(r()-.5)*90).toFixed(0)} 310" stroke="#fff" stroke-width="${2+r()*5}"/>`}
  const pitch=ev.sp.kind==='team'?`<rect x="-34" y="-22" width="68" height="44" rx="3" fill="#1C2E9E"/><line x1="0" y1="-22" x2="0" y2="22" stroke="#fff" stroke-width="1.5"/><circle r="8" fill="none" stroke="#fff" stroke-width="1.5"/>`
    :`<rect x="-44" y="-26" width="88" height="52" rx="26" fill="#1C2E9E"/><rect x="-30" y="-12" width="60" height="24" rx="12" fill="#7FE3C4" opacity=".6"/>`;
  return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustrative venue map, not to scale"><rect width="400" height="300" fill="#E6E9F3"/>${s}
    <path d="M-10 250 C 90 210, 160 280, 260 230 S 380 200, 420 215" fill="none" stroke="#B8C6F5" stroke-width="16"/>
    <g transform="translate(210 140) rotate(-12)">${pitch}</g>
    <circle cx="210" cy="140" r="60" fill="none" stroke="#FF5B1A" stroke-width="1.5" stroke-dasharray="4 5"/>
    <text x="16" y="286" font-size="10" fill="#4A5480" style="font-family:var(--f-mono);letter-spacing:.08em">ILLUSTRATIVE · NOT TO SCALE</text></svg>`;
}
function sec(id,cls,inner){return `<section class="sec ${cls}" id="s-${id}" data-mod="${id}"><div class="wrap">${inner}</div></section>`}
function eyebrow(t,extra=''){return `<p class="eyebrow">${t}${extra}</p>`}
const PH='';

function renderEvent(ev){
  const d=details(ev), sp=ev.sp, mods=MODULES[sp.kind];
  const statusTag=`<span class="tag ${ev.status==='past'?'':ev.status==='week'?'live':'up'}" style="${ev.status==='past'?'background:rgba(5,10,44,.5)':''}">${STATUS_LABEL[ev.status]}</span>`;
  const words=ev.name.split(' '), lastW=words.pop();
  const frag=posterSVG(ev);
  const nextUp=EVENTS.find(e=>e.sport===ev.sport&&e.status!=='past'&&e.id!==ev.id);
  const sameSport=EVENTS.filter(e=>e.sport===ev.sport&&e.id!==ev.id);
  const i0=EVENTS.indexOf(ev);
  const nextOnLoop=EVENTS.slice(i0+1).find(e=>e.sport===ev.sport)||nextUp||sameSport[0];
  const related=[nextOnLoop,...sameSport.filter(e=>e!==nextOnLoop&&e.year!==ev.year).slice(-2)].filter(Boolean);
  let h=`<section class="evh wrap" id="s-top" data-mod="top">
    <div class="evh-grid">
      <div>
        <a class="back" href="#events-${ev.sport}">← ${esc(sp.name)} / ${ev.year}</a>
        <h1>${esc(words.join(' '))} <span class="acc">${esc(lastW)}</span></h1>
        <p class="evh-line"><span>${fmt(ev.date)}</span><span>${esc(ev.place)}</span><span class="pp">${ev.participants}</span></p>
        ${ev.status!=='past'?`<div class="evh-cta">${statusTag}</div>`:''}
        <div class="evh-cta" style="margin-top:18px">
          ${ev.status==='past'?`<a class="btn primary" href="#s-${sp.kind==='team'?'bracket':'rankings'}">See the results <span class="arr">↓</span></a>`:`<a class="btn primary" href="#register-${ev.id}">Register <span class="arr">→</span></a>`}
        </div>
      </div>
      <div class="poster-assemble" style="--acc:${ev.accent}" aria-hidden="true">${[0,1,2,3].map(()=>`<div class="pf">${frag}</div>`).join('')}</div>
    </div></section>`;
  const M={
    story:()=>sec('story','paper',`${eyebrow('The story')}<div class="story-grid">
      <p class="pull">${sp.kind==='team'?`Eight teams. Two days. <span>One final.</span>`:`Eight lanes. One straight. <span>Every hundredth counts.</span>`}</p>
      <div><p>${sp.kind==='team'?`Student and community teams from across Cluj. Groups on day one, knockouts on day two.`:`Open ${d.dist}. Heats in the morning, the fastest eight race the final.`}</p>
</div></div>`),
    stats:()=>sec('stats','',`${eyebrow('By the numbers',PH)}<div class="stats">${(sp.kind==='team'
        ?[['Teams',d.teams.length],['Players',d.participants],['Matches',d.matches.length],['Goals',d.total,1]]
        :[['Athletes',d.participants],['Heats',d.heats.length],['Lanes',8],[`Fastest ${d.dist} (s)`,d.fastest.time,1]])
      .map(([l,v,hot])=>`<div class="stat${hot?' hot':''}"><span class="v" data-count="${v}">${v}</span><span class="l">${l}</span></div>`).join('')}</div>`),
    schedule:()=>sec('schedule','paper',`${eyebrow('Schedule',PH)}<div class="sched">${d.schedule.map((day,k)=>`<div class="day"><h3>${esc(day.title)}<small>${DAYS[day.day.getDay()].toUpperCase()} ${fmtShort(day.day).toUpperCase()}</small></h3>${day.slots.map(s=>`<div class="slot" data-rv="slot"><span class="t">${s[0]}</span><span class="n">${esc(s[1])}</span></div>`).join('')}</div>`).join('')}</div>`),
    teams:()=>sec('teams','',`${eyebrow('Teams',PH)}<div class="teams">${d.teams.map((t,i)=>`<div class="team rv" data-rv="rv" style="transition-delay:${(i%4)*60}ms">${crestHTML(t)}<b>${esc(t.name)}</b></div>`).join('')}</div>`),
    groups:()=>sec('groups','paper',`${eyebrow('Group tables')}<div class="tables">${tableHTML(d.tA,'A')}${tableHTML(d.tB,'B')}</div>`),
    bracket:()=>sec('bracket','midnight',`${eyebrow('Knockouts')}<h2 class="h-sec">${esc(d.fin.w.name)}</h2><div class="bracket pre-able" data-rv="bracket">
      <div class="bcol"><h4>Semi-finals</h4>${matchHTML(d.s1)}${matchHTML(d.s2)}</div>
      <div class="bcol"><h4>Final</h4>${matchHTML(d.fin,true)}</div>
      <div class="bcol"><h4>3rd place</h4>${matchHTML(d.third)}</div></div>`),
    results:()=>sec('results','paper',`<details class="more"><summary><span class="eyebrow" style="margin:0">All ${d.matches.length} results</span></summary><div class="results">${d.matches.map(m=>`<div class="res"><span class="a">${esc(m.a.name)}</span><span class="sc">${m.ga}–${m.gb}</span><span>${esc(m.b.name)}</span><small>${esc(m.stage)}${m.round?' · R'+m.round:''}${m.pens?' · pens':''}</small></div>`).join('')}</div></details>`),
    players:()=>{const mx=d.scorers[0].g||1;return sec('players','',`${eyebrow('Top scorers')}<div class="players resolve" data-rv="resolve">${d.scorers.slice(0,5).map((p,i)=>`<div class="prow rrow"><span class="rk">${i+1}</span><span class="nm">${esc(p.name)}</span><span class="bar"><i style="--w:${(p.g/mx*100).toFixed(0)}%"></i></span><span class="g">${p.g}</span></div>`).join('')}</div>`)},
    heats:()=>{const lane=ht=>`<div class="heat" data-rv="heat"><h4>Heat ${ht.n}</h4>${ht.lanes.map(l=>l.empty?`<div class="lane empty"><span class="ln">${l.lane}</span><span></span><span class="track"></span><span class="tm">—</span></div>`
        :`<div class="lane${l.first?' first':''}"><span class="ln">${l.lane}</span><span>${esc(l.name)}</span><span class="track"><span class="runner" style="--w:${(d.base/l.time*96).toFixed(1)}%"></span></span><span class="tm">${l.time.toFixed(2)}</span></div>`).join('')}</div>`;
      return sec('heats','',`${eyebrow(`Heats · ${d.dist}`)}<div class="heats">${lane(d.heats[0])}<details class="more"><summary><span class="eyebrow" style="margin:0">${d.heats.length-1} more heats</span></summary><div class="heats" style="margin-top:24px">${d.heats.slice(1).map(lane).join('')}</div></details></div>`)},
    rankings:()=>sec('rankings','paper',`${eyebrow('Rankings',PH)}<div class="tbl-wrap"><table class="t resolve" data-rv="resolve"><thead><tr><th>#</th><th>Athlete</th><th>Club</th><th>Heat</th><th>Lane</th><th>Time</th></tr></thead><tbody>${d.ranking.slice(0,5).map((a,i)=>`<tr class="${i<3?'q':''}"><td>${i+1}</td><td>${esc(a.name)}</td><td style="text-align:right">${esc(a.club)}</td><td>${a.heat}</td><td>${a.lane}</td><td class="pts">${a.time.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`),
    records:()=>sec('records','midnight',`${eyebrow('Records',PH)}<div class="stats">
      <div class="stat hot"><span class="v">${d.fastest.time.toFixed(2)}</span><span class="l">Edition best · ${esc(d.fastest.name)}</span></div>
      <div class="stat"><span class="v">${d.closest.gap.toFixed(2)}</span><span class="l">Closest finish (s) · heat ${d.closest.h}</span></div>
      <div class="stat"><span class="v">—</span><span class="l">Base Camp record · not yet recorded</span></div>
      <div class="stat"><span class="v">${d.dist}</span><span class="l">Distance</span></div></div>`),
    venue:()=>sec('venue','paper',`${eyebrow('Venue')}<div class="venue"><div class="map">${mapSVG(ev)}</div><div><h2 class="h-sec" style="font-size:clamp(40px,4.5vw,64px)">${esc(ev.place)}</h2><dl class="facts">
      <div><dt>Surface</dt><dd>${sp.kind==='team'?'Artificial turf':'Synthetic track'}</dd></div></dl></div></div>`),
    gallery:()=>sec('gallery','midnight',`${eyebrow('Photos & video')}<div class="gallery">${['g1','g2','g3','g4','g5','g6'].map((g,i)=>`<figure class="ph-tile ${g}" data-rv="tile" style="margin:0"><canvas data-seed="${ev.id}-${i}" aria-hidden="true"></canvas>${i===1?'<button class="play" aria-label="Play video (placeholder)"><svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg></button>':''}</figure>`).join('')}</div>`),
    partners:()=>sec('partners','paper',`${eyebrow('Sponsors & partners')}<div class="partners">${MARKS.slice(0,6).map((m,i)=>markHTML(m,i,'#0B1233',40)).join('')}</div>`),
    status:()=>sec('status','',`<div class="status-band">${ev.status==='past'
        ?`<div><h3>Finished</h3><p>${nextUp?`Next: ${esc(nextUp.name)}, ${fmt(nextUp.date)}`:'Next edition to be announced'}</p></div>${nextUp?`<a class="btn primary" href="#register-${nextUp.id}">Register <span class="arr">→</span></a>`:''}`
        :`<div><h3>Registration open</h3></div><a class="btn primary" href="#register-${ev.id}">Register <span class="arr">→</span></a>`}</div>`),
    related:()=>`<section class="sec" id="s-related" data-mod="related"><div class="wrap cont">${eyebrow('Next on the Loop')}
      <svg class="line" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" vector-effect="non-scaling-stroke" d="M1000 -40 C 1000 120, 640 60, 420 120 S 60 150, 60 220"/></svg>
      <div class="related">${related.map((e,i)=>`<a class="rel${i===0?' next':''}" href="#event-${e.id}" style="--acc:${e.accent}">${i===0?'<span class="tag up nx">Next</span>':''}<div class="poster">${posterSVG(e)}</div><div class="meta"><b>${esc(e.name)}</b><span>${e.year} · ${esc(e.location)}</span></div></a>`).join('')}</div></div></section>`,
  };
  h+=mods.map(m=>M[m]()).join('');
  h+=`<footer class="foot"><span>Base Camp · Cluj-Napoca</span><span><a href="#contact">Contact</a> · <a href="#system">Design system</a></span></footer>`;
  const v=$('#v-event'); v.innerHTML=h; v.style.setProperty('--acc',ev.accent);
  $('#rail').innerHTML='<span class="rl"></span><span class="rf"></span>'+mods.map(m=>`<a href="#s-${m}" data-for="s-${m}"><span>${LABELS[m]}</span><i></i></a>`).join('');
  Reveal.arm(v);
}

/* progress rail — the Loop marks where you are in the story */
const Rail=(()=>{
  let ticking=false;
  function upd(){
    ticking=false; if(S.route!=='event')return;
    const max=document.documentElement.scrollHeight-innerHeight, p=max>0?scrollY/max:0;
    $('#rail .rf')&&$('#rail .rf').style.setProperty('--p',(p*100).toFixed(1)+'%');
    $('#topprog').style.setProperty('--p',(p*100).toFixed(1)+'%');
    let cur=null; $$('#v-event [data-mod]').forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.45)cur=s});
    $$('#rail a').forEach(a=>a.classList.toggle('on',cur&&a.dataset.for===cur.id));
    const mid=document.elementsFromPoint(innerWidth-30,innerHeight/2).find(x=>x.classList&&x.classList.contains('sec'));
    $('#rail').classList.toggle('on-paper',!!(mid&&mid.classList.contains('paper')));
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});
  return {upd};
})();

/* ================= reveal (content visible by default; only below-fold items are armed) ================= */
const Reveal=(()=>{
  const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){fire(en.target);io.unobserve(en.target)}}),{rootMargin:'0px 0px -12% 0px'}):null;
  const lazy='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){drawPhoto(en.target);lazy.unobserve(en.target)}}),{rootMargin:'300px'}):null;
  function fire(el){
    const t=el.dataset.rv;
    if(t==='resolve'){$$('tr,.rrow',el).forEach((r,i)=>r.style.transitionDelay=(i*55)+'ms');}
    if(t==='slot'){el.classList.add('in')}
    el.classList.remove('pre');
    if(el.dataset.count!==undefined)countUp(el);
    $$('[data-count]',el).forEach(countUp);
    if(el.classList.contains('cont'))el.querySelector('path').style.strokeDashoffset=0;
  }
  function countUp(el){
    if(el._done)return;el._done=true;const to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length;
    if(reduced||!el._armed){el.textContent=el.dataset.count;return}
    const t0=performance.now(),dur=1100;
    const f=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);el.textContent=(to*e).toFixed(dec);if(k<1)requestAnimationFrame(f);else el.textContent=el.dataset.count};
    requestAnimationFrame(f);
  }
  function arm(rootEl){
    $$('canvas[data-seed]',rootEl).forEach(c=>lazy?lazy.observe(c):drawPhoto(c));
    const cont=$('.cont',rootEl); if(cont){const p=cont.querySelector('path');p.style.strokeDasharray='1';p.style.strokeDashoffset=reduced?'0':'1';p.style.transition='stroke-dashoffset 1.6s var(--e-sprint)'}
    const targets=[...$$('[data-rv]',rootEl),...$$('.stats',rootEl),...(cont?[cont]:[])];
    targets.forEach(el=>{
      const below=el.getBoundingClientRect().top>innerHeight*.9;
      if(!io||reduced||!below){fire(el);return}
      const t=el.dataset.rv;
      if(t==='rv'||t==='resolve'||t==='bracket'||t==='heat'||t==='tile')el.classList.add('pre');
      if(t==='heat')el.classList.add('pre');
      $$('[data-count]',el).forEach(c=>{c._armed=true;c.textContent='0'});
      io.observe(el);
    });
  }
  return {arm};
})();

function drawPhoto(c){
  const r=rng(c.dataset.seed), dpr=Math.min(devicePixelRatio||1,1.5), w=c.clientWidth||300, h=c.clientHeight||200;
  c.width=w*dpr;c.height=h*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);
  const pal=[['#16248A','#050A2C'],['#1C2E9E','#121F6E'],['#243B8F','#050A2C'],['#3A2A5C','#050A2C']];const[p1,p2]=pick(r,pal);
  let g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,p1);g.addColorStop(1,p2);x.fillStyle=g;x.fillRect(0,0,w,h);
  // floodlight
  const lx=r()*w;g=x.createRadialGradient(lx,h*.1,0,lx,h*.1,w*.7);g.addColorStop(0,'rgba(255,240,220,.55)');g.addColorStop(1,'rgba(255,240,220,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
  // field lines
  x.strokeStyle='rgba(247,247,242,.25)';x.lineWidth=2;x.beginPath();x.moveTo(0,h*.72);x.lineTo(w,h*.62);x.stroke();
  x.beginPath();x.ellipse(w*.5,h*.8,w*.25,h*.08,-.08,0,Math.PI*2);x.stroke();
  // figures (soft silhouettes)
  x.filter='blur(3px)';
  const n=5+Math.floor(r()*7);
  for(let i=0;i<n;i++){const fx=r()*w,fy=h*(.45+r()*.35),s=h*(.12+r()*.2);
    x.fillStyle=r()<.3?'rgba(255,91,26,.85)':'rgba(5,10,44,.85)';x.beginPath();x.ellipse(fx,fy,s*.22,s*.5,0,0,Math.PI*2);x.fill();
    x.fillStyle='rgba(5,10,44,.9)';x.beginPath();x.arc(fx,fy-s*.62,s*.15,0,Math.PI*2);x.fill()}
  x.filter='none';
  // grain
  const id=x.getImageData(0,0,c.width,c.height),dd=id.data;for(let i=0;i<dd.length;i+=4){const v=(r()-.5)*22;dd[i]+=v;dd[i+1]+=v;dd[i+2]+=v}x.putImageData(id,0,0);
}

/* ================= forms ================= */
function validate(form){
  let ok=true;
  $$('input[required],textarea[required]',form).forEach(inp=>{
    const err=inp.parentElement.querySelector('.err');let msg='';
    if(!inp.value.trim())msg='Add this to continue.';
    else if(inp.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value))msg='Use an email like name@example.com.';
    inp.setAttribute('aria-invalid',msg?'true':'false');if(err){err.textContent=msg;err.id=err.id||inp.id+'Err';inp.setAttribute('aria-describedby',err.id)}
    if(msg&&ok){ok=false;inp.focus()}
  });
  return ok;
}
function wireForm(form,doneHTML){
  form.addEventListener('submit',e=>{
    e.preventDefault(); if(!validate(form))return;
    const btn=form.querySelector('button[type=submit]');btn.classList.add('is-loading');
    setTimeout(()=>{btn.classList.remove('is-loading');const d=form.querySelector('[role=status]');d.innerHTML=`<div class="done"><b>Got it</b><span>${doneHTML()}</span></div>`},700);
  });
}
function renderRegOpts(pre){
  const up=EVENTS.filter(e=>e.status!=='past');
  $('#regOpts').innerHTML=up.map((e,i)=>`<label class="opt"><input type="radio" name="ev" value="${e.id}" ${(pre?e.id===pre:i===0)?'checked':''}><span><b>${esc(e.name)}</b><small>${esc(e.sp.name)} · ${fmt(e.date)} · ${esc(e.location)}</small></span>${e.status==='week'?'<span class="tag live">This week</span>':''}</label>`).join('');
}
wireForm($('#regForm'),()=>{const id=($('#regForm input[name=ev]:checked')||{}).value;const e=byId[id];return `This is a prototype, so nothing was sent. In the live site, ${esc($('#regName').value)} would get a confirmation for ${e?esc(e.name):'the event'}.`});
wireForm($('#spForm'),()=>'This is a prototype, so nothing was sent. In the live site, the Base Camp team would reply by email.');
wireForm($('#ctForm'),()=>'This is a prototype, so nothing was sent.');
$('#copyMail').addEventListener('click',()=>{const t=$('#mailAddr').textContent,b=$('#copyMail');
  const sel=()=>{const rg=document.createRange();rg.selectNodeContents($('#mailAddr'));const s=getSelection();s.removeAllRanges();s.addRange(rg);b.textContent='Selected'};
  try{navigator.clipboard.writeText(t).then(()=>b.textContent='Copied',sel)}catch(e){sel()}});

/* ================= sponsor ribbon + home fragments ================= */
(()=>{
  const set=MARKS.map((m,i)=>markHTML(m,i,'#F7F7F2')).join('');
  $('#ribbonTrack').innerHTML=`<div class="ribbon-set">${set}</div><div class="ribbon-set" aria-hidden="true">${set}</div>`;
  const pickEv=['mf-2024-3','sp-2025-2','at-2023-1'].map(id=>byId[id]).filter(Boolean);
  $('#fragments').innerHTML=pickEv.map((e,i)=>`<div class="frag f${i+1}">${posterSVG(e)}</div>`).join('');
})();
