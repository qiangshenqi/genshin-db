const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const bin = path.join(__dirname, '../../tools/gcsim/gcsim.exe');
const tmp = path.join(__dirname, '../../tools/gcsim/configs/_keytest.txt');

function test(char, kind, key) {
  let line;
  if (kind === 'weapon') {
    line = `${char} add weapon="${key}" refine=1 lvl=90/90;`;
  } else {
    line = `${char} add set="${key}" count=4;`;
  }
  const defaultWeapon =
    char === 'citlali' ? 'ttds' : char === 'mavuika' ? 'serpentspine' : 'favoniussword';
  const cfg = [
    'options iteration=1 duration=1 workers=1;',
    'target lvl=100 resist=0.1;',
    `${char} char lvl=90/90 cons=0 talent=1,1,1;`,
    `${char} add weapon="${defaultWeapon}" refine=1 lvl=90/90;`,
    line,
    `${char} add stats hp=4780 atk=311;`,
    `active ${char};`,
    `${char} attack;`,
    '',
  ].join('\n');
  fs.writeFileSync(tmp, cfg);
  const p = spawnSync(bin, ['-c', tmp], { encoding: 'utf8' });
  const out = `${p.stdout || ''}${p.stderr || ''}`;
  return p.status === 0 && !/invalid weapon|invalid set|unrecognized|unknown/i.test(out);
}

const weapons = {
  xilonen: [
    'freedomsworn',
    'favoniussword',
    'favsword',
    'peakpatrolsong',
    'xiphosmoonlight',
    'sapwoodblade',
    'fluteofezpitzal',
    'alleyflash',
    'thealleyflash',
  ],
  citlali: [
    'starcallerswatch',
    'ttds',
    'thrillingtalesofdragonslayers',
    'sacrificialfragments',
    'wanderingevenstar',
    'evenstar',
    'favonicuscodex',
    'favoniuscodex',
    'hakushinring',
  ],
  bennett: [
    'favoniussword',
    'favsword',
    'sapwoodblade',
    'thealleyflash',
    'alleyflash',
    'xiphosmoonlight',
    'freedomsworn',
    'skywardblade',
    'aquilafavonia',
  ],
};

const sets = [
  'scroll',
  'noblesse',
  'no',
  'ap',
  'archaicpetra',
  'instructor',
  'totm',
  'tenacity',
  'ohc',
  'maiden',
  'vv',
  'deepwood',
];

for (const [char, list] of Object.entries(weapons)) {
  console.log('\n## weapons', char);
  for (const k of list) {
    console.log(test(char, 'weapon', k) ? 'OK' : 'NO', k);
  }
}

console.log('\n## sets on bennett');
for (const k of sets) {
  console.log(test('bennett', 'set', k) ? 'OK' : 'NO', k);
}
