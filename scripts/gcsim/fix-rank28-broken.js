/** Re-run broken rank28 teams with repaired axes. */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const CFG = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28');
const OUT = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28');
const WEB = path.join(ROOT, 'web', 'data', 'rank-28-teams.json');
const ITER = Number(process.env.GCSIM_ITERS || 120);

const hdr = `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
`;

function w(name, body) {
  const p = path.join(CFG, `${name}.txt`);
  fs.writeFileSync(p, body, 'utf8');
  return p;
}

const fixes = {
  t07_mav_kazuha: {
    id: 7,
    name: '玛薇卡/茜特菈莉/万叶/班尼特',
    body: `${hdr}
mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="obsidiancodex" count=4;
mavuika add stats hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311;
mavuika add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944;

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311;
citlali add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.662;

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

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

active mavuika;
for let i=0; i<4; i=i+1 {
  mavuika skill[hold=1];
  bennett skill, burst;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; }
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
}
`,
  },

  t08_hutao_xq: {
    id: 8,
    name: '胡桃/行秋/钟离/班尼特',
    note: '胡桃C1+龙脊R5',
    body: `${hdr}
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
for let i=0; i<3; i=i+1 {
  zhongli skill[hold=1], dash;
  if i == 0 { bennett skill, burst; } else { bennett burst, skill; }
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
    attack:2, charge, jump, attack;
  bennett skill;
}
`,
  },

  t11_national: {
    id: 11,
    name: '香菱/班尼特/行秋/万叶',
    body: `${hdr}
xiangling char lvl=90/90 cons=6 talent=9,9,9;
xiangling add weapon="thecatch" refine=5 lvl=90/90;
xiangling add set="emblemofseveredfate" count=4;
xiangling add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
xiangling add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.662;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.662;

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

active bennett;
for let i=0; i<4; i=i+1 {
  bennett skill;
  xingqiu skill, burst, attack;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; kazuha skill, high_plunge; }
  bennett burst;
  xiangling burst, skill, dash;
  bennett skill, attack;
  xiangling attack:2;
  for let j=0; j<8; j=j+1 {
    if .bennett.mods.bennett-burst {
      bennett attack;
    } else {
      break;
    }
  }
}
`,
  },

  t14_ayaka_mona: {
    id: 14,
    name: '绫华/莫娜/万叶/迪奥娜',
    body: `${hdr}
ayaka char lvl=90/90 cons=0 talent=10,10,10;
ayaka add weapon="mistsplitterreforged" refine=1 lvl=90/90;
ayaka add set="blizzardstrayer" count=4;
ayaka add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cd=0.622;
ayaka add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.1984 cd=0.7944;

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="noblesseoblige" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.3972;

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

diona char lvl=90/90 cons=6 talent=9,9,9;
diona add weapon="sacrificialbow" refine=5 lvl=90/90;
diona add set="tenacityofthemillelith" count=4;
diona add stats hp=4780 atk=311 er=0.518 hp%=0.466 hp%=0.466;
diona add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.3972;

active diona;
for let i=0; i<4; i=i+1 {
  diona skill[hold=1];
  if .diona.burst.ready { diona burst; }
  mona skill;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; }
  mona burst;
  ayaka dash, skill;
  if .ayaka.burst.ready { ayaka burst; }
  ayaka attack:2, charge, dash, attack:2, charge, dash, attack:2, charge;
}
`,
  },

  t17_alhaitham_hb: {
    id: 17,
    name: '海森/纳西妲/行秋/久岐忍',
    body: `${hdr}
alhaitham char lvl=90/90 cons=0 talent=9,9,9;
alhaitham add weapon="harbingerofdawn" refine=5 lvl=90/90;
alhaitham add set="gildeddreams" count=4;
alhaitham add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
alhaitham add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=79.28 cr=0.331 cd=0.662;

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 dendro%=0.466 em=187;
nahida add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662;

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.662;

kuki char lvl=90/90 cons=5 talent=9,9,9;
kuki add weapon="xiphosmoonlight" refine=1 lvl=90/90;
kuki add set="flowerofparadiselost" count=4;
kuki add stats hp=4780 atk=311 em=187 em=187 em=187;
kuki add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.5296;

active nahida;
for let i=0; i<4; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  xingqiu skill, burst, attack;
  kuki skill;
  alhaitham skill;
  alhaitham attack:3, attack:3, attack:3, charge;
  if .alhaitham.burst.ready { alhaitham burst; }
  alhaitham attack:3, attack:3;
}
`,
  },

  t18_alhaitham_aggravate: {
    id: 18,
    name: '海森/纳西妲/菲谢尔/钟离',
    body: `${hdr}
alhaitham char lvl=90/90 cons=0 talent=9,9,9;
alhaitham add weapon="harbingerofdawn" refine=5 lvl=90/90;
alhaitham add set="gildeddreams" count=4;
alhaitham add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
alhaitham add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=79.28 cr=0.331 cd=0.662;

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 dendro%=0.466 em=187;
nahida add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662;

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active nahida;
for let i=0; i<4; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  alhaitham skill;
  alhaitham attack:3, attack:3, attack:3, charge;
  if .alhaitham.burst.ready { alhaitham burst; }
  alhaitham attack:3, attack:3;
}
`,
  },

  t20_tighnari: {
    id: 20,
    name: '提纳里/纳西妲/菲谢尔/钟离',
    body: `${hdr}
tighnari char lvl=90/90 cons=0 talent=9,9,9;
tighnari add weapon="slingshot" refine=5 lvl=90/90;
tighnari add set="gildeddreams" count=4;
tighnari add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
tighnari add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=79.28 cr=0.331 cd=0.662;

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 dendro%=0.466 em=187;
nahida add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662;

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active nahida;
for let i=0; i<4; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  tighnari skill;
  tighnari aim[hold=1], aim[hold=1], aim[hold=1];
  if .tighnari.burst.ready { tighnari burst; }
}
`,
  },

  t24_wanderer: {
    id: 24,
    name: '流浪者/珐露珊/班尼特/钟离',
    body: `${hdr}
wanderer char lvl=90/90 cons=0 talent=9,9,9;
wanderer add weapon="thewidsith" refine=3 lvl=90/90;
wanderer add set="desertpavilionchronicle" count=4;
wanderer add stats hp=4780 atk=311 atk%=0.466 anemo%=0.466 cr=0.311;
wanderer add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

faruzan char lvl=90/90 cons=6 talent=9,9,9;
faruzan add weapon="favoniuswarbow" refine=5 lvl=90/90;
faruzan add set="tenacityofthemillelith" count=4;
faruzan add stats hp=4780 atk=311 er=0.518 anemo%=0.466 cr=0.311;
faruzan add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.5296;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="instructor" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  faruzan skill;
  while !.faruzan.burst.ready {
    faruzan aim;
  }
  faruzan burst;
  bennett skill, burst;
  wanderer attack, skill;
  for let j=0; j<5; j=j+1 {
    wanderer attack:3, charge;
  }
  if .wanderer.burst.ready { wanderer burst; }
}
`,
  },

  t25_xiao: {
    id: 25,
    name: '魈/珐露珊/班尼特/钟离',
    body: `${hdr}
xiao char lvl=90/90 cons=0 talent=9,9,9;
xiao add weapon="deathmatch" refine=1 lvl=90/90;
xiao add set="vermillionhereafter" count=4;
xiao add stats hp=4780 atk=311 atk%=0.466 anemo%=0.466 cr=0.311;
xiao add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.2204 em=39.64 cr=0.331 cd=0.662;

faruzan char lvl=90/90 cons=6 talent=9,9,9;
faruzan add weapon="favoniuswarbow" refine=5 lvl=90/90;
faruzan add set="tenacityofthemillelith" count=4;
faruzan add stats hp=4780 atk=311 er=0.518 anemo%=0.466 cr=0.311;
faruzan add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.5296;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active zhongli;
for let i=0; i<3; i=i+1 {
  zhongli skill[hold=1], dash;
  faruzan skill;
  while !.faruzan.burst.ready { faruzan aim; }
  faruzan burst;
  bennett skill, burst;
  xiao skill, skill;
  while !.xiao.burst.ready { xiao skill; }
  xiao burst;
  for let j=0; j<10; j=j+1 {
    xiao jump, high_plunge;
  }
}
`,
  },

  t26_clorinde: {
    id: 26,
    name: '克洛琳德/纳西妲/菲谢尔/钟离',
    body: `${hdr}
clorinde char lvl=90/90 cons=0 talent=9,9,9;
clorinde add weapon="theblacksword" refine=1 lvl=90/90;
clorinde add set="thunderingfury" count=4;
clorinde add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
clorinde add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 dendro%=0.466 em=187;
nahida add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662;

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active nahida;
for let i=0; i<4; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  clorinde skill;
  clorinde attack:6;
  if .clorinde.burst.ready { clorinde burst; }
  clorinde attack:4;
}
`,
  },

  t23_noelle: {
    id: 23,
    name: '诺艾尔/五郎/云堇/钟离',
    body: `${hdr}
noelle char lvl=90/90 cons=6 talent=9,9,9;
noelle add weapon="whiteblind" refine=5 lvl=90/90;
noelle add set="huskofopulentdreams" count=4;
noelle add stats hp=4780 atk=311 def%=0.583 geo%=0.466 cr=0.311;
noelle add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.662;

gorou char lvl=90/90 cons=5 talent=9,9,9;
gorou add weapon="favoniuswarbow" refine=5 lvl=90/90;
gorou add set="noblesseoblige" count=4;
gorou add stats hp=4780 atk=311 er=0.518 def%=0.583 cr=0.311;
gorou add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.5296;

yunjin char lvl=90/90 cons=1 talent=9,9,9;
yunjin add weapon="favoniuslance" refine=5 lvl=90/90;
yunjin add set="huskofopulentdreams" count=4;
yunjin add stats hp=4780 atk=311 er=0.518 def%=0.583 def%=0.583;
yunjin add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.3972;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active zhongli;
for let i=0; i<3; i=i+1 {
  zhongli skill[hold=1], dash;
  gorou skill;
  while !.gorou.burst.ready { gorou attack; }
  gorou burst;
  yunjin skill;
  while !.yunjin.burst.ready { yunjin attack; }
  yunjin burst;
  while !.noelle.burst.ready { noelle skill; }
  noelle burst;
  noelle attack:4, attack:4, attack:4, attack:4;
}
`,
  },

  t28_eula: {
    id: 28,
    name: '优菈/米卡/菲谢尔/钟离',
    body: `${hdr}
eula char lvl=90/90 cons=0 talent=9,9,9;
eula add weapon="serpentspine" refine=1 lvl=90/90 +params=[stacks=5];
eula add set="paleflame" count=4;
eula add stats hp=4780 atk=311 atk%=0.466 phys%=0.583 cr=0.311;
eula add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

mika char lvl=90/90 cons=2 talent=9,9,9;
mika add weapon="favoniuslance" refine=5 lvl=90/90;
mika add set="noblesseoblige" count=4;
mika add stats hp=4780 atk=311 er=0.518 hp%=0.466 cr=0.311;
mika add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.3972;

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats def%=0.124 def=39.36 hp=507.88 hp%=0.1984 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.331 cd=0.5296;

active zhongli;
for let i=0; i<3; i=i+1 {
  zhongli skill[hold=1], dash;
  mika skill, burst;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  eula skill, attack:4;
  eula skill[hold=1], attack:2;
  if .eula.burst.ready { eula burst; }
  eula attack:4, attack:2;
}
`,
  },
};

async function main() {
  const prev = JSON.parse(fs.readFileSync(WEB, 'utf8'));
  const byId = new Map(prev.ranking.map((r) => [r.id, r]));

  for (const [key, t] of Object.entries(fixes)) {
    const cfg = w(key, t.body);
    const out = path.join(OUT, `${key}.json`);
    process.stdout.write(`#${t.id} ${t.name} ... `);
    try {
      const sim = runConfig(cfg, out, { iterations: ITER });
      byId.set(t.id, {
        id: t.id,
        name: t.name,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        duration: sim.duration,
        source: `rank28/${key}`,
        note: t.note || '轴已重修',
        reliable: (sim.duration || 999) < 140 && sim.dps > 15000,
      });
      console.log(`${sim.dps} (${Number(sim.duration).toFixed(1)}s)`);
    } catch (e) {
      console.log('FAIL', e.message);
      byId.set(t.id, { id: t.id, name: t.name, dps: null, error: String(e.message || e), note: '重修失败' });
    }
  }

  const ranked = [...byId.values()].sort((a, b) => (b.dps || 0) - (a.dps || 0)).map((r, i) => ({ rank: i + 1, ...r }));
  const payload = { date: '2026-11-28', iterations: ITER, engine: 'gcsim local-missing-chars', ranking: ranked };
  fs.writeFileSync(WEB, JSON.stringify(payload, null, 2));
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(ranked, null, 2));
  console.log('\n=== UPDATED RANKING ===');
  for (const r of ranked) {
    const flag = r.duration && r.duration > 140 ? ' [轴长/可疑]' : r.error ? ' [失败]' : '';
    console.log(`${String(r.rank).padStart(2)}  ${String(r.dps ?? 'ERR').padStart(7)}  #${r.id} ${r.name}${flag}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
