import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Create responsive WebP variants before any page references them.
execFileSync(process.execPath, ['scripts/optimize-images.mjs'], { stdio: 'inherit' });

// Existing German routes remain standalone pages during the incremental migration.
// Always regenerate them so content and shared styles cannot fall behind the homepage.
execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
const isPublic = process.env.SITE_PUBLIC === 'true';
const origin = isPublic ? 'https://saarmontage.de' : 'https://saarmontage.cuddly-spool-0095.chatgpt.site';
mkdirSync('public', { recursive: true });
for (const dir of ['assets', 'css', 'js']) cpSync(dir, join('public', dir), { recursive: true });
cpSync('favicon.svg', 'public/favicon.svg');
const routes = JSON.parse(readFileSync('content/routes.json', 'utf8'));
for (const { path } of routes.filter(r => r.path !== '/')) {
  const destination = join('public', path.slice(1));
  mkdirSync(destination, { recursive: true });
  let html = readFileSync(join('.', path.slice(1), 'index.html'), 'utf8');
  if (!isPublic) html = html.replaceAll('https://saarmontage.de', origin)
    .replaceAll('content="index, follow"', 'content="noindex, nofollow"')
    .replaceAll('data-analytics="G-0XY9QDMYG3"', 'data-analytics="disabled"');
  writeFileSync(join(destination, 'index.html'), html);
}
for (const file of ['impressum.html', 'datenschutz.html']) cpSync(file, join('public', file));
writeFileSync('public/robots.txt', isPublic ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync('public/sitemap.xml', readFileSync('sitemap.xml', 'utf8').replaceAll('https://saarmontage.de', origin));
