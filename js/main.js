// ============================================================
// NAVIGATION
// ============================================================
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.section');

// Map each section ID → which nav group contains it
const sectionGroupMap = {
  'getting-started':      'ng-beginner',
  'beginner-builds':      'ng-beginner',
  'safe-travel':          'ng-beginner',
  'food-potions':         'ng-beginner',
  'destiny-board':        'ng-beginner',
  'combat':               'ng-combat',
  'weapons-encyclopedia': 'ng-combat',
  'armor-encyclopedia':   'ng-combat',
  'meta-builds':          'ng-combat',
  'silver-guide':         'ng-economy',
  'fame-farming':         'ng-economy',
  'economy':              'ng-economy',
  'crafting-guide':       'ng-economy',
  'crafting':             'ng-economy',
  'passive-income':       'ng-economy',
  'island-guide':         'ng-economy',
  'gathering':            'ng-world',
  'pve':                  'ng-world',
  'pvp':                  'ng-world',
  'roads':                'ng-world',
  'mounts':               'ng-world',
  'guilds':               'ng-endgame',
  'housing':              'ng-endgame',
  'endgame':              'ng-endgame',
  'content-rewards':      'ng-endgame',
  'tips':                 'ng-endgame',
};

function toggleNavGroup(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const isOpen = group.classList.contains('open');
  // Close all groups
  document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
  // Open the clicked one if it was closed
  if (!isOpen) group.classList.add('open');
}

function openGroupForSection(sectionId) {
  const groupId = sectionGroupMap[sectionId];
  if (!groupId) return;
  document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
  const group = document.getElementById(groupId);
  if (group) group.classList.add('open');
}

const _pageTitles = {
  'home':                 'Albion Online Complete Guide 2025',
  'getting-started':      'Getting Started — Albion Online Guide',
  'destiny-board':        'Destiny Board Guide — Albion Online',
  'gathering':            'Gathering Guide — Albion Online',
  'crafting':             'Crafting Guide — Albion Online',
  'combat':               'Combat & Weapons — Albion Online Guide',
  'pve':                  'PvE & Dungeons — Albion Online Guide',
  'pvp':                  'PvP Guide — Albion Online',
  'economy':              'Economy & Trading — Albion Online Guide',
  'mounts':               'Mounts Guide — Albion Online',
  'housing':              'Island & Housing — Albion Online Guide',
  'guilds':               'Guilds & Alliances — Albion Online Guide',
  'roads':                'Roads of Avalon Guide — Albion Online',
  'endgame':              'Endgame Guide — Albion Online',
  'tips':                 'Tips & Tricks — Albion Online Guide',
  'weapons-encyclopedia': 'All Weapons (84) — Albion Online Guide',
  'armor-encyclopedia':   'All Armor Pieces — Albion Online Guide',
  'meta-builds':          'Best Builds — Radiant Wilds · 96 Builds',
  'content-rewards':      'Content Rewards & Silver/Hour — Albion Online',
  'progression-roadmap':  'Progression Roadmap — Albion Online Guide',
  'fame-farming':         'Fame Farming Guide — Albion Online',
  'silver-guide':         'How to Make Silver — Albion Online Guide',
  'island-guide':         'Island & Mount Farming — Albion Online Guide',
  'crafting-guide':       'Crafting for Profit — Albion Online Guide',
  'food-potions':         'Food & Potions Guide — Albion Online',
  'beginner-builds':      'Beginner Builds (T4-T5) — Albion Online',
  'safe-travel':          'Safe Travel Guide — Albion Online',
  'passive-income':       'Passive Income Guide — Albion Online',
  'character-builder':    'Character Builder — Build Your Loadout | Albion Online Guide',
};

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  // Dynamic page title for SEO
  document.title = _pageTitles[id] || 'Albion Online Complete Guide 2025';
  // Mark active in nav (may appear in multiple places — mark all)
  document.querySelectorAll(`.nav-item[data-section="${id}"]`).forEach(el => el.classList.add('active'));
  // Auto-open the group that contains this section
  openGroupForSection(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeSidebar();

  // Lazy-render data-driven sections
  if (id === 'home')                 initHomePage();
  if (id === 'character-builder')   renderCharacterBuilder();
  if (id === 'weapons-encyclopedia') renderWeapons('all', false, '', 'weaponContent');
  if (id === 'armor-encyclopedia')   renderArmor('all');
  if (id === 'meta-builds')          renderBuilds('all');
  if (id === 'content-rewards')      renderRewards('all');
  if (id === 'combat')               renderWeapons('all', false, '', 'combatWeaponLines');
  if (id === 'crafting-guide')       renderCraftingGuide();
  // Inject images into static HTML sections after they become visible
  if (id === 'beginner-builds') injectStaticBuildImages('beginner-builds');
}

// Inject item images into static HTML loadout tables (beginner builds)
function injectStaticBuildImages(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || section.dataset.imgsInjected) return;
  section.dataset.imgsInjected = 'true';
  _buildImgMap();
  section.querySelectorAll('.tier-table tbody tr').forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) return;
    const itemCell = cells[1];
    const text = itemCell.textContent.trim();
    const rid = _buildImgCache[text.toLowerCase()];
    if (!rid) return;
    const img = document.createElement('img');
    img.src = itemImg(rid, 48);
    img.className = 'loadout-img';
    img.alt = text;
    img.onerror = () => img.style.display = 'none';
    itemCell.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'loadout-img-cell';
    wrap.appendChild(img);
    wrap.appendChild(document.createTextNode(text));
    itemCell.appendChild(wrap);
  });
}

navItems.forEach(item => item.addEventListener('click', () => showSection(item.dataset.section)));

document.addEventListener('click', e => {
  const card = e.target.closest('[data-goto]');
  if (card) showSection(card.dataset.goto);
});

// Legacy sidebar refs — sidebar is hidden in new layout but kept in DOM
// overlay element was removed in redesign; guard all references
const menuToggle = document.getElementById('menuToggle');
const sidebar    = document.getElementById('sidebar');
const overlay    = document.getElementById('overlay'); // null in new layout — OK

function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('open');
}
menuToggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open');
});
overlay?.addEventListener('click', closeSidebar);

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
  { title:'Character Builder',         section:'character-builder',     keywords:'character builder loadout gear slots weapon armor cost hp stats build planner' },
  { title:'Builds',                   section:'meta-builds',           keywords:'meta build loadout bloodletter claws brimstone hallowfall frost sword crossbow nature spear weapon armor filter' },
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
    const weaponCards = lineData.weapons.map(w => {
      const renderId = weaponRenderIds[w.id];
      // Emoji always visible; image overlays and hides on error
      const imgHtml = `
        <div class="weapon-icon-wrap">
          <div class="weapon-line-icon" style="font-size:28px;width:80px;height:80px">${lineData.icon}</div>
          ${renderId ? `<img class="weapon-render-img${w.meta ? ' meta' : ''}" src="${itemImg(renderId, 96)}" alt="${w.name}" onerror="this.style.display='none'" />` : ''}
        </div>`;
      return `
      <div class="weapon-card ${typeCls} ${w.meta ? 'meta-weapon' : ''}">
        ${w.meta ? '<div class="meta-badge">⭐ Meta</div>' : ''}
        <div class="weapon-card-inner">
          ${imgHtml}
          <div class="weapon-card-body">
            <div class="weapon-title" style="margin-bottom:6px">
              <h4>${w.name}</h4>
              <div class="weapon-line">${w.line} · ${w.role}</div>
            </div>
            <div class="weapon-tags">${typeTag(w.type)}${roleTag(w.role)}</div>
          </div>
        </div>
        <p class="weapon-description" style="margin-top:10px">${w.description}</p>
        <div class="weapon-key-ability">
          <div class="key-ability-label">Key Ability</div>
          <div class="key-ability-text">${w.keyAbility}</div>
        </div>
        <div class="weapon-ratings">${ratingCells(w)}</div>
        <div class="weapon-tip"><strong>Tip:</strong> ${w.tip}</div>
      </div>`;
    }).join('');

    // Line header: emoji base + real image overlay
    const firstRid = weaponRenderIds[lineData.weapons[0]?.id];
    const lineHeaderIcon = `
      <div style="position:relative;width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <span class="line-icon" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:18px">${lineData.icon}</span>
        ${firstRid ? `<img src="${itemImg(firstRid, 48)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.5))" onerror="this.style.display='none'" />` : ''}
      </div>`;

    return `
      <div class="line-section">
        <button class="line-header-btn" onclick="toggleLine(this)">
          ${lineHeaderIcon}
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
      const cards = byType[type].map(a => {
        const renderId = armorRenderIds[a.id];
        // Always show the emoji icon; image overlays it and hides on error
        const imgHtml = `
          <div class="armor-icon-wrap">
            <div class="armor-type-icon armor-type-${a.armorType.toLowerCase()}" style="font-size:20px">${typeIcons[a.armorType]}</div>
            ${renderId ? `<img class="armor-render-img${a.meta ? ' meta' : ''}" src="${itemImg(renderId, 80)}" alt="${a.name}" onerror="this.style.display='none'" />` : ''}
          </div>`;
        return `
        <div class="armor-card ${a.meta ? 'meta-armor' : ''}">
          <div class="armor-card-inner">
            ${imgHtml}
            <div class="armor-card-body">
              <div class="armor-name">${a.name} ${a.meta ? '⭐' : ''}</div>
              <div class="armor-slot">${a.slot} · ${a.armorType} · ${a.role}</div>
            </div>
          </div>
          <div class="armor-ability" style="margin-top:10px">
            <div class="ab-label">Active Ability</div>
            <div class="ab-text">${a.ability}</div>
          </div>
          <div class="armor-passive"><strong>Passive:</strong> ${a.passive}</div>
          <div class="armor-desc">${a.description}</div>
        </div>`;
      }).join('');
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
// BUILD ITEM IMAGE LOOKUP
// ============================================================
// Flat name → renderId map built from weaponRenderIds + armorRenderIds
const _buildImgCache = {};
// Normalise an item name for cache lookup:
// strip apostrophes, tier suffixes, trailing whitespace
function _normName(name) {
  return name.toLowerCase()
    .replace(/'/g, '')                        // "assassin's" → "assassins"
    .replace(/\s*\(t[0-9][^)]*\)/gi, '')     // strip "(T6+)" "(T8)" etc
    .replace(/\s+/g, ' ')
    .trim();
}

function _buildImgMap() {
  if (Object.keys(_buildImgCache).length) return;
  weaponsData.forEach(w => {
    const rid = weaponRenderIds[w.id];
    if (rid) _buildImgCache[_normName(w.name)] = rid;
  });
  [...(armorData.helmets||[]), ...(armorData.chests||[]), ...(armorData.boots||[])].forEach(a => {
    const rid = armorRenderIds[a.id];
    if (rid) _buildImgCache[_normName(a.name)] = rid;
  });
}

function loadoutImg(itemName) {
  _buildImgMap();
  const rid = _buildImgCache[_normName(itemName)];
  if (!rid) return '';
  return `<img class="loadout-img" src="${itemImg(rid, 48)}" alt="${itemName}" onerror="this.style.display='none'" />`;
}

// Direct render ID lookup — use this instead of parsing HTML strings
function getRid(itemName) {
  _buildImgMap();
  return _buildImgCache[_normName(itemName)] || null;
}

// Active build filter + sort + view state
const _buildFilters = { role: 'all', weapon: 'all', armor: 'all' };
let _buildSort = 'popular'; // popular | success | cheapest | easiest | tier
let _buildView = 'cards';   // cards | tier

function setBuildView(view) {
  _buildView = view;
  document.getElementById('viewCards')?.classList.toggle('active', view === 'cards');
  document.getElementById('viewTier')?.classList.toggle('active',  view === 'tier');
  renderBuilds();
}

// Scroll to a build card accounting for the sticky filter bar height
function scrollToBuildCard(buildId) {
  const el = document.getElementById('build-' + buildId);
  if (!el) return;
  el.classList.add('expanded');
  // Measure sticky bar + topnav to get the real offset
  const stickyBar = document.querySelector('.builds-sticky-filters');
  const topNav    = document.querySelector('.topnav');
  const offset    = (stickyBar ? stickyBar.offsetHeight : 0) +
                    (topNav    ? topNav.offsetHeight    : 60) + 20;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

// Navigate from tier list → card view and open the specific build
function _goToBuild(buildId) {
  if (_buildView !== 'cards') {
    _buildView = 'cards';
    document.getElementById('viewCards')?.classList.add('active');
    document.getElementById('viewTier')?.classList.remove('active');
  }
  // Reset filters so the target build is visible
  _buildFilters.role   = 'all';
  _buildFilters.weapon = 'all';
  _buildFilters.armor  = 'all';
  syncBuildFilterUI();
  renderBuilds();
  // Wait for render then scroll
  setTimeout(() => scrollToBuildCard(buildId), 700);
}

const _costOrder = { 'Low':0, 'Low-Medium':1, 'Medium':2, 'High':3, 'Very High':4 };

function setBuildSort(sort) {
  _buildSort = sort;
  document.querySelectorAll('#buildSortBar .sort-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.bsort === sort));
  renderBuilds();
}

function _sortBuilds(arr) {
  const copy = [...arr];
  switch (_buildSort) {
    case 'popular':  return copy.sort((a,b) => (b.popularity||0) - (a.popularity||0));
    case 'success':  return copy.sort((a,b) => (b.successRate||0) - (a.successRate||0));
    case 'cheapest': return copy.sort((a,b) => (_costOrder[a.cost]||99) - (_costOrder[b.cost]||99));
    case 'easiest':  return copy.sort((a,b) => (a.difficulty||5) - (b.difficulty||5));
    case 'tier': {
      const t = {S:0,A:1,B:2,C:3};
      return copy.sort((a,b) => (t[a.metaTier]||9) - (t[b.metaTier]||9));
    }
    default: return copy;
  }
}

function setBuildFilter(role = 'all', weapon = 'all', armor = 'all') {
  _buildFilters.role   = role;
  _buildFilters.weapon = weapon;
  _buildFilters.armor  = armor;
  syncBuildFilterUI();
  renderBuilds();
}

// Sync the visible filter button active states to match _buildFilters
function syncBuildFilterUI() {
  document.querySelectorAll('#buildFilterBar .filter-btn').forEach(b =>
    b.classList.toggle('active', (b.dataset.bfilter || 'all') === _buildFilters.role));
  document.querySelectorAll('#weaponLineFilterBar .wl-filter-btn').forEach(b =>
    b.classList.toggle('active', (b.dataset.wlfilter || 'all') === _buildFilters.weapon));
  document.querySelectorAll('#armorTypeFilterBar .filter-btn').forEach(b =>
    b.classList.toggle('active', (b.dataset.atfilter || 'all') === _buildFilters.armor));
  document.querySelectorAll('#buildSortBar .sort-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.bsort === _buildSort));
}

// ============================================================
// RENDER BUILDS
// ============================================================
function renderTierListView(builds) {
  const tiers = ['S','A','B','C','D'];
  const tc = { S:'#e8c96a', A:'#4a9c6e', B:'#4a7fc1', C:'#7a8098', D:'#8a5050' };
  const td = { S:'Meta-defining', A:'Widely strong', B:'Solid situationally', C:'Niche / outclassed', D:'Fun, off-meta' };

  const rows = tiers.map(tier => {
    const group = builds.filter(b => b.metaTier === tier);
    if (!group.length) return '';
    const cards = group.map(b => {
      const wRid = b.loadout?.weapon ? getRid(b.loadout.weapon.name) : null;
      const costColor = b.cost==='Low'?'#70c090':b.cost==='Medium'?'var(--gold)':(b.cost||'').includes('Very')?'#f05050':'#e07070';
      return `
        <div class="tl-card" onclick="_goToBuild('${b.id}')" title="${b.name} — click for full details">
          <div class="tl-img">
            <span class="tl-icon">${b.icon}</span>
            ${wRid ? `<img src="${itemImg(wRid,40)}" onerror="this.remove()" />` : ''}
          </div>
          <div class="tl-name">${b.name}</div>
          <div class="tl-meta">
            <span style="color:${costColor}">${b.cost}</span>
            <span class="tl-dot">·</span>
            <span>${b.weaponLine}</span>
          </div>
          <div class="tl-tags">${(b.tags||[]).slice(0,2).map(t=>`<span class="tl-tag">${t}</span>`).join('')}</div>
        </div>`;
    }).join('');

    return `
      <div class="tl-row">
        <div class="tl-tier-badge" style="background:${tc[tier]}18;border-color:${tc[tier]}40;color:${tc[tier]}">
          <div class="tl-tier-letter">${tier}</div>
          <div class="tl-tier-desc">${td[tier]}</div>
        </div>
        <div class="tl-cards">${cards}</div>
      </div>`;
  }).join('');

  return `
    <div style="margin-bottom:12px;font-size:12px;color:var(--text-dim)">
      ${builds.length} builds shown — click any to see full details
    </div>
    <div class="tier-list">${rows}</div>`;
}

function renderBuilds(tagFilter) {
  if (tagFilter && tagFilter !== 'all') _buildFilters.role = tagFilter;
  const container = document.getElementById('buildContent');
  if (!container) return;

  syncBuildFilterUI();

  const filtered = _sortBuilds(metaBuilds.filter(b => {
    if (_buildFilters.role   !== 'all' && !b.tags.includes(_buildFilters.role))  return false;
    if (_buildFilters.weapon !== 'all' && b.weaponLine !== _buildFilters.weapon) return false;
    if (_buildFilters.armor  !== 'all' && b.armorType  !== _buildFilters.armor)  return false;
    return true;
  }));

  if (!filtered.length) {
    container.innerHTML = `<div class="info-block warn" style="margin-top:20px">
      <div class="info-title">No builds match these filters</div>
      <p>Try widening your search — click "All Builds" to reset all filters.</p>
      <button class="btn btn-outline" style="margin-top:10px" onclick="setBuildFilter('all');renderBuilds()">Reset Filters</button>
    </div>`;
    return;
  }

  const tierColor = { S:'#e8c96a', A:'#4a9c6e', B:'#4a7fc1', C:'#7a8098', D:'#8a5050' };
  const tierLabel = { S:'S-Tier', A:'A-Tier', B:'B-Tier', C:'C-Tier', D:'D-Tier' };
  const tierDesc  = { S:'Meta-defining', A:'Widely strong', B:'Situationally solid', C:'Niche/outclassed', D:'Fun, off-meta' };
  const sortLabels = { popular:'Most Popular', success:'Success Rate', cheapest:'Cheapest First', easiest:'Easiest First', tier:'S-Tier First' };

  // Result count bar
  const resultBar = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <div style="font-size:13px;color:var(--text-dim)">
        Showing <strong style="color:var(--text)">${filtered.length}</strong> build${filtered.length!==1?'s':''} — sorted by <strong style="color:var(--gold)">${sortLabels[_buildSort]}</strong>
      </div>
      <button class="btn btn-outline" style="font-size:11px;padding:5px 12px" onclick="showQuiz()">🎯 Not sure? Take the quiz →</button>
    </div>`;

  // Patch banner
  const patchBanner = `
    <div class="patch-banner">
      <div class="patch-banner-left">
        <span class="patch-icon">🔖</span>
        <div>
          <div class="patch-name">${metaPatchInfo.patch}</div>
          <div class="patch-summary">${metaPatchInfo.summary}</div>
        </div>
      </div>
      <a class="patch-notes-link" href="${metaPatchInfo.notes}" target="_blank" rel="noopener">Patch Notes ↗</a>
    </div>`;

  if (_buildView === 'tier') {
    container.innerHTML = patchBanner + renderTierListView(filtered);
    return;
  }

  container.innerHTML = patchBanner + resultBar + '<div class="build-grid">' + filtered.map(b => {
    try {

    const psSteps = (b.playstyle||[]).map((step, i) => `
      <li><div class="ps-num">${i+1}</div><span>${step}</span></li>`).join('');

    const tc = tierColor[b.metaTier] || 'var(--text-dim)';
    const costColor = b.cost === 'Low' ? '#70c090' : b.cost === 'Medium' ? 'var(--gold)' : (b.cost||'').includes('Very') ? '#f05050' : '#e07070';

    // Gear preview strip (5 key slots shown collapsed)
    const gearSlotDefs = [
      ['weapon','⚔️'], ['helmet','⛑️'], ['chest','👕'], ['boots','👟'], ['offhand','🛡️']
    ];
    const gearStrip = gearSlotDefs.map(([slot, emoji]) => {
      const item = b.loadout?.[slot];
      if (!item) return `<div class="gs-slot empty" title="${slot}"><span class="gs-emoji">${emoji}</span></div>`;
      const rid = getRid(item.name);
      const cleanName = item.name.replace(/\s*\(T\d[^)]*\)/gi,'').trim();
      return `<div class="gs-slot" title="${cleanName}">
        <span class="gs-emoji">${emoji}</span>
        ${rid ? `<img src="${itemImg(rid,40)}" class="gs-img" onerror="this.remove()" />` : ''}
        <span class="gs-name">${cleanName.split(' ').slice(0,2).join(' ')}</span>
      </div>`;
    }).join('');

    // Full loadout grid (shown when expanded)
    const loSlots = ['weapon','offhand','helmet','chest','boots','food','potion'];
    const loEmoji = { weapon:'⚔️', offhand:'🛡️', helmet:'⛑️', chest:'👕', boots:'👟', food:'🍗', potion:'🧪' };
    const loadoutGrid = loSlots.map(slot => {
      const item = b.loadout?.[slot];
      if (!item) return '';
      const rid = getRid(item.name);
      const cleanName = item.name.replace(/\s*\(T\d[^)]*\)/gi,'').trim();
      return `<div class="lo-item">
        <div class="lo-img-wrap">
          <span class="lo-emoji-bg">${loEmoji[slot]}</span>
          ${rid ? `<img src="${itemImg(rid,52)}" class="lo-img" onerror="this.remove()" />` : ''}
        </div>
        <div class="lo-text">
          <div class="lo-slot-label">${slot}</div>
          <div class="lo-item-name">${cleanName}</div>
          <div class="lo-note">${item.note||''}</div>
        </div>
      </div>`;
    }).filter(Boolean).join('');

    const successBarColor = (b.successRate||0)>=75 ? 'var(--accent-green)' : (b.successRate||0)>=55 ? 'var(--gold)' : 'var(--accent-red)';

    return `
    <div class="build-card" id="build-${b.id}" onclick="toggleBuildCard(this)">
      <div class="build-accent" style="background:linear-gradient(90deg,${b.color},transparent)"></div>

      <!-- ── Collapsed header (always visible) ── -->
      <div class="build-header">
        <div class="build-header-top">
          <div class="build-icon-wrap" style="background:rgba(0,0,0,0.3);border-color:${b.color}40;position:relative;overflow:hidden;font-size:22px;flex-shrink:0">
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${b.icon}</span>
            ${b.loadout?.weapon ? (() => { const r = getRid(b.loadout.weapon.name); return r ? `<img src="${itemImg(r,48)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:3px" onerror="this.remove()" />` : ''; })() : ''}
          </div>
          <div class="build-header-title">
            <div class="build-name-row">
              <span class="build-name">${b.name}</span>
              ${b.metaTier ? `<span class="tier-badge" style="background:${tc}20;color:${tc};border:1px solid ${tc}50" title="${tierDesc[b.metaTier]||''}">${tierLabel[b.metaTier]||b.metaTier}</span>` : ''}
            </div>
            <div class="build-role-row">
              <span class="build-role">${b.role}</span>
              <span class="build-cost-pill" style="color:${costColor}">${b.cost} Cost</span>
              ${b.patchVerified ? `<span class="patch-verified-badge" style="margin-left:4px">✓ ${b.patchVerified}</span>` : ''}
            </div>
          </div>
          <div class="build-header-right">
            <div class="build-success-mini">
              <div class="success-rate-bar" style="width:60px"><div class="success-rate-fill" style="width:${b.successRate||0}%;background:${successBarColor}"></div></div>
              <span style="font-size:10px;color:var(--text-dim)">${b.successRate||'?'}%</span>
            </div>
            <span class="build-chevron">▾</span>
          </div>
        </div>
        <p class="build-summary">${b.summary}</p>
        <!-- Gear preview strip -->
        <div class="build-gear-strip">${gearStrip}</div>
        <div class="build-tags">${b.tags.map(t=>`<span class="btag">${t}</span>`).join('')}</div>
      </div>

      <!-- ── Expanded body (hidden by default) ── -->
      <div class="build-body">

        <!-- LOADOUT — shown first and prominently -->
        <div class="build-loadout-section">
          <div class="build-section-title">⚙️ Loadout</div>
          <div class="loadout-grid">${loadoutGrid}</div>
          <div class="build-loadout-actions">
            <button class="btn btn-primary" style="font-size:12px;padding:7px 14px" onclick="event.stopPropagation();buildFromMeta('${b.id}')">🎮 Build This in Character Builder</button>
            <button class="btn btn-outline" style="font-size:12px;padding:7px 14px" onclick="event.stopPropagation();copyBuild('${b.id}',this)">📋 Copy</button>
            <a class="btn btn-outline" style="font-size:12px;padding:7px 14px" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(b.name+' '+tierLabel[b.metaTier]+' Albion build — '+b.successRate+'% success rate. https://albionnewbs.netlify.app')}" target="_blank" rel="noopener" onclick="event.stopPropagation()">𝕏 Share</a>
          </div>
        </div>

        <!-- Stats + radar -->
        <div class="build-stats-radar">
          <div class="build-meta-row" style="grid-template-columns:repeat(4,1fr)">
            <div class="build-meta-cell"><div class="bmc-label">Difficulty</div><div class="bmc-value">${ratingDots(b.difficulty)}</div></div>
            <div class="build-meta-cell"><div class="bmc-label">Cost</div><div class="bmc-value" style="color:${costColor}">${b.cost}</div></div>
            <div class="build-meta-cell"><div class="bmc-label">Success</div><div class="bmc-value">
              <div class="success-rate-bar"><div class="success-rate-fill" style="width:${b.successRate||0}%;background:${successBarColor}"></div></div>
              <span style="font-size:11px;color:var(--text-dim)">${b.successRate||'?'}%</span>
            </div></div>
            <div class="build-meta-cell"><div class="bmc-label">Popularity</div><div class="bmc-value popularity-dots">${Array.from({length:5},(_,i)=>`<span class="${i<(b.popularity||0)?'pop-dot filled':'pop-dot'}">●</span>`).join('')}</div></div>
          </div>
          ${renderRadarChart(b.scenarios)}
        </div>

        <div class="build-rewards"><strong>💰 Rewards:</strong> ${b.rewards}</div>

        <!-- Rotation / counters -->
        <div class="build-section-title" style="margin-top:14px">🔄 Rotation & Counters</div>
        <ul class="playstyle-steps">${psSteps}</ul>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
          <div>
            <div style="font-size:11px;color:var(--accent-green);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">✅ Strengths</div>
            ${(b.counters||[]).map(c=>`<div style="font-size:12px;color:var(--text-dim);padding:2px 0">▸ ${c}</div>`).join('')}
          </div>
          <div>
            <div style="font-size:11px;color:var(--accent-red);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">❌ Weaknesses</div>
            ${(b.countered_by||[]).map(c=>`<div style="font-size:12px;color:var(--text-dim);padding:2px 0">▸ ${c}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

    } catch(err) {
      // Isolate bad builds — don't crash the whole list
      return `<div class="build-card" style="border-color:var(--accent-red);padding:16px">
        <div style="color:var(--accent-red);font-size:13px">⚠️ ${b.name || 'Build'} — render error: ${err.message}</div>
      </div>`;
    }
  }).join('') + '</div>';
}

function toggleBuildCard(card) {
  card.classList.toggle('expanded');
}

// Legacy aliases kept so any remaining onclick references don't crash
function toggleBuild(btn) { toggleBuildCard(btn.closest('.build-card')); }
function toggleBuildByHeader(h) { toggleBuildCard(h.closest('.build-card')); }

document.addEventListener('click', e => {
  const btn = e.target.closest('#buildFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#buildFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _buildFilters.role = btn.dataset.bfilter || 'all';
  renderBuilds();
});

// Weapon line filter
document.addEventListener('click', e => {
  const btn = e.target.closest('#weaponLineFilterBar .wl-filter-btn');
  if (!btn) return;
  document.querySelectorAll('#weaponLineFilterBar .wl-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _buildFilters.weapon = btn.dataset.wlfilter || 'all';
  renderBuilds();
});

// Armor type filter
document.addEventListener('click', e => {
  const btn = e.target.closest('#armorTypeFilterBar .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#armorTypeFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _buildFilters.armor = btn.dataset.atfilter || 'all';
  renderBuilds();
});

// Sidebar nav-build-filter quick links
document.addEventListener('click', e => {
  const link = e.target.closest('.nav-build-filter');
  if (!link) return;
  document.querySelectorAll('.nav-build-filter').forEach(l => l.classList.remove('active'));
  link.classList.add('active');
  _buildFilters.role = link.dataset.buildfilter || 'all';
  _buildFilters.weapon = 'all';
  _buildFilters.armor  = 'all';
  showSection('meta-builds');
  // Sync the role filter button
  const roleBtns = document.querySelectorAll('#buildFilterBar .filter-btn');
  roleBtns.forEach(b => {
    b.classList.toggle('active', (b.dataset.bfilter || 'all') === _buildFilters.role);
  });
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
// VISUAL LOADOUT DISPLAY
// ============================================================
const _slotEmoji = {
  weapon:'⚔️', offhand:'🛡️', helmet:'⛑️', chest:'👕', boots:'👟', food:'🍗', potion:'⚗️'
};

function renderVisualLoadout(loadout) {
  if (!loadout) return '';
  const slot = (key) => {
    const item = loadout[key];
    if (!item) return '';
    const rid = getRid(item.name);
    const cleanName = (item.name||'').replace(/\s*\(T\d[^)]*\)/gi,'').trim();
    return `
      <div class="blv-slot${key==='food'||key==='potion'?' consumable':''}">
        <div class="blv-slot-label">${key}</div>
        <div class="blv-slot-img-wrap">
          <div class="blv-slot-emoji">${_slotEmoji[key]||'📦'}</div>
          ${rid ? `<img class="blv-slot-img" src="${itemImg(rid,56)}" alt="${cleanName}" onerror="this.style.display='none'" />` : ''}
        </div>
        <div class="blv-slot-name">${cleanName}</div>
        <div class="blv-slot-note">${item.note||''}</div>
      </div>`;
  };
  return `
    <div class="build-loadout-visual">
      <div class="blv-title">Loadout</div>
      <div class="blv-grid">
        <div class="blv-row">${slot('helmet')}</div>
        <div class="blv-row">${slot('weapon')}${slot('offhand')}</div>
        <div class="blv-row">${slot('chest')}</div>
        <div class="blv-row">${slot('boots')}</div>
        <div class="blv-row">${slot('food')}${slot('potion')}</div>
      </div>
    </div>`;
}

// ============================================================
// RADAR CHART (SVG)
// ============================================================
function renderRadarChart(scenarios) {
  if (!scenarios) return '';
  const keys   = ['soloOpen','soloDung','groupDung','hellgate','smallPvP','zvz','gvg','hce'];
  const labels = ['Solo Open','Solo Dung','Group','Hellgate','Small PvP','ZvZ','GvG','HCE'];
  const n      = keys.length;
  const cx=90, cy=90, maxR=70;

  const axisPoints = keys.map((_,i) => {
    const a = (i/n)*Math.PI*2 - Math.PI/2;
    return { x: cx + maxR*Math.cos(a), y: cy + maxR*Math.sin(a), lx: cx+(maxR+18)*Math.cos(a), ly: cy+(maxR+18)*Math.sin(a) };
  });

  const gridLevels = [0.25,0.5,0.75,1];
  const gridLines  = gridLevels.map(f => {
    const pts = keys.map((_,i) => {
      const a = (i/n)*Math.PI*2 - Math.PI/2;
      return `${cx+maxR*f*Math.cos(a)},${cy+maxR*f*Math.sin(a)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(42,48,80,0.8)" stroke-width="1"/>`;
  }).join('');

  const dataPoints = keys.map((k,i) => {
    const v = (scenarios[k]||0)/5;
    const a = (i/n)*Math.PI*2 - Math.PI/2;
    return `${cx+maxR*v*Math.cos(a)},${cy+maxR*v*Math.sin(a)}`;
  }).join(' ');

  const axes = axisPoints.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(42,48,80,0.6)" stroke-width="1"/>`).join('');
  const lbs  = axisPoints.map((p,i) => `<text x="${p.lx}" y="${p.ly}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="rgba(122,128,152,0.9)">${labels[i]}</text>`).join('');

  return `
    <div class="radar-chart-wrap">
      <svg class="radar-svg" width="180" height="180" viewBox="0 0 180 180">
        ${gridLines}${axes}
        <polygon points="${dataPoints}" fill="rgba(201,168,76,0.18)" stroke="rgba(201,168,76,0.7)" stroke-width="1.5"/>
        ${axisPoints.map((_,i)=>{const v=(scenarios[keys[i]]||0)/5;const a=(i/n)*Math.PI*2-Math.PI/2;const x=cx+maxR*v*Math.cos(a),y=cy+maxR*v*Math.sin(a);return `<circle cx="${x}" cy="${y}" r="3" fill="var(--gold)"/>`;}).join('')}
        ${lbs}
      </svg>
      <div class="radar-legend">
        ${keys.map((k,i)=>`<div class="radar-legend-item"><div class="radar-pip" style="opacity:${0.3+(scenarios[k]||0)*0.14}"></div>${labels[i]}: <strong style="color:var(--text-bright)">${scenarios[k]||0}/5</strong></div>`).join('')}
      </div>
    </div>`;
}

// ============================================================
// FIND MY BUILD QUIZ
// ============================================================
const quizSteps = [
  { q:'How do you prefer to play?', options:[
    { icon:'🗡️', label:'Solo',        sub:'Alone — roaming, farming, hunting', val:'solo' },
    { icon:'👥', label:'With a Group',sub:'Team content, dungeons, ZvZ',        val:'group'},
  ]},
  { q:'Weapon style?', options:[
    { icon:'⚔️', label:'Melee',   sub:'Get in close and fight face to face', val:'melee'  },
    { icon:'🏹', label:'Ranged',  sub:'Crossbows, bows — safe distance',     val:'ranged' },
    { icon:'🪄', label:'Magic',   sub:'Staffs — DPS, CC, or healing',         val:'magic'  },
    { icon:'💚', label:'Healer',  sub:'Keep your team alive',                 val:'healer' },
  ]},
  { q:'Favourite content type?', options:[
    { icon:'🏚️', label:'Dungeons/PvE', sub:'Safe farming, boss runs',       val:'pve' },
    { icon:'🗡️', label:'PvP Fights',  sub:'Ganking, Hellgates, small scale',val:'pvp' },
    { icon:'⚡',  label:'ZvZ / GvG',   sub:'Large battles, territory wars',  val:'zvz' },
  ]},
  { q:'What\'s your budget?', options:[
    { icon:'💰', label:'Learning',  sub:'Under 1M silver — just starting',  val:'low'    },
    { icon:'💰', label:'Ready',     sub:'1M–10M silver — somewhat geared',  val:'medium' },
    { icon:'💰', label:'Endgame',   sub:'10M+ silver — min-max mode',       val:'high'   },
  ]},
];

const quizAnswers = {};
let quizStep = 0;

function showQuiz() {
  quizStep = 0;
  Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
  document.getElementById('quizOverlay').classList.add('open');
  renderQuizStep();
}

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('open');
}

function renderQuizStep() {
  const modal = document.getElementById('quizModal');
  const total = quizSteps.length;
  const step  = quizSteps[quizStep];
  const pct   = Math.round((quizStep/total)*100);

  modal.innerHTML = `
    <div class="quiz-header">
      <div class="quiz-title">🎯 Find My Build</div>
      <button class="quiz-close" onclick="closeQuiz()">✕</button>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Step ${quizStep+1} of ${total}</div>
    <div class="quiz-question">${step.q}</div>
    <div class="quiz-options">
      ${step.options.map(o=>`
        <button class="quiz-option" onclick="quizAnswer('${o.val}')">
          <span class="qo-icon">${o.icon}</span>
          <span class="qo-label">${o.label}</span>
          <span class="qo-sub">${o.sub}</span>
        </button>`).join('')}
    </div>`;
}

function quizAnswer(val) {
  const keys = ['style','weapon','content','budget'];
  quizAnswers[keys[quizStep]] = val;
  quizStep++;
  if (quizStep < quizSteps.length) { renderQuizStep(); return; }
  showQuizResult();
}

function showQuizResult() {
  // Score each build
  const scored = metaBuilds.map(b => {
    let score = 0;
    const { style, weapon, content, budget } = quizAnswers;
    // Style match
    if (style==='solo'  && (b.tags.includes('Solo PvP')||b.tags.includes('Solo PvE'))) score+=3;
    if (style==='group' && (b.tags.includes('Group PvP')||b.tags.includes('ZvZ')||b.tags.includes('GvG')||b.tags.includes('HCE'))) score+=3;
    // Weapon match
    const melee   = ['Swords','Axes','Hammers','Spears','Daggers','Quarterstaffs'];
    const ranged  = ['Crossbows','Bows'];
    const magic   = ['Fire Staffs','Frost Staffs','Cursed Staffs','Arcane Staffs','Nature Staffs'];
    const healer  = ['Holy Staffs','Nature Staffs'];
    if (weapon==='melee'  && melee.includes(b.weaponLine))  score+=2;
    if (weapon==='ranged' && ranged.includes(b.weaponLine)) score+=2;
    if (weapon==='magic'  && magic.includes(b.weaponLine))  score+=2;
    if (weapon==='healer' && healer.includes(b.weaponLine)) score+=3;
    // Content match
    if (content==='pve' && (b.tags.includes('Solo PvE')||b.tags.includes('Group PvE')||b.tags.includes('Dungeons')||b.tags.includes('HCE'))) score+=2;
    if (content==='pvp' && (b.tags.includes('Solo PvP')||b.tags.includes('Ganking')||b.tags.includes('Hellgate')||b.tags.includes('Group PvP'))) score+=2;
    if (content==='zvz' && (b.tags.includes('ZvZ')||b.tags.includes('GvG')||b.tags.includes('Crystal League'))) score+=2;
    // Budget match
    const cheap = ['Low','Low-Medium'];
    const mid   = ['Medium','Low-Medium'];
    const exp   = ['High','Very High'];
    if (budget==='low'    && cheap.includes(b.cost)) score+=1;
    if (budget==='medium' && mid.includes(b.cost))   score+=1;
    if (budget==='high'   && exp.includes(b.cost))   score+=1;
    // Bonus for tier
    if (b.metaTier==='S') score+=1;
    score += (b.successRate||0)/25;
    return { ...b, _score: score };
  }).sort((a,b)=>b._score-a._score);

  const top = scored[0];
  const modal = document.getElementById('quizModal');
  const tc = { S:'#e8c96a', A:'#4a9c6e', B:'#4a7fc1', C:'#7a8098' };

  modal.innerHTML = `
    <div class="quiz-header">
      <div class="quiz-title">🎯 Your Build Match</div>
      <button class="quiz-close" onclick="closeQuiz()">✕</button>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:100%;background:var(--accent-green)"></div></div>
    <div class="quiz-result">
      <div class="quiz-result-label">✅ Best Match Found</div>
      <div class="quiz-result-name">${top.name}</div>
      <div class="quiz-result-role">${top.role} · <span style="color:${tc[top.metaTier]}">${top.metaTier}-Tier</span> · ${top.cost} Cost · ${top.successRate||0}% success rate</div>
      <p class="quiz-result-summary">${top.summary}</p>
      <div class="quiz-result-btns">
        <button class="btn btn-primary" onclick="buildFromMeta('${top.id}')">🎮 Build This Loadout</button>
        <button class="btn btn-outline" onclick="closeQuiz();showSection('meta-builds');setTimeout(()=>scrollToBuildCard('${top.id}'),700)">View Full Build →</button>
        <button class="btn btn-outline" onclick="quizStep=0;Object.keys(quizAnswers).forEach(k=>delete quizAnswers[k]);renderQuizStep()">Try Again</button>
      </div>
      <div style="margin-top:16px;font-size:11px;color:var(--text-dim)">
        Runner-up: <strong style="color:var(--text)">${scored[1]?.name}</strong> (${scored[1]?.role})
        &nbsp;·&nbsp; <strong style="color:var(--text)">${scored[2]?.name}</strong>
      </div>
    </div>`;
}

// Close quiz on overlay click
document.getElementById('quizOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('quizOverlay')) closeQuiz();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuiz();
});

// ============================================================
// HOME PAGE — featured build & weapon strip
// ============================================================
let _homeReady = false;

function initHomePage() {
  // ── Featured Build of the Week ──────────────────────────
  const tc = { S:'#e8c96a', A:'#4a9c6e', B:'#4a7fc1' };
  const featured = [...metaBuilds]
    .filter(b => b.metaTier === 'S')
    .sort((a, b) => (b.successRate||0) - (a.successRate||0))[0];

  const card = document.getElementById('featuredBuildCard');
  const body = document.getElementById('featuredBuildBody');

  if (featured && card && body) {
    const accent = card.querySelector('.featured-build-accent');
    if (accent) accent.style.background = `linear-gradient(90deg,${featured.color},transparent)`;

    // Build weapon image strip (cache already populated)
    const weaponImgs = Object.values(featured.loadout)
      .slice(0, 4)
      .map(item => {
        const rid = _buildImgCache[_normName(item.name)];
        return rid
          ? `<img src="${itemImg(rid, 56)}" title="${item.name}" style="width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5))" onerror="this.remove()" />`
          : '';
      }).join('');

    body.innerHTML = `
      <div class="featured-build-label" style="color:${tc[featured.metaTier]||'var(--gold)'}">
        ⭐ Build of the Week &nbsp;·&nbsp; ${featured.metaTier}-Tier
      </div>
      <div class="featured-build-name">${featured.name}</div>
      <div class="featured-build-role">${featured.role}</div>
      <p class="featured-build-summary">${featured.summary}</p>
      <div class="featured-build-meta">
        <div class="featured-meta-item">
          <div class="featured-meta-label">Weapon</div>
          <div class="featured-meta-value">${featured.weaponLine}</div>
        </div>
        <div class="featured-meta-item">
          <div class="featured-meta-label">Armor</div>
          <div class="featured-meta-value">${featured.armorType}</div>
        </div>
        <div class="featured-meta-item">
          <div class="featured-meta-label">Cost</div>
          <div class="featured-meta-value">${featured.cost}</div>
        </div>
        <div class="featured-meta-item">
          <div class="featured-meta-label">Success</div>
          <div class="featured-meta-value" style="color:var(--accent-green)">${featured.successRate}%</div>
        </div>
      </div>
      ${weaponImgs ? `<div class="featured-build-weapons">${weaponImgs}</div>` : ''}`;
  }

  // ── Weapon type strip (only build once) ──────────────────
  const strip = document.getElementById('weaponStrip');
  if (!strip || _homeReady) return;
  _homeReady = true;

  const lines = [
    {icon:'🗡️', label:'Swords',       wl:'Swords'},
    {icon:'🪓', label:'Axes',         wl:'Axes'},
    {icon:'🔨', label:'Hammers',      wl:'Hammers'},
    {icon:'🔱', label:'Spears',       wl:'Spears'},
    {icon:'🔪', label:'Daggers',      wl:'Daggers'},
    {icon:'🥢', label:'Staves',       wl:'Quarterstaffs'},
    {icon:'🔫', label:'Xbows',        wl:'Crossbows'},
    {icon:'🏹', label:'Bows',         wl:'Bows'},
    {icon:'🔥', label:'Fire',         wl:'Fire Staffs'},
    {icon:'❄️', label:'Frost',        wl:'Frost Staffs'},
    {icon:'💀', label:'Cursed',       wl:'Cursed Staffs'},
    {icon:'🌿', label:'Nature',       wl:'Nature Staffs'},
    {icon:'✨', label:'Holy',         wl:'Holy Staffs'},
    {icon:'🔮', label:'Arcane',       wl:'Arcane Staffs'},
    {icon:'🐺', label:'Shapeshifter', wl:'Shapeshifter', badge:'NEW'},
    {icon:'👊', label:'War Gloves',   wl:'War Gloves',   badge:'NEW'},
  ];

  lines.forEach(l => {
    const count = metaBuilds.filter(b => b.weaponLine === l.wl).length;
    const div = document.createElement('div');
    div.className = 'weapon-strip-item' + (l.badge ? ' ws-new' : '');
    div.title = `${count} ${l.label} build${count!==1?'s':''} — click to browse`;
    div.innerHTML = `
      ${l.badge ? `<span class="ws-new-badge">${l.badge}</span>` : ''}
      <span class="ws-icon">${l.icon}</span>
      <span class="ws-label">${l.label}</span>
      <span class="ws-count">${count} build${count!==1?'s':''}</span>`;
    div.onclick = () => {
      setBuildFilter('all', l.wl, 'all');
      showSection('meta-builds');
    };
    strip.appendChild(div);
  });
}

// ============================================================
// CRAFTING GUIDE
// ============================================================

// Per-tier refining recipe: rawPerUnit of current tier raw + lowerRefined of previous tier refined
const REFINING_CHAIN = {
  2: { rawPerUnit: 2, lowerRefined: 0 },
  3: { rawPerUnit: 2, lowerRefined: 1 },
  4: { rawPerUnit: 2, lowerRefined: 1 },
  5: { rawPerUnit: 2, lowerRefined: 1 },
  6: { rawPerUnit: 2, lowerRefined: 1 },
  7: { rawPerUnit: 2, lowerRefined: 1 },
  8: { rawPerUnit: 2, lowerRefined: 1 },
};

// Calculate raw materials needed for `qty` refined units at `tier`
// Returns array of { tier, rawName, refinedName, rawNeeded, refinedQty }
function calcRefiningChain(resourceKey, tier, qty) {
  const res = resourceNames[resourceKey];
  if (!res) return [];
  const breakdown = [];
  let needed = qty;
  for (let t = tier; t >= 2; t--) {
    const step = REFINING_CHAIN[t];
    const rawNeeded = needed * step.rawPerUnit;
    breakdown.push({ tier: t, rawName: res.raw[t], refinedName: res.refined[t], rawNeeded, refinedQty: needed });
    needed = needed * step.lowerRefined;
    if (needed === 0) break;
  }
  return breakdown;
}

// Total raw across the full chain
function totalRawForRefined(resourceKey, tier, qty) {
  return calcRefiningChain(resourceKey, tier, qty)
    .reduce((sum, row) => sum + row.rawNeeded, 0);
}

function renderCraftingGuide() {
  if (document.getElementById('craftRecipeTable').dataset.rendered) return;
  document.getElementById('craftRecipeTable').dataset.rendered = 'true';

  // ── Recipe tables by category ──
  const cats = [...new Set(craftingRecipes.map(r => r.category))];
  const tableContainer = document.getElementById('craftRecipeTable');
  tableContainer.innerHTML = cats.map(cat => {
    const items = craftingRecipes.filter(r => r.category === cat);
    const rows = items.map(item => {
      // Try to find a render image for this item from our lookups
      const itemRid = (() => {
        const n = item.name.toLowerCase();
        const found = Object.entries(weaponRenderIds).find(([id]) => {
          const w = weaponsData.find(w => w.id === id);
          return w && n.includes(w.name.toLowerCase().split('/')[0].trim());
        });
        return found ? found[1] : null;
      })();
      const itemImgTag = itemRid
        ? `<img src="${itemImg(itemRid, 36)}" alt="${item.name}" style="width:32px;height:32px;object-fit:contain;vertical-align:middle;margin-right:6px;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.5))" onerror="this.style.display='none'" />`
        : `<span style="margin-right:6px">${item.icon}</span>`;

      const mats = item.materials.map(m => {
        if (m.raw) return `<span style="color:var(--text)">${m.qty}× ${m.resource.replace('_',' ')}</span>`;
        const res = resourceNames[m.resource];
        const resName = res ? res.refined[4].split(' ').slice(0,2).join(' ') + '…' : m.resource;
        return res
          ? `<span style="color:var(--gold-light)">${res.icon} ${m.qty}× ${resName}</span>`
          : `${m.qty}× ${m.resource}`;
      }).join('<br>');

      return `<tr>
        <td><div style="display:flex;align-items:center">${itemImgTag}<strong>${item.name}</strong></div></td>
        <td style="color:var(--text-dim);font-size:12px">${item.station}</td>
        <td style="color:var(--text-dim);font-size:12px">${item.city}</td>
        <td style="font-size:12px">${mats}</td>
        <td style="font-size:11px;color:var(--text-dim)">${item.note}</td>
      </tr>`;
    }).join('');
    return `
      <div style="margin-bottom:24px">
        <div class="armor-slot-section" style="margin-top:0">
          <h3>${cat}</h3>
        </div>
        <table class="tier-table">
          <thead><tr><th>Item</th><th>Station</th><th>Best City</th><th>Materials (per item)</th><th>Notes</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');

  // ── Resource names table ──
  const nameTable = document.getElementById('resourceNamesTable');
  const types = Object.keys(resourceNames);
  nameTable.innerHTML = `<table class="tier-table">
    <thead><tr><th>Resource</th>${[2,3,4,5,6,7,8].map(t=>`<th>T${t}</th>`).join('')}</tr></thead>
    <tbody>
      ${types.map(k => {
        const r = resourceNames[k];
        return `
          <tr style="background:rgba(201,168,76,0.04)">
            <td><strong>${r.icon} ${r.label.split('→')[0].trim()} (Raw)</strong></td>
            ${[2,3,4,5,6,7,8].map(t => `<td style="font-size:12px;color:var(--text-dim)">${r.raw[t]}</td>`).join('')}
          </tr>
          <tr>
            <td style="padding-left:16px;font-size:12px;color:var(--text-dim)">↳ ${r.label.split('→')[1].trim()}</td>
            ${[2,3,4,5,6,7,8].map(t => `<td style="font-size:12px;color:var(--gold)">${r.refined[t]}</td>`).join('')}
          </tr>`;
      }).join('')}
    </tbody>
  </table>`;

  // Populate selectors
  const resSelects = document.querySelectorAll('.crafting-resource-select');
  resSelects.forEach(sel => {
    sel.innerHTML = Object.entries(resourceNames)
      .map(([k,v]) => `<option value="${k}">${v.icon} ${v.label}</option>`).join('');
  });

  const itemSelects = document.querySelectorAll('.crafting-item-select');
  itemSelects.forEach(sel => {
    const grouped = {};
    craftingRecipes.forEach(r => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });
    sel.innerHTML = Object.entries(grouped)
      .map(([cat, items]) =>
        `<optgroup label="${cat}">${items.map(i => `<option value="${i.id}">${i.icon} ${i.name}</option>`).join('')}</optgroup>`
      ).join('');
  });
}

// ── Refining chain calculator ──
function runRefiningCalc() {
  const res  = document.getElementById('refCalcResource')?.value;
  const tier = parseInt(document.getElementById('refCalcTier')?.value || '6');
  const qty  = parseInt(document.getElementById('refCalcQty')?.value  || '16');
  const out  = document.getElementById('refCalcOutput');
  if (!out || !res) return;

  const chain = calcRefiningChain(res, tier, qty);
  const totalRaw = chain.reduce((s,r) => s + r.rawNeeded, 0);

  out.style.display = 'block';
  out.innerHTML = `
    <div style="font-size:12px;color:var(--gold-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
      Chain to produce <strong style="color:var(--gold)">${qty}× T${tier} ${resourceNames[res]?.refined[tier] || 'refined'}</strong>
    </div>
    <table class="tier-table" style="margin:0">
      <thead><tr><th>Step</th><th>You Need to Refine</th><th>Raw Material</th><th>Qty Raw</th><th>Lower-Tier Refined</th></tr></thead>
      <tbody>
        ${chain.map((row,i) => `
          <tr>
            <td><span class="tier-dot t${row.tier}" style="display:inline-block"></span> T${row.tier}</td>
            <td style="color:var(--gold)">${row.refinedQty}× ${row.refinedName}</td>
            <td style="color:var(--text-dim)">${row.rawName}</td>
            <td><strong style="color:var(--text-bright)">${row.rawNeeded}</strong></td>
            <td style="color:var(--text-dim)">${i < chain.length-1 ? row.refinedQty + '× T'+(row.tier-1)+' refined needed' : '— none required'}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="highlight" style="margin-top:10px">
      <strong>Total raw materials across all tiers: ${totalRaw.toLocaleString()} units</strong>
      &nbsp;— or buy T${tier-1} refined on the market and only gather <strong>${chain[0].rawNeeded}</strong> T${tier} raw.
    </div>`;
}

// ── Craft cost calculator ──
function runCraftCalc() {
  const itemId = document.getElementById('craftCalcItem')?.value;
  const tier   = parseInt(document.getElementById('craftCalcTier')?.value || '6');
  const qty    = parseInt(document.getElementById('craftCalcQty')?.value  || '1');
  const returnRate = parseFloat(document.getElementById('craftCalcReturn')?.value || '40') / 100;
  const out    = document.getElementById('craftCalcOutput');
  if (!out) return;

  const recipe = craftingRecipes.find(r => r.id === itemId);
  if (!recipe) return;

  const rawMats = recipe.materials.filter(m => m.raw);
  const refinedMats = recipe.materials.filter(m => !m.raw);

  let html = `<div style="font-size:12px;color:var(--gold-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
    Materials to craft <strong style="color:var(--gold)">${qty}× T${tier} ${recipe.name}</strong>
  </div>`;

  if (refinedMats.length) {
    html += `<table class="tier-table" style="margin-bottom:12px">
      <thead><tr><th>Refined Material</th><th>Per Item</th><th>Total (${qty}×)</th><th>Full Chain (raw)</th></tr></thead>
      <tbody>`;
    refinedMats.forEach(m => {
      const res = resourceNames[m.resource];
      if (!res) return;
      const totalRefined = m.qty * qty;
      const totalRaw = totalRawForRefined(m.resource, tier, totalRefined);
      html += `<tr>
        <td>${res.icon} <strong>${res.refined[tier] || 'T'+tier+' '+m.resource}</strong></td>
        <td>${m.qty}×</td>
        <td style="color:var(--gold)">${totalRefined.toLocaleString()}×</td>
        <td style="color:var(--text-dim);font-size:12px">≈ ${totalRaw.toLocaleString()} raw T2–T${tier}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  if (rawMats.length) {
    html += `<div style="font-size:12px;color:var(--text-dim);margin-bottom:6px"><strong style="color:var(--text)">Raw consumable ingredients (food/potions):</strong></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">`;
    rawMats.forEach(m => {
      html += `<div class="loot-row" style="flex:0 0 auto;min-width:160px">
        <div class="loot-name">${m.qty * qty}× ${m.resource.replace('_',' ')}</div>
      </div>`;
    });
    html += `</div>`;
  }

  if (refinedMats.length) {
    const totalItems = qty;
    const returnedItems = Math.floor(totalItems * returnRate);
    html += `<div class="info-block tip" style="margin-top:4px">
      <div class="info-title">📊 Return Rate at ${(returnRate*100).toFixed(0)}%</div>
      <p>Crafting ${totalItems} items returns approximately <strong>${returnedItems}</strong> items' worth of materials back to you (~${Math.floor(totalItems*refinedMats[0].qty*returnRate)} ${resourceNames[refinedMats[0].resource]?.refined[tier] || 'refined units'}). Adjust the return rate slider to match your current specialisation level.</p>
    </div>`;
  }

  out.style.display = 'block';
  out.innerHTML = html;
}

// ── Profit calculator ──
function runProfitCalc() {
  const itemId   = document.getElementById('profitCalcItem')?.value;
  const tier     = parseInt(document.getElementById('profitCalcTier')?.value || '6');
  const qty      = parseInt(document.getElementById('profitCalcQty')?.value || '10');
  const sellPrice = parseInt(document.getElementById('profitCalcSell')?.value || '0');
  const returnRate = parseFloat(document.getElementById('profitCalcReturn')?.value || '40') / 100;
  const out = document.getElementById('profitCalcOutput');
  if (!out) return;

  const recipe = craftingRecipes.find(r => r.id === itemId);
  if (!recipe) { out.innerHTML = '<p style="color:var(--text-dim)">Select an item above.</p>'; return; }

  let totalMatCost = 0;
  let matRows = '';

  recipe.materials.forEach(m => {
    if (m.raw) return;
    const res   = resourceNames[m.resource];
    const priceKey = m.resource + 'R';
    const unitPrice = parseInt(document.getElementById('price-' + m.resource)?.value || defaultPrices[priceKey]?.[tier] || 0);
    const total = m.qty * qty * unitPrice;
    totalMatCost += total;
    matRows += `<tr>
      <td>${res?.icon || ''} ${res?.refined[tier] || m.resource}</td>
      <td>${m.qty * qty}×</td>
      <td>${unitPrice.toLocaleString()} sv</td>
      <td>${total.toLocaleString()} sv</td>
    </tr>`;
  });

  const effectiveCost = Math.round(totalMatCost * (1 - returnRate));
  const grossRevenue  = sellPrice * qty;
  const marketTax     = Math.round(grossRevenue * 0.075);
  const netRevenue    = grossRevenue - marketTax;
  const profit        = netRevenue - effectiveCost;
  const margin        = grossRevenue > 0 ? ((profit / netRevenue) * 100).toFixed(1) : 0;
  const profitColor   = profit > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  const marginColor   = parseFloat(margin) >= 20 ? 'var(--accent-green)' : parseFloat(margin) >= 10 ? 'var(--gold)' : 'var(--accent-red)';

  out.style.display = 'block';
  out.innerHTML = `
    <table class="tier-table" style="margin-bottom:12px">
      <thead><tr><th>Material</th><th>Qty</th><th>Price Each</th><th>Total Cost</th></tr></thead>
      <tbody>${matRows}</tbody>
    </table>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:10px">
      <div class="build-meta-cell"><div class="bmc-label">Raw Mat Cost</div><div class="bmc-value">${totalMatCost.toLocaleString()} sv</div></div>
      <div class="build-meta-cell"><div class="bmc-label">After ${(returnRate*100).toFixed(0)}% Return</div><div class="bmc-value" style="color:var(--accent-green)">${effectiveCost.toLocaleString()} sv</div></div>
      <div class="build-meta-cell"><div class="bmc-label">Gross Revenue</div><div class="bmc-value">${grossRevenue.toLocaleString()} sv</div></div>
      <div class="build-meta-cell"><div class="bmc-label">Market Tax (7.5%)</div><div class="bmc-value" style="color:var(--accent-red)">−${marketTax.toLocaleString()} sv</div></div>
      <div class="build-meta-cell"><div class="bmc-label">Net Profit</div><div class="bmc-value" style="color:${profitColor}">${profit.toLocaleString()} sv</div></div>
      <div class="build-meta-cell"><div class="bmc-label">Margin</div><div class="bmc-value" style="color:${marginColor}">${margin}%</div></div>
    </div>
    <div class="highlight" style="background:${profit>0?'rgba(74,156,110,0.08)':'rgba(193,80,80,0.08)'};border-color:${profitColor}">
      ${profit > 0
        ? `<strong style="color:var(--accent-green)">✅ Profitable:</strong> ${profit.toLocaleString()} silver profit on ${qty} items (${margin}% margin)`
        : `<strong style="color:var(--accent-red)">❌ Not profitable</strong> at these prices — raise sell price or lower material cost`}
    </div>`;
}

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
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'success') {
  const t = document.createElement('div');
  t.className = `site-toast site-toast-${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2400);
}

// ============================================================
// COPY BUILD TO CLIPBOARD
// ============================================================
function copyBuild(buildId, btn) {
  const b = metaBuilds.find(x => x.id === buildId);
  if (!b) return;
  const lines = [
    `${b.name} — ${b.metaTier}-Tier ${b.role}`,
    `Cost: ${b.cost} | Success Rate: ${b.successRate||'?'}%`,
    '',
    'LOADOUT:',
    ...Object.entries(b.loadout).map(([slot, item]) =>
      `  ${slot.charAt(0).toUpperCase()+slot.slice(1)}: ${item.name} — ${item.note}`),
    '',
    b.summary,
    '',
    `Full guide: https://albionnewbs.netlify.app`,
  ];
  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    showToast('Build copied to clipboard!');
    if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = orig, 1800); }
  }).catch(() => showToast('Copy failed — try manually selecting the text.', 'error'));
}

// ============================================================
// SCROLL-TO-TOP BUTTON
// ============================================================
(function() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', e => {
  // / or Ctrl+K → focus search
  if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault();
    const inp = document.getElementById('searchInput');
    if (inp) { inp.focus(); inp.select(); }
  }
  // Escape → close quiz, blur search
  if (e.key === 'Escape') {
    closeQuiz();
    document.getElementById('searchInput')?.blur();
    document.getElementById('searchResults').style.display = 'none';
  }
});

// ============================================================
// MOBILE TOPNAV DROPDOWNS (tap to toggle on touch devices)
// ============================================================
document.querySelectorAll('.topnav-item').forEach(item => {
  const btn = item.querySelector('.topnav-btn');
  const dd  = item.querySelector('.topnav-dropdown');
  if (!btn || !dd) return;
  btn.addEventListener('click', e => {
    if (window.innerWidth > 1000) return; // desktop uses CSS hover
    e.stopPropagation();
    const open = item.classList.contains('tap-open');
    document.querySelectorAll('.topnav-item.tap-open').forEach(i => i.classList.remove('tap-open'));
    if (!open) item.classList.add('tap-open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.topnav-item.tap-open').forEach(i => i.classList.remove('tap-open'));
});

// ============================================================
// HAMBURGER / MOBILE NAV
// ============================================================
function closeNav() {
  document.getElementById('mobileNavPanel')?.classList.remove('open');
  document.getElementById('topnavHamburger')?.classList.remove('active');
}

document.getElementById('topnavHamburger')?.addEventListener('click', e => {
  e.stopPropagation();
  const panel = document.getElementById('mobileNavPanel');
  const ham   = document.getElementById('topnavHamburger');
  if (!panel) return;
  const open = panel.classList.toggle('open');
  ham.classList.toggle('active', open);
  ham.textContent = open ? '✕' : '☰';
});

document.addEventListener('click', e => {
  if (!e.target.closest('#mobileNavPanel') && !e.target.closest('#topnavHamburger')) closeNav();
});

// ============================================================
// INIT
// ============================================================
_buildImgMap();
showSection('home');
initHomePage();


