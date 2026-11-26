/**
 * 启发式四人队伍打分（非帧级模拟）
 * 核心改动：按「主输出轴」计分，而不是把所有反应倍率简单相加。
 */
const fs = require('fs');
const path = require('path');
const genshindb = require('../src/main.js');

genshindb.setOptions({
  queryLanguages: ['ChineseSimplified', 'English'],
  resultLanguage: 'ChineseSimplified',
});

const SKIP = new Set(['空', '荧', '奇偶·男性', '奇偶·女性', '阿罗夏']);

const CARRY_BIAS = {
  胡桃: 26, 那维莱特: 28, 玛薇卡: 30, 阿蕾奇诺: 27, 雷电将军: 18,
  艾尔海森: 22, 克洛琳德: 24, 丝柯克: 26, 甘雨: 20, 宵宫: 18,
  赛诺: 16, 提纳里: 17, 林尼: 18, 娜维娅: 17, 瓦雷莎: 22,
  基尼奇: 20, 玛拉妮: 19, 恰斯卡: 18, 梦见月瑞希: 14, 茜特菈莉: 12,
  芙宁娜: 16, 夜兰: 15, 行秋: 12, 香菱: 14, 班尼特: 10,
  纳西妲: 18, 钟离: 8, 温迪: 8, 枫原万叶: 14, 闲云: 10,
  希诺宁: 12, 艾梅莉埃: 15, 爱可菲: 12, 菲林斯: 16, 菈乌玛: 14,
  哥伦比娅: 20, 妮露: 14, 迪希雅: 10, 希格雯: 12,
};

function textBoost(text) {
  if (!text) return 0;
  let s = 0;
  const rules = [
    [/伤害提高|造成的伤害提升|伤害加成|伤害增加/g, 2.4],
    [/暴击率/g, 1.8],
    [/暴击伤害/g, 2.1],
    [/攻击力提高|攻击力提升/g, 1.6],
    [/生命值上限/g, 1.4],
    [/元素精通/g, 1.5],
    [/抗性降低|防御力降低|无视防御/g, 2.8],
    [/蒸发|融化|绽放|超绽放|烈绽放|感电|激化|超激化|蔓激化/g, 2.2],
  ];
  for (const [re, w] of rules) {
    const m = text.match(re);
    if (m) s += m.length * w;
  }
  return s;
}

function buildRoster() {
  const names = genshindb.characters('names', { matchCategories: true }) || [];
  const roster = [];
  for (const name of names) {
    const c = genshindb.characters(name);
    if (!c || SKIP.has(c.name) || !c.elementText || c.elementText === '无') continue;

    const talents = genshindb.talents(c.name) || {};
    const cons = genshindb.constellations(c.name) || {};
    const talentText = ['combat1', 'combat2', 'combat3', 'passive1', 'passive2', 'passive3']
      .map((k) => talents[k]?.description || '')
      .join('\n');
    const consText = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
      .map((k) => cons[k]?.description || '')
      .join('\n');

    const personal =
      (c.rarity === 5 ? 16 : 9) +
      textBoost(talentText) * 0.45 +
      textBoost(consText) * 0.65 +
      (CARRY_BIAS[c.name] || 0);

    roster.push({
      name: c.name,
      element: c.elementText,
      rarity: c.rarity,
      weapon: c.weaponText,
      personal: Math.round(personal * 10) / 10,
    });
  }
  return roster;
}

function countMap(els) {
  const c = {};
  for (const e of els) c[e] = (c[e] || 0) + 1;
  return c;
}

function resonance(els) {
  const c = countMap(els);
  const unique = Object.keys(c);
  const list = [];
  let score = 0;
  if ((c['火'] || 0) >= 2) { list.push('双火：攻击力+25%'); score += 30; }
  if ((c['水'] || 0) >= 2) { list.push('双水：生命值上限+25%'); score += 26; }
  if ((c['冰'] || 0) >= 2) { list.push('双冰：暴击率+15%（对冰附着/冻结）'); score += 24; }
  if ((c['雷'] || 0) >= 2) { list.push('双雷：充能循环'); score += 12; }
  if ((c['草'] || 0) >= 2) { list.push('双草：精通提升'); score += 18; }
  if ((c['岩'] || 0) >= 2) { list.push('双岩：护盾与增伤'); score += 16; }
  if ((c['风'] || 0) >= 2) { list.push('双风：冷却与体力'); score += 8; }
  if (unique.length >= 4) { list.push('四元素：全抗性+15%'); score += 8; }
  return { list, score };
}

/**
 * 只取一条「主输出轴」分数，避免草水雷火把所有反应叠满刷分
 */
function bestDamageAxis(members) {
  const els = members.map((m) => m.element);
  const c = countMap(els);
  const has = (e) => (c[e] || 0) > 0;
  const n = (e) => c[e] || 0;
  const names = new Set(members.map((m) => m.name));
  const byEl = (e) => members.filter((m) => m.element === e).sort((a, b) => b.personal - a.personal);

  const axes = [];

  if (has('火') && has('水')) {
    const pyro = byEl('火')[0];
    const hydroCands = byEl('水').filter((m) => m.name !== '妮露'); // 妮露更偏绽放
    const hydro = hydroCands[0] || byEl('水')[0];
    let score = 100; // 蒸发轴基础（最高可达 2.0×）
    score += n('火') >= 2 ? 28 : 0; // 双火共鸣与挂火
    score += hydroCands.length >= 2 ? 12 : n('水') >= 2 ? 4 : 0;
    score += has('风') ? 14 : 0; // 扩散减抗/聚怪
    score += has('岩') ? 6 : 0;
    score += (pyro?.personal || 0) * 0.55 + (hydro?.personal || 0) * 0.25;
    if (names.has('胡桃') || names.has('玛薇卡') || names.has('阿蕾奇诺') || names.has('香菱')) score += 12;
    if (names.has('夜兰') || names.has('行秋') || names.has('芙宁娜') || names.has('哥伦比娅') || names.has('那维莱特')) score += 10;
    if (names.has('妮露') && !has('草')) score -= 18; // 无草时妮露蒸发队不适配
    axes.push({
      name: '蒸发',
      mult: '最高 2.0×',
      score,
      detail: '火/水增幅，吃双火攻击共鸣时上限更高',
      preferredOnField: pyro?.name,
    });
  }

  if (has('火') && has('冰')) {
    const pyro = byEl('火')[0];
    const cryo = byEl('冰')[0];
    let score = 98;
    score += n('火') >= 2 ? 26 : 0;
    score += n('冰') >= 2 ? 22 : 0; // 双冰暴击
    score += has('风') ? 14 : 0;
    score += (Math.max(pyro?.personal || 0, cryo?.personal || 0)) * 0.55;
    if (names.has('玛薇卡') || names.has('甘雨') || names.has('丝柯克') || names.has('茜特菈莉')) score += 12;
    axes.push({
      name: '融化',
      mult: '最高 2.0×',
      score,
      detail: '火/冰增幅；火打冰 2.0×，冰打火 1.5×',
      preferredOnField: (pyro?.personal || 0) >= (cryo?.personal || 0) ? pyro?.name : cryo?.name,
    });
  }

  if (has('草') && has('水') && has('雷')) {
    const core = [...byEl('草'), ...byEl('雷'), ...byEl('水')].sort((a, b) => b.personal - a.personal);
    let score = 96; // 超绽放 3.0× 剧变
    score += n('草') >= 2 ? 16 : 0;
    score += has('风') ? 8 : 0;
    score += (core[0]?.personal || 0) * 0.4 + (core[1]?.personal || 0) * 0.2;
    if (names.has('纳西妲') || names.has('菈乌玛') || names.has('艾尔海森')) score += 10;
    if (names.has('雷电将军') || names.has('久岐忍') || names.has('菲林斯') || names.has('克洛琳德')) score += 10;
    if (names.has('妮露')) score += 14;
    axes.push({
      name: '超绽放',
      mult: '3.0× 等级系数',
      score,
      detail: '草水产核，雷触发；精通队上限高',
      preferredOnField: byEl('雷')[0]?.name || core[0]?.name,
    });
  }

  if (has('草') && has('水') && has('火') && !has('雷')) {
    let score = 88;
    score += n('草') >= 2 ? 12 : 0;
    score += (byEl('火')[0]?.personal || 0) * 0.35 + (byEl('草')[0]?.personal || 0) * 0.3;
    axes.push({ name: '烈绽放', mult: '3.0× 等级系数', score, detail: '草水产核，火触发' });
  }

  if (has('草') && has('雷')) {
    let score = 86;
    score += n('草') >= 2 ? 14 : 0;
    score += n('雷') >= 2 ? 10 : 0;
    score += has('风') ? 10 : 0;
    score += (byEl('雷')[0]?.personal || 0) * 0.45 + (byEl('草')[0]?.personal || 0) * 0.3;
    if (names.has('克洛琳德') || names.has('赛诺') || names.has('艾尔海森') || names.has('提纳里')) score += 12;
    axes.push({ name: '激化', mult: '附加 1.15~1.25×', score, detail: '原激化后接超激化/蔓激化' });
  }

  if (has('水') && has('雷') && !has('草')) {
    let score = 70;
    score += n('水') >= 2 ? 12 : 0;
    score += has('风') ? 12 : 0;
    score += (byEl('水')[0]?.personal || 0) * 0.45;
    if (names.has('那维莱特') || names.has('芙宁娜')) score += 14;
    axes.push({ name: '感电/纯水', mult: '感电 1.2× 或直伤', score, detail: '直伤主C也可不依赖高倍率反应' });
  }

  if (!axes.length) {
    const top = [...members].sort((a, b) => b.personal - a.personal)[0];
    axes.push({ name: '直伤', mult: '无高倍反应', score: 40 + (top?.personal || 0) * 0.4, detail: '缺少增幅/高倍剧变轴' });
  }

  axes.sort((a, b) => b.score - a.score);
  return axes[0];
}

function scoreTeam(members) {
  const els = members.map((m) => m.element);
  const reso = resonance(els);
  const axis = bestDamageAxis(members);
  const sorted = [...members].sort((a, b) => b.personal - a.personal);
  const onFieldName = axis.preferredOnField || sorted[0].name;
  const onField = members.find((m) => m.name === onFieldName) || sorted[0];
  const personalSum = members.reduce((s, m) => s + m.personal, 0);

  // 队伍完整度：高低搭配，避免四辅助或四主C同质
  const spread = sorted[0].personal - sorted[3].personal;
  const balance = spread > 5 && spread < 55 ? 8 : 0;

  const total =
    axis.score * 1.0 +
    reso.score * 0.85 +
    personalSum * 0.22 +
    onField.personal * 0.18 +
    balance;

  return {
    members: members.map((m) => `${m.name}(${m.element})`),
    names: members.map((m) => m.name),
    elements: els,
    onField: onField.name,
    axis: axis.name,
    axisMult: axis.mult,
    axisDetail: axis.detail,
    total: Math.round(total * 10) / 10,
    breakdown: {
      axis: Math.round(axis.score * 10) / 10,
      resonance: reso.score,
      personal: Math.round(personalSum * 10) / 10,
      onField: onField.personal,
    },
    resonance: reso.list,
  };
}

function optimize(roster, topN = 20) {
  const pool = [...roster].sort((a, b) => b.personal - a.personal).slice(0, 42);
  const results = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      for (let k = j + 1; k < pool.length; k++) {
        for (let l = k + 1; l < pool.length; l++) {
          const team = [pool[i], pool[j], pool[k], pool[l]];
          if (new Set(team.map((m) => m.element)).size < 2) continue;
          results.push(scoreTeam(team));
        }
      }
    }
  }
  results.sort((a, b) => b.total - a.total);

  // 按主轴+元素构成去重，保留多样结果
  const seenTeam = new Set();
  const seenAxisSig = new Map();
  const unique = [];
  for (const r of results) {
    const key = [...r.names].sort().join('|');
    if (seenTeam.has(key)) continue;
    seenTeam.add(key);
    const sig = `${r.axis}|${[...r.elements].sort().join(',')}`;
    const n = seenAxisSig.get(sig) || 0;
    if (n >= 3) continue; // 同轴同元素结构最多 3 队
    seenAxisSig.set(sig, n + 1);
    unique.push(r);
    if (unique.length >= topN) break;
  }
  return { poolSize: pool.length, combos: results.length, top: unique, absoluteTop: results[0] };
}

function main() {
  const roster = buildRoster();
  const { poolSize, combos, top, absoluteTop } = optimize(roster, 20);
  const out = {
    assumptions: [
      '这不是 gcsim 级帧模拟，结论是「机制可达上限」启发式估计。',
      '默认倾向吃满命座文本增伤词；未代入具体武器/圣遗物面板。',
      '按主输出轴计分：蒸发/融化/超绽放/烈绽放/激化等只取最优一条。',
      '元素共鸣按双火/双水/双冰等常规效果计分。',
      `从 ${roster.length} 名角色中取个人分前 ${poolSize} 做组合，共评估 ${combos} 队。`,
    ],
    generatedAt: new Date().toISOString(),
    winner: absoluteTop,
    top,
  };
  const outPath = path.join(__dirname, '../web/data/team-rankings.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(JSON.stringify({ winner: absoluteTop, top: top.slice(0, 10) }, null, 2));
  console.log('written', outPath);
}

main();
