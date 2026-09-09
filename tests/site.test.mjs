import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {services,cities} from '../content/services.mjs';
const routes=JSON.parse(fs.readFileSync('content/routes.json','utf8'));
const context=vm.createContext({URLSearchParams,Date,Math});
vm.runInContext(fs.readFileSync('js/attribution.js','utf8'),context);
const A=context.SaarAttribution;
test('all requested routes exist with unique titles, canonical, H1 and valid structured data',()=>{
 const titles=new Set();
 assert.equal(routes.length,25);
 for(const r of routes){
  const html=fs.readFileSync(path.join('.',r.path,'index.html'),'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,r.path);
  assert.ok(html.includes(`href="https://saarmontage.de${r.path}"`));
  assert.ok(html.includes('content="index, follow"'));
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.ok(!html.includes('aggregateRating'),'No unverified star rating');
 }
 for(const s of services)assert.ok(routes.some(r=>r.path===`/${s.slug}/`));
 for(const c of cities)assert.ok(routes.some(r=>r.path===`/moebelmontage-${c.slug}/`));
});
test('every internal link, anchor, image and script resolves in each output',()=>{
 for(const base of ['.','dist'])for(const route of routes){
  const html=fs.readFileSync(path.join(base,route.path,'index.html'),'utf8');
  for(const m of html.matchAll(/(?:href|src|data-photo)="([^"]+)"/g)){
   const href=m[1];if(!href.startsWith('/')&&!href.startsWith('#'))continue;
   const url=new URL(href,'https://saarmontage.de'+route.path);
   const local=path.join(base,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
   assert.ok(fs.existsSync(local),`${route.path} -> ${href} (${base})`);
   if(url.hash && url.pathname.endsWith('/') && url.hash!=='#alle'){
    const target=fs.readFileSync(local,'utf8');assert.ok(target.includes(`id="${url.hash.slice(1)}"`),`${route.path} -> ${href}`);
   }
  }
 }
});
test('private preview cannot be indexed and analytics is disabled on all pages',()=>{
 for(const r of routes){const html=fs.readFileSync(path.join('dist',r.path,'index.html'),'utf8');assert.ok(html.includes('content="noindex, nofollow"'));if(r.path!=='/')assert.ok(html.includes('data-analytics="disabled"'));else assert.ok(!html.includes('googletagmanager.com'));assert.ok(html.includes(`href="https://saarmontage.cuddly-spool-0095.chatgpt.site${r.path}"`));}
 assert.ok(fs.readFileSync('dist/robots.txt','utf8').includes('Disallow: /'));
});
test('WhatsApp messages contain the chosen service, city, clean source page and unique inquiry code',()=>{
 for(const s of services)for(const c of cities){
  const url=new URL(A.whatsappUrl({service:s.slug,city:c.name,page:`/${s.slug}/`,id:'SM-TEST123'}));
  const text=url.searchParams.get('text');assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/4915172377683');assert.ok(text.includes(s.name));assert.ok(text.includes(c.name));assert.ok(text.includes(`Quelle: saarmontage.de/${s.slug}/`));assert.ok(text.includes('Anfragecode: SM-TEST123'));
 }
 assert.notEqual(A.inquiryId(),A.inquiryId());
 assert.equal(A.cleanPath('/kuechenmontage/?email=private@example.com#private'),'/kuechenmontage/');
 assert.equal(A.cleanPath('https://bad.example/'),'/');
 const text=A.message({service:'pax-montage',name:'Jürgen & Anna',city:'Saarbrücken',details:'PAX 200 × 236 cm\nhttps://ikea.com/test?a=1&b=2'});
 assert.equal(new URL('https://wa.me/4915172377683?text='+encodeURIComponent(text)).searchParams.get('text'),text);
});
test('analytics dimensions discard arbitrary personal data',()=>{
 const c=A.campaign('?utm_source=user@example.com&utm_campaign=John+Smith&utm_medium=+4915172377683');assert.equal(c.source,'other');assert.equal(c.campaign,'other');assert.equal(c.medium,'other');
 assert.equal(A.cityKey('John Smith, 66113 Saarbrücken'),'Saarbrücken');assert.equal(A.cityKey('private@example.com'),'other');assert.equal(A.serviceKey('arbitrary name'),'moebelmontage');
 assert.equal(A.campaign('?utm_source=google&utm_campaign=kueche').campaign,'kueche');assert.equal(A.campaign('?utm_source=').source,'');
});
test('kitchen photos and office photos are kept in their matching sections',()=>{
 const gallery=JSON.parse(fs.readFileSync('content/gallery.json','utf8'));
 const kitchens=gallery.filter(g=>g.category==='kuechen');assert.equal(kitchens.length,2);assert.ok(kitchens.every(g=>['g37.jpg','g43.jpg'].includes(g.file)));
 assert.ok(gallery.filter(g=>g.category==='buero').every(g=>!/Kommode|Bett/.test(g.alt)));
 const html=fs.readFileSync('kuechenmontage/index.html','utf8');const pictures=[...html.matchAll(/data-photo="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(pictures,['/assets/g37.jpg','/assets/g43.jpg']);
});
test('business partner page contains commercial services, supplied work photos and a tracked enquiry',()=>{
 const page=fs.readFileSync('gewerbekunden/index.html','utf8');
 for(const text of ['Stände & Präsentationsflächen','Warensortierung','Umbauten & Neueinrichtung','BAUHAUS','Kooperation anfragen']) assert.ok(page.includes(text),text);
 for(let i=1;i<=10;i++)assert.ok(page.includes(`/assets/partner-baumarkt-${String(i).padStart(2,'0')}.png`),`partner photo ${i}`);
 assert.ok(page.includes('data-service="Marktservice für Geschäftskunden"'));
 const url=new URL(A.whatsappUrl({service:'gewerbekunden',page:'/gewerbekunden/',id:'SM-B2BTEST'}));
 const message=url.searchParams.get('text');
 assert.ok(message.includes('Marktservice für Geschäftskunden'));
 assert.ok(message.includes('Quelle: saarmontage.de/gewerbekunden/'));
});
test('all generated pages use the new business email and show cookie controls on first visit',()=>{
 for(const route of routes){const page=fs.readFileSync(path.join('.',route.path,'index.html'),'utf8');assert.ok(page.includes('info@saarmontage.de'),route.path);assert.ok(!page.includes('7007779@gmail.com'),route.path);assert.ok(page.includes('id="cookie-panel"'),route.path);assert.ok(!page.match(/id="cookie-panel"[^>]*hidden/),route.path);}
});
test('contact service choice combines PAX and provides a conditional Sonstiges field',()=>{
 const page=fs.readFileSync('kontakt/index.html','utf8'),script=fs.readFileSync('js/site.js','utf8');
 for(const value of ['ikea-moebelmontage','demontage','kompletteinrichtung','gewerbekunden','sonstiges'])assert.ok(page.includes(`value="${value}"`),value);
 assert.ok(page.includes('IKEA Möbelmontage (inkl. PAX)'));
 assert.ok(!page.includes('value="pax-montage"'));
 assert.ok(page.includes('data-other-service hidden'));
 assert.ok(script.includes("f.service.value==='sonstiges'"));
 assert.ok(script.includes('f.otherService.required=active'));
});
function simulateAnalytics({consent,blockedStorage=false,preview=false}={}){
 const scripts=[],listeners={},cookies=[],store=new Map(consent?[['saarmontage-consent-v3',JSON.stringify({value:consent,at:Date.now()})]]:[]);
 const storage={getItem(k){if(blockedStorage)throw new Error('blocked');return store.get(k)||null;},setItem(k,v){if(blockedStorage)throw new Error('blocked');store.set(k,v);},removeItem(k){store.delete(k);}};
 const panel={hidden:false,querySelector(){return {focus(){}};}};
 const document={body:{dataset:{page:'/kuechenmontage/',service:'Küchenmontage',city:'',analytics:preview?'disabled':'G-0XY9QDMYG3'}},title:'Küche',referrer:'https://google.com/search?private=secret',head:{append(s){scripts.push(s);}},createElement(){return {};},getElementById(id){return id==='cookie-panel'?panel:null;},querySelector(){return null;},querySelectorAll(selector){return selector==='[data-consent]'?['accepted','denied'].map(value=>({dataset:{consent:value},addEventListener(t,fn){cookies.push({value,fn});}})):[];},addEventListener(){},cookie:''};
 const window={document,localStorage:storage,sessionStorage:storage,addEventListener(type,fn){listeners[type]=fn;}};
 const ctx=vm.createContext({window,document,location:{hostname:'saarmontage.de',origin:'https://saarmontage.de',search:'?email=secret@example.com&utm_source=google',hash:'',reload(){}},URL,URLSearchParams,Date,Math,setTimeout,clearTimeout});
 vm.runInContext(fs.readFileSync('js/attribution.js','utf8'),ctx);vm.runInContext(fs.readFileSync('js/site.js','utf8'),ctx);return {window,scripts,panel,cookies,listeners};
}
test('no GA requests before consent, after rejection, with blocked storage or in preview',()=>{
 for(const opts of [{},{consent:'denied'},{blockedStorage:true},{consent:'accepted',preview:true}])assert.equal(simulateAnalytics(opts).scripts.length,0);
 const state=simulateAnalytics();state.cookies.find(c=>c.value==='accepted').fn();assert.equal(state.scripts.length,1);state.cookies.find(c=>c.value==='accepted').fn();assert.equal(state.scripts.length,1);
});
test('accepted analytics uses a clean page URL and WhatsApp stays navigable when analytics fails',()=>{
 const state=simulateAnalytics({consent:'accepted'});assert.equal(state.scripts.length,1);
 const events=JSON.stringify(state.window.dataLayer);assert.ok(!events.includes('secret@example.com'));assert.ok(!events.includes('private=secret'));
 const anchor={dataset:{service:'Küchenmontage',city:'Homburg',placement:'hero'},href:''};let stopped=false;
 state.window.gtag=()=>{throw new Error('analytics unavailable');};
 state.listeners.click({target:{closest:()=>anchor},stopImmediatePropagation(){stopped=true;},type:'click'});
 assert.ok(stopped);assert.ok(new URL(anchor.href).searchParams.get('text').includes('Küchenmontage in Homburg'));
});

