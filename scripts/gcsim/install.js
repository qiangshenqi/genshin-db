const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const ROOT = path.join(__dirname, '..', '..');
const DIR = path.join(ROOT, 'tools', 'gcsim');
const BIN = path.join(DIR, 'gcsim.exe');
const RELEASE = 'https://github.com/genshinsim/gcsim/releases/download/v2.50.0/gcsim_windows_amd64.exe';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const go = (u, redirects = 0) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirects > 5) return reject(new Error('too many redirects'));
          const next = new URL(res.headers.location, u).toString();
          return go(next, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`download failed: ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      }).on('error', reject);
    };
    go(url);
  });
}

async function main() {
  fs.mkdirSync(path.join(DIR, 'configs'), { recursive: true });
  fs.mkdirSync(path.join(DIR, 'results'), { recursive: true });
  if (fs.existsSync(BIN) && fs.statSync(BIN).size > 1_000_000) {
    console.log('gcsim already installed:', BIN);
    return;
  }
  console.log('Downloading gcsim v2.50.0 ...');
  await download(RELEASE, BIN);
  console.log('Installed:', BIN);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
