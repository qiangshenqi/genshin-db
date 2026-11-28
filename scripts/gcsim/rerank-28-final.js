/**
 * Rebuild 28-team DPS ranking with owned roster only (no Yelan).
 * Hutao shell uses Mona instead of Yelan.
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const CFG = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28');
const OUT = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28');
const WEB = path.join(ROOT, 'web', 'data', 'rank-28-teams.json');
const ITER = Number(process.env.GCSIM_ITERS || 150);

fs.mkdirSync(CFG, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

function write(name, body) {
  const p = path.join(CFG, `${name}.txt`);
  fs.writeFileSync(p, body, 'utf8');
  return p;
}

// --- Hutao / Mona / Furina / Bennett (Yelan -> Mona) ---
const hutaoMona = `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;

hutao char lvl=90/90 cons=1 talent=9,9,9 +params=[start_hp=1];
hutao add weapon="dragonsbane" refine=5 lvl=90/90;
hutao add set="marechausseehunter" count=4;
hutao add stats hp=4780 atk=311 em=187 pyro%=0.466 cd=0.622;
hutao add stats def=39.36 def%=0.124 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=79.28 cr=0.3972 cd=0.662;

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="tenacityofthemillelith" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

furina char lvl=90/90 cons=0 talent=9,9,9;
furina add weapon="favoniussword" refine=5 lvl=90/90;
furina add set="goldentroupe" count=4;
furina add stats hp=4780 atk=311 er=0.518 hydro%=0.466 cr=0.311;
furina add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

active furina;
for let i=0; i<4; i=i+1 {
  furina skill, dash, attack;
  if .furina.burst.ready { furina burst; }
  bennett skill, burst;
  mona skill, burst;
  hutao skill,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge;
}
`;

// Also compare Xingqiu variant
const hutaoXqMona = `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;

hutao char lvl=90/90 cons=1 talent=9,9,9 +params=[start_hp=1];
hutao add weapon="dragonsbane" refine=5 lvl=90/90;
hutao add set="marechausseehunter" count=4;
hutao add stats hp=4780 atk=311 em=187 pyro%=0.466 cd=0.622;
hutao add stats def=39.36 def%=0.124 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=79.28 cr=0.3972 cd=0.662;

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.662;

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="noblesseoblige" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="instructor" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

active mona;
for let i=0; i<4; i=i+1 {
  mona skill, burst;
  bennett skill, burst;
  xingqiu skill, burst, attack;
  hutao skill,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge;
}
`;

const reuse = [
  { id: 1, name: '桑多涅/八重/奥黛塔/阿罗夏', dps: 192611, source: 'final-teams/1-木偶-海渊阿罗夏', reliable: true },
  { id: 2, name: '桑多涅/八重/奥黛塔/沃雅妮莎', dps: 188293, source: 'rank28/t02_sandrone_vodya', reliable: true },
  { id: 3, name: '娜维娅/莉奈娅/叶洛亚/爱诺', dps: 34173, source: 'rank28/t03_navia_linnea', note: '叶C2/爱诺C4', reliable: true },
  { id: 4, name: '凝光/莉奈娅/叶洛亚/爱诺', dps: 31430, source: 'linnea-teams/凝光C6-莉C0-爱诺C4-叶C2', reliable: true },
  { id: 5, name: '桑多涅/奥黛塔/沃雅妮莎/爱可菲', dps: 46129, source: 'rank28/t05_sandrone_stellar', note: '无八重', reliable: true },
  { id: 6, name: '玛薇卡/茜特菈莉/希诺宁/班尼特', dps: 129688, source: 'final-teams/2b-玛-主词条优化钥匙', reliable: true },
  { id: 7, name: '玛薇卡/茜特菈莉/万叶/班尼特', dps: 51345, source: 'rank28/t07_mav_kazuha', note: '弱于希诺宁壳', reliable: true },
  { id: 9, name: '可莉/尼可/夏沃蕾/菲谢尔', dps: 66126, source: 'final-teams/备-可莉超载', reliable: true },
  { id: 10, name: '可莉/尼可/杜林/菲谢尔', dps: 61678, source: 'rank28/t10_klee_durin', reliable: true },
  { id: 12, name: '绫华/芙宁娜/爱可菲/沃雅妮莎', dps: 104597, source: 'final-teams/3-绫芙爱沃-沃65k生命', reliable: true },
  { id: 13, name: '绫华/芙宁娜/爱可菲/申鹤', dps: 57484, source: 'final-teams/3b-绫芙爱申鹤', note: '轴可能低估', reliable: false },
  { id: 14, name: '绫华/莫娜/万叶/迪奥娜', dps: 33065, source: 'rank28/t14_ayaka_mona', reliable: true },
  { id: 15, name: '那维莱特/芙宁娜/万叶/希诺宁', dps: 81986, source: 'neuv-furina-kazuha-xilonen', reliable: true },
  { id: 16, name: '那维莱特/芙宁娜/万叶/钟离', dps: 70267, source: 'rank28/t16_neuv_zl', reliable: true },
  { id: 17, name: '海森/纳西妲/行秋/久岐忍', dps: 51467, source: 'rank28/t17_alhaitham_hb', reliable: true },
  { id: 18, name: '海森/纳西妲/菲谢尔/钟离', dps: 46981, source: 'rank28/t18_alhaitham_aggravate', reliable: true },
  { id: 19, name: '纳西妲/行秋/久岐忍/柯莱', dps: 35253, source: 'rank28/t19_nahida_bloom', reliable: true },
  { id: 21, name: '娜维娅/希诺宁/钟离/班尼特', dps: 47088, source: 'rank28/t21_navia_geo', reliable: true },
  { id: 22, name: '娜维娅/芙宁娜/钟离/班尼特', dps: 42017, source: 'rank28/t22_navia_furina', reliable: true },
  { id: 24, name: '流浪者/珐露珊/班尼特/钟离', dps: 41148, source: 'rank28/t24_wanderer', reliable: true },
  { id: 25, name: '魈/珐露珊/班尼特/钟离', dps: 22914, source: 'rank28/t25_xiao', reliable: true },
  { id: 27, name: '恰斯卡/芙宁娜/班尼特/茜特菈莉', dps: 57527, source: 'rank28/t27_chasca', reliable: true },
  { id: 28, name: '优菈/米卡/菲谢尔/钟离', dps: 24093, source: 'rank28/t28_eula', reliable: true },
  // unreliable leftover
  { id: 11, name: '香菱/班尼特/行秋/万叶', dps: 6422, source: 'rank28/t11_national', note: '轴未调通', reliable: false },
  { id: 20, name: '提纳里/纳西妲/菲谢尔/钟离', dps: 7390, source: 'rank28/t20_tighnari', note: '轴未调通', reliable: false },
  { id: 23, name: '诺艾尔/五郎/云堇/钟离', dps: 9123, source: 'rank28/t23_noelle', note: '轴偏弱', reliable: false },
  { id: 26, name: '克洛琳德/纳西妲/菲谢尔/钟离', dps: 7665, source: 'rank28/t26_clorinde', note: '轴未调通', reliable: false },
];

async function main() {
  console.log('=== 胡桃换莫娜 ===');
  write('t08_hutao_mona_furina', hutaoMona);
  write('t08_hutao_xq_mona', hutaoXqMona);

  const a = runConfig(path.join(CFG, 't08_hutao_mona_furina.txt'), path.join(OUT, 't08_hutao_mona_furina.json'), { iterations: ITER });
  console.log(`胡桃/莫娜/芙/班  ${a.dps}  (${Number(a.duration).toFixed(1)}s)`);
  const b = runConfig(path.join(CFG, 't08_hutao_xq_mona.txt'), path.join(OUT, 't08_hutao_xq_mona.json'), { iterations: ITER });
  console.log(`胡桃/行秋/莫娜/班  ${b.dps}  (${Number(b.duration).toFixed(1)}s)`);

  const hutaoBest =
    (a.dps || 0) >= (b.dps || 0)
      ? {
          id: 8,
          name: '胡桃/莫娜/芙宁娜/班尼特',
          dps: a.dps,
          dpsMin: a.dpsMin,
          dpsMax: a.dpsMax,
          duration: a.duration,
          source: 'rank28/t08_hutao_mona_furina',
          note: '夜兰→莫娜C2讨龙',
          reliable: true,
        }
      : {
          id: 8,
          name: '胡桃/行秋/莫娜/班尼特',
          dps: b.dps,
          dpsMin: b.dpsMin,
          dpsMax: b.dpsMax,
          duration: b.duration,
          source: 'rank28/t08_hutao_xq_mona',
          note: '夜兰→莫娜；行秋挂水',
          reliable: true,
        };

  // Keep both as note if close
  const rows = [...reuse, hutaoBest];
  if (hutaoBest.source.includes('mona_furina') && b.dps) {
    hutaoBest.note += `；对照行秋莫娜壳 ${b.dps}`;
  } else if (a.dps) {
    hutaoBest.note += `；对照芙莫娜壳 ${a.dps}`;
  }

  const ranked = rows
    .sort((x, y) => (y.dps || 0) - (x.dps || 0))
    .map((r, i) => ({ rank: i + 1, ...r }));

  const payload = {
    date: '2026-11-28',
    iterations: ITER,
    engine: 'gcsim local-missing-chars',
    note: '无夜兰；胡桃队用莫娜；~ 表示轴未调通',
    hutaoCompare: {
      monaFurina: a.dps,
      xingqiuMona: b.dps,
    },
    ranking: ranked,
  };
  fs.writeFileSync(WEB, JSON.stringify(payload, null, 2));
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(ranked, null, 2));

  console.log('\n=== 完整 DPS 排名（账号可组，无夜兰）===\n');
  console.log('| 排名 | DPS | 队伍 |');
  console.log('|------|-----|------|');
  for (const r of ranked) {
    const dps =
      r.dps == null
        ? '—'
        : r.dps >= 10000
          ? (r.dps / 10000).toFixed(1).replace(/\.0$/, '') + '万'
          : String(r.dps);
    const mark = r.reliable === false ? '~' : '';
    console.log(`| ${r.rank}${mark} | ${dps} | ${r.name} |`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
