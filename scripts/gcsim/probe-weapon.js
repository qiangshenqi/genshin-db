const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const keys = process.argv.slice(2);
if (!keys.length) {
  keys.push(
    'ateaspoonoftranscendence',
    'teaspoonoftranscendence',
    'teaspoon',
    'surpassingkey',
    'keyoftranscendence',
    'freedomsworn',
    'starcallerswatch',
    'favoniussword'
  );
}

const bin = path.join(__dirname, '../../tools/gcsim/gcsim.exe');
const tmp = path.join(__dirname, '../../tools/gcsim/configs/_wtest.txt');

for (const k of keys) {
  const cfg = [
    'options iteration=1 duration=1 workers=1;',
    'target lvl=100 resist=0.1;',
    'mavuika char lvl=90/90 cons=0 talent=1,1,1;',
    `mavuika add weapon="${k}" refine=1 lvl=90/90;`,
    'mavuika add set="oc" count=4;',
    'mavuika add stats hp=4780 atk=311;',
    'active mavuika;',
    'mavuika attack;',
    '',
  ].join('\n');
  fs.writeFileSync(tmp, cfg);
  const p = spawnSync(bin, ['-c', tmp], { encoding: 'utf8' });
  const out = `${p.stdout || ''}${p.stderr || ''}`;
  const ok = p.status === 0 && !/unrecognized|unknown weapon|invalid weapon|error/i.test(out);
  const tail = out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(-2)
    .join(' | ');
  console.log(`${ok ? 'OK ' : 'NO '} ${k} :: ${tail}`);
}
