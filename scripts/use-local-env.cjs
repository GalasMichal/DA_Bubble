/**
 * Writes src/environments/environment.firebase.ts (gitignored).
 * - serve/watch: use environment.local.ts if present, else environment.development.ts
 * - build: use environment.ts (production placeholders for CI)
 * - postinstall: create file if missing so tsc/lint work after clone
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const envDir = path.join(root, 'src', 'environments');
const outFile = path.join(envDir, 'environment.firebase.ts');
const localFile = path.join(envDir, 'environment.local.ts');
const prodFile = path.join(envDir, 'environment.ts');
const devFile = path.join(envDir, 'environment.development.ts');

const mode = process.argv[2] || 'serve';

function copy(source, dest) {
  fs.copyFileSync(source, dest);
  console.log(
    '[env]',
    path.relative(root, dest),
    '<=',
    path.relative(root, source)
  );
}

if (mode === 'build') {
  copy(prodFile, outFile);
  process.exit(0);
}

if (mode === 'postinstall') {
  if (fs.existsSync(outFile)) {
    process.exit(0);
  }
  if (fs.existsSync(localFile)) {
    copy(localFile, outFile);
  } else {
    copy(devFile, outFile);
  }
  console.log('[env] postinstall: created environment.firebase.ts');
  process.exit(0);
}

// serve / watch / env:local
if (fs.existsSync(localFile)) {
  copy(localFile, outFile);
} else {
  copy(devFile, outFile);
}
