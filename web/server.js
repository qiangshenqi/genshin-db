const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const genshindb = require('../src/main.js');

genshindb.setOptions({
  queryLanguages: ['ChineseSimplified', 'English'],
  resultLanguage: 'ChineseSimplified',
});

const PORT = Number(process.env.PORT) || 3780;
const PUBLIC_DIR = path.join(__dirname, 'public');
const REACTIONS_PATH = path.join(__dirname, 'data', 'elemental-reactions.json');
const GCSIM_RANKINGS_PATH = path.join(__dirname, 'data', 'gcsim-rankings.json');
const elementalReactions = JSON.parse(fs.readFileSync(REACTIONS_PATH, 'utf8'));

function readGcsimRankings() {
  if (!fs.existsSync(GCSIM_RANKINGS_PATH)) {
    return {
      engine: 'gcsim',
      ranking: [],
      winner: null,
      assumptions: ['尚未生成排名，请先运行 npm run gcsim:run'],
    };
  }
  return JSON.parse(fs.readFileSync(GCSIM_RANKINGS_PATH, 'utf8'));
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function pickCharacterSummary(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    title: c.title,
    description: c.description,
    elementText: c.elementText,
    elementType: c.elementType,
    weaponText: c.weaponText,
    rarity: c.rarity,
    birthday: c.birthday,
    region: c.region,
    affiliation: c.affiliation,
    constellation: c.constellation,
    substatText: c.substatText,
    cv: c.cv,
    images: c.images,
    url: c.url,
    version: c.version,
  };
}

function handleApi(req, res, url) {
  const q = (url.searchParams.get('q') || '').trim();
  const route = url.pathname;

  if (route === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (route === '/api/reactions') {
    return sendJson(res, 200, elementalReactions);
  }

  if (route === '/api/gcsim/rankings') {
    return sendJson(res, 200, readGcsimRankings());
  }

  if (route === '/api/gcsim/share') {
    const id = (url.searchParams.get('id') || '').trim();
    if (!id) return sendJson(res, 400, { error: '缺少 share id' });
    // 代理官方 share，便于前端展示已有模拟结果
    httpsGetJson(`https://gcsim.app/api/share/${encodeURIComponent(id)}`)
      .then((data) => sendJson(res, 200, {
        id,
        characters: (data.character_details || []).map((c) => c.name),
        dps: data.statistics?.dps?.mean ?? null,
        dpsMin: data.statistics?.dps?.min ?? null,
        dpsMax: data.statistics?.dps?.max ?? null,
        duration: data.statistics?.duration?.mean ?? null,
        config: data.config_file || null,
        url: `https://gcsim.app/sh/${id}`,
      }))
      .catch((e) => sendJson(res, 502, { error: String(e.message || e) }));
    return;
  }

  if (route === '/api/characters') {
    const names = genshindb.characters('names', { matchCategories: true }) || [];
    const list = names.map((name) => {
      const c = genshindb.characters(name);
      return {
        name: c?.name || name,
        elementText: c?.elementText,
        elementType: c?.elementType,
        weaponText: c?.weaponText,
        rarity: c?.rarity,
        region: c?.region,
        icon: c?.images?.mihoyo_icon || c?.images?.icon || c?.images?.portrait,
      };
    });
    return sendJson(res, 200, { count: list.length, list });
  }

  if (route === '/api/search') {
    if (!q) return sendJson(res, 400, { error: '缺少查询参数 q' });

    const character = genshindb.characters(q);
    const weapon = genshindb.weapons(q);
    const artifact = genshindb.artifacts(q);

    return sendJson(res, 200, {
      query: q,
      character: pickCharacterSummary(character),
      weapon: weapon
        ? {
            name: weapon.name,
            description: weapon.description,
            weaponText: weapon.weaponText || weapon.type,
            rarity: weapon.rarity,
            mainStatText: weapon.mainStatText,
            effectName: weapon.effectName,
            effectTemplateRaw: weapon.effectTemplateRaw || weapon.r1?.description,
            images: weapon.images,
            version: weapon.version,
          }
        : null,
      artifact: artifact
        ? {
            name: artifact.name,
            rarityList: artifact.rarityList,
            effect2Pc: artifact.effect2Pc,
            effect4Pc: artifact.effect4Pc,
            images: artifact.images,
          }
        : null,
    });
  }

  if (route === '/api/character') {
    if (!q) return sendJson(res, 400, { error: '缺少查询参数 q' });
    const character = genshindb.characters(q);
    if (!character) return sendJson(res, 404, { error: '未找到角色' });

    const talents = genshindb.talents(character.name) || genshindb.talents(q);
    const constellations = genshindb.constellations(character.name) || genshindb.constellations(q);

    return sendJson(res, 200, {
      character: pickCharacterSummary(character),
      talents: talents
        ? {
            combat1: talents.combat1,
            combat2: talents.combat2,
            combat3: talents.combat3,
            passive1: talents.passive1,
            passive2: talents.passive2,
            passive3: talents.passive3,
            passive4: talents.passive4,
          }
        : null,
      constellations: constellations
        ? {
            name: constellations.name,
            c1: constellations.c1,
            c2: constellations.c2,
            c3: constellations.c3,
            c4: constellations.c4,
            c5: constellations.c5,
            c6: constellations.c6,
          }
        : null,
    });
  }

  return sendJson(res, 404, { error: '未知接口' });
}

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath);
  if (rel === '/') rel = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
    return serveStatic(req, res, url.pathname);
  } catch (e) {
    sendJson(res, 500, { error: String(e.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`原神图鉴已启动: http://localhost:${PORT}`);
});
