/**
 * 固定：桑多涅C1R1超越之匙、八重C2R1神乐、奥黛塔C0雾切
 * 对比第四人与部分升级
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
const OUT = path.join(ROOT, 'web/data/sandrone-user-upgrades.json');
const ITERS = 200;

const CORE = `
options swap_delay=12 iteration=${ITERS} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;

sandrone char lvl=90/90 cons=1 talent=10,9,9;
sandrone add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
sandrone add set="disenchantmentindeepshadow" count=4;
sandrone add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
sandrone add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

yaemiko char lvl=90/90 cons=2 talent=9,9,9;
yaemiko add weapon="kagurasverity" refine=1 lvl=90/90;
yaemiko add set="disenchantmentindeepshadow" count=4;
yaemiko add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
yaemiko add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.7944;

odette char lvl=90/90 cons=0 talent=9,9,9;
odette add weapon="mistsplitterreforged" refine=1 lvl=90/90;
odette add set="heartofthefurnace" count=4;
odette add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cd=0.622;
odette add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.5296;
`;

const FOURTH = {
  diona: `
diona char lvl=90/90 cons=6 talent=9,9,9;
diona add weapon="sacrificialbow" refine=5 lvl=90/90;
diona add set="totm" count=4;
diona add stats hp=4780 atk=311 er=0.518 hp%=0.932;
diona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.3306 em=79.28 cr=0.1986 cd=0.3972;
`,
  esco: `
escoffier char lvl=90/90 cons=0 talent=9,9,9;
escoffier add weapon="favoniuslance" refine=3 lvl=90/90;
escoffier add set="totm" count=4;
escoffier add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
escoffier add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`,
  alyosha6: `
alyosha char lvl=90/90 cons=6 talent=9,9,9;
alyosha add weapon="frostbreath" refine=1 lvl=90/90;
alyosha add set="noblesse" count=4;
alyosha add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
alyosha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.662;
`,
  xilonen: `
xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="favoniussword" refine=3 lvl=90/90;
xilonen add set="totm" count=4;
xilonen add stats hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311;
xilonen add stats def%=0.31 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.331 cd=0.5296;
`,
  nicole: `
nicole char lvl=90/90 cons=2 talent=9,9,9;
nicole add weapon="favoniuscodex" refine=3 lvl=90/90;
nicole add set="totm" count=4;
nicole add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
nicole add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`,
  qiqi: `
qiqi char lvl=90/90 cons=0 talent=9,9,9;
qiqi add weapon="favoniussword" refine=3 lvl=90/90;
qiqi add set="totm" count=4;
qiqi add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
qiqi add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`,
};

const ROT = {
  diona: `
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  diona skill[hold=1], burst;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  esco: `
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  if .escoffier.burst.ready { escoffier burst; }
  escoffier skill;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  alyosha6: `
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  alyosha skill, burst;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  xilonen: `
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  xilonen skill, attack:2;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  nicole: `
active nicole;
for let i=0; i<4; i=i+1 {
  nicole skill;
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  qiqi: `
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  qiqi skill;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
};

const TEAMS = [
  { key: 'diona', name: '你的现队：迪奥娜C6祭礼R5+千岩' },
  { key: 'esco', name: '换爱可菲C0（西风+千岩）' },
  { key: 'alyosha6', name: '换阿罗夏C6（专武+宗室）' },
  { key: 'qiqi', name: '换七七C0（西风+千岩）' },
  { key: 'xilonen', name: '换希诺宁C0（西风+千岩）' },
  { key: 'nicole', name: '换尼可C2（西风书+千岩）' },
];

function main() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  const rows = [];
  for (const t of TEAMS) {
    const cfg = `${CORE}\n${FOURTH[t.key]}\n${ROT[t.key]}`;
    const cfgPath = path.join(CONFIG_DIR, `sandrone-upg-${t.key}.txt`);
    fs.writeFileSync(cfgPath, cfg);
    try {
      const sim = runConfig(cfgPath, path.join(RESULT_DIR, `sandrone-upg-${t.key}.json`), {
        iterations: ITERS,
      });
      rows.push({ name: t.name, dps: sim.dps, min: sim.dpsMin, max: sim.dpsMax });
      console.log(`${t.name} => ${sim.dps}`);
    } catch (e) {
      console.warn(`FAIL ${t.name}: ${e.message}`);
      rows.push({ name: t.name, error: e.message });
    }
  }
  const ok = rows.filter((r) => r.dps != null).sort((a, b) => b.dps - a.dps);
  const base = ok.find((r) => r.name.includes('现队'))?.dps;
  const payload = {
    fixed: '桑多涅C1R1超越之匙 / 八重C2R1神乐 / 奥黛塔C0雾切+炉火',
    baselineDps: base,
    ranking: ok.map((r, i) => ({
      rank: i + 1,
      ...r,
      vsCurrent: base == null ? null : r.dps - base,
    })),
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log('\n=== RANK ===');
  payload.ranking.forEach((r) => {
    const d = r.vsCurrent == null ? '' : ` (${r.vsCurrent >= 0 ? '+' : ''}${r.vsCurrent})`;
    console.log(`#${r.rank} ${r.dps}${d} | ${r.name}`);
  });
}

main();
