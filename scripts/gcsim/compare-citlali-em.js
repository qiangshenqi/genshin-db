const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const F = 'hp=4780 atk=311';
const M = {
  er: 0.518,
  em: 187,
  cryo: 0.466,
  cr: 0.311,
};

function join(parts) {
  const a = {};
  for (const p of parts) {
    for (const [k, v] of Object.entries(p)) a[k] = (a[k] || 0) + v;
  }
  return Object.entries(a)
    .map(([k, v]) => `${k}=${Number(v.toFixed(4))}`)
    .join(' ');
}

function citSub(main) {
  if (/er=/.test(main)) {
    return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.662';
  }
  return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.1324 cd=0.3972';
}

function build(sands, goblet, circlet) {
  const citMain = `${F} ${join([sands, goblet, circlet])}`;
  return `options swap_delay=12 iteration=200 workers=8;

mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="oc" count=4;
mavuika add stats hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311;
mavuika add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944;

xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="freedomsworn" refine=1 lvl=90/90;
xilonen add set="ap" count=4;
xilonen add stats hp=4780 atk=311 def%=1.749;
xilonen add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.1324 cd=0.2648;

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats ${citMain};
citlali add stats ${citSub(citMain)};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesse" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;

fn mav_dc_cancel(d_travel_f) {
  if d_travel_f < 6 { d_travel_f = 6; }
  let dash_ns = 10;
  let base_cons = 0.9;
  let base_tick_rate = 6;
  while !.mavuika.dash.ready { wait(1); }
  let d_ticks = d_travel_f / base_tick_rate + 1;
  let ns_consumed = dash_ns + base_cons * d_ticks;
  if .mavuika.nightsoul.points > ns_consumed || .mavuika.status.mavuika-burst {
    mavuika dash[charge_cancel=1, travel=d_travel_f], charge;
  } else {
    mavuika jump;
  }
}

let UseXilonenDash = false;
active mavuika;
for let i=0; i<4; i=i+1 {
  mavuika skill[hold=1];
  bennett swap;
  delay(29);
  bennett skill, burst;
  xilonen skill, attack:2;
  if UseXilonenDash == true { xilonen dash; }
  pick_up_crystallize("pyro");
  citlali skill, burst, attack;
  if .mavuika.nightsoul.points {
    mavuika skill[recast=1];
    mavuika charge;
  }
  mavuika burst;
  mavuika charge;
  mav_dc_cancel(6); mavuika charge:2, charge[hold=6], charge[final=1];
  mav_dc_cancel(6); mavuika charge[final=1];
  mav_dc_cancel(6); mavuika charge[final=1];
  mav_dc_cancel(6); mavuika charge[final=1];
  if UseXilonenDash == false { delay(7); }
}
`;
}

const opts = [
  ['充能/冰伤/暴击', { er: M.er }, { 'cryo%': M.cryo }, { cr: M.cr }],
  ['充能/精通/暴击', { er: M.er }, { em: M.em }, { cr: M.cr }],
  ['充能/精通/精通', { er: M.er }, { em: M.em }, { em: M.em }],
  ['充能/冰伤/精通', { er: M.er }, { 'cryo%': M.cryo }, { em: M.em }],
  ['精通/冰伤/暴击', { em: M.em }, { 'cryo%': M.cryo }, { cr: M.cr }],
  ['精通/精通/精通', { em: M.em }, { em: M.em }, { em: M.em }],
];

const rows = [];
for (const [label, s, g, c] of opts) {
  const cfgPath = path.join(ROOT, 'tools/gcsim/configs/_cit_em.txt');
  fs.writeFileSync(cfgPath, build(s, g, c));
  const sim = runConfig(cfgPath, path.join(ROOT, 'tools/gcsim/results/_cit_em.json'), {
    iterations: 200,
  });
  rows.push({ label, dps: sim.dps });
  console.log(`${label} => ${sim.dps}`);
}
rows.sort((a, b) => b.dps - a.dps);
const best = rows[0].dps;
console.log('\n相对最佳:');
rows.forEach((r, i) => {
  console.log(`#${i + 1} ${r.dps} (${r.dps - best >= 0 ? '+' : ''}${r.dps - best}) | ${r.label}`);
});
