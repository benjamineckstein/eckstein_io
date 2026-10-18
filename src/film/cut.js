/* ---------- IV: at dawn the page on main fills the screen as v46. The editor strikes what does not work, it falls away, the line gathers into the headline, the art opens into the well ---------- */
let LYC=null,GRP=[],STR=[],SURV=[],TGT=[],ARTB=null,ARTR=null;
const LIT_W=560,PRESS=70,FLD=1.2;
function lattice(r,n){const a=new Float32Array(n+3);for(let i=0;i<a.length;i++)a[i]=r()*2-1;return a}
function smp(a,x,wl){const f=Math.max(0,x/wl),i=Math.floor(f),u=f-i,s=u*u*(3-2*u);return a[Math.min(i,a.length-2)]*(1-s)+a[Math.min(i+1,a.length-1)]*s}
/* a marker stroke: a ribbon with uneven edges, a slight tilt and bow, ends that are round, slanted or flicked off */
function mkStroke(xa,xb,yc,H,seed,o){const r=mul(seed),u=o.u,dir=o.dir,len=Math.max(1,xb-xa),n=Math.max(2,Math.ceil(len/Math.max(2,H*.3))),lowL=H*9,midL=H*3.2,hiL=H*.8,nn=l=>Math.ceil(len/l)+3;
const low=lattice(r,nn(lowL)),low2=lattice(r,nn(lowL)),m1=lattice(r,nn(midL)),m2=lattice(r,nn(midL)),h1=lattice(r,nn(hiL)),h2=lattice(r,nn(hiL)),tilt=(r()-.5)*H*(.5+.6*u),bow=(r()-.5)*H*(.35+.4*u),flick=!o.careEnd&&r()<.6,top=new Float32Array(n+1),bot=new Float32Array(n+1);
for(let i=0;i<=n;i++){const g=i/n,x=g*len,gs=dir>0?g:1-g;let c=yc+tilt*(g-.5)+bow*Math.sin(Math.PI*g)+smp(low,x,lowL)*H*.12,half=H*.5*(1+.1*smp(low2,x,lowL));half*=1+.12*Math.exp(-gs*len/(H*1.8));
if(flick){const e=sst(.8,1,gs);half*=1-.45*e;c-=e*e*H*.35}top[i]=c-half+smp(h1,x,hiL)*H*.06+smp(m1,x,midL)*H*.07;bot[i]=c+half+smp(h2,x,hiL)*H*.06+smp(m2,x,midL)*H*.07}
const streaks=[];for(let j=0,k=1+Math.floor(r()*3);j<k;j++){const a=r();streaks.push({off:(r()-.5)*.7,from:a*.5,to:.45+r()*.55,a:.12+r()*.16,w:Math.max(.5,H*(.05+r()*.06))})}
if(flick)for(let j=0,m=2+Math.floor(r()*3);j<m;j++){const a=.78+r()*.1,b=Math.min(1,a+.1+r()*.12),off=(r()-.5)*.7,al=.18+r()*.2,w=Math.max(.5,H*(.05+r()*.07));streaks.push(dir>0?{off,from:a,to:b,a:al,w}:{off,from:1-b,to:1-a,a:al,w})}
return{xa,xb,len,n,top,bot,yc,H,dir,streaks,rL:o.rL,rR:o.rR,slL:o.slL,slR:o.slR,u,ia:(.88+.08*r()).toFixed(3)}}
function edgeAt(arr,f,n){const i=Math.min(n-1,Math.floor(f)),u=f-i;return arr[i]*(1-u)+arr[i+1]*u}
function drawStroke(c,S,fa,fb){if(fb<=fa+1e-4)return;const n=S.n,ia=fa*n,ib=fb*n,xA=S.xa+fa*S.len,xB=S.xa+fb*S.len,g=Math.min(1,.45+(xB-xA)/(S.H*3)),rA=S.rL*g,rB=S.rR*g,sA=S.slL*g,sB=S.slR*g,tA=edgeAt(S.top,ia,n),bA=edgeAt(S.bot,ia,n),tB=edgeAt(S.top,ib,n),bB=edgeAt(S.bot,ib,n);
c.beginPath();c.moveTo(xA,tA);for(let i=Math.floor(ia)+1;i<ib;i++)c.lineTo(S.xa+i/n*S.len,S.top[i]);c.lineTo(xB,tB);c.lineTo(xB+sB,tB);
for(let k=1;k<8;k++){const a=Math.PI*k/8,f=(1-Math.cos(a))/2;c.lineTo(L(xB+sB,xB,f)+Math.sin(a)*rB,L(tB,bB,f))}c.lineTo(xB,bB);for(let i=Math.ceil(ib)-1;i>ia;i--)c.lineTo(S.xa+i/n*S.len,S.bot[i]);c.lineTo(xA,bA);c.lineTo(xA-sA,bA);
for(let k=1;k<8;k++){const a=Math.PI*k/8,f=(1-Math.cos(a))/2;c.lineTo(L(xA-sA,xA,f)-Math.sin(a)*rA,L(bA,tA,f))}c.closePath();c.fill()}
function drawStreaks(c,S,fa,fb){c.strokeStyle=INK;for(const s of S.streaks){const a=Math.max(fa,s.from),b=Math.min(fb,s.to);if(b<=a)continue;const i0=Math.floor(a*S.n),i1=Math.ceil(b*S.n),ga=c.globalAlpha;c.lineWidth=s.w;c.globalAlpha=ga*s.a;c.beginPath();
for(let i=i0;i<=i1;i++){const x=cl(S.xa+i/S.n*S.len,S.xa+a*S.len,S.xa+b*S.len),y=(S.top[i]+S.bot[i])/2+s.off*(S.bot[i]-S.top[i])*.5;i===i0?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();c.globalAlpha=ga}}
/* the ink: the night's amber, denser at the edges where a marker pools */
function inkFill(c,S){const g=c.createLinearGradient(0,S.yc-S.H/2,0,S.yc+S.H/2);g.addColorStop(0,'rgba(255,176,88,.98)');g.addColorStop(.25,`rgba(255,192,112,${S.ia})`);g.addColorStop(.75,`rgba(255,192,112,${S.ia})`);g.addColorStop(1,'rgba(255,176,88,.98)');return g}
/* the editor's plan: what goes is grouped (the nav, each feature, the badge, the headline, every run of copy between two survivors, the buttons, the extra link, the extra footer entry),
   struck line by line in reading order, fast, careful only where a word stays; each group falls away a moment after its last stroke */
function planCut(){LYC=layG(cw2,ch2,Object.assign({},VS[46],{nc:1}));MC.textBaseline='alphabetic';MC.font=`400 100px ${SANS}`;if(HASLS)MC.letterSpacing='0px';XH=MC.measureText('x').actualBoundingBoxAscent/100;CAPH=MC.measureText('H').actualBoundingBoxAscent/100;
const ops=LYC.ops,r=mul(lang==='en'?177:77),G=new Map(),grp=id=>{let g=G.get(id);if(!g){g={id,ops:[],sh:[]};G.set(id,g)}return g};
SURV=ops.filter(q=>q.k===1).map(q=>({q}));let run=null,ln=-1,prevS=null,nr=0;
for(const q of ops){if(typeof q==='function'){if(q.grp)grp(q.grp).sh.push(q);continue}if(!q.grp)continue;
if(q.grp==='sub'){if(q.ln!==ln){ln=q.ln;run=null;prevS=null}if(q.k===1){if(run)run.nextS=q;run=null;prevS=q;continue}if(!run){run=grp('s'+(nr++));run.prevS=prevS}run.ops.push(q)}else grp(q.grp).ops.push(q)}
GRP=[...G.values()];
for(const g of GRP){const rows=[];for(const q of g.ops){let w=rows.find(w=>Math.abs(w.y-q.y)<q.sz*.3);if(!w){w={y:q.y,sz:q.sz,x0:q.x,x1:q.x+q.w,caps:true};rows.push(w)}w.x0=Math.min(w.x0,q.x);w.x1=Math.max(w.x1,q.x+q.w);w.sz=Math.max(w.sz,q.sz);if(/[a-zäöüß]/.test(q.s))w.caps=false}
for(const f of g.sh){if(!f.bb)continue;const[x0,y0,x1,y1]=f.bb,w=rows.find(w=>w.y>y0-2&&w.y-w.sz*.7<y1+2);if(w&&y1-y0>w.sz*.9){w.x0=Math.min(w.x0,x0);w.x1=Math.max(w.x1,x1);w.bb=[x0,y0,x1,y1]}else if(!w)rows.push({y:(y0+y1)/2,sz:Math.max(10,y1-y0),x0,x1,bb:[x0,y0,x1,y1],shape:1})}
rows.sort((a,b)=>a.y-b.y);g.rows=rows;g.y=rows.length?rows[0].y:0;g.x=rows.length?rows[0].x0:0;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const w of rows){x0=Math.min(x0,w.x0);x1=Math.max(x1,w.x1);y0=Math.min(y0,w.y-w.sz);y1=Math.max(y1,w.y+w.sz*.3)}g.cx=(x0+x1)/2;g.cy=(y0+y1)/2}
GRP=GRP.filter(g=>g.rows.length).sort((a,b)=>a.id[0]==='s'&&b.id[0]==='s'?+a.id.slice(1)-+b.id.slice(1):(a.y-b.y)||(a.x-b.x));
STR=[];GRP.forEach((g,gi)=>{g.st=[];g.rows.forEach(w=>{const fs=w.sz,u=STR.length/24;let H,yc;
if(w.bb&&(w.shape||w.bb[3]-w.bb[1]>fs*.9)){const bh=w.bb[3]-w.bb[1];H=Math.max(3,Math.min(bh*.42,fs*.62));yc=(w.bb[1]+w.bb[3])/2+(r()-.5)*bh*.08}
else{H=cl(fs*.34,3.2,34)*(.94+.12*r());yc=w.y-(w.caps?CAPH:XH)*fs*.5+(r()-.5)*fs*.04}
const o={u,dir:1,careEnd:!!g.nextS};let xa,xb;const sl=H*(.5+.6*r());
if(g.prevS){o.rL=H*.35;o.slL=0;xa=Math.max(w.x0-fs*.02,g.prevS.x+g.prevS.w+fs*.12+o.rL)}else{o.rL=H*(.2+.25*r());o.slL=sl;xa=w.x0-fs*(.1+.18*r())}
if(g.nextS){o.rR=H*.35;o.slR=0;xb=Math.min(w.x1+fs*.02,g.nextS.x-fs*.12-o.rR)}else{o.rR=H*(.2+.25*r());o.slR=sl;xb=w.x1+fs*(.12+.3*r())}
if(!g.prevS&&!g.nextS&&STR.length>3&&r()<.22)o.dir=-1;const S=mkStroke(xa,xb,yc,H,1000+STR.length*37,o);S.care=!!(g.prevS||g.nextS);S.g=g;S.fs=fs;S.fill=inkFill(MC,S);g.st.push(S);STR.push(S)})});
/* tempo: the hand speeds up as it goes; the whole pass is scaled to fit its window */
let tt=0;STR.forEach((S,j)=>{const u=j/Math.max(1,STR.length-1),tempo=1+.7*sst(0,.4,u);let d=(.06+(S.xb-S.xa)/S.fs/110)/tempo;if(S.care)d*=1.2;const nx=STR[j+1];let gp=0;
if(nx)gp=(nx.g===S.g?.03+.03*r():.07+.06*r()+(Math.abs(nx.yc-S.yc)>vh*.18?.07:0))/Math.sqrt(tempo);S.t0=tt;S.d=d;tt+=d+gp});
const span=cl(.95+STR.length*.05,1.7,2.4),kk=span/tt;T.redB=T.redA+span;for(const S of STR){S.t0=T.redA+S.t0*kk;S.d*=kk}
/* each struck group falls away a moment after its last stroke: a small drop, a slight turn, gone */
GRP.forEach((g,i)=>{const e=Math.max(...g.st.map(S=>S.t0+S.d)),sz=g.rows[0].sz;g.f0=e+.18+.1*r();g.fd=(sz>40?.64:.42)+.1*r();g.dy=Math.min(24,5+sz*.2)*(.8+.4*r());g.rot=(i&1?1:-1)*(.006+.012*r())*(sz>60?.4:1);g.dx=(r()-.5)*6});
const fallEnd=Math.max(...GRP.map(g=>g.f0+g.fd));
/* the survivors light up in reading order, then gather into the end frame's headline */
let t=T.litA=T.redB+.12;SURV.forEach((q,i)=>{q.lit=t;const nx=SURV[i+1];if(nx)t+=/^[.!?]$/.test(q.q.s)?.2:.07+.007*q.q.s.length});
T.cl0=Math.max(t+.3,fallEnd-.1);planGather();T.fl0=T.cl0+.75;T.wo0=T.fl0+.1;T.wo1=T.wo0+1.7;T.dp0=T.fl0+1.0;T.dp1=T.dp0+1.05;T.ho=Math.max(T.fl0+.22+FLD,T.dp1)+.05;T.END=T.ho+1.3}
/* the two lines of the end frame, scaled down to the copy's size and set where the copy was: the survivors close ranks there first */
function planGather(){const nA=E.aL.querySelectorAll('.t').length,ss=SURV.length?SURV[0].q.sz:16,y1=Math.min(...SURV.map(q=>q.q.y)),slh=EM.hero.slh;
[[0,nA],[nA,SURV.length]].forEach(([i0,i1],ri)=>{const a=TGT[i0];if(!a)return;const R={k:ss/a.sz,ax:a.x,ay:a.yb,bx:EM.px,by:y1+ri*slh,d:ri*.22};
for(let i=i0;i<i1;i++){const q=SURV[i],g=TGT[i];if(!g)continue;q.row=R;q.sx=R.bx+(g.x-R.ax)*R.k;q.sy=R.by+(g.yb-R.ay)*R.k;q.cd=Math.abs(q.sy-q.q.y)>2?.14:0}})}
const strokeHead=(S,t)=>{const p=cl((t-S.t0)/S.d);if(p<=0)return 0;return S.care?eCare(p):L(eSlow(p),eFast(p),S.u)};
function fallOf(g,t){const p=P(t,g.f0,g.f0+g.fd);if(p<=0)return null;const e=eIn(p);return{dx:g.dx*e,dy:g.dy*e,rot:g.rot*e,al:1-eSoft(cl(p*1.25))}}
function litOf(q,t){const p=cl((t-q.lit)/.45);if(p<=0)return null;const a=eLit(p),wt=400+(LIT_W-400)*a+PRESS*Math.sin(Math.PI*cl(p*1.6)),n=Array.from(q.q.s).length,w0=mw(q.q.s,400,q.q.sz,q.q.ff),w1=mw(q.q.s,wt,q.q.sz,q.q.ff);
return{wt,col:rgb(mixC([163,165,177],[255,240,222],a)),ls:(w0-w1)/n}}
/* where the page sits while it grows out of the preview: from the small window at the end of main to the whole screen; its browser bar slides away */
function unfold(t){const e=eOut(P(t,T.pg0,T.pg1)),p=pvRect(NM),w=vw*Math.pow(p.w/vw,1-e),h=w/A,x=L(p.x,0,e),y=L(p.y,0,e),chF=chromeH(w,VS[46]),ch=chF*(1-e),kc=(h-ch)/h;
return{e,x,y,w,h,chF,ch,s:w/vw*kc,ox:x+w*(1-kc)/2,oy:y+ch,rad:tr(w,h)*(1-e)}}
/* the art of v46, rendered once: the night's light where the well will open */
function artRect(){const P=EM.panel,f=P.f*1.36,x=Math.floor((Math.min(P.x,VPW[0]*(1-f))-4)*dpr),y=Math.floor((Math.min(P.y,VPW[1]*(1-f))-4)*dpr);return{x:x/dpr,y:y/dpr,w:Math.ceil((Math.max(P.w,vw*f)+8)*dpr)/dpr,h:Math.ceil((Math.max(P.h,vh*f)+8)*dpr)/dpr}}
function buildArt(){if(ARTB)return ARTB;const R=ARTR=artRect(),c=ARTB=cvs(R.w*dpr,R.h*dpr),g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,-R.x*dpr,-R.y*dpr);artG(g,VS[46]);return c}
let BIG=null;const bigBmp=()=>BIG||(BIG=bmp(Object.assign({},VS[46],{nc:1}),cw2,ch2));
function drawPageOps(c,t,full){const o=LYC;c.textBaseline='middle';c.textAlign='left';
for(const op of o.ops){if(typeof op==='function'){if(op.art||op.grp)continue;op(c);continue}if(op.k===1||op.grp)continue;c.globalAlpha=op.al??1;dTok(c,op)}c.globalAlpha=1;
if(!full)return;for(const g of GRP){const f=fallOf(g,t);if(f&&f.al<=0)continue;c.save();if(f){c.globalAlpha=f.al;c.translate(g.cx+f.dx,g.cy+f.dy);c.rotate(f.rot);c.translate(-g.cx,-g.cy)}
for(const sh of g.sh)sh(c);for(const q of g.ops){if(q.al!=null)c.globalAlpha=(f?f.al:1)*q.al;dTok(c,q);if(q.al!=null)c.globalAlpha=f?f.al:1}
for(const S of g.st){const h=t>=S.t0+S.d?1:strokeHead(S,t);if(h<=0)continue;const a=S.dir>0?0:1-h,b=S.dir>0?h:1;c.fillStyle=S.fill;drawStroke(c,S,a,b);drawStreaks(c,S,a,b)}c.restore()}
if(HASLS)c.letterSpacing='0px'}
/* the full-size page while the cut runs: ground, art (fading as the well opens), the well, what stays, what falls, then the survivors on top */
function drawCut(t){const c=X2;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle=LYC.bg;c.fillRect(0,0,cw2,ch2);
const ao=1-eSoft(P(t,T.wo0+.2,T.wo0+1.2));if(ao>0){const ab=buildArt();c.globalAlpha=ao;c.drawImage(ab,ARTR.x*dpr,ARTR.y*dpr,ARTR.w*dpr,ARTR.h*dpr);c.globalAlpha=1}
if(t>=T.wo0)well(t-T.wo0,eSoft(P(t,T.wo0,T.wo0+.9)),eIO(P(t,T.wo0,T.wo1)));
c.setTransform(dpr,0,0,dpr,0,0);drawPageOps(c,t,true);drawSurv(c,t)}
/* the page growing out of the preview: one pre-rendered full-size bitmap, scaled, under its sliding browser bar */
function drawUnfold(t){const c=X2,u=unfold(t);c.setTransform(1,0,0,1,0,0);c.save();rr(c,u.x*dpr,u.y*dpr,u.w*dpr,u.h*dpr,u.rad*dpr);c.clip();c.fillStyle=LYC.bg;c.fillRect(u.x*dpr,u.y*dpr,u.w*dpr,u.h*dpr);
c.drawImage(bigBmp(),u.ox*dpr,u.oy*dpr,vw*u.s*dpr,vh*u.s*dpr);if(u.e<1){c.translate(u.x*dpr,(u.y+u.ch-u.chF)*dpr);chromeG(c,u.w*dpr,u.chF*dpr,VS[46])}c.restore()}
function drawSurv(c,t){c.textBaseline='alphabetic';c.textAlign='left';SURV.forEach((q,i)=>{const f=flyAt(i,t);let wt=400,col='#a3a5b1',ls=0,x=q.q.x,y=q.q.y,sz=q.q.sz;
if(f){wt=f.wt;ls=f.ls;x=f.x;y=f.y;sz=f.sz;col=f.col}else{const l=litOf(q,t);if(l){wt=l.wt;col=l.col;ls=l.ls}}
c.font=`${wt.toFixed(0)} ${sz.toFixed(2)}px ${SANS}`;if(HASLS)c.letterSpacing=ls.toFixed(2)+'px';c.fillStyle=col;c.fillText(q.q.s,x,y)});if(HASLS)c.letterSpacing='0px'}
/* the survivors leave the copy and become the line of the end frame */
function measureT(){const toks=[...E.cp.querySelectorAll('.t')];TGT=toks.map(el=>{const r=el.getBoundingClientRect(),ln=el.closest('.a,.l'),bl=ln.querySelector('.bl').getBoundingClientRect(),cs=getComputedStyle(el);
return{s:el.textContent,x:r.left,yb:bl.top,sz:parseFloat(cs.fontSize),wt:parseFloat(cs.fontWeight)||300,ls:parseFloat(cs.letterSpacing)||0,col:el.closest('.a')?[163,165,177]:[242,241,236]}})}
/* phase one closes ranks (words that change line wait a beat, so nothing crosses); phase two grows each line about its first letter into the end frame's line */
function flyAt(i,t){const q=SURV[i],g=TGT[i],R=q&&q.row;if(!g||!R)return null;const pa=P(t,T.cl0+q.cd,T.cl0+q.cd+.5);if(pa<=0)return null;const ea=eIO(pa);
const warm=[255,240,222];if(t<T.fl0+R.d){const x=L(q.q.x,q.sx,ea),y=L(q.q.y,q.sy,ea)-Math.sin(Math.PI*ea)*(q.cd?q.q.sz*.9:q.q.sz*.15);return{x,y,sz:q.q.sz,wt:LIT_W,ls:g.ls*R.k*ea,col:rgb(warm),e:0}}
const p=P(t,T.fl0+R.d,T.fl0+R.d+FLD),e=eFly(p),s=Math.pow(R.k,1-e),ax=L(R.bx,R.ax,e),ay=L(R.by,R.ay,e);
return{x:ax+(g.x-R.ax)*s,y:ay+(g.yb-R.ay)*s,sz:g.sz*s,wt:L(LIT_W,g.wt,e),ls:g.ls*s,col:rgb(mixC(warm,g.col,e)),e}}
