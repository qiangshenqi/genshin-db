const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const bin = path.join(__dirname, '../../tools/gcsim/gcsim.exe');
const tmp = path.join(__dirname, '../../tools/gcsim/configs/_wtest.txt');

const weapons = [
  'bladeofatonement',
  'atonement',
  'mailedflower',
  'tidalshadow',
  'frostbreath',
  'wolfsgravestone',
  'serpentspine',
  'beacon',
  'ateaspoonoftranscendence',
  'athousandblazingsuns',
  'deathmatch',
  'thewidsith',
  'echoesoftheheart',
  'kagurasverity',
  'heartofthefurnace',
  'disenchantmentindeepshadow',
  'disenchantmentindeepshadows',
  'dds',
  'furnace',
  'favoniussword',
  'favoniuslance',
  'finaleofthedeep',
];
const sets = [
  'disenchantmentindeepshadow',
  'disenchantmentindeepshadows',
  'dds',
  'heartofthefurnace',
  'furnace',
  'hotf',
  'totm',
  'noblesse',
  'gt',
  'goldentroupe',
  'blizzardstrayer',
];

function probe(kind, key) {
  const cfg =
    kind === 'weapon'
      ? `options iteration=1 duration=1 workers=1;
target lvl=100 resist=0.1;
sandrone char lvl=90/90 cons=0 talent=1,1,1;
sandrone add weapon="${key}" refine=1 lvl=90/90;
sandrone add set="blizzardstrayer" count=4;
sandrone add stats hp=4780 atk=311;
active sandrone;
sandrone attack;
`
      : `options iteration=1 duration=1 workers=1;
target lvl=100 resist=0.1;
sandrone char lvl=90/90 cons=0 talent=1,1,1;
sandrone add weapon="wolfsgravestone" refine=1 lvl=90/90;
sandrone add set="${key}" count=4;
sandrone add stats hp=4780 atk=311;
active sandrone;
sandrone attack;
`;
  fs.writeFileSync(tmp, cfg);
  const p = spawnSync(bin, ['-c', tmp], { encoding: 'utf8' });
  const out = `${p.stdout || ''}${p.stderr || ''}`;
  const ok = p.status === 0 && !/invalid|unrecognized|unknown/i.test(out);
  console.log(`${ok ? 'OK' : 'NO'} ${kind} ${key}`);
}

console.log('## weapons');
weapons.forEach((k) => probe('weapon', k));
console.log('## sets');
sets.forEach((k) => probe('set', k));
