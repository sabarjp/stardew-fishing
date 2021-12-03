const baseLocations = {
    MOUNTAIN_LAKE : 0b00000000000000000001,
    OCEAN_STARDEW : 0b00000000000000000010,
    RIVER_TOWN    : 0b00000000000000000100,
    RIVER_FOREST  : 0b00000000000000001000,
    POND_FOREST   : 0b00000000000000010000,
    POND_SECRET   : 0b00000000000000100000,
    SEWERS        : 0b00000000000001000000,
    SWAMP         : 0b00000000000010000000,
    MINES_20      : 0b00000000000100000000,
    MINES_60      : 0b00000000001000000000,
    MINES_100     : 0b00000000010000000000,
    VOLCANO       : 0b00000000100000000000,
    DESERT        : 0b00000001000000000000,
    FOREST_FARM   : 0b00000010000000000000,
    BUG_LAIR      : 0b00000100000000000000,
    PIRATE_COVE   : 0b00001000000000000000,
    GINGER_NORTH  : 0b00010000000000000000,
    GINGER_SOUTH  : 0b00100000000000000000,
    GINGER_WEST   : 0b01000000000000000000,
    NIGHT_MARKET  : 0b10000000000000000000
};

const Locations = {
    ...baseLocations,
    BASE_FRESHWATER: baseLocations.MOUNTAIN_LAKE | baseLocations.RIVER_TOWN | baseLocations.RIVER_FOREST | baseLocations.POND_FOREST
};

export default Locations;