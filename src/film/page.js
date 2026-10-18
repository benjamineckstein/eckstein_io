/* ---------- the page: one renderer, one design state per version ---------- */
const cvs=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const MC=cvs(8,8).getContext('2d'),HASLS='letterSpacing'in MC;
function mw(s,wt,sz,ff,ls){MC.font=`${wt} ${sz.toFixed(2)}px ${ff}`;if(HASLS)MC.letterSpacing=(ls||0).toFixed(3)+'px';return MC.measureText(s).width}
function rr(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
const tr=(W,H)=>W<H?W*.075:W*.012;
const SPREAD=.4,TINTS=new Map(),luma=([r,g,b])=>.299*r+.587*g+.114*b;
function hslRgb(H,S,Lt){const s=S/100,l=Lt/100,q=s*Math.min(l,1-l),k=n=>(n+H/30)%12;return[0,8,4].map(n=>l-q*Math.max(-1,Math.min(k(n)-3,9-k(n),1)))}
function toLab(rgb){const[r,g,b]=rgb.map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)),x=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),y=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),z=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
return[.2104542553*x+.793617785*y-.0040720468*z,1.9779984951*x-2.428592205*y+.4505937099*z,.0259040371*x+.7827717662*y-.808675766*z]}
function fromLab(L,a,b){const x=(L+.3963377774*a+.2158037573*b)**3,y=(L-.1055613458*a-.0638541728*b)**3,z=(L-.0894841775*a-1.291485548*b)**3;
return[4.0767416621*x-3.3077115913*y+.2309699292*z,-1.2684380046*x+2.6097574011*y-.3413193965*z,-.0041960863*x-.7034186147*y+1.707614701*z]}
const PURPLE=(([,a,b])=>Math.atan2(b,a))(toLab(hslRgb(262,84,62)));
function tint(H,S,Lt,a,hue){if(hue==null)return a==null?`hsl(${H},${S}%,${Lt}%)`:`hsla(${H},${S}%,${Lt}%,${a})`;const key=[H,S,Lt,hue]+'';let c=TINTS.get(key);
if(!c){const rgb=hslRgb(H,S,Lt),[,A,B]=toLab(rgb),d=Math.atan2(B,A)-PURPLE,t=hue*Math.PI/180+SPREAD*Math.atan2(Math.sin(d),Math.cos(d)),C=Math.hypot(A,B),Y=luma(rgb),
at=(L,k)=>fromLab(L,k*Math.cos(t),k*Math.sin(t)),fit=L=>{let lo=0,hi=C;for(let i=0;i<16;i++){const m=(lo+hi)/2;if(at(L,m).every(v=>v>=0&&v<=1))lo=m;else hi=m}return at(L,lo).map(v=>v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055)};
let l0=0,l1=1;for(let i=0;i<16;i++){const m=(l0+l1)/2;if(luma(fit(m))<Y)l0=m;else l1=m}
c=fit((l0+l1)/2).map(v=>Math.round(255*cl(v))).join(',');TINTS.set(key,c)}
return a==null?`rgb(${c})`:`rgba(${c},${a})`}
function gl(c,x0,x1,h,hue){const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,tint(262+h,84,62,null,hue));g.addColorStop(1,tint(222+h,90,57,null,hue));return g}
function pill(c,x,y,w,h,fill,stroke,lw,rad){rr(c,x,y,w,h,h/2*(rad??1));c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function wave(c,x,y,r){c.fillStyle='#fbbf24';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle='#f59e0b';c.lineWidth=r*.2;c.lineCap='round';
c.beginPath();c.arc(x,y,r*1.6,-1.3,-.5);c.stroke();c.beginPath();c.arc(x,y,r*2.15,-1.22,-.58);c.stroke();c.lineCap='butt'}
function icon(c,x,y,s,h,k,hue){rr(c,x,y,s,s,s*.29);c.fillStyle=tint(262+h,90,95,null,hue);c.fill();c.strokeStyle=gl(c,x+s*.2,x+s*.8,h,hue);c.lineWidth=Math.max(.7,s*.075);c.lineJoin=c.lineCap='round';
const M=(a,b)=>c.moveTo(x+a*s,y+b*s),N2=(a,b)=>c.lineTo(x+a*s,y+b*s);c.beginPath();
if(k===0){M(.26,.68);N2(.44,.5);N2(.56,.6);N2(.75,.38);M(.6,.37);N2(.75,.37);N2(.75,.52)}
else if(k===1){M(.56,.2);N2(.32,.56);N2(.5,.56);N2(.44,.8);N2(.68,.43);N2(.5,.43);c.closePath()}
else{M(.5,.2);N2(.74,.3);N2(.72,.54);c.quadraticCurveTo(x+.68*s,y+.72*s,x+.5*s,y+.8*s);c.quadraticCurveTo(x+.32*s,y+.72*s,x+.28*s,y+.54*s);N2(.26,.3);c.closePath()}
c.stroke();c.lineCap='butt';c.lineJoin='miter'}
const BLS={};function blobSp(h,seed,hue){const key=h+'|'+seed+'|'+hue;if(BLS[key])return BLS[key];const c=cvs(200,200),g=c.getContext('2d'),r=mul(seed);
const B=(x,y,rad,H,sat,lt,a)=>{const q=g.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,tint(H,sat,lt,a,hue));q.addColorStop(1,tint(H,sat,lt,0,hue));g.fillStyle=q;g.fillRect(0,0,200,200)};
B(78+r()*10,100,78,266+h,92,70,.8);B(122-r()*10,104,76,222+h,95,64,.75);B(100,70+r()*10,52,312+h,88,80,.5);return BLS[key]=c}
/* the night, painted into the page: lanes of agent work, review, merges into a main line, dawn. n: 1-2 a framed panel, 3 full-bleed */
function nightArt(g,x,y,w,h,n,seed){if(!(Math.min(w,h)>=1))return;if(h>w*1.6){g.save();g.translate(x,y+h);g.rotate(-Math.PI/2);nightArt(g,0,0,h,w,n,seed);g.restore();return}
g.save();if(n<3)rr(g,x,y,w,h,Math.min(w,h)*.025);else{g.beginPath();g.rect(x,y,w,h)}if(n<4){g.fillStyle='#0b0d15';g.fill()}g.clip();
const r=mul(seed),k=Math.min(w,h),f=n<3,nl=f?2+n:5,top=y+h*(f?.16:.13),bot=y+h*(f?.66:.7),my=y+h*(f?.84:.86),lw=Math.max(.55,k*.0045),xs=x+w*.06;
if(n>1){const q=g.createRadialGradient(x+w*.88,y+h*1.04,0,x+w*.88,y+h*1.04,Math.max(w,h)*.85);q.addColorStop(0,`rgba(150,92,54,${f?.3:.5})`);q.addColorStop(1,'rgba(30,24,30,0)');g.fillStyle=q;g.fillRect(x,y,w,h)}
g.lineCap='round';g.lineJoin='round';const ln=(x0,y0,x1,y1,c,a,wd)=>{g.strokeStyle=`rgba(${c},${a})`;g.lineWidth=wd||lw;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()},
gw=(x0,y0,rd,c,a)=>{const q=g.createRadialGradient(x0,y0,0,x0,y0,rd);q.addColorStop(0,`rgba(255,255,255,${a})`);q.addColorStop(.2,`rgba(${c},${a*.8})`);q.addColorStop(1,`rgba(${c},0)`);g.fillStyle=q;g.fillRect(x0-rd,y0-rd,rd*2,rd*2)};
ln(xs,top-h*.06,xs,my,'236,232,220',.3);const lands=[];
for(let i=0;i<nl;i++){const ly=L(top,bot,i/(nl-1));ln(xs,ly,x+w,ly,'236,232,220',.07);let sx=xs+w*(.02+.1*r()),last=0;
while(!last){const len=w*(.16+.18*r());let ex=sx+len;if(ex>x+w*.9){ex=x+w*(.9+.06*r());last=1}const zx=ex-len*.24;let s=1,b=0;g.strokeStyle='rgba(255,186,96,.88)';g.lineWidth=lw;g.beginPath();g.moveTo(sx,ly);
for(let xx=sx;xx<zx;xx+=k*.016){if(b<=0&&r()<.12)b=3+r()*5;const a=k*(b-->0?.03+.02*r():.006+.01*r());s=-s;g.lineTo(xx,ly+s*a)}g.lineTo(zx,ly);g.stroke();
g.fillStyle='rgba(200,218,248,.8)';for(let xx=zx+k*.012;xx<ex-k*.008;xx+=k*.014)g.fillRect(xx-lw*.6,ly-lw*.6,lw*1.2,lw*1.2);
if(last&&r()<.75)gw(ex,ly,k*.07,'255,186,96',.9);else{const lx=ex+w*.03;ln(zx,ly,ex,ly,'200,218,248',.25);g.strokeStyle='rgba(236,232,220,.3)';g.lineWidth=lw*.8;g.beginPath();g.moveTo(ex,ly);g.quadraticCurveTo(lx,ly,lx,my);g.stroke();lands.push(lx)}sx=ex+w*(.03+.07*r())}}
const me=Math.max(...lands,x+w*.6);ln(xs,my,me,my,'244,240,232',.9,lw*1.6);for(const lx of lands){ln(lx,my-k*.016,lx,my+k*.016,'244,240,232',.8);g.fillStyle='rgba(127,214,164,.85)';g.fillRect(lx+k*.008,my-lw,k*.02,lw*2)}gw(me,my,k*.05,'255,244,226',.8);g.restore()}
function parse(str){return str.split(' ').map(w=>{const o=[],re=/\[\[(.+?)\]\]/g;let last=0,m;while((m=re.exec(w))){if(m.index>last)o.push({s:w.slice(last,m.index),k:0});o.push({s:m[1],k:1});last=re.lastIndex}if(last<w.length)o.push({s:w.slice(last),k:0});return o})}
/* lays out a paragraph; y is the middle of the first line; ' | ' forces a break */
function para(o,str,x,y,maxW,sz,wt,ff,col,lh,al,ls,ex){const ws=parse(str),sp=mw(' ',wt,sz,ff,ls),lines=[];let cur=[],w=0;
for(const wd of ws){if(wd.length===1&&wd[0].s==='|'){lines.push([cur,w]);cur=[];w=0;continue}const ww=wd.reduce((a,g)=>a+mw(g.s,wt,sz,ff,ls),0);if(cur.length&&w+sp+ww>maxW){lines.push([cur,w]);cur=[];w=0}w+=(cur.length?sp:0)+ww;cur.push(wd)}
if(cur.length)lines.push([cur,w]);
lines.forEach(([ln,lw],i)=>{let cx=al==='c'?x-lw/2:al==='r'?x-lw:x;const yy=y+i*lh,id=o.nl++;
ln.forEach(wd=>{for(const g of wd){const gw=mw(g.s,wt,sz,ff,ls);o.ops.push(Object.assign({s:g.s,x:cx,y:yy,w:gw,sz,wt,ff,col,ls,k:g.k,ln:id},ex));cx+=gw}cx+=sp})});
return lines.length}
/* a design state: al align, ff typeface, hw/hz headline weight and size, hc headline copy, hi greeting, colours bg/ik/mu/nv/ac (ac 0 = the purple gradient),
   bl blob, cd 1 cards 2 rules 3 numbered rules 4 index, nav, cta, sq radius 2 px, ey eyebrow, rh spacing, me measure, art night panel, nm the name, anon a template for the hundred,
   hue the owner's own accent (OKLCH hue; none: the purple) */
function lay(W,H,st){const u=W/100,mob=W<H,s=PAGE[lang],h=st.h||0,hue=st.hue,cen=!st.al,FF=st.ff?SANS:SYS,O=[],o={W,H,mob,ops:O,nl:0,kf:1,ox:0,oy:0,bg:st.bg,st},
IK=st.ik,MU=st.mu,NAV=st.nv||MU,rad=st.sq?.1:1,HL=st.dk?'rgba(236,235,230,.22)':'rgba(20,20,24,.16)',B7=st.ff?600:700,B6=st.ff?500:600,AC=st.ac,ON=st.on||'#fff',
hlc=st.hc?s.hl2:null,hair=(x,y,w)=>O.push(g=>{g.fillStyle=HL;g.fillRect(x,y,w,Math.max(1,.07*u))});
const hlMark=()=>{if(AC||st.hc)return;const gw=s.hl[1].split(' '),byL={};for(const t of O)if(t.hl&&gw.includes(t.s))(byL[t.ln]=byL[t.ln]||[]).push(t);
for(const id in byL){const a=byL[id],x0=Math.min(...a.map(t=>t.x)),x1=Math.max(...a.map(t=>t.x+t.w));a.forEach(t=>t.gr=[x0,x1,h,hue])}};
const cta=(x,y,w,ht,lbl,sz)=>{O.push(g=>{if(!AC)pill(g,x,y+ht*.13,w,ht,tint(250+h,80,55,.16,hue));pill(g,x,y,w,ht,AC||gl(g,x,x+w,h,hue),0,0,rad)});
para(o,lbl,x+w/2,y+ht/2+.04*u,1e9,sz,st.ff?500:600,FF,ON,0,'c',0,{bh:ht*1.16,bx0:x,bx1:x+w})};
const mark=(x,y,sz)=>O.push(g=>{rr(g,x,y-sz/2,sz,sz,sz*.3*rad);g.fillStyle=AC||gl(g,x,x+sz,h,hue);g.fill();if(!AC){g.fillStyle='rgba(255,255,255,.92)';g.beginPath();g.arc(x+sz/2,y,sz*.19,0,7);g.fill()}});
const l1=(st.hc?s.cta3:s.cta)+'  →';let y;
if(!mob){const ch=4.4*u,X=(cen?50:8.5)*u,R=(cen?94:91.5)*u,al=cen?'c':'l',ny=ch+3.8*u,CW=R-X,side=!cen&&st.art,fb=st.art>2,SX=fb?W*.6:X+CW*.62,TW=fb?SX-4.5*u-X:side?CW*.56:CW;
o.chrome=g=>chromeG(g,W,ch,st,0);
if(st.bl)O.push(g=>{const w=st.bw*W*1.02,hh=w*.66;g.drawImage(blobSp(h,st.seed,hue),st.bx*W-w/2,st.by*H-hh/2,w,hh)});
const lx=cen?6*u:X;if(st.anon){mark(lx,ny,2.7*u);o.bAt=[lx+3.6*u,ny,1.55*u]}else if(st.nm){para(o,NAME,lx,ny-.78*u,1e9,1.3*u,500,FF,IK,0,'l',-.005*1.3*u);para(o,ROLE,lx,ny+.98*u,1e9,1.1*u,400,FF,MU,0,'l',0)}else{mark(lx,ny,2.7*u);para(o,s.brand,lx+3.6*u,ny,1e9,1.55*u,B7,FF,IK,0,'l',0,{bx0:lx-.4*u})}
let nx=R;if(st.nav>1){const nw=mw(s.navCta,600,1.15*u,FF)+3*u,n0=nx;O.push(g=>pill(g,n0-nw,ny-1.55*u,nw,3.1*u,AC||gl(g,n0-nw,n0,h,hue),0,0,rad));para(o,s.navCta,nx-nw/2,ny+.05*u,1e9,1.15*u,600,FF,ON,0,'c',0,{bh:3.4*u});nx-=nw+3.2*u}
for(let i=s.nav.length-1;i>=(st.nav?0:2);i--){para(o,s.nav[i],nx,ny,1e9,1.2*u,st.ff?400:500,FF,fb?'#e9e5dc':NAV,0,'r',0);nx-=mw(s.nav[i],st.ff?400:500,1.2*u,FF)+3*u}
y=ch+(st.rh?10.4:8.7)*u;const y0=y;
if(st.ey===1){const ew=mw(s.eyebrow,500,1.1*u,FF)+3.9*u,ex=cen?X-ew/2:X,yy=y;O.push(g=>{pill(g,ex,yy,ew,2.7*u,AC?'rgba(20,20,24,.06)':tint(262+h,90,96.5,null,hue),AC?'rgba(20,20,24,.16)':tint(262+h,70,86,null,hue),Math.max(.6,.09*u),rad);g.fillStyle=AC||gl(g,ex+u,ex+2*u,h,hue);g.beginPath();g.arc(ex+1.45*u,yy+1.35*u,.45*u,0,7);g.fill()});
para(o,s.eyebrow,ex+2.4*u,y+1.4*u,1e9,1.1*u,500,FF,AC?IK:tint(262+h,50,44,null,hue),0,'l',0);y+=2.7*u+1.7*u}
else if(st.ey){para(o,s.eyebrow.toUpperCase(),X,y+.7*u,1e9,1.05*u,400,MONO,MU,0,al,.08*u);y+=1.4*u+2.4*u}
if(st.hi){const sz=(st.rh?1.5:1.65)*u,wt=st.ff?400:500,gw=mw(s.hi,wt,sz,FF),r0=.8*u,tot=gw+(st.bl?.75*u+2*r0:0),gx=cen?X-tot/2:X,yy=y+sz*.6;if(st.anon)o.gAt=[cen?X:gx,yy-.05*u,sz,wt,r0,.75*u,cen,MU];else{para(o,s.hi,gx,yy,1e9,sz,wt,FF,MU,0,'l',0);if(st.bl)O.push(g=>wave(g,gx+gw+.75*u+r0,yy-.05*u,r0))}y+=sz*1.2+(st.rh?2.4:1.3)*u}
{const hs=5*u*st.hz,lh=hs*(st.hz>1.3?1.02:1.08),txt=hlc||(side?s.hl.join(' '):s.hl[0]+' '+s.hl[1]+' | '+s.hl[2]),n=para(o,txt,X,y+lh/2,hlc&&!side?CW:TW,hs,st.ff?st.hw:Math.max(600,st.hw),FF,IK,lh,al,-(st.ff?.035:.03)*hs*(st.hw<400?1.15:1),{hl:1});hlMark();y+=n*lh+(st.hz>1.2?3:2.3)*u}
{const sz=(st.rh?1.62:1.42)*u,lh=sz*1.5,n=para(o,s.sub,X,y+lh/2,cen?62*u:Math.min(TW,(st.me?44:56)*u),sz,400,FF,MU,lh,al,0);y+=n*lh+(st.rh?3.2:2.6)*u}
{const ht=4.2*u,sz=1.3*u,pw=mw(l1,st.ff?500:600,sz,FF)+4.4*u,c2=st.cta>1,sw=mw(s.cta2,500,sz,FF)+(c2?4.4*u:0),gp=c2?1.2*u:2.6*u;let bx=cen?X-(pw+gp+sw)/2:X;
cta(bx,y,pw,ht,l1,sz);bx+=pw+gp;const yy=y,b2=bx;
if(c2){O.push(g=>pill(g,b2,yy,sw,ht,AC?'rgba(255,255,255,.4)':'#fff',AC?HL:'#dcdce6',Math.max(.6,.1*u),rad));para(o,s.cta2,bx+sw/2,y+ht/2+.04*u,1e9,sz,500,FF,IK,0,'c',0,{bh:ht*1.16})}
else{para(o,s.cta2,bx,y+ht/2,1e9,sz,500,FF,IK,0,'l',0,{bh:ht*.92});O.push(g=>{g.fillStyle=IK;g.fillRect(b2,yy+ht/2+sz*.72,sw,Math.max(1,.08*u))})}
y+=ht+(st.rh?5:4.4)*u}
if(fb)O.unshift(g=>{const t=(ch-o.oy)/o.kf;nightArt(g,SX,t,(W-o.ox)/o.kf-SX,(H-o.oy)/o.kf-t,3,9)});
else if(side){const sy=y0-.6*u,sh=y-sy-3.4*u;O.push(g=>nightArt(g,SX,sy,R-SX,sh,st.art,9))}
{const x0=cen?8*u:X,x1=cen?92*u:fb?X+TW:R,gap=(st.cd>1?3.2:1.8)*u,cw=(x1-x0-2*gap)/3;let bot=y;
s.cards.forEach((cd,i)=>{const x=x0+i*(cw+gap),yy=y;
if(st.cd===1){const chh=12.4*u;O.push(g=>{rr(g,x-.3*u,yy+.6*u,cw+.6*u,chh+.3*u,1.76*u*rad);g.fillStyle='rgba(60,50,140,.045)';g.fill();rr(g,x,yy,cw,chh,1.6*u*rad);g.fillStyle='#fff';g.fill();g.strokeStyle='rgba(30,25,80,.075)';g.lineWidth=Math.max(.5,.09*u);g.stroke();icon(g,x+1.7*u,yy+1.6*u,3*u,h+i*14,i,hue)});
para(o,cd[0],x+1.7*u,y+6.4*u,1e9,1.45*u,B6,FF,IK,0,'l',0);para(o,cd[1],x+1.7*u,y+8.7*u,cw-3.4*u,1.08*u,400,FF,MU,1.55*u,'l',0);bot=Math.max(bot,y+chh)}
else{hair(x,y,cw);let ty=y+2.2*u;if(st.cd>2){para(o,'0'+(i+1),x,y+1.9*u,1e9,1*u,400,MONO,AC&&AC!==IK?AC:MU,0,'l',0);ty=y+4.3*u}
para(o,cd[0],x,ty,1e9,1.45*u,500,FF,IK,0,'l',0);if(st.cd>3){bot=Math.max(bot,ty+1.6*u);return}const n=para(o,cd[1],x,ty+2.4*u,cw,1.15*u,400,FF,MU,1.65*u,'l',0);bot=Math.max(bot,ty+2.4*u+(n-1)*1.65*u+1.2*u)}});
y=bot}
o.top=ch;o.cx=cen?W/2:X}
else{const top=19*u,X=(cen?50:8)*u,al=cen?'c':'l';
o.chrome=g=>chromeG(g,W,top,st,1);
if(st.bl)O.push(g=>{const w=W*1.15,hh=W*.95;g.drawImage(blobSp(h,st.seed,hue),(.5+(st.bx-.5)*.7)*W-w/2,(.2+(st.by-.42)*.4)*H-hh/2,w,hh)});
const hy=top+5*u;O.push(g=>{g.fillStyle=IK;for(let i=-1;i<=1;i++)g.fillRect(84*u,hy+i*2*u-.35*u,8*u,.7*u)});
if(st.anon){mark(8*u,hy,6.2*u);o.bAt=[17*u,hy,4.1*u]}else if(st.nm){para(o,NAME,8*u,hy-2.1*u,1e9,3.8*u,500,FF,IK,0,'l',0);para(o,ROLE,8*u,hy+2.5*u,1e9,3.1*u,400,FF,MU,0,'l',0)}else{mark(8*u,hy,6.2*u);para(o,s.brand,17*u,hy,1e9,4.1*u,B7,FF,IK,0,'l',0,{bx0:7*u})}
y=top+(st.rh?14:12.5)*u;
if(st.art>2){const yy=y-2*u;O.push(g=>nightArt(g,-o.ox/o.kf,yy,W/o.kf,54*u,3,9));y+=58*u}
else if(st.art){const yy=y;O.push(g=>nightArt(g,8*u,yy,84*u,42*u,st.art,9));y+=48*u}

if(st.ey===1){const ew=mw(s.eyebrow,500,2.9*u,FF)+8.6*u,ex=cen?X-ew/2:X,yy=y;O.push(g=>{pill(g,ex,yy,ew,6.4*u,AC?'rgba(20,20,24,.06)':tint(262+h,90,96.5,null,hue),AC?'rgba(20,20,24,.16)':tint(262+h,70,86,null,hue),Math.max(.6,.25*u),rad);g.fillStyle=AC||gl(g,ex+2*u,ex+4.6*u,h,hue);g.beginPath();g.arc(ex+3.3*u,yy+3.2*u,1*u,0,7);g.fill()});
para(o,s.eyebrow,ex+5.5*u,y+3.3*u,1e9,2.9*u,500,FF,AC?IK:tint(262+h,50,44,null,hue),0,'l',0);y+=6.4*u+3.6*u}
else if(st.ey){para(o,s.eyebrow.toUpperCase(),X,y+1.5*u,1e9,2.7*u,400,MONO,MU,0,al,.2*u);y+=3*u+4.4*u}
if(st.hi){const sz=(st.rh?3.9:4.2)*u,wt=st.ff?400:500,gw=mw(s.hi,wt,sz,FF),r0=2*u,tot=gw+(st.bl?1.8*u+2*r0:0),gx=cen?X-tot/2:X,yy=y+sz*.6;if(st.anon)o.gAt=[cen?X:gx,yy-.1*u,sz,wt,r0,1.8*u,cen,MU];else{para(o,s.hi,gx,yy,1e9,sz,wt,FF,MU,0,'l',0);if(st.bl)O.push(g=>wave(g,gx+gw+1.8*u+r0,yy-.1*u,r0))}y+=sz*1.2+(st.rh?3.6:2.6)*u}
{const hs=9.2*u*Math.pow(st.hz,.75),lh=hs*(st.hz>1.3?1.02:1.12),n=para(o,hlc||s.hl.join(' '),X,y+lh/2,(cen?86:84)*u,hs,st.ff?st.hw:Math.max(600,st.hw),FF,IK,lh,al,-(st.ff?.035:.03)*hs*(st.hw<400?1.12:1),{hl:1});hlMark();y+=n*lh+4*u}
{const sz=(st.rh?4.15:3.7)*u,lh=sz*1.45,n=para(o,s.sub,X,y+lh/2,(st.me?78:84)*u,sz,400,FF,MU,lh,al,0);y+=n*lh+(st.rh?6.4:5.4)*u}
{const sz=3.6*u,full=st.full&&st.cta>1,ht=full?11.5*u:11*u,pw=full?84*u:mw(l1,st.ff?500:600,sz,FF)+10*u,bx=cen?50*u-pw/2:8*u;cta(bx,y,pw,ht,l1,sz);y+=ht+3*u;
if(st.cta>1){if(full){const yy=y;O.push(g=>pill(g,8*u,yy,84*u,11.5*u,AC?'rgba(255,255,255,.4)':'#fff',AC?HL:'#dcdce6',Math.max(.6,.25*u),rad));para(o,s.cta2,50*u,y+5.8*u,1e9,sz,500,FF,IK,0,'c',0,{bh:13*u});y+=14.5*u}
else{para(o,s.cta2+'  ›',cen?50*u:9*u,y+4*u,1e9,sz,500,FF,AC||tint(262+h,78,58,null,hue),0,al,0);y+=9*u}}
else{const yy=y,sw=mw(s.cta2,500,sz,FF);para(o,s.cta2,8*u,y+3.6*u,1e9,sz,500,FF,IK,0,'l',0,{bh:7*u});O.push(g=>{g.fillStyle=IK;g.fillRect(8*u,yy+3.6*u+sz*.72,sw,Math.max(1,.22*u))});y+=8*u}
y+=4*u}
s.cards.forEach((cd,i)=>{if(st.cd===1){const yy=y;O.push(g=>{rr(g,8*u,yy,84*u,25*u,4*u*rad);g.fillStyle='#fff';g.fill();g.strokeStyle='rgba(30,25,80,.075)';g.lineWidth=Math.max(.5,.09*u);g.stroke();icon(g,13*u,yy+5*u,8*u,h+i*14,i,hue)});
para(o,cd[0],25*u,y+8.6*u,1e9,4.2*u,B6,FF,IK,0,'l',0);para(o,cd[1],25*u,y+14.8*u,62*u,3.2*u,400,FF,MU,4.4*u,'l',0);y+=29*u}
else{hair(8*u,y,84*u);let ty=y+5*u;if(st.cd>2){para(o,'0'+(i+1),8*u,y+4*u,1e9,2.6*u,400,MONO,AC&&AC!==IK?AC:MU,0,'l',0);ty=y+9.6*u}
para(o,cd[0],8*u,ty,1e9,4.4*u,500,FF,IK,0,'l',0);if(st.cd>3){y=ty+6*u;return}const n=para(o,cd[1],8*u,ty+6*u,84*u,3.7*u,400,FF,MU,5.3*u,'l',0);y=ty+6*u+(n-1)*5.3*u+7*u}});

o.top=top;o.cx=cen?W/2:X}
o.bottom=y;const lim=H-(mob?4:2.4)*u;if(y>lim){o.kf=Math.max(mob?0:.86,(lim-o.top)/(y-o.top));o.ox=o.cx*(1-o.kf);o.oy=o.top*(1-o.kf)}
if(o.bAt){const b=o.bAt,h=o.gAt,k=o.kf;o.ov={bx:(b[0]*k+o.ox)/W,by:(b[1]*k+o.oy)/W,bs:b[2]*k/W,bw:B7,bc:IK};
if(h)Object.assign(o.ov,{gx:(h[0]*k+o.ox)/W,gy:(h[1]*k+o.oy)/W,gs:h[2]*k/W,gw:h[3],gr:h[4]/h[2],gg:h[5]/h[2],gc:h[6],gcol:h[7]})}
return o}
function dTok(g,t,sv){let wt=t.wt,col=t.col,ls=t.ls||0;if(sv&&t.k){const q=sv(t);if(q){wt=q.wt;col=q.col;ls=q.ls}}
g.font=`${wt} ${t.sz.toFixed(2)}px ${t.ff}`;if(HASLS)g.letterSpacing=ls.toFixed(2)+'px';g.fillStyle=t.gr?gl(g,t.gr[0],t.gr[1],t.gr[2],t.gr[3]):col;if(t.ab){g.textBaseline='alphabetic';g.fillText(t.s,t.x,t.y);g.textBaseline='middle'}else g.fillText(t.s,t.x,t.y)}
function paintPage(g,o,sv){const W=o.W,H=o.H;rr(g,0,0,W,H,o.st.nc?0:tr(W,H));g.fillStyle=o.bg;g.fill();g.save();g.clip();g.textBaseline='middle';g.textAlign='left';
g.save();g.translate(o.ox,o.oy);g.scale(o.kf,o.kf);for(const op of o.ops){if(typeof op==='function')op(g);else dTok(g,op,sv)}if(HASLS)g.letterSpacing='0px';g.restore();if(o.chrome)o.chrome(g);g.restore()}
/* the versions. v2-v4 are the small tweaks everybody makes; from v5 on, ours goes further, each version stronger than the one before. Night deltas follow, one per merge */
const VS=[],DV=(k,b,d)=>VS[k]=Object.assign({},VS[b],d);
VS[1]={al:0,ff:0,hw:700,hz:1,hc:0,hi:1,bg:'#fbfbfd',ik:'#15151c',mu:'#696979',nv:'#5c5c6b',ac:0,bl:1,cd:1,nav:2,cta:2,sq:0,ey:1,rh:0,me:0,art:0,dk:0,h:0,bx:.5,by:.44,bw:.56,full:1,seed:5};
DV(2,1,{h:-18,bx:.45});DV(3,2,{h:14,bw:.64,by:.4});DV(4,3,{h:30,full:0,bx:.56,seed:7});
DV(5,4,{al:1,ff:1,hw:600,h:0});
DV(6,5,{ac:'#141418',bl:0,cd:2,ey:2,sq:1,bg:'#f6f5f1',ik:'#141418',mu:'#4a4a52',nv:'#2c2c32'});
DV(7,6,{hz:1.5,hw:500,cta:1,nav:1,rh:1});
DV(8,7,{hc:1,hi:0,me:1});
/* the night's changes, one per merge. Up to v21 the editorial page grows its parts; from v24 it sits on the end frame's grid and converges on it:
   the warm night theme, the art where the well will open, the end frame's type, quiet buttons, the art turning into depth */
const GL={g:1,bg:'#f3f1ec',ik:'#141418',mu:'#45454d',dim:'#6c6c76',ac:'#d4561e',bf:'#d4561e',on:'#fff',dk:0,ga:1},
GD={bg:'#08090d',ik:'#f2f1ec',mu:'#a3a5b1',dim:'#767885',ac:'#ffba60',bf:'#ffd8a0',on:'#1d140a',dk:1,ga:2};
const NDL=[{nm:1,hw:400,bg:'#f3f1ec',mu:'#45454d'},{art:1},{hz:1.75,hw:300},{ac:'#d4561e'},{cd:4,art:2},{art:3},GL,GD,{ap:1},{ty:1,bp:1},{bt:1,fq:1},{rg:1}],
NV=[10,12,14,16,18,21,24,27,31,35,40,46];
/* ---------- the grid pages. Everything is placed in css px of the end frame (EM, measured from the DOM at layout), so v46 drawn at full size is the homepage plus its extras ---------- */
let EM=null,XH=.5,CAPH=.7;
function chromeG(g,W,ch,st,mob){const u=W/100,dk=st.dk;g.save();g.textBaseline='middle';
if(!(mob??narrow)){const lw=Math.max(1,.08*u);g.fillStyle=dk?'#1b1c22':'#ececf1';g.fillRect(0,0,W,ch);g.fillStyle=dk?'#2b2c34':'#dedee5';g.fillRect(0,ch-lw,W,lw);
['#f0625a','#f5bd3d','#40c351'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc((2.5+i*1.9)*u,ch/2,.6*u,0,7);g.fill()});
rr(g,35*u,ch/2-1.2*u,30*u,2.4*u,1.2*u);g.fillStyle=dk?'#2a2b33':'#fff';g.fill();g.font=`500 ${1.1*u}px ${SYS}`;g.fillStyle=dk?'#8d8f9c':'#8b8b97';g.textAlign='center';if(!st.anon)g.fillText(PAGE[lang].url,50*u,ch/2+.05*u)}
else{g.font=`600 ${3.3*u}px ${SYS}`;g.fillStyle=dk?'#e8e8ee':'#16161d';g.textAlign='left';g.fillText('9:41',9*u,5*u);for(let i=0;i<4;i++)g.fillRect((71+i*1.6)*u,(6.1-i*.55)*u,1*u,(.9+i*.55)*u);
rr(g,81*u,3.6*u,7*u,3.1*u,.8*u);g.lineWidth=.35*u;g.strokeStyle=g.fillStyle;g.stroke();g.fillRect(81.8*u,4.4*u,4.6*u,1.5*u);
rr(g,6*u,9.6*u,88*u,7.6*u,3.8*u);g.fillStyle=dk?'#24252d':'rgba(20,20,40,.07)';g.fill();g.font=`500 ${3*u}px ${SYS}`;g.fillStyle=dk?'#9a9aa6':'#777784';g.textAlign='center';if(!st.anon)g.fillText(PAGE[lang].url,50*u,13.5*u)}
g.textAlign='left';g.restore()}
const chromeH=(W,st)=>st.nc?0:narrow?W*.186:W*.044;
/* the end frame's stack, drawn small: the art of v47, so the nearest page of the stack shows the end screen itself */
function miniWell(g){const F=fan();if(!F)return;const K=STK.length;g.save();F.forEach((r,k)=>{rr(g,r.x,r.y,r.w,r.h,tr(r.w,r.h));g.globalAlpha=L(.25,.6,k/(K-1));g.fillStyle=VS[STK[k]].bg;g.fill()});g.restore()}
/* the art: on the light pages a framed picture of the night, on the dark pages its light alone; from ap on it sits exactly where the well will open */
function artG(g,st){if(st.fin){miniWell(g);return}const P=st.ap?EM.panel:EM.zone,F=st.rg&&fan();
if(F){g.save();g.fillStyle='rgba(242,241,236,.05)';for(let k=0;k<STK.length-1;k++){const r=F[k];rr(g,r.x,r.y,r.w,r.h,tr(r.w,r.h));g.fill()}g.restore()}
nightArt(g,P.x,P.y,P.w,P.h,st.ga===1?2:4,9);if(st.ga===2){g.save();g.strokeStyle='rgba(242,241,236,.13)';g.lineWidth=1;g.strokeRect(P.x+.5,P.y+.5,P.w-1,P.h-1);g.restore()}}
function layG(W,H,st){const s=PAGE[lang],e=EM,O=[],mob=narrow,fin=st.fin,ch=chromeH(W,st),k=W/vw,kc=(H-ch)/H;
const o={W,H,mob,ops:O,nl:0,kf:k*kc,ox:W*(1-kc)/2,oy:ch,bg:st.bg,st,g:1,ch,chrome:ch?(g=>chromeG(g,W,ch,st)):null};
const IK=st.ik,MU=st.mu,DIM=st.dim,AC=st.ac,HAIR=st.dk?'rgba(242,241,236,.2)':'rgba(20,20,24,.22)';
const tx=(str,x,y,sz,wt,ff,col,ls,ex)=>{const w=mw(str,wt,sz,ff,ls||0);O.push(Object.assign({s:str,x,y,w,sz,wt,ff,col,ls:ls||0,ab:1,ln:o.nl++},ex));return w};
const sh=(f,ex)=>{O.push(Object.assign(f,ex));return f};
sh(g=>artG(g,st),{art:1});
tx(NAME,e.who.x,e.who.b1,e.who.s1,e.who.w1,SANS,IK,e.who.l1,{k:2});tx(ROLE,e.who.x,e.who.b2,e.who.s2,e.who.w2,SANS,MU,e.who.l2,{k:2});
e.ln.forEach(l=>{tx(l.t,l.x,l.b,l.s,400,SANS,IK,l.ls,{k:2});sh(g=>{g.fillStyle=IK;g.fillRect(l.u0,l.uy,l.u1-l.u0,1)},{k:2});tx(l.h,l.hx,l.hb,l.hs,400,MONO,DIM,l.hl,{k:2})});
e.ft.forEach(f=>tx(f.s,f.x,f.b,f.sz,400,SANS,f.c==='fg'?IK:DIM,0,{k:2,al:f.c==='sep'?.7:1}));
if(fin){const t=e.stl;sh(g=>{g.fillStyle='#7fd6a4';g.beginPath();g.arc(t.dx,t.dy,3.5,0,7);g.fill()},{k:2});tx('live',t.lx,t.b,t.sz,400,MONO,MU,0,{k:2});tx('v47',t.vx,t.b,t.sz,400,MONO,IK,0,{k:2});
for(const q of e.tg)tx(q.s,q.x,q.yb,q.sz,q.wt,SANS,rgb(q.col),q.ls,{k:2});const r=e.rp;
sh(g=>{rr(g,r.x,r.y,r.w,r.h,r.h/2);g.fillStyle='#ffd8a0';g.fill();g.strokeStyle='#1d140a';g.lineWidth=2;g.lineCap='round';g.beginPath();g.arc(r.ix,r.iy,r.ir,-.35,4.7);g.stroke();g.lineCap='butt'},{k:2});tx(REPLAY,r.lx,r.lb,r.sz,500,SANS,'#1d140a',r.ls,{k:2});return o}
/* the extras: nav, features, badge, the generic hero, buttons, one more link, one more footer entry */
if(!mob){let x=e.pr;const sz=e.who.s1*.88;for(let i=s.nav.length-1;i>=0;i--){const w=mw(s.nav[i],400,sz,SANS);x-=w;tx(s.nav[i],x,e.who.b1,sz,400,SANS,MU,0,{grp:'nav'});x-=sz*2.2}}
else{const x1=e.pr,cy=e.who.b1-e.who.s1*.32;sh(g=>{g.fillStyle=IK;for(let i=-1;i<=1;i++)g.fillRect(x1-20,cy+i*6-.8,20,1.6)},{grp:'nav',bb:[x1-20,cy-7,x1,cy+7],ab:1})}
{const z=e.feat;if(z&&z.row){let x=z.x;s.cards.forEach((cd,i)=>{x+=tx('0'+(i+1),x,z.y,z.ts*.8,400,MONO,AC,0,{grp:'f'+i})+z.ts*.5;x+=tx(cd[0],x,z.y,z.ts,400,SANS,IK,0,{grp:'f'+i})+z.ts*1.6})}else if(z)s.cards.forEach((cd,i)=>{const y=z.y+i*z.step,G='f'+i;if(mob){tx('0'+(i+1),z.x,y,10.5,400,MONO,AC,.3,{grp:G});tx(cd[0],z.x+24,y,z.ts,400,SANS,IK,-.1,{grp:G})}
else{tx('0'+(i+1),z.x,y,11.5,400,MONO,AC,.4,{grp:G});tx(cd[0],z.x+30,y,z.ts,400,SANS,IK,-.1,{grp:G});if(!st.fq&&!z.nd)tx(cd[1],z.x+30,y+z.ds*1.55,z.ds,400,SANS,MU,0,{grp:G})}})}
{const bs=e.bdg.sz,lbl=s.eyebrow.toUpperCase(),ls=bs*.08,cy=e.st.cy;if(st.bp){const bh=e.bdg.h,lw=mw(lbl,400,bs,MONO,ls),bw=lw+bh+12;
sh(g=>{rr(g,e.px+.5,cy-bh/2+.5,bw-1,bh-1,bh/2);g.strokeStyle=HAIR;g.lineWidth=1;g.stroke();g.fillStyle=AC;g.beginPath();g.arc(e.px+bh/2,cy,3,0,7);g.fill()},{grp:'badge',bb:[e.px,cy-bh/2,e.px+bw,cy+bh/2]});tx(lbl,e.px+bh/2+9,cy+bs*.36,bs,400,MONO,MU,ls,{grp:'badge'})}
else tx(lbl,e.px,cy+bs*.36,bs,400,MONO,MU,ls,{grp:'badge'})}
{const h=e.hero,hs=st.ty?h.hs:h.hs*.8,hw=st.ty?300:400;tx(s.hl2,e.px,h.top+CAPH*hs,hs,hw,SANS,IK,-.03*hs,{grp:'hl'});
para(o,s.sub,e.px,h.sb,h.sw,h.ss,400,SANS,MU,h.slh,'l',0,{ab:1,grp:'sub'});
const by=h.by,bh=h.bh,bs=h.bfs,l1=s.cta3+'  →',w1=mw(l1,500,bs,SANS)+bh*.95,l2=s.cta2,w2=mw(l2,500,bs,SANS),x2=e.px+w1+bh*.62,tb=by+bh/2+bs*.36;
if(st.bt){sh(g=>{rr(g,e.px+.5,by+.5,w1-1,bh-1,bh/2);g.strokeStyle=st.dk?'rgba(242,241,236,.4)':'rgba(20,20,24,.4)';g.lineWidth=1;g.stroke()},{grp:'btn',bb:[e.px,by,e.px+w1,by+bh]});tx(l1,e.px+bh*.475,tb,bs,500,SANS,IK,0,{grp:'btn'})}
else{sh(g=>{rr(g,e.px,by,w1,bh,bh/2);g.fillStyle=st.bf;g.fill()},{grp:'btn',bb:[e.px,by,e.px+w1,by+bh]});tx(l1,e.px+bh*.475,tb,bs,500,SANS,st.on,0,{grp:'btn'})}
tx(l2,x2,tb,bs,500,SANS,IK,0,{grp:'btn2'});sh(g=>{g.fillStyle=IK;g.fillRect(x2,tb+5,w2,1)},{grp:'btn2',bb:[x2,tb+4,x2+w2,tb+6]})}
if(e.xl){const l=e.xl;tx(s.xl,l.x,l.b,l.s,400,SANS,IK,l.ls,{grp:'xl'});const w=mw(s.xl,400,l.s,SANS,l.ls);sh(g=>{g.fillStyle=IK;g.fillRect(l.x,l.uy,w,1)},{grp:'xl',bb:[l.x,l.uy-1,l.x+w,l.uy+1]});tx(s.xh,l.x,l.hb,l.hs,400,MONO,DIM,l.hl,{grp:'xl'})}
{const f=e.ftx,lab=mob?'Cookies':s.ck;tx('·',f.sx,f.b,f.sz,400,SANS,DIM,0,{grp:'ck',al:.7});tx(lab,f.x,f.b,f.sz,400,SANS,DIM,0,{grp:'ck'})}
return o}
