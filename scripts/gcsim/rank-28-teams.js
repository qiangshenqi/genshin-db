/**
 * Rank the 28 owned-roster teams on the same local gcsim.exe.
 * Reuses prior strong results where available; generates+runs the rest.
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '..', '..');
const CFG = path.join(ROOT, 'tools', 'gcsim', 'configs', 'rank28');
const OUT = path.join(ROOT, 'tools', 'gcsim', 'results', 'rank28');
const WEB = path.join(ROOT, 'web', 'data', 'rank-28-teams.json');
const ITER = Number(process.env.GCSIM_ITERS || 120);

fs.mkdirSync(CFG, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const hdr = `options swap_delay=12 iteration=${ITER} workers=8;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
`;

const sub = (extra = '') =>
  `def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1984 er=0.1102 em=39.64 cr=0.331 cd=0.662${extra ? ' ' + extra : ''}`;

function write(name, body) {
  const p = path.join(CFG, `${name}.txt`);
  fs.writeFileSync(p, body.replace(/^\uFEFF/, ''), 'utf8');
  return p;
}

const configs = {
  // 2 桑/八重/奥/沃
  t02_sandrone_vodya: `${hdr}
sandrone char lvl=90/90 cons=1 talent=10,9,9;
sandrone add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
sandrone add set="disenchantmentindeepshadow" count=4;
sandrone add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
sandrone add stats ${sub()};

yaemiko char lvl=90/90 cons=2 talent=9,9,9;
yaemiko add weapon="kagurasverity" refine=1 lvl=90/90;
yaemiko add set="disenchantmentindeepshadow" count=4;
yaemiko add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
yaemiko add stats ${sub()};

odette char lvl=90/90 cons=0 talent=9,9,9;
odette add weapon="finaleofthedeep" refine=5 lvl=90/90;
odette add set="heartofthefurnace" count=4;
odette add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
odette add stats ${sub('er=0.2204')};

vodyanitsa char lvl=90/90 cons=0 talent=9,10,9;
vodyanitsa add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
vodyanitsa add set="tenacityofthemillelith" count=4;
vodyanitsa add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
vodyanitsa add stats def%=0.124 def=39.36 hp=2539.4 hp%=0.496 atk=33.08 atk%=0.0992 er=0.1102 em=39.64 cr=0.0992 cd=0.1984;

active yaemiko;
for let i=0; i<4; i=i+1 {
  yaemiko skill:3;
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  vodyanitsa skill;
  if .vodyanitsa.burst.ready { vodyanitsa burst; }
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,

  // 5 桑/奥/沃/爱可菲（星扩散壳）
  t05_sandrone_stellar: `${hdr}
sandrone char lvl=90/90 cons=1 talent=10,9,9;
sandrone add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
sandrone add set="disenchantmentindeepshadow" count=4;
sandrone add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
sandrone add stats ${sub()};

odette char lvl=90/90 cons=0 talent=9,9,9;
odette add weapon="finaleofthedeep" refine=5 lvl=90/90;
odette add set="heartofthefurnace" count=4;
odette add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
odette add stats ${sub('er=0.2204')};

vodyanitsa char lvl=90/90 cons=0 talent=9,10,9;
vodyanitsa add weapon="favoniuslance" refine=5 lvl=90/90;
vodyanitsa add set="tenacityofthemillelith" count=4;
vodyanitsa add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 cr=0.311;
vodyanitsa add stats ${sub('hp%=0.2976')};

escoffier char lvl=90/90 cons=0 talent=9,10,10;
escoffier add weapon="favoniuslance" refine=5 lvl=90/90;
escoffier add set="goldentroupe" count=4;
escoffier add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cr=0.311;
escoffier add stats ${sub()};

active odette;
for let i=0; i<4; i=i+1 {
  odette skill:2;
  if .odette.burst.ready { odette burst; }
  escoffier skill;
  if .escoffier.burst.ready { escoffier burst; }
  vodyanitsa skill;
  if .vodyanitsa.burst.ready { vodyanitsa burst; }
  sandrone charge, skill;
  if .sandrone.burst.ready { sandrone burst; }
  sandrone charge, skill, charge, skill;
}
`,

  // 3 娜/莉/叶2/爱诺4（账号命座）
  t03_navia_linnea: `${hdr}
navia char lvl=90/90 cons=0 talent=9,9,9;
navia add weapon="serpentspine" refine=1 lvl=90/90 +params=[stacks=5];
navia add set="marechausseehunter" count=4;
navia add stats hp=4780 atk=311 atk%=0.466 geo%=0.466 cr=0.311;
navia add stats ${sub()};

linnea char lvl=90/90 cons=0 talent=9,9,9;
linnea add weapon="favoniuswarbow" refine=5 lvl=90/90;
linnea add set="nighttimewhispersintheechoingwoods" count=4;
linnea add stats hp=4780 atk=311 def%=0.583 def%=0.583 cr=0.311;
linnea add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.1324 cd=0.5296;

aino char lvl=90/90 cons=4 talent=9,9,9;
aino add weapon="favoniuscodex" refine=5 lvl=90/90;
aino add set="celestialgift" count=4;
aino add stats hp=4780 atk=311 er=0.518 hp%=0.466 cr=0.311;
aino add stats ${sub('er=0.3306')};

illuga char lvl=90/90 cons=2 talent=9,9,9;
illuga add weapon="favoniuslance" refine=5 lvl=90/90;
illuga add set="nighttimewhispersintheechoingwoods" count=4;
illuga add stats hp=4780 atk=311 er=0.518 geo%=0.466 cr=0.311;
illuga add stats ${sub('er=0.4408')};

active navia;
for let i=0; i<5; i=i+1 {
  linnea skill;
  aino skill;
  if .aino.burst.ready { aino burst; }
  illuga skill;
  if .illuga.burst.ready { illuga burst; }
  if .navia.burst.ready { navia burst; }
  navia skill;
  navia attack:2, skill;
  navia attack:2, skill;
}
`,

  // 7 玛/茜/万叶/班
  t07_mav_kazuha: `${hdr}
mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="obsidiancodex" count=4;
mavuika add stats hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311;
mavuika add stats ${sub('em=158.56')};

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311;
citlali add stats ${sub('er=0.2204 em=158.56')};

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

active mavuika;
for let i=0; i<4; i=i+1 {
  citlali skill;
  if .citlali.burst.ready { citlali burst; }
  bennett skill, burst;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; }
  mavuika skill;
  if .mavuika.burst.ready { mavuika burst; }
  mavuika attack:4;
  mavuika skill, attack:3;
}
`,

  // 8 胡桃/行秋/钟离/班
  t08_hutao_xq: `${hdr}
hutao char lvl=90/90 cons=1 talent=9,9,9 +params=[start_hp=1];
hutao add weapon="dragonsbane" refine=5 lvl=90/90;
hutao add set="marechausseehunter" count=4;
hutao add stats hp=4780 atk=311 em=187 pyro%=0.466 cd=0.622;
hutao add stats ${sub('em=79.28 cr=0.3972')};

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats ${sub('er=0.2204')};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

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
`,

  // 10 可莉/尼可/杜林/菲谢尔
  t10_klee_durin: `${hdr}
klee char lvl=90/90 cons=1 talent=9,9,9;
klee add weapon="lostprayertothesacredwinds" refine=1 lvl=90/90;
klee add set="crimsonwitchofflames" count=4;
klee add stats hp=4780 atk=311 atk%=0.466 pyro%=0.466 cr=0.311;
klee add stats ${sub()};

nicole char lvl=90/90 cons=0 talent=9,9,9;
nicole add weapon="favoniuscodex" refine=3 lvl=90/90;
nicole add set="celestialgift" count=4;
nicole add stats hp=4780 atk=311 atk%=1.398;
nicole add stats ${sub('atk%=0.1984')};

durin char lvl=90/90 cons=0 talent=9,9,9;
durin add weapon="favoniuslance" refine=5 lvl=90/90;
durin add set="noblesseoblige" count=4;
durin add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
durin add stats ${sub('er=0.3306')};

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats ${sub()};

active fischl;
fischl attack;
for let i=0; i<5; i=i+1 {
  nicole skill;
  if .nicole.burst.ready { nicole burst; }
  if .durin.skill.ready { durin skill; }
  if .durin.burst.ready { durin burst; }
  if .fischl.skill.ready { fischl attack, skill; } else { fischl attack:2, burst; }
  klee attack, skill[bounce=3, mine=8];
  if .klee.burst.ready { klee burst; }
  for let j=0; j<3; j=j+1 {
    klee attack[travel=6], charge, attack, attack[travel=6], charge;
  }
}
`,

  // 11 香菱/班/行秋/万叶
  t11_national: `${hdr}
xiangling char lvl=90/90 cons=6 talent=9,9,9;
xiangling add weapon="thecatch" refine=5 lvl=90/90;
xiangling add set="emblemofseveredfate" count=4;
xiangling add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
xiangling add stats ${sub('er=0.2204')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats ${sub('er=0.2204')};

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

active bennett;
for let i=0; i<5; i=i+1 {
  bennett skill, burst;
  xingqiu skill, burst, attack;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; }
  xiangling skill, burst;
  bennett skill, attack:2;
  xiangling attack:2;
  bennett attack:3;
}
`,

  // 14 绫华/莫娜/万叶/迪奥娜
  t14_ayaka_mona: `${hdr}
ayaka char lvl=90/90 cons=0 talent=10,10,10;
ayaka add weapon="mistsplitterreforged" refine=1 lvl=90/90;
ayaka add set="blizzardstrayer" count=4;
ayaka add stats hp=4780 atk=311 atk%=0.466 cryo%=0.466 cd=0.622;
ayaka add stats ${sub('cr=0.1984')};

mona char lvl=90/90 cons=2 talent=9,9,9;
mona add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
mona add set="tenacityofthemillelith" count=4;
mona add stats hp=4780 atk=311 er=0.518 er=0.518 er=0.518;
mona add stats ${sub('er=0.3306')};

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="freedomsworn" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

diona char lvl=90/90 cons=6 talent=9,9,9;
diona add weapon="sacrificialbow" refine=5 lvl=90/90;
diona add set="noblesseoblige" count=4;
diona add stats hp=4780 atk=311 er=0.518 hp%=0.466 hp%=0.466;
diona add stats ${sub('er=0.2204')};

active diona;
for let i=0; i<5; i=i+1 {
  diona skill[hold=1], burst;
  mona skill, burst;
  kazuha skill, high_plunge;
  if .kazuha.burst.ready { kazuha burst; }
  ayaka skill, dash;
  if .ayaka.burst.ready { ayaka burst; }
  ayaka attack:2, charge, dash, attack:2, charge, dash, attack:2, charge;
}
`,

  // 16 那维/芙/万叶/钟离
  t16_neuv_zl: `${hdr}
neuvillette char lvl=90/90 cons=0 talent=9,9,9;
neuvillette add weapon="tomeoftheeternalflow" refine=1 lvl=90/90;
neuvillette add set="marechausseehunter" count=4;
neuvillette add stats hp=4780 atk=311 hp%=0.466 hydro%=0.466 cr=0.311;
neuvillette add stats ${sub('hp%=0.1984')};

furina char lvl=90/90 cons=0 talent=9,9,9;
furina add weapon="favoniussword" refine=5 lvl=90/90;
furina add set="goldentroupe" count=4;
furina add stats hp=4780 atk=311 er=0.518 hydro%=0.466 cr=0.311;
furina add stats ${sub('er=0.3306 hp%=0.0992')};

kazuha char lvl=90/90 cons=0 talent=9,9,9;
kazuha add weapon="xiphosmoonlight" refine=1 lvl=90/90;
kazuha add set="viridescentvenerer" count=4;
kazuha add stats hp=4780 atk=311 em=187 em=187 em=187;
kazuha add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.132 cd=0.1984;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active neuvillette;
for let i=0; i<4; i=i+1 {
  neuvillette skill;
  furina skill, dash, attack;
  zhongli skill[hold=1], dash;
  if is_even(i) { kazuha skill[hold=1], high_plunge; }
  else { if .kazuha.burst.ready { kazuha burst; } else { kazuha skill, high_plunge; } }
  if .furina.burst.ready { furina burst; }
  neuvillette charge;
  if .neuvillette.burst.ready { neuvillette burst; }
  neuvillette skill, charge;
  kazuha skill, high_plunge;
  neuvillette charge, charge;
}
`,

  // 17 海森/纳西妲/行秋/忍
  t17_alhaitham_hb: `${hdr}
alhaitham char lvl=90/90 cons=0 talent=9,9,9;
alhaitham add weapon="harbingerofdawn" refine=5 lvl=90/90;
alhaitham add set="gildeddreams" count=4;
alhaitham add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
alhaitham add stats ${sub('em=79.28')};

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 em=187 em=187;
nahida add stats ${sub('em=118.92')};

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats ${sub('er=0.2204')};

kuki char lvl=90/90 cons=5 talent=9,9,9;
kuki add weapon="xiphosmoonlight" refine=1 lvl=90/90;
kuki add set="flowerofparadiselost" count=4;
kuki add stats hp=4780 atk=311 em=187 em=187 em=187;
kuki add stats ${sub('em=118.92')};

active nahida;
for let i=0; i<5; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  xingqiu skill, burst, attack;
  kuki skill;
  if .kuki.burst.ready { kuki burst; }
  alhaitham skill, attack:3, skill, attack:3, attack:3, charge;
}
`,

  // 18 海森/纳西妲/菲谢尔/钟离
  t18_alhaitham_aggravate: `${hdr}
alhaitham char lvl=90/90 cons=0 talent=9,9,9;
alhaitham add weapon="harbingerofdawn" refine=5 lvl=90/90;
alhaitham add set="gildeddreams" count=4;
alhaitham add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
alhaitham add stats ${sub('em=79.28')};

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 em=187 em=187;
nahida add stats ${sub('em=118.92')};

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats ${sub()};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active nahida;
for let i=0; i<5; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  alhaitham skill, attack:3, skill, attack:3, attack:3, charge;
}
`,

  // 19 纳西妲/行秋/忍/柯莱
  t19_nahida_bloom: `${hdr}
nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 em=187 em=187;
nahida add stats ${sub('em=118.92')};

xingqiu char lvl=90/90 cons=6 talent=9,9,9;
xingqiu add weapon="sacrificialsword" refine=5 lvl=90/90;
xingqiu add set="emblemofseveredfate" count=4;
xingqiu add stats hp=4780 atk=311 atk%=0.466 hydro%=0.466 cr=0.311;
xingqiu add stats ${sub('er=0.2204')};

kuki char lvl=90/90 cons=5 talent=9,9,9;
kuki add weapon="xiphosmoonlight" refine=1 lvl=90/90;
kuki add set="flowerofparadiselost" count=4;
kuki add stats hp=4780 atk=311 em=187 em=187 em=187;
kuki add stats ${sub('em=118.92')};

collei char lvl=90/90 cons=4 talent=9,9,9;
collei add weapon="favoniuswarbow" refine=5 lvl=90/90;
collei add set="deepwoodmemories" count=4;
collei add stats hp=4780 atk=311 er=0.518 dendro%=0.466 cr=0.311;
collei add stats ${sub('er=0.3306')};

active nahida;
for let i=0; i<5; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  xingqiu skill, burst, attack;
  collei skill;
  if .collei.burst.ready { collei burst; }
  kuki skill;
  if .kuki.burst.ready { kuki burst; }
  nahida attack:4;
}
`,

  // 20 提纳里/纳西妲/菲谢尔/钟离
  t20_tighnari: `${hdr}
tighnari char lvl=90/90 cons=0 talent=9,9,9;
tighnari add weapon="slingshot" refine=5 lvl=90/90;
tighnari add set="gildeddreams" count=4;
tighnari add stats hp=4780 atk=311 em=187 dendro%=0.466 cr=0.311;
tighnari add stats ${sub('em=79.28')};

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 em=187 em=187;
nahida add stats ${sub('em=118.92')};

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats ${sub()};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active nahida;
for let i=0; i<5; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  tighnari skill, aim, aim, aim;
  if .tighnari.burst.ready { tighnari burst; }
}
`,

  // 21 娜维娅/希诺宁/钟离/班
  t21_navia_geo: `${hdr}
navia char lvl=90/90 cons=0 talent=9,9,9;
navia add weapon="serpentspine" refine=1 lvl=90/90 +params=[stacks=5];
navia add set="nighttimewhispersintheechoingwoods" count=4;
navia add stats hp=4780 atk=311 atk%=0.466 geo%=0.466 cr=0.311;
navia add stats ${sub()};

xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="favoniussword" refine=5 lvl=90/90;
xilonen add set="scroll" count=4;
xilonen add stats hp=4780 atk=311 def%=0.583 def%=0.583 cr=0.311;
xilonen add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.331 cd=0.5296;

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

let _execute_action = execute_action;
fn execute_action(char_id number, action_id number, p map) {
  if action_id == .action.dash { pick_up_crystallize("any"); }
  return _execute_action(char_id, action_id, p);
}

active navia;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  bennett skill, burst;
  xilonen skill, attack:2;
  if .xilonen.burst.ready { xilonen burst; }
  if .navia.burst.ready { navia burst; }
  navia skill[hold=1], attack:3, dash, attack:2;
  xilonen skill, attack:2;
  navia skill[hold=1], attack:3, dash, attack:2;
}
`,

  // 22 娜维娅/芙/钟离/班
  t22_navia_furina: `${hdr}
navia char lvl=90/90 cons=0 talent=9,9,9;
navia add weapon="serpentspine" refine=1 lvl=90/90 +params=[stacks=5];
navia add set="marechausseehunter" count=4;
navia add stats hp=4780 atk=311 atk%=0.466 geo%=0.466 cr=0.311;
navia add stats ${sub()};

furina char lvl=90/90 cons=0 talent=9,9,9;
furina add weapon="favoniussword" refine=5 lvl=90/90;
furina add set="goldentroupe" count=4;
furina add stats hp=4780 atk=311 er=0.518 hydro%=0.466 cr=0.311;
furina add stats ${sub('er=0.3306')};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

let _execute_action = execute_action;
fn execute_action(char_id number, action_id number, p map) {
  if action_id == .action.dash { pick_up_crystallize("any"); }
  return _execute_action(char_id, action_id, p);
}

active navia;
for let i=0; i<4; i=i+1 {
  furina skill, dash, attack;
  if .furina.burst.ready { furina burst; }
  zhongli skill[hold=1], dash;
  bennett skill, burst;
  if .navia.burst.ready { navia burst; }
  navia skill[hold=1], attack:3, dash, attack:2;
  bennett skill;
  navia skill[hold=1], attack:3, dash, attack:2;
}
`,

  // 23 诺艾尔/五郎/云堇/钟离
  t23_noelle: `${hdr}
noelle char lvl=90/90 cons=6 talent=9,9,9;
noelle add weapon="whiteblind" refine=5 lvl=90/90;
noelle add set="huskofopulentdreams" count=4;
noelle add stats hp=4780 atk=311 def%=0.583 geo%=0.466 cr=0.311;
noelle add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.331 cd=0.662;

gorou char lvl=90/90 cons=5 talent=9,9,9;
gorou add weapon="favoniuswarbow" refine=5 lvl=90/90;
gorou add set="noblesseoblige" count=4;
gorou add stats hp=4780 atk=311 er=0.518 def%=0.583 cr=0.311;
gorou add stats ${sub('er=0.3306 def%=0.0992')};

yunjin char lvl=90/90 cons=1 talent=9,9,9;
yunjin add weapon="favoniuslance" refine=5 lvl=90/90;
yunjin add set="huskofopulentdreams" count=4;
yunjin add stats hp=4780 atk=311 def%=0.583 def%=0.583 def%=0.583;
yunjin add stats ${sub('er=0.4408 def%=0.0992')};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  gorou skill, burst;
  yunjin skill, burst;
  noelle skill, burst;
  noelle attack:4, attack:4, attack:4;
}
`,

  // 24 流浪者/珐露珊/班/钟离
  t24_wanderer: `${hdr}
wanderer char lvl=90/90 cons=0 talent=9,9,9;
wanderer add weapon="widsith" refine=3 lvl=90/90;
wanderer add set="desertpavilionchronicle" count=4;
wanderer add stats hp=4780 atk=311 atk%=0.466 anemo%=0.466 cr=0.311;
wanderer add stats ${sub()};

faruzan char lvl=90/90 cons=6 talent=9,9,9;
faruzan add weapon="favoniuswarbow" refine=5 lvl=90/90;
faruzan add set="tenacityofthemillelith" count=4;
faruzan add stats hp=4780 atk=311 er=0.518 anemo%=0.466 cr=0.311;
faruzan add stats ${sub('er=0.4408')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="instructor" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  faruzan skill, burst;
  bennett skill, burst;
  wanderer skill, attack:5, attack:5, attack:3;
}
`,

  // 25 魈/珐露珊/班/钟离
  t25_xiao: `${hdr}
xiao char lvl=90/90 cons=0 talent=9,9,9;
xiao add weapon="deathmatch" refine=1 lvl=90/90;
xiao add set="vermillionhereafter" count=4;
xiao add stats hp=4780 atk=311 atk%=0.466 anemo%=0.466 cr=0.311;
xiao add stats ${sub()};

faruzan char lvl=90/90 cons=6 talent=9,9,9;
faruzan add weapon="favoniuswarbow" refine=5 lvl=90/90;
faruzan add set="tenacityofthemillelith" count=4;
faruzan add stats hp=4780 atk=311 er=0.518 anemo%=0.466 cr=0.311;
faruzan add stats ${sub('er=0.4408')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="instructor" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  faruzan skill, burst;
  bennett skill, burst;
  xiao skill, skill, burst;
  for let j=0; j<8; j=j+1 {
    xiao jump, high_plunge;
  }
}
`,

  // 26 克洛琳德/纳西妲/菲谢尔/钟离
  t26_clorinde: `${hdr}
clorinde char lvl=90/90 cons=0 talent=9,9,9;
clorinde add weapon="theblacksword" refine=1 lvl=90/90;
clorinde add set="thunderingfury" count=4;
clorinde add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
clorinde add stats ${sub()};

nahida char lvl=90/90 cons=1 talent=9,9,9;
nahida add weapon="sacrificialfragments" refine=5 lvl=90/90;
nahida add set="deepwoodmemories" count=4;
nahida add stats hp=4780 atk=311 em=187 em=187 em=187;
nahida add stats ${sub('em=118.92')};

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats ${sub()};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active nahida;
for let i=0; i<5; i=i+1 {
  nahida skill;
  if .nahida.burst.ready { nahida burst; }
  zhongli skill[hold=1], dash;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  clorinde skill;
  for let j=0; j<6; j=j+1 {
    clorinde attack, attack, skill;
  }
  if .clorinde.burst.ready { clorinde burst; }
}
`,

  // 27 恰斯卡/芙/班/茜
  t27_chasca: `${hdr}
chasca char lvl=90/90 cons=0 talent=9,9,9;
chasca add weapon="astralvulturescrimsonplumage" refine=1 lvl=90/90;
chasca add set="obsidiancodex" count=4;
chasca add stats hp=4780 atk=311 atk%=0.466 anemo%=0.466 cr=0.311;
chasca add stats ${sub()};

furina char lvl=90/90 cons=0 talent=9,9,9;
furina add weapon="favoniussword" refine=5 lvl=90/90;
furina add set="goldentroupe" count=4;
furina add stats hp=4780 atk=311 er=0.518 hydro%=0.466 cr=0.311;
furina add stats ${sub('er=0.3306')};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesseoblige" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats ${sub('er=0.3306')};

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats hp=4780 atk=311 er=0.518 em=187;
citlali add stats ${sub('er=0.4408 em=79.28')};

active furina;
for let i=0; i<4; i=i+1 {
  furina skill, dash, attack;
  if .furina.burst.ready { furina burst; }
  citlali skill;
  if .citlali.burst.ready { citlali burst; }
  bennett skill, burst;
  chasca skill;
  if .chasca.burst.ready { chasca burst; }
  chasca aim, aim, aim, aim, aim, aim;
}
`,

  // 28 优菈/米卡/菲谢尔/钟离
  t28_eula: `${hdr}
eula char lvl=90/90 cons=0 talent=9,9,9;
eula add weapon="serpentspine" refine=1 lvl=90/90 +params=[stacks=5];
eula add set="paleflame" count=4;
eula add stats hp=4780 atk=311 atk%=0.466 physical%=0.583 cr=0.311;
eula add stats ${sub()};

mika char lvl=90/90 cons=2 talent=9,9,9;
mika add weapon="favoniuslance" refine=5 lvl=90/90;
mika add set="noblesseoblige" count=4;
mika add stats hp=4780 atk=311 er=0.518 hp%=0.466 cr=0.311;
mika add stats ${sub('er=0.4408')};

fischl char lvl=90/90 cons=6 talent=9,9,9;
fischl add weapon="thestringless" refine=3 lvl=90/90;
fischl add set="goldentroupe" count=4;
fischl add stats hp=4780 atk=311 atk%=0.466 electro%=0.466 cr=0.311;
fischl add stats ${sub()};

zhongli char lvl=90/90 cons=0 talent=9,9,9;
zhongli add weapon="favoniuslance" refine=5 lvl=90/90;
zhongli add set="tenacityofthemillelith" count=4;
zhongli add stats hp=4780 atk=311 hp%=0.466 hp%=0.466 hp%=0.466;
zhongli add stats ${sub('hp%=0.1984')};

active zhongli;
for let i=0; i<4; i=i+1 {
  zhongli skill[hold=1], dash;
  mika skill, burst;
  if .fischl.skill.ready { fischl skill; } else { fischl burst; }
  eula skill, attack:4, skill[hold=1], attack:2;
  if .eula.burst.ready { eula burst; }
  eula attack:4;
}
`,
};

// Prior results to reuse (same engine family)
const reuse = [
  {
    id: 1,
    name: '桑多涅/八重/奥黛塔/阿罗夏',
    dps: 192611,
    source: 'final-teams/1-木偶-海渊阿罗夏',
    note: '账号练度 桑1+1 / 八重2+1 / 奥海渊 / 阿罗夏C6',
  },
  {
    id: 4,
    name: '凝光/莉奈娅/叶洛亚/爱诺',
    dps: 31430,
    source: 'linnea-teams/凝光C6-莉C0-爱诺C4-叶C2',
    note: '账号命座 凝C6 / 爱诺C4 / 叶C2；莉奈娅实现仍偏保守',
  },
  {
    id: 6,
    name: '玛薇卡/茜特菈莉/希诺宁/班尼特',
    dps: 129688,
    source: 'final-teams/2b-玛-主词条优化钥匙',
    note: '钥匙+黑曜；希苍古千岩；茜祭星绘卷；班原木宗室',
  },
  {
    id: 9,
    name: '可莉/尼可/夏沃蕾/菲谢尔',
    dps: 66126,
    source: 'final-teams/备-可莉超载',
    note: '超载壳；夏沃蕾配置按高命跑过',
  },
  {
    id: 12,
    name: '绫华/芙宁娜/爱可菲/沃雅妮莎',
    dps: 104597,
    source: 'final-teams/3-绫芙爱沃-沃65k生命',
    note: '沃堆生命约6.5万；雾切绫华',
  },
  {
    id: 13,
    name: '绫华/芙宁娜/爱可菲/申鹤',
    dps: 57484,
    source: 'final-teams/3b-绫芙爱申鹤',
    note: '本地轴偏弱，可能低估',
  },
  {
    id: 15,
    name: '那维莱特/芙宁娜/万叶/希诺宁',
    dps: 81986,
    source: 'neuv-furina-kazuha-xilonen',
    note: '那维按有乐猎人',
  },
];

const toRun = [
  { id: 2, name: '桑多涅/八重/奥黛塔/沃雅妮莎', key: 't02_sandrone_vodya' },
  { id: 3, name: '娜维娅/莉奈娅/叶洛亚/爱诺', key: 't03_navia_linnea', note: '账号命座 叶C2/爱诺C4' },
  { id: 5, name: '桑多涅/奥黛塔/沃雅妮莎/爱可菲', key: 't05_sandrone_stellar', note: '星扩散壳（原#5示例）' },
  { id: 7, name: '玛薇卡/茜特菈莉/万叶/班尼特', key: 't07_mav_kazuha' },
  { id: 8, name: '胡桃/行秋/钟离/班尼特', key: 't08_hutao_xq', note: '胡桃按C1+龙脊R5' },
  { id: 10, name: '可莉/尼可/杜林/菲谢尔', key: 't10_klee_durin' },
  { id: 11, name: '香菱/班尼特/行秋/万叶', key: 't11_national' },
  { id: 14, name: '绫华/莫娜/万叶/迪奥娜', key: 't14_ayaka_mona' },
  { id: 16, name: '那维莱特/芙宁娜/万叶/钟离', key: 't16_neuv_zl' },
  { id: 17, name: '海森/纳西妲/行秋/久岐忍', key: 't17_alhaitham_hb' },
  { id: 18, name: '海森/纳西妲/菲谢尔/钟离', key: 't18_alhaitham_aggravate' },
  { id: 19, name: '纳西妲/行秋/久岐忍/柯莱', key: 't19_nahida_bloom' },
  { id: 20, name: '提纳里/纳西妲/菲谢尔/钟离', key: 't20_tighnari' },
  { id: 21, name: '娜维娅/希诺宁/钟离/班尼特', key: 't21_navia_geo' },
  { id: 22, name: '娜维娅/芙宁娜/钟离/班尼特', key: 't22_navia_furina' },
  { id: 23, name: '诺艾尔/五郎/云堇/钟离', key: 't23_noelle' },
  { id: 24, name: '流浪者/珐露珊/班尼特/钟离', key: 't24_wanderer' },
  { id: 25, name: '魈/珐露珊/班尼特/钟离', key: 't25_xiao' },
  { id: 26, name: '克洛琳德/纳西妲/菲谢尔/钟离', key: 't26_clorinde' },
  { id: 27, name: '恰斯卡/芙宁娜/班尼特/茜特菈莉', key: 't27_chasca' },
  { id: 28, name: '优菈/米卡/菲谢尔/钟离', key: 't28_eula' },
];

async function main() {
  const rows = [...reuse];

  for (const t of toRun) {
    const body = configs[t.key];
    if (!body) {
      rows.push({ id: t.id, name: t.name, dps: null, error: 'missing config body' });
      continue;
    }
    const cfgPath = write(t.key, body);
    const outPath = path.join(OUT, `${t.key}.json`);
    process.stdout.write(`#${t.id} ${t.name} ... `);
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: ITER });
      const row = {
        id: t.id,
        name: t.name,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        duration: sim.duration,
        source: `rank28/${t.key}`,
        note: t.note || '',
      };
      rows.push(row);
      console.log(`${sim.dps} (${(sim.duration || 0).toFixed?.(1) || sim.duration}s)`);
    } catch (e) {
      console.log('FAIL', e.message);
      rows.push({ id: t.id, name: t.name, dps: null, error: String(e.message || e), note: t.note || '' });
    }
  }

  rows.sort((a, b) => (b.dps || 0) - (a.dps || 0));
  const ranked = rows.map((r, i) => ({ rank: i + 1, ...r }));
  fs.writeFileSync(WEB, JSON.stringify({ date: '2026-11-28', iterations: ITER, engine: 'gcsim local-missing-chars', ranking: ranked }, null, 2));
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(ranked, null, 2));
  console.log('\n=== RANKING ===');
  for (const r of ranked) {
    console.log(
      `${String(r.rank).padStart(2)}  ${(r.dps != null ? String(r.dps) : 'ERR').padStart(7)}  #${r.id} ${r.name}${r.error ? ' | ' + r.error : ''}`
    );
  }
  console.log('\nWrote', WEB);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
