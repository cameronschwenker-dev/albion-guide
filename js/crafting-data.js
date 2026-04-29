// ============================================================
// CRAFTING DATA
// ============================================================

// Raw resource and refined material names by tier
const resourceNames = {
  ore: {
    icon: '🪨',
    label: 'Ore → Metal Bars',
    usedIn: 'Plate armour, Swords, Axes, Hammers, Crossbows, Spears',
    raw:     { 2:'Limestone', 3:'Iron Ore', 4:'Titanium Ore', 5:'Runite Ore', 6:'Meteorite', 7:'Adamantium', 8:'Nightstone' },
    refined: { 2:'Copper Bar', 3:'Bronze Bar', 4:'Steel Bar', 5:'Titanium Steel Bar', 6:'Runite Steel Bar', 7:'Adamantium Steel Bar', 8:'Nightsteel Bar' },
  },
  wood: {
    icon: '🌲',
    label: 'Logs → Planks',
    usedIn: 'Staffs, Bows, Spears, Quarterstaffs, Crossbows',
    raw:     { 2:'Birch', 3:'Chestnut', 4:'Pine', 5:'Cedar', 6:'Bloodoak', 7:'Ashenbark', 8:'Whitewood' },
    refined: { 2:'Birch Plank', 3:'Chestnut Plank', 4:'Pine Plank', 5:'Cedar Plank', 6:'Bloodoak Plank', 7:'Ashenbark Plank', 8:'Whitewood Plank' },
  },
  fiber: {
    icon: '🌿',
    label: 'Fiber → Cloth',
    usedIn: 'Cloth armour (Robes, Cowls, Sandals), Bows, Staffs',
    raw:     { 2:'Cotton', 3:'Flax', 4:'Hemp', 5:'Skyflower', 6:'Redleaf Cotton', 7:'Sunflower', 8:'Wiregrass' },
    refined: { 2:'Simple Cloth', 3:'Neat Cloth', 4:'Fine Cloth', 5:'Ornate Cloth', 6:'Lavish Cloth', 7:'Opulent Cloth', 8:'Brilliant Cloth' },
  },
  hide: {
    icon: '🐄',
    label: 'Hide → Leather',
    usedIn: 'Leather armour (Jackets, Hoods, Shoes), Daggers, Bows',
    raw:     { 2:'Rawhide', 3:'Thin Hide', 4:'Medium Hide', 5:'Heavy Hide', 6:'Robust Hide', 7:'Thick Hide', 8:'Resilient Hide' },
    refined: { 2:'Thin Leather', 3:'Light Leather', 4:'Worked Leather', 5:'Cured Leather', 6:'Hardened Leather', 7:'Reinforced Leather', 8:'Fortified Leather' },
  },
  stone: {
    icon: '🪨',
    label: 'Stone → Stone Blocks',
    usedIn: 'Buildings, Crafting stations, Tools',
    raw:     { 2:'Sandstone', 3:'Limestone', 4:'Slate', 5:'Basalt', 6:'Granite', 7:'Hornstone', 8:'Marble' },
    refined: { 2:'Sandstone Block', 3:'Limestone Block', 4:'Slate Block', 5:'Basalt Block', 6:'Granite Block', 7:'Hornstone Block', 8:'Marble Block' },
  },
};

// Item recipes
// materials: array of { resource, qty } — qty is number of refined units per item
// Quantities are per single item at any tier (same qty, just higher tier refined)
const craftingRecipes = [
  // ── WEAPONS ────────────────────────────────────────────
  { id:'sword-1h', name:'One-Handed Sword / Axe / Hammer', category:'Weapons', station:'Forge',
    icon:'⚔️', city:'Fort Sterling / Martlock',
    materials:[{ resource:'ore', qty:16 }],
    note:'Covers Broadsword, Claymore variants, Battleaxe, Hammer. 2H versions use 24× bars.' },

  { id:'sword-2h', name:'Two-Handed Sword / Greataxe / Polehammer', category:'Weapons', station:'Forge',
    icon:'⚔️', city:'Fort Sterling / Martlock',
    materials:[{ resource:'ore', qty:24 }],
    note:'All two-handed melee metal weapons.' },

  { id:'crossbow', name:'Crossbow (all types)', category:'Weapons', station:'Forge',
    icon:'🔫', city:'Fort Sterling',
    materials:[{ resource:'wood', qty:12 }, { resource:'ore', qty:8 }],
    note:'Mixed wood + metal. Light Crossbow, Crossbow, Heavy Crossbow, Boltcasters, Siegebow.' },

  { id:'spear', name:'Spear / Pike / Glaive', category:'Weapons', station:'Forge',
    icon:'🔱', city:'Bridgewatch',
    materials:[{ resource:'ore', qty:12 }, { resource:'wood', qty:8 }],
    note:'Two-material weapon. Includes Heron Spear, Trinity Spear, Spirithunter.' },

  { id:'dagger', name:'Dagger / Claws / Bloodletter', category:'Weapons', station:'Huntsman',
    icon:'🔪', city:'Bridgewatch',
    materials:[{ resource:'ore', qty:12 }, { resource:'hide', qty:8 }],
    note:'Mixed metal + leather. Deathgivers and Frostpeak follow same recipe.' },

  { id:'staff-1h', name:'One-Handed Staff (all elements)', category:'Weapons', station:"Mage's Tower",
    icon:'🪄', city:'Lymhurst / Thetford',
    materials:[{ resource:'wood', qty:16 }],
    note:'Fire Staff, Frost Staff, Curse Staff, Holy Staff, Nature Staff, Arcane Staff.' },

  { id:'staff-2h', name:'Two-Handed Staff / Great Staffs', category:'Weapons', station:"Mage's Tower",
    icon:'🪄', city:'Lymhurst / Thetford',
    materials:[{ resource:'wood', qty:20 }, { resource:'fiber', qty:8 }],
    note:'Great Fire Staff, Hallowfall, Redemption Staff, Shadowcaller, etc.' },

  { id:'bow', name:'Bow / Warbow / Longbow', category:'Weapons', station:'Huntsman',
    icon:'🏹', city:'Bridgewatch',
    materials:[{ resource:'wood', qty:12 }, { resource:'fiber', qty:8 }],
    note:'Includes Whispering Bow, Wailing Bow, Bow of Badon.' },

  { id:'quarterstaff', name:'Quarterstaff / Bedrock Mace / Wild Staff', category:'Weapons', station:'Forge',
    icon:'🥢', city:'Fort Sterling',
    materials:[{ resource:'wood', qty:20 }],
    note:'All quarterstaff variants. Double Bladed Staff, Iron-clad Staff, etc.' },

  { id:'offhand', name:'Off-Hand (Shield / Tome / Seal)', category:'Weapons', station:'Forge/Tower',
    icon:'🛡️', city:'Varies by type',
    materials:[{ resource:'ore', qty:8 }],
    note:'Shields use ore; Tomes/Seals use planks. Off-hands use ~50% fewer materials than main hands.' },

  // ── PLATE ARMOUR ──────────────────────────────────────
  { id:'plate-head', name:'Plate Helmet (Soldier / Knight / Guardian)', category:'Plate Armour', station:'Forge',
    icon:'⛑️', city:'Fort Sterling / Martlock',
    materials:[{ resource:'ore', qty:8 }],
    note:'All plate helmet variants use the same ore quantity.' },

  { id:'plate-chest', name:'Plate Chest (Soldier / Knight / Guardian Armor)', category:'Plate Armour', station:'Forge',
    icon:'🛡️', city:'Fort Sterling / Martlock',
    materials:[{ resource:'ore', qty:16 }],
    note:'Chest pieces use more materials than head/boots.' },

  { id:'plate-boots', name:'Plate Boots (Soldier / Knight / Guardian)', category:'Plate Armour', station:'Forge',
    icon:'👟', city:'Fort Sterling / Martlock',
    materials:[{ resource:'ore', qty:8 }],
    note:'All plate boot variants.' },

  // ── LEATHER ARMOUR ────────────────────────────────────
  { id:'leather-head', name:'Leather Hood (Stalker / Hunter / Assassin)', category:'Leather Armour', station:'Huntsman',
    icon:'⛑️', city:'Bridgewatch',
    materials:[{ resource:'hide', qty:8 }],
    note:'All leather helmet variants.' },

  { id:'leather-chest', name:'Leather Jacket (Hunter / Assassin / Mercenary)', category:'Leather Armour', station:'Huntsman',
    icon:'🥋', city:'Bridgewatch',
    materials:[{ resource:'hide', qty:16 }],
    note:'All leather chest variants.' },

  { id:'leather-boots', name:'Leather Shoes (Stalker / Hunter / Assassin)', category:'Leather Armour', station:'Huntsman',
    icon:'👟', city:'Bridgewatch',
    materials:[{ resource:'hide', qty:8 }],
    note:'All leather boot variants.' },

  // ── CLOTH ARMOUR ──────────────────────────────────────
  { id:'cloth-head', name:'Cloth Cowl (Scholar / Mage / Cleric)', category:'Cloth Armour', station:"Mage's Tower",
    icon:'⛑️', city:'Lymhurst / Thetford',
    materials:[{ resource:'fiber', qty:8 }],
    note:'All cloth helmet variants.' },

  { id:'cloth-chest', name:'Cloth Robe (Scholar / Mage / Cleric / Druid)', category:'Cloth Armour', station:"Mage's Tower",
    icon:'🧣', city:'Lymhurst / Thetford',
    materials:[{ resource:'fiber', qty:16 }],
    note:'All cloth chest variants.' },

  { id:'cloth-boots', name:'Cloth Sandals (Scholar / Mage / Cleric)', category:'Cloth Armour', station:"Mage's Tower",
    icon:'👟', city:'Lymhurst / Thetford',
    materials:[{ resource:'fiber', qty:8 }],
    note:'All cloth sandal variants.' },

  // ── ACCESSORIES ───────────────────────────────────────
  { id:'bag', name:'Bag (all sizes)', category:'Accessories', station:'Toolmaker',
    icon:'🎒', city:'Any',
    materials:[{ resource:'hide', qty:8 }, { resource:'fiber', qty:4 }],
    note:'Bags increase carry weight. Upgrade tier for more carry capacity. Essential for gatherers.' },

  { id:'cape', name:'Cape / Cloak', category:'Accessories', station:'Toolmaker',
    icon:'🧥', city:'Any',
    materials:[{ resource:'fiber', qty:8 }],
    note:'Capes provide passive bonuses (CC resist, move speed, etc.).' },

  { id:'gathering-tool', name:'Gathering Tool (any type)', category:'Accessories', station:'Toolmaker',
    icon:'⛏️', city:'Any',
    materials:[{ resource:'ore', qty:4 }, { resource:'wood', qty:4 }],
    note:'All 5 gathering tool types follow roughly the same recipe split.' },

  // ── CONSUMABLES ───────────────────────────────────────
  { id:'pork-omelette', name:'Pork Omelette (×10 batch)', category:'Food', station:'Butcher / Cook',
    icon:'🍳', city:'Any',
    materials:[{ resource:'pork', qty:8, raw:true }, { resource:'egg', qty:4, raw:true }, { resource:'butter', qty:2, raw:true }],
    note:'Highest HP food. Pork from butchering pigs (island or market). Eggs from chickens.' },

  { id:'beef-stew', name:'Beef Stew (×10 batch)', category:'Food', station:'Butcher / Cook',
    icon:'🥘', city:'Any',
    materials:[{ resource:'beef', qty:8, raw:true }, { resource:'carrot', qty:4, raw:true }, { resource:'turnip', qty:2, raw:true }],
    note:'HP + physical resistance. Best food for plate tanks in ZvZ.' },

  { id:'soup', name:'Healing Soup (×10 batch)', category:'Food', station:'Cook',
    icon:'🍲', city:'Any',
    materials:[{ resource:'goat_milk', qty:8, raw:true }, { resource:'turnip', qty:4, raw:true }, { resource:'potato', qty:2, raw:true }],
    note:'+Healing received. Essential for Holy/Nature staff healers.' },

  { id:'healing-potion', name:'Healing Potion (×10 batch)', category:'Potions', station:"Alchemist's Lab",
    icon:'❤️', city:'Any',
    materials:[{ resource:'yarrow', qty:8, raw:true }, { resource:'burdock', qty:4, raw:true }],
    note:'Instant burst heal. The most consumed potion in the game. Very high demand.' },

  { id:'energy-potion', name:'Energy Potion (×10 batch)', category:'Potions', station:"Alchemist's Lab",
    icon:'💙', city:'Any',
    materials:[{ resource:'mullein', qty:8, raw:true }, { resource:'teasel', qty:4, raw:true }],
    note:'Instant energy restore. Critical for healers and mages in long fights.' },

  { id:'resistance-potion', name:'Resistance Potion (×10 batch)', category:'Potions', station:"Alchemist's Lab",
    icon:'🛡️', city:'Any',
    materials:[{ resource:'foxglove', qty:8, raw:true }, { resource:'trefoil', qty:4, raw:true }],
    note:'Damage reduction for several seconds. Best PvP potion — spikes in demand after patches.' },
];

// Approximate market prices (silver) — used as calculator defaults
// Players should update these with current in-game prices
const defaultPrices = {
  ore:   { 4: 180, 5: 320, 6: 600, 7: 1200, 8: 3500 },   // per raw unit
  wood:  { 4: 150, 5: 280, 6: 520, 7: 1000, 8: 2800 },
  fiber: { 4: 120, 5: 220, 6: 450, 7: 900,  8: 2500 },
  hide:  { 4: 160, 5: 300, 6: 560, 7: 1100, 8: 3000 },
  // Refined (approx 2.5× raw)
  oreR:   { 4: 500, 5: 900, 6: 1700, 7: 3200, 8: 9000 },
  woodR:  { 4: 420, 5: 760, 6: 1400, 7: 2700, 8: 7500 },
  fiberR: { 4: 350, 5: 640, 6: 1200, 7: 2400, 8: 6500 },
  hideR:  { 4: 450, 5: 820, 6: 1550, 7: 2900, 8: 8000 },
};
