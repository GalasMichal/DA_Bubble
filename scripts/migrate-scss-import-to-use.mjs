/**
 * One-time migration: replace legacy @import of shared SCSS with @use.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '..', 'src');

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith('.scss')) files.push(p);
  }
  return files;
}

function migrate(content) {
  const lines = content.split(/\r?\n/);
  const out = [];
  const seen = new Set();
  const addUse = (u) => {
    if (seen.has(u)) return;
    seen.add(u);
    out.push(u);
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith('@import')) {
      out.push(line);
      continue;
    }
    if (/colors\.scss|colors['"]/i.test(t)) addUse(`@use 'colors' as *;`);
    else if (/styles\.scss|styles['"]/i.test(t)) addUse(`@use 'mixins' as *;`);
    else if (/fonts\.scss|fonts['"]/i.test(t)) addUse(`@use 'fonts' as *;`);
    else if (/animations\.scss|animations['"]/i.test(t)) addUse(`@use 'animations' as *;`);
    else if (/landing-page\.scss|landing-page['"]/i.test(t)) addUse(`@use 'landing-page' as *;`);
    else out.push(line);
  }

  return out.join('\n');
}

for (const file of walk(srcRoot)) {
  let raw = fs.readFileSync(file, 'utf8');
  if (!raw.includes('@import')) continue;
  const next = migrate(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    console.log('updated:', path.relative(srcRoot, file));
  }
}
