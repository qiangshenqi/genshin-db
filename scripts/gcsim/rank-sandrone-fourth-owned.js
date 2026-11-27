const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
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

const TEAMS = [
  {
    name: '迪奥娜C6祭礼（现队对照）',
    fourth: `
diona char lvl=90/90 cons=6 talent=9,9,9;
diona add weapon="sacrificialbow" refine=5 lvl=90/90;
diona add set="totm" count=4;
diona add stats hp=4780 atk=311 er=0.518 hp%=0.932;
diona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.3306 em=79.28 cr=0.1986 cd=0.3972;
`,
    rot: `
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
  },
  {
    name: '尼可C0（西风书+千岩）',
    fourth: `
nicole char lvl=90/90 cons=0 talent=9,9,9;
nicole add weapon="favoniuscodex" refine=3 lvl=90/90;
nicole add set="totm" count=4;
nicole add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
nicole add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`,
    rot: `
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
  },
  {
    name: '阿罗夏C6（专武+宗室）',
    fourth: `
alyosha char lvl=90/90 cons=6 talent=9,9,9;
alyosha add weapon="frostbreath" refine=1 lvl=90/90;
alyosha add set="noblesse" count=4;
alyosha add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
alyosha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.662;
`,
    rot: `
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
    name: '爱可菲C0（西风枪+千岩）',
    fourth: `
escoffier char lvl=90/90 cons=0 talent=9,9,9;
escoffier add weapon="favoniuslance" refine=3 lvl=90/90;
escoffier add set="totm" count=4;
escoffier add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
escoffier add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;
`,
    rot: `
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
    name: '阿罗夏C6（专武+千岩，炉火仍在奥黛塔）',
    fourth: `
alyosha char lvl=90/90 cons=6 talent=9,9,9;
alyosha add weapon="frostbreath" refine=1 lvl=90/90;
alyosha add set="totm" count=4;
alyosha add stats hp=4780 atk=311 er=0.518 atk%=0.466 cr=0.311;
alyosha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.662;
`,
    rot: `
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
];

function main() {
  const rows = [];
  TEAMS.forEach((t, idx) => {
    const cfgPath = path.join(CONFIG_DIR, `sandrone-owned-${idx}.txt`);
    fs.writeFileSync(cfgPath, `${CORE}\n${t.fourth}\n${t.rot}`);
    try {
      const sim = runConfig(cfgPath, path.join(RESULT_DIR, `sandrone-owned-${idx}.json`), {
        iterations: ITERS,
      });
      rows.push({ name: t.name, dps: sim.dps, min: sim.dpsMin, max: sim.dpsMax });
      console.log(`${t.name} => ${sim.dps}`);
    } catch (e) {
      console.warn(`FAIL ${t.name}: ${e.message}`);
    }
  });
  rows.sort((a, b) => b.dps - a.dps);
  const base = rows.find((r) => r.name.includes('迪奥娜'))?.dps;
  console.log('\n=== RANK ===');
  rows.forEach((r, i) => {
    const d = base == null ? '' : ` (${r.dps - base >= 0 ? '+' : ''}${r.dps - base})`;
    console.log(`#${i + 1} ${r.dps}${d} | ${r.name}`);
  });
  fs.writeFileSync(
    path.join(ROOT, 'web/data/sandrone-owned-fourth.json'),
    JSON.stringify({ baseline: base, ranking: rows }, null, 2)
  );
}

main();
