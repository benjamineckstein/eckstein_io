/* ---------- I: everybody gets the same page. Ib: everybody iterates a little and most stop. II: ours keeps going ---------- */
const N=10,GP=.08,HI=4,HJ=4,OI=HJ*N+HI,DG=.06,XF=.55;
const CV=$('cv');let X2=CV.getContext('2d');
let vw=innerWidth,vh=innerHeight,dpr=1,A=1,narrow=vw<640,cw2=0,ch2=0,APP,AFD,VARI,F0,FR,FULL,OC,FRONT,VPF,MIP=[],TS=[],TBM=new Map(),TW0=100,OWNR=[],OSP=[],OVR=null;
/* the hundred get the same page, each in their own colour: VAR is ours, then the template once per colour; POOL holds the small changes they make in it while iterating */
const HUES=[30,60,92,150,184,214],PW=3,VAR=[Object.assign({},VS[1]),...HUES.map(hue=>Object.assign({},VS[1],{anon:1,hue}))],POOL=[];
{const q=mul(77);for(let i=0;i<HUES.length*PW;i++)POOL.push(Object.assign({},VS[1],{h:Math.round((q()*2-1)*12),bx:.4+q()*.2,by:.38+q()*.12,bw:.48+q()*.18,full:q()<.6,seed:11+i*13,anon:1,hue:HUES[Math.floor(i/PW)]}))}
function plan(){const r=mul(11);APP=new Float32Array(N*N);AFD=new Float32Array(N*N).fill(.3);VARI=new Uint8Array(N*N);
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,inb=(c0,n)=>i>=c0&&i<c0+n&&j>=c0&&j<c0+n,d=Math.hypot(i-HI,j-HJ);let a;
if(k===OI)a=T.pop;else{const g=inb(4,2)?0:inb(2,5)?1:2;a=STG[g][0]-(g?.55:.3)+d*.02;AFD[k]=.6}
APP[k]=a+(k===OI?0:r()*.04);let v;do v=1+Math.floor(r()*HUES.length);while((i&&VARI[k-1]===v)||(j&&VARI[k-N]===v)||(i&&j&&VARI[k-N-1]===v)||(j&&i<N-1&&VARI[k-N+1]===v));VARI[k]=k===OI?0:v}
/* every other tile makes one to three small changes, then stops for good: v2, v3 or v4. Each change steps to another of the changes in their own colour */
const q=mul(23);TS=[];for(let k=0;k<N*N;k++){if(k===OI){TS.push(null);continue}const u=q(),n=u<.42?1:u<.78?2:3,ct=[],seq=[],c0=(VARI[k]-1)*PW;let t=T.itA+q()*1.05,p=-1,w=0;
for(let j=0;j<n;j++){ct.push(t);let x;do x=Math.floor(q()*20);while(x===p);p=x;w=j?(w+1+x%(PW-1))%PW:x%PW;seq.push(c0+w);t+=.72+q()*.5}TS.push({ct,seq,st:ct[n-1]+.4+q()*.3})}
const last=TS.filter(Boolean).sort((a,b)=>b.st-a.st);last[0].st=Math.max(last[0].st,T.hl0-.1);
OWNR=new Array(N*N).fill(-1);[...Array(N*N).keys()].filter(k=>k!==OI).sort((a,b)=>APP[a]-APP[b]||a-b).forEach((k,j)=>OWNR[k]=j)}
const going=t=>1+TS.reduce((n,s)=>n+(s&&t<s.st?1:0),0);
const lc=(a,b,p)=>({cx:L(a.cx,b.cx,p),cy:L(a.cy,b.cy,p),s:a.s*Math.pow(b.s/a.s,p)});
function frames(){const pw=1+GP,ph=1/A+GP,hs=vw*(narrow?.72:.6);
F0={cx:HI*pw+.5,cy:HJ*ph+.5/A-(vh*.05)/hs,s:hs};OC={cx:HI*pw+.5,cy:HJ*ph+.5/A};
const blk=(c0,n,f)=>{const w=n*pw-GP,h=n*ph-GP;return{cx:c0*pw+w/2,cy:c0*ph+h/2,s:Math.min(vw*f/w,vh*f/h)}},gw=N*pw-GP,gh=N*ph-GP;
FULL={cx:gw/2,cy:gh/2,s:Math.max(vw/gw,vh/gh)*1.04};FR=[blk(4,2,.8),blk(2,5,.9),FULL];
const fw=narrow?vw*.72:Math.min(vw*.54,vh*.6*A),fh=fw/A;
FRONT=narrow?{x:vw/2,y:Math.min(vh-fh/2-vh*.035,Math.max(vh*.58,fh/2+vh*.2)),w:fw,h:fh}:{x:vw*.42,y:vh*.57,w:fw,h:fh};
VPF=narrow?[vw*.5,FRONT.y-fh/2-vh*.3]:[vw*.99,vh*.02];MIP=[];TBM.clear();TW0=Math.round(FULL.s*dpr*1.12);OSP=[];
const rw=Math.round(FR[0].s*dpr*1.02);OVR=lay(rw,Math.round(rw/A),VAR[1]).ov;OVR.ref=rw}
/* the owner's name and greeting, drawn over a template tile: one small sprite pair per person, scaled with the tile */
function ownerSprite(k){if(OSP[k])return OSP[k];const nm=OWN[OWNR[k]%OWN.length],o=OVR,bs=Math.max(8,Math.ceil(o.bs*o.ref*1.25)),pad=Math.ceil(bs*.3);
const mk=(txt,font,sz,col)=>{MC.font=font;if(HASLS)MC.letterSpacing='0px';const w=Math.ceil(MC.measureText(txt).width)+pad*2,c=cvs(w,Math.ceil(sz*1.6)),g=c.getContext('2d');g.font=font;g.fillStyle=col;g.textBaseline='middle';g.fillText(txt,pad,c.height/2);return c};
let h=null,hs=0;if(o.gs){hs=Math.max(8,Math.ceil(o.gs*o.ref*1.25));const tx=PAGE[lang].hi.replace('Benjamin',nm),f=`${o.gw} ${hs}px ${SYS}`;MC.font=f;const tw=MC.measureText(tx).width,r0=o.gr*hs,gp=o.gg*hs;
h=cvs(tw+gp+2*r0+pad*2+r0*1.4,Math.ceil(hs*1.9));const g=h.getContext('2d');g.font=f;g.fillStyle=o.gcol;g.textBaseline='middle';g.fillText(tx,pad,h.height/2);wave(g,pad+tw+gp+r0,h.height/2,r0);h.cw=tw+gp+2*r0}
return OSP[k]={b:mk(nm,`${o.bw} ${bs}px ${SYS}`,bs,o.bc),h,hs,bs,pad}}
function ownerOv(k,x,y,w,al,ov){if(k===OI||!ov||al<=.01)return;const sp=ownerSprite(k),c=X2,W=w*dpr,X=x*dpr,Y=y*dpr;c.globalAlpha=al;
let s=ov.bs*W/sp.bs;c.drawImage(sp.b,X+ov.bx*W-sp.pad*s,Y+ov.by*W-sp.b.height/2*s,sp.b.width*s,sp.b.height*s);
if(sp.h&&ov.gs){s=ov.gs*W/sp.hs;c.drawImage(sp.h,X+ov.gx*W-(ov.gc?sp.h.cw/2:0)*s-sp.pad*s,Y+ov.gy*W-sp.h.height/2*s,sp.h.width*s,sp.h.height*s)}c.globalAlpha=1}
/* the camera: the zoom-out to the hundred, a slow drift toward ours while they iterate, then the push-in as ours lifts out */
function camW(t){let c=F0;for(let k=STG.length-1;k>=0;k--)if(t>=STG[k][0]){c=lc(k?FR[k-1]:F0,FR[k],sst(STG[k][0],STG[k][0]+STG[k][1],t));break}
const dr=eSoft(P(t,STG[2][0]+.6,T.fw0)),pz=eIO(P(t,T.fw0-.15,T.fw1+.35)),dn=eSoft(P(t,T.fw1,T.nf1));
if(dr>0||pz>0){const m=.22*dr+.6*pz;c={cx:L(c.cx,OC.cx,m),cy:L(c.cy,OC.cy,m),s:c.s*(1+.05*dr+.3*pz+.04*dn)}}return c}
function bmp(st,W,H){const c=cvs(W,H),o=(st.g?layG:lay)(c.width,c.height,st);paintPage(c.getContext('2d'),o);if(o.ov)c.ov=o.ov;return c}
function mipLevels(vi){const r=[];for(let w=Math.round((vi?FR[0].s:F0.s)*dpr*1.02);;w=Math.round(w/2)){r.push(w);if(w<=110)break}return r}
function mipBuild(vi,j){const m=MIP[vi]||(MIP[vi]=[]);if(!m[j]){const w=mipLevels(vi)[j];m[j]=bmp(VAR[vi],w,w/A)}}
function mipFor(vi,dw){let m=MIP[vi];const n=mipLevels(vi).length;if(!m||m.length<n||m.includes(undefined)){for(let j=0;j<n;j++)mipBuild(vi,j);m=MIP[vi]}
let b=m[0];for(const c of m)if(c.width>=dw*.98)b=c;return b}
/* a design state at wall size, cached */
function tb(st,key){const k=lang+key;let c=TBM.get(k);if(!c){c=bmp(st,TW0,TW0/A);TBM.set(k,c)}return c}
function tile(vi,x,y,w,al){const W=w*dpr,m=mipFor(vi,W);X2.globalAlpha=al;X2.drawImage(m,x*dpr,y*dpr,W,W/A);X2.globalAlpha=1;return m.ov}
function tileRect(i,j,cam,t){const pw=1+GP,ph=1/A+GP,s=cam.s,k=j*N+i,a0=APP[k],pp=P(t,a0,a0+.55),sc=pp<1?L(.9,1,ePop(pp)):1,w=s*sc,h=w/A;
return{x:vw/2+(i*pw-cam.cx)*s+(s-w)/2,y:vh/2+(j*ph-cam.cy)*s+(s/A-h)/2+(1-eOut(pp))*s/A*.06,w,h,al:eSoft(P(t,a0,a0+AFD[k]))}}
/* the state of one tile at t: previous and current bitmap, crossfade, version shown, how far it has settled */
function tileAt(k,t){if(t<T.itA)return null;let ct,bm,n=0;
if(k===OI){while(n<OURS.length&&t>=OURS[n][0])n++;if(!n)return null;const cur=OURS[n-1][1],prv=n>1?OURS[n-2][1]:0,p=eSoft(P(t,OURS[n-1][0],OURS[n-1][0]+XF));
return{a:prv?tb(VS[prv],'v'+prv):null,b:tb(VS[cur],'v'+cur),p,v:p<.5?cur-1:cur,st:0}}
const s=TS[k];while(n<s.ct.length&&t>=s.ct[n])n++;if(!n)return null;const p=eSoft(P(t,s.ct[n-1],s.ct[n-1]+XF));
return{a:n>1?tb(POOL[s.seq[n-2]],'p'+s.seq[n-2]):null,b:tb(POOL[s.seq[n-1]],'p'+s.seq[n-1]),p,v:p<.5?n:n+1,st:eSoft(P(t,s.st,s.st+.7))}}
function chip(x,y,w,v,col,al){const c=X2,fs=cl(w*.075,7,11.5),tx='v'+v;c.font=`400 ${(fs*dpr).toFixed(1)}px ${MONO}`;const tw=c.measureText(tx).width,pd=fs*.42*dpr,X=(x+w*.035)*dpr,Y=(y+w*.035)*dpr,H=fs*1.5*dpr;
c.globalAlpha=al;c.fillStyle='rgba(8,9,13,.8)';rr(c,X,Y,tw+pd*2,H,1.5*dpr);c.fill();c.fillStyle=col;c.textBaseline='middle';c.fillText(tx,X+pd,Y+H/2+.5*dpr);c.globalAlpha=1}
/* the shape that casts the shadow sits outside the canvas, so only the shadow lands on screen */
function dropShadow(x,y,w,h,a,col,blur){if(a<=.003)return;const c=X2,o=cw2+4000;c.save();c.globalAlpha=1;c.shadowColor=col?`rgba(${col},${a.toFixed(3)})`:`rgba(0,0,0,${a.toFixed(3)})`;c.shadowBlur=(blur||40)*dpr;c.shadowOffsetX=o;c.shadowOffsetY=col?0:12*dpr;c.fillStyle='#000';rr(c,x+2-o,y+2,w-4,h-4,tr(w,h));c.fill();c.restore()}
function wall(t,cam,skip){const ca=eSoft(P(t,T.it0,T.it0+.45)),hl=eSoft(P(t,T.hl0,T.hl0+.6));let mine=null;
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(t<APP[k]||(skip&&k===OI))continue;const r=tileRect(i,j,cam,t);if(r.x>vw||r.y>vh||r.x+r.w<0||r.y+r.h<0)continue;
const s=tileAt(k,t),sc=s&&s.st?1-.035*s.st:1,w=r.w*sc,x=r.x+(r.w-w)/2,y=r.y+(r.h-w/A)/2;
if(k===OI&&hl>0){dropShadow(x*dpr,y*dpr,w*dpr,w/A*dpr,.75*hl,'255,190,110',34);mine=[x,y,w]}
if(!s)ownerOv(k,x,y,w,r.al,tile(VARI[k],x,y,w,r.al));else{if(s.p<1){if(s.a){X2.drawImage(s.a,x*dpr,y*dpr,w*dpr,w/A*dpr)}else tile(VARI[k],x,y,w,1)}X2.globalAlpha=s.p;X2.drawImage(s.b,x*dpr,y*dpr,w*dpr,w/A*dpr);X2.globalAlpha=1;ownerOv(k,x,y,w,1,s.b.ov)}
if(s&&s.st>0){rr(X2,x*dpr,y*dpr,w*dpr,w/A*dpr,tr(w,w/A)*dpr);X2.fillStyle=`rgba(8,9,13,${(.42*s.st).toFixed(3)})`;X2.fill()}
if(ca>0)chip(x,y,w,s?s.v:1,k===OI&&hl>0?rgb(mixC([242,241,236],[255,216,160],hl)):rgb(mixC([242,241,236],[132,134,146],s?s.st:0)),ca)}
if(mine){const[x,y,w]=mine;X2.globalAlpha=hl;X2.strokeStyle='#ffd8a0';X2.lineWidth=1.5*dpr;rr(X2,x*dpr,y*dpr,w*dpr,w/A*dpr,tr(w,w/A)*dpr);X2.stroke();X2.globalAlpha=1}}
function skel(t,cam){const a=eSoft(P(t,T.sh0,T.sh0+.3))*(1-eSoft(P(t,T.pop,T.pop+.25)));if(a<=0)return;const c=X2,pw=1+GP,ph=1/A+GP;
const x=(vw/2+(HI*pw-cam.cx)*cam.s)*dpr,y=(vh/2+(HJ*ph-cam.cy)*cam.s)*dpr,W=cam.s*dpr,H=W/A,u=W/100;
c.globalAlpha=a;rr(c,x,y,W,H,tr(W,H));c.fillStyle='rgba(255,255,255,.04)';c.fill();c.strokeStyle='rgba(255,255,255,.1)';c.lineWidth=dpr;c.stroke();
const q=((t-T.sh0)/.85)%1,gx=x+L(-.4,1.4,q)*W,g=c.createLinearGradient(gx-W*.3,0,gx+W*.3,0);g.addColorStop(0,'rgba(255,255,255,.07)');g.addColorStop(.5,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,.07)');c.fillStyle=g;
const bars=A<1?[[30,12,40,2.6],[12,20,76,4.4],[18,26,64,4.4],[20,33,60,1.8],[8,40,84,5.2],[8,51,84,11],[8,64,84,11]]:[[36,17,28,2.6],[22,26,56,6],[28,35,44,6],[30,45,40,2],[34,52,32,5],[8,66,26,22],[37,66,26,22],[66,66,26,22]];
for(const b of bars){rr(c,x+b[0]*u,y+b[1]*H/100,b[2]*u,b[3]*H/100,Math.min(b[3]*H/200,1.4*u));c.fill()}c.globalAlpha=1}
/* the stack: a version comes in front and the earlier ones step back toward the vanishing point; a revert takes the front one back out */
const LAY=A2.map(([t,ty,v])=>({v,t}));
function depth(l,t){let d=l.v===5?0:ePush(P(t,l.t,l.t+VD))-1;for(const[pt]of A2)if(pt>l.t)d+=ePush(P(t,pt,pt+VD));return d}
const depthOf=d=>{const k=Math.floor(d),f=d-k;return k+cl((f-.4)/.6)};
function layerAt(d){if(d<0)return{x:FRONT.x,y:FRONT.y,w:FRONT.w,h:FRONT.h,al:cl((d+1)/.4)};d=depthOf(d);const f=1/(1+d*DG),m=1-f;return{x:L(FRONT.x,VPF[0],m),y:L(FRONT.y,VPF[1],m),w:FRONT.w*f,h:FRONT.h*f,al:1}}
let PC=new Map();
function pageBmp(k,W,H,st){W=Math.round(W);H=Math.round(H);const key=lang+'|'+k+'|'+W+'|'+H;let c=PC.get(key);if(c)return c;
if(PC.size>80)PC=new Map();c=bmp(st||VS[k],W,H);PC.set(key,c);return c}
function sheet(k,r,dim,shadow){const W=Math.round(FRONT.w*dpr),H=Math.round(FRONT.h*dpr),x=(r.x-r.w/2)*dpr,y=(r.y-r.h/2)*dpr,w=r.w*dpr,h=r.h*dpr,c=X2;
if(shadow)dropShadow(x,y,w,h,.55*Math.pow(r.al,6));c.globalAlpha=r.al;c.drawImage(pageBmp(k,W,H),x,y,w,h);
if(dim>0){rr(c,x,y,w,h,tr(w,h));c.fillStyle=`rgba(8,9,13,${dim.toFixed(3)})`;c.fill()}c.globalAlpha=1}
function actII(t){const cam=camW(t),lf=eIO(P(t,T.fw0,T.fw1)),dm=.64*sst(T.fw0-.2,T.fw0+1.3,t),c=X2;
wall(t,cam,1);if(dm>0){c.fillStyle=`rgba(8,9,13,${dm.toFixed(3)})`;c.fillRect(0,0,cw2,ch2)}
if(lf<1){const w=tileRect(HI,HJ,cam,t),hl=1-eSoft(P(t,T.fw0+.2,T.fw1)),r={x:L(w.x+w.w/2,FRONT.x,lf),y:L(w.y+w.h/2,FRONT.y,lf),w:w.w*Math.pow(FRONT.w/w.w,lf),h:0,al:1};r.h=r.w/A;
if(hl>0)dropShadow((r.x-r.w/2)*dpr,(r.y-r.h/2)*dpr,r.w*dpr,r.h*dpr,.75*hl,'255,190,110',34);sheet(5,r,0,lf>.05);return}
const ls=[];for(const l of LAY){const d=depth(l,t);if(d<-1)continue;ls.push([d,l])}ls.sort((a,b)=>b[0]-a[0]);
for(const[d,l]of ls){const r=layerAt(d);if(r.al<=0)continue;const de=d>0?depthOf(d):0;sheet(l.v,r,de>0?Math.min(.62,.05+de*.075):0,d<.6)}}
function nightFall(t){const e=P(t,T.nf0,T.nf1);if(e<=0)return;const E2=2.2*vh,fy=L(-E2,vh,e),g=X2.createLinearGradient(0,fy*dpr,0,(fy+E2)*dpr);
g.addColorStop(0,'rgba(7,10,18,1)');g.addColorStop(1,'rgba(7,10,18,0)');X2.fillStyle=g;X2.fillRect(0,0,cw2,ch2)}
function actI(t){if(t<T.sh0)return;const cam=camW(t);skel(t,cam);wall(t,cam,0)}
