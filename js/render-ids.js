// ============================================================
// ALBION ONLINE RENDER API — CONFIRMED WORKING ITEM IDS
// Base URL: https://render.albiononline.com/v1/item/{id}.png
//
// Confirmed working patterns:
//   T4_{HAND}_{BASETYPE}         — all standard weapon types
//   T4_{SLOT}_{ARMORTYPE}_SET{N} — all armour pieces
//   T4_2H_HALLOWFALL_AVALON      — the only confirmed AVALON weapon
//
// Faction/unique weapons (HELL, MORGANA, KEEPER, etc.) 404 on the
// render API. They fall back to their nearest base weapon type so
// something meaningful always renders.
// ============================================================

const RENDER_BASE = 'https://render.albiononline.com/v1/item/';

function itemImg(id, size = 128) {
  return `${RENDER_BASE}${id}.png?size=${size}`;
}

// ── WEAPONS ─────────────────────────────────────────────────
const weaponRenderIds = {
  // ── Swords ──────────────────────────────────────
  'broadsword':      'T4_MAIN_SWORD',
  'claymore':        'T4_2H_CLAYMORE',
  'dualSwords':      'T4_MAIN_SWORD',          // no unique ID — base fallback
  'carvingSword':    'T4_MAIN_SWORD',
  'galatinePair':    'T4_2H_CLAYMORE',
  'kingmaker':       'T4_2H_CLAYMORE',

  // ── Axes ─────────────────────────────────────────
  'battleaxe':       'T4_MAIN_AXE',
  'hatchet':         'T4_MAIN_AXE',            // T4_MAIN_HATCHET unverified
  'greataxe':        'T4_2H_AXE',
  'cleavers':        'T4_2H_AXE',
  'infernalScythe':  'T4_2H_AXE',
  'bearPaws':        'T4_MAIN_AXE',

  // ── Hammers ─────────────────────────────────────
  'hammer':          'T4_MAIN_HAMMER',
  'polehammer':      'T4_2H_POLEHAMMER',
  'greatHammer':     'T4_2H_HAMMER',
  'morningStar':     'T4_MAIN_HAMMER',
  'forgeHammers':    'T4_2H_HAMMER',
  'grovekeeper':     'T4_2H_POLEHAMMER',

  // ── Spears ──────────────────────────────────────
  'spear':           'T4_MAIN_SPEAR',
  'pike':            'T4_2H_PIKE',
  'glaive':          'T4_2H_GLAIVE',
  'heronSpear':      'T4_MAIN_SPEAR',
  'trinitySpear':    'T4_2H_PIKE',
  'spirithunter':    'T4_2H_PIKE',

  // ── Daggers ─────────────────────────────────────
  'dagger':          'T4_MAIN_DAGGER',
  'daggerPair':      'T4_MAIN_DAGGER',
  'bloodletter':     'T4_MAIN_DAGGER',         // unique ID 404s — dagger fallback
  'claws':           'T4_MAIN_DAGGER',
  'deathgivers':     'T4_MAIN_DAGGER',
  'frostpeak':       'T4_MAIN_DAGGER',

  // ── Quarterstaffs ───────────────────────────────
  'quarterstaff':    'T4_2H_QUARTERSTAFF',
  'ironCladStaff':   'T4_2H_QUARTERSTAFF',
  'doubleBladed':    'T4_2H_QUARTERSTAFF',
  'blackMonkStave':  'T4_2H_QUARTERSTAFF',
  'bedrockMace':     'T4_MAIN_HAMMER',
  'wildStaff':       'T4_2H_QUARTERSTAFF',

  // ── Crossbows ───────────────────────────────────
  'lightCrossbow':   'T4_2H_CROSSBOW',
  'crossbow':        'T4_2H_CROSSBOW',
  'heavyCrossbow':   'T4_2H_CROSSBOW',
  'weepingRepeater': 'T4_2H_CROSSBOW',
  'boltcasters':     'T4_2H_CROSSBOW',
  'siegebow':        'T4_2H_CROSSBOW',

  // ── Bows ────────────────────────────────────────
  'bow':             'T4_2H_BOW',
  'warbow':          'T4_2H_BOW',
  'longbow':         'T4_2H_BOW',
  'whisperingBow':   'T4_2H_BOW',
  'wailingBow':      'T4_2H_BOW',
  'bowOfBadon':      'T4_2H_BOW',

  // ── Fire Staffs ─────────────────────────────────
  'fireStaff':       'T4_MAIN_FIRESTAFF',
  'greatFireStaff':  'T4_2H_FIRESTAFF',
  'infernalStaff':   'T4_2H_FIRESTAFF',
  'wildfireStaff':   'T4_2H_FIRESTAFF',
  'brimstoneStaff':  'T4_2H_FIRESTAFF',
  'blazingStaff':    'T4_2H_FIRESTAFF',

  // ── Frost Staffs ────────────────────────────────
  'frostStaff':      'T4_MAIN_FROSTSTAFF',
  'greatFrostStaff': 'T4_2H_FROSTSTAFF',
  'glacialStaff':    'T4_2H_FROSTSTAFF',
  'hoarfrostStaff':  'T4_2H_FROSTSTAFF',
  'icicleStaff':     'T4_2H_FROSTSTAFF',
  'permafrostPrism': 'T4_2H_FROSTSTAFF',

  // ── Cursed Staffs ───────────────────────────────
  'cursedStaff':     'T4_MAIN_CURSEDSTAFF',
  'demonStaff':      'T4_2H_DEMONSTAFF',
  'lifecurseStaff':  'T4_2H_DEMONSTAFF',
  'cursedSkull':     'T4_2H_DEMONSTAFF',
  'shadowcaller':    'T4_2H_DEMONSTAFF',
  'realmbreaker':    'T4_2H_DEMONSTAFF',

  // ── Nature Staffs ───────────────────────────────
  'natureStaff':     'T4_MAIN_NATURESTAFF',
  'greatNatureStaff':'T4_2H_NATURESTAFF',
  'druidicStaff':    'T4_2H_NATURESTAFF',
  'blightStaff':     'T4_2H_NATURESTAFF',
  'rampantStaff':    'T4_2H_NATURESTAFF',
  'bridledFury':     'T4_2H_NATURESTAFF',

  // ── Holy Staffs ─────────────────────────────────
  'holyStaff':       'T4_MAIN_HOLYSTAFF',
  'greatHolyStaff':  'T4_2H_HOLYSTAFF',
  'fallenStaff':     'T4_2H_HOLYSTAFF',
  'redemptionStaff': 'T4_2H_HOLYSTAFF',
  'lifetouchStaff':  'T4_2H_HOLYSTAFF',
  'hallowfall':      'T4_2H_HALLOWFALL_AVALON',  // confirmed working ✓

  // ── Arcane Staffs ───────────────────────────────
  'arcaneStaff':     'T4_MAIN_ARCANESTAFF',
  'greatArcaneStaff':'T4_2H_ARCANESTAFF',
  'occultStaff':     'T4_2H_ARCANESTAFF',
  'witchworkStaff':  'T4_2H_ARCANESTAFF',
  'locus':           'T4_2H_ARCANESTAFF',
  'eyeOfSecrets':    'T4_2H_ARCANESTAFF',
};

// ── ARMOR ─────────────────────────────────────────────────────
// All SET-based IDs confirmed working
const armorRenderIds = {
  // Plate Helmets
  'soldierHelmet':   'T4_HEAD_PLATE_SET1',
  'knightHelmet':    'T4_HEAD_PLATE_SET2',
  'guardianHelmet':  'T4_HEAD_PLATE_SET3',
  'judicatorHelmet': 'T4_HEAD_PLATE_SET4',
  'royalHelmet':     'T4_HEAD_PLATE_ROYAL',
  'graveguardHelmet':'T4_HEAD_PLATE_UNDEAD',
  // Plate Chests
  'soldierArmor':    'T4_ARMOR_PLATE_SET1',
  'knightArmor':     'T4_ARMOR_PLATE_SET2',
  'guardianArmor':   'T4_ARMOR_PLATE_SET3',
  'judicatorArmor':  'T4_ARMOR_PLATE_SET3',  // fallback to SET3
  'royalArmor':      'T4_ARMOR_PLATE_SET3',
  'graveguardArmor': 'T4_ARMOR_PLATE_SET1',
  // Plate Boots
  'soldierBoots':    'T4_SHOES_PLATE_SET1',
  'knightBoots':     'T4_SHOES_PLATE_SET2',
  'guardianBoots':   'T4_SHOES_PLATE_SET3',
  'judicatorBoots':  'T4_SHOES_PLATE_SET4',
  'royalBoots':      'T4_SHOES_PLATE_ROYAL',
  'graveguardBoots': 'T4_SHOES_PLATE_UNDEAD',

  // Leather Helmets
  'hunterHood':      'T4_HEAD_LEATHER_SET1',
  'assassinHood':    'T4_HEAD_LEATHER_SET2',
  'stalkerHood':     'T4_HEAD_LEATHER_SET3',
  'mercenaryHood':   'T4_HEAD_LEATHER_SET4',
  'royalHood':       'T4_HEAD_LEATHER_ROYAL',
  'specterHood':     'T4_HEAD_LEATHER_UNDEAD',
  // Leather Chests
  'hunterJacket':    'T4_ARMOR_LEATHER_SET1',
  'assassinJacket':  'T4_ARMOR_LEATHER_SET3',
  'mercenaryJacket': 'T4_ARMOR_LEATHER_SET2',
  'stalkerJacket':   'T4_ARMOR_LEATHER_SET3',
  'royalJacket':     'T4_ARMOR_LEATHER_SET2',
  'specterJacket':   'T4_ARMOR_LEATHER_SET1',
  // Leather Boots
  'hunterShoes':     'T4_SHOES_LEATHER_SET1',
  'assassinShoes':   'T4_SHOES_LEATHER_SET2',
  'stalkerShoes':    'T4_SHOES_LEATHER_SET3',
  'mercenaryShoes':  'T4_SHOES_LEATHER_SET4',
  'royalShoes':      'T4_SHOES_LEATHER_ROYAL',
  'specterShoes':    'T4_SHOES_LEATHER_UNDEAD',

  // Cloth Helmets
  'scholarCowl':     'T4_HEAD_CLOTH_SET1',
  'mageCowl':        'T4_HEAD_CLOTH_SET2',
  'clericCowl':      'T4_HEAD_CLOTH_SET3',
  'druidCowl':       'T4_HEAD_CLOTH_SET4',
  'feyscaleCowl':    'T4_HEAD_CLOTH_MORGANA',
  'fiendCowl':       'T4_HEAD_CLOTH_HELL',
  // Cloth Chests
  'scholarRobe':     'T4_ARMOR_CLOTH_SET1',
  'mageRobe':        'T4_ARMOR_CLOTH_SET2',
  'clericRobe':      'T4_ARMOR_CLOTH_SET3',
  'druidRobe':       'T4_ARMOR_CLOTH_SET3',
  'feyscaleRobe':    'T4_ARMOR_CLOTH_SET2',
  'fiendRobe':       'T4_ARMOR_CLOTH_SET1',
  // Cloth Boots
  'scholarSandals':  'T4_SHOES_CLOTH_SET1',
  'mageSandals':     'T4_SHOES_CLOTH_SET2',
  'clericSandals':   'T4_SHOES_CLOTH_SET3',
  'druidSandals':    'T4_SHOES_CLOTH_SET4',
  'feyscaleSandals': 'T4_SHOES_CLOTH_MORGANA',
  'fiendSandals':    'T4_SHOES_CLOTH_HELL',
};

// ── HERO SHOWCASE — only confirmed-working IDs ────────────────
// One representative weapon per major category
const showcaseItems = [
  { id: 'T4_MAIN_SWORD',         label: 'Swords' },
  { id: 'T4_2H_AXE',             label: 'Axes' },
  { id: 'T4_2H_POLEHAMMER',      label: 'Hammers' },
  { id: 'T4_2H_GLAIVE',          label: 'Spears' },
  { id: 'T4_MAIN_DAGGER',        label: 'Daggers' },
  { id: 'T4_2H_QUARTERSTAFF',    label: 'Quarterstaffs' },
  { id: 'T4_2H_CROSSBOW',        label: 'Crossbows' },
  { id: 'T4_2H_BOW',             label: 'Bows' },
  { id: 'T4_2H_FIRESTAFF',       label: 'Fire Staffs' },
  { id: 'T4_2H_FROSTSTAFF',      label: 'Frost Staffs' },
  { id: 'T4_2H_HALLOWFALL_AVALON', label: 'Hallowfall' },
  { id: 'T4_MAIN_ARCANESTAFF',   label: 'Arcane Staffs' },
];

// Hero floating background items (6 across the hero banner)
const heroFloatItems = [
  { id: 'T4_2H_HALLOWFALL_AVALON', pos: 'pos-tl' },
  { id: 'T4_2H_FROSTSTAFF',        pos: 'pos-tr' },
  { id: 'T4_MAIN_DAGGER',          pos: 'pos-ml' },
  { id: 'T4_2H_BOW',               pos: 'pos-mr' },
  { id: 'T4_MAIN_SWORD',           pos: 'pos-bl' },
  { id: 'T4_2H_FIRESTAFF',         pos: 'pos-br' },
];
