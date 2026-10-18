/* ---------- V: v47 deployed in front; behind it, far to near, the versions that led here, v1 small and faded at the far end. They build up oldest first ---------- */
const NW=46,STK=[1,6,12,24,31,47],SST=.8,APD=.5,AP0F=.4,STK_MIN_H=56,
FAN_W={fx:.55,fy:.2},FAN_N={fx:.7,fy:.3},FOG=[.72,.67,.62,.57,0,0],LIFT=[0,0,0,0,.03,.045],RES=[.5,.6,.7,.8,.9,1];
let WG=.069,VPW=[0,0],PX=0,PY=0,PXT=0,PYT=0,AP0=AP0F,FAN,SBM=[];
const fAt=i=>1/(1+i*WG);
function buildWell(){FAN=undefined;SBM=[]}
function fanLayout(){const e=EM,K=STK.length,a=vw/vh,g=1/SST-1,sm=SST**(K-1),{fx,fy}=narrow?FAN_N:FAN_W,vx=a*(1+fx/g),vy=-fy/g,bw=a*(1+fx/g*(1-sm)),bh=1-vy*(1-sm),
x0=e.zone.x,x1=e.pr,y1=Math.min(e.zone.y+e.zone.h,e.rp.y>e.zone.y?e.rp.y-12:1e9),y0=narrow?e.who.b1-e.who.s1:e.zone.y,nr=e.who.x+Math.max(mw(NAME,e.who.w1,e.who.s1,SANS,e.who.l1),mw(ROLE,e.who.w2,e.who.s2,SANS,e.who.l2)),
keep=[[e.who.x-8,y0-8,nr+16,e.who.bot+10],[e.rp.x-12,e.rp.y-12,e.rp.x+e.rp.w+12,e.rp.y+e.rp.h+12]],
at=(k,u)=>{const s=SST**(K-1-k);return{x:x0+vx*(1-s)*u,y:y1-(1-vy*(1-s))*u,w:a*s*u,h:s*u}},
hits=u=>STK.some((_,k)=>{const r=at(k,u);return keep.some(o=>r.x<o[2]&&r.x+r.w>o[0]&&r.y<o[3]&&r.y+r.h>o[1])});
let u=Math.min((x1-x0)/bw,(y1-y0)/bh);for(let i=0;i<40&&u>=STK_MIN_H&&hits(u);i++)u*=.96;return u>=STK_MIN_H&&!hits(u)?STK.map((_,k)=>at(k,u)):null}
const fan=()=>FAN===undefined?(FAN=fanLayout()):FAN;
const stackRect=k=>{const F=fan();return F?F[k]:null};
function stackBmp(k){if(SBM[k])return SBM[k];const r=stackRect(k);if(!r)return null;const K=STK.length,q=RES[k]*dpr,W=Math.max(2,Math.round(r.w*q)),H=Math.max(2,Math.round(r.h*q)),M=Math.ceil(40*q),
c=cvs(W+2*M,H+2*M),g=c.getContext('2d'),near=k===K-1,off=c.width+2*M;
if(k){g.save();g.shadowColor=near?'rgba(255,214,160,.5)':'rgba(0,0,0,.55)';g.shadowBlur=(near?24:16)*q;g.shadowOffsetX=off;g.shadowOffsetY=(near?0:5)*q;g.fillStyle='#000';rr(g,M-off,M,W,H,tr(W,H));g.fill();g.restore()}
g.drawImage(bmp(VS[STK[k]],W,H),M,M);if(FOG[k]||LIFT[k]){g.save();rr(g,M,M,W,H,tr(W,H));g.clip();g.fillStyle=FOG[k]?`rgba(8,9,13,${FOG[k]})`:`rgba(242,241,236,${LIFT[k]})`;g.fillRect(M,M,W,H);g.restore()}
c.M=M;c.z=dpr/q;return SBM[k]=c}
const appear=(k,tt)=>RM?1:eSoft(P(tt,AP0+k*APD,AP0+k*APD+.6));
function well(tt,ga){const F=fan();if(!F)return;ga=ga??1;const c=X2,K=STK.length,n=F[K-1],an=appear(K-1,tt)*ga,drift=k=>{const s=SST**(K-1-k);return[PX*vw*.012*s,PY*vh*.01*s]};
c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
if(an>0){const[dx,dy]=drift(K-1),cx=(n.x+n.w/2+dx)*dpr,cy=(n.y+n.h/2+dy)*dpr,rad=Math.max(n.w,n.h)*1.25*dpr,q=c.createRadialGradient(cx,cy,0,cx,cy,rad);
q.addColorStop(0,`rgba(255,206,150,${(.14*an).toFixed(3)})`);q.addColorStop(1,'rgba(255,206,150,0)');c.fillStyle=q;c.fillRect(cx-rad,cy-rad,rad*2,rad*2)}
for(let k=0;k<K;k++){const a=appear(k,tt)*ga;if(a<=0)continue;const r=F[k],b=stackBmp(k),[dx,dy]=drift(k),m=b.M*b.z;c.globalAlpha=a;c.drawImage(b,(r.x+dx)*dpr-m,(r.y+dy)*dpr-m,b.width*b.z,b.height*b.z)}
c.globalAlpha=1}
/* the end frame: the line is the survivors of the cut, set large */
function split2(s){const w=s.split(' '),k=cl(LBRK[lang],1,w.length-1);return w.length<2?[s]:[w.slice(0,k).join(' '),w.slice(k).join(' ')]}
const tokHTML=s=>s.split(' ').map((w,i)=>{const m=w.match(/^(.*?)([.?!,…]*)$/);return(i?' ':'')+`<span class="t">${m[1]}</span>`+(m[2]?`<span class="t">${m[2]}</span>`:'')}).join('');
function fitEnd(){const ln=LINE,qs=narrow?split2(ln[1]):[ln[1]];E.aL.innerHTML='<i class="bl"></i>'+tokHTML(ln[0]);E.bL.innerHTML=qs.map(x=>`<span class="l"><i class="bl"></i>${tokHTML(x)}</span>`).join(' ');
const cs=getComputedStyle(E.end),avail=E.end.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),m=cvs(8,8).getContext('2d');m.font=`300 100px ${SANS}`;if(HASLS)m.letterSpacing='-3.5px';
const wm=Math.max(...qs.map(x=>m.measureText(x).width)),size=Math.min(avail*.97/wm*100,narrow?Math.min(84,vh*.1):Math.min(184,vh*.2));
R.style.setProperty('--bS',size.toFixed(1)+'px');R.style.setProperty('--aS',(narrow?Math.min(19,vw*.05):cl(vw*.0185,19,27)).toFixed(1)+'px')}
function measureG(){const wb=E.who.getBoundingClientRect().bottom+scrollY,at=Math.min(E.st.getBoundingClientRect().top,E.aL.getBoundingClientRect().top)+scrollY,reg=Math.max(80,at-wb),f=cl(reg*(narrow?.78:.62)/vh,.1,.28);WG=(1/f-1)/NW;
const tc=narrow?[vw*.68,(wb+at)/2]:[vw*.69,wb+reg*.45];VPW=[(tc[0]-vw/2*f)/(1-f),(tc[1]-vh/2*f)/(1-f)]}
/* the end frame as the canvas pages need it: every kept element's position, baseline and type, in css px */
function measureE(){const bl=el=>{const m=document.createElement('i');m.className='bl';el.appendChild(m);const y=m.getBoundingClientRect().top;m.remove();return y},
fo=el=>{const c=getComputedStyle(el);return{sz:parseFloat(c.fontSize),wt:parseFloat(c.fontWeight)||400,ls:parseFloat(c.letterSpacing)||0}},rc=el=>el.getBoundingClientRect();
MC.textBaseline='alphabetic';MC.font=`400 100px ${SANS}`;if(HASLS)MC.letterSpacing='0px';XH=MC.measureText('x').actualBoundingBoxAscent/100;CAPH=MC.measureText('H').actualBoundingBoxAscent/100;
const cs=getComputedStyle(E.end),px=parseFloat(cs.paddingLeft),pr=vw-parseFloat(cs.paddingRight),h1=E.who.querySelector('h1'),p=E.who.querySelector('p'),f1=fo(h1),f2=fo(p);
const e={px,pr,who:{x:rc(h1).left,b1:bl(h1),s1:f1.sz,w1:f1.wt,l1:f1.ls,b2:bl(p),s2:f2.sz,w2:f2.wt,l2:f2.ls,bot:rc(E.who).bottom}};
const st=rc(E.st);e.st={x:st.left,y:st.top,h:st.height,cy:st.top+st.height/2};
{const sw=E.sw.textContent;E.sw.textContent='live';R.classList.remove('dp');const d=rc($('dot')),f=fo(E.sw),v=E.st.querySelector('b');e.stl={dx:d.left+d.width/2,dy:d.top+d.height/2,lx:rc(E.sw).left,vx:rc(v).left,b:bl(E.sw),sz:f.sz};E.sw.textContent=sw}
{const r=rc(E.rp),sp=E.rp.querySelector('span'),ic=rc(E.rp.querySelector('svg')),f=fo(sp);e.rp={x:r.left,y:r.top,w:r.width,h:r.height,lx:rc(sp).left,lb:bl(sp),sz:f.sz,ls:f.ls,ix:ic.left+ic.width/2,iy:ic.top+ic.height/2,ir:ic.width*.32}}
e.ln=E.li.map(li=>{const a=li.querySelector('a'),h=li.querySelector('.h'),ra=rc(a),f=fo(a),fh=fo(h),rh=rc(h);return{t:a.textContent,x:ra.left,b:bl(a),s:f.sz,ls:f.ls,w:ra.width,u0:ra.left,u1:ra.right,uy:ra.bottom-1,h:h.textContent,hx:rh.left,hb:bl(h),hs:fh.sz,hl:fh.ls,top:rc(li).top,r:Math.max(ra.right,rh.right)}});
e.lnTop=Math.min(...e.ln.map(l=>l.top));const row=Math.abs(e.ln[1].top-e.ln[0].top)<4;e.xl=null;
if(row){const l=e.ln[2],gap=e.ln[1].x-e.ln[0].r,x=l.r+gap,w=Math.max(mw(PAGE[lang].xl,400,l.s,SANS,l.ls),mw(PAGE[lang].xh,400,l.hs,MONO,l.hl));if(x+w<=pr)e.xl={x,b:l.b,s:l.s,ls:l.ls,uy:l.uy,hb:l.hb,hs:l.hs,hl:l.hl}}
e.ft=[];E.ft.querySelectorAll('a,button,.sep').forEach(el=>{const f=fo(el);e.ft.push({s:el.textContent,x:rc(el).left,b:bl(el),sz:f.sz,c:el.classList.contains('sep')?'sep':el.getAttribute('aria-current')==='page'?'fg':'dim'})});
{const fl=E.ft.firstElementChild,as=fl.querySelectorAll('a'),sep=fl.querySelector('.sep'),ra=rc(as[0]),rs=rc(sep),rd=rc(as[1]);e.ftx={sx:rd.right+(rs.left-ra.right),x:rd.right+(rs.left-ra.right)+rs.width+(rd.left-rs.right),b:bl(as[1]),sz:fo(as[1]).sz}}
/* the extras' places: features in the free area under the name, the art to their right, the generic hero between the status line and the links */
const fz0=e.who.bot+(narrow?16:30),fz1=st.top-(narrow?14:30),ts=narrow?15:17,ds=14,s=PAGE[lang];
let fw=0;s.cards.forEach(c=>{fw=Math.max(fw,(narrow?24:30)+mw(c[0],400,ts,SANS),narrow?0:30+mw(c[1],400,ds,SANS))});
/* the features stack in the free area under the name; where that area is too short they run in one line, and where even that does not fit they are left out */
{const zh=fz1-fz0,t2=narrow?Math.max(10.5,Math.min(ts,zh/3.5)):ts,nd=narrow||zh<3*(ts*.75+ds*1.85)+24,ih=nd?t2:ts*.75+ds*1.55+ds*.3,step=Math.min(narrow?30:64,(zh-ih)/2),rs=Math.min(13,zh*.75);
if(step>=t2*1.15){const top=fz0+(zh-(2*step+ih))/2;e.feat={x:px,y:top+t2*.75,step,ts:t2,ds,nd}}
else{let w=0;s.cards.forEach(c=>w+=mw(c[0],400,rs,SANS)+rs*3.6);e.feat=zh>=11&&w<=pr-px?{x:px,y:fz0+zh/2+rs*.36,row:1,ts:rs}:null}}
const zx0=narrow?Math.max(px+fw+18,vw*.5):Math.max(px+fw+56,vw*.44);e.zone={x:zx0,y:e.who.bot+(narrow?14:24),w:pr-zx0,h:st.top-(narrow?12:20)-(e.who.bot+(narrow?14:24))};
/* the art sits on one of the well's frames, the largest that clears the name, the status line and the features */
let fp=fAt(NW)*.4;for(let f=.6;f>fp;f-=.005){const x=VPW[0]*(1-f),y=VPW[1]*(1-f);if(y>=e.who.bot+12&&y+vh*f<=st.top-10&&x>=zx0-(narrow?6:24)&&x+vw*f<=vw-6){fp=f;break}}
e.panel={x:VPW[0]*(1-fp),y:VPW[1]*(1-fp),w:vw*fp,h:vh*fp,f:fp};
e.bdg={sz:narrow?10.5:11.5,h:narrow?22:24};
/* the hero fits between the status line and the links; on small screens its type steps down until it does */
for(const k of[1,.92,.85,.78,.72]){const ss=(narrow?15:cl(vw*.0125,16,19.5))*k,slh=ss*1.5,sw=narrow?pr-px:Math.min(pr-px,Math.max(520,vw*.5)),bh=(narrow?38:44)*Math.max(.82,k),bfs=(narrow?14:15)*Math.max(.86,k),g1=(narrow?10:18)*k,g2=(narrow?14:22)*k,
top=st.bottom+(narrow?12:16)*k,bot=e.lnTop-(narrow?20:30)*k,nS=para({ops:[],nl:0},s.sub,0,0,sw,ss,400,SANS,'',slh,'l',0),
hw=mw(s.hl2,300,100,SANS,-3)/100,hMax=narrow?Math.min(34,(pr-px)*.98/hw):Math.min(fitBS()*.62,(pr-px)*.98/hw),hAv=(bot-top-g1-1.1*ss-(nS-1)*slh-g2-bh)/(CAPH+.22),
hs=Math.max(narrow?18:32,Math.min(hMax,hAv)),hb=top+CAPH*hs,sb=hb+.22*hs+g1+ss*.8;
e.hero={top,hs,hb,sb,sw,ss,slh,nS,by:sb+(nS-1)*slh+ss*.3+g2,bh,bfs};if(hAv>=(narrow?22:40))break}
e.tg=TGT;EM=e}
const fitBS=()=>parseFloat(getComputedStyle(R).getPropertyValue('--bS'))||120;
function drawEnd(tt){const c=X2;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle=INK;c.fillRect(0,0,cw2,ch2);well(tt)}
