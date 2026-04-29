// ============================================================
// ALBION ONLINE RENDER API — ITEM ID MAPPINGS
// Base URL: https://render.albiononline.com/v1/item/{id}.png
// IDs follow Albion's internal naming convention.
// ============================================================

const RENDER_BASE = 'https://render.albiononline.com/v1/item/';

function itemImg(id, size = 128) {
  return `${RENDER_BASE}${id}.png?size=${size}&quality=2`;
}

// ── WEAPONS ─────────────────────────────────────────────────
const weaponRenderIds = {
  // Swords
  'broadsword':    'T4_MAIN_SWORD',
  'claymore':      'T4_2H_CLAYMORE',
  'dualSwords':    'T4_2H_DUALBLADES',
  'carvingSword':  'T6_MAIN_SCIMITAR_MORGANA',
  'galatinePair':  'T6_2H_GALATINE_AVALON',
  'kingmaker':     'T8_2H_KINGMAKER_AVALON',

  // Axes
  'battleaxe':     'T4_MAIN_AXE',
  'hatchet':       'T4_MAIN_HATCHET',
  'greataxe':      'T4_2H_AXE',
  'cleavers':      'T6_2H_CLEAVERS_MORGANA',
  'infernalScythe':'T6_2H_SCYTHE_HELL',
  'bearPaws':      'T6_2H_BEARPAWS_KEEPER',

  // Hammers
  'hammer':        'T4_MAIN_HAMMER',
  'polehammer':    'T4_2H_POLEHAMMER',
  'greatHammer':   'T4_2H_HAMMER',
  'morningStar':   'T6_MAIN_MACE_MORGANA',
  'forgeHammers':  'T6_2H_HAMMERPAIR_KEEPER',
  'grovekeeper':   'T6_2H_GROVEKEEPER_KEEPER',

  // Spears
  'spear':         'T4_MAIN_SPEAR',
  'pike':          'T4_2H_PIKE',
  'glaive':        'T4_2H_GLAIVE',
  'heronSpear':    'T6_MAIN_SPEAR_MORGANA',
  'trinitySpear':  'T8_2H_TRINITYFIST_AVALON',
  'spirithunter':  'T6_2H_SPIRITHUNTER_HELL',

  // Daggers
  'dagger':        'T4_MAIN_DAGGER',
  'daggerPair':    'T4_2H_DAGGERPAIR',
  'bloodletter':   'T6_MAIN_BLOODLETTER_HELL',
  'claws':         'T6_2H_CLAWS_KEEPER',
  'deathgivers':   'T6_2H_DEATHGIVERS_MORGANA',
  'frostpeak':     'T6_MAIN_FROSTPEAK_UNDEAD',

  // Quarterstaffs
  'quarterstaff':  'T4_2H_QUARTERSTAFF',
  'ironCladStaff': 'T6_2H_IRONCLADSTAFF_ROYAL',
  'doubleBladed':  'T6_2H_DOUBLEBLADEDSTAFF_KEEPER',
  'blackMonkStave':'T6_2H_BLACKMONKSTAFF_MORGANA',
  'bedrockMace':   'T6_2H_BEDROCKMACE_KEEPER',
  'wildStaff':     'T6_2H_WILDSTAFF_KEEPER',

  // Crossbows
  'lightCrossbow': 'T4_MAIN_CROSSBOWSMALL',
  'crossbow':      'T4_2H_CROSSBOW',
  'heavyCrossbow': 'T4_2H_HEAVYCROSSBOW',
  'weepingRepeater':'T6_2H_REPEATINGCROSSBOW_UNDEAD',
  'boltcasters':   'T6_2H_BOLTCASTERS_KEEPER',
  'siegebow':      'T6_2H_SIEGEBOW_MORGANA',

  // Bows
  'bow':           'T4_2H_BOW',
  'warbow':        'T6_2H_WARBOW_UNDEAD',
  'longbow':       'T4_2H_LONGBOW',
  'whisperingBow': 'T6_2H_WHISPERINGBOW_MORGANA',
  'wailingBow':    'T6_2H_WAILINGBOW_HELL',
  'bowOfBadon':    'T8_2H_BOWOFBADON_AVALON',

  // Fire Staffs
  'fireStaff':     'T4_MAIN_FIRESTAFF',
  'greatFireStaff':'T4_2H_FIRESTAFF',
  'infernalStaff': 'T6_2H_INFERNOSTAFF_HELL',
  'wildfireStaff': 'T6_2H_WILDFIRESTAFF_KEEPER',
  'brimstoneStaff':'T6_2H_BRIMSTONESTAFF_MORGANA',
  'blazingStaff':  'T8_2H_BLAZINGSTAFF_AVALON',

  // Frost Staffs
  'frostStaff':    'T4_MAIN_FROSTSTAFF',
  'greatFrostStaff':'T4_2H_FROSTSTAFF',
  'glacialStaff':  'T6_2H_GLACIALSTAFF_UNDEAD',
  'hoarfrostStaff':'T6_2H_HOARFROSTSTAFF_KEEPER',
  'icicleStaff':   'T6_2H_ICICLESTAFF_MORGANA',
  'permafrostPrism':'T8_2H_PERMAFROSTPRISM_AVALON',

  // Cursed Staffs
  'cursedStaff':   'T4_MAIN_CURSEDSTAFF',
  'demonStaff':    'T4_2H_DEMONSTAFF',
  'lifecurseStaff':'T6_2H_LIFECURSESTAFF_UNDEAD',
  'cursedSkull':   'T6_2H_CURSEDSKULL_KEEPER',
  'shadowcaller':  'T6_2H_SHADOWCALLER_MORGANA',
  'realmbreaker':  'T8_2H_REALMBREAKER_AVALON',

  // Nature Staffs
  'natureStaff':   'T4_MAIN_NATURESTAFF',
  'greatNatureStaff':'T4_2H_NATURESTAFF',
  'druidicStaff':  'T6_2H_DRUIDICSTAFF_KEEPER',
  'blightStaff':   'T6_2H_BLIGHTSTAFF_UNDEAD',
  'rampantStaff':  'T6_2H_RAMPANTSTAFF_MORGANA',
  'bridledFury':   'T8_2H_BRIDLEDFURY_AVALON',

  // Holy Staffs
  'holyStaff':     'T4_MAIN_HOLYSTAFF',
  'greatHolyStaff':'T4_2H_HOLYSTAFF',
  'fallenStaff':   'T6_2H_FALLENSTAFF_HELL',
  'redemptionStaff':'T6_2H_REDEMPTIONSTAFF_UNDEAD',
  'lifetouchStaff':'T6_2H_LIFETOUCHSTAFF_KEEPER',
  'hallowfall':    'T8_2H_HALLOWFALL_AVALON',

  // Arcane Staffs
  'arcaneStaff':   'T4_MAIN_ARCANESTAFF',
  'greatArcaneStaff':'T4_2H_ARCANESTAFF',
  'occultStaff':   'T6_2H_OCCULTSTAFF_UNDEAD',
  'witchworkStaff':'T6_2H_WITCHWORKSTAFF_KEEPER',
  'locus':         'T6_2H_LOCUS_MORGANA',
  'eyeOfSecrets':  'T8_2H_EYEOFSECRETS_AVALON',
};

// ── ARMOR ────────────────────────────────────────────────────
const armorRenderIds = {
  // Plate Helmets
  'soldierHelmet':   'T4_HEAD_PLATE_SET1',
  'knightHelmet':    'T4_HEAD_PLATE_SET2',
  'guardianHelmet':  'T4_HEAD_PLATE_SET3',
  // Plate Chests
  'soldierArmor':    'T4_ARMOR_PLATE_SET1',
  'knightArmor':     'T4_ARMOR_PLATE_SET2',
  'guardianArmor':   'T4_ARMOR_PLATE_SET3',
  'judicatorArmor':  'T6_ARMOR_PLATE_SET4',
  'royalArmor':      'T6_ARMOR_PLATE_ROYAL',
  'graveguardArmor': 'T4_ARMOR_PLATE_UNDEAD',
  // Plate Boots
  'soldierBoots':    'T4_SHOES_PLATE_SET1',
  'knightBoots':     'T4_SHOES_PLATE_SET2',
  'guardianBoots':   'T4_SHOES_PLATE_SET3',

  // Leather Helmets
  'hunterHood':      'T4_HEAD_LEATHER_SET1',
  'assassinHood':    'T4_HEAD_LEATHER_SET2',
  'stalkerHood':     'T4_HEAD_LEATHER_SET3',
  // Leather Chests
  'hunterJacket':    'T4_ARMOR_LEATHER_SET1',
  'mercenaryJacket': 'T4_ARMOR_LEATHER_SET2',
  'assassinJacket':  'T4_ARMOR_LEATHER_SET3',
  'stalkerJacket':   'T6_ARMOR_LEATHER_SET4',
  'royalJacket':     'T6_ARMOR_LEATHER_ROYAL',
  'specterJacket':   'T6_ARMOR_LEATHER_UNDEAD',
  // Leather Boots
  'hunterShoes':     'T4_SHOES_LEATHER_SET1',
  'assassinShoes':   'T4_SHOES_LEATHER_SET2',
  'stalkerShoes':    'T4_SHOES_LEATHER_SET3',

  // Cloth Helmets
  'scholarCowl':     'T4_HEAD_CLOTH_SET1',
  'mageCowl':        'T4_HEAD_CLOTH_SET2',
  'clericCowl':      'T4_HEAD_CLOTH_SET3',
  // Cloth Chests
  'scholarRobe':     'T4_ARMOR_CLOTH_SET1',
  'mageRobe':        'T4_ARMOR_CLOTH_SET2',
  'clericRobe':      'T4_ARMOR_CLOTH_SET3',
  'druidRobe':       'T4_ARMOR_CLOTH_SET4',
  'feyscaleRobe':    'T6_ARMOR_CLOTH_MORGANA',
  'fiendRobe':       'T6_ARMOR_CLOTH_HELL',
  // Cloth Boots
  'scholarSandals':  'T4_SHOES_CLOTH_SET1',
  'mageSandals':     'T4_SHOES_CLOTH_SET2',
  'clericSandals':   'T4_SHOES_CLOTH_SET3',
};

// Hero/artwork showcase items — high-tier items with impressive renders
const showcaseItems = [
  { id: 'T8_2H_HALLOWFALL_AVALON',     label: 'Hallowfall',      pos: 'top-left' },
  { id: 'T8_2H_KINGMAKER_AVALON',      label: 'Kingmaker',       pos: 'top-right' },
  { id: 'T8_2H_SHADOWCALLER_MORGANA',  label: 'Shadowcaller',    pos: 'mid-left' },
  { id: 'T8_2H_PERMAFROSTPRISM_AVALON',label: 'Permafrost Prism',pos: 'mid-right' },
  { id: 'T8_2H_BOWOFBADON_AVALON',     label: 'Bow of Badon',    pos: 'bot-left' },
  { id: 'T8_2H_REALMBREAKER_AVALON',   label: 'Realmbreaker',    pos: 'bot-right' },
];
