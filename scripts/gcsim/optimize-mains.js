/**
 * 固定：武器/套装/循环
 * 搜索三人沙杯头主词条 + 火神沙/头，找最高 DPS
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
const OUT = path.join(ROOT, 'web/data/mains-optimize.json');

const SEARCH_ITERS = Number(process.env.GCSIM_ITERS || 80);
const FINAL_ITERS = Number(process.env.GCSIM_FINAL_ITERS || 200);

const FLOWER_PLUME = 'hp=4780 atk=311';

// 主词条数值（90级）
const M = {
  def: 0.583,
  er: 0.518,
  em: 187,
  atk: 0.466,
  hp: 0.466,
  pyro: 0.466,
  cryo: 0.466,
  cr: 0.311,
  cd: 0.622,
};

function joinMains(parts) {
  const acc = {};
  for (const p of parts) {
    for (const [k, v] of Object.entries(p)) acc[k] = (acc[k] || 0) + v;
  }
  return Object.entries(acc)
    .map(([k, v]) => `${k}=${Number(v.toFixed(4))}`)
    .join(' ');
}

function subFor(role, mainsKey) {
  // 按角色补关键副词条；缺充能主词条时提高 er 副词
  const hasEr = /er=/.test(mainsKey);
  if (role === 'mavuika') {
    if (/cd=0\.622/.test(mainsKey) && !/cr=0\.311/.test(mainsKey)) {
      return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662';
    }
    return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944';
  }
  if (role === 'xilonen') {
    if (hasEr) {
      return 'def%=0.31 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.3972';
    }
    return 'def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.1324 cd=0.2648';
  }
  if (role === 'citlali') {
    if (hasEr) {
      return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.662';
    }
    return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=118.92 cr=0.1324 cd=0.3972';
  }
  // bennett
  if (hasEr) {
    return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.5296';
  }
  return 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.551 em=39.64 cr=0.1986 cd=0.3972';
}

const MAV_OPTIONS = [
  { label: '精通/火伤/暴击', sands: { em: M.em }, goblet: { 'pyro%': M.pyro }, circlet: { cr: M.cr } },
  { label: '精通/火伤/暴伤', sands: { em: M.em }, goblet: { 'pyro%': M.pyro }, circlet: { cd: M.cd } },
  { label: '攻击/火伤/暴击', sands: { 'atk%': M.atk }, goblet: { 'pyro%': M.pyro }, circlet: { cr: M.cr } },
];

const XIL_OPTIONS = [
  { label: '防御/充能/暴击', sands: { 'def%': M.def }, goblet: { er: M.er }, circlet: { cr: M.cr } },
  { label: '防御/防御/暴击', sands: { 'def%': M.def }, goblet: { 'def%': M.def }, circlet: { cr: M.cr } },
  { label: '充能/防御/暴击', sands: { er: M.er }, goblet: { 'def%': M.def }, circlet: { cr: M.cr } },
  { label: '防御/充能/防御', sands: { 'def%': M.def }, goblet: { er: M.er }, circlet: { 'def%': M.def } },
  { label: '防御/防御/防御', sands: { 'def%': M.def }, goblet: { 'def%': M.def }, circlet: { 'def%': M.def } },
  { label: '充能/防御/防御', sands: { er: M.er }, goblet: { 'def%': M.def }, circlet: { 'def%': M.def } },
];

const CIT_OPTIONS = [
  { label: '充能/冰伤/暴击', sands: { er: M.er }, goblet: { 'cryo%': M.cryo }, circlet: { cr: M.cr } },
  { label: '充能/精通/暴击', sands: { er: M.er }, goblet: { em: M.em }, circlet: { cr: M.cr } },
  { label: '精通/冰伤/暴击', sands: { em: M.em }, goblet: { 'cryo%': M.cryo }, circlet: { cr: M.cr } },
  { label: '充能/精通/精通', sands: { er: M.er }, goblet: { em: M.em }, circlet: { em: M.em } },
  { label: '精通/精通/精通', sands: { em: M.em }, goblet: { em: M.em }, circlet: { em: M.em } },
  { label: '充能/冰伤/精通', sands: { er: M.er }, goblet: { 'cryo%': M.cryo }, circlet: { em: M.em } },
];

const BEN_OPTIONS = [
  { label: '充能/火伤/暴击', sands: { er: M.er }, goblet: { 'pyro%': M.pyro }, circlet: { cr: M.cr } },
  { label: '充能/生命/暴击', sands: { er: M.er }, goblet: { 'hp%': M.hp }, circlet: { cr: M.cr } },
  { label: '充能/生命/生命', sands: { er: M.er }, goblet: { 'hp%': M.hp }, circlet: { 'hp%': M.hp } },
  { label: '充能/火伤/生命', sands: { er: M.er }, goblet: { 'pyro%': M.pyro }, circlet: { 'hp%': M.hp } },
  { label: '充能/攻击/攻击', sands: { er: M.er }, goblet: { 'atk%': M.atk }, circlet: { 'atk%': M.atk } },
  { label: '充能/攻击/暴击', sands: { er: M.er }, goblet: { 'atk%': M.atk }, circlet: { cr: M.cr } },
];

function buildConfig(mav, xil, cit, ben, iters) {
  const mavMain = `${FLOWER_PLUME} ${joinMains([mav.sands, mav.goblet, mav.circlet])}`;
  const xilMain = `${FLOWER_PLUME} ${joinMains([xil.sands, xil.goblet, xil.circlet])}`;
  const citMain = `${FLOWER_PLUME} ${joinMains([cit.sands, cit.goblet, cit.circlet])}`;
  const benMain = `${FLOWER_PLUME} ${joinMains([ben.sands, ben.goblet, ben.circlet])}`;

  return `# mains optimize
options swap_delay=12 iteration=${iters} workers=8;

mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="oc" count=4;
mavuika add stats ${mavMain};
mavuika add stats ${subFor('mavuika', mavMain)};

xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="freedomsworn" refine=1 lvl=90/90;
xilonen add set="ap" count=4;
xilonen add stats ${xilMain};
xilonen add stats ${subFor('xilonen', xilMain)};

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats ${citMain};
citlali add stats ${subFor('citlali', citMain)};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesse" count=4;
bennett add stats ${benMain};
bennett add stats ${subFor('bennett', benMain)};

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

function main() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.mkdirSync(RESULT_DIR, { recursive: true });

  // 先锁火神为精通/火伤/暴击，搜三人；再对前几名微调火神
  const phase1 = [];
  const mav0 = MAV_OPTIONS[0];
  for (const xil of XIL_OPTIONS) {
    for (const cit of CIT_OPTIONS) {
      for (const ben of BEN_OPTIONS) {
        phase1.push({ mav: mav0, xil, cit, ben });
      }
    }
  }
  console.log(`Phase1 combos=${phase1.length}, iters=${SEARCH_ITERS}`);

  const results = [];
  let i = 0;
  for (const c of phase1) {
    i += 1;
    const cfgPath = path.join(CONFIG_DIR, '_mains_tmp.txt');
    const outPath = path.join(RESULT_DIR, `mains_${i}.json`);
    fs.writeFileSync(cfgPath, buildConfig(c.mav, c.xil, c.cit, c.ben, SEARCH_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: SEARCH_ITERS });
      const row = {
        dps: sim.dps,
        mavuika: c.mav.label,
        xilonen: c.xil.label,
        citlali: c.cit.label,
        bennett: c.ben.label,
        combo: c,
      };
      results.push(row);
      if (i % 20 === 0 || i === phase1.length) {
        const best = [...results].sort((a, b) => b.dps - a.dps)[0];
        console.log(`[${i}/${phase1.length}] latest=${row.dps} best=${best.dps}`);
      }
    } catch (e) {
      console.warn(`[${i}] fail: ${e.message}`);
    }
  }

  results.sort((a, b) => b.dps - a.dps);
  console.log('\n=== TOP support mains ===');
  results.slice(0, 12).forEach((r, idx) => {
    console.log(
      `#${idx + 1} ${r.dps} | 希:${r.xilonen} | 茜:${r.citlali} | 班:${r.bennett}`
    );
  });

  // Phase2: 对 top3 支持配装 × 火神三种主词条
  const topSupports = results.slice(0, 3);
  const phase2 = [];
  for (const s of topSupports) {
    for (const mav of MAV_OPTIONS) {
      phase2.push({ mav, xil: s.combo.xil, cit: s.combo.cit, ben: s.combo.ben });
    }
  }

  const finals = [];
  let j = 0;
  for (const c of phase2) {
    j += 1;
    const cfgPath = path.join(CONFIG_DIR, `mavuika-mains-best-${j}.txt`);
    const outPath = path.join(RESULT_DIR, `mavuika-mains-best-${j}.json`);
    fs.writeFileSync(cfgPath, buildConfig(c.mav, c.xil, c.cit, c.ben, FINAL_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: FINAL_ITERS });
      finals.push({
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        mavuika: c.mav.label,
        xilonen: c.xil.label,
        citlali: c.cit.label,
        bennett: c.ben.label,
        config: path.relative(ROOT, cfgPath).replace(/\\/g, '/'),
      });
      console.log(
        `FINAL ${j}: ${sim.dps} | 火:${c.mav.label} 希:${c.xil.label} 茜:${c.cit.label} 班:${c.ben.label}`
      );
    } catch (e) {
      console.warn(`FINAL ${j} fail: ${e.message}`);
    }
  }

  finals.sort((a, b) => b.dps - a.dps);

  // 额外：你之前那套「三防/三精/充能双攻」对照
  const userCombo = {
    mav: mav0,
    xil: XIL_OPTIONS.find((x) => x.label === '防御/防御/防御'),
    cit: CIT_OPTIONS.find((x) => x.label === '精通/精通/精通'),
    ben: BEN_OPTIONS.find((x) => x.label === '充能/攻击/攻击'),
  };
  const userCfg = path.join(CONFIG_DIR, 'mavuika-mains-user.txt');
  fs.writeFileSync(
    userCfg,
    buildConfig(userCombo.mav, userCombo.xil, userCombo.cit, userCombo.ben, FINAL_ITERS)
  );
  let userResult = null;
  try {
    const sim = runConfig(userCfg, path.join(RESULT_DIR, 'mavuika-mains-user.json'), {
      iterations: FINAL_ITERS,
    });
    userResult = {
      dps: sim.dps,
      dpsMin: sim.dpsMin,
      dpsMax: sim.dpsMax,
      mavuika: userCombo.mav.label,
      xilonen: userCombo.xil.label,
      citlali: userCombo.cit.label,
      bennett: userCombo.ben.label,
    };
    console.log(`USER combo: ${sim.dps}`);
  } catch (e) {
    console.warn('USER fail', e.message);
  }

  const payload = {
    fixed: {
      weapons: '超越之匙 / 苍古 / 祭星 / 原木R1',
      sets: '黑曜4 / 千岩4 / 绘卷4 / 宗室4',
      rotation: '现用融化轴',
    },
    searchCombos: phase1.length,
    searchIterations: SEARCH_ITERS,
    finalIterations: FINAL_ITERS,
    generatedAt: new Date().toISOString(),
    winner: finals[0],
    topFinal: finals.slice(0, 8),
    topSearch: results.slice(0, 15).map(({ dps, mavuika, xilonen, citlali, bennett }) => ({
      dps,
      mavuika,
      xilonen,
      citlali,
      bennett,
    })),
    userRequested: userResult,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log('\nWinner:', JSON.stringify(finals[0], null, 2));
  console.log('Wrote', OUT);
}

main();
