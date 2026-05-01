// ============================================================
// CHARACTER BUILDER
// ============================================================

// ── Supplementary data ──────────────────────────────────────
const offhandItems = [
  { id:'torch',       name:'Torch',          emoji:'🔥', ability:'Energy Regen — restores energy over time',            bestWith:['any'] },
  { id:'shield',      name:'Shield',         emoji:'🛡️', ability:'Shield Slam — stun + block chance passive',           bestWith:['Plate'] },
  { id:'tome',        name:'Tome of Spells', emoji:'📖', ability:'Spell Echo — stacking spell damage bonus',             bestWith:['Cloth'] },
  { id:'holy-seal',   name:'Holy Seal',      emoji:'✨', ability:'Boost — empowers your next heal',                     bestWith:['Healer'] },
  { id:'quiver',      name:'Quiver',         emoji:'🏹', ability:'Multishot — attack speed and range bonus',             bestWith:['Ranged'] },
  { id:'mistcaller',  name:'Mistcaller',     emoji:'❄️', ability:'Frost Aura — cooldown reduction passive',              bestWith:['Magic'] },
  { id:'mage-rune',   name:"Mage's Rune",    emoji:'🔮', ability:'Arcane Channel — bonus magic damage stacks',           bestWith:['Magic'] },
  { id:'druid-rune',  name:'Druidic Rune',   emoji:'🌿', ability:'Nature Attunement — boosts HoT effectiveness',         bestWith:['Healer'] },
];

const foodItems = [
  { id:'pork-omelette', name:'Pork Omelette',  emoji:'🍳', effect:'+Max HP (best HP food)',    hp:800  },
  { id:'beef-stew',     name:'Beef Stew',       emoji:'🥘', effect:'+HP + Physical Resistance', hp:500  },
  { id:'soup',          name:'Healing Soup',    emoji:'🍲', effect:'+Healing Received',          hp:300  },
  { id:'pork-pie',      name:'Pork Pie',        emoji:'🥧', effect:'+Spell Damage',              hp:400  },
  { id:'cabbage-soup',  name:'Roast Pork',      emoji:'🍖', effect:'+HP Regen sustained',        hp:600  },
  { id:'salad',         name:'Salad',           emoji:'🥗', effect:'+Crafting Quality Chance',   hp:200  },
];

const potionItems = [
  { id:'healing',    name:'Healing Potion',     emoji:'❤️',  effect:'Instant burst heal' },
  { id:'energy',     name:'Energy Potion',      emoji:'💙',  effect:'Instant energy restore' },
  { id:'resistance', name:'Resistance Potion',  emoji:'🛡️', effect:'% Damage reduction burst' },
  { id:'invisible',  name:'Invisibility Potion',emoji:'👻',  effect:'30s stealth escape tool' },
  { id:'poison',     name:'Poison Potion',       emoji:'🟢',  effect:'AoE DoT on nearby enemies' },
  { id:'cleanse',    name:'Cleanse Potion',      emoji:'✨',  effect:'Remove all debuffs instantly' },
];

// ── Silver cost estimates per item type per tier ─────────────
const SILVER_COST = {
  weapon:  { 4:55000,  5:160000,  6:520000,  7:1600000,  8:7500000  },
  offhand: { 4:18000,  5:55000,   6:180000,  7:560000,   8:2800000  },
  helmet:  { 4:28000,  5:85000,   6:280000,  7:850000,   8:4000000  },
  chest:   { 4:45000,  5:135000,  6:450000,  7:1350000,  8:6500000  },
  boots:   { 4:28000,  5:85000,   6:280000,  7:850000,   8:4000000  },
  food:    { 4:6000,   5:18000,   6:55000,   7:130000,   8:350000   },
  potion:  { 4:5000,   5:15000,   6:45000,   7:110000,   8:280000   },
};

// ── HP estimates per armor slot / type / tier ─────────────────
const BASE_HP = {
  helmet: { Cloth:390, Leather:430, Plate:530 },
  chest:  { Cloth:590, Leather:640, Plate:790 },
  boots:  { Cloth:280, Leather:310, Plate:390 },
};
const TIER_HP_BONUS = { 4:0, 5:180, 6:420, 7:850, 8:1600 }; // extra HP per tier above T4

// ── Item Power (IP) constants ─────────────────────────────────
const IP_BASE = { 4:400, 5:500, 6:600, 7:700, 8:800 };
// Enchantments add 100 per level (0→4)
const ENCHANT_BONUS = { 0:0, 1:100, 2:200, 3:300, 4:400 };

// Crafting materials by slot + armor type / weapon type
const CRAFT_RESOURCE = {
  // Weapons by weapon line
  weapon: {
    Swords:'Metal Bar', Axes:'Metal Bar', Hammers:'Metal Bar', Spears:'Metal Bar',
    Daggers:'Metal Bar', Crossbows:'Metal Bar',
    Bows:'Plank', Quarterstaffs:'Plank',
    'Fire Staffs':'Plank', 'Frost Staffs':'Plank', 'Cursed Staffs':'Plank',
    'Arcane Staffs':'Plank', 'Holy Staffs':'Plank', 'Nature Staffs':'Plank',
  },
  helmet:  { Cloth:'Cloth', Leather:'Leather', Plate:'Metal Bar' },
  chest:   { Cloth:'Cloth', Leather:'Leather', Plate:'Metal Bar' },
  boots:   { Cloth:'Cloth', Leather:'Leather', Plate:'Metal Bar' },
};

const RESOURCE_TIER_NAME = {
  'Metal Bar': { 4:'Copper Bar',    5:'Bronze Bar',  6:'Steel Bar',    7:'Titanium Bar',  8:'Runite Bar'     },
  'Plank':     { 4:'Birch Plank',   5:'Chestnut Pl.',6:'Pine Plank',   7:'Cedar Plank',   8:'Bloodoak Pl.'   },
  'Cloth':     { 4:'Simple Cloth',  5:'Fine Cloth',  6:'Elegant Cloth',7:'Master Cloth',  8:'Pristine Cloth' },
  'Leather':   { 4:'Thin Leather',  5:'Solid Leather',6:'Thick Leather',7:'Heavy Leather', 8:'Pristine Leather'},
};

const CRAFT_QTY = {
  weapon:  { 4:16, 5:20, 6:20, 7:20, 8:20 },
  offhand: { 4:8,  5:12, 6:12, 7:12, 8:12 },
  helmet:  { 4:8,  5:12, 6:12, 7:12, 8:12 },
  chest:   { 4:16, 5:20, 6:20, 7:20, 8:20 },
  boots:   { 4:8,  5:12, 6:12, 7:12, 8:12 },
};

// ── Builder state ─────────────────────────────────────────────
const builderState = {
  tier: 6,
  enchant: 0,
  slots: { weapon:null, offhand:null, helmet:null, chest:null, boots:null, food:null, potion:null },
};

let _pickerSlot = null;
let _pickerFilter = 'all';
let _pickerSearch = '';

// ── Helpers ───────────────────────────────────────────────────
// ── IP calculation ────────────────────────────────────────────
function calcSlotIP(tier, enchant) {
  return (IP_BASE[tier] || 600) + (ENCHANT_BONUS[enchant] || 0);
}

function calcAverageIP() {
  const gearSlots = ['weapon','offhand','helmet','chest','boots'];
  const filled = gearSlots.filter(s => builderState.slots[s]);
  if (!filled.length) return 0;
  const ip = calcSlotIP(builderState.tier, builderState.enchant);
  return Math.round(ip); // each filled slot at same tier/enchant
}

function ipQualityLabel(ip) {
  if (ip >= 1100) return { label:'Legendary', color:'#e8c96a' };
  if (ip >= 900)  return { label:'Rare',      color:'#b070e8' };
  if (ip >= 700)  return { label:'Uncommon',  color:'#4a7fc1' };
  if (ip >= 500)  return { label:'Standard',  color:'#4a9c6e' };
  return                 { label:'Basic',     color:'#7a8098' };
}

// ── Materials breakdown ───────────────────────────────────────
function calcMaterials() {
  const totals = {}; // resourceName → quantity
  const { tier, slots } = builderState;
  ['weapon','helmet','chest','boots'].forEach(slot => {
    const item = slots[slot];
    if (!item) return;
    let resType;
    if (slot === 'weapon') {
      resType = CRAFT_RESOURCE.weapon[item.line || item.weaponLine] || 'Metal Bar';
    } else {
      resType = CRAFT_RESOURCE[slot]?.[item.armorType] || 'Metal Bar';
    }
    const tieredName = RESOURCE_TIER_NAME[resType]?.[tier] || resType;
    totals[tieredName] = (totals[tieredName] || 0) + (CRAFT_QTY[slot]?.[tier] || 12);
  });
  if (slots.offhand) {
    const tieredName = RESOURCE_TIER_NAME['Metal Bar']?.[tier] || 'Metal Bar';
    totals[tieredName] = (totals[tieredName] || 0) + (CRAFT_QTY.offhand?.[tier] || 8);
  }
  return totals;
}

// ── Build URL share ───────────────────────────────────────────
function encodeBuildURL() {
  const s = builderState.slots;
  const parts = [
    s.weapon?.id  || '',
    s.offhand?.id || '',
    s.helmet?.id  || '',
    s.chest?.id   || '',
    s.boots?.id   || '',
    s.food?.id    || '',
    s.potion?.id  || '',
    builderState.tier,
    builderState.enchant,
  ];
  return '#build=' + parts.join('|');
}

function decodeBuildFromURL() {
  const hash = window.location.hash;
  if (!hash.startsWith('#build=')) return false;
  const parts = hash.slice(7).split('|');
  if (parts.length < 9) return false;
  const [wId, oId, hId, cId, bId, fId, pId, tier, enchant] = parts;
  builderState.tier    = parseInt(tier)    || 6;
  builderState.enchant = parseInt(enchant) || 0;

  const allArmor = [...(armorData.helmets||[]),...(armorData.chests||[]),...(armorData.boots||[])];
  builderState.slots = {
    weapon:  wId ? (() => { const w = weaponsData.find(x=>x.id===wId); return w ? {...w, renderId:weaponRenderIds[w.id]||null} : null; })() : null,
    offhand: oId ? (offhandItems.find(x=>x.id===oId) || null) : null,
    helmet:  hId ? (() => { const a = allArmor.find(x=>x.id===hId); return a ? {...a, renderId:armorRenderIds[a.id]||null} : null; })() : null,
    chest:   cId ? (() => { const a = allArmor.find(x=>x.id===cId); return a ? {...a, renderId:armorRenderIds[a.id]||null} : null; })() : null,
    boots:   bId ? (() => { const a = allArmor.find(x=>x.id===bId); return a ? {...a, renderId:armorRenderIds[a.id]||null} : null; })() : null,
    food:    fId ? (foodItems.find(x=>x.id===fId)    || null) : null,
    potion:  pId ? (potionItems.find(x=>x.id===pId)  || null) : null,
  };
  return true;
}

function fmtSilver(n) {
  if (!n) return '—';
  if (n >= 1000000) return (n/1000000).toFixed(n>=10000000?0:1) + 'M';
  if (n >= 1000)    return Math.round(n/1000) + 'k';
  return n.toLocaleString();
}

function detectRole(state) {
  const w = state.slots.weapon;
  const c = state.slots.chest;
  if (!w) return 'Unset';
  const line = w.line || w.weaponLine || '';
  const at   = c?.armorType || '';
  if (['Holy Staffs','Nature Staffs'].includes(line))                               return 'Healer';
  if (['Hammers','Axes'].includes(line) && at === 'Plate')                          return 'Tank';
  if (['Swords','Spears','Quarterstaffs'].includes(line) && at === 'Plate')         return 'Frontline';
  if (['Fire Staffs','Frost Staffs','Cursed Staffs','Arcane Staffs'].includes(line))return 'Caster DPS';
  if (['Bows','Crossbows'].includes(line))                                           return 'Ranged DPS';
  if (['Daggers'].includes(line))                                                    return 'Assassin';
  if (['Swords','Axes','Spears'].includes(line))                                     return 'Melee DPS';
  return 'Hybrid';
}

function detectDmgType(state) {
  const w = state.slots.weapon;
  if (!w) return '—';
  const line = w.line || w.weaponLine || '';
  const magic = ['Fire Staffs','Frost Staffs','Cursed Staffs','Nature Staffs','Holy Staffs','Arcane Staffs'];
  if (magic.includes(line)) return 'Magic';
  if (['Bows','Crossbows'].includes(line)) return 'Ranged';
  return 'Physical';
}

function calcTotalHP(state) {
  let hp = 900; // base character HP
  const food = state.slots.food;
  if (food) hp += food.hp || 0;
  ['helmet','chest','boots'].forEach(slot => {
    const item = state.slots[slot];
    if (!item) return;
    const at = item.armorType || 'Cloth';
    const base = BASE_HP[slot]?.[at] || 300;
    const tierBonus = TIER_HP_BONUS[state.tier] || 0;
    hp += base + tierBonus;
  });
  return hp;
}

function calcTotalCost(state) {
  let total = 0;
  const slotTypes = {
    weapon:'weapon', offhand:'offhand', helmet:'helmet',
    chest:'chest', boots:'boots', food:'food', potion:'potion'
  };
  Object.entries(slotTypes).forEach(([slot, type]) => {
    if (state.slots[slot]) {
      total += SILVER_COST[type]?.[state.tier] || 0;
    }
  });
  return total;
}

function calcItemCost(slotType) {
  return SILVER_COST[slotType]?.[builderState.tier] || 0;
}

// ── Render the full builder UI ────────────────────────────────
function renderCharacterBuilder() {
  const container = document.getElementById('builderContainer');
  if (!container) return;

  const ip      = calcAverageIP();
  const ipInfo  = ipQualityLabel(ip);
  const filledGear = ['weapon','offhand','helmet','chest','boots'].filter(s => builderState.slots[s]).length;

  container.innerHTML = `
    <div class="builder-wrap">

      <!-- Top control bar -->
      <div class="builder-topbar">
        <div class="builder-topbar-left">
          <span class="builder-tier-label">Tier</span>
          <div class="builder-tier-btns">
            ${[4,5,6,7,8].map(t => `<button class="tier-btn ${builderState.tier===t?'active':''}" onclick="setBuilderTier(${t})">T${t}</button>`).join('')}
          </div>
          <span class="builder-tier-label" style="margin-left:12px">Enchant</span>
          <div class="builder-tier-btns">
            ${[0,1,2,3,4].map(e => `<button class="tier-btn enchant-btn ${builderState.enchant===e?'active':''}" onclick="setEnchant(${e})" title="+${e*100} IP">.${e}</button>`).join('')}
          </div>
        </div>
        <div class="builder-topbar-right">
          <button class="btn btn-outline" style="font-size:11px;padding:5px 10px" onclick="randomBuild()">🎲 Random</button>
          <button class="btn btn-outline" style="font-size:11px;padding:5px 10px" onclick="clearAllSlots()">🗑️ Clear</button>
          <button class="btn btn-outline" style="font-size:11px;padding:5px 10px" onclick="shareBuild()">🔗 Share</button>
        </div>
      </div>

      <!-- Main 3-col layout -->
      <div class="builder-main builder-paperdoll-layout">

        <!-- LEFT: paperdoll + equipment -->
        <div class="paperdoll-section">

          <!-- IP badge -->
          <div class="ip-display-bar">
            <div class="ip-badge-wrap">
              <div class="ip-number" style="color:${ipInfo.color}">${ip || '—'}</div>
              <div class="ip-label">Item Power</div>
              ${ip ? `<div class="ip-quality" style="color:${ipInfo.color}">${ipInfo.label}</div>` : ''}
            </div>
            <div class="ip-slot-count">${filledGear}/5 gear slots</div>
          </div>

          <!-- Paperdoll -->
          <div class="paperdoll">
            <!-- Row 1: helmet -->
            <div class="pd-row pd-row-head">
              <div class="pd-spacer"></div>
              ${renderPdSlot('helmet','⛑️','Helmet')}
              <div class="pd-spacer"></div>
            </div>
            <!-- Row 2: weapon · silhouette · offhand -->
            <div class="pd-row pd-row-body">
              ${renderPdSlot('weapon','⚔️','Main Hand')}
              <div class="pd-silhouette">
                <svg viewBox="0 0 80 180" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="18" r="14" fill="currentColor" opacity=".18"/>
                  <rect x="22" y="35" width="36" height="52" rx="6" fill="currentColor" opacity=".14"/>
                  <rect x="8"  y="37" width="12" height="38" rx="5" fill="currentColor" opacity=".12"/>
                  <rect x="60" y="37" width="12" height="38" rx="5" fill="currentColor" opacity=".12"/>
                  <rect x="24" y="88" width="13" height="52" rx="5" fill="currentColor" opacity=".12"/>
                  <rect x="43" y="88" width="13" height="52" rx="5" fill="currentColor" opacity=".12"/>
                </svg>
                ${ip ? `<div class="pd-ip-overlay" style="color:${ipInfo.color}">${ip} IP</div>` : '<div class="pd-ip-overlay" style="color:var(--text-dim);font-size:11px">Equip items</div>'}
              </div>
              ${renderPdSlot('offhand','🛡️','Off Hand')}
            </div>
            <!-- Row 3: empty · chest · empty -->
            <div class="pd-row pd-row-chest">
              <div class="pd-spacer"></div>
              ${renderPdSlot('chest','👕','Chest')}
              <div class="pd-spacer"></div>
            </div>
            <!-- Row 4: empty · boots · empty -->
            <div class="pd-row pd-row-boots">
              <div class="pd-spacer"></div>
              ${renderPdSlot('boots','👟','Boots')}
              <div class="pd-spacer"></div>
            </div>
            <!-- Row 5: food · gap · potion -->
            <div class="pd-row pd-row-consumables">
              ${renderPdSlot('food','🍗','Food')}
              <div class="pd-spacer"></div>
              ${renderPdSlot('potion','🧪','Potion')}
            </div>
          </div>

          <!-- Abilities bar -->
          <div class="pd-abilities">
            ${renderAbilitiesBar()}
          </div>
        </div>

        <!-- RIGHT: stats panel -->
        <div class="builder-stats" id="builderStats">
          ${renderBuilderStats()}
        </div>
      </div>
    </div>

    <!-- Item Picker Modal -->
    <div class="picker-overlay" id="pickerOverlay">
      <div class="picker-modal">
        <div class="picker-header">
          <div class="picker-title" id="pickerTitle">⚔️ Select Item</div>
          <button class="picker-close" onclick="closePicker()">✕</button>
        </div>
        <div class="picker-search-row">
          <input class="picker-search" id="pickerSearch" placeholder="Search items…" oninput="filterPicker(this.value)" autocomplete="off" />
        </div>
        <div class="picker-filter-row" id="pickerFilters"></div>
        <div class="picker-grid" id="pickerGrid"></div>
      </div>
    </div>`;
}

// ── Paperdoll slot (compact) ──────────────────────────────────
function renderPdSlot(slotKey, emoji, label) {
  const item = builderState.slots[slotKey];
  const ip   = item ? calcSlotIP(builderState.tier, builderState.enchant) : 0;
  if (!item) {
    return `
      <div class="pd-slot empty" onclick="openPicker('${slotKey}')" title="Click to equip ${label}">
        <div class="pd-slot-emoji">${emoji}</div>
        <div class="pd-slot-label">${label}</div>
      </div>`;
  }
  const rid  = item.renderId ? itemImg(item.renderId, 64) : null;
  const name = (item.name||'').replace(/\s*\(T\d[^)]*\)/gi,'').trim();
  return `
    <div class="pd-slot filled" onclick="openPicker('${slotKey}')" title="${name}">
      <button class="pd-slot-clear" onclick="event.stopPropagation();clearSlot('${slotKey}')" title="Remove">✕</button>
      <div class="pd-slot-img-wrap">
        <div class="pd-slot-emoji-bg">${emoji}</div>
        ${rid ? `<img src="${rid}" alt="${name}" class="pd-slot-img" onerror="this.remove()" />` : ''}
      </div>
      <div class="pd-slot-name">${name}</div>
      <div class="pd-slot-ip">${ip} IP</div>
    </div>`;
}

function renderAbilitiesBar() {
  const s = builderState.slots;
  const rows = [
    { icon:'⚔️', label:'Weapon',  text: s.weapon?.keyAbility   },
    { icon:'🛡️', label:'Offhand', text: s.offhand?.ability      },
    { icon:'⛑️', label:'Helmet',  text: s.helmet?.ability       },
    { icon:'👕', label:'Chest',   text: s.chest?.ability        },
    { icon:'👟', label:'Boots',   text: s.boots?.ability        },
  ].filter(r => r.text);

  if (!rows.length) return '<div class="pd-abilities-empty">Equip items to see abilities</div>';
  return rows.map(r => `
    <div class="pd-ability-row">
      <span class="pd-ab-icon">${r.icon}</span>
      <span class="pd-ab-ability">${r.text.split('—')[0].trim()}</span>
    </div>`).join('');
}

function calcFullSetCost() {
  let total = 0;
  ['weapon','offhand','helmet','chest','boots','food','potion'].forEach(slot => {
    total += SILVER_COST[slot]?.[builderState.tier] || 0;
  });
  return total;
}

function renderSlot(slotKey, emoji, label) {
  const item = builderState.slots[slotKey];

  if (!item) {
    return `
      <div class="builder-slot" onclick="openPicker('${slotKey}')">
        <div class="slot-label">${label}</div>
        <div class="slot-content">
          <div class="slot-img-wrap">${emoji}</div>
          <span class="slot-empty-text">Click to select…</span>
        </div>
      </div>`;
  }

  const rid  = item.renderId ? itemImg(item.renderId, 56) : null;
  const name = item.name || 'Unknown';

  return `
    <div class="builder-slot filled" onclick="openPicker('${slotKey}')">
      <button class="slot-clear-btn" onclick="event.stopPropagation();clearSlot('${slotKey}')" title="Remove">✕</button>
      <div class="slot-label">${label}</div>
      <div class="slot-content">
        <div class="slot-img-wrap">
          ${emoji}
          ${rid ? `<img class="slot-item-img" src="${rid}" alt="${name}" onerror="this.remove()" />` : ''}
        </div>
        <div class="slot-text">
          <div class="slot-item-name">${name}</div>
          <div class="slot-item-sub">${item.keyAbility ? item.keyAbility.split('—')[0].trim() : item.effect || item.ability || ''}</div>
        </div>
      </div>
      <div class="slot-tier-badge">T${builderState.tier}</div>
    </div>`;
}

function renderBuilderStats() {
  const state  = builderState;
  const totalHP   = calcTotalHP(state);
  const ip        = calcAverageIP();
  const ipInfo    = ipQualityLabel(ip);
  const role      = detectRole(state);
  const dmgType   = detectDmgType(state);
  const filledCount = Object.values(state.slots).filter(Boolean).length;
  const maxHP = calcTotalHP({ ...state, slots: {
    weapon: {}, offhand: {},
    helmet: { armorType:'Plate' }, chest: { armorType:'Plate' }, boots: { armorType:'Plate' },
    food: foodItems[0], potion: {},
  }, tier: 8 });
  const hpPct = Math.min(100, Math.round((totalHP / maxHP) * 100));

  const costRows = [
    ['Weapon',  'weapon'],
    ['Off-hand','offhand'],
    ['Helmet',  'helmet'],
    ['Chest',   'chest'],
    ['Boots',   'boots'],
    ['Food',    'food'],
    ['Potion',  'potion'],
  ].map(([label, key]) => {
    const hasItem = !!state.slots[key];
    const live = hasItem ? getLivePrice(key) : null;
    const cost = hasItem ? fmtSilver(live ? live.price : calcItemCost(key)) : '—';
    const badge = live ? `<span title="Live from ${live.city}" style="font-size:9px;background:rgba(74,156,110,0.2);color:#4a9c6e;border:1px solid rgba(74,156,110,0.3);border-radius:3px;padding:0 4px;margin-left:4px">LIVE</span>` : '';
    return `
      <div class="cost-row">
        <span class="cost-row-slot">${label}${hasItem ? ` <span style="color:var(--text-dim)">(T${state.tier}${state.enchant?'.'+state.enchant:''})</span>${badge}` : ''}</span>
        <span class="cost-row-val ${hasItem?'':'empty'}">${cost}</span>
      </div>`;
  }).join('');

  const liveTotalCost = (() => {
    let t = 0;
    ['weapon','offhand','helmet','chest','boots','food','potion'].forEach(slot => {
      if (!state.slots[slot]) return;
      const live = getLivePrice(slot);
      t += live ? live.price : (SILVER_COST[slot]?.[state.tier] || 0);
    });
    return t;
  })();
  const anyLive = Object.keys(_livePrices).some(k => state.slots[k]);
  const liveLabel = anyLive ? '<span style="font-size:10px;background:rgba(74,156,110,0.15);color:#4a9c6e;border:1px solid rgba(74,156,110,0.3);border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:middle">LIVE</span>' : '';

  const roleColor = {
    Healer:'#90d090', Tank:'#80b0e0', Assassin:'#e08080', 'Caster DPS':'#b090e8',
    'Ranged DPS':'#70c090', 'Melee DPS':'#e09070', Frontline:'#80a8d0', Hybrid:'#c9a84c'
  }[role] || 'var(--text)';

  // Materials
  const mats = calcMaterials();
  const matRows = Object.entries(mats).map(([name, qty]) => `
    <div class="cost-row">
      <span class="cost-row-slot">${name}</span>
      <span class="cost-row-val">× ${qty}</span>
    </div>`).join('');

  return `
    <!-- IP Panel -->
    <div class="stat-panel ip-stat-panel">
      <div class="stat-panel-title">⚡ Item Power</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div style="font-family:'Cinzel',serif;font-size:36px;font-weight:700;color:${ipInfo.color};line-height:1">${ip||'—'}</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:${ipInfo.color}">${ip ? ipInfo.label : 'No gear'}</div>
          <div style="font-size:11px;color:var(--text-dim)">T${state.tier}${state.enchant?'.'+state.enchant:''} gear</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${['weapon','offhand','helmet','chest','boots'].map(slot => {
          const has = !!state.slots[slot];
          const slotIp = has ? calcSlotIP(state.tier, state.enchant) : 0;
          const icons = { weapon:'⚔️', offhand:'🛡️', helmet:'⛑️', chest:'👕', boots:'👟' };
          return `<div style="font-size:11px;color:${has?'var(--text)':'var(--border)'};display:flex;justify-content:space-between;padding:3px 6px;background:var(--bg-card);border-radius:5px;border:1px solid ${has?'rgba(201,168,76,0.2)':'var(--border)'}">${icons[slot]} ${slot}<span style="color:${has?ipInfo.color:'var(--border)'}">${has?slotIp:'-'}</span></div>`;
        }).join('')}
      </div>
    </div>

    <!-- Cost -->
    <div class="stat-panel">
      <div class="stat-panel-title">💰 Silver Cost</div>
      <div class="cost-total">
        <span class="cost-total-num">${fmtSilver(liveTotalCost)}${liveLabel}</span>
        <span class="cost-total-label">silver${liveTotalCost===0?' (nothing equip.)':''}</span>
      </div>
      <div class="cost-rows">${costRows}</div>
    </div>

    <!-- Character Stats -->
    <div class="stat-panel">
      <div class="stat-panel-title">📊 Character Stats</div>
      <div class="hp-display">
        <div class="hp-num-row">
          <span class="hp-number">${totalHP.toLocaleString()}</span>
          <span class="hp-label">est. HP</span>
        </div>
        <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width:${hpPct}%"></div></div>
      </div>
      <div class="combat-stats">
        <div class="combat-stat"><div class="cs-label">Role</div><div class="cs-value" style="color:${roleColor}">${role}</div></div>
        <div class="combat-stat"><div class="cs-label">Damage</div><div class="cs-value">${dmgType}</div></div>
        <div class="combat-stat"><div class="cs-label">Slots</div><div class="cs-value">${filledCount}/7</div></div>
        <div class="combat-stat"><div class="cs-label">Enchant</div><div class="cs-value" style="color:var(--gold)">${state.enchant>0?'+'+state.enchant:'.0'}</div></div>
      </div>
      ${filledCount >= 2 ? `<div style="margin-top:8px;font-size:11px;color:var(--text-dim);padding:6px 8px;background:var(--bg-card);border-radius:6px;border-left:2px solid var(--gold-dim)">💡 ${getBuildTip(state)}</div>` : ''}
    </div>

    ${matRows ? `
    <!-- Materials -->
    <div class="stat-panel">
      <div class="stat-panel-title">🪨 Crafting Materials</div>
      <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Approx. refined resources to craft this gear (T${state.tier})</div>
      <div class="cost-rows">${matRows}</div>
    </div>` : ''}

    <!-- Actions -->
    <div class="stat-panel">
      <div class="stat-panel-title">🔗 Actions</div>
      <div class="builder-actions-row">
        <button class="btn btn-primary" onclick="copyBuilderBuild()" style="font-size:12px;padding:8px 16px">📋 Copy</button>
        <button class="btn btn-outline" onclick="shareBuild()" style="font-size:12px;padding:8px 16px">🔗 Share URL</button>
        <a class="btn btn-outline" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('T'+state.tier+'.'+state.enchant+' '+role+' build — '+ip+' IP. Full guide: https://albionnewbs.netlify.app')}" target="_blank" rel="noopener" style="font-size:12px;padding:8px 16px">𝕏 Tweet</a>
      </div>
    </div>`;
}

function getBuildTip(state) {
  const role = detectRole(state);
  const tips = {
    Healer:    'Always bring Soup food for the +healing received bonus. Energy Potion is essential for long fights.',
    Tank:      'Use Beef Stew for +HP and resistance. Resistance Potion is your panic button when burst-focused.',
    Assassin:  'Pork Omelette maximises your HP pool. Resistance Potion when they counter-burst.',
    'Caster DPS': 'Scholar Robe is your best friend for energy sustain. Healing Potion for solo content.',
    'Ranged DPS': 'Hunter Jacket with Bloodlust self-heal is extremely strong for sustained farming.',
    'Melee DPS':  'Pork Omelette + Resistance Potion is the standard combo for any melee fighter.',
    Frontline:    'Beef Stew for the physical resistance. You are the shield — always have a Resistance Potion.',
  };
  return tips[role] || 'Mix and match armor types to find unexpected ability combinations.';
}

// ── Picker logic ──────────────────────────────────────────────
const SLOT_CONFIG = {
  weapon:  { title:'⚔️ Select Weapon',   filters:['All','Melee','Ranged','Magic'] },
  offhand: { title:'🛡️ Select Off-Hand', filters:['All'] },
  helmet:  { title:'⛑️ Select Helmet',   filters:['All','Cloth','Leather','Plate'] },
  chest:   { title:'👕 Select Chest',    filters:['All','Cloth','Leather','Plate'] },
  boots:   { title:'👟 Select Boots',    filters:['All','Cloth','Leather','Plate'] },
  food:    { title:'🍗 Select Food',     filters:['All'] },
  potion:  { title:'🧪 Select Potion',   filters:['All'] },
};

function openPicker(slot) {
  _pickerSlot   = slot;
  _pickerFilter = 'all';
  _pickerSearch = '';
  const cfg = SLOT_CONFIG[slot];
  document.getElementById('pickerTitle').textContent = cfg.title;
  document.getElementById('pickerSearch').value = '';
  renderPickerFilters(cfg.filters);
  renderPickerGrid();
  document.getElementById('pickerOverlay').classList.add('open');
  setTimeout(() => document.getElementById('pickerSearch')?.focus(), 100);
}

function closePicker() {
  document.getElementById('pickerOverlay')?.classList.remove('open');
  _pickerSlot = null;
}

function renderPickerFilters(filters) {
  const row = document.getElementById('pickerFilters');
  row.innerHTML = filters.map(f => `
    <button class="picker-filter ${_pickerFilter===(f.toLowerCase())?'active':''}"
      onclick="setPickerFilter('${f.toLowerCase()}')">${f}</button>`).join('');
}

function setPickerFilter(f) {
  _pickerFilter = f;
  renderPickerFilters(SLOT_CONFIG[_pickerSlot]?.filters || ['All']);
  renderPickerGrid();
}

function filterPicker(q) {
  _pickerSearch = q.toLowerCase();
  renderPickerGrid();
}

function renderPickerGrid() {
  const grid = document.getElementById('pickerGrid');
  if (!grid || !_pickerSlot) return;

  let items = [];
  const slot = _pickerSlot;

  if (slot === 'weapon') {
    items = weaponsData
      .filter(w => {
        if (_pickerFilter !== 'all') {
          const map = { melee:'Melee', ranged:'Ranged', magic:'Magic' };
          if (w.type !== map[_pickerFilter]) return false;
        }
        if (_pickerSearch) {
          return w.name.toLowerCase().includes(_pickerSearch) ||
                 w.line.toLowerCase().includes(_pickerSearch) ||
                 w.role.toLowerCase().includes(_pickerSearch);
        }
        return true;
      })
      .map(w => ({
        id: w.id, name: w.name, sub: w.line + ' · ' + w.role,
        renderId: weaponRenderIds[w.id] || null,
        emoji: w.lineIcon || '⚔️',
        keyAbility: w.keyAbility, line: w.line, type: w.type,
      }));

  } else if (['helmet','chest','boots'].includes(slot)) {
    const slotMap = { helmet:'Head', chest:'Chest', boots:'Boots' };
    const allArmor = [...(armorData.helmets||[]),...(armorData.chests||[]),...(armorData.boots||[])];
    items = allArmor
      .filter(a => {
        if (a.slot !== slotMap[slot]) return false;
        if (_pickerFilter !== 'all' && a.armorType.toLowerCase() !== _pickerFilter) return false;
        if (_pickerSearch) {
          return a.name.toLowerCase().includes(_pickerSearch) ||
                 a.armorType.toLowerCase().includes(_pickerSearch);
        }
        return true;
      })
      .map(a => ({
        id: a.id, name: a.name, sub: a.armorType + ' · ' + a.role,
        renderId: armorRenderIds[a.id] || null,
        emoji: { Cloth:'🧣', Leather:'🥋', Plate:'🛡️' }[a.armorType] || '🎽',
        ability: a.ability, armorType: a.armorType,
      }));

  } else if (slot === 'offhand') {
    items = offhandItems
      .filter(o => !_pickerSearch || o.name.toLowerCase().includes(_pickerSearch))
      .map(o => ({ ...o, sub: o.ability.split('—')[0].trim() }));

  } else if (slot === 'food') {
    items = foodItems
      .filter(f => !_pickerSearch || f.name.toLowerCase().includes(_pickerSearch))
      .map(f => ({ ...f, sub: f.effect }));

  } else if (slot === 'potion') {
    items = potionItems
      .filter(p => !_pickerSearch || p.name.toLowerCase().includes(_pickerSearch))
      .map(p => ({ ...p, sub: p.effect }));
  }

  if (!items.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:20px;text-align:center;color:var(--text-dim)">No items match your search.</div>';
    return;
  }

  const current = builderState.slots[_pickerSlot];

  grid.innerHTML = items.map(item => {
    const imgSrc = item.renderId ? itemImg(item.renderId, 56) : null;
    const isSelected = current?.id === item.id;
    return `
      <div class="picker-item ${isSelected?'selected':''}" onclick="selectItem('${item.id}')">
        <div style="position:relative;width:40px;height:40px;flex-shrink:0">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px">${item.emoji||'📦'}</div>
          ${imgSrc ? `<img class="picker-item-img" src="${imgSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" onerror="this.remove()" />` : ''}
        </div>
        <div class="picker-item-info">
          <div class="picker-item-name">${item.name}</div>
          <div class="picker-item-sub">${item.sub || ''}</div>
        </div>
      </div>`;
  }).join('');
}

function selectItem(itemId) {
  if (!_pickerSlot) return;
  const slot = _pickerSlot;

  // Find the item in the relevant data source
  let item = null;

  if (slot === 'weapon') {
    const w = weaponsData.find(x => x.id === itemId);
    if (w) item = { ...w, renderId: weaponRenderIds[w.id] || null };
  } else if (['helmet','chest','boots'].includes(slot)) {
    const allArmor = [...(armorData.helmets||[]),...(armorData.chests||[]),...(armorData.boots||[])];
    const a = allArmor.find(x => x.id === itemId);
    if (a) item = { ...a, renderId: armorRenderIds[a.id] || null };
  } else if (slot === 'offhand') {
    item = offhandItems.find(x => x.id === itemId);
  } else if (slot === 'food') {
    item = foodItems.find(x => x.id === itemId);
  } else if (slot === 'potion') {
    item = potionItems.find(x => x.id === itemId);
  }

  if (item) {
    builderState.slots[slot] = item;
    closePicker();
    refreshBuilder();
    showToast(`${item.name} equipped!`);
    setTimeout(fetchAndApplyLivePrices, 100);
  }
}

function refreshBuilder() {
  // Re-render slots and stats without rebuilding the whole modal
  const container = document.getElementById('builderContainer');
  if (!container) return;
  renderCharacterBuilder();
}

function clearSlot(slot) {
  builderState.slots[slot] = null;
  refreshBuilder();
}

function clearAllSlots() {
  Object.keys(builderState.slots).forEach(k => builderState.slots[k] = null);
  _livePrices = {};
  refreshBuilder();
  showToast('All slots cleared');
}

function setBuilderTier(tier) {
  builderState.tier = tier;
  _livePrices = {};
  refreshBuilder();
  setTimeout(fetchAndApplyLivePrices, 100);
}

function setEnchant(level) {
  builderState.enchant = level;
  refreshBuilder();
}

function shareBuild() {
  const url = window.location.href.split('#')[0] + encodeBuildURL();
  navigator.clipboard.writeText(url)
    .then(() => showToast('Build URL copied! Share it with anyone.'))
    .catch(() => {
      // Fallback: update hash and show it
      window.history.replaceState(null, '', url);
      showToast('URL updated — copy from address bar!');
    });
}

// Close picker on overlay click or ESC
document.addEventListener('click', e => {
  if (e.target.id === 'pickerOverlay') closePicker();
});

// ── Random Build ──────────────────────────────────────────────
function randomBuild() {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const allArmor = [...(armorData.helmets||[]),...(armorData.chests||[]),...(armorData.boots||[])];

  // Pick a random weapon and match armor type
  const weapon = pick(weaponsData);
  const armorPref = ['Fire Staffs','Frost Staffs','Cursed Staffs','Nature Staffs','Holy Staffs','Arcane Staffs'].includes(weapon.line)
    ? 'Cloth'
    : ['Bows','Crossbows','Daggers'].includes(weapon.line)
    ? 'Leather' : 'Plate';

  builderState.slots = {
    weapon:  { ...weapon, renderId: weaponRenderIds[weapon.id] || null },
    offhand: pick(offhandItems),
    helmet:  (() => { const a = allArmor.filter(x=>x.slot==='Head'&&x.armorType===armorPref); const item = pick(a); return item ? { ...item, renderId: armorRenderIds[item.id]||null } : null; })(),
    chest:   (() => { const a = allArmor.filter(x=>x.slot==='Chest'&&x.armorType===armorPref); const item = pick(a); return item ? { ...item, renderId: armorRenderIds[item.id]||null } : null; })(),
    boots:   (() => { const a = allArmor.filter(x=>x.slot==='Boots'&&x.armorType===armorPref); const item = pick(a); return item ? { ...item, renderId: armorRenderIds[item.id]||null } : null; })(),
    food:    pick(foodItems),
    potion:  pick(potionItems),
  };

  refreshBuilder();
  showToast('Random build generated!');
}

// ── Build from meta loadout ───────────────────────────────────
function buildFromMeta(buildId) {
  const build = (typeof metaBuilds !== 'undefined') && metaBuilds.find(b => b.id === buildId);
  if (!build || !build.loadout) return;

  const allArmor = [...(armorData.helmets||[]),...(armorData.chests||[]),...(armorData.boots||[])];

  function normMatch(name, candidates) {
    const norm = n => n.toLowerCase().replace(/'/g,'').replace(/\s*\(t[0-9][^)]*\)/gi,'').replace(/\s+/g,' ').trim();
    const key = norm(name);
    return candidates.find(c => norm(c.name) === key) ||
           candidates.find(c => norm(c.name).startsWith(key)) ||
           candidates.find(c => key.startsWith(norm(c.name).split(' ')[0]));
  }

  const lo = build.loadout;
  builderState.tier = 6;

  // Weapon
  if (lo.weapon?.name) {
    const w = normMatch(lo.weapon.name, weaponsData);
    builderState.slots.weapon = w ? { ...w, renderId: weaponRenderIds[w.id] || null } : null;
  }
  // Off-hand
  if (lo.offhand?.name) {
    const o = normMatch(lo.offhand.name, offhandItems);
    builderState.slots.offhand = o || null;
  }
  // Helmet
  if (lo.helmet?.name) {
    const heads = allArmor.filter(a => a.slot === 'Head');
    const h = normMatch(lo.helmet.name, heads);
    builderState.slots.helmet = h ? { ...h, renderId: armorRenderIds[h.id] || null } : null;
  }
  // Chest
  if (lo.chest?.name) {
    const chests = allArmor.filter(a => a.slot === 'Chest');
    const c = normMatch(lo.chest.name, chests);
    builderState.slots.chest = c ? { ...c, renderId: armorRenderIds[c.id] || null } : null;
  }
  // Boots
  if (lo.boots?.name) {
    const boots = allArmor.filter(a => a.slot === 'Boots');
    const b = normMatch(lo.boots.name, boots);
    builderState.slots.boots = b ? { ...b, renderId: armorRenderIds[b.id] || null } : null;
  }
  // Food
  if (lo.food?.name) {
    const f = normMatch(lo.food.name, foodItems);
    builderState.slots.food = f || null;
  }
  // Potion
  if (lo.potion?.name) {
    const p = normMatch(lo.potion.name, potionItems);
    builderState.slots.potion = p || null;
  }

  // Navigate to builder, render, then fetch live prices
  closeQuiz?.();
  showSection('character-builder');
  setTimeout(() => {
    renderCharacterBuilder();
    fetchAndApplyLivePrices();
    showToast(`🎮 ${build.name} loaded!`);
  }, 150);
}

// Live price state
let _livePrices = {}; // slotName → {price, city}
let _livePricePending = false;

async function fetchAndApplyLivePrices() {
  if (!window.AlbionPrices) return;
  if (_livePricePending) return;
  _livePricePending = true;

  // Show "fetching" badge on cost panel
  const costNum = document.querySelector('.cost-total-num');
  if (costNum) costNum.innerHTML += ' <span id="liveBadge" style="font-size:11px;color:var(--text-dim);vertical-align:middle">⏳</span>';

  try {
    _livePrices = await AlbionPrices.fetchBuilderPrices(builderState);
    // Re-render stats panel with live data
    const statsEl = document.getElementById('builderStats');
    if (statsEl) statsEl.innerHTML = renderBuilderStats();
  } finally {
    _livePricePending = false;
  }
}

function getLivePrice(slot) {
  return _livePrices[slot] || null;
}

function calcItemCostLive(slotKey) {
  const live = getLivePrice(slotKey);
  return live ? live.price : calcItemCost(slotKey);
}

// ── Copy build text ───────────────────────────────────────────
function copyBuilderBuild() {
  const s = builderState;
  const lines = [
    `=== ${detectRole(s)} Build (T${s.tier}) — Albion Online ===`,
    `Est. Cost: ${fmtSilver(calcTotalCost(s))} silver | Est. HP: ${calcTotalHP(s).toLocaleString()}`,
    '',
    'LOADOUT:',
    s.slots.weapon  ? `  Weapon:  ${s.slots.weapon.name}`  : '  Weapon:  (empty)',
    s.slots.offhand ? `  Off-hand: ${s.slots.offhand.name}` : '  Off-hand: (empty)',
    s.slots.helmet  ? `  Helmet:  ${s.slots.helmet.name}`  : '  Helmet:  (empty)',
    s.slots.chest   ? `  Chest:   ${s.slots.chest.name}`   : '  Chest:   (empty)',
    s.slots.boots   ? `  Boots:   ${s.slots.boots.name}`   : '  Boots:   (empty)',
    s.slots.food    ? `  Food:    ${s.slots.food.name}`    : '',
    s.slots.potion  ? `  Potion:  ${s.slots.potion.name}`  : '',
    '',
    'ABILITIES:',
    s.slots.weapon?.keyAbility ? `  ${s.slots.weapon.keyAbility}` : '',
    s.slots.helmet?.ability    ? `  Helmet: ${s.slots.helmet.ability.split('—')[0].trim()}` : '',
    s.slots.chest?.ability     ? `  Chest: ${s.slots.chest.ability.split('—')[0].trim()}`  : '',
    s.slots.boots?.ability     ? `  Boots: ${s.slots.boots.ability.split('—')[0].trim()}`  : '',
    '',
    'Full guide: https://albionnewbs.netlify.app',
  ].filter(l => l !== null).join('\n');

  navigator.clipboard.writeText(lines).then(() => showToast('Build copied!')).catch(() => showToast('Copy failed', 'error'));
}

// ── Auto-load build from URL hash on page load ────────────────
if (window.location.hash.startsWith('#build=')) {
  // Defer until all data scripts are loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (decodeBuildFromURL()) {
      // Navigate to builder section if not already there
      if (typeof showSection === 'function') {
        showSection('character-builder');
      }
    }
  });
}
