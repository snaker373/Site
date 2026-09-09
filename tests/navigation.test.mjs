import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const routes=JSON.parse(fs.readFileSync('content/routes.json','utf8'));
const expected=JSON.parse(fs.readFileSync('content/navigation.json','utf8'));

test('all routes present the same five direct navigation destinations',()=>{
 for(const base of ['.','dist'])for(const route of routes){
  const html=fs.readFileSync(path.join(base,route.path,'index.html'),'utf8');
  const header=html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(header,route.path);
  const nav=header.match(/<nav\b[^>]*aria-label="Hauptnavigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,route.path);
  const links=[...nav.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(([,href,label])=>({href,label}));
  assert.deepEqual(links,expected,base+route.path);
  assert.ok(!nav.includes('<details'),route.path);
  assert.ok(header.includes('sm-header-inner'),route.path);
  assert.ok(header.includes('sm-menu-toggle'),route.path);
 }
});

test('internal pages highlight their current section and load the shared header styles',()=>{
 for(const route of ['/leistungen/','/gewerbekunden/','/kuechenmontage/']){
  const html=fs.readFileSync(path.join('dist',route,'index.html'),'utf8');
  const header=html.match(/<header\b[\s\S]*?<\/header>/)[0];
  assert.equal((header.match(/aria-current=/g)||[]).length,1,route);
  assert.ok(html.includes('/css/navigation.css'),route);
 }
});
