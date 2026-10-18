/* ---------- III: the night. Agents commit along their lanes, push to review, merge into main. The plan opens it, a rebase redirects it; denied results never reach main ---------- */
const NM=456,LANES=5,TR=LANES+.5,WK=2000,ND=175,RETRY=new Set([6,15]),DROP=[5,9,14,16,17,18,19,20];
/* the merge queue: landings keep a rhythm (seconds after N0); a queued merge lands in its slot, never earlier than it could */
const SLOT=[3.45,3.95,4.4,4.85,5.25,6.2,6.6,7.05,7.5,8.0,8.6,9.4];
/* slow while the words are taught, then the night runs */
const vel=a=>sst(0,.6,a)*(.2+.8*sst(3.7,5.3,a))*(1-sst(T.N1-T.N0-1.8,T.N1-T.N0,a));
const WARP=(()=>{const a=new Float64Array(WK+1),D=T.N1-T.N0;let acc=0;for(let i=1;i<=WK;i++){const ta=D*(i-1)/WK,tb=D*i/WK;acc+=(vel(ta)+vel(tb))/2*(tb-ta);a[i]=acc}for(let i=0;i<=WK;i++)a[i]=a[i]/acc*NM;return a})();
const nightAt=t=>{if(t<=T.N0)return 0;if(t>=T.N1)return NM;const f=(t-T.N0)/(T.N1-T.N0)*WK,i=Math.floor(f);return L(WARP[i],WARP[Math.min(i+1,WK)],f-i)};
function trailerAt(n){if(n<=0)return T.N0;if(n>=NM)return T.N1;let lo=0,hi=WK;while(hi-lo>1){const m=(lo+hi)>>1;if(WARP[m]<n)lo=m;else hi=m}return T.N0+(T.N1-T.N0)*(lo+(n-WARP[lo])/((WARP[hi]-WARP[lo])||1))/WK}
const hhmm=n=>{const m=(1384+Math.floor(n+1e-6))%1440;return String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
/* one night from a seed: 22 tasks, about 30 agent runs. Agents hand details to helper agents and take the results back.
   At ND a decision (the rebase) stops a few lanes and sends new agents off. Each result passes a review on its own lane; a few are denied:
   they grey out and fall away, some go back and run again */
function genNight(drop){const R=mul(4047),rr=(a,b)=>a+(b-a)*R(),runs=[],links=[],drops=[],occ=Array.from({length:LANES},()=>[]),tasks=[];let id=0,merges=0,stops=0;
const free=(l,a,b)=>occ[l].every(([x,y])=>b<=x-.4||a>=y+.4),mk=(kind,s,d,lane,o)=>{const r=Object.assign({kind,s,e:s+d,lane},o);runs.push(r);occ[lane].push([r.s,r.e]);return r};
const lane=(a,b,pref,avoid)=>{let best=-1,bd=1e9;for(let l=0;l<LANES;l++){if(l===avoid||!free(l,a,b))continue;const d=pref==null?(LANES-l)*.35+R()*2.6:Math.abs(l-pref)+R()*.6;if(d<bd){bd=d;best=l}}return best};
const place=(t0,d,pref,avoid)=>{for(let t=t0;t<NM;t+=.5){const l=lane(t,t+d,pref,avoid);if(l>=0)return[t,l]}return[t0,0]};
const add=(s0,pref,o)=>tasks.push(Object.assign({id:id++,s0,pref,tries:0},o));
for(let i=0;i<LANES;i++)add(.4+i*2.6+R()*.8,i);for(let i=0;i<3;i++)add(68+i*26+R()*6,null);add(ND-22,3);add(ND-15,1);for(let i=0;i<4;i++)add(ND+.8+i*1.4,[1,3,0,4][i],{dec:1});
for(let i=0;i<4;i++)add(ND+46+i*22+R()*5,null);for(let i=0;i<4;i++)add(312+i*18+R()*4,null);
const q=tasks.slice().sort((a,b)=>a.s0-b.s0);
while(q.length){const tk=q.shift(),first=!tk.tries,di=tk.id<LANES?28+tk.id*7+rr(0,5):rr(30,44),[s,l]=place(tk.s0,di,tk.pref,-1),impl=mk('impl',s,di,l,{dec:tk.dec&&first});if(tk.back)links.push({a:tk.back,b:impl,kind:'back',u:impl.s});
if(impl.s<ND-1&&impl.e>ND+1&&stops<2){impl.e=ND;impl.stop=1;occ[l][occ[l].length-1][1]=ND;stops++;continue}
if(R()<.3&&!tk.back){const hs=s+di*rr(.15,.35),hd=di*rr(.25,.4),hl=lane(hs,hs+hd,l,l);if(hl>=0){const h=mk('impl',hs,hd,hl,{helper:1});links.push({a:impl,b:h,kind:'branch',u:hs},{a:h,b:impl,kind:'join',u:h.e})}}
const dr=rr(8,12),dl=rr(4,6),gs=impl.e+rr(.4,.9);let rl=l,rs=gs;if(!free(l,gs,gs+dr+dl+1))[rs,rl]=place(gs,dr+dl+1,l,-1);
const rev=mk('review',rs,dr,rl,{after:impl});if(rl!==l)links.push({a:impl,b:rev,kind:'review',u:rs});
if((RETRY.has(tk.id)&&first)||drop.has(tk.id)){impl.denied=rev.deny=1;if(!drop.has(tk.id)){tk.tries++;tk.s0=rev.e+rr(1.5,3);tk.back=rev;tk.pref=(l+2)%LANES;q.push(tk);q.sort((a,b)=>a.s0-b.s0)}continue}
const rel=mk('release',rev.e+rr(.3,.6),dl,rev.lane,{fix:tk.tries>0});drops.push({rel,u:rel.e,land:rel.e+rr(2.2,3),lane:rev.lane});merges++}
return{runs,links,drops,merges}}
const night=(()=>{const ds=DROP,n=genNight(new Set(ds));
const{runs,links,drops}=n,bars=[{u:300}],cis=[],Q=mul(4047*7+1);
for(const r of runs){const tk=[];if(r.kind!=='release'){let u=r.s+.4+Q()*1.1,burst=0;while(u<r.e-.3){let h;if(r.kind==='review')h=1.4+Q()*1.8;else{if(burst<=0&&Q()<.1)burst=3+(Q()*6|0);h=burst-->0?6+Q()*8:1+Q()*3.6}
tk.push(u,h);u+=r.kind==='review'?1.1+Q()*.6:.85+Q()*1.6}}r.tk=tk;r.ts=trailerAt(r.s);r.te=trailerAt(r.e);
r.cm=[];if(r.kind==='impl'){let u=r.s+4.5+Q()*2;while(u<r.e-2.5){r.cm.push({u,t:trailerAt(u)});u+=9+Q()*5}}}
for(const r of runs)if(r.kind==='review')r.after.rv=r;
/* versions: one per merge, each stronger than the one before, up to v46 */
drops.sort((a,b)=>a.land-b.land);const M=drops.length;let pt=0;
drops.forEach((d,i)=>{const s=Math.max(trailerAt(d.land),T.N0+(SLOT[i]??SLOT[SLOT.length-1]+.35*(i-SLOT.length+1)),pt+.35);pt=s;d.land=nightAt(s);d.t=trailerAt(d.u);d.tl=s;
d.v=NV[i]??46;const c={s:d.land,e:d.land+4+Q()*3};c.ts=trailerAt(c.s);c.tt=trailerAt(c.e);cis.push(c)});
for(const k of links)k.t=trailerAt(k.u);for(const b of bars)b.t=trailerAt(b.u);
const first=new Array(LANES).fill(null);for(const r of runs)if(first[r.lane]==null||r.s<first[r.lane])first[r.lane]=r.s;
/* the page on main: state per merge, and the preview's events */
let base=VS[8];const sts=[base];drops.forEach((d,i)=>{base=Object.assign({},base,...(i<M-1?[NDL[i]]:NDL.slice(i)));sts.push(base);VS[d.v]=base});VS[46]=sts[M];VS[47]=Object.assign({},VS[46],{fin:1});
const pv=[{t:-1,k:'n0',s:VS[8],v:8}];drops.forEach((d,i)=>pv.push({t:d.tl,k:'n'+(i+1),s:sts[i+1],v:d.v}));
/* how long each preview step crossfades: a change of ground (light to dark) takes longer */
pv.forEach((e,i)=>{e.fd=i&&(!!e.s.dk)!==(!!pv[i-1].s.dk)?.95:.4});
/* the words, each taught once at its first clear occurrence */
const cms=runs.filter(r=>r.kind==='impl'&&!r.helper).flatMap(r=>r.cm.map(c=>({c,r}))).filter(x=>x.c.t>=CARD_T.cA[1]-.1).sort((a,b)=>a.c.t-b.c.t),c1=cms[0],rv1=runs.filter(r=>r.kind==='review').reduce((a,r)=>r.s<a.s?r:a),
dn=runs.filter(r=>r.deny).sort((a,b)=>a.e-b.e);
const W=[{w:'commit',u:c1.c.u,c:c1.r.lane,t:c1.c.t+.05},{w:'push',u:rv1.s,c:rv1.lane,t:rv1.ts},{w:'review',u:(rv1.s+rv1.e)/2,c:rv1.lane,t:trailerAt((rv1.s+rv1.e)/2),b:1},
{w:'merge',u:drops[0].land,c:TR,t:drops[0].tl,b:1,r:1},{w:'rebase',u:ND,c:0,t:trailerAt(ND)+.25,top:1}];
return{runs,links,drops,bars,cis,pv,W,deny:dn.map(r=>r.te),dec:{u:ND,t:trailerAt(ND)},firstT:first.map(f=>f==null?1e9:trailerAt(f))}})();
/* the version on main at t: steps up at each merge */
const pvAt=t=>{const p=night.pv;let i=0;while(i+1<p.length&&t>=p[i+1].t)i++;return i};
const verAt=t=>night.pv[pvAt(t)].v;
/* palette and light */
const PAL={impl:{core:'255,186,96',hot:'255,228,180',cool:'236,164,84'},review:{core:'200,218,248',hot:'242,247,255',cool:'170,190,228'},release:{core:'242,220,176',hot:'255,244,220',cool:'190,172,138'}};
const GREEN='127,214,164',RED='214,116,104',WHITE='238,232,220',ASH='128,124,118',WARM='255,206,150',BLUE='200,218,250',BACK='150,162,196';
function sprite(c3){const c=cvs(64,64),g=c.getContext('2d'),q=g.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.1,`rgba(${c3},.9)`);q.addColorStop(.36,`rgba(${c3},.26)`);q.addColorStop(1,`rgba(${c3},0)`);g.fillStyle=q;g.fillRect(0,0,64,64);return c}
const SP={impl:sprite('255,180,86'),review:sprite('196,214,255'),plan:sprite('236,232,222'),release:sprite('246,222,178'),green:sprite(GREEN),red:sprite(RED),white:sprite(WHITE)};
const NBS=cvs(8,8).getContext('2d'),SC=cvs(8,8),SCX=SC.getContext('2d'),NB=[cvs(8,8),cvs(8,8),cvs(8,8)],NBX=NB.map(c=>c.getContext('2d')),FILTER=typeof SCX.filter==='string';
let NG=null,NC=null,NDIM=1,horiz=true,DAWN=0,PV={w:0,h:0,b:0};
function layoutNight(){horiz=vw/vh>.9;SC.width=cw2;SC.height=ch2;[4,8,16].forEach((k,i)=>{NB[i].width=Math.ceil(cw2/k);NB[i].height=Math.ceil(ch2/k)});NBS.canvas.width=NB[0].width;NBS.canvas.height=NB[0].height;
const g={},LA=horiz?vw:vh,kn=(a,b)=>[...Array(LANES).keys(),TR].map(c=>a+(b-a)*c/TR),m=parseFloat(getComputedStyle(E.end).paddingLeft)||24;
PV.w=horiz?cl(vw*.13,140,230):cl(vw*.21,70,110);PV.h=PV.w/A;const sk=E.skip.getBoundingClientRect();PV.b=(sk.height?sk.top:vh-48)-12;
if(horiz){g.rt=kn(vh*.14,vh*.84);g.anchor=Math.max(10,m-16);g.follow=vw-PV.w-16-Math.max(28,vw*.035)}else{g.rt=kn(vw*.07,vw*.93);g.anchor=vh*.4;g.follow=Math.min(vh*.7,PV.b-PV.h-14-60)}
g.bleed=LA*.025;g.sxE=(LA+2*g.bleed)/NM;g.sx0=g.sxE*(horiz?1.7:1.9);g.sx1=g.sxE*(horiz?1:1.05);g.lead=horiz?vw*.16:vh*.2;NG=g;
const cs=horiz?cl(Math.min(vw*.04,vh*.066),26,96):cl(vw*.092,28,60),k=E.cards.style,gm=(g.rt[LANES-1]+g.rt[LANES])/2;
k.setProperty('--cs',cs.toFixed(1)+'px');k.setProperty('--cx',m+'px');k.setProperty('--cy',(horiz?gm-cs*.6:Math.max(vh*.13,E.hud.getBoundingClientRect().top+48))+'px')}
function ncamAt(t,n){const zt=eZoom(P(t,T.N0,T.N1-1.2));let sx=Math.exp(L(Math.log(NG.sx0),Math.log(NG.sx1),zt)),pa=softmin(NG.anchor+n*sx,NG.follow,70);
const u=eCrane(P(t,T.TP0,T.TP1));if(u>0){sx=Math.exp(L(Math.log(sx),Math.log(NG.sxE),u));pa=L(pa,-NG.bleed+n*NG.sxE,u)}return{sx,pa,ka:n,ys:NG.rt,sy:(NG.rt[4]-NG.rt[2])/2,u}}
const NX=a=>NC.pa+(a-NC.ka)*NC.sx,NY=c=>{const ys=NC.ys;if(c>=LANES-1)return L(ys[LANES-1],ys[LANES],(c-LANES+1)/(TR-LANES+1));if(c<=0)return ys[0]+c*(ys[1]-ys[0]);const i=Math.floor(c);return L(ys[i],ys[i+1],c-i)};
const scr=(a,c)=>horiz?[NX(a),NY(c)]:[NY(c),NX(a)];
function stroke(g,x0,y0,x1,y1,w,c3,a){if(a<=.004)return;g.lineWidth=w;g.strokeStyle=`rgba(${c3},${Math.min(1,a).toFixed(3)})`;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()}
function glow(g,sp,x,y,s,a){if(a<=.004)return;g.globalAlpha=Math.min(1,a);g.drawImage(sp,x-s/2,y-s/2,s,s);g.globalAlpha=1}
const axes=g=>horiz?g.setTransform(dpr,0,0,dpr,0,0):g.setTransform(0,dpr,dpr,0,0,0);
const mix3=(a,b,p)=>{const A=a.split(','),B=b.split(',');return A.map((v,i)=>Math.round(L(+v,+B[i],p))).join(',')};
function drawNBG(t,n){const g=X2,w=cw2,h=ch2;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
const d=DAWN=cl(.78*sst(250,NM,n)+.22*eExp(P(t,T.N1-.5,T.TP1+1.2))),gr=g.createLinearGradient(0,0,0,h);
gr.addColorStop(0,'rgb(7,10,18)');gr.addColorStop(.55,`rgb(${Math.round(L(7,11,d))},${Math.round(L(10,12,d))},${Math.round(L(18,21,d))})`);gr.addColorStop(1,`rgb(${Math.round(L(7,30,d))},${Math.round(L(10,25,d))},${Math.round(L(18,29,d))})`);g.fillStyle=gr;g.fillRect(0,0,w,h);
if(d>.003){const cx=horiz?w*.82:w*.5,cy=h*(horiz?1.06:1.08),r=horiz?Math.max(w*.66,h*1.05):h*.62,rg=g.createRadialGradient(cx,cy,0,cx,cy,r);
rg.addColorStop(0,`rgba(132,82,50,${(.52*d).toFixed(3)})`);rg.addColorStop(.4,`rgba(76,50,42,${(.32*d).toFixed(3)})`);rg.addColorStop(1,'rgba(30,24,30,0)');g.fillStyle=rg;g.fillRect(0,0,w,h)}}
/* where the main line ends: the preview of the page, in screen px */
function pvRect(n){const ty=NY(TR),xe=NX(n);return horiz?{x:Math.min(xe+16,vw-PV.w-12),y:Math.min(ty-PV.h/2,PV.b-PV.h),w:PV.w,h:PV.h}:{x:cl(ty-PV.w*.5,12,vw-PV.w-12),y:Math.min(xe+14,PV.b-PV.h),w:PV.w,h:PV.h}}
function drawScore(t,n){const g=SCX;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,SC.width,SC.height);axes(g);g.globalCompositeOperation='lighter';g.lineCap='round';
const xNow=NX(n),ty=NY(TR),dim=NDIM,K=Math.min(1.6,NC.sy/59),fur=1-NC.u,x0=NX(0),ly=l=>NY(l),D=night.dec;
if(fur>.01)for(let l=0;l<LANES;l++){const tf=night.firstT[l];if(t<tf)continue;const gr=ePen(P(t,tf-.05,tf+.5));stroke(g,x0,ly(l),L(x0,xNow,gr),ly(l),1,WHITE,.07*dim*fur);
if(gr>=1&&n<NM){const ah=g.createLinearGradient(xNow,0,xNow+NG.lead,0);ah.addColorStop(0,`rgba(${WHITE},${(.07*dim*fur).toFixed(3)})`);ah.addColorStop(1,`rgba(${WHITE},0)`);g.lineWidth=1;g.strokeStyle=ah;g.beginPath();g.moveTo(xNow,ly(l));g.lineTo(xNow+NG.lead,ly(l));g.stroke()}}
const top=ly(0)-16*K,bot=ty+16*K;
{const p=ePen(P(t,T.TB0,T.TB1));if(p>0){const yh=L(top,bot,p),heat=1-eCool(P(t,T.TB1,T.TB1+1.8));stroke(g,x0,top,x0,yh,4,WHITE,(.03+.09*heat)*dim);stroke(g,x0,top,x0,yh,1.2,WHITE,(.2*L(1,.6,NC.u)+.68*heat)*dim);
if(p<1)glow(g,SP.white,x0,yh,28,1);else glow(g,SP.white,x0,bot-16*K,54,.8*Math.exp(-(t-T.TB1)/.32))}}
/* the rebase: a pulse runs along main to the present, then a new line rises from it across every lane */
{const pp=P(t,D.t-.5,D.t),xd=NX(D.u);if(pp>0&&pp<1){const xh=L(NX(Math.max(0,D.u-160)),xd,eIn(pp)),gr=g.createLinearGradient(xh-120,0,xh,0);gr.addColorStop(0,`rgba(${WHITE},0)`);gr.addColorStop(1,`rgba(${WHITE},.9)`);g.lineWidth=2.4;g.strokeStyle=gr;g.beginPath();g.moveTo(xh-120,ty);g.lineTo(xh,ty);g.stroke();glow(g,SP.white,xh,ty,40,.9)}
const p=ePen(P(t,D.t,D.t+.42));if(p>0){const yh=L(bot,top,p),heat=1-eCool(P(t,D.t+.42,D.t+2.4));stroke(g,xd,bot,xd,yh,5,WHITE,(.03+.12*heat)*dim);stroke(g,xd,bot,xd,yh,1.3,WHITE,(.16*L(1,.5,NC.u)+.75*heat)*dim);
if(p<1)glow(g,SP.white,xd,yh,34,1);if(t<D.t+.5)glow(g,SP.white,xd,ty,90,.7*(1-P(t,D.t,D.t+.5)))}}
for(const b of night.bars){const te=b.t+.55,p=ePen(P(t,b.t,te));if(p<=0)continue;const x=NX(b.u),heat=p<1?1:Math.exp(-(t-te)/.7),yh=L(top,bot,p);stroke(g,x,top,x,yh,3,WHITE,.06*heat*dim);stroke(g,x,top,x,yh,1,WHITE,(.06*L(1,.3,NC.u)+.45*heat)*dim);if(p<1)glow(g,SP.plan,x,yh,22,.85)}
/* main: brighter with every merge; it plugs into the preview */
const nd=night.drops.length;let u0=0;
for(let k=0;k<=nd;k++){const u1=Math.min(k<nd?night.drops[k].land:NM,n);if(u1>u0){const f=Math.pow(k/nd,.9);stroke(g,NX(u0),ty,NX(u1),ty,9+5*NC.u,WHITE,(.02+.07*f)*dim);stroke(g,NX(u0),ty,NX(u1),ty,1+1.5*f*fur,WHITE,(.16+.7*f)*L(1,.55,NC.u)*dim)}if(k>=nd||night.drops[k].land>=n)break;u0=night.drops[k].land}
{const pr=pvRect(n),pe=horiz?pr.x:pr.y,a=eSoft(P(t,CARD_T.cA[1]-.15,CARD_T.cA[1]+.35))*(1-eSoft(P(t,T.pg0-.3,T.pg0+.1)));if(pe>xNow+1)stroke(g,xNow,ty,pe,ty,1.2,WHITE,.42*a*dim)}
for(const c of night.cis){if(n<=c.s)continue;const e=Math.min(c.e,n),act=n<c.e,heat=act?1:Math.exp(-(n-c.e)/18),xs=NX(c.s),xe=NX(e);stroke(g,xs,ty,xe,ty,6,GREEN,(.04+.12*heat)*dim);stroke(g,xs,ty,xe,ty,1.8,GREEN,(.4+.5*heat)*dim);
if(act)glow(g,SP.green,xe,ty,30,.9*dim);else{const fl=Math.exp(-(t-c.tt)/.32);glow(g,SP.green,xe,ty,9,.8*dim);glow(g,SP.green,xe,ty,40,.6*fl)}}
for(const d of night.drops){if(n<=d.u)continue;const tau=cl((n-d.u)/(d.land-d.u)),y0=ly(d.lane),px=s=>NX(d.u+(d.land-d.u)*s),py=s=>L(y0,ty,s*s),C=WHITE;
if(tau<1){const s0=Math.max(0,tau-.4);g.beginPath();for(let i=0;i<=8;i++){const s=L(s0,tau,i/8);i?g.lineTo(px(s),py(s)):g.moveTo(px(s),py(s))}const gr=g.createLinearGradient(px(s0),py(s0),px(tau),py(tau));gr.addColorStop(0,`rgba(${WHITE},0)`);gr.addColorStop(1,`rgba(${WHITE},.85)`);g.lineWidth=1.4;g.strokeStyle=gr;g.stroke();glow(g,SP.release,px(tau),py(tau),20,1)}
else{const xl=NX(d.land),fl=Math.exp(-(t-d.tl)/.26),arc=((horiz?.05+.12*NC.u:0)+.3*Math.exp(-(t-d.tl)/.9))*dim,gr=g.createLinearGradient(px(0),py(0),px(1),py(1));gr.addColorStop(0,`rgba(${C},0)`);gr.addColorStop(1,`rgba(${C},${Math.min(1,arc).toFixed(3)})`);
g.beginPath();for(let i=0;i<=10;i++){const s=i/10;i?g.lineTo(px(s),py(s)):g.moveTo(px(s),py(s))}g.lineWidth=1;g.strokeStyle=gr;g.stroke();if(fur>.01)stroke(g,xl,ty-7*K,xl,ty+7*K,1.2,C,(.5*fur+.4*fl)*dim);glow(g,SP.white,xl,ty,62,.9*fl);if(NC.u>0)glow(g,SP.release,xl,ty,26,.4*NC.u*dim)}}
for(const k of night.links){if(t<k.t)continue;const fl=Math.exp(-(t-k.t)/.5),x=NX(k.u);
if(k.kind==='back'){const xa=NX(k.a.e),ya=ly(k.a.lane),xb=NX(k.b.s),yb=ly(k.b.lane),p=ePen(P(t,k.t,k.t+.3));g.beginPath();g.moveTo(xa,ya);g.quadraticCurveTo(L(xa,xb,.2),L(ya,yb,.9),L(xa,xb,p),L(ya,yb,p));g.lineWidth=1;g.strokeStyle=`rgba(${BACK},${((.16*L(1,.4,NC.u)+.45*fl)*dim).toFixed(3)})`;g.stroke();continue}
const ya=ly(k.a.lane),yb=ly(k.b.lane),p=ePen(P(t,k.t,k.t+.2)),dir=Math.sign(yb-ya)||1,gp=5*K,y0=ya+dir*gp,y1=yb-dir*gp,wm=k.kind!=='review';
stroke(g,x,y0,x,L(y0,y1,p),wm?.9:1,wm?WARM:BLUE,((wm?.06:.07)*L(1,.35,NC.u)+(wm?.35:.5)*fl)*dim)}
for(const r of night.runs){if(n<=r.s)continue;const e=Math.min(r.e,n),act=n<r.e,pal=PAL[r.kind],xa=NX(r.s),xb=NX(e),heat=act?1:Math.exp(-(n-r.e)/24),thin=r.kind==='release',zig=r.kind==='impl';
let y=ly(r.lane),fade=1,col=heat>.45?pal.core:pal.cool,hot=pal.hot;
if(r.denied&&r.rv&&t>=r.rv.te){const f=eSoft(P(t,r.rv.te,r.rv.te+.85));fade=L(1,.24,f);y+=f*4*K;col=mix3(col,ASH,f);hot=mix3(hot,ASH,f)}
if(r.stop&&t>=D.t+.2){const f=eSoft(P(t,D.t+.2,D.t+1.1));fade=L(1,.3,f);col=mix3(col,ASH,f*.8)}
if(r.deny&&t>=r.te)fade=L(1,.45,eSoft(P(t,r.te,r.te+.85)));
const A=dim*fade;g.lineCap='round';stroke(g,xa,y,xb,y,thin?4:r.helper?6:8,pal.core,(.05+.1*heat)*A*(r.denied?fade:1));stroke(g,xa,y,xb,y,thin?1.1:zig?.9:.8,col,(zig?.4+.3*heat:r.kind==='review'?.24+.3*heat:.66+.3*heat)*A);g.lineCap='butt';
const tk=r.tk;if(tk.length){const gap=(tk.length>2?(tk[tk.length-2]-tk[0])/(tk.length/2-1):2)*NC.sx,step=gap<2.8?2*Math.ceil(2.8/gap):2,hn=act?n-10:1e9,a=((.5+.36*heat)*A).toFixed(3),amp=K*(r.helper?.42:.62);
if(r.kind==='review'){g.fillStyle=`rgba(${heat>.45?hot:col},${((.62+.38*heat)*A).toFixed(3)})`;for(let i=0;i<tk.length;i+=step){const u=tk[i];if(u>e)break;const x=NX(u),dd=1.2+tk[i+1]*.25;g.fillRect(x-dd/2,y-dd/2,dd,dd)}}
else{let sg=1,st=false;g.beginPath();g.moveTo(xa,y);for(let i=0;i<tk.length;i+=step){const u=tk[i];if(u>e)break;sg=-sg;const x=NX(u),yy=y+sg*tk[i+1]*amp;if(u>hn&&!st){g.lineTo(x,yy);g.lineWidth=1.1;g.strokeStyle=`rgba(${col},${a})`;g.stroke();g.beginPath();g.moveTo(x,yy);st=true}else g.lineTo(x,yy)}
g.lineTo(xb,y);g.lineWidth=st?1.5:1.1;g.strokeStyle=st?`rgba(${hot},.92)`:`rgba(${col},${a})`;g.stroke()}}
/* commits: a saved point on the lane, a small flash when it lands */
for(const c of r.cm){if(n<c.u)break;const x=NX(c.u),fl=Math.exp(-(t-c.t)/.35);g.fillStyle=`rgba(${r.denied?ASH:'255,240,214'},${((.55+.4*fl)*A).toFixed(3)})`;g.beginPath();g.arc(x,y,1.7+1.2*fl,0,7);g.fill();if(fl>.02)glow(g,SP.impl,x,y,22,.8*fl*A)}
if(act){const xt=Math.max(xa,xb-50),gr=g.createLinearGradient(xt,0,xb,0);gr.addColorStop(0,`rgba(${hot},0)`);gr.addColorStop(1,`rgba(${hot},.95)`);g.lineWidth=2.2;g.strokeStyle=gr;g.beginPath();g.moveTo(xt,y);g.lineTo(xb,y);g.stroke();glow(g,SP[r.kind],xb,y,r.helper?26:36,.95);glow(g,SP.white,xb,y,r.helper?6:9,1)}
if(r.stop&&t>=D.t+.1)stroke(g,xb,y-7*K,xb,y+7*K,1.4,WHITE,.7*(1-.6*P(t,D.t+.1,D.t+1.6))*dim);
if(r.deny&&t>=r.te){const f=Math.exp(-(t-r.te)/.6);stroke(g,xb+2,y-6*K,xb+2,y+6*K,1.4,RED,(.3+.4*f)*dim);glow(g,SP.red,xb,y,26,.35*f)}
if(t>=r.ts&&t<r.ts+.7)glow(g,SP[r.kind],xa,y,r.dec?64:r.helper?34:52,(r.dec?1:.9)*Math.pow(1-(t-r.ts)/.7,2))}
if(fur>.01){const p=ePen(P(t,T.N1-.35,T.N1+.2));if(p>0){const x=NX(NM),yh=L(top,bot,p);stroke(g,x-6,top,x-6,yh,1,WHITE,.55*dim*fur);stroke(g,x,top,x,yh,3,WHITE,.6*dim*fur);if(p<1)glow(g,SP.white,x,yh,28,.95)}}}
function ncomp(a){const g=X2;g.setTransform(1,0,0,1,0,0);g.globalAlpha=a;g.globalCompositeOperation='lighter';g.drawImage(SC,0,0);
let src=SC;[2.2,2.6,3].forEach((r,i)=>{const x=NBX[i],c=NB[i];x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.clearRect(0,0,c.width,c.height);if(FILTER)x.filter=`blur(${r}px)`;x.drawImage(src,0,0,c.width,c.height);if(FILTER)x.filter='none';src=c});
/* the three bloom levels are summed at quarter size and drawn full size once: three full-size upscales were what held the night at 30 fps on large retina screens */
const u=NC.u,x=NBS,cb=x.canvas;x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.clearRect(0,0,cb.width,cb.height);x.globalCompositeOperation='lighter';[.9,.75+.2*u,.18+.72*u].forEach((al,i)=>{x.globalAlpha=al;x.drawImage(NB[i],0,0,cb.width,cb.height)});
g.globalAlpha=a;g.imageSmoothingQuality='low';g.drawImage(cb,0,0,cw2,ch2);g.imageSmoothingQuality='high';g.globalAlpha=1;g.globalCompositeOperation='source-over'}
/* the product of the night: the page where main ends, changing at each merge. Steps fade in over whatever is on screen, so a quick merge never makes it jump */
function preview(t,n,a,ia){const i=pvAt(t),e=night.pv[i],r=pvRect(n),c=X2,W=r.w*dpr,H=r.h*dpr,x=r.x*dpr,y=r.y*dpr;if(a<=.003)return;ia=ia??1;
const fl=i?Math.exp(-(t-e.t)/.5):0;c.setTransform(1,0,0,1,0,0);
if(ia>0)dropShadow(x,y,W,H,(.5+.35*fl)*a*ia,'255,214,160',26);
let j=i;while(j>0&&eSoft(P(t,night.pv[j].t,night.pv[j].t+night.pv[j].fd))<1)j--;
for(let q=j;q<=i&&ia>0;q++){const p=night.pv[q],al=q===j?1:eSoft(P(t,p.t,p.t+p.fd));if(al<=0)continue;c.globalAlpha=a*ia*al;c.drawImage(pageBmp(p.k,W,H,p.s),x,y,W,H)}c.globalAlpha=1;
const fs=(narrow?10:11)*dpr;c.font=`400 ${fs}px ${MONO}`;c.textBaseline='alphabetic';const tag='main',vv='v'+e.v,gap=fs*.6,tw=c.measureText(tag).width,vw2=c.measureText(vv).width,ty=y-6*dpr;
c.globalAlpha=a;c.fillStyle='rgba(7,10,18,.7)';rr(c,x-3*dpr,ty-fs*1.05,tw+gap+vw2+6*dpr,fs*1.45,2*dpr);c.fill();c.fillStyle='#9a9caa';c.fillText(tag,x,ty);c.fillStyle=fl>.05?rgb(mixC([242,241,236],[255,216,160],fl)):'#f2f1ec';c.fillText(vv,x+tw+gap,ty);c.globalAlpha=1}
/* the words: small mono labels at the first clear occurrence; later events stay unlabelled */
function words(t){const g=X2;g.setTransform(1,0,0,1,0,0);const fs=(narrow?10.5:11.5)*dpr;g.font=`400 ${fs}px ${MONO}`;g.textBaseline='middle';
for(const l of night.W){const a=eSoft(P(t,l.t,l.t+.3))*(1-eSoft(P(t,l.t+1.55,l.t+1.9)));if(a<=0)continue;const[x,y]=scr(l.u,l.c),tw=g.measureText(l.w).width;let X,Y;
if(horiz){X=x*dpr-(l.top?tw/2:l.r?tw-4*dpr:0);Y=(l.top?NY(0)-16*Math.min(1.6,NC.sy/59)-14:l.b?y+17:y-15)*dpr}else{X=l.c===TR?x*dpr-11*dpr-tw:x*dpr+(l.top?6:11)*dpr;Y=(l.top?y-11:l.r?y-24:y)*dpr}
g.globalAlpha=a;g.fillStyle='rgba(7,10,18,.8)';rr(g,X-5*dpr,Y-fs*.8,tw+10*dpr,fs*1.6,2*dpr);g.fill();g.fillStyle='#f2efe6';g.fillText(l.w,X,Y+.5*dpr)}g.globalAlpha=1}
function renderNight(t,bg,a){const n=nightAt(t);NC=ncamAt(t,n);NDIM=L(1,1.22,NC.u);if(bg)drawNBG(t,n);if(t>=T.TB0-.05){drawScore(t,n);ncomp(a??1)}
if(t>=T.N0&&t<T.pg1){preview(t,n,(a??1)*eSoft(P(t,CARD_T.cA[1]-.1,CARD_T.cA[1]+.4))*(1-eSoft(P(t,T.pg0,T.pg0+.25))),t<T.pg0?1:0);words(t)}}
