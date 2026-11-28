const fs = require('fs');
const { execFileSync } = require('child_process');

const base = `options swap_delay=12 iteration=300 workers=8;
mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="oc" count=4;
mavuika add stats hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311;
mavuika add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944;
citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311;
citlali add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.551 em=39.64 cr=0.1986 cd=0.662;
sucrose char lvl=90/90 cons=6 talent=9,9,9;
sucrose add weapon="evenstar" refine=1 lvl=90/90;
sucrose add set="vv" count=4;
sucrose add stats hp=4780 atk=311 em=187 em=187 em=187;
sucrose add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.1488 er=0.1102 em=118.92 cr=0.3972 cd=0.4634;
nicole char lvl=90/90 cons=0 talent=9,9,9;
REPLACE_WEP
nicole add set="cg" count=4;
nicole add stats hp=4780 atk=311 atk%=0.466 atk%=0.466 atk%=0.466;
nicole add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=165.4 atk%=0.2976 er=0.1102 em=39.64 cr=0.2979 cd=0.1986;
target lvl=100 resist=0.1 radius=2 pos=0,2.4 hp=999999999;
energy every interval=480,720 amount=1;
active mavuika;
for let i=0; i<4; i=i+1 {
  mavuika skill, attack; delay(7);
  nicole skill, attack;
  sucrose swap; wait(20); sucrose skill, dash;
  citlali skill, burst, attack;
  mavuika swap;
  mavuika skill[recast=1], charge, dash, attack, charge;
  mavuika burst; delay(24);
  mavuika charge:3, charge[hold=6], charge[final=1], dash;
  mavuika charge:3, charge[hold=6], charge[final=1], dash;
  mavuika charge, dash;
}`;

const weps = [
  ['祭星R1', 'nicole add weapon="starcallerswatch" refine=1 lvl=90/90;'],
  ['天空书R1', 'nicole add weapon="skywardatlas" refine=1 lvl=90/90;'],
  ['讨龙R5', 'nicole add weapon="thrillingtalesofdragonslayers" refine=5 lvl=90/90;'],
  ['西风书R3', 'nicole add weapon="favoniuscodex" refine=3 lvl=90/90;'],
  ['明瞳R5', 'nicole add weapon="oathsworneye" refine=5 lvl=90/90;'],
];

for (const [name, line] of weps) {
  const cfg = base.replace('REPLACE_WEP', line);
  const p = 'tools/gcsim/configs/_nic_wep.txt';
  fs.writeFileSync(p, cfg);
  const out = 'tools/gcsim/results/_nic_wep.json';
  try {
    execFileSync('./tools/gcsim/gcsim.exe', ['-c', p, '-out', out, '-nb'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    delete require.cache[require.resolve('../../' + out.replace(/^\.\.\//, ''))];
  } catch (e) {
    const msg = (e.stderr && e.stderr.toString()) || e.message;
    console.log(name, 'ERR', msg.slice(0, 240));
    continue;
  }
  const s = JSON.parse(fs.readFileSync(out, 'utf8')).statistics;
  console.log(
    name,
    Math.round(s.dps.mean),
    'mav',
    Math.round(s.character_dps[0].mean)
  );
}
