const ELEMENTS = ['全部', '火', '水', '风', '雷', '草', '冰', '岩'];
const QUICK = ['胡桃', '甘雨', '雷电将军', '温迪', '钟离', '纳西妲'];
const RX_FILTERS = [
  { id: 'all', name: '全部' },
  { id: 'amplifying', name: '增幅' },
  { id: 'transformative', name: '剧变' },
  { id: 'additive', name: '激化' },
  { id: 'utility', name: '机制' },
];

const state = {
  characters: [],
  filter: '全部',
  currentName: null,
  reactions: null,
  rxFilter: 'all',
  view: 'characters',
};

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

async function api(path) {
  const res = await fetch(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

function setHeroImage(src, alt) {
  const img = $('heroImg');
  const fallback = $('heroFallback');
  if (!src) {
    img.hidden = true;
    img.removeAttribute('src');
    fallback.hidden = false;
    return;
  }
  img.onload = () => {
    img.hidden = false;
    fallback.hidden = true;
  };
  img.onerror = () => {
    img.hidden = true;
    fallback.hidden = false;
  };
  img.alt = alt || '';
  img.src = src;
}

function renderQuick() {
  const box = $('quickTags');
  box.innerHTML = '';
  QUICK.forEach((name) => {
    const btn = el('button', 'chip', name);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      $('q').value = name;
      openCharacter(name);
    });
    box.appendChild(btn);
  });
}

function renderFilters() {
  const box = $('filters');
  box.innerHTML = '';
  ELEMENTS.forEach((name) => {
    const btn = el('button', `filter-btn${state.filter === name ? ' active' : ''}`, name);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      state.filter = name;
      renderFilters();
      renderGrid();
    });
    box.appendChild(btn);
  });
}

function renderGrid() {
  const grid = $('charGrid');
  grid.innerHTML = '';
  const list = state.characters.filter((c) =>
    state.filter === '全部' ? true : c.elementText === state.filter
  );

  list.forEach((c) => {
    const btn = el('button', 'char-card');
    btn.type = 'button';
    if (c.icon) {
      const img = el('img');
      img.src = c.icon;
      img.alt = c.name;
      img.loading = 'lazy';
      btn.appendChild(img);
    }
    btn.appendChild(el('div', 'name', c.name));
    btn.appendChild(el('div', 'sub', `${c.elementText || '—'} · ${c.weaponText || '—'}`));
    btn.addEventListener('click', () => openCharacter(c.name));
    grid.appendChild(btn);
  });
}

function renderMeta(character) {
  const meta = $('meta');
  meta.innerHTML = '';
  const items = [
    character.elementText && `元素 ${character.elementText}`,
    character.weaponText && `武器 ${character.weaponText}`,
    character.rarity && `${character.rarity} 星`,
    character.region && `地区 ${character.region}`,
    character.constellation && `命之座 ${character.constellation}`,
    character.substatText && `突破 ${character.substatText}`,
    character.birthday && `生日 ${character.birthday}`,
  ].filter(Boolean);

  items.forEach((text) => meta.appendChild(el('span', 'pill', text)));
}

function renderSkills(panelId, entries) {
  const panel = $(panelId);
  panel.innerHTML = '';
  if (!entries.length) {
    panel.appendChild(el('p', null, '暂无数据'));
    return;
  }
  entries.forEach(([label, skill], i) => {
    if (!skill) return;
    const box = el('article', 'skill');
    box.style.animationDelay = `${i * 40}ms`;
    box.appendChild(el('div', 'skill-label', label));
    box.appendChild(el('h3', null, skill.name || label));
    box.appendChild(el('p', null, skill.description || skill.descriptionRaw || '—'));
    panel.appendChild(box);
  });
}

function showDetail(payload) {
  const { character, talents, constellations } = payload;
  state.currentName = character.name;

  $('browse').hidden = true;
  $('detail').hidden = false;
  $('extra').hidden = true;

  $('detailEyebrow').textContent = character.affiliation || character.region || '角色';
  $('detailName').textContent = character.name;
  $('detailTitle').textContent = character.title || '';
  $('desc').textContent = character.description || '';
  renderMeta(character);

  const portrait = character.images?.portrait || character.images?.cover1 || character.images?.card;
  setHeroImage(portrait, character.name);

  renderSkills('panel-talents', [
    ['普通攻击', talents?.combat1],
    ['元素战技', talents?.combat2],
    ['元素爆发', talents?.combat3],
    ['固有天赋', talents?.passive1],
    ['固有天赋', talents?.passive2],
    ['固有天赋', talents?.passive3],
    ['固有天赋', talents?.passive4],
  ]);

  renderSkills('panel-constellations', [
    ['1 命', constellations?.c1],
    ['2 命', constellations?.c2],
    ['3 命', constellations?.c3],
    ['4 命', constellations?.c4],
    ['5 命', constellations?.c5],
    ['6 命', constellations?.c6],
  ]);

  switchTab('talents');
  $('detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showExtra(searchData) {
  const parts = [];
  if (searchData.weapon) {
    const w = searchData.weapon;
    parts.push(
      `<article class="extra-block"><h3>武器 · ${w.name}</h3>` +
        `<p>${w.weaponText || ''} · ${w.rarity || '?'} 星</p>` +
        `<p>${w.description || w.effectTemplateRaw || ''}</p></article>`
    );
  }
  if (searchData.artifact) {
    const a = searchData.artifact;
    parts.push(
      `<article class="extra-block"><h3>圣遗物 · ${a.name}</h3>` +
        `<p>2 件套：${a.effect2Pc || '—'}</p>` +
        `<p>4 件套：${a.effect4Pc || '—'}</p></article>`
    );
  }

  if (!parts.length) {
    $('extra').hidden = true;
    return;
  }
  $('extra').hidden = false;
  $('extraTitle').textContent = searchData.character ? '同时匹配到' : '搜索结果';
  $('extraBody').innerHTML = parts.join('');
}

async function openCharacter(name) {
  try {
    const data = await api(`/api/character?q=${encodeURIComponent(name)}`);
    showDetail(data);
  } catch (err) {
    alert(err.message);
  }
}

async function onSearch(query) {
  const q = query.trim();
  if (!q) return;

  try {
    const data = await api(`/api/search?q=${encodeURIComponent(q)}`);
    if (data.character) {
      await openCharacter(data.character.name);
      showExtra(data);
      return;
    }
    $('detail').hidden = true;
    $('browse').hidden = false;
    showExtra(data);
    if (!data.weapon && !data.artifact) {
      alert(`未找到「${q}」相关数据`);
    } else {
      $('extra').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    alert(err.message);
  }
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((btn) => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.panel').forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  $('view-characters').hidden = view !== 'characters';
  $('view-reactions').hidden = view !== 'reactions';
  $('view-dps').hidden = view !== 'dps';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDps(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Math.round(Number(n)).toLocaleString('zh-CN');
}

function renderDpsRankings(data) {
  const meta = $('dpsMeta');
  const winner = $('dpsWinner');
  const body = $('dpsTable').querySelector('tbody');
  body.innerHTML = '';

  if (!data?.ranking?.length) {
    meta.textContent = (data?.assumptions || []).join(' ') || '暂无模拟结果。请运行 npm run gcsim:run';
    winner.hidden = true;
    return;
  }

  meta.textContent = `引擎 ${data.engine} · iteration=${data.iterations} · 生成于 ${data.generatedAt || ''}`;
  if (data.winner) {
    winner.hidden = false;
    winner.innerHTML =
      `<div>当前本地重跑最高：<strong>${data.winner.name}</strong></div>` +
      `<div>队伍：${(data.winner.characters || []).join(' / ')}</div>` +
      `<div>DPS：<strong>${formatDps(data.winner.dps)}</strong>` +
      (data.winner.shareUrl ? ` · <a href="${data.winner.shareUrl}" target="_blank" rel="noreferrer">查看 Share</a>` : '') +
      `</div>`;
  } else {
    winner.hidden = true;
  }

  data.ranking.forEach((row, i) => {
    const tr = el('tr');
    tr.appendChild(el('td', null, String(i + 1)));
    tr.appendChild(el('td', null, `${row.name}\n${(row.characters || []).join(' / ')}`));
    tr.appendChild(el('td', null, row.axis || '—'));
    tr.appendChild(el('td', 'mul', formatDps(row.dps)));
    tr.appendChild(el('td', null, formatDps(row.shareDps)));
    tr.appendChild(el('td', null, row.notes || ''));
    body.appendChild(tr);
  });
}

function formatMultiplier(value) {
  if (value == null) return '无';
  return Number.isInteger(value) ? `${value}.0×` : `${value}×`;
}

function renderReactions() {
  const data = state.reactions;
  if (!data) return;

  $('reactionsNote').textContent = data.note || '';

  const quickBody = $('rxQuickTable').querySelector('tbody');
  quickBody.innerHTML = '';
  (data.quickReference || []).forEach((row) => {
    const tr = el('tr');
    tr.appendChild(el('td', null, row.name));
    const mul = el('td', 'mul', row.multiplierText);
    tr.appendChild(mul);
    tr.appendChild(el('td', null, row.type));
    quickBody.appendChild(tr);
  });

  const emGrid = $('rxEmGrid');
  emGrid.innerHTML = '';
  (data.emFormulas || []).forEach((item) => {
    const card = el('article', 'rx-card');
    card.appendChild(el('h3', null, item.name));
    card.appendChild(el('p', 'mul', item.formula));
    card.appendChild(el('p', null, `适用于：${(item.appliesTo || []).join('、')}`));
    card.appendChild(el('p', null, item.example));
    emGrid.appendChild(card);
  });

  const levelBody = $('rxLevelTable').querySelector('tbody');
  levelBody.innerHTML = '';
  const values = data.levelMultiplier?.values || {};
  Object.keys(values)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((lv) => {
      const tr = el('tr');
      tr.appendChild(el('td', null, `Lv.${lv}`));
      tr.appendChild(el('td', 'mul', String(values[lv])));
      levelBody.appendChild(tr);
    });

  const filters = $('rxFilters');
  filters.innerHTML = '';
  RX_FILTERS.forEach((f) => {
    const btn = el('button', `filter-btn${state.rxFilter === f.id ? ' active' : ''}`, f.name);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      state.rxFilter = f.id;
      renderReactions();
    });
    filters.appendChild(btn);
  });

  const list = $('rxList');
  list.innerHTML = '';
  const cats = Object.fromEntries((data.categories || []).map((c) => [c.id, c]));
  (data.reactions || [])
    .filter((r) => state.rxFilter === 'all' || r.category === state.rxFilter)
    .forEach((r) => {
      const item = el('article', 'rx-item');
      item.appendChild(el('h3', null, r.name));
      const meta = el('div', 'rx-meta');
      meta.appendChild(el('span', 'pill', cats[r.category]?.name || r.category));
      meta.appendChild(el('span', 'pill', (r.elements || []).join(' + ')));
      meta.appendChild(el('span', 'pill', r.damageType || ''));
      item.appendChild(meta);

      item.appendChild(el('p', null, r.effect || ''));
      item.appendChild(el('p', 'mul', r.formula || ''));

      if (r.trigger?.length) {
        const lines = r.trigger
          .map((t) => {
            const mul = t.multiplier == null ? '无倍率' : formatMultiplier(t.multiplier);
            const note = t.note ? `（${t.note}）` : '';
            return `${t.aura} ← ${t.trigger}：${mul}${note}`;
          })
          .join('\n');
        item.appendChild(el('p', null, lines));
      }
      list.appendChild(item);
    });
}

async function init() {
  renderQuick();
  renderFilters();

  document.querySelector('.topnav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    switchView(btn.dataset.view);
  });

  $('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    onSearch($('q').value);
  });

  $('backBtn').addEventListener('click', () => {
    $('detail').hidden = true;
    $('browse').hidden = false;
    $('extra').hidden = true;
    setHeroImage(null);
    state.currentName = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    switchTab(btn.dataset.tab);
  });

  try {
    const data = await api('/api/characters');
    state.characters = data.list || [];
    renderGrid();
  } catch (err) {
    $('charGrid').textContent = `加载角色列表失败：${err.message}`;
  }

  try {
    state.reactions = await api('/api/reactions');
    renderReactions();
  } catch (err) {
    $('rxList').textContent = `加载元素反应失败：${err.message}`;
  }

  try {
    const rankings = await api('/api/gcsim/rankings');
    renderDpsRankings(rankings);
  } catch (err) {
    $('dpsMeta').textContent = `加载 DPS 排名失败：${err.message}`;
  }

  $('shareForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('shareId').value.trim();
    if (!id) return;
    const box = $('shareResult');
    box.hidden = false;
    box.textContent = '读取中…';
    try {
      const data = await api(`/api/gcsim/share?id=${encodeURIComponent(id)}`);
      box.textContent =
        `队伍：${(data.characters || []).join(' / ')}\n` +
        `DPS：${formatDps(data.dps)} (min ${formatDps(data.dpsMin)} / max ${formatDps(data.dpsMax)})\n` +
        `时长：${data.duration ?? '—'}\n` +
        `链接：${data.url}\n\n` +
        `配置预览：\n${(data.config || '').slice(0, 1200)}`;
    } catch (err) {
      box.textContent = err.message;
    }
  });
}

init();
