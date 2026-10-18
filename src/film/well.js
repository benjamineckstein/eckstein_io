/* ---------- V: v47 deployed in front, every earlier version receding behind it; at the bottom the small screen replays the evolution once and lands on our page ---------- */
const NW=46,PER=7.5,TRV=2.9,AG0=1.1,MRD=.5;
let WL=null,WX=null,WB1=null,WB2=null,WG=.069,VPW=[0,0],PX=0,PY=0,PXT=0,PYT=0,IP=30,MRS=1.3,MRF=false,MINI=new Map(),MSZ=[1,1];
const fAt=(i,tt)=>1/(1+i*WG*(1+.035*Math.sin(tt*.42)));
/* the evolution as the film showed it: v1, the small tweaks, the stack, every merge of the night, then ours */
const MREP=[1,2,3,4,5,6,7,8,...night.pv.slice(1).map(e=>e.v),47];
function buildWell(){WL=cvs(cw2,ch2);WX=WL.getContext('2d');WB1=cvs(Math.ceil(cw2/5),Math.ceil(ch2/5));WB2=cvs(Math.ceil(cw2/18),Math.ceil(ch2/18));const f=fAt(NW,0);MSZ=[Math.round(vw*f*dpr),Math.round(vh*f*dpr)];MINI=new Map()}
function miniBmp(v){let c=MINI.get(v);if(!c){c=bmp(VS[v],MSZ[0],MSZ[1]);MINI.set(v,c)}return c}
function wvp(tt){return[VPW[0]+Math.sin(tt*.23)*vw*.008+PX*vw*.028,VPW[1]+Math.sin(tt*.19)*vh*.008+PY*vh*.022]}
const frameAt=(i,tt,vp)=>{const f=fAt(i,tt);return{x:vp[0]*(1-f),y:vp[1]*(1-f),w:vw*f,h:vh*f,f}};
/* now and then one agent travels down the well, along its ceiling, from the newest versions to v1 */
function agentAt(tt){if(tt<AG0||RM)return null;const n=Math.floor((tt-AG0)/PER),u=(tt-AG0-n*PER)/TRV;return u>=1?null:{u,env:Math.sin(Math.PI*cl(u*1.15))}}
const agD0=()=>narrow?14:6,agDepth=u=>L(agD0(),NW,eIO(u)),agPt=(di,tt,vp)=>{const r=frameAt(di,tt,vp),s=L(.2,.58,(di-agD0())/(NW-agD0()));return[r.x+r.w*s,r.y,r.f]};
/* the small screen: which version it shows at well time tt, and how far the crossfade from the one before has come */
function miniAt(tt){if(MRF||RM)return{i:MREP.length-1,p:1};const x=(tt-MRS)/MRD;if(x<0)return{i:0,p:1};const i=Math.min(MREP.length-1,Math.floor(x)),v=MREP[i],pv=MREP[i-1];
const fd=i&&(!!VS[v].dk)!==(!!VS[pv].dk)?.45:.25;return{i,p:i?cl((tt-MRS-i*MRD)/fd):1}}
function wellGlow(cx,cy,r0,r1,b,yf,ga){const c=WX;c.globalCompositeOperation='destination-in';const g=c.createRadialGradient(cx,cy,r0,cx,cy,r1);g.addColorStop(0,'#000');g.addColorStop(.4,'rgba(0,0,0,.72)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,cw2,ch2);
if(yf){const l=c.createLinearGradient(0,yf[0],0,yf[1]);l.addColorStop(0,'#000');l.addColorStop(1,'rgba(0,0,0,.1)');c.fillStyle=l;c.fillRect(0,0,cw2,ch2)}c.globalCompositeOperation='source-over';
X2.globalAlpha=ga;X2.drawImage(WL,0,0);X2.globalAlpha=1;const b1=WB1.getContext('2d'),b2=WB2.getContext('2d');b1.clearRect(0,0,WB1.width,WB1.height);b1.drawImage(WL,0,0,WB1.width,WB1.height);b2.clearRect(0,0,WB2.width,WB2.height);b2.drawImage(WB1,0,0,WB2.width,WB2.height);
/* both glow levels summed at the first level's size, one full-size draw */
b1.globalCompositeOperation='copy';b1.globalAlpha=.55/.9;b1.drawImage(WB1,0,0);b1.globalAlpha=1;b1.globalCompositeOperation='lighter';b1.drawImage(WB2,0,0,WB1.width,WB1.height);b1.globalCompositeOperation='source-over';
X2.globalCompositeOperation='lighter';X2.globalAlpha=.9*b*ga;X2.imageSmoothingQuality='low';X2.drawImage(WB1,0,0,cw2,ch2);X2.imageSmoothingQuality='high';X2.globalAlpha=1;X2.globalCompositeOperation='source-over'}
/* open: 0..1, the well opens from where the art of the page was (frame IP) both deeper and outward */
function well(tt,ga,open){if(!WX)return;ga=ga??1;open=open??1;const c=WX,vp=wvp(tt),ag=agentAt(tt),di=ag?agDepth(ag.u):-99,ae=ag?ag.env:0,vis=i=>cl((open*1.35-Math.abs(i-IP)/NW)*4);
c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.clearRect(0,0,cw2,ch2);
const r1=frameAt(NW,tt,vp),v0=vis(NW),br=1+.14*Math.sin(tt*1.05),pb0=ae*Math.exp(-((NW-di)**2)/8),cx=(r1.x+r1.w/2)*dpr,cy=(r1.y+r1.h/2)*dpr,m=miniAt(tt),mv=MREP[m.i],warm=v=>VS[v].dk?1:0,wm=L(m.i?warm(MREP[m.i-1]):warm(mv),warm(mv),m.p);
if(v0>0){X2.globalAlpha=ga;const g=X2.createRadialGradient(cx,cy,0,cx,cy,Math.max(r1.w,r1.h)*dpr*1.7),hue=L(258,34,wm);g.addColorStop(0,`hsla(${hue.toFixed(0)},${L(80,90,wm).toFixed(0)}%,${L(60,62,wm).toFixed(0)}%,${(.16*v0*br*(1+.8*pb0)).toFixed(3)})`);g.addColorStop(1,`hsla(${hue.toFixed(0)},80%,55%,0)`);
X2.fillStyle=g;X2.fillRect(0,0,cw2,ch2);const al=ga*v0*Math.min(1,.82*br+.3*pb0),X=r1.x*dpr,Y=r1.y*dpr,W=r1.w*dpr,H=r1.h*dpr;
if(m.p<1&&m.i){X2.globalAlpha=al;X2.drawImage(miniBmp(MREP[m.i-1]),X,Y,W,H)}X2.globalAlpha=al*(m.i?m.p:1);X2.drawImage(miniBmp(mv),X,Y,W,H);X2.globalAlpha=1}
c.lineWidth=dpr;
for(let i=NW-1;i>=1;i--){const v=vis(i);if(v<=0)continue;const r=frameAt(i,tt,vp),k=47-i,night=k>=9,pb=ae*Math.exp(-((i-di)**2)/5),bell=Math.exp(-(((r.f-.5)/.24)**2)),
base=cl((k===8?.36+.3*bell:.045+.13*bell)*v),ea=cl(base+pb*.7),wt=cl(pb*.7/(ea+1e-3)),d=i/NW,col=night?[L(236,214,d),L(222,206,d),L(200,236,d)]:[196,206,246];
c.fillStyle=night?`rgba(5,6,10,${(.03*v).toFixed(4)})`:`rgba(214,216,248,${(.014*v).toFixed(4)})`;c.fillRect(r.x*dpr,r.y*dpr,r.w*dpr,r.h*dpr);
c.strokeStyle=`rgba(${Math.round(L(col[0],255,wt))},${Math.round(L(col[1],206,wt))},${Math.round(L(col[2],150,wt))},${ea.toFixed(3)})`;c.strokeRect(r.x*dpr+dpr/2,r.y*dpr+dpr/2,r.w*dpr-dpr,r.h*dpr-dpr)}
if(ag){c.setTransform(dpr,0,0,dpr,0,0);c.globalCompositeOperation='lighter';c.lineCap='round';const u0=Math.max(0,ag.u-.2),pts=[];for(let j=0;j<=26;j++){const u=L(u0,ag.u,j/26),p=agPt(agDepth(u),tt,vp);pts.push(p)}
const hd=pts[pts.length-1],tl=pts[0],gr=c.createLinearGradient(tl[0],tl[1],hd[0],hd[1]);gr.addColorStop(0,'rgba(255,228,180,0)');gr.addColorStop(1,`rgba(255,228,180,${(.9*ae).toFixed(3)})`);c.beginPath();
pts.forEach((p,j)=>{const z=j&1?1:-1,a=(1.5+3.5*hsh(j+Math.floor(ag.u*40),7))*p[2]*(j>23?0:1);j?c.lineTo(p[0],p[1]+z*a):c.moveTo(p[0],p[1])});c.lineWidth=1.3;c.strokeStyle=gr;c.stroke();
glow(c,SP.impl,hd[0],hd[1],34*Math.max(.45,hd[2]),.95*ae);glow(c,SP.white,hd[0],hd[1],9*Math.max(.5,hd[2]),ae);c.globalCompositeOperation='source-over';c.setTransform(1,0,0,1,0,0)}
const D=Math.hypot(vw,vh)*dpr;wellGlow(cx,cy,Math.max(r1.w,r1.h)*dpr*.5,D*(narrow?.62:.55),ga,[(r1.y+r1.h)*dpr,(r1.y+r1.h+vh*.24)*dpr],ga);
if(v0>0){X2.font=`400 ${10*dpr}px ${MONO}`;X2.textBaseline='alphabetic';X2.textAlign='left';X2.fillStyle=`rgba(214,220,255,${cl((.42+.5*pb0)*v0*ga).toFixed(3)})`;X2.fillText('v'+mv,(r1.x+1)*dpr,(r1.y-5)*dpr)}}
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
let fp=fAt(NW,0)*.4;for(let f=.6;f>fp;f-=.005){const x=VPW[0]*(1-f),y=VPW[1]*(1-f);if(y>=e.who.bot+12&&y+vh*f<=st.top-10&&x>=zx0-(narrow?6:24)&&x+vw*f<=vw-6){fp=f;break}}
e.panel={x:VPW[0]*(1-fp),y:VPW[1]*(1-fp),w:vw*fp,h:vh*fp,f:fp};IP=Math.min(NW,(1/fp-1)/WG);
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
