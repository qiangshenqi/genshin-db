#!/usr/bin/env node
/**
 * Thin CLI over TwiceDrop/genshin_artifact team-DPS engine.
 *
 * Usage:
 *   node tools/mona-dps/run-preset.mjs list
 *   node tools/mona-dps/run-preset.mjs mitya
 *   node tools/mona-dps/run-preset.mjs vesna
 *   node tools/mona-dps/run-preset.mjs vesna-burst
 *
 * GUI: tools/mona-artifact-app/genshin_artifact_V7.2.06.04_tauri_x64.exe
 * Source: tools/genshin-artifact
 *
 * Note: 洛恩(Lohen) is NOT implemented in this calculator (assets only).
 */
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../genshin-artifact');
const toUrl = (rel) => pathToFileURL(path.join(root, rel)).href;

const {createTeamDpsEvaluator} = await import(toUrl('beta-data/team-dps-evaluator.mjs'));
const {api} = await import(toUrl('beta-tools/runtime-team-dps-graph.mjs'));
const {mityaInput, action: ma, end: mend} = await import(toUrl('tests/helpers/team-mitya-fixture.mjs'));
const {vesnaInput, vesnaFullInput, action: va, switchTo} = await import(toUrl('tests/helpers/team-vesna-fixture.mjs'));

const presets = {
  mitya: {
    title: '米提亚/瓦列里 默认探针轴（C0）',
    build: () => mityaInput(
      ['Mitya', 'Valeriy', 'Odette', 'YaeMiko'],
      [ma('e', 0, 'skill.hold', 0), ma('q', 0, 'burst', 0.6), ma('ca', 0, 'charged', 3), mend(6.5)],
    ),
  },
  'mitya-full': {
    title: '米提亚队 约18.3秒示意轴（空装探针，仅验证引擎）',
    build: () => mityaInput(
      ['Mitya', 'Valeriy', 'Odette', 'YaeMiko'],
      [
        ma('yae1', 3, 'skill', 0),
        ma('yae2', 3, 'skill', 0.7),
        ma('yae3', 3, 'skill', 1.4),
        ma('od1', 2, 'skill', 2.0),
        ma('od2', 2, 'skill', 2.7),
        ma('ve', 1, 'skill', 3.6),
        ma('vq', 1, 'burst', 4.2),
        ma('vca', 1, 'charged', 4.9),
        ma('me', 0, 'skill.hold', 5.6),
        ma('mq', 0, 'burst', 6.3),
        ma('mca', 0, 'charged', 8.0, {holdMs: 2000}),
        mend(18.3),
      ],
    ),
  },
  vesna: {
    title: '薇斯纳核心轴（上游 lifecycle fixture，珐露珊 C0）',
    build: () => vesnaInput(
      [
        va('e', 0, 'skill', 0),
        va('e1', 0, 'skill', 0.7),
        va('e2', 0, 'skill', 1.3),
        va('q', 0, 'burst', 2),
        va('e3', 0, 'skill', 4.2),
        va('n1', 0, 'normal.1', 5.6),
        va('n2', 0, 'normal.2', 6),
        va('n3', 0, 'normal.3', 6.5),
        va('ca', 0, 'charged', 7.2),
        va('e4', 0, 'skill', 8.6),
        switchTo('end', 0, 10),
      ],
      [0, 0, 0, 0],
    ),
  },
  'vesna-full': {
    title: '薇斯纳队·19秒完整轴（上游 full fixture；请用 GUI 配装看正式 DPS）',
    build: () => vesnaFullInput(false),
  },
  'vesna-burst': {
    title: '薇斯纳队·奥黛塔开大·20.5秒（上游 full fixture）',
    build: () => vesnaFullInput(true),
  },
};

function summarize(result, input) {
  const durationSec = Number(result.duration) || ((input.team_dps.axis.timeline.at(-1)?.timeMs ?? 0) / 1000);
  const names = input.single_interfaces.map((p) => p.character.name || p.character);
  const rows = (result.character_damage || []).map((row, i) => ({
    name: names[i],
    expectation: row?.expectation,
  }));
  // Prefer engine-reported totals; if numerically exploded (empty-gear Faruzan etc.),
  // fall back to summing only sane per-character rows.
  const sane = (n) => Number.isFinite(n) && Math.abs(n) < 1e12;
  let expectation = result.expectation;
  let dps = result.dps;
  if (!sane(expectation)) {
    expectation = rows.filter((r) => sane(r.expectation)).reduce((a, r) => a + r.expectation, 0);
    dps = durationSec > 0 ? expectation / durationSec : expectation;
  }
  return {durationSec, expectation, dps, rows, saneTotal: sane(result.expectation)};
}

const cmd = process.argv[2] || 'list';
if (cmd === 'list' || cmd === '-h' || cmd === '--help') {
  console.log('可用预设:');
  for (const [k, v] of Object.entries(presets)) console.log(`  ${k.padEnd(14)} ${v.title}`);
  console.log('\n洛恩(Lohen)：该计算器未实现公式/动作轴（仅有立绘）。');
  console.log('GUI：tools/mona-artifact-app/genshin_artifact_V7.2.06.04_tauri_x64.exe');
  console.log('源码：tools/genshin-artifact');
  process.exit(0);
}

const preset = presets[cmd];
if (!preset) {
  console.error(`未知预设: ${cmd}`);
  process.exit(1);
}

const input = preset.build();
const evaluator = createTeamDpsEvaluator(api, input);
const result = evaluator.evaluate(input.single_interfaces.map((p) => p.artifacts), true);
const s = summarize(result, input);

console.log(`# ${preset.title}`);
console.log(`时长: ${s.durationSec.toFixed(2)} s`);
console.log(`期望伤害: ${s.expectation.toFixed(1)}${s.saneTotal ? '' : '  (已过滤异常队友数值)'}`);
console.log(`期望 DPS: ${s.dps.toFixed(1)}`);
console.log('分角色期望伤害:');
for (const row of s.rows) {
  const ok = Number.isFinite(row.expectation) && Math.abs(row.expectation) < 1e12;
  const text = ok ? row.expectation.toFixed(1) : 'N/A (数值异常，请用 GUI 配装)';
  console.log(`  ${String(row.name).padEnd(12)} ${text}`);
}
