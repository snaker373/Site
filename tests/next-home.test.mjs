import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { whatsappUrl, projects, categories, locations, serviceItems } from '../src/lib/site.ts';

const html = () => fs.readFileSync('dist/index.html', 'utf8');

test('German homepage has accessible contact, animation and comparison controls', () => {
  const page = html();
  assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(page.includes('<html lang="de"'));
  for (const id of ['main', 'hero-title', 'transformation', 'portfolio', 'area', 'contact']) assert.ok(page.includes(`id="${id}"`), id);
  assert.equal((page.match(/type="range"/g)||[]).length,2);
  assert.match(page, /type="range"[^>]*min="0"[^>]*max="100"/);
  assert.match(page, /aria-valuetext="Vorher: 50 Prozent; Nachher: 50 Prozent"/);
  assert.match(page, /loading="lazy"/);
  assert.ok(!page.includes('Originalfotos meiner Arbeiten'));
  assert.ok(!page.includes('Automatischen Bildwechsel pausieren'));
  for(const file of ['gallery-hero.jpg','g43.jpg','g248.jpg','g132.jpg','gallery-3.jpg']) assert.ok(page.includes('/assets/'+file),file);
  assert.ok(!page.includes('collage-thumb'));
  assert.ok(!page.match(/<header[\s\S]*?>[\s\S]*?Servicegebiet[\s\S]*?<\/header>/));
  assert.ok(page.includes('/assets/optimized/gallery-hero-720.webp'));
  for(const file of ['coverage-map.png','logo-web.png','karton.jpg','Bettt2.jpg','photo222.jpg','g444.jpg']) assert.ok(page.includes('/assets/'+file),file);
  assert.ok(!page.includes('aggregateRating'));
});

test('WhatsApp preserves German service requests, Unicode, source and inquiry code', () => {
  const inquiry = { name: 'Анна & Jürgen', city: 'Trier', service:'Küchenmontage', code:'SM-EXAMPLE123', details: 'PAX 200×236\nhttps://ikea.com/?a=1&b=2#details' };
  const url = new URL(whatsappUrl(inquiry));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/4915172377683');
  assert.equal([...url.searchParams.keys()].join(), 'text');
  const message = url.searchParams.get('text');
  for (const value of Object.values(inquiry)) assert.ok(message.includes(value));
  assert.ok(message.includes('Quelle: saarmontage.de/'));
  assert.ok(!new URL(whatsappUrl()).searchParams.get('text').includes('undefined'));
});

test('every filter has real photos and the homepage links all seven services and eight cities', () => {
  for (const category of categories.slice(1)) assert.ok(projects.some(p => p.category === category), category);
  for (const project of projects) assert.ok(fs.existsSync(`dist/assets/${project.image}`), project.image);
  const page=html();
  for(const {slug} of serviceItems) assert.ok(page.includes(`href="/${slug}/"`),slug);
  for(const {slug} of locations) assert.ok(page.includes(`href="/moebelmontage-${slug}/"`),slug);
  assert.ok(page.includes('href="/gewerbekunden/"'));
});

test('homepage contains the same optional consent controls and valid business metadata as other pages',()=>{
  const page=html();
  for(const attr of ['id="cookie-panel"','data-consent="accepted"','data-consent="denied"','data-cookie-settings="true"','data-analytics="disabled"']) assert.ok(page.includes(attr),attr);
  const schema=JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'],'LocalBusiness');
  assert.equal(schema.telephone,'+4915172377683');
  assert.equal(schema.email,'info@saarmontage.de');
});

test('homepage shows the current Google rating and links to its source',()=>{
 const page=html().replaceAll('<!-- -->','');
 for(const text of ['5,0','3 Google-Bewertungen','3 Bewertungen ansehen','Anaso M.','Yevhenii Turchak','Hanna Kryventsova','https://share.google/q1Q1BTskvtG07SKmX']) assert.ok(page.includes(text),text);
 assert.ok(!page.includes('floating-whatsapp'));
 assert.ok(!page.includes('In drei Schritten fertig montiert.'));
 assert.ok(!page.includes('Ihre Fragen.<br/>Klare Antworten.'));
});

test('homepage inquiry combines PAX with IKEA and reveals a custom service field',()=>{
 const page=html(),source=fs.readFileSync('src/components/ContactForm.tsx','utf8');
 for(const label of ['IKEA Möbelmontage (inkl. PAX)','Demontage &amp; Wiederaufbau','Mehrere Möbel / Kompletteinrichtung','Gewerblicher Auftrag / Baumarkt','Sonstiges']) assert.ok(page.includes(label),label);
 assert.ok(!page.includes('<option value="IKEA PAX Montage"'));
 assert.ok(source.includes("selectedService==='Sonstiges'"));
 assert.ok(source.includes('name="otherService"'));
 assert.ok(source.includes('required'));
});
