const genshindb = require('./src/main.js');

genshindb.setOptions({
  queryLanguages: ['ChineseSimplified', 'English'],
  resultLanguage: 'ChineseSimplified',
});

console.log('=== 模糊搜索角色：甘雨 ===');
const ganyu = genshindb.characters('甘雨');
console.log({
  name: ganyu?.name,
  title: ganyu?.title,
  element: ganyu?.elementText,
  weapon: ganyu?.weaponText,
  rarity: ganyu?.rarity,
  birthday: ganyu?.birthday,
});

console.log('\n=== 英文模糊搜索：amb ===');
const amber = genshindb.characters('amb', { resultLanguage: 'English' });
console.log({
  name: amber?.name,
  element: amber?.elementText,
  weapon: amber?.weaponText,
});

console.log('\n=== 搜索武器：天空之刃 ===');
const weapon = genshindb.weapons('天空之刃');
console.log({
  name: weapon?.name,
  type: weapon?.weaponText ?? weapon?.type,
  rarity: weapon?.rarity,
});

console.log('\n=== 冰元素角色名（前10个）===');
const cryo = genshindb.characters('Cryo', {
  matchCategories: true,
  resultLanguage: 'ChineseSimplified',
});
console.log(Array.isArray(cryo) ? cryo.slice(0, 10) : cryo);

console.log('\n=== 角色总数 ===');
const names = genshindb.characters('names', { matchCategories: true });
console.log(Array.isArray(names) ? names.length : names);

console.log('\n跑通成功 ✅');
