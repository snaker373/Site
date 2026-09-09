import { mkdir, readdir, stat } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const sourceDir = join(process.cwd(), 'assets');
const outputDir = join(sourceDir, 'optimized');
const widths = [720, 1440];
const supported = new Set(['.jpg', '.jpeg', '.png']);

await mkdir(outputDir, { recursive: true });
const files = (await readdir(sourceDir)).filter(file => supported.has(extname(file).toLowerCase()) && !file.startsWith('logo-'));
let sourceBytes = 0;
let outputBytes = 0;

for (const file of files) {
  const source = join(sourceDir, file);
  const sourceInfo = await stat(source);
  sourceBytes += sourceInfo.size;
  const stem = basename(file, extname(file));
  for (const width of widths) {
    const destination = join(outputDir, `${stem}-${width}.webp`);
    try {
      const destinationInfo = await stat(destination);
      if (destinationInfo.mtimeMs >= sourceInfo.mtimeMs) {
        outputBytes += destinationInfo.size;
        continue;
      }
    } catch {}
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(destination);
    outputBytes += (await stat(destination)).size;
  }
}

console.log(`Optimized ${files.length} images: ${(sourceBytes / 1048576).toFixed(1)} MB source, ${(outputBytes / 1048576).toFixed(1)} MB across responsive WebP variants.`);
