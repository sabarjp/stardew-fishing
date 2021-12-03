import Quality from "./Quality";
import Locations from "./Locations";

export const convertXpToLevel = (xp) => {
    if (xp >= 15000) return 10;
    if (xp >= 10000) return 9;
    if (xp >= 6900)  return 8;
    if (xp >= 4800)  return 7;
    if (xp >= 3300)  return 6;
    if (xp >= 2150)  return 5;
    if (xp >= 1300)  return 4;
    if (xp >= 770)   return 3;
    if (xp >= 380)   return 2;
    if (xp >= 100)   return 1;
    return 0;
  }

  export const determineCastDepth = (fishLevel, location) => {
    let castDistanceModifier = 0;

    if (fishLevel >= 1)  castDistanceModifier++;
    if (fishLevel >= 4)  castDistanceModifier++;
    if (fishLevel >= 8)  castDistanceModifier++;
    if (fishLevel >= 15) castDistanceModifier++;

    let castDistanceN = 3 + castDistanceModifier;
    let castDistanceE = 4 + castDistanceModifier;

    let castDistance = castDistanceE;

    // we cast south in cindersap forest
    if (location === Locations.RIVER_FOREST)
      castDistance = castDistanceN

    // calculate depth
    if (castDistance >= 5)
      return 5;
    if (castDistance >= 4)
      return 3;
    if (castDistance >= 3)
      return 2;
    return 1;
  }

  export const determineBaseFishQuality = (fishLevel, depth) => {
    let chanceNormal = 1.00;
    let chanceSilver = 0.00;
    let chanceGold = 0.00;

    if (depth === 1) {
      if (fishLevel >= 14) {
        chanceNormal = 0.67;
        chanceSilver = 0.33;
      }
    }

    else if (depth === 2) {
      if (fishLevel >= 14) {
        chanceNormal = 0.00;
        chanceSilver = 0.67;
        chanceGold   = 0.33;
      } else if (fishLevel >= 8) {
        chanceNormal = 0.00;
        chanceSilver = 1.00;
        chanceGold   = 0.00;
      } else if (fishLevel >= 6) {
        chanceNormal = 0.33;
        chanceSilver = 0.67;
        chanceGold   = 0.00;
      } else if (fishLevel >= 4) {
        chanceNormal = 0.56;
        chanceSilver = 0.44;
        chanceGold   = 0.00;
      } else if (fishLevel >= 2) {
        chanceNormal = 0.67;
        chanceSilver = 0.33;
        chanceGold   = 0.00;
      } else {
        chanceNormal = 0.73;
        chanceSilver = 0.27;
        chanceGold   = 0.00;
      }
    }

    else if (depth === 3) {
      if (fishLevel >= 12) {
        chanceNormal = 0.00;
        chanceSilver = 0.00;
        chanceGold   = 1.00;
      } else if (fishLevel >= 10) {
        chanceNormal = 0.00;
        chanceSilver = 0.10;
        chanceGold   = 0.90;
      } else if (fishLevel >= 8) {
        chanceNormal = 0.00;
        chanceSilver = 0.95;
        chanceGold   = 0.05;
      } else if (fishLevel >= 6) {
        chanceNormal = 0.00;
        chanceSilver = 0.98;
        chanceGold   = 0.02;
      } else if (fishLevel >= 4) {
        chanceNormal = 0.03;
        chanceSilver = 0.95;
        chanceGold   = 0.02;
      } else if (fishLevel >= 2) {
        chanceNormal = 0.27;
        chanceSilver = 0.71;
        chanceGold   = 0.01;
      } else {
        chanceNormal = 0.42;
        chanceSilver = 0.57;
        chanceGold   = 0.01;
      }
    }

    else if (depth === 5) {
      if (fishLevel >= 6) {
        chanceNormal = 0.00;
        chanceSilver = 0.00;
        chanceGold   = 1.00;
      } else if (fishLevel >= 4) {
        chanceNormal = 0.00;
        chanceSilver = 0.32;
        chanceGold   = 0.68;
      } else if (fishLevel >= 2) {
        chanceNormal = 0.00;
        chanceSilver = 0.49;
        chanceGold   = 0.51;
      } else {
        chanceNormal = 0.20;
        chanceSilver = 0.39;
        chanceGold   = 0.41;
      }
    }

    else {
      console.error("No such depth: " + depth);
    }

    // use cumulative odds
    let roll = Math.random();

    if (roll < chanceNormal)
      return Quality.NORMAL;
    if (roll < (chanceNormal + chanceSilver))
      return Quality.SILVER;
    if (roll < (chanceNormal + chanceSilver + chanceGold))
      return Quality.GOLD;

    console.error("Fishing quality odds did not stack to 1.0? [" + (chanceNormal+chanceSilver+chanceGold) + "]")
    return Quality.GOLD;
  }

  export const upgradeQuality = (quality) => {
    if (quality === Quality.NORMAL)
      return Quality.SILVER;
    if (quality === Quality.SILVER)
      return Quality.GOLD;
    if (quality === Quality.GOLD)
      return Quality.IRIDIUM;
    if (quality === Quality.IRIDIUM)
      return Quality.IRIDIUM;

    return Quality.NORMAL;
  }

  export const determineValue = (baseValue, quality) => {
    if (quality === Quality.NORMAL)
      return baseValue;
    if (quality === Quality.SILVER)
      return baseValue * 1.25;
    if (quality === Quality.GOLD)
      return baseValue * 1.5;
    if (quality === Quality.IRIDIUM)
      return baseValue * 2.0;

    console.error("Unable to match quality for value: " + quality);
    return baseValue;
  }

  export const determineEnergyHealth = (baseEnergy, quality) => {
    if (quality === Quality.NORMAL)
      return baseEnergy;
    if (quality === Quality.SILVER)
      return baseEnergy * 1.4;
    if (quality === Quality.GOLD)
      return baseEnergy * 1.8;
    if (quality === Quality.IRIDIUM)
      return baseEnergy * 2.6;

    console.error("Unable to match quality for health/energy: " + quality);
    return baseEnergy;
  }

  // TODO: account for angler profession
  export const determineEnergyPerGold = (baseValue, baseEnergy, quality) => {
    const gold = determineValue(baseValue, quality);
    const energy = determineEnergyHealth(baseEnergy, quality);
    return (energy / gold);
  }

  /**
   * Returns the index of the fish in the passed in array with the highest 
   * energy per gold. 
   */
  export const findHighestEnergyPerGold = (fishes) => {
    const epgFishes = fishes
      .map((fish, ndx) => {
        const fishWithQuality = {
          ...fish, 
          epg: determineEnergyPerGold(fish.baseValue, fish.baseEnergy, fish.quality),
          index: ndx
        };
        return fishWithQuality;
      })
      .filter((fish) => fish.name !== "Trash")
      .sort((a, b) => b.epg - a.epg)
    return epgFishes[0].index;
  }