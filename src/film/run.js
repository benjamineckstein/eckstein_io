/* ---------- DOM: prompt, band, HUD (counter, changelog, clock), night cards, deploy, end frame ---------- */
const E={tl:$('tl'),pill:$('pill'),band:$('band'),bt1:$('bt1'),bt2:$('bt2'),hud:$('hud'),cards:$('cards'),skip:$('skip'),end:$('end'),sum:$('sum'),who:$('who'),cp:$('cp'),aL:$('aL'),bL:$('bL'),ft:$('ft'),rp:$('rp'),st:$('st'),sw:$('sw'),sb:$('sb')};
E.ty=E.pill.querySelector('.ty');E.ca=E.pill.querySelector('.ca');E.ph=E.pill.querySelector('.ph');E.sd=E.pill.querySelector('.sd');E.hl=[...E.hud.children];E.li=[...document.querySelectorAll('.ln li')];
let mode='pre',PUP=0,TY=[],PROMPT='',lastN=-1,hudKey='',C={},ready=false,fontsOK=false;
const op=(el,v)=>{el.style.opacity=v<.002?'0':v>.998?'1':v.toFixed(3)};
/* the prompt is typed at a readable pace, then held complete before it is sent */
function sched(){PROMPT=S[lang].prompt;const r=mul(7),n=PROMPT.length,d=[],sp=[];for(let i=0;i<n;i++)if(PROMPT[i]===' ')sp.push(i);
for(let i=0;i<n;i++){let x=.75+r()*.6;if(PROMPT[i-1]===' ')x+=.45;if(i===sp[1]+1)x+=1.6;if(i===sp[sp.length-1]+1)x+=2.2;if(PROMPT[i]==='.')x+=.9;d.push(x)}
let acc=0;const c=d.map(x=>acc+=x),k=(T.ty1-T.ty0)/acc;TY=c.map(x=>T.ty0+x*k);lastN=-1}
const typed=t=>{let n=0;while(n<TY.length&&TY[n]<=t)n++;return n};
/* the changelog of act II: the current step and the two before it */
function logRows(t){let i=0;for(let j=1;j<A2.length;j++)if(t>=A2[j][0]+VD*.5)i=j;const ch=S[lang].ch,rows=[];for(let j=i;j>=0&&rows.length<3;j--)rows.push([A2[j][2],ch[A2[j][2]]]);return[rows,'a'+i]}
const cardVis=t=>{let v=0;for(const id in CARD_T){const[a,b]=CARD_T[id];v=Math.max(v,sst(a-.45,a-.1,t)*(1-sst(b,b+.3,t)))}return v};
function hud(t){const on=t>=T.it0+.2&&t<T.pg0+.35;if(!on){op(E.hud,0);return}let rows,key;
if(t<T.fw0+.45){const n=going(t);rows=[[0,S[lang].go(n)]];key='g'+n}
else if(t<T.nf0+.45)[rows,key]=logRows(t);
else{const v=verAt(t),n=nightAt(t);rows=[[v,hhmm(n)]];key='n'+v+hhmm(n)}
key+=lang;if(key!==hudKey){hudKey=key;E.hl.forEach((el,i)=>{const r=rows[i];el.innerHTML=r?(r[0]?`<b>v${r[0]}</b>${r[1]}`:r[1]):'';el.style.opacity=i?(1-i*.3).toFixed(2):''})}
const sw=1-eSoft(P(t,T.fw0+.25,T.fw0+.45))+eSoft(P(t,T.fw0+.45,T.fw0+.7)),nf=t>=T.nf0&&t<T.TB0+.2?1-eSoft(P(t,T.nf0+.25,T.nf0+.65))+eSoft(P(t,T.TB0-.2,T.TB0+.2)):1;
op(E.hud,eSoft(P(t,T.it0+.2,T.it0+.6))*cl(sw)*cl(nf)*(1-(narrow||!horiz?cardVis(t):0))*(1-eSoft(P(t,T.pg0,T.pg0+.3))))}
function buildCards(){const s=S[lang];E.cards.innerHTML=`<div class="card" id="cA"><span class="sg"><span class="tx wp">${s.cA}</span><i class="hd"></i></span></div><div class="card" id="cB"><span class="sg"><span class="tx wp warm">${s.cB}</span><span class="tx wp cool">${s.cB}</span><i class="hd"></i><i class="hd cold"></i></span></div>`;
const a=$('cA'),b=$('cB');C={cA:{c:a,tx:[a.querySelector('.tx')],hd:[a.querySelector('.hd')]},cB:{c:b,tx:[...b.querySelectorAll('.tx')],hd:[...b.querySelectorAll('.hd')]}}}
const headOp=p=>p<=0||p>=1?0:Math.min(1,p*12)*Math.min(1,(1-p)*6);
function wipe(node,hd,p,g,h){node.style.setProperty('--p',p.toFixed(3));node.style.setProperty('--g',g.toFixed(3));hd.style.setProperty('--p',p.toFixed(3));hd.style.setProperty('--h',h.toFixed(3))}
function cardsAt(t){for(const id in CARD_T){const[a,b]=CARD_T[id],k=C[id];if(!k)continue;const o=(t>=a&&t<b+.01?1:0)*(1-eFade(P(t,b-.55,b)));op(k.c,o);if(o<=0)continue;
if(id==='cA'){const p=eNW(P(t,a,a+.62));wipe(k.tx[0],k.hd[0],p,.9*(1-eCool(P(t,a+.4,a+1.6))),headOp(p))}
else{const p1=eNW(P(t,a,a+.6)),p2=eNW(P(t,a+.78,a+1.32));wipe(k.tx[0],k.hd[0],p1,.8*(1-eCool(P(t,a+.3,a+1.4))),headOp(p1));wipe(k.tx[1],k.hd[1],p2,0,headOp(p2))}}}
/* deploy: the status above the line fills, then says live */
function deployAt(t){op(E.st,eSoft(P(t,T.dp0,T.dp0+.3)));const dp=t<T.dp1;R.classList.toggle('dp',dp&&t>=T.dp0);E.sw.textContent=dp?'deploy':'live';E.sb.style.setProperty('--p',(eIO(P(t,T.dp0+.2,T.dp1-.08))*100).toFixed(1)+'%')}
/* the band carries two statements: what everybody can do now, and what most of them do with it */
function band(t){const i1=sst(T.bandIn,T.bandIn+.8,t)*(1-sst(T.bandOut,T.bandOut+.6,t)),i2=sst(T.b2In,T.b2In+.8,t)*(1-sst(T.b2Out,T.b2Out+.7,t)),two=t>=T.bandOut+.3;
op(E.band,two?i2:i1);E.band.style.transform=`scaleX(${L(.55,1,eOut(two?P(t,T.b2In,T.b2In+.8):P(t,T.bandIn,T.bandIn+.8))).toFixed(4)})`;
E.bt1.style.transform=`translateY(${((1-eOut(P(t,T.l1,T.l1+.8)))*105-eIO(P(t,T.txOut,T.txOut+.5))*105).toFixed(2)}%)`;
E.bt2.style.transform=`translateY(${((1-eOut(P(t,T.l2,T.l2+.8)))*105-eIO(P(t,T.tx2Out,T.tx2Out+.5))*105).toFixed(2)}%)`}
let HOLD0=0;
function renderDOM(t,hold){const pin=eSoft(P(t,T.pa,T.pa+.42)),pout=1-eSoft(P(t,T.pOut,T.pOut+.4)),up=eOut(P(t,T.up,T.up+.75));
E.pill.style.transform=`translate(-50%,-50%) translateY(${((1-pin)*14+up*PUP).toFixed(2)}px) scale(${(L(.97,1,pin)*L(1,.94,up)).toFixed(4)})`;op(E.pill,pin*pout);
const n=typed(t);if(n!==lastN){lastN=n;E.ty.textContent=PROMPT.slice(0,n);E.ph.style.display=n?'none':''}
E.ca.style.visibility=t<T.ent&&(hold?((now()-HOLD0)%1040)<520:((t>=T.ty0&&t<T.ty1+.12)||((t-T.pa)%1.04)<.52))?'visible':'hidden';
E.sd.className='sd'+(n>0?' on':'')+(t>=T.ent&&t<T.pop+.3?' gen':'');E.sd.style.transform=`scale(${(1-.13*Math.sin(Math.PI*P(t,T.ent,T.ent+.2))).toFixed(4)})`;
band(t);hud(t);cardsAt(t);deployAt(t);op(E.skip,eSoft(P(t,1.5,2.2))*(1-eSoft(P(t,T.pg0+.4,T.pg1))));
const on=t>=T.ho?1:0;op(E.aL,on);op(E.bL,on);op(E.who,on);E.li.forEach(li=>op(li,on));op(E.ft,on);op(E.rp,eSoft(P(t,T.ho+.15,T.ho+.6)))}
/* ---------- one frame of the film: a pure function of t ---------- */
function render(t){if(!ready)return;const c=X2;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
if(t<T.nf1){c.fillStyle=INK;c.fillRect(0,0,cw2,ch2);if(t<T.fw0)actI(t);else actII(t);if(t>=T.nf0){nightFall(t);renderNight(t,false)}return}
if(t<T.pg0){renderNight(t,true);return}
if(t<T.pg1){renderNight(t,true);c.setTransform(1,0,0,1,0,0);c.fillStyle=`rgba(8,9,13,${(.4*eSoft(P(t,T.pg0,T.pg1))).toFixed(3)})`;c.fillRect(0,0,cw2,ch2);drawUnfold(t);return}
if(t<T.ho+.02){drawCut(t);return}
drawEnd(t-T.wo0)}
/* ---------- modes: trailer, seek, skip, end ---------- */
function measurePill(){E.ty.textContent=PROMPT;E.ph.style.display='none';const h=E.pill.offsetHeight;lastN=-1;PUP=Math.max(56,vh*.075)+h/2-vh/2}
/* ---------- the pre-render queue: everything the film draws exists before it is needed ----------
   Jobs run while the prompt waits and is typed (cheap frames); the film holds on the prompt, caret blinking, until they are done.
   Last comes a dress rehearsal: sample frames of every act drawn off screen, so fonts, glyphs, textures and GPU pipelines are warm on the first play */
const JOBS=[],PF={jobs:[]};let REH=null,REHX=null,released=false,holdStart=0,lastF=0,calm=0;
function queueJobs(){JOBS.length=0;const J=(due,fn,reh)=>JOBS.push({due,fn,reh});
VAR.forEach((_,i)=>mipLevels(i).forEach((w,j)=>J(i?STG[0][0]:T.pop,()=>mipBuild(i,j))));
for(let b=0;b<N*N;b+=25)J(STG[0][0],()=>{for(let k=b;k<Math.min(N*N,b+25);k++)if(k!==OI)ownerSprite(k)});
[2,3,4,5].forEach(v=>J(OURS[0][0],()=>tb(VS[v],'v'+v)));POOL.forEach((s,i)=>J(T.itA,()=>tb(s,'p'+i)));
[5,6,7,8].forEach(k=>J(T.fw0,()=>pageBmp(k,FRONT.w*dpr,FRONT.h*dpr)));
night.pv.forEach(e=>J(T.N0,()=>pageBmp(e.k,PV.w*dpr,PV.h*dpr,e.s)));
J(T.pg0,bigBmp);J(T.pg1,buildArt);
MREP.forEach(v=>J(T.wo0,()=>miniBmp(v)));
JOBS.sort((a,b)=>a.due-b.due);
const ts=[];for(let t=5.4;t<37.5;t+=1.25)ts.push(t);ts.push(T.pg1+.2,T.redA+.4,(T.redA+T.redB)/2,T.redB+.1,T.litA+.4,T.fl0+.3,T.fl0+.8,T.dp0+.3,T.ho-.1,T.ho+.3,T.END+.5);
for(let i=0;i<ts.length;i+=2)J(1e9,()=>rehearse(ts.slice(i,i+2)),1)}
function rehearse(ts){if(!REH)return;const keep=X2;X2=REHX;try{for(const t of ts)render(t)}finally{X2=keep}X2.globalAlpha=1/255;X2.drawImage(REH,0,0,2,2);X2.globalAlpha=1}
function runJobs(ms,film,hold){const t0=now();while(JOBS.length&&now()-t0<ms){const j=JOBS[0];if(j.reh&&film){JOBS.shift();continue}if(j.reh&&!hold)break;JOBS.shift();const a=now();j.fn();if(PERF)PF.jobs.push(+(now()-a).toFixed(2))}if(!JOBS.length)prepared=true}
/* layout: measure the end frame, size the canvases, plan every act; nothing large is allocated after this */
let SIG='',prepared=false;function layout(keep){const sig=[R.clientWidth,innerHeight,devicePixelRatio,lang]+'';if(keep&&ready&&prepared&&sig===SIG)return;SIG=sig;prepared=false;vw=R.clientWidth;vh=innerHeight;dpr=Math.min(2,devicePixelRatio||1);A=cl(vw/vh,.4,2.4);narrow=vw<640;
fitEnd();if(mode!=='end'){scrollTo(0,0);measurePill()}measureG();measureT();measureE();cw2=CV.width=Math.round(vw*dpr);ch2=CV.height=Math.round(vh*dpr);X2.imageSmoothingQuality='high';
frames();layoutNight();planCut();buildWell();if(!REH||REH.width!==cw2||REH.height!==ch2){REH=cvs(cw2,ch2);REHX=REH.getContext('2d');REHX.imageSmoothingQuality='high'}BIG=null;ARTB=null;ready=true;queueJobs()}
function initLang(){const s=S[lang];document.querySelectorAll('[data-k]').forEach(el=>{const v=s[el.dataset.k];if(typeof v==='string')el.textContent=v});E.bt1.textContent=LINE[0];E.bt2.innerHTML=s.take;buildCards();sched();hudKey='';TBM.clear();PC=new Map()}
let t0=0,raf=0,pausedAt=null,skipT0=0,skipFrom=0,endT0=0,frozen=null,fc=0;
const now=()=>performance.now(),clock=()=>(now()-t0)/1000;
function frame(t,hold){render(t);renderDOM(t,hold)}
/* the film holds on the prompt (complete pill, blinking caret) until the fonts are in and the queue is done; then it types */
const HOLD_T=T.ty0-.02;
function loop(){raf=requestAnimationFrame(loop);
if(mode==='trailer'){const fs=now();let t=clock(),hold=false;calm=fs-lastF<40?calm+1:0;lastF=fs;
if(!released&&t>=HOLD_T){if(!holdStart){holdStart=fs;HOLD0=fs}const done=ready&&!JOBS.length&&calm>=3;if(done||fs-holdStart>7e3){released=true;if(PERF)PF.hold=+(fs-holdStart).toFixed(0)}else hold=true;t0=fs-HOLD_T*1000;t=HOLD_T}
if(t>=T.END){setEnd();return}
if(ready&&JOBS.length&&(hold||t<T.pa||t>=T.pa+.44))runJobs(hold?36:7,released,hold);
frame(t,hold)}
else if(mode==='skip')skipFrame();else if(mode==='end')ambient()}
const MANAGED=()=>[E.tl,E.skip,E.pill,E.band,E.bt1,E.bt2,E.hud,...E.hl,E.who,E.rp,E.st,E.aL,E.bL,E.ft,...E.li];
function liveEnd(){E.end.inert=false;E.end.removeAttribute('aria-hidden');E.sum.hidden=true}
const endTT=()=>(now()-endT0)/1000;
function setEnd(tt){mode='end';cancelAnimationFrame(raf);raf=0;MANAGED().forEach(el=>el.removeAttribute('style'));R.className='fin';E.sw.textContent='live';liveEnd();
const base=tt??(T.END-T.wo0);endT0=now()-base*1000;frozen=null;if(RM||(seekT!==null&&!endQ)){frozen=RM&&tt==null?AG0+TRV+2:base;drawEnd(frozen);return}raf=requestAnimationFrame(loop)}
function startTrailer(){R.className='run';mode='trailer';E.end.inert=true;E.end.setAttribute('aria-hidden','true');E.sum.hidden=false;PX=PY=PXT=PYT=0;frozen=null;MRS=1.3;MRF=false;released=false;holdStart=0;MANAGED().forEach(el=>el.removeAttribute('style'));
scrollTo(0,0);lastN=-1;if(fontsOK)layout(1);t0=now();cancelAnimationFrame(raf);raf=document.hidden?(pausedAt=0):requestAnimationFrame(loop)}
function snap(){REHX.setTransform(1,0,0,1,0,0);REHX.globalAlpha=1;REHX.globalCompositeOperation='copy';REHX.drawImage(CV,0,0);REHX.globalCompositeOperation='source-over'}
function startSkip(){if(mode!=='trailer')return;if(!ready)layout();const t=clock();if(t>=T.ho){MRS=1.3;setEnd(t-T.wo0);return}mode='skip';skipFrom=t;skipT0=now();snap();liveEnd();R.classList.remove('dp');E.sw.textContent='live';MRS=T.END-T.wo0+.5}
function skipDraw(q){drawEnd(T.END-T.wo0);const c=X2,a=1-sst(0,.9,q),sc=1+.14*eIn(q);if(a>0){c.globalAlpha=a;c.drawImage(REH,(cw2-cw2*sc)/2,(ch2-ch2*sc)/2,cw2*sc,ch2*sc);c.globalAlpha=1}
renderDOM(skipFrom);R.classList.remove('dp');E.sw.textContent='live';op(E.tl,1-eSoft(P(q,0,.3)));op(E.skip,0);const f=eSoft(P(q,.45,1));[E.who,E.rp,E.st,E.aL,E.bL,E.ft,...E.li].forEach(el=>op(el,f))}
function skipFrame(){const q=(now()-skipT0)/950;if(q>=1){setEnd();return}skipDraw(q)}
addEventListener('pointermove',e=>{if(mode==='end'&&e.pointerType!=='touch'){PXT=cl(e.clientX/vw*2-1,-1,1);PYT=cl(e.clientY/vh*2-1,-1,1)}},{passive:true});
function ambient(){if(document.hidden||(++fc&1))return;PX+=(PXT-PX)*.045;PY+=(PYT-PY)*.045;drawEnd(endTT())}
['pointerdown','keydown','wheel','touchmove'].forEach(ev=>addEventListener(ev,e=>{if(mode!=='trailer')return;if(ev==='keydown'&&['Shift','Alt','Control','Meta'].includes(e.key))return;startSkip()},{passive:true}));
document.addEventListener('visibilitychange',()=>{if(mode!=='trailer')return;if(document.hidden){pausedAt=clock();cancelAnimationFrame(raf);raf=0}else if(pausedAt!==null){t0=now()-pausedAt*1000;pausedAt=null;raf=requestAnimationFrame(loop)}});
function relayout(){if(mode==='skip'||mode==='pre')return;const t=mode==='trailer'?clock():0;if(!fontsOK&&mode==='trailer')return;layout();if(mode==='seek')frame(seekT);else if(mode==='trailer')frame(t);else if(frozen!==null)drawEnd(frozen)}
let rz=0,lastW=0,lastH=0;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(innerWidth===lastW&&Math.abs(innerHeight-lastH)<120&&mode!=='seek')return;lastW=innerWidth;lastH=innerHeight;relayout()},140)});
E.rp.addEventListener('click',()=>startTrailer());
/* ---------- boot ---------- */
{const spelled=[...PAGE[lang].sub.matchAll(/\[\[(.+?)\]\]/g)].map(m=>m[1]).reduce((a,w)=>a+(a&&!/^[.,!?]$/.test(w)?' ':'')+w,''),line=LINE.join(' ');if(spelled!==line)console.error(`Merge (${lang}): the survivors spell "${spelled}", the line is "${line}"`)}
E.rp.hidden=false;plan();initLang();lastW=innerWidth;lastH=innerHeight;
const early=(RM&&seekT===null)||endQ;if(early){R.className='fin';liveEnd();E.end.style.visibility='hidden'}
/* fonts first: no text is drawn into a canvas before Epilogue and Fragment Mono are in (or 4 s have passed) */
const FONTS=['300 100px Epilogue','400 16px Epilogue','500 16px Epilogue','600 16px Epilogue','400 12px "Fragment Mono"'];
const fontsIn=Promise.race([Promise.all(FONTS.map(f=>document.fonts.load(f,'AaÄöü–’?'))).then(()=>document.fonts.ready),new Promise(r=>setTimeout(r,4000))]).catch(()=>{}).then(()=>{fontsOK=true});
if(early||seekT!==null)fontsIn.then(()=>{layout();JOBS.length=0;if(early){E.end.style.visibility='';MRS=T.END-T.wo0+.3;setEnd();return}if(seekT>=T.END){setEnd(seekT-T.wo0)}else{mode='seek';E.end.inert=true;E.end.setAttribute('aria-hidden','true');frame(seekT)}});
else{startTrailer();fontsIn.then(()=>{if(mode==='trailer'&&!ready)layout()})}
if(DEV)window.__m={get t(){return mode==="trailer"?(holdStart&&!released?-1:clock()):null},get mode(){return mode},T,night,render:t=>{for(const j of JOBS.splice(0))if(!j.reh)j.fn();frame(t)},VS,PF,bmp};
