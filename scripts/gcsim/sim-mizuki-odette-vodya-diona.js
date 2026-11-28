const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const CFG = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28');
const OUT = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28');
fs.mkdirSync(CFG, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const ITER = 200;

const chars = `
mizuki char lvl=90/90 cons=0 talent=9,9,9;
mizuki add weapon="sacrificialfragments" refine=5 lvl=90/90;
mizuki add set="viridescentvenerer" count=4;
mizuki add stats hp=4780 atk=311 em=187 em=187 em=187;
mizuki add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

odette char lvl=90/90 cons=0 talent=9,9,9;
odette add weapon="finaleofthedeep" refine=5 lvl=90/90;
odette add set="heartofthefurnace" count=4;
odette add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
odette add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.2648 cd=0.662;

vodyanitsa char lvl=90/90 cons=0 talent=9,10,9;
vodyanitsa add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
vodyanitsa add set="tenacityofthemillelith" count=4;
vodyanitsa add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
vodyanitsa add stats def%=0.124 def=39.36 hp=2539.4 hp%=0.496 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.0992 cd=0.1984;

diona char lvl=90/90 cons=6 talent=9,9,9;
diona add weapon="sacrificialbow" refine=5 lvl=90/90;
diona add set="noblesseoblige" count=4;
diona add stats hp=4780 atk=311 er=0.518 hp%=0.466 hp%=0.466;
diona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.3972;
`;

const variants = {
  // Diona > Vodya > Odette > Mizuki field swirl
  v1: `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
${chars}
active diona;
for let i=0; i<5; i=i+1 {
  diona skill[hold=1];
  if .diona.burst.ready { diona burst; }
  vodyanitsa skill;
  if .vodyanitsa.burst.ready { vodyanitsa burst; }
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  mizuki burst;
  mizuki skill;
  mizuki attack:4;
  mizuki skill;
}
`,

  // Odette setup first for cryo aura, Mizuki longer field
  v2: `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
${chars}
active diona;
for let i=0; i<5; i=i+1 {
  diona skill[hold=1], burst;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  vodyanitsa skill;
  if .vodyanitsa.burst.ready { vodyanitsa burst; }
  mizuki skill;
  mizuki burst;
  for let j=0; j<6; j=j+1 {
    mizuki attack;
  }
  if .mizuki.skill.ready { mizuki skill; }
}
`,

  // TTDS handoff: Vodya last before Mizuki; Odette on-field snippets
  v3: `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
${chars}
active diona;
for let i=0; i<4; i=i+1 {
  diona skill[hold=1];
  if .diona.burst.ready { diona burst; }
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  vodyanitsa skill;
  if .vodyanitsa.burst.ready { vodyanitsa burst; }
  mizuki burst, skill;
  mizuki attack:3;
  odette skill;
  mizuki skill;
  mizuki attack:4;
}
`,
};

async function main() {
  const rows = [];
  for (const [key, body] of Object.entries(variants)) {
    const cfg = path.join(CFG, `mizuki-odette-vodya-diona-${key}.txt`);
    const out = path.join(OUT, `mizuki-odette-vodya-diona-${key}.json`);
    fs.writeFileSync(cfg, body);
    process.stdout.write(`${key} ... `);
    try {
      const sim = runConfig(cfg, out, { iterations: ITER });
      const split = (() => {
        try {
          const j = JSON.parse(fs.readFileSync(out, 'utf8'));
          return (j.character_details || [])
            .map((c) => {
              const d = j.statistics?.character_dps?.[c.name] || j.statistics?.dps_by_char?.[c.name];
              // try damage contribution
              return null;
            })
            .filter(Boolean);
        } catch {
          return [];
        }
      })();
      // per-char from json
      let charsDps = '';
      try {
        const j = JSON.parse(fs.readFileSync(out, 'utf8'));
        const cd = j.statistics?.character_dps;
        if (cd) {
          charsDps = Object.entries(cd)
            .map(([n, v]) => `${n}:${Math.round(v.mean ?? v)}`)
            .join(' | ');
        } else if (j.statistics?.dps_by_char) {
          charsDps = Object.entries(j.statistics.dps_by_char)
            .map(([n, v]) => `${n}:${Math.round(v.mean ?? v)}`)
            .join(' | ');
        }
      } catch {}
      console.log(`${sim.dps}  dur=${Number(sim.duration).toFixed(1)}s`);
      if (charsDps) console.log('  ', charsDps);
      rows.push({ key, ...sim, charsDps });
    } catch (e) {
      console.log('FAIL', e.message);
      rows.push({ key, error: String(e.message || e) });
    }
  }
  rows.sort((a, b) => (b.dps || 0) - (a.dps || 0));
  console.log('\nBEST', rows[0].key, rows[0].dps);
  fs.writeFileSync(
    path.join(OUT, 'mizuki-odette-vodya-diona-summary.json'),
    JSON.stringify(rows, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
