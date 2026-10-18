const R=document.documentElement,$=id=>document.getElementById(id);
/* the line, read from the end screen's server-rendered HTML */
const LINE=['aL','bL'].map(id=>$(id).textContent.replace(/\s+/g,' ').trim());
/* on narrow screens the question breaks after this many words */
const LBRK={de:2,en:1};
/* the page everybody gets. [[x]] marks what survives the cut: read in order, the survivors must spell LINE (checked at boot) */
const PAGE={
de:{url:'eckstein.io',brand:'Benjamin',nav:['Leistungen','Über mich','Kontakt'],navCta:'Starten',eyebrow:'Neu: KI-Agenten',hi:'Hi, ich bin Benjamin',
hl:['Innovative','KI-Lösungen','für dein Business'],hl2:'Agentic Engineering.',
sub:'[[Alle]] in deinem Team [[können]] [[jetzt]] durchstarten – mit der Power von [[KI]][[.]] [[Wo]] [[ist]] [[dein]] größter Hebel – und wo liegt dein [[Limit]][[?]] Wir zeigen dir, wie du es verschiebst.',
cta:'Jetzt starten',cta2:'Mehr erfahren',cta3:'Projekt anfragen',xl:'Termin buchen',xh:'30 Min., kostenlos',ck:'Cookie-Einstellungen',
cards:[['Zukunftssicher','Bereit für morgen? Wir machen es möglich.'],['Skalierbar','Wächst mühelos mit deinem Business.'],['Effizient','Automatisiere deine Prozesse.']]},
en:{url:'eckstein.io',brand:'Benjamin',nav:['Services','About','Contact'],navCta:'Get started',eyebrow:'New: AI agents',hi:'Hi, I’m Benjamin',
hl:['Innovative','AI solutions','for your business'],hl2:'Agentic engineering.',
sub:'[[Everyone]] on your team [[can]] [[use]] the power of [[AI]], starting [[now]][[.]] [[Where’s]] [[your]] biggest lever – and where’s your [[limit]][[?]] We show you how to push it.',
cta:'Get started',cta2:'Learn more',cta3:'Start a project',xl:'Book a call',xh:'30 min, free',ck:'Cookie settings',
cards:[['Future-proof','Ready for tomorrow? We make it happen.'],['Scalable','Grows effortlessly with your business.'],['Efficient','Automate your workflows.']]}};
/* the hundred others: everybody typed the same prompt and got the same page, each under their own name */
const OWN='Anna Tom Lena Jonas Mia Leon Sophie Felix Emma Paul Hannah Lukas Marie Finn Lea Noah Clara Elias Ida Mila Luis Emilia Max Lina Henry Ella Theo Frieda Anton Greta Oskar Mara Jakob Nora David Sarah Samuel Julia Moritz Laura Erik Paula Nico Amelie Tim Zoe Jan Luisa Karl Alma Vincent Rosa Fabian Selin Can Aylin Milan Leni Kai Nina Mats Pia Linus Jana Ole Merle Bruno Romy Emil Tilda Arne Lotte Ali Yara Omar Mira Levi Jule Timo Eva Sven Ines Malte Rieke Deniz Elif Marco Sina Joris Lars Katja Ronja Dario Svea Hugo Nele Till Anja Carla'.split(' ');
const NAME=$('who').querySelector('h1').textContent.trim(),ROLE=$('who').querySelector('p').textContent.trim(),REPLAY=$('rp').querySelector('span').textContent.trim();
const S={
de:{prompt:'Erstelle eine Website für einen KI‑Freelancer.',ph:'Nachricht eingeben …',
take:'Die meisten nehmen,<br class=m> was sie kriegen.',cA:'Ein Plan.',cB:'Nicht alles<br class=m> kommt durch.',go:n=>`<b>${n}</b>von 100 ${n===1?'macht':'machen'} weiter`,
ch:{1:'Wie generiert.',5:'Linksbündig, echte Schrift.',6:'Eine Farbe. Linien statt Karten.',7:'Große Typo. Ein Ziel.',8:'Ohne Floskeln. Der Rest: über Nacht.'}},
en:{prompt:'Make a website for an AI freelancer.',ph:'Ask anything',
take:'Most take<br class=m> what they get.',cA:'One plan.',cB:'Not everything<br class=m> gets through.',go:n=>`<b>${n}</b>of 100 ${n===1?'keeps':'keep'} going`,
ch:{1:'As generated.',5:'Left-aligned, a real typeface.',6:'One colour. Rules, not cards.',7:'Big type. One goal.',8:'No filler. The rest: overnight.'}}};
const Q=new URLSearchParams(location.search);
const seekT=DEV&&Q.has('t')?Math.max(0,parseFloat(Q.get('t'))||0):null;
const endQ=Q.get('end')==='1',PERF=DEV&&Q.get('perf')==='1';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lang=R.lang==='en'?'en':'de';
const INK='#08090d',SYS='system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',SANS='Epilogue,"Helvetica Neue",Helvetica,Arial,sans-serif',MONO='"Fragment Mono",ui-monospace,Menlo,monospace';
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x,P=(t,a,b)=>cl((t-a)/(b-a)),L=(a,b,p)=>a+(b-a)*p,ss=x=>x*x*(3-2*x),sst=(a,b,x)=>ss(P(x,a,b));
const mul=s=>()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const softmin=(a,b,k)=>{const m=Math.min(a,b);return m-k*Math.log(Math.exp((m-a)/k)+Math.exp((m-b)/k))};
function bz(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
const X=t=>((ax*t+bx)*t+cx)*t,D=t=>(3*ax*t+2*bx)*t+cx,Y=t=>((ay*t+by)*t+cy)*t;
return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const e=X(t)-x;if(Math.abs(e)<1e-5)return Y(t);const d=D(t);if(Math.abs(d)<1e-6)break;t=cl(t-e/d)}
let lo=0,hi=1;t=x;for(let i=0;i<30;i++){if(X(t)<x)lo=t;else hi=t;t=(lo+hi)/2}return Y(t)}}
const eOut=bz(.16,1,.3,1),eIO=bz(.66,0,.34,1),eSoft=bz(.4,0,.2,1),ePop=bz(.34,1.56,.64,1),eIn=bz(.55,0,.85,.4),
ePen=bz(.2,.62,.12,1),eNW=bz(.55,.02,.16,1),eCrane=bz(.62,0,.12,1),eExp=bz(.3,0,.22,1),eCool=bz(.25,.1,.25,1),eFade=bz(.5,0,.75,.95),eZoom=bz(.45,0,.5,1),
eFast=bz(.3,.1,.4,1),eSlow=bz(.5,.02,.25,1),eCare=bz(.35,.1,.05,1),eLit=bz(.25,.55,.3,1),ePush=bz(.42,0,.28,1),eFly=bz(.45,0,.12,1);
const mixC=(a,b,p)=>a.map((v,i)=>Math.round(L(v,b[i],p))),rgb=a=>`rgb(${a[0]},${a[1]},${a[2]})`;
/* ---------- timeline (seconds): I the prompt and the hundred, Ib the wall iterates and stops, II versions, III night, IV cut, V deploy and finisher ---------- */
const T={pa:.25,ty0:.7,ty1:3.5,ent:5.1,up:5.15,sh0:5.25,pop:5.75,pOut:7.65,
bandIn:9.2,l1:9.5,txOut:10.6,bandOut:10.8,
it0:10.65,itA:11.05,b2In:12.45,l2:12.75,tx2Out:14.7,b2Out:14.9,hl0:15.25,fw0:16.35,fw1:17.45,
nf0:22.95,nf1:25.75,TB0:24.55,TB1:25.15,N0:25.1,N1:35.3,TP0:34.9,TP1:36.5,
pg0:36.65,pg1:37.65,redA:38.35,redB:39.9,litA:40.1,END:46};
/* the calm build of the Hundred: 1, 4, 25, 100, each ring fading in with the camera */
const STG=[[6.75,1.1],[7.95,1.05],[9.1,1.2]];
/* ours in the wall: small tweaks like everybody, then v5 once the others have stopped */
const OURS=[[11.6,2],[12.95,3],[14.3,4],[15.6,5]];
/* act II: the stack. Each version comes to the front, stronger than the one before; the earlier ones step back */
const A2=[[17.45,'in',5],[18.85,'push',6],[20.25,'push',7],[21.6,'push',8]],VD=.5;
const CARD_T={cA:[24.65,26.85],cB:[32.45,34.75]};
