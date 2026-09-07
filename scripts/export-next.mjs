import { cpSync } from 'node:fs';
// Keep the existing Sites output contract. Next's export supplies the new homepage.
cpSync('out', 'dist', { recursive: true });
console.log('Next.js homepage and preserved routes exported to dist/');
