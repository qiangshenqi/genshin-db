/**
 * 桑多涅星超导几套主流队对比（C0 桑多涅为主）
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
const OUT = path.join(ROOT, 'web/data/sandrone-team-rank.json');
const ITERS = Number(process.env.GCSIM_ITERS || 200);

const SANDRONE_BLOCK = `
sandrone char lvl=90/90 cons=0 talent=10,9,9;
sandrone add weapon="bladeofatonement" refine=5 lvl=90/90;
sandrone add set="disenchantmentindeepshadow" count=4;
sandrone add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
sandrone add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.7944;
`;

const YAE_C1 = `
yaemiko char lvl=90/90 cons=1 talent=9,9,9;
yaemiko add weapon="echoesoftheheart" refine=1 lvl=90/90;
yaemiko add set="disenchantmentindeepshadow" count=4;
yaemiko add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
yaemiko add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.7944;
`;

const ODETTE = `
odette char lvl=90/90 cons=0 talent=9,9,9;
odette add weapon="finaleofthedeep" refine=5 lvl=90/90;
odette add set="heartofthefurnace" count=4;
odette add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
odette add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.2648 cd=0.662;
`;

const ESCO = `
escoffier char lvl=90/90 cons=0 talent=9,9,9;
escoffier add weapon="favoniuslance" refine=3 lvl=90/90;
escoffier add set="totm" count=4;
escoffier add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
escoffier add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`;

const ALYOSHA_C6 = `
alyosha char lvl=90/90 cons=6 talent=9,9,9;
alyosha add weapon="frostbreath" refine=1 lvl=90/90;
alyosha add set="noblesse" count=4;
alyosha add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
alyosha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.662;
`;

const ALYOSHA_C0 = `
alyosha char lvl=90/90 cons=0 talent=9,9,9;
alyosha add weapon="favoniuslance" refine=3 lvl=90/90;
alyosha add set="heartofthefurnace" count=4;
alyosha add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
alyosha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`;

const QIQI = `
qiqi char lvl=90/90 cons=0 talent=9,9,9;
qiqi add weapon="favoniussword" refine=3 lvl=90/90;
qiqi add set="totm" count=4;
qiqi add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
qiqi add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`;

const VODYA = `
vodyanitsa char lvl=90/90 cons=0 talent=9,9,9;
vodyanitsa add weapon="favoniuslance" refine=3 lvl=90/90;
vodyanitsa add set="totm" count=4;
vodyanitsa add stats hp=4780 atk=311 hp%=0.932 cr=0.311;
vodyanitsa add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.5296;
`;

const XILONEN = `
xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="favoniussword" refine=3 lvl=90/90;
xilonen add set="totm" count=4;
xilonen add stats hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311;
xilonen add stats def%=0.31 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.331 cd=0.5296;
`;

const HEADER = `options swap_delay=12 iteration=${ITERS} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
`;

const TEAMS = [
  {
    name: '桑多涅/八重C1/奥黛塔/爱可菲',
    file: 'sandrone-yae-odette-esco',
    body: `${SANDRONE_BLOCK}${YAE_C1}${ODETTE}${ESCO}
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
  },
  {
    name: '桑多涅/八重C1/奥黛塔/阿罗夏C6',
    file: 'sandrone-yae-odette-alyosha6',
    body: `${SANDRONE_BLOCK}${YAE_C1}${ODETTE}${ALYOSHA_C6}
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
  },
  {
    name: '桑多涅/阿罗夏C0/奥黛塔/爱可菲',
    file: 'sandrone-alyosha0-odette-esco',
    body: `${SANDRONE_BLOCK}${ALYOSHA_C0}${ODETTE}${ESCO}
active odette;
for let i=0; i<4; i=i+1 {
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  alyosha skill, burst;
  if .escoffier.burst.ready { escoffier burst; }
  escoffier skill;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  },
  {
    name: '桑多涅/阿罗夏C0/奥黛塔/沃雅妮莎',
    file: 'sandrone-alyosha0-odette-vodya',
    body: `${SANDRONE_BLOCK}${ALYOSHA_C0}${ODETTE}${VODYA}
active odette;
for let i=0; i<4; i=i+1 {
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  alyosha skill, burst;
  vodyanitsa skill;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  },
  {
    name: '桑多涅/八重C1/奥黛塔/七七',
    file: 'sandrone-yae-odette-qiqi',
    body: `${SANDRONE_BLOCK}${YAE_C1}${ODETTE}${QIQI}
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
  },
  {
    name: '桑多涅/八重C1/七七/爱可菲（无奥黛塔）',
    file: 'sandrone-yae-qiqi-esco',
    body: `${SANDRONE_BLOCK}${YAE_C1}${QIQI}${ESCO}
active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  if .escoffier.burst.ready { escoffier burst; }
  escoffier skill;
  qiqi skill;
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,
  },
  {
    name: '桑多涅/八重C1/奥黛塔/希诺宁',
    file: 'sandrone-yae-odette-xilonen',
    body: `${SANDRONE_BLOCK}${YAE_C1}${ODETTE}${XILONEN}
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
  },
];

function main() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  const rows = [];
  for (const t of TEAMS) {
    const cfgPath = path.join(CONFIG_DIR, `${t.file}.txt`);
    const outPath = path.join(RESULT_DIR, `${t.file}.json`);
    fs.writeFileSync(cfgPath, `${HEADER}\n${t.body}`);
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: ITERS });
      rows.push({
        name: t.name,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        config: path.relative(ROOT, cfgPath).replace(/\\/g, '/'),
      });
      console.log(`OK ${t.name} => ${sim.dps}`);
    } catch (e) {
      console.warn(`FAIL ${t.name}: ${e.message}`);
      rows.push({ name: t.name, error: e.message });
    }
  }
  const ok = rows.filter((r) => r.dps != null).sort((a, b) => b.dps - a.dps);
  const payload = {
    note: 'C0桑多涅；锻造赎罪之刃R5；幻灭影中4；轴为KQM示例简化，结果供相对比较',
    iterations: ITERS,
    generatedAt: new Date().toISOString(),
    winner: ok[0] || null,
    ranking: ok.map((r, i) => ({ rank: i + 1, ...r })),
    failed: rows.filter((r) => r.error),
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log('\n=== RANK ===');
  payload.ranking.forEach((r) => console.log(`#${r.rank} ${r.dps} | ${r.name}`));
  console.log('Wrote', OUT);
}

main();
