/**
 * Lokaler FTPS-Deploy nach All-Inkl (schnell, inkrementell).
 * Credentials: .env.deploy.local (gitignored)
 * Freigabe: DEPLOY_APPROVED=yes — nur nach expliziter Chat-Freigabe setzen.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env.deploy.local');

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(envPath);

const approved =
  process.env.DEPLOY_APPROVED === 'yes' ||
  process.env.DEPLOY_APPROVED === '1';
const skipBuild = process.argv.includes('--skip-build');

if (!approved) {
  console.error(
    '[deploy] Abgebrochen: DEPLOY_APPROVED ist nicht gesetzt (yes/1).\n' +
      '       Erst im Chat freigeben, dann in .env.deploy.local DEPLOY_APPROVED=yes setzen.'
  );
  process.exit(1);
}

const required = ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD', 'FTP_REMOTE_DIR'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `[deploy] Fehlt in .env.deploy.local: ${missing.join(', ')}\n` +
      '       Vorlage: .env.deploy.local.example'
  );
  process.exit(1);
}

let remoteDir = process.env.FTP_REMOTE_DIR;
if (remoteDir === '/' || remoteDir === '') remoteDir = './';
if (!remoteDir.endsWith('/')) remoteDir += '/';

const localDir = path.join(root, 'dist', 'da-bubble', 'browser');

if (!skipBuild) {
  if (!process.env.FIREBASE_API_KEY) {
    const localEnv = path.join(root, 'src', 'environments', 'environment.local.ts');
    if (fs.existsSync(localEnv)) {
      const m = fs.readFileSync(localEnv, 'utf8').match(/apiKey:\s*'([^']+)'/);
      if (m) process.env.FIREBASE_API_KEY = m[1];
    }
  }
  if (!process.env.FIREBASE_API_KEY) {
    console.error('[deploy] FIREBASE_API_KEY fehlt (.env oder environment.local.ts)');
    process.exit(1);
  }
  console.log('[deploy] Production build…');
  const build = spawnSync('npm', ['run', 'build:ci'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

if (!fs.existsSync(path.join(localDir, 'index.html'))) {
  console.error(`[deploy] Kein Build unter ${localDir}`);
  process.exit(1);
}

const bundle = fs.readFileSync(path.join(localDir, 'index.html'), 'utf8').match(
  /main-[A-Z0-9]+\.js/
);
console.log(`[deploy] Upload → ${process.env.FTP_SERVER} ${remoteDir}`);
if (bundle) console.log(`[deploy] Bundle im Build: ${bundle[0]}`);

function ensureFtpDeploy() {
  try {
    return require('ftp-deploy');
  } catch {
    console.log('[deploy] Installiere ftp-deploy (einmalig lokal)…');
    const ins = spawnSync('npm', ['install', '--no-save', 'ftp-deploy'], {
      cwd: root,
      stdio: 'inherit',
    });
    if (ins.status !== 0) process.exit(ins.status ?? 1);
    return require('ftp-deploy');
  }
}

const FtpDeploy = ensureFtpDeploy();
const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_SERVER,
  port: 21,
  localRoot: localDir,
  remoteRoot: remoteDir,
  include: ['*', '**/*'],
  deleteRemote: false,
  forcePasv: true,
  sftp: false,
  secure: true,
  secureOptions: { rejectUnauthorized: false },
};

ftpDeploy
  .deploy(config)
  .then((res) => {
    console.log('[deploy] Fertig:', res.length, 'Datei(en) verarbeitet');
    const curl = spawnSync(
      'curl',
      ['-fsSL', 'https://da-bubble.michal-galas.de/'],
      { encoding: 'utf8' }
    );
    if (curl.status === 0 && bundle && curl.stdout.includes(bundle[0])) {
      console.log('[deploy] Live-Check OK:', bundle[0]);
      return;
    }
    if (curl.status === 0) {
      const live = curl.stdout.match(/main-[A-Z0-9]+\.js/);
      console.warn(
        '[deploy] Live noch:',
        live ? live[0] : '?',
        '— FTP-User = Hauptaccount aus KAS? Ziel = da-bubble.michal-galas.de/?'
      );
    }
  })
  .catch((err) => {
    console.error('[deploy] FTP-Fehler:', err.message || err);
    process.exit(1);
  });
