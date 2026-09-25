
/* ================= DESIGN SYSTEM page ================= */
function lum(hex){const c=hex.replace('#','').match(/../g).map(h=>{const v=parseInt(h,16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05))};
function renderSystem(){
  const sw=[['Deep cobalt','#1C2E9E','Environment. The world everything lives in.','#F7F7F2'],['Deep field','#16248A','Lower field, gradients, depth.','#F7F7F2'],['Midnight','#050A2C','Cards, contrast bands, text on orange.','#F7F7F2'],
    ['Warm white','#F7F7F2','Type on blue. Open space.','#050A2C'],['Paper','#F2F3F7','Quiet editorial sections.','#0B1233'],['Signal orange','#FF5B1A','Selected, active, CTA, key stats. Never body text on blue.','#050A2C'],
    ['Pale blue','#C3CFFF','Secondary text on blue and midnight.','#050A2C'],['Slate','#4A5480','Secondary text on paper.','#F7F7F2']];
  const pairs=[['#F7F7F2','#1C2E9E','White on cobalt'],['#C3CFFF','#1C2E9E','Pale on cobalt'],['#050A2C','#FF5B1A','Midnight on orange'],['#0B1233','#F2F3F7','Ink on paper'],['#4A5480','#F2F3F7','Slate on paper'],['#FF5B1A','#050A2C','Orange on midnight'],['#FF5B1A','#1C2E9E','Orange on cobalt']];
  const frame=(k)=>{ // storyboard of the Home → Events transition, circular dial
    const R=[24,24,30,36,36,36,36][k], cy=[100,100,100,84,84,84,84][k], rot=[0,0,0,0,-14,0,0][k], cx=80;
    let t='';for(let i=-3;i<=3;i++){const a=(i*36+rot)*Math.PI/180;if(Math.abs(i*36+rot)>95)continue;
      t+=`<line x1="${cx+Math.sin(a)*R}" y1="${cy-Math.cos(a)*R}" x2="${cx+Math.sin(a)*(R-5)}" y2="${cy-Math.cos(a)*(R-5)}" stroke="${i===0&&!rot?'#FF5B1A':'rgba(247,247,242,.8)'}" stroke-width="${i===0&&!rot?2:1}"/>`}
    const glow=k===1?' filter="drop-shadow(0 0 3px #fff)"':'';
    const hero=k<2?`<rect x="18" y="22" width="60" height="16" fill="rgba(247,247,242,${k?0.3:0.9})"/><rect x="18" y="42" width="40" height="4" fill="rgba(247,247,242,${k?0.2:0.5})"/>`:'';
    const chips=k>=5?Array.from({length:5},(_,i)=>`<rect x="${34+i*19}" y="89" width="15" height="6" rx="3" fill="${i===0?'#F7F7F2':'rgba(247,247,242,.3)'}"/>`).join(''):'';
    const deck=k>=6?[2,1,0].map(d=>`<rect x="${70+d*1}" y="${16-d*3}" width="${20-d*2}" height="30" rx="2" fill="${d?'#121F6E':'#050A2C'}" stroke="${d?'none':'#FF5B1A'}"/>`).join(''):'';
    return `<div class="scr"><svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden="true"><line x1="5" y1="10" x2="5" y2="90" stroke="rgba(247,247,242,.3)"/>${hero}<path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="rgba(247,247,242,${k===1?1:.7})" stroke-width="1.5"${glow}/><path d="M${cx-R+6} ${cy} A${R-6} ${R-6} 0 0 1 ${cx+R-6} ${cy}" fill="none" stroke="rgba(247,247,242,.2)"/>${t}${chips}${deck}</svg></div>`;
  };
  const steps=['Rest. The dial sits on the lower edge, half visible.','Detach. Hero fades, the ring brightens.','Expand. The radius grows.','Travel. The dial rises onto the sport row.','Momentum. The ring turns, then settles on the year.','Categories. Sport chips arrive in sequence.','Deck. Posters rise out of the dial.'];
  const efr=[['Poster fragments','Four slices of the poster settle into one image.'],['Numbers','Stats count up once, when they first enter view.'],['Tables','Rows resolve from blurred and compressed.'],['Continuation','The progress line bends into the next event.']];
  const mods=['Story','Stats','Schedule','Teams','Players','Group tables','Bracket','Results','Heats & lanes','Rankings','Records','Venue & map','Gallery','Registration','Partners'];
  const matrix={football:'●●●●●●●●○○○●●●●',minifootball:'●●●●●●●●○○○●●●●',sprints:'●●●○○○○○●●●●●●●',athletics:'●●●○○○○○●●●●●●●',community:'●●○○○○○○○○○○●●●'};
  const sample=EVENTS.filter(e=>['mf-2025-1','fb-2024-2','at-2025-2','sp-2026-1'].includes(e.id));
  $('#v-system').innerHTML=`<div class="wrap">
  <div class="page-head" style="padding-bottom:0">
    <p class="eyebrow">Guidelines · v0.1 prototype</p>
    <h1 class="h-sec">Base Camp<br>design system</h1>
    <p class="lede">One environment, one line, many sports. These rules keep every new event recognisably Base Camp.</p>
    <nav class="sys-nav" aria-label="Guideline sections">${[['principles','Principles'],['color','Colour'],['type','Type'],['space','Spacing'],['motion','Motion'],['states','Components & states'],['resp','Responsive'],['imagery','Imagery'],['modules','Event modules'],['future','Future sports'],['frames','Key frames'],['a11y','Access & performance']].map(([i,n])=>`<a class="chip" href="#sys-${i}">${n}</a>`).join('')}</nav>
  </div>

  <section class="sys-sec" id="sys-principles"><h2>Principles</h2><ol class="rules">
    <li><div><b>The Loop is the interface.</b><span>History, navigation and progress share one line. If a feature needs a new navigation pattern, first try to express it on the Loop.</span></div></li>
    <li><div><b>Blue is the world, white is clarity, orange is energy.</b><span>Orange marks exactly one thing per view: the selected year, the active card, the primary action, the key number.</span></div></li>
    <li><div><b>Show, don't tell.</b><span>Posters, numbers, lines and colour carry the story. Text appears only to guide, name or give context. One idea per screen, and no screen should ever feel full; extra detail sits behind a disclosure.</span></div></li>
    <li><div><b>Motion explains change.</b><span>Animate relationships (a year opening into events, a team entering a bracket), not decoration.</span></div></li>
    <li><div><b>Honest content.</b><span>No invented results, totals or sponsors. While data is sample data, one Prototype badge says so, instead of labels on every element.</span></div></li>
  </ol></section>

  <section class="sys-sec" id="sys-color"><h2>Colour</h2>
    <div class="swatches">${sw.map(([n,h,r,fg])=>`<div class="sw"><div class="c" style="background:${h};color:${fg}">${n}</div><div class="i"><code>${h}</code><span>${r}</span></div></div>`).join('')}</div>
    <h3>Contrast (computed, WCAG 2.1)</h3>
    <div class="ratio">${pairs.map(([f,b,n])=>{const v=ratio(f,b);return `<div style="background:${b};color:${f}">${n}<span>${v.toFixed(1)}:1 ${v>=4.5?'AA':v>=3?'AA large / UI':'graphics only'}</span></div>`}).join('')}</div>
    <p style="margin-top:16px">Orange on blue is for shapes and indicators only. When orange carries text, it is a fill with midnight type on top. Event accents (amber, mint, rose, pale blue) live inside posters and a 3px card rule; they never replace signal orange for interaction.</p>
  </section>

  <section class="sys-sec" id="sys-type"><h2>Typography</h2>
    <p>Big Shoulders Display for athletic, condensed display type. Hanken Grotesk for reading. Martian Mono for data labels, counters and timestamps. All three cover Romanian ș ț ă â î.</p>
    <div class="typespec">
      <div class="ts"><code>Display XL · 900<br>clamp(84–250px) · lh .78</code><span style="font-family:var(--f-display);font-weight:900;font-size:clamp(56px,8vw,110px);line-height:.8;text-transform:uppercase">Mănăștur</span></div>
      <div class="ts"><code>H1 event · 900<br>clamp(56–128px)</code><span style="font-family:var(--f-display);font-weight:900;font-size:clamp(40px,5vw,72px);line-height:.85;text-transform:uppercase">Încă o finală</span></div>
      <div class="ts"><code>Section · 900<br>clamp(44–88px)</code><span style="font-family:var(--f-display);font-weight:900;font-size:44px;line-height:.9;text-transform:uppercase">Țintă atinsă</span></div>
      <div class="ts"><code>Card title · 800<br>26px · lh .95</code><span style="font-family:var(--f-display);font-weight:800;font-size:26px;text-transform:uppercase">Student Cup</span></div>
      <div class="ts"><code>Body · 400<br>16–18px · lh 1.55</code><span style="font-size:18px;max-width:52ch">Șase echipe, o țintă. Încă o finală până la capăt, în Mănăștur.</span></div>
      <div class="ts"><code>Label · Mono 11px<br>+.06em, uppercase</code><span class="mono">02 / 06 · 12:30 · 7.24s</span></div>
    </div>
  </section>

  <section class="sys-sec" id="sys-space"><h2>Spacing & layout</h2>
    <p>A 4px base. Sections breathe at 64–140px; controls sit 8–16px apart. Desktop navigation takes 236px on the left without a panel; the Loop is 118px tall.</p>
    <div class="spacing">${[4,8,12,16,24,32,48,64,96,128].map(v=>`<div><i style="--s:${v}px"></i>${v}</div>`).join('')}</div>
  </section>

  <section class="sys-sec" id="sys-motion"><h2>Motion</h2>
    <p>Acceleration, momentum, passing. Transforms and opacity only; native scroll is never hijacked. Every sequence can be interrupted by input.</p>
    <div class="motion-grid">
      <div class="mcard"><b>Ambient</b><p>Track lines drift, runners loop the lanes, the ribbon moves at ~30px/s. Pauses offscreen, when the tab is hidden, and under reduced motion.</p><code>linear · 30fps canvas · 60s ribbon loop</code><div class="mdemo" style="--e:linear"><i></i></div></div>
      <div class="mcard"><b>Interface</b><p>Hover, focus, selection, chips, deck cards. Fast and physical, with a slight overshoot on passes.</p><code>160–320ms · cubic-bezier(.34,1.3,.64,1)</code><div class="mdemo" style="--e:cubic-bezier(.34,1.3,.64,1)"><i></i></div></div>
      <div class="mcard"><b>Narrative</b><p>Route transitions, Loop expansion, event storytelling. A drive phase, then a long glide.</p><code>620–720ms · cubic-bezier(.7,0,.2,1)</code><div class="mdemo" style="--e:cubic-bezier(.7,0,.2,1)"><i></i></div></div>
    </div>
    <p style="margin-top:14px"><button class="btn ghost" id="playMotion" type="button">Play the three curves</button></p>
    <h3>Reduced motion</h3>
    <p>Ambient layers render one still frame. The ribbon stops. The dial turns one year per input with no momentum, and focus dimming switches instantly. Deck cards cross-fade instead of moving in depth. Reveals are skipped, so all content shows immediately.</p>
  </section>

  <section class="sys-sec" id="sys-states"><h2>Components & states</h2>
    <h3>Buttons</h3>
    <div class="states">
      <div class="state"><small>Default</small><span class="btn primary">Register →</span><span class="btn">Secondary</span></div>
      <div class="state"><small>Hover</small><span class="btn primary" style="background:var(--orange-hi)">Register →</span><span class="btn demo-hover">Secondary</span></div>
      <div class="state"><small>Focus</small><span class="btn primary demo-focus">Register →</span></div>
      <div class="state"><small>Loading</small><span class="btn primary is-loading">Register</span></div>
      <div class="state"><small>Disabled</small><span class="btn primary" aria-disabled="true">Register</span></div>
    </div>
    <h3>Loop dial</h3>
    <div class="states">
      <div class="state"><small>Default · hover · selected</small><div class="mtx"><span style="opacity:.72">2023</span><span>2024</span><span class="s">2025</span></div></div>
      <div class="state"><small>Empty year</small><div class="mtx"><span class="z">2020</span></div><span class="mono" style="color:var(--pale)">00 EV · dimmed, still selectable</span></div>
      <div class="state"><small>Now</small><div class="mtx"><span>2026</span><span class="mono" style="color:var(--orange)">NOW</span></div></div>
      <div class="state"><small>Dial focus</small><span style="font-size:13px;color:var(--pale)">Hovering, dragging or keyboard-focusing the dial softly fades everything else to 35% while the year labels, counts and tick ring brighten. No overlay, no glow.</span></div>
      <div class="state"><small>Loop seam</small><span class="mono" style="color:var(--pale)">2026 ┊ ↺ LOOP ┊ 2017</span><span style="font-size:13px;color:var(--pale)">The dashed seam keeps chronology legible while the axis wraps.</span></div>
    </div>
    <h3>Sport chips & nav</h3>
    <div class="states">
      <div class="state"><small>Chip default / selected</small><span class="chip">Sprints <span class="n">16</span></span><span class="chip" aria-pressed="true" style="background:var(--white);color:var(--midnight)">Minifootball <span class="n">42</span></span></div>
      <div class="state"><small>Future sport</small><span class="chip future">Future sports <span class="n">soon</span></span></div>
      <div class="state"><small>Nav item active</small><span class="nav-item" style="position:relative;margin-left:26px" aria-current="page">Events</span></div>
    </div>
    <h3>Deck card</h3>
    <div class="states" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
      ${sample.slice(0,1).map(e=>`<div class="state"><small>Front / active</small><div class="card" style="position:relative;left:auto;top:auto;margin:0;width:170px;height:240px;--t:none;--acc:${e.accent}"><div class="poster">${posterSVG(e)}</div><div class="meta"><h3 style="font-size:18px">${esc(e.name)}</h3></div></div></div>`).join('')}
      ${sample.slice(0,1).map(e=>`<div class="state"><small>Behind (d = 1–3)</small><div class="card" style="position:relative;left:auto;top:auto;margin:0;width:170px;height:240px;--t:scale(.92);--b:.8;--acc:${e.accent}"><div class="poster">${posterSVG(e)}</div><div class="meta"><h3 style="font-size:18px">${esc(e.name)}</h3></div></div></div>`).join('')}
      <div class="state"><small>Loading</small><div class="card skeleton" style="position:relative;left:auto;top:auto;margin:0;width:170px;height:240px;--t:none"></div></div>
      <div class="state"><small>Empty</small><div style="width:170px;height:240px;border:1.5px dashed var(--line-strong);border-radius:16px;display:grid;place-items:center;text-align:center;padding:12px;font-size:13px;color:var(--pale)">No events in 2020<br>→ nearest year</div></div>
    </div>
  </section>

  <section class="sys-sec" id="sys-resp"><h2>Responsive</h2>
    <div class="bp"><table><thead><tr><th>Component</th><th>Desktop ≥ 1100</th><th>Tablet 900–1099</th><th>Phone &lt; 900</th></tr></thead><tbody>
      <tr><td>Navigation</td><td>Vertical, 236px, no panel, line + dot marker</td><td>Same, tighter type</td><td>Top bar with Events + Register always visible; full-screen menu</td></tr>
      <tr><td>Loop dial</td><td>A very wide dial: only its top cap (100–140px tall) shows, spanning the full content width. Rises onto the sport row on Events. Years 140–200px apart; labels show only the year and its event count. 36° per year, ten years per turn.</td><td>Same</td><td>Stays at the bottom as a shallow full-width arc, about 78px tall, years 100px apart; step buttons hidden, turn with a finger and tap a year</td></tr>
      <tr><td>Deck</td><td>3D stack, 3 cards visible behind, wheel advances</td><td>Same, smaller cards</td><td>Vertical swipe stack, 2 cards peek below, counter + buttons, List view toggle</td></tr>
      <tr><td>Ribbon</td><td>Top band, 60s loop</td><td>Same</td><td>Below top bar; marks keep optical height</td></tr>
      <tr><td>Event page</td><td>Right-side Loop rail with section markers</td><td>Top progress line</td><td>Top progress line, single column</td></tr>
      <tr><td>Touch targets</td><td colspan="3">≥ 44 × 44px everywhere; primary actions 48px</td></tr>
    </tbody></table></div>
  </section>

  <section class="sys-sec" id="sys-imagery"><h2>Imagery & posters</h2>
    <p>Each sport owns one geometry drawn from its field: pitch markings for football, a compact box for minifootball, curved lanes for athletics, straight lanes and a finish line for sprints. Posters combine that geometry, one accent shape, the event name and an outlined year. Photos reveal through a track-shaped mask.</p>
    <div class="states" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${sample.map(e=>`<div style="border-radius:12px;overflow:hidden;aspect-ratio:5/7">${posterSVG(e)}</div>`).join('')}</div>
  </section>

  <section class="sys-sec" id="sys-modules"><h2>Event modules</h2>
    <p>Shared foundations are always present: identity and poster, metadata, navigation, the Loop rail, sponsors, and the next action. Everything else is optional.</p>
    <div class="matrix"><table><thead><tr><th>Module</th>${Object.keys(matrix).map(k=>`<th>${k}</th>`).join('')}</tr></thead><tbody>
      ${mods.map((m,i)=>`<tr><td>${m}</td>${Object.values(matrix).map(v=>`<td>${v[i]==='●'?'<span class="dot" aria-label="default"></span>':'<span class="dot o" aria-label="optional"></span>'}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>
    <p class="mono" style="color:var(--pale);margin-top:10px"><span class="dot"></span> default &nbsp; <span class="dot o"></span> optional · try <a href="#event-mf-2025-1">a team event</a> and <a href="#event-sp-2025-2">a sprint event</a></p>
  </section>

  <section class="sys-sec" id="sys-future"><h2>Adding a sport</h2><ol class="rules">
    <li><div><b>Register the sport.</b><span>id, display name, kind (team, track, field, course, community), unit of measure (goals, seconds, metres, points).</span></div></li>
    <li><div><b>Draw its geometry.</b><span>One line motif from the real field, court or course. Line-only, 1.5–2px, works on all five poster grounds.</span></div></li>
    <li><div><b>Choose modules.</b><span>Start from the kind's default set in the matrix. Add a new module only when existing ones cannot express the data.</span></div></li>
    <li><div><b>Pick an accent per event.</b><span>From the event accent list. Orange stays reserved for interaction.</span></div></li>
    <li><div><b>Add events to the Loop.</b><span>The chip, the nav entry, and year counts appear automatically. No layout changes needed.</span></div></li>
    <li><div><b>Expanding beyond Cluj.</b><span>Add a city field to events; the Loop gains a city filter next to sport, using the same chip pattern.</span></div></li>
  </ol></section>

  <section class="sys-sec" id="sys-frames"><h2>Key frames</h2>
    <h3>Home → Events (≈ 720ms, interruptible)</h3>
    <div class="frames">${steps.map((s,k)=>`<div class="frame">${frame(k)}<p><b>${pad(k+1)}</b>${s}</p></div>`).join('')}</div>
    <h3>Event story, while scrolling</h3>
    <div class="frames">${efr.map(([a,b],k)=>`<div class="frame"><div class="scr" style="background:${k%2?'#F2F3F7':'#1C2E9E'}">${k===0?[0,1,2,3].map(i=>`<i style="left:${34+(i%2?4:-4)}%;top:${14+i*18}%;width:32%;height:18%;background:#050A2C;transform:rotate(${i%2?3:-3}deg)"></i>`).join(''):k===1?`<i style="left:10%;top:30%;font:900 40px/1 var(--f-display);color:#FF5B1A;font-style:normal">0→64</i>`:k===2?[0,1,2,3].map(i=>`<i style="left:10%;top:${20+i*16}%;width:80%;height:8%;background:#0B1233;opacity:${.2+i*.2};filter:blur(${3-i}px)"></i>`).join(''):`<i style="left:10%;top:0;width:80%;height:60%;border:2px solid #FF5B1A;border-top:0;border-left:0;border-radius:0 0 40px 0"></i><i style="left:6%;top:60%;width:30%;height:34%;background:#050A2C;border-radius:4px"></i>`}</div><p><b>${pad(k+1)}</b>${a}. ${b}</p></div>`).join('')}</div>
  </section>

  <section class="sys-sec" id="sys-a11y"><h2>Access & performance</h2><ol class="rules">
    <li><div><b>Every gesture has a button.</b><span>Dial: arrow keys, Home/End, step buttons, tap a year. Deck: arrows, previous/next buttons, a list view on phones.</span></div></li>
    <li><div><b>The Loop is a slider.</b><span>role="slider" with the year and event count in its value text; changes are announced politely.</span></div></li>
    <li><div><b>No traps.</b><span>Stages don't scroll, so wheel and swipe on the deck never fight the page. Event pages use native scroll only.</span></div></li>
    <li><div><b>Nothing hidden by reveals.</b><span>Only content below the fold is armed for reveal; without JavaScript or with reduced motion, everything renders in place.</span></div></li>
    <li><div><b>Light by design.</b><span>No video backgrounds. One canvas at 30fps, paused offscreen. Gallery images draw when near the viewport. Posters are vector.</span></div></li>
  </ol></section>
  </div><footer class="foot"><span>Base Camp design system · prototype</span><a href="#home">Back to the Loop</a></footer>`;
  $('#playMotion').onclick=()=>$$('.mdemo').forEach(m=>{m.classList.remove('play');void m.offsetWidth;m.classList.add('play')});
}

/* ================= ambient background ================= */
const BG=(()=>{
  const c=$('#bg'),x=c.getContext('2d');let W=0,H=0,dpr=1,raf=0,lastT=0,t0=performance.now();
  function size(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);draw(performance.now())}
  function stadium(hs,r){x.beginPath();x.moveTo(-hs,-r);x.lineTo(hs,-r);x.arc(hs,0,r,-Math.PI/2,Math.PI/2);x.lineTo(-hs,r);x.arc(-hs,0,r,Math.PI/2,Math.PI*1.5);x.closePath()}
  function draw(now){
    const t=(now-t0)/1000, m=W<900;
    x.clearRect(0,0,W,H);
    const lanes=m?5:8, R=Math.min(W,H)*(m?.34:.3), hs=R*.95, lw=m?11:14;
    x.save();x.translate(W*(m?.8:.7),H*.52);x.rotate(-.32+Math.sin(t*.05)*.03);
    for(let k=0;k<lanes;k++){const r=R+k*lw;stadium(hs,r);x.strokeStyle=`rgba(247,247,242,${k===0||k===lanes-1?.2:.09})`;x.lineWidth=1;x.setLineDash([]);x.stroke();}
    // runners in lanes 2 and 5
    [[1,.9,'rgba(255,91,26,.85)',60],[4,.7,'rgba(247,247,242,.6)',40]].forEach(([k,s,col,len])=>{if(k>=lanes)return;const r=R+k*lw+lw/2;stadium(hs,r);const per=4*hs+2*Math.PI*r;
      x.setLineDash([len,per]);x.lineDashOffset=-(t*s*90)%per;x.strokeStyle=col;x.lineWidth=2.5;x.stroke()});
    x.restore();x.setLineDash([]);
    if(!m){ // tactical diagram, faint
      x.save();x.translate(W*.34+Math.sin(t*.07)*10,H*.3+Math.cos(t*.05)*8);x.strokeStyle='rgba(195,207,255,.22)';x.fillStyle='rgba(195,207,255,.22)';x.lineWidth=1.2;
      x.setLineDash([3,6]);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(80,-60,180,-40,240,20);x.stroke();
      x.beginPath();x.moveTo(40,120);x.quadraticCurveTo(160,150,220,80);x.stroke();x.setLineDash([]);
      [[0,0],[40,120]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,6,0,7);x.stroke()});
      [[240,20],[220,80]].forEach(([a,b])=>{x.beginPath();x.moveTo(a-5,b-5);x.lineTo(a+5,b+5);x.moveTo(a+5,b-5);x.lineTo(a-5,b+5);x.stroke()});
      x.restore();
    }
  }
  function loop(now){raf=0;if(document.hidden||reduced)return;if(now-lastT>33){lastT=now;draw(now)}raf=requestAnimationFrame(loop)}
  function kick(){if(reduced){draw(performance.now());return}if(!raf)raf=requestAnimationFrame(loop)}
  addEventListener('resize',size);document.addEventListener('visibilitychange',kick);
  return {size,kick};
})();

/* ================= router: one evolving space ================= */
function layoutDial(instant){
  const W=innerWidth,H=innerHeight,m=isMobile(),nav=m?0:236;
  const cw=(W-nav)/2, cxc=nav+cw;
  const hH=m?78:clamp(H*.14,100,140);
  root.style.setProperty('--axisH',(hH+PAD+10)+'px');
  const eH=m?70:clamp(H*.12,90,120);
  if(m)root.style.setProperty('--dialH',(eH+PAD+6)+'px');
  let g;
  if(S.route==='events'){
    const base=m?H:H-26;
    g={cx:cxc,base,c:cw+60,h:eH,sp:m?108:clamp(cw/3.6,150,200)};
  } else g={cx:cxc,base:H,c:cw+60,h:hH,sp:m?100:clamp(cw/3.8,140,190)};
  Loop.setGeom(g,instant);
}
const DOCS=['event','register','sponsor','contact','system'];
function route(){
  const h=(location.hash||'#home').slice(1);
  if(/^(s|sys)-/.test(h)){const t=document.getElementById(h);if(t)t.scrollIntoView({behavior:reduced?'auto':'smooth'});return}
  let r='home',arg=null;
  if(h.startsWith('events')){r='events';arg=h.split('-')[1]||'all'}
  else if(h.startsWith('event-')){r='event';arg=h.slice(6)}
  else if(h.startsWith('register')){r='register';arg=h.split('register-')[1]||null}
  else if(['sponsor','contact','system'].includes(h))r=h;
  if(r==='event'&&!byId[arg]){r='home'}
  const prev=S.route; S.route=r;
  root.className=root.className.replace(/\broute-\S+/g,'').trim();
  root.classList.add('route-'+r); root.classList.toggle('stage-mode',r==='home'||r==='events'); root.classList.toggle('rm',reduced);
  root.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded','false');
  if(r!=='home'){S.deckOpen=false;root.classList.remove('deck-open')}
  $('#v-home').classList.toggle('is-active',r==='home');
  $('#v-events').classList.toggle('is-active',r==='events');
  DOCS.forEach(d=>$('#v-'+d).hidden=d!==r);
  // nav state
  $$('.nav-item').forEach(a=>a.removeAttribute('aria-current'));
  const act=$(`.nav-item[data-nav="${r==='event'?'events':r==='system'?'':r}"]`); if(act)act.setAttribute('aria-current','page');
  if(r==='events'){ if(arg&&(SPORT[arg]||arg==='future'||arg==='all'))S.sport=arg; }
  else if(r==='home'){ S.sport='all'; }
  Hub.renderSports();
  if(r==='events'||r==='event'){navEvents.setAttribute('aria-expanded','true');navSports.hidden=false}else{navEvents.setAttribute('aria-expanded','false');navSports.hidden=true}
  // the Loop
  const stage=r==='home'||r==='events';
  Loop.el.classList.toggle('hidden',!stage); Loop.el.tabIndex=stage?0:-1;
  if(stage){
    Loop.render();
    requestAnimationFrame(()=>layoutDial(!S.ready));
    if(r==='events'&&prev==='home'&&S.ready)Loop.glide(-1.4);
  } else Loop.focus(false);
  // the deck
  if(r==='events'){Deck.show(true);requestAnimationFrame(()=>{Deck.layout();Hub.update()})}
  else if(r==='home'){Deck.show(S.deckOpen)}
  else Deck.show(false);
  // docs
  if(r==='event'){renderEvent(byId[arg]);scrollTo(0,0);Rail.upd()}
  if(r==='register'){renderRegOpts(arg);scrollTo(0,0)}
  if(r==='sponsor'||r==='contact'){scrollTo(0,0)}
  if(r==='system'){if(!$('#v-system').childElementCount)renderSystem();scrollTo(0,0)}
  if(S.ready&&!stage){const hd=$('#v-'+r+' h1');if(hd){hd.tabIndex=-1;hd.focus({preventScroll:true})}}
  BG.kick();
}
addEventListener('hashchange',route);
let rz=0;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(()=>{if(S.route==='home'||S.route==='events'){layoutDial(true);Deck.layout()}})});

document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#s-"],a[href^="#sys-"]');if(!a)return;const t=document.getElementById(a.getAttribute('href').slice(1));if(t){e.preventDefault();t.scrollIntoView({behavior:reduced?'auto':'smooth'})}});
/* ================= boot ================= */
BG.size();
route();
Loop.forceSettle();
S.ready=true;
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{Loop.render();if(S.route==='events')Deck.layout()});
})();
</script>
