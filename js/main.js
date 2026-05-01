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

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  // Mark active in nav (may appear in multiple places — mark all)
  document.querySelectorAll(`.nav-item[data-section="${id}"]`).forEach(el => el.classList.add('active'));
  // Auto-open the group that contains this section
  openGroupForSection(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeSidebar();

  // Lazy-render data-driven sections
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

// Active build filter state
const _buildFilters = { role: 'all', weapon: 'all', armor: 'all' };

function setBuildFilter(role = 'all', weapon = 'all', armor = 'all') {
  _buildFilters.role   = role;
  _buildFilters.weapon = weapon;
  _buildFilters.armor  = armor;
  renderBuilds();
}

// ============================================================
// RENDER BUILDS
// ============================================================
function renderBuilds(tagFilter) {
  // tagFilter param kept for backward compat — prefer _buildFilters
  if (tagFilter && tagFilter !== 'all') _buildFilters.role = tagFilter;
  const container = document.getElementById('buildContent');
  if (!container) return;

  const filtered = metaBuilds.filter(b => {
    if (_buildFilters.role   !== 'all' && !b.tags.includes(_buildFilters.role))     return false;
    if (_buildFilters.weapon !== 'all' && b.weaponLine !== _buildFilters.weapon)    return false;
    if (_buildFilters.armor  !== 'all' && b.armorType  !== _buildFilters.armor)     return false;
    return true;
  });

  if (!filtered.length) {
    container.innerHTML = `<div class="info-block warn">
      <div class="info-title">No builds match these filters</div>
      <p>Try widening your search — select "All" in one of the filter rows above. Not every weapon line has a dedicated build yet; check back after future updates.</p>
    </div>`;
    return;
  }

  // Tier colours
  const tierColor = { S:'#e8c96a', A:'#4a9c6e', B:'#4a7fc1', C:'#7a8098' };
  const tierLabel = { S:'S-Tier', A:'A-Tier', B:'B-Tier', C:'C-Tier' };

  // Patch banner — rendered once above the grid
  const patchBanner = `
    <div class="patch-banner">
      <div class="patch-banner-left">
        <span class="patch-icon">🔖</span>
        <div>
          <div class="patch-name">${metaPatchInfo.patch} <span class="patch-version">${metaPatchInfo.version}</span></div>
          <div class="patch-summary">${metaPatchInfo.summary}</div>
        </div>
      </div>
      <a class="patch-notes-link" href="${metaPatchInfo.notes}" target="_blank" rel="noopener">Patch Notes ↗</a>
    </div>`;

  container.innerHTML = patchBanner + '<div class="build-grid">' + filtered.map(b => {
    const loadoutRows = Object.entries(b.loadout).map(([slot, item]) => {
      const img = loadoutImg(item.name);
      return `
      <tr>
        <td class="loadout-slot">${slot.charAt(0).toUpperCase() + slot.slice(1)}</td>
        <td class="loadout-item"><div class="loadout-img-cell">${img}<span>${item.name}</span></div></td>
        <td class="loadout-note">${item.note}</td>
      </tr>`;
    }).join('');

    const psSteps = b.playstyle.map((step, i) => `
      <li><div class="ps-num">${i+1}</div><span>${step}</span></li>`).join('');

    const costColor = b.cost === 'Low' ? '#70c090' : b.cost === 'Medium' ? 'var(--gold)' : b.cost.includes('Very') ? '#f05050' : '#e07070';

    // Get the weapon render for the build header
    const weaponItem = b.loadout.weapon;
    const weaponImg  = weaponItem ? loadoutImg(weaponItem.name) : '';

    return `
    <div class="build-card" id="build-${b.id}" style="--build-accent:${b.color}">
      <div class="build-header">
        <div class="build-accent" style="background:linear-gradient(90deg,${b.color},transparent)"></div>
        <div class="build-icon-name">
          <div class="build-icon-wrap" style="background:rgba(0,0,0,0.3);border-color:${b.color}40;position:relative;overflow:hidden;font-size:24px">
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${b.icon}</span>
            ${weaponImg ? weaponImg.replace('class="loadout-img"', 'class="loadout-img" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:4px"') : ''}
          </div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="build-name">${b.name}</div>
              ${b.metaTier ? `<span class="tier-badge" style="background:${tierColor[b.metaTier]}20;color:${tierColor[b.metaTier]};border:1px solid ${tierColor[b.metaTier]}50">${tierLabel[b.metaTier]}</span>` : ''}
            </div>
            <div class="build-role">${b.role}</div>
            ${b.patchVerified ? `<div class="patch-verified-badge">✓ ${b.patchVerified}</div>` : ''}
          </div>
        </div>
        <div class="build-tags">${b.tags.map(t => `<span class="btag">${t}</span>`).join('')}</div>
        <p class="build-summary">${b.summary}</p>
      </div>
      <div class="build-body">
        <!-- Stats row: difficulty, cost, success rate, popularity -->
        <div class="build-meta-row" style="grid-template-columns:repeat(4,1fr)">
          <div class="build-meta-cell">
            <div class="bmc-label">Difficulty</div>
            <div class="bmc-value">${ratingDots(b.difficulty)}</div>
          </div>
          <div class="build-meta-cell">
            <div class="bmc-label">Cost</div>
            <div class="bmc-value" style="color:${costColor}">${b.cost}</div>
          </div>
          <div class="build-meta-cell">
            <div class="bmc-label">Success Rate</div>
            <div class="bmc-value">
              <div class="success-rate-bar">
                <div class="success-rate-fill" style="width:${b.successRate||0}%;background:${(b.successRate||0)>=75?'var(--accent-green)':(b.successRate||0)>=60?'var(--gold)':'var(--accent-red)'}"></div>
              </div>
              <span style="font-size:11px;color:var(--text-dim)">${b.successRate||'?'}%</span>
            </div>
          </div>
          <div class="build-meta-cell">
            <div class="bmc-label">Popularity</div>
            <div class="bmc-value popularity-dots">${Array.from({length:5},(_,i)=>`<span class="${i<(b.popularity||0)?'pop-dot filled':'pop-dot'}">●</span>`).join('')}</div>
          </div>
        </div>

        <!-- Scenario suitability chart -->
        ${b.scenarios ? `
        <div class="scenario-chart">
          <div class="scenario-chart-label">Scenario Suitability</div>
          <div class="scenario-bars">
            ${[
              ['Solo Open World', b.scenarios.soloOpen],
              ['Solo Dungeons',   b.scenarios.soloDung],
              ['Group Dungeons',  b.scenarios.groupDung],
              ['Hellgates',       b.scenarios.hellgate],
              ['Small Group PvP', b.scenarios.smallPvP],
              ['ZvZ',             b.scenarios.zvz],
              ['GvG',             b.scenarios.gvg],
              ['HCE',             b.scenarios.hce],
            ].map(([label, val]) => `
              <div class="scenario-row">
                <span class="scenario-label">${label}</span>
                <div class="scenario-track">
                  ${Array.from({length:5},(_,i)=>`<div class="scenario-pip ${i<(val||0)?'on':''}"></div>`).join('')}
                </div>
                <span class="scenario-val">${val||0}/5</span>
              </div>`).join('')}
          </div>
        </div>` : ''}

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
// INIT
// ============================================================
showSection('home');
