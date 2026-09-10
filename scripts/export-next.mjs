import { cpSync } from 'node:fs';
// Keep the Sites output contract. Every public route now comes from Next.js.
cpSync('out', 'dist', { recursive: true });
console.log('Unified Next.js site exported to dist/');
