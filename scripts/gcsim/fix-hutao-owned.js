const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const cfgPath = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28', 't08_hutao_xq.txt');
const outPath = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28', 't08_hutao_xq.json');
const webPath = path.join(ROOT, 'web', 'data', 'rank-28-teams.json');

// Owned shell: Hutao / Xingqiu / Zhongli / Bennett (no Yelan)
const body = `options swap_delay=12 iteration=200 workers=8;
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

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
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

// Alternate owned shell: Hutao / Xingqiu / Furina / Bennett
const altPath = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28', 't08_hutao_xq_furina.txt');
const altOut = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28', 't08_hutao_xq_furina.json');
const alt = `options swap_delay=12 iteration=200 workers=8;
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

fs.writeFileSync(cfgPath, body);
fs.writeFileSync(altPath, alt);

const a = runConfig(cfgPath, outPath, { iterations: 200 });
console.log('胡桃/行秋/钟离/班', a.dps, Number(a.duration).toFixed(1) + 's');
const b = runConfig(altPath, altOut, { iterations: 200 });
console.log('胡桃/行秋/芙宁娜/班', b.dps, Number(b.duration).toFixed(1) + 's');

const best = (b.dps || 0) >= (a.dps || 0)
  ? { id: 8, name: '胡桃/行秋/芙宁娜/班尼特', dps: b.dps, dpsMin: b.dpsMin, dpsMax: b.dpsMax, duration: b.duration, source: 'rank28/t08_hutao_xq_furina', note: '无夜兰；用行秋+芙替代', reliable: (b.duration || 999) < 140 }
  : { id: 8, name: '胡桃/行秋/钟离/班尼特', dps: a.dps, dpsMin: a.dpsMin, dpsMax: a.dpsMax, duration: a.duration, source: 'rank28/t08_hutao_xq', note: '无夜兰；账号可组原壳', reliable: (a.duration || 999) < 140 };

const web = JSON.parse(fs.readFileSync(webPath, 'utf8'));
const map = new Map(web.ranking.map((r) => [r.id, { ...r }]));
map.set(8, best);
const ranked = [...map.values()]
  .map(({ rank, ...rest }) => rest)
  .sort((x, y) => (y.dps || 0) - (x.dps || 0))
  .map((r, i) => ({ rank: i + 1, ...r }));
fs.writeFileSync(webPath, JSON.stringify({ ...web, ranking: ranked }, null, 2));
console.log('updated #8 ->', best.name, best.dps);
for (const r of ranked.slice(0, 12)) {
  console.log(String(r.rank).padStart(2), String(r.dps).padStart(7), '#' + r.id, r.name);
}
