// ============================================================
// NAVIGATION
// ============================================================
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.section');

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  const navEl = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeSidebar();

  // Lazy-render data-driven sections
  if (id === 'weapons-encyclopedia') renderWeapons('all', false, '', 'weaponContent');
  if (id === 'armor-encyclopedia')   renderArmor('all');
  if (id === 'meta-builds')          renderBuilds('all');
  if (id === 'content-rewards')      renderRewards('all');
  if (id === 'combat') renderWeapons('all', false, '', 'combatWeaponLines');
}

navItems.forEach(item => item.addEventListener('click', () => showSection(item.dataset.section)));

document.addEventListener('click', e => {
  const card = e.target.closest('[data-goto]');
  if (card) showSection(card.dataset.goto);
});

// Mobile sidebar
const menuToggle = document.getElementById('menuToggle');
const sidebar    = document.getElementById('sidebar');
const overlay    = document.getElementById('overlay');

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}
menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
overlay.addEventListener('click', closeSidebar);

// ============================================================
// SEARCH
// ============================================================
const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const searchIndex = [
  { title:'Getting Started',         section:'getting-started',       keywords:'beginner new player tutorial start account' },
  { title:'Destiny Board',           section:'destiny-board',         keywords:'progression skills unlock destiny board fame' },
  { title:'Gathering',               section:'gathering',             keywords:'resources ore wood fiber hide stone tiers gathering' },
  { title:'Crafting',                section:'crafting',              keywords:'craft forge armory cooking crafting quality refining' },
  { title:'Combat & Skills',         section:'combat',                keywords:'combat skills weapons armor build loadout pvp pve' },
  { title:'Open World PvE',          section:'pve',                   keywords:'pve dungeons mobs boss expedition hellgate' },
  { title:'PvP & Open World',        section:'pvp',                   keywords:'pvp ganking zone red black flagging player kill' },
  { title:'Economy & Trading',       section:'economy',               keywords:'economy market silver gold trading merchant flip' },
  { title:'Guilds & Alliances',      section:'guilds',                keywords:'guild alliance territory war gvg season' },
  { title:'Mounts & Transport',      section:'mounts',                keywords:'mount horse ox transport donkey speed carry' },
  { title:'Islands & Housing',       section:'housing',               keywords:'island house plot farming agriculture building' },
  { title:'Roads of Avalon',         section:'roads',                 keywords:'roads avalon portal hideout expedition solo' },
  { title:'Endgame',                 section:'endgame',               keywords:'endgame hce crystal league season reward hardcore' },
  { title:'Tips & Tricks',           section:'tips',                  keywords:'tips tricks advice newbie silver farming efficiency' },
  { title:'Crafting for Profit',       section:'crafting-guide',        keywords:'crafting profit return rate focus points city bonus refining margin food potions alchemy' },
  { title:'Food & Potions Guide',      section:'food-potions',          keywords:'food potions consumables pork omelette healing potion resistance energy soup what to eat drink' },
  { title:'Beginner Builds (T4-T5)',   section:'beginner-builds',       keywords:'beginner builds starter cheap t4 t5 claws bow holy staff arcane gatherer loadout new player' },
  { title:'Safe Travel Guide',         section:'safe-travel',           keywords:'travel safe route gank escape zone navigation royal road caerleon map invisibility potion' },
  { title:'Passive Income Guide',      section:'passive-income',        keywords:'passive income island strategies crop farming cooking alchemy mount breeding exotic animals' },
  { title:'Progression Roadmap',      section:'progression-roadmap',   keywords:'progression roadmap beginner week stage milestone t4 t5 t6 t7 t8 journey new player guide' },
  { title:'Fame Farming Guide',       section:'fame-farming',          keywords:'fame farming fame/hour fastest grind xp destiny board progress tomes expeditions dungeons' },
  { title:'Silver Making Guide',      section:'silver-guide',          keywords:'silver money making income profit how to make silver rich economy gathering crafting trading' },
  { title:'Island & Mount Farming',   section:'island-guide',          keywords:'island mount farm horse ox breed passive income farming animal pasture sell mounts profit' },
  { title:'All Weapons',             section:'weapons-encyclopedia',  keywords:'weapons sword axe hammer spear dagger crossbow bow fire frost nature holy arcane cursed' },
  { title:'All Armor',               section:'armor-encyclopedia',    keywords:'armor helmet boots robe jacket plate cloth leather' },
  { title:'Meta Builds',             section:'meta-builds',           keywords:'meta build loadout bloodletter claws brimstone hallowfall' },
  { title:'Content Rewards',         section:'content-rewards',       keywords:'rewards silver fame dungeon expedition hellgate hce gathering' },
];

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.innerHTML = ''; searchResults.style.display = 'none'; return; }
  const hits = searchIndex.filter(e => e.title.toLowerCase().includes(q) || e.keywords.includes(q));
  if (!hits.length) {
    searchResults.innerHTML = '<div style="padding:10px 14px;font-size:13px;color:var(--text-dim)">No results found</div>';
    searchResults.style.display = 'block'; return;
  }
  searchResults.innerHTML = hits.map(h => `<div class="search-result-item" data-section="${h.section}">${h.title}</div>`).join('');
  searchResults.style.display = 'block';
});

searchResults.addEventListener('click', e => {
  const item = e.target.closest('.search-result-item');
  if (item) { showSection(item.dataset.section); searchInput.value = ''; searchResults.style.display = 'none'; }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.topbar-search')) searchResults.style.display = 'none';
});

// ============================================================
// HELPERS
// ============================================================
function ratingDots(score, max = 5) {
  return Array.from({length: max}, (_, i) =>
    `<span class="diff-star ${i < score ? 'filled' : ''}">★</span>`
  ).join('');
}

function ratingCells(w) {
  const cats = [{label:'Solo', val:w.solo},{label:'Group', val:w.group},{label:'PvP', val:w.pvp},{label:'PvE', val:w.pve}];
  return cats.map(c => `
    <div class="rating-cell">
      <div class="rc-label">${c.label}</div>
      <div class="difficulty-stars">${ratingDots(c.val)}</div>
    </div>`).join('');
}

function roleTag(role) {
  const tags = role.split('/').map(r => {
    r = r.trim();
    const cls = r === 'DPS' ? 'wtag-dps' : r === 'Tank' ? 'wtag-tank' :
                r === 'Healer' ? 'wtag-healer' : r === 'Support' ? 'wtag-support' :
                r === 'CC' ? 'wtag-cc' : 'wtag-dps';
    return `<span class="wtag ${cls}">${r}</span>`;
  }).join('');
  return tags;
}

function typeTag(type) {
  const cls = type === 'Melee' ? 'wtag-melee' : type === 'Ranged' ? 'wtag-ranged' : 'wtag-magic';
  return `<span class="wtag ${cls}">${type}</span>`;
}

function riskClass(risk) {
  const r = risk.toLowerCase();
  if (r.includes('very high'))              return 'risk-very-high';
  if (r.includes('medium-high'))            return 'risk-high';
  if (r.includes('high'))                   return 'risk-high';
  if (r.includes('medium'))                 return 'risk-medium';
  if (r.includes('low-very high'))          return 'risk-high';
  if (r.includes('low'))                    return 'risk-low';
  return 'risk-none';
}

// ============================================================
// RENDER WEAPONS
// ============================================================
function renderWeapons(typeFilter, metaOnly, searchQ, containerId = 'weaponContent') {
  const container = document.getElementById(containerId);
  if (!container) return;
  // Don't re-render the combat panel unless filters changed
  if (containerId === 'combatWeaponLines' && container.dataset.rendered) return;
  if (containerId === 'combatWeaponLines') container.dataset.rendered = 'true';

  // Group by line
  const lines = {};
  weaponsData.forEach(w => {
    if (typeFilter !== 'all' && w.type !== typeFilter) return;
    if (metaOnly && !w.meta) return;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!w.name.toLowerCase().includes(q) && !w.line.toLowerCase().includes(q) &&
          !w.description.toLowerCase().includes(q) && !w.role.toLowerCase().includes(q)) return;
    }
    if (!lines[w.line]) lines[w.line] = { icon: w.lineIcon, type: w.type, weapons: [] };
    lines[w.line].weapons.push(w);
  });

  if (!Object.keys(lines).length) {
    container.innerHTML = '<div class="info-block"><p>No weapons match the current filter.</p></div>';
    return;
  }

  container.innerHTML = Object.entries(lines).map(([lineName, lineData]) => {
    const typeCls = 'type-' + lineData.type.toLowerCase();
    const weaponCards = lineData.weapons.map(w => `
      <div class="weapon-card ${typeCls} ${w.meta ? 'meta-weapon' : ''}">
        ${w.meta ? '<div class="meta-badge">⭐ Meta</div>' : ''}
        <div class="weapon-header">
          <div class="weapon-line-icon">${lineData.icon}</div>
          <div class="weapon-title">
            <h4>${w.name}</h4>
            <div class="weapon-line">${w.line} · ${w.role}</div>
          </div>
        </div>
        <div class="weapon-tags">
          ${typeTag(w.type)}${roleTag(w.role)}
        </div>
        <p class="weapon-description">${w.description}</p>
        <div class="weapon-key-ability">
          <div class="key-ability-label">Key Ability</div>
          <div class="key-ability-text">${w.keyAbility}</div>
        </div>
        <div class="weapon-ratings">${ratingCells(w)}</div>
        <div class="weapon-tip"><strong>Tip:</strong> ${w.tip}</div>
      </div>
    `).join('');

    return `
      <div class="line-section">
        <button class="line-header-btn" onclick="toggleLine(this)">
          <span class="line-icon">${lineData.icon}</span>
          <div class="line-info">
            <h3>${lineName}</h3>
            <p>${lineData.type} · ${lineData.weapons.length} weapons${lineData.weapons.filter(x=>x.meta).length ? ' · ' + lineData.weapons.filter(x=>x.meta).length + ' meta' : ''}</p>
          </div>
          <span class="line-count">${lineData.weapons.length}</span>
          <span class="line-chevron">▶</span>
        </button>
        <div class="line-weapons">
          ${weaponCards}
        </div>
      </div>`;
  }).join('');
}

function toggleLine(btn) {
  btn.classList.toggle('expanded');
  const grid = btn.nextElementSibling;
  grid.classList.toggle('open');
}

// Weapon filters
document.addEventListener('click', e => {
  const btn = e.target.closest('#weaponFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#weaponFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const typeFilter = btn.dataset.wfilter || 'all';
  const metaOnly   = !!btn.dataset.wmeta;
  const searchQ    = document.getElementById('weaponSearch')?.value || '';
  renderWeapons(typeFilter, metaOnly, searchQ, 'weaponContent');
});

document.addEventListener('input', e => {
  if (e.target.id === 'weaponSearch') {
    const activeBtn = document.querySelector('#weaponFilterBar .filter-btn.active');
    const typeFilter = activeBtn?.dataset.wfilter || 'all';
    const metaOnly   = !!activeBtn?.dataset.wmeta;
    renderWeapons(typeFilter, metaOnly, e.target.value, 'weaponContent');
  }
});

// ============================================================
// RENDER ARMOR
// ============================================================
function renderArmor(typeFilter) {
  const container = document.getElementById('armorContent');
  if (!container) return;

  const slotOrder  = ['Head','Chest','Boots'];
  const slotIcons  = { Head: '⛑️', Chest: '👕', Boots: '👟' };
  const typeIcons  = { Cloth: '🧣', Leather: '🥋', Plate: '🛡️' };

  container.innerHTML = slotOrder.map(slot => {
    const allForSlot = [...(armorData.helmets || []), ...(armorData.chests || []), ...(armorData.boots || [])]
      .filter(a => a.slot === slot && (typeFilter === 'all' || a.armorType === typeFilter));

    if (!allForSlot.length) return '';

    const byType = {};
    allForSlot.forEach(a => {
      if (!byType[a.armorType]) byType[a.armorType] = [];
      byType[a.armorType].push(a);
    });

    const typeSections = ['Cloth','Leather','Plate'].map(type => {
      if (!byType[type]) return '';
      const cards = byType[type].map(a => `
        <div class="armor-card ${a.meta ? 'meta-armor' : ''}">
          <div class="armor-header">
            <div class="armor-type-icon armor-type-${a.armorType.toLowerCase()}">${typeIcons[a.armorType]}</div>
            <div>
              <div class="armor-name">${a.name} ${a.meta ? '⭐' : ''}</div>
              <div class="armor-slot">${a.slot} · ${a.armorType} · ${a.role}</div>
            </div>
          </div>
          <div class="armor-ability">
            <div class="ab-label">Active Ability</div>
            <div class="ab-text">${a.ability}</div>
          </div>
          <div class="armor-passive"><strong>Passive:</strong> ${a.passive}</div>
          <div class="armor-desc">${a.description}</div>
        </div>
      `).join('');
      return `<div class="armor-type-section ats-${type.toLowerCase()}">${typeIcons[type]} ${type}</div><div class="armor-grid">${cards}</div>`;
    }).join('');

    return `
      <div class="armor-slot-section">
        <span style="font-size:20px">${slotIcons[slot]}</span>
        <h3>${slot === 'Head' ? 'Helmets' : slot === 'Chest' ? 'Chest Armor' : 'Boots'}</h3>
      </div>
      ${typeSections}`;
  }).join('');
}

document.addEventListener('click', e => {
  const btn = e.target.closest('#armorFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#armorFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderArmor(btn.dataset.afilter || 'all');
});

// ============================================================
// RENDER BUILDS
// ============================================================
function renderBuilds(tagFilter) {
  const container = document.getElementById('buildContent');
  if (!container) return;

  const filtered = tagFilter === 'all'
    ? metaBuilds
    : metaBuilds.filter(b => b.tags.includes(tagFilter));

  if (!filtered.length) {
    container.innerHTML = '<div class="info-block"><p>No builds match this filter.</p></div>';
    return;
  }

  container.innerHTML = '<div class="build-grid">' + filtered.map(b => {
    const loadoutRows = Object.entries(b.loadout).map(([slot, item]) => `
      <tr>
        <td class="loadout-slot">${slot.charAt(0).toUpperCase() + slot.slice(1)}</td>
        <td class="loadout-item">${item.name}</td>
        <td class="loadout-note">${item.note}</td>
      </tr>`).join('');

    const psSteps = b.playstyle.map((step, i) => `
      <li><div class="ps-num">${i+1}</div><span>${step}</span></li>`).join('');

    const costColor = b.cost === 'Low' ? '#70c090' : b.cost === 'Medium' ? 'var(--gold)' : b.cost.includes('Very') ? '#f05050' : '#e07070';

    return `
    <div class="build-card" id="build-${b.id}">
      <div class="build-header">
        <div class="build-accent" style="background:linear-gradient(90deg,${b.color},transparent)"></div>
        <div class="build-icon-name">
          <div class="build-icon-wrap">${b.icon}</div>
          <div>
            <div class="build-name">${b.name}</div>
            <div class="build-role">${b.role}</div>
          </div>
        </div>
        <div class="build-tags">${b.tags.map(t => `<span class="btag">${t}</span>`).join('')}</div>
        <p class="build-summary">${b.summary}</p>
      </div>
      <div class="build-body">
        <div class="build-meta-row">
          <div class="build-meta-cell">
            <div class="bmc-label">Difficulty</div>
            <div class="bmc-value">${ratingDots(b.difficulty)}</div>
          </div>
          <div class="build-meta-cell">
            <div class="bmc-label">Cost</div>
            <div class="bmc-value" style="color:${costColor}">${b.cost}</div>
          </div>
          <div class="build-meta-cell">
            <div class="bmc-label">Rewards</div>
            <div class="bmc-value" style="color:var(--gold)">See below</div>
          </div>
        </div>

        <div style="font-size:12px;color:var(--gold-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Loadout</div>
        <table class="loadout-table">${loadoutRows}</table>

        <div class="build-rewards"><strong>💰 Rewards:</strong> ${b.rewards}</div>
      </div>
      <button class="build-toggle" onclick="toggleBuild(this)">
        Full Details — Rotation &amp; Counters <span>▶</span>
      </button>
      <div class="build-expandable">
        <div style="font-size:12px;color:var(--gold-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Playstyle / Rotation</div>
        <ul class="playstyle-steps">${psSteps}</ul>
        <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <div style="font-size:11px;color:var(--accent-green);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">✅ Strengths</div>
            ${b.counters.map(c => `<div style="font-size:12px;color:var(--text-dim);padding:2px 0">▸ ${c}</div>`).join('')}
          </div>
          <div>
            <div style="font-size:11px;color:var(--accent-red);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">❌ Weaknesses</div>
            ${b.countered_by.map(c => `<div style="font-size:12px;color:var(--text-dim);padding:2px 0">▸ ${c}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';
}

function toggleBuild(btn) {
  const expandable = btn.nextElementSibling;
  expandable.classList.toggle('open');
  const arrow = btn.querySelector('span');
  arrow.textContent = expandable.classList.contains('open') ? '▼' : '▶';
}

document.addEventListener('click', e => {
  const btn = e.target.closest('#buildFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#buildFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBuilds(btn.dataset.bfilter || 'all');
});

// ============================================================
// RENDER REWARDS
// ============================================================
function renderRewards(riskFilter) {
  const container = document.getElementById('rewardContent');
  if (!container) return;

  const filtered = riskFilter === 'all'
    ? contentRewards
    : contentRewards.filter(r => r.risk.toLowerCase().includes(riskFilter.toLowerCase()));

  if (!filtered.length) {
    container.innerHTML = '<div class="info-block"><p>No content matches this filter.</p></div>';
    return;
  }

  container.innerHTML = '<div class="rewards-grid">' + filtered.map(r => `
    <div class="reward-card">
      <div class="reward-header">
        <div class="reward-icon">${r.icon}</div>
        <div>
          <div class="reward-name">${r.name}</div>
          <div class="reward-tier">Gear: ${r.tier}</div>
        </div>
      </div>
      <span class="risk-badge ${riskClass(r.risk)}">${r.risk} Risk</span>
      <div class="reward-stats">
        <div class="reward-stat">
          <div class="rs-label">Silver / Hour</div>
          <div class="rs-value">${r.silverHour}</div>
        </div>
        <div class="reward-stat">
          <div class="rs-label">Fame / Hour</div>
          <div class="rs-value">${r.fameHour}</div>
        </div>
      </div>
      <ul class="reward-list">
        ${r.rewards.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <div class="reward-notes">${r.notes}</div>
    </div>`
  ).join('') + '</div>';
}

document.addEventListener('click', e => {
  const btn = e.target.closest('#rewardFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#rewardFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRewards(btn.dataset.rfilter || 'all');
});

// ============================================================
// PROGRESS BAR ANIMATION
// ============================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-fill');
      if (fill && fill.dataset.width) fill.style.width = fill.dataset.width;
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar').forEach(bar => observer.observe(bar));

// ============================================================
// INIT
// ============================================================
showSection('home');
