/**
 * 用同一套辅助 + 原版火神面板为底，对 CR/CD 武器做最小微调后排行
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const base = fs.readFileSync(path.join(ROOT, 'tools/gcsim/configs/mavuika-sapwood-r1.txt'), 'utf8');
const OUT = path.join(ROOT, 'web/data/mavuika-weapon-rank.json');

const WEAPONS = [
  { name: '超越之匙', key: 'ateaspoonoftranscendence', refine: 1, tweak: 'none' },
  { name: '焚曜千阳', key: 'athousandblazingsuns', refine: 1, tweak: 'cr' },
  { name: '无无禁锢', key: 'theunforged', refine: 1, tweak: 'none' },
  { name: '狼的末路', key: 'wolfsgravestone', refine: 1, tweak: 'none' },
  { name: '苇海信标', key: 'beacon', refine: 1, tweak: 'cr' },
  { name: '赤角石溃杵', key: 'redhornstonethresher', refine: 1, tweak: 'cd' },
  { name: '螭骨剑', key: 'serpentspine', refine: 5, tweak: 'cr' },
  { name: '裁断', key: 'verdict', refine: 1, tweak: 'cr' },
  { name: '松籁响起之时', key: 'songofbrokenpines', refine: 1, tweak: 'none' },
  { name: '天空之傲', key: 'skywardpride', refine: 1, tweak: 'none' },
  { name: '试作古华', key: 'prototypearchaic', refine: 5, tweak: 'none' },
  { name: '撼地者', key: 'earthshaker', refine: 5, tweak: 'none' },
  { name: '硕果钩', key: 'fruitfulhook', refine: 5, tweak: 'none' },
  { name: '山王长牙', key: 'fangofthemountainking', refine: 1, tweak: 'cr' },
  { name: '黑岩斩刀', key: 'blackcliffslasher', refine: 1, tweak: 'cd' },
  { name: '雨裁', key: 'rainslasher', refine: 5, tweak: 'none' },
  { name: '聊聊棍', key: 'talkingstick', refine: 5, tweak: 'cr' },
];

function applyTweak(cfg, tweak) {
  if (tweak === 'cr') {
    return cfg
      .replace('em=187 pyro%=0.466 cr=0.311', 'em=187 pyro%=0.466 cd=0.622')
      .replace(
        'em=158.56 cr=0.331 cd=0.7944',
        'em=118.92 cr=0.1986 cd=0.7944'
      );
  }
  if (tweak === 'cd') {
    return cfg.replace(
      'em=158.56 cr=0.331 cd=0.7944',
      'em=118.92 cr=0.331 cd=0.662'
    );
  }
  return cfg;
}

function main() {
  const rows = [];
  let i = 0;
  for (const w of WEAPONS) {
    i += 1;
    let cfg = base.replace(
      /mavuika add weapon="[^"]+" refine=\d+/,
      `mavuika add weapon="${w.key}" refine=${w.refine}`
    );
    cfg = applyTweak(cfg, w.tweak);
    const cfgPath = path.join(ROOT, 'tools/gcsim/configs/_mav_wep_tmp.txt');
    const outPath = path.join(ROOT, 'tools/gcsim/results/_mav_wep_cal.json');
    fs.writeFileSync(cfgPath, cfg);
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: 200 });
      rows.push({
        name: w.name,
        refine: w.refine,
        dps: sim.dps,
        min: sim.dpsMin,
        max: sim.dpsMax,
      });
      console.log(`[${i}/${WEAPONS.length}] ${w.name} R${w.refine} => ${sim.dps}`);
    } catch (e) {
      console.warn(`[${i}] ${w.name} fail: ${e.message}`);
    }
  }

  rows.sort((a, b) => b.dps - a.dps);
  const baseline = rows.find((x) => x.name === '超越之匙');
  const baseDps = baseline ? baseline.dps : null;
  const ranking = rows.map((r, idx) => ({
    rank: idx + 1,
    ...r,
    vsBaseline: baseDps == null ? null : r.dps - baseDps,
  }));

  const payload = {
    fixed: {
      team: '玛薇卡 C0 / 希诺宁 C0 苍古+千岩 / 茜特菈莉 C0 祭星+绘卷 / 班尼特 C6 原木R1+宗室',
      mavuikaSet: '黑曜秘典4',
      baselineWeapon: '超越之匙 R1',
      iterations: 200,
    },
    generatedAt: new Date().toISOString(),
    baselineDps: baseDps,
    winner: ranking[0],
    ranking,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log('\n=== RANK ===');
  ranking.forEach((r) => {
    const d =
      r.vsBaseline == null
        ? ''
        : ` (${r.vsBaseline >= 0 ? '+' : ''}${r.vsBaseline})`;
    console.log(`#${r.rank} ${r.dps}${d} | ${r.name} R${r.refine}`);
  });
}

main();
