import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { whatsappUrl, projects, categories } from '../src/lib/site.ts';

const html = () => fs.readFileSync('dist/index.html', 'utf8');

test('new homepage is server rendered and its contact and comparison controls are accessible', () => {
  const page = html();
  assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(page.includes('<html lang="ru"'));
  for (const id of ['main', 'hero-title', 'transformation', 'portfolio', 'area', 'contact']) assert.ok(page.includes(`id="${id}"`), id);
  assert.match(page, /type="range"[^>]*min="0"[^>]*max="100"/);
  assert.match(page, /aria-valuetext="До сборки: 50 процентов; после сборки: 50 процентов"/);
  assert.match(page, /aria-pressed="true"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /Саарбрюккен/);
  assert.match(page, /Трир/);
  assert.match(page, /Зарлуи/);
  assert.match(page, /Цвайбрюккен/);
});

test('WhatsApp safely preserves Unicode, special characters and selected cities', () => {
  const inquiry = { name: 'Анна & Jürgen', city: 'Trier', details: 'PAX 200×236\nhttps://ikea.com/?a=1&b=2#details' };
  const url = new URL(whatsappUrl(inquiry));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/4915172377683');
  assert.equal([...url.searchParams.keys()].join(), 'text');
  const message = url.searchParams.get('text');
  for (const value of Object.values(inquiry)) assert.ok(message.includes(value));
  assert.ok(!new URL(whatsappUrl()).searchParams.get('text').includes('undefined'));
});

test('every filter has real project images and exported city links carry their location', () => {
  for (const category of categories.slice(1)) assert.ok(projects.some(p => p.category === category), category);
  for (const project of projects) assert.ok(fs.existsSync(`dist/assets/${project.image}`), project.image);
  const links = [...html().matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&')));
  for (const city of ['Saarbrücken', 'Trier', 'Saarlouis', 'Zweibrücken']) assert.ok(links.some(url => url.searchParams.get('text')?.includes(city)), city);
});
