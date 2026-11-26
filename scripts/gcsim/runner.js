const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const https = require('https');

const ROOT = path.join(__dirname, '..', '..');
const GCSIM_DIR = path.join(ROOT, 'tools', 'gcsim');
const BIN = path.join(GCSIM_DIR, 'gcsim.exe');
const CONFIG_DIR = path.join(GCSIM_DIR, 'configs');
const RESULT_DIR = path.join(GCSIM_DIR, 'results');
const CATALOG_PATH = path.join(__dirname, 'catalog.json');
const RANKING_OUT = path.join(ROOT, 'web', 'data', 'gcsim-rankings.json');

function writeUtf8NoBom(file, text) {
  fs.writeFileSync(file, text.replace(/^\uFEFF/, ''), { encoding: 'utf8' });
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function ensureBin() {
  if (!fs.existsSync(BIN)) {
    throw new Error('gcsim.exe 不存在，请先运行: npm run gcsim:install');
  }
}

function parseCliDps(stdout) {
  const m = String(stdout).match(/resulting in ([\d.]+) dps/i);
  return m ? Number(m[1]) : null;
}

function readResultJson(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function runConfig(configPath, outPath, { iterations } = {}) {
  ensureBin();
  let cfg = fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, '');
  if (iterations) {
    if (/iteration\s*=\s*\d+/i.test(cfg)) {
      cfg = cfg.replace(/iteration\s*=\s*\d+/gi, `iteration=${iterations}`);
    } else if (/options\s+/i.test(cfg)) {
      cfg = cfg.replace(/options\s+/i, `options iteration=${iterations} `);
    } else {
      cfg = `options iteration=${iterations};\n` + cfg;
    }
  }
  if (!/workers\s*=/i.test(cfg) && /options\s+/i.test(cfg)) {
    cfg = cfg.replace(/options\s+/i, 'options workers=8 ');
  }

  const tmp = configPath + '.run.txt';
  writeUtf8NoBom(tmp, cfg);

  const proc = spawnSync(BIN, ['-c', tmp, '-out', outPath], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
  });

  try { fs.unlinkSync(tmp); } catch {}

  const stdout = `${proc.stdout || ''}\n${proc.stderr || ''}`;
  if (proc.status !== 0) {
    const errLine = stdout.split(/\r?\n/).find((l) => /error|unrecognized|failed|panic/i.test(l)) || stdout.slice(0, 300);
    throw new Error(`gcsim failed (${path.basename(configPath)}): ${errLine}`);
  }

  const json = readResultJson(outPath);
  const dps =
    json?.statistics?.dps?.mean ??
    parseCliDps(stdout);

  const duration =
    json?.statistics?.duration?.mean ??
    Number((stdout.match(/Average duration of ([\d.]+)/i) || [])[1]) ??
    null;

  const chars = (json?.character_details || []).map((c) => c.name).filter(Boolean);

  return {
    dps: dps == null ? null : Math.round(dps),
    dpsMin: json?.statistics?.dps?.min == null ? null : Math.round(json.statistics.dps.min),
    dpsMax: json?.statistics?.dps?.max == null ? null : Math.round(json.statistics.dps.max),
    duration,
    characters: chars,
    iterations: json?.simulator_settings?.iterations || iterations || null,
    rawOut: outPath,
    stdout: stdout.trim(),
  };
}

async function importShare(shareId, slug) {
  const data = await httpGetJson(`https://gcsim.app/api/share/${shareId}`);
  if (!data?.config_file) throw new Error(`share ${shareId} 没有 config_file`);
  const file = path.join(CONFIG_DIR, `${slug}.txt`);
  writeUtf8NoBom(file, data.config_file);
  return {
    file,
    shareId,
    characters: (data.character_details || []).map((c) => c.name),
    shareDps: data.statistics?.dps?.mean == null ? null : Math.round(data.statistics.dps.mean),
    config: data.config_file,
  };
}

async function main() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  ensureBin();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const iterations = Number(process.env.GCSIM_ITERS || catalog.defaultIterations || 200);
  const results = [];

  for (const team of catalog.teams) {
    console.log(`\n=== ${team.name} ===`);
    let configPath = team.config
      ? path.join(CONFIG_DIR, team.config)
      : null;

    let shareMeta = null;
    if (team.shareId) {
      try {
        shareMeta = await importShare(team.shareId, team.id);
        configPath = shareMeta.file;
        console.log(`imported share ${team.shareId}, published DPS≈${shareMeta.shareDps}`);
      } catch (e) {
        console.warn(`share import failed: ${e.message}`);
        if (!configPath || !fs.existsSync(configPath)) {
          results.push({
            id: team.id,
            name: team.name,
            error: String(e.message || e),
            source: team.source || 'gcsim',
          });
          continue;
        }
      }
    }

    if (!configPath || !fs.existsSync(configPath)) {
      results.push({
        id: team.id,
        name: team.name,
        error: '缺少配置文件',
        source: team.source || 'gcsim',
      });
      continue;
    }

    try {
      const outPath = path.join(RESULT_DIR, `${team.id}.json`);
      const sim = runConfig(configPath, outPath, { iterations });
      const row = {
        id: team.id,
        name: team.name,
        axis: team.axis || '',
        notes: team.notes || '',
        source: team.source || 'gcsim',
        shareId: team.shareId || null,
        shareUrl: team.shareId ? `https://gcsim.app/sh/${team.shareId}` : null,
        shareDps: shareMeta?.shareDps ?? null,
        characters: sim.characters.length ? sim.characters : (team.characters || []),
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        duration: sim.duration,
        iterations: sim.iterations,
        configFile: path.relative(ROOT, configPath).replace(/\\/g, '/'),
      };
      results.push(row);
      console.log(`local DPS=${row.dps} chars=${row.characters.join(',')}`);
    } catch (e) {
      console.warn(e.message);
      results.push({
        id: team.id,
        name: team.name,
        axis: team.axis || '',
        notes: team.notes || '',
        source: team.source || 'gcsim',
        shareId: team.shareId || null,
        shareUrl: team.shareId ? `https://gcsim.app/sh/${team.shareId}` : null,
        shareDps: shareMeta?.shareDps ?? null,
        characters: shareMeta?.characters || team.characters || [],
        error: String(e.message || e),
      });
    }
  }

  const ok = results.filter((r) => r.dps != null).sort((a, b) => b.dps - a.dps);
  const payload = {
    engine: 'gcsim',
    binary: 'tools/gcsim/gcsim.exe',
    versionHint: 'v2.50.0',
    generatedAt: new Date().toISOString(),
    iterations,
    assumptions: [
      '使用开源帧级模拟器 gcsim（https://github.com/genshinsim/gcsim）。',
      '队伍需要完整轴与面板配置，无法对全部角色组合暴力穷举。',
      '本结果来自 curated 配置 + 本地重跑；不同命座/精炼/轴会导致 DPS 差异很大。',
      `本地默认 iteration=${iterations}（可用环境变量 GCSIM_ITERS 调整）。`,
    ],
    ranking: ok,
    all: results,
    winner: ok[0] || null,
  };

  fs.mkdirSync(path.dirname(RANKING_OUT), { recursive: true });
  writeUtf8NoBom(RANKING_OUT, JSON.stringify(payload, null, 2));
  console.log('\nWinner:', payload.winner ? `${payload.winner.name} @ ${payload.winner.dps} DPS` : 'none');
  console.log('Wrote', RANKING_OUT);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runConfig, importShare, BIN, CONFIG_DIR, RESULT_DIR };
