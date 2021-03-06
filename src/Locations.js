export const baseLocations = {
    MOUNTAIN_LAKE  : 0b0000000000000000000001,
    OCEAN_STARDEW  : 0b0000000000000000000010,
    RIVER_TOWN     : 0b0000000000000000000100,
    RIVER_FOREST   : 0b0000000000000000001000,
    POND_FOREST    : 0b0000000000000000010000,
    POND_SECRET    : 0b0000000000000000100000,
    SEWERS         : 0b0000000000000001000000,
    SWAMP          : 0b0000000000000010000000,
    MINES_20       : 0b0000000000000100000000,
    MINES_60       : 0b0000000000001000000000,
    MINES_100      : 0b0000000000010000000000,
    VOLCANO        : 0b0000000000100000000000,
    DESERT         : 0b0000000001000000000000,
    FOREST_FARM    : 0b0000000010000000000000,
    BUG_LAIR       : 0b0000000100000000000000,
    PIRATE_COVE    : 0b0000001000000000000000,
    GINGER_NORTH   : 0b0000010000000000000000,
    GINGER_SOUTH   : 0b0000100000000000000000,
    GINGER_W_FRESH : 0b0001000000000000000000,
    GINGER_W_OCEAN : 0b0010000000000000000000,
    GINGER_SEAST   : 0b0100000000000000000000,
    NIGHT_MARKET   : 0b1000000000000000000000
};

const Locations = {
    ...baseLocations,
    BASE_FRESHWATER: baseLocations.MOUNTAIN_LAKE | baseLocations.RIVER_TOWN | baseLocations.RIVER_FOREST | baseLocations.POND_FOREST,
    GINGER_ISLAND: baseLocations.GINGER_NORTH | baseLocations.GINGER_SOUTH | baseLocations.GINGER_W_FRESH | baseLocations.GINGER_W_OCEAN | baseLocations.GINGER_SEAST | baseLocations.PIRATE_COVE,
};

export default Locations;