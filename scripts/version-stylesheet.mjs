import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Run after Tailwind: the URL identifies the emitted bytes, not the Git commit.
const root = process.argv[2] || '_site';
const digest = createHash('sha256').update(readFileSync(join(root, 'css/styles.css'))).digest('hex').slice(0, 16);
let count = 0;
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.html')) {
      const html = readFileSync(path, 'utf8');
      const updated = html.replace(/href="\/css\/styles\.css(?:\?v=[a-f0-9]+)?"/g, `href="/css/styles.css?v=${digest}"`);
      if (updated !== html) { writeFileSync(path, updated); count++; }
    }
  }
}
visit(root);
console.log(`Versioned stylesheet ${digest} across ${count} pages.`);
