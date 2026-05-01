// ============================================================
// LIVE MARKET PRICES — Albion Online Data Project API
// ============================================================

const AlbionPrices = (() => {
  const API_BASE = 'https://www.albion-online-data.com/api/v2/stats/prices';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const PREFERRED_CITY = 'Caerleon';
  const FALLBACK_CITIES = ['Bridgewatch','Martlock','Fort Sterling','Lymhurst','Thetford'];

  const _cache = {}; // itemId → { price, ts, city }

  // Map base weapon/armor names + tier → Albion item ID
  // Pattern: T{tier}_MAIN_{TYPE}, T{tier}_2H_{TYPE}, T{tier}_HEAD_{TYPE}, etc.
  const NAME_TO_ID_BASE = {
    // Weapons (main hand)
    'broadsword':         'MAIN_SWORD',
    'claymore':           '2H_CLAYMORE',
    'dual swords':        '2H_DUALSWORD',
    'carving sword':      'MAIN_SCIMITAR_MORGANA',
    'galatine pair':      '2H_TWINBLADE_KEEPER',
    'kingmaker':          '2H_KINGMAKER',
    // Axes
    'battleaxe':          'MAIN_AXE',
    'halberd':            '2H_HALBERD',
    'carrioncaller':      '2H_HALBERD_MORGANA',
    'infernal scythe':    '2H_SCYTHE_HELL',
    'greataxe':           '2H_GREATAXE',
    'bear paws':          '2H_BEARPAWS',
    // Hammers
    'hammer':             'MAIN_HAMMER',
    'polehammer':         '2H_POLEHAMMER',
    'great hammer':       '2H_HAMMER',
    'tombhammer':         '2H_TOMBHAMMER',
    'forgehammer':        '2H_HAMMER_KEEPER',
    'grailseeker':        '2H_GRAILSEEKER',
    // Spears
    'spear':              'MAIN_SPEAR',
    'pike':               '2H_PIKE',
    'glaive':             '2H_GLAIVE',
    'spirithunter':       '2H_SPEAR_HELL',
    'trinity spear':      '2H_TRIBARONE',
    'lance':              '2H_LANCE_AVALON',
    // Daggers
    'dagger':             'MAIN_DAGGER',
    'dagger pair':        '2H_DAGGERPAIR',
    'bloodletter':        'MAIN_RAPIER_MORGANA',
    'claws':              '2H_CLAWS',
    'deathgivers':        '2H_DEATHGIVERS',
    'shadowcaller':       '2H_SHADOWCALLER',
    // Quarterstaffs
    'quarterstaff':       '2H_QUARTERSTAFF',
    'iron-clad staff':    '2H_IRONCLADSTAFF',
    'double bladed staff':'2H_DOUBLEBLADEDSTAFF',
    'black monk stave':   '2H_BLACKMONKSTAVE',
    'staff of balance':   '2H_STAFF_AVALON',
    // Crossbows
    'crossbow':           'MAIN_CROSSBOW',
    'light crossbow':     'MAIN_1HCROSSBOW',
    'heavy crossbow':     '2H_CROSSBOW',
    'weeping repeater':   '2H_CROSSBOWLARGE_MORGANA',
    'siegebow':           '2H_SIEGEBOW',
    'boltcasters':        '2H_REPEATINGCROSSBOW_UNDEAD',
    // Bows
    'bow':                '2H_BOW',
    'warbow':             '2H_WARBOW',
    'longbow':            '2H_LONGBOW',
    'whispering bow':     '2H_WHISPERING',
    'ravenstrike':        '2H_LONGBOW_UNDEAD',
    // Fire Staffs
    'fire staff':         'MAIN_FIRESTAFF',
    'great fire staff':   '2H_FIRESTAFF',
    'infernal staff':     '2H_INFERNOSTAFF',
    'blazing staff':      'MAIN_FIRESTAFF_MORGANA',
    'wildfire staff':     'MAIN_WILDFIRE',
    'hallowfall':         '2H_HALLOWFALL_AVALON',
    // Frost Staffs
    'frost staff':        'MAIN_FROSTSTAFF',
    'great frost staff':  '2H_FROSTSTAFF',
    'glacial staff':      '2H_GLACIALSTAFF',
    'icicle staff':       'MAIN_ICICLESTAFF_KEEPER',
    'hoarfrost staff':    'MAIN_HOARFROST',
    'permafrost prism':   '2H_ICYSTAFF_AVALON',
    // Cursed Staffs
    'cursed staff':       'MAIN_CURSEDSTAFF',
    'great cursed staff': '2H_CURSEDSTAFF',
    'demonic staff':      '2H_DEMONICSTAFF',
    'cursed skull':       'MAIN_CURSEDSTAFF_MORGANA',
    'lifecurse staff':    '2H_LIFECURSESTAFF',
    'damnation staff':    'MAIN_DAMNATION',
    // Arcane Staffs
    'arcane staff':       'MAIN_ARCANESTAFF',
    'great arcane staff': '2H_ARCANESTAFF',
    'occult staff':       '2H_OCCULTSTAFF',
    'fallen staff':       'MAIN_ARCANESTAFF_UNDEAD',
    'eye of secrets':     '2H_ARCANEPENDULUM',
    'enigmatic staff':    'MAIN_ENIGMATICSTAFF',
    // Holy Staffs
    'holy staff':         'MAIN_HOLYSTAFF',
    'great holy staff':   '2H_HOLYSTAFF',
    'lifetouch staff':    'MAIN_LIFETOUCH',
    'fallen staff (holy)':'MAIN_HOLYSTAFF_UNDEAD',
    'thunderfall':        '2H_THUNDERFALL_AVALON',
    'redemption staff':   '2H_REDEMPTIONSTAFF',
    // Nature Staffs
    'nature staff':       'MAIN_NATURESTAFF',
    'great nature staff': '2H_NATURESTAFF',
    'ironroot staff':     'MAIN_IRONROOT_KEEPER',
    'blight staff':       '2H_BLIGHTSTAFF_MORGANA',
    'rampant staff':      '2H_RAMPANTSTAFF',
    'druidic staff':      'MAIN_DRUIDICSTAFF',
    // Armors - Helmets
    'scholar cowl':           'HEAD_CLOTH_SCHOLAR',
    'mage cowl':              'HEAD_CLOTH_MAGE',
    'royal cowl':             'HEAD_CLOTH_ROYAL',
    'mercenary hood':         'HEAD_LEATHER_MERCENARY',
    'hunter hood':            'HEAD_LEATHER_HUNTER',
    'stalker hood':           'HEAD_LEATHER_STALKER',
    'royal hood':             'HEAD_LEATHER_ROYAL',
    'soldier helmet':         'HEAD_PLATE_SOLDIER',
    'knight helmet':          'HEAD_PLATE_KNIGHT',
    'guardian helmet':        'HEAD_PLATE_GUARDIAN',
    'royal helmet':           'HEAD_PLATE_ROYAL',
    // Armors - Chests
    "scholar robe":           'ARMOR_CLOTH_SCHOLAR',
    "mage robe":              'ARMOR_CLOTH_MAGE',
    "royal robe":             'ARMOR_CLOTH_ROYAL',
    "cleric robe":            'ARMOR_CLOTH_CLERIC',
    "mercenary jacket":       'ARMOR_LEATHER_MERCENARY',
    "hunter jacket":          'ARMOR_LEATHER_HUNTER',
    "assassin jacket":        'ARMOR_LEATHER_ASSASSIN',
    "stalker jacket":         'ARMOR_LEATHER_STALKER',
    "royal jacket":           'ARMOR_LEATHER_ROYAL',
    "soldier armor":          'ARMOR_PLATE_SOLDIER',
    "knight armor":           'ARMOR_PLATE_KNIGHT',
    "guardian armor":         'ARMOR_PLATE_GUARDIAN',
    "royal armor":            'ARMOR_PLATE_ROYAL',
    // Armors - Boots
    'scholar sandals':        'SHOES_CLOTH_SCHOLAR',
    'mage sandals':           'SHOES_CLOTH_MAGE',
    'royal sandals':          'SHOES_CLOTH_ROYAL',
    'mercenary shoes':        'SHOES_LEATHER_MERCENARY',
    'hunter shoes':           'SHOES_LEATHER_HUNTER',
    'assassin shoes':         'SHOES_LEATHER_ASSASSIN',
    'stalker shoes':          'SHOES_LEATHER_STALKER',
    'royal shoes':            'SHOES_LEATHER_ROYAL',
    'soldier boots':          'SHOES_PLATE_SOLDIER',
    'knight boots':           'SHOES_PLATE_KNIGHT',
    'guardian boots':         'SHOES_PLATE_GUARDIAN',
    'royal boots':            'SHOES_PLATE_ROYAL',
  };

  function _normKey(name) {
    return name.toLowerCase()
      .replace(/'/g, '')
      .replace(/\s*\(t[0-9][^)]*\)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getAlbionId(itemName, tier) {
    const base = NAME_TO_ID_BASE[_normKey(itemName)];
    if (!base) return null;
    return `T${tier}_${base}`;
  }

  function _bestPrice(locations) {
    if (!locations || !locations.length) return null;
    const caerleon = locations.find(l => l.city === PREFERRED_CITY && l.sell_price_min > 0);
    if (caerleon) return { price: caerleon.sell_price_min, city: caerleon.city };
    for (const city of FALLBACK_CITIES) {
      const entry = locations.find(l => l.city === city && l.sell_price_min > 0);
      if (entry) return { price: entry.sell_price_min, city: entry.city };
    }
    const any = locations.find(l => l.sell_price_min > 0);
    if (any) return { price: any.sell_price_min, city: any.city };
    return null;
  }

  async function fetchPrices(itemIds) {
    if (!itemIds.length) return {};
    const now = Date.now();
    const toFetch = itemIds.filter(id => !_cache[id] || (now - _cache[id].ts) > CACHE_TTL);
    if (toFetch.length) {
      try {
        const url = `${API_BASE}/${toFetch.join(',')}.json?locations=Caerleon,Bridgewatch,Martlock,Fort+Sterling,Lymhurst,Thetford`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Group by item_id
          const grouped = {};
          data.forEach(entry => {
            if (!grouped[entry.item_id]) grouped[entry.item_id] = [];
            grouped[entry.item_id].push(entry);
          });
          toFetch.forEach(id => {
            const best = _bestPrice(grouped[id] || []);
            _cache[id] = { price: best?.price || 0, city: best?.city || null, ts: now };
          });
        }
      } catch (e) {
        // API unavailable — leave cache empty, caller falls back to estimates
      }
    }
    const result = {};
    itemIds.forEach(id => {
      if (_cache[id]) result[id] = _cache[id];
    });
    return result;
  }

  // Fetch prices for all filled slots in builderState, return map of slotName → {price, city, live}
  async function fetchBuilderPrices(state) {
    const tier = state.tier;
    const slotNames = ['weapon','offhand','helmet','chest','boots','food','potion'];
    const idMap = {}; // slotName → albionId
    slotNames.forEach(slot => {
      const item = state.slots[slot];
      if (!item) return;
      const id = getAlbionId(item.name, tier);
      if (id) idMap[slot] = id;
    });
    const ids = Object.values(idMap);
    if (!ids.length) return {};
    const prices = await fetchPrices(ids);
    const result = {};
    Object.entries(idMap).forEach(([slot, id]) => {
      const entry = prices[id];
      if (entry && entry.price > 0) {
        result[slot] = { price: entry.price, city: entry.city, live: true };
      }
    });
    return result;
  }

  return { fetchBuilderPrices, getAlbionId, fetchPrices };
})();
