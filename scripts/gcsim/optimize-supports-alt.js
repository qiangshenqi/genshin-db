/**
 * 排除峰巡首歌 / 风鹰剑，重搜辅助配装
 * 圣遗物锁定主流：希诺宁 千岩/绘卷，茜特菈莉 绘卷，班尼特 宗室
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
const OUT_JSON = path.join(ROOT, 'web/data/support-optimize.json');

const SEARCH_ITERS = Number(process.env.GCSIM_ITERS || 80);
const FINAL_ITERS = Number(process.env.GCSIM_FINAL_ITERS || 200);

const XILONEN_WEAPONS = [
  { key: 'freedomsworn', name: '苍古自由之誓', refine: 1 },
  { key: 'favoniussword', name: '西风剑', refine: 3 },
  { key: 'fluteofezpitzal', name: '息止轻笛', refine: 5 },
  { key: 'sapwoodblade', name: '原木刀', refine: 5 },
];
const XILONEN_SETS = [
  { key: 'ap', name: '千岩牢固4' },
  { key: 'scroll', name: '烬城勇者绘卷4' },
];

const CITLALI_WEAPONS = [
  { key: 'starcallerswatch', name: '祭星者之望', refine: 1 },
  { key: 'ttds', name: '讨龙英杰谭', refine: 5 },
];
const CITLALI_SETS = [{ key: 'scroll', name: '烬城勇者绘卷4' }];

const BENNETT_WEAPONS = [
  { key: 'sapwoodblade', name: '原木刀', refine: 5 },
  { key: 'thealleyflash', name: '暗巷闪光', refine: 1 },
  { key: 'favoniussword', name: '西风剑', refine: 3 },
];
const BENNETT_SETS = [{ key: 'noblesse', name: '昔日宗室之仪4' }];

function statsFor(role, weaponKey) {
  if (role === 'xilonen') {
    if (weaponKey === 'freedomsworn') {
      return {
        main: 'hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311',
        sub: 'def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.3972',
      };
    }
    if (weaponKey === 'favoniussword') {
      return {
        main: 'hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311',
        sub: 'def%=0.31 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.331 cd=0.5296',
      };
    }
    return {
      main: 'hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311',
      sub: 'def%=0.31 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=39.64 cr=0.2648 cd=0.662',
    };
  }

  if (role === 'citlali') {
    if (weaponKey === 'ttds') {
      return {
        main: 'hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311',
        sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=237.84 cr=0.1324 cd=0.5296',
      };
    }
    return {
      main: 'hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311',
      sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.662',
    };
  }

  if (weaponKey === 'favoniussword') {
    return {
      main: 'hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311',
      sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.4408 em=39.64 cr=0.331 cd=0.5296',
    };
  }
  return {
    main: 'hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311',
    sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.7944',
  };
}

function buildConfig(xW, xS, cW, cS, bW, bS, iters) {
  const xs = statsFor('xilonen', xW.key);
  const cs = statsFor('citlali', cW.key);
  const bs = statsFor('bennett', bW.key);

  return `# auto-generated support alt (no peak / no aquila)
options swap_delay=12 iteration=${iters} workers=8;

mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="ateaspoonoftranscendence" refine=1 lvl=90/90;
mavuika add set="oc" count=4;
mavuika add stats hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311;
mavuika add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944;

xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="${xW.key}" refine=${xW.refine} lvl=90/90;
xilonen add set="${xS.key}" count=4;
xilonen add stats ${xs.main};
xilonen add stats ${xs.sub};

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="${cW.key}" refine=${cW.refine} lvl=90/90;
citlali add set="${cS.key}" count=4;
citlali add stats ${cs.main};
citlali add stats ${cs.sub};

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="${bW.key}" refine=${bW.refine} lvl=90/90;
bennett add set="${bS.key}" count=4;
bennett add stats ${bs.main};
bennett add stats ${bs.sub};

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

  const combos = [];
  for (const xW of XILONEN_WEAPONS) {
    for (const xS of XILONEN_SETS) {
      for (const cW of CITLALI_WEAPONS) {
        for (const cS of CITLALI_SETS) {
          for (const bW of BENNETT_WEAPONS) {
            for (const bS of BENNETT_SETS) {
              // 绘卷至少一件：茜特菈莉已固定绘卷
              // 原木刀不重复拿两把
              if (xW.key === 'sapwoodblade' && bW.key === 'sapwoodblade') continue;
              if (xW.key === 'favoniussword' && bW.key === 'favoniussword') continue;
              combos.push({ xW, xS, cW, cS, bW, bS });
            }
          }
        }
      }
    }
  }

  console.log(`组合数: ${combos.length}, search iters=${SEARCH_ITERS}`);
  const results = [];
  let i = 0;
  for (const c of combos) {
    i += 1;
    const cfgPath = path.join(CONFIG_DIR, '_opt_tmp.txt');
    const outPath = path.join(RESULT_DIR, `opt_alt_${i}.json`);
    fs.writeFileSync(cfgPath, buildConfig(c.xW, c.xS, c.cW, c.cS, c.bW, c.bS, SEARCH_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: SEARCH_ITERS });
      const row = {
        dps: sim.dps,
        xilonen: `${c.xW.name} + ${c.xS.name}`,
        citlali: `${c.cW.name} + ${c.cS.name}`,
        bennett: `${c.bW.name} + ${c.bS.name}`,
        combo: c,
      };
      results.push(row);
      if (i % 6 === 0 || i === combos.length) {
        const best = [...results].sort((a, b) => b.dps - a.dps)[0];
        console.log(
          `[${i}/${combos.length}] latest=${row.dps} best=${best.dps} (${best.xilonen} | ${best.bennett})`
        );
      }
    } catch (e) {
      console.warn(`[${i}] fail: ${e.message}`);
    }
  }

  results.sort((a, b) => b.dps - a.dps);
  console.log('\n=== TOP search ===');
  results.slice(0, 10).forEach((r, idx) => {
    console.log(`#${idx + 1} ${r.dps} | 希诺宁:${r.xilonen} | 茜特菈莉:${r.citlali} | 班尼特:${r.bennett}`);
  });

  const finals = [];
  for (const [idx, r] of results.slice(0, 5).entries()) {
    const c = r.combo;
    const cfgPath = path.join(CONFIG_DIR, `mavuika-support-alt-${idx + 1}.txt`);
    const outPath = path.join(RESULT_DIR, `mavuika-support-alt-${idx + 1}.json`);
    fs.writeFileSync(cfgPath, buildConfig(c.xW, c.xS, c.cW, c.cS, c.bW, c.bS, FINAL_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: FINAL_ITERS });
      finals.push({
        rank: idx + 1,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        xilonen: r.xilonen,
        citlali: r.citlali,
        bennett: r.bennett,
        config: path.relative(ROOT, cfgPath).replace(/\\/g, '/'),
      });
      console.log(`FINAL #${idx + 1}: ${sim.dps} DPS`);
    } catch (e) {
      console.warn(`FINAL #${idx + 1} fail: ${e.message}`);
    }
  }

  finals.sort((a, b) => b.dps - a.dps);
  const payload = {
    fixed: {
      mavuika: 'C0 / 超越之匙 R1 / 黑曜秘典4',
      xilonenCons: 'C0',
      citlaliCons: 'C0',
      bennettCons: 'C6',
      excluded: ['峰巡首歌', '风鹰剑'],
    },
    searchCombos: combos.length,
    searchIterations: SEARCH_ITERS,
    finalIterations: FINAL_ITERS,
    generatedAt: new Date().toISOString(),
    winner: finals[0] || null,
    topFinal: finals,
    topSearch: results.slice(0, 10).map(({ dps, xilonen, citlali, bennett }) => ({
      dps,
      xilonen,
      citlali,
      bennett,
    })),
    vsPeakAquila: {
      dps: 166004,
      note: '含峰巡+风鹰的原第一名',
    },
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
  console.log('\nWinner:', JSON.stringify(finals[0], null, 2));
  console.log('Wrote', OUT_JSON);
}

main();
