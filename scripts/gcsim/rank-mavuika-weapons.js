/**
 * 固定辅助：苍古+千岩 / 祭星+绘卷 / 原木R1+宗室
 * 只换玛薇卡武器，圣遗物黑曜4，按武器副属性微调双暴
 */
const fs = require('fs');
const path = require('path');
const { runConfig } = require('./runner');

const ROOT = path.join(__dirname, '../..');
const CONFIG_DIR = path.join(ROOT, 'tools/gcsim/configs');
const RESULT_DIR = path.join(ROOT, 'tools/gcsim/results');
const OUT_JSON = path.join(ROOT, 'web/data/mavuika-weapon-rank.json');

const SEARCH_ITERS = Number(process.env.GCSIM_ITERS || 120);
const FINAL_ITERS = Number(process.env.GCSIM_FINAL_ITERS || 200);

// type: cr / cd / atk / em / er / phys — 影响双暴分配
const WEAPONS = [
  { key: 'ateaspoonoftranscendence', name: '超越之匙', refine: 1, type: 'cr' },
  { key: 'athousandblazingsuns', name: '焚曜千阳', refine: 1, type: 'cr' },
  { key: 'wolfsgravestone', name: '狼的末路', refine: 1, type: 'atk' },
  { key: 'beacon', name: '苇海信标', refine: 1, type: 'cr' },
  { key: 'serpentspine', name: '螭骨剑', refine: 5, type: 'cr' },
  { key: 'fangofthemountainking', name: '山王长牙', refine: 1, type: 'cr' },
  { key: 'verdict', name: '裁断', refine: 1, type: 'cr' },
  { key: 'theunforged', name: '无无禁锢', refine: 1, type: 'atk' },
  { key: 'skywardpride', name: '天空之傲', refine: 1, type: 'er' },
  { key: 'redhornstonethresher', name: '赤角石溃杵', refine: 1, type: 'cd' },
  { key: 'songofbrokenpines', name: '松籁响起之时', refine: 1, type: 'phys' },
  { key: 'earthshaker', name: '撼地者', refine: 5, type: 'atk' },
  { key: 'fruitfulhook', name: '硕果钩', refine: 5, type: 'atk' },
  { key: 'rainslasher', name: '雨裁', refine: 5, type: 'em' },
  { key: 'blackcliffslasher', name: '黑岩斩刀', refine: 1, type: 'cd' },
  { key: 'lithicblade', name: '千岩古剑', refine: 1, type: 'atk' },
  { key: 'prototypearchaic', name: '试作古华', refine: 5, type: 'atk' },
  { key: 'talkingstick', name: '聊聊棍', refine: 5, type: 'cr' },
  { key: 'ultimateoverlordsmegamagicsword', name: '「究极霸王超级魔剑」', refine: 1, type: 'er' },
];

function mavuikaStats(type) {
  // 统一花羽沙杯：HP/ATK/EM/火伤；头依武器调
  if (type === 'cr') {
    // 武器自带暴击 → 暴伤头，副词少暴击多暴伤
    return {
      main: 'hp=4780 atk=311 em=187 pyro%=0.466 cd=0.622',
      sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.1986 cd=0.7944',
    };
  }
  if (type === 'cd') {
    // 武器自带暴伤 → 暴击头
    return {
      main: 'hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311',
      sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=118.92 cr=0.331 cd=0.662',
    };
  }
  if (type === 'em') {
    return {
      main: 'hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311',
      sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=237.84 cr=0.2648 cd=0.662',
    };
  }
  // atk / er / phys 默认
  return {
    main: 'hp=4780 atk=311 em=187 pyro%=0.466 cr=0.311',
    sub: 'def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.1102 em=158.56 cr=0.331 cd=0.7944',
  };
}

function buildConfig(weapon, iters) {
  const ms = mavuikaStats(weapon.type);
  return `# mavuika weapon rank: ${weapon.name}
options swap_delay=12 iteration=${iters} workers=8;

mavuika char lvl=90/90 cons=0 talent=9,9,9;
mavuika add weapon="${weapon.key}" refine=${weapon.refine} lvl=90/90;
mavuika add set="oc" count=4;
mavuika add stats ${ms.main};
mavuika add stats ${ms.sub};

xilonen char lvl=90/90 cons=0 talent=9,9,9;
xilonen add weapon="freedomsworn" refine=1 lvl=90/90;
xilonen add set="ap" count=4;
xilonen add stats hp=4780 atk=311 def%=0.583 er=0.518 cr=0.311;
xilonen add stats def%=0.248 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.3972;

citlali char lvl=90/90 cons=0 talent=9,9,9;
citlali add weapon="starcallerswatch" refine=1 lvl=90/90;
citlali add set="scroll" count=4;
citlali add stats hp=4780 atk=311 er=0.518 cryo%=0.466 cr=0.311;
citlali add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.2204 em=158.56 cr=0.1986 cd=0.662;

bennett char lvl=90/90 cons=6 talent=9,9,9;
bennett add weapon="sapwoodblade" refine=1 lvl=90/90;
bennett add set="noblesse" count=4;
bennett add stats hp=4780 atk=311 er=0.518 pyro%=0.466 cr=0.311;
bennett add stats def%=0.124 def=39.36 hp=507.88 hp%=0.0992 atk=33.08 atk%=0.0992 er=0.3306 em=39.64 cr=0.2648 cd=0.7944;

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

  console.log(`武器数=${WEAPONS.length}, search iters=${SEARCH_ITERS}`);
  const results = [];
  let i = 0;
  for (const w of WEAPONS) {
    i += 1;
    const cfgPath = path.join(CONFIG_DIR, '_mav_wep_tmp.txt');
    const outPath = path.join(RESULT_DIR, `mav_wep_${i}.json`);
    fs.writeFileSync(cfgPath, buildConfig(w, SEARCH_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: SEARCH_ITERS });
      results.push({
        weapon: w.name,
        key: w.key,
        refine: w.refine,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
      });
      console.log(`[${i}/${WEAPONS.length}] ${w.name} R${w.refine} => ${sim.dps}`);
    } catch (e) {
      console.warn(`[${i}] ${w.name} fail: ${e.message}`);
    }
  }

  results.sort((a, b) => b.dps - a.dps);

  // 重跑前 8
  const finals = [];
  for (const [idx, r] of results.slice(0, 8).entries()) {
    const w = WEAPONS.find((x) => x.key === r.key);
    const cfgPath = path.join(CONFIG_DIR, `mavuika-weapon-rank-${idx + 1}.txt`);
    const outPath = path.join(RESULT_DIR, `mavuika-weapon-rank-${idx + 1}.json`);
    fs.writeFileSync(cfgPath, buildConfig(w, FINAL_ITERS));
    try {
      const sim = runConfig(cfgPath, outPath, { iterations: FINAL_ITERS });
      finals.push({
        rank: idx + 1,
        weapon: r.weapon,
        refine: r.refine,
        dps: sim.dps,
        dpsMin: sim.dpsMin,
        dpsMax: sim.dpsMax,
        vsBaseline: null,
      });
      console.log(`FINAL #${idx + 1} ${r.weapon}: ${sim.dps}`);
    } catch (e) {
      console.warn(`FINAL #${idx + 1} fail: ${e.message}`);
      finals.push({ ...r, rank: idx + 1, fail: e.message });
    }
  }

  finals.sort((a, b) => (b.dps || 0) - (a.dps || 0));
  const baseline = finals.find((x) => x.weapon === '超越之匙') || results.find((x) => x.key === 'ateaspoonoftranscendence');
  const baseDps = baseline?.dps || null;
  for (const row of finals) {
    if (baseDps && row.dps) row.vsBaseline = row.dps - baseDps;
  }

  const ranking = results.map((r, idx) => ({
    rank: idx + 1,
    ...r,
    vsBaseline: baseDps ? r.dps - baseDps : null,
  }));

  const payload = {
    fixed: {
      team: '玛薇卡/希诺宁/茜特菈莉/班尼特',
      mavuika: 'C0 / 黑曜秘典4（按武器微调双暴）',
      xilonen: 'C0 苍古R1 + 千岩4',
      citlali: 'C0 祭星R1 + 绘卷4',
      bennett: 'C6 原木刀R1 + 宗室4',
      baselineWeapon: '超越之匙 R1',
    },
    searchIterations: SEARCH_ITERS,
    finalIterations: FINAL_ITERS,
    generatedAt: new Date().toISOString(),
    winner: finals[0] || null,
    topFinal: finals,
    ranking,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
  console.log('\n=== WEAPON RANK (search) ===');
  ranking.forEach((r) => {
    const delta = r.vsBaseline == null ? '' : ` (${r.vsBaseline >= 0 ? '+' : ''}${r.vsBaseline})`;
    console.log(`#${r.rank} ${r.dps}${delta} | ${r.weapon} R${r.refine}`);
  });
  console.log('\nWinner final:', JSON.stringify(finals[0], null, 2));
  console.log('Wrote', OUT_JSON);
}

main();
