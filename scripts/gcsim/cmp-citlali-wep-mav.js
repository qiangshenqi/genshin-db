const fs = require('fs');
const { execFileSync } = require('child_process');

const base = fs
  .readFileSync('tools/gcsim/configs/mav-cmp-xil-ben.txt', 'utf8')
  .replace(/iteration=\d+/, 'iteration=300');

const weps = [
  ['祭星R1', 'starcallerswatch', 1],
  ['讨龙R5', 'thrillingtalesofdragonslayers', 5],
  ['千梦R1', 'athousandfloatingdreams', 1],
  ['西风书R3', 'favoniuscodex', 3],
  ['祭礼残章R5', 'sacrificialfragments', 5],
  ['金流R1', 'cashflowsupervision', 1],
  ['图拉杜拉R1', 'tulaytullahsremembrance', 1],
  ['神乐R1', 'kagurasverity', 1],
  ['天空书R1', 'skywardatlas', 1],
  ['流浪乐章R5', 'thewidsith', 5],
];

for (const [name, key, refine] of weps) {
  const cfg = base.replace(
    /citlali add weapon="[^"]+" refine=\d+ lvl=90\/90;/,
    `citlali add weapon="${key}" refine=${refine} lvl=90/90;`
  );
  fs.writeFileSync('tools/gcsim/configs/_cit_wep.txt', cfg);
  try {
    execFileSync(
      './tools/gcsim/gcsim.exe',
      ['-c', 'tools/gcsim/configs/_cit_wep.txt', '-out', 'tools/gcsim/results/_cit_wep.json', '-nb'],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
  } catch (e) {
    const msg = (e.stderr && e.stderr.toString()) || e.message;
    console.log(name, 'ERR', msg.replace(/\s+/g, ' ').slice(0, 180));
    continue;
  }
  const s = JSON.parse(fs.readFileSync('tools/gcsim/results/_cit_wep.json', 'utf8')).statistics;
  console.log(
    name.padEnd(10),
    Math.round(s.dps.mean),
    'mav',
    Math.round(s.character_dps[0].mean),
    'cit',
    Math.round(s.character_dps[1].mean)
  );
}
