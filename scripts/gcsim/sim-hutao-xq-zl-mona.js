const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const CFG = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28');
const OUT = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28');
fs.mkdirSync(CFG, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const variants = {
  // Classic: ZL shield > Mona EQ TTDS > XQ QE > Hu Tao N1C
  v1_classic: `options swap_delay=12 iteration=200 workers=8;
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

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="noblesseoblige" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  mona skill, burst;
  xingqiu burst, attack, skill, attack;
  hutao skill,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge;
}
`,

  // Mona last for TTDS handoff right before Hutao
  v2_ttds_last: `options swap_delay=12 iteration=200 workers=8;
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

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="noblesseoblige" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  xingqiu skill, burst, attack;
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
`,

  // Shorter Hutao field time (less overcap / better uptime feel)
  v3_shorter: `options swap_delay=12 iteration=200 workers=8;
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

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="noblesseoblige" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

active zhongli;
for let i=0; i<5; i=i+1 {
  zhongli skill[hold=1], dash;
  xingqiu burst, attack, skill, attack;
  mona skill, burst;
  hutao skill,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge, jump,
    attack:1, charge;
}
`,
};

async function main() {
  const results = [];
  for (const [key, body] of Object.entries(variants)) {
    const cfg = path.join(CFG, `hutao-xq-zl-mona-${key}.txt`);
    const out = path.join(OUT, `hutao-xq-zl-mona-${key}.json`);
    fs.writeFileSync(cfg, body);
    process.stdout.write(`${key} ... `);
    try {
      const sim = runConfig(cfg, out, { iterations: 200 });
      console.log(`${sim.dps}  dur=${Number(sim.duration).toFixed(1)}s  [${sim.characters.join('/')}]`);
      results.push({ key, ...sim });
    } catch (e) {
      console.log('FAIL', e.message);
      results.push({ key, error: String(e.message || e) });
    }
  }
  results.sort((a, b) => (b.dps || 0) - (a.dps || 0));
  console.log('\nBest:', results[0]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
