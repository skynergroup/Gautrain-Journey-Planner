/**
 * Gautrain Fares Module
 *
 * Contains comprehensive fare information for all Gautrain routes,
 * including single trips, return trips, weekly and monthly passes.
 *
 * @author Skyner Development (www.skyner.co.za)
 * @version 1.2.0
 * @license Copyright (c) 2024 Skyner Development. All rights reserved.
 */

// Gautrain fare information based on the updated 2024 fare guide
// Source: assets/updated fares/image.png and assets/updated fares/image 2.png

// Define stations for fare calculation
const FARE_STATIONS = {
    HATFIELD: 'hatfield',
    PRETORIA: 'pretoria',
    CENTURION: 'centurion',
    MIDRAND: 'midrand',
    MARLBORO: 'marlboro',
    SANDTON: 'sandton',
    ROSEBANK: 'rosebank',
    PARK: 'park',
    RHODESFIELD: 'rhodespark',
    OR_TAMBO: 'ortambo'
};

// Fare matrix for single trips (in ZAR)
// Based on the updated 2024 fare guide - Peak Period Rates
const SINGLE_FARE_MATRIX = {
    // From Hatfield
    [FARE_STATIONS.HATFIELD]: {
        [FARE_STATIONS.HATFIELD]: 0,
        [FARE_STATIONS.PRETORIA]: 36,
        [FARE_STATIONS.CENTURION]: 47,
        [FARE_STATIONS.MIDRAND]: 74,
        [FARE_STATIONS.MARLBORO]: 87,
        [FARE_STATIONS.SANDTON]: 92,
        [FARE_STATIONS.ROSEBANK]: 99,
        [FARE_STATIONS.PARK]: 106,
        [FARE_STATIONS.RHODESFIELD]: 99,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Pretoria
    [FARE_STATIONS.PRETORIA]: {
        [FARE_STATIONS.HATFIELD]: 36,
        [FARE_STATIONS.PRETORIA]: 0,
        [FARE_STATIONS.CENTURION]: 41,
        [FARE_STATIONS.MIDRAND]: 59,
        [FARE_STATIONS.MARLBORO]: 81,
        [FARE_STATIONS.SANDTON]: 87,
        [FARE_STATIONS.ROSEBANK]: 92,
        [FARE_STATIONS.PARK]: 99,
        [FARE_STATIONS.RHODESFIELD]: 92,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Centurion
    [FARE_STATIONS.CENTURION]: {
        [FARE_STATIONS.HATFIELD]: 47,
        [FARE_STATIONS.PRETORIA]: 41,
        [FARE_STATIONS.CENTURION]: 0,
        [FARE_STATIONS.MIDRAND]: 48,
        [FARE_STATIONS.MARLBORO]: 59,
        [FARE_STATIONS.SANDTON]: 76,
        [FARE_STATIONS.ROSEBANK]: 80,
        [FARE_STATIONS.PARK]: 87,
        [FARE_STATIONS.RHODESFIELD]: 85,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Midrand
    [FARE_STATIONS.MIDRAND]: {
        [FARE_STATIONS.HATFIELD]: 74,
        [FARE_STATIONS.PRETORIA]: 59,
        [FARE_STATIONS.CENTURION]: 48,
        [FARE_STATIONS.MIDRAND]: 0,
        [FARE_STATIONS.MARLBORO]: 41,
        [FARE_STATIONS.SANDTON]: 48,
        [FARE_STATIONS.ROSEBANK]: 55,
        [FARE_STATIONS.PARK]: 59,
        [FARE_STATIONS.RHODESFIELD]: 56,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Marlboro
    [FARE_STATIONS.MARLBORO]: {
        [FARE_STATIONS.HATFIELD]: 87,
        [FARE_STATIONS.PRETORIA]: 81,
        [FARE_STATIONS.CENTURION]: 59,
        [FARE_STATIONS.MIDRAND]: 41,
        [FARE_STATIONS.MARLBORO]: 0,
        [FARE_STATIONS.SANDTON]: 36,
        [FARE_STATIONS.ROSEBANK]: 40,
        [FARE_STATIONS.PARK]: 48,
        [FARE_STATIONS.RHODESFIELD]: 41,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From Sandton
    [FARE_STATIONS.SANDTON]: {
        [FARE_STATIONS.HATFIELD]: 92,
        [FARE_STATIONS.PRETORIA]: 87,
        [FARE_STATIONS.CENTURION]: 76,
        [FARE_STATIONS.MIDRAND]: 48,
        [FARE_STATIONS.MARLBORO]: 36,
        [FARE_STATIONS.SANDTON]: 0,
        [FARE_STATIONS.ROSEBANK]: 36,
        [FARE_STATIONS.PARK]: 40,
        [FARE_STATIONS.RHODESFIELD]: 53,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From Rosebank
    [FARE_STATIONS.ROSEBANK]: {
        [FARE_STATIONS.HATFIELD]: 99,
        [FARE_STATIONS.PRETORIA]: 92,
        [FARE_STATIONS.CENTURION]: 80,
        [FARE_STATIONS.MIDRAND]: 55,
        [FARE_STATIONS.MARLBORO]: 40,
        [FARE_STATIONS.SANDTON]: 36,
        [FARE_STATIONS.ROSEBANK]: 0,
        [FARE_STATIONS.PARK]: 36,
        [FARE_STATIONS.RHODESFIELD]: 56,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Park Station
    [FARE_STATIONS.PARK]: {
        [FARE_STATIONS.HATFIELD]: 106,
        [FARE_STATIONS.PRETORIA]: 99,
        [FARE_STATIONS.CENTURION]: 87,
        [FARE_STATIONS.MIDRAND]: 59,
        [FARE_STATIONS.MARLBORO]: 48,
        [FARE_STATIONS.SANDTON]: 40,
        [FARE_STATIONS.ROSEBANK]: 36,
        [FARE_STATIONS.PARK]: 0,
        [FARE_STATIONS.RHODESFIELD]: 59,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Rhodesfield
    [FARE_STATIONS.RHODESFIELD]: {
        [FARE_STATIONS.HATFIELD]: 99,
        [FARE_STATIONS.PRETORIA]: 92,
        [FARE_STATIONS.CENTURION]: 85,
        [FARE_STATIONS.MIDRAND]: 56,
        [FARE_STATIONS.MARLBORO]: 41,
        [FARE_STATIONS.SANDTON]: 53,
        [FARE_STATIONS.ROSEBANK]: 56,
        [FARE_STATIONS.PARK]: 59,
        [FARE_STATIONS.RHODESFIELD]: 0,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From OR Tambo
    [FARE_STATIONS.OR_TAMBO]: {
        [FARE_STATIONS.HATFIELD]: 248,
        [FARE_STATIONS.PRETORIA]: 248,
        [FARE_STATIONS.CENTURION]: 248,
        [FARE_STATIONS.MIDRAND]: 230,
        [FARE_STATIONS.MARLBORO]: 219,
        [FARE_STATIONS.SANDTON]: 219,
        [FARE_STATIONS.ROSEBANK]: 230,
        [FARE_STATIONS.PARK]: 230,
        [FARE_STATIONS.RHODESFIELD]: 219,
        [FARE_STATIONS.OR_TAMBO]: 0
    }
};

// Return trip fare matrix (in ZAR)
// Based on the updated 2024 fare guide
const RETURN_FARE_MATRIX = {
    // From Hatfield
    [FARE_STATIONS.HATFIELD]: {
        [FARE_STATIONS.HATFIELD]: 0,
        [FARE_STATIONS.PRETORIA]: 72,
        [FARE_STATIONS.CENTURION]: 94,
        [FARE_STATIONS.MIDRAND]: 148,
        [FARE_STATIONS.MARLBORO]: 174,
        [FARE_STATIONS.SANDTON]: 184,
        [FARE_STATIONS.ROSEBANK]: 198,
        [FARE_STATIONS.PARK]: 212,
        [FARE_STATIONS.RHODESFIELD]: 198,
        [FARE_STATIONS.OR_TAMBO]: 496
    },
    // From Pretoria
    [FARE_STATIONS.PRETORIA]: {
        [FARE_STATIONS.HATFIELD]: 72,
        [FARE_STATIONS.PRETORIA]: 0,
        [FARE_STATIONS.CENTURION]: 82,
        [FARE_STATIONS.MIDRAND]: 118,
        [FARE_STATIONS.MARLBORO]: 162,
        [FARE_STATIONS.SANDTON]: 174,
        [FARE_STATIONS.ROSEBANK]: 184,
        [FARE_STATIONS.PARK]: 198,
        [FARE_STATIONS.RHODESFIELD]: 184,
        [FARE_STATIONS.OR_TAMBO]: 496
    },
    // From Centurion
    [FARE_STATIONS.CENTURION]: {
        [FARE_STATIONS.HATFIELD]: 94,
        [FARE_STATIONS.PRETORIA]: 82,
        [FARE_STATIONS.CENTURION]: 0,
        [FARE_STATIONS.MIDRAND]: 96,
        [FARE_STATIONS.MARLBORO]: 118,
        [FARE_STATIONS.SANDTON]: 152,
        [FARE_STATIONS.ROSEBANK]: 160,
        [FARE_STATIONS.PARK]: 174,
        [FARE_STATIONS.RHODESFIELD]: 170,
        [FARE_STATIONS.OR_TAMBO]: 496
    },
    // From Midrand
    [FARE_STATIONS.MIDRAND]: {
        [FARE_STATIONS.HATFIELD]: 148,
        [FARE_STATIONS.PRETORIA]: 118,
        [FARE_STATIONS.CENTURION]: 96,
        [FARE_STATIONS.MIDRAND]: 0,
        [FARE_STATIONS.MARLBORO]: 82,
        [FARE_STATIONS.SANDTON]: 96,
        [FARE_STATIONS.ROSEBANK]: 110,
        [FARE_STATIONS.PARK]: 118,
        [FARE_STATIONS.RHODESFIELD]: 112,
        [FARE_STATIONS.OR_TAMBO]: 460
    },
    // From Marlboro
    [FARE_STATIONS.MARLBORO]: {
        [FARE_STATIONS.HATFIELD]: 174,
        [FARE_STATIONS.PRETORIA]: 162,
        [FARE_STATIONS.CENTURION]: 118,
        [FARE_STATIONS.MIDRAND]: 82,
        [FARE_STATIONS.MARLBORO]: 0,
        [FARE_STATIONS.SANDTON]: 72,
        [FARE_STATIONS.ROSEBANK]: 80,
        [FARE_STATIONS.PARK]: 96,
        [FARE_STATIONS.RHODESFIELD]: 82,
        [FARE_STATIONS.OR_TAMBO]: 438
    },
    // From Sandton
    [FARE_STATIONS.SANDTON]: {
        [FARE_STATIONS.HATFIELD]: 184,
        [FARE_STATIONS.PRETORIA]: 174,
        [FARE_STATIONS.CENTURION]: 152,
        [FARE_STATIONS.MIDRAND]: 96,
        [FARE_STATIONS.MARLBORO]: 72,
        [FARE_STATIONS.SANDTON]: 0,
        [FARE_STATIONS.ROSEBANK]: 72,
        [FARE_STATIONS.PARK]: 80,
        [FARE_STATIONS.RHODESFIELD]: 106,
        [FARE_STATIONS.OR_TAMBO]: 438
    },
    // From Rosebank
    [FARE_STATIONS.ROSEBANK]: {
        [FARE_STATIONS.HATFIELD]: 198,
        [FARE_STATIONS.PRETORIA]: 184,
        [FARE_STATIONS.CENTURION]: 160,
        [FARE_STATIONS.MIDRAND]: 110,
        [FARE_STATIONS.MARLBORO]: 80,
        [FARE_STATIONS.SANDTON]: 72,
        [FARE_STATIONS.ROSEBANK]: 0,
        [FARE_STATIONS.PARK]: 72,
        [FARE_STATIONS.RHODESFIELD]: 112,
        [FARE_STATIONS.OR_TAMBO]: 460
    },
    // From Park Station
    [FARE_STATIONS.PARK]: {
        [FARE_STATIONS.HATFIELD]: 212,
        [FARE_STATIONS.PRETORIA]: 198,
        [FARE_STATIONS.CENTURION]: 174,
        [FARE_STATIONS.MIDRAND]: 118,
        [FARE_STATIONS.MARLBORO]: 96,
        [FARE_STATIONS.SANDTON]: 80,
        [FARE_STATIONS.ROSEBANK]: 72,
        [FARE_STATIONS.PARK]: 0,
        [FARE_STATIONS.RHODESFIELD]: 118,
        [FARE_STATIONS.OR_TAMBO]: 460
    },
    // From Rhodesfield
    [FARE_STATIONS.RHODESFIELD]: {
        [FARE_STATIONS.HATFIELD]: 198,
        [FARE_STATIONS.PRETORIA]: 184,
        [FARE_STATIONS.CENTURION]: 170,
        [FARE_STATIONS.MIDRAND]: 112,
        [FARE_STATIONS.MARLBORO]: 82,
        [FARE_STATIONS.SANDTON]: 106,
        [FARE_STATIONS.ROSEBANK]: 112,
        [FARE_STATIONS.PARK]: 118,
        [FARE_STATIONS.RHODESFIELD]: 0,
        [FARE_STATIONS.OR_TAMBO]: 438
    },
    // From OR Tambo
    [FARE_STATIONS.OR_TAMBO]: {
        [FARE_STATIONS.HATFIELD]: 496,
        [FARE_STATIONS.PRETORIA]: 496,
        [FARE_STATIONS.CENTURION]: 496,
        [FARE_STATIONS.MIDRAND]: 460,
        [FARE_STATIONS.MARLBORO]: 438,
        [FARE_STATIONS.SANDTON]: 438,
        [FARE_STATIONS.ROSEBANK]: 460,
        [FARE_STATIONS.PARK]: 460,
        [FARE_STATIONS.RHODESFIELD]: 438,
        [FARE_STATIONS.OR_TAMBO]: 0
    }
};

// Weekly fare matrix (10 train trips valid for 10 days)
const WEEKLY_FARE_MATRIX = {
    // From Hatfield
    [FARE_STATIONS.HATFIELD]: {
        [FARE_STATIONS.HATFIELD]: 0,
        [FARE_STATIONS.PRETORIA]: 333,
        [FARE_STATIONS.CENTURION]: 435,
        [FARE_STATIONS.MIDRAND]: 685,
        [FARE_STATIONS.MARLBORO]: 805,
        [FARE_STATIONS.SANDTON]: 851,
        [FARE_STATIONS.ROSEBANK]: 916,
        [FARE_STATIONS.PARK]: 981,
        [FARE_STATIONS.RHODESFIELD]: 916,
        [FARE_STATIONS.OR_TAMBO]: 2230
    },
    // From Pretoria
    [FARE_STATIONS.PRETORIA]: {
        [FARE_STATIONS.HATFIELD]: 333,
        [FARE_STATIONS.PRETORIA]: 0,
        [FARE_STATIONS.CENTURION]: 380,
        [FARE_STATIONS.MIDRAND]: 546,
        [FARE_STATIONS.MARLBORO]: 750,
        [FARE_STATIONS.SANDTON]: 805,
        [FARE_STATIONS.ROSEBANK]: 851,
        [FARE_STATIONS.PARK]: 916,
        [FARE_STATIONS.RHODESFIELD]: 851,
        [FARE_STATIONS.OR_TAMBO]: 2230
    },
    // From Centurion
    [FARE_STATIONS.CENTURION]: {
        [FARE_STATIONS.HATFIELD]: 435,
        [FARE_STATIONS.PRETORIA]: 380,
        [FARE_STATIONS.CENTURION]: 0,
        [FARE_STATIONS.MIDRAND]: 444,
        [FARE_STATIONS.MARLBORO]: 546,
        [FARE_STATIONS.SANDTON]: 703,
        [FARE_STATIONS.ROSEBANK]: 740,
        [FARE_STATIONS.PARK]: 805,
        [FARE_STATIONS.RHODESFIELD]: 787,
        [FARE_STATIONS.OR_TAMBO]: 2230
    },
    // From Midrand
    [FARE_STATIONS.MIDRAND]: {
        [FARE_STATIONS.HATFIELD]: 685,
        [FARE_STATIONS.PRETORIA]: 546,
        [FARE_STATIONS.CENTURION]: 444,
        [FARE_STATIONS.MIDRAND]: 0,
        [FARE_STATIONS.MARLBORO]: 380,
        [FARE_STATIONS.SANDTON]: 444,
        [FARE_STATIONS.ROSEBANK]: 509,
        [FARE_STATIONS.PARK]: 546,
        [FARE_STATIONS.RHODESFIELD]: 518,
        [FARE_STATIONS.OR_TAMBO]: 2070
    },
    // From Marlboro
    [FARE_STATIONS.MARLBORO]: {
        [FARE_STATIONS.HATFIELD]: 805,
        [FARE_STATIONS.PRETORIA]: 750,
        [FARE_STATIONS.CENTURION]: 546,
        [FARE_STATIONS.MIDRAND]: 380,
        [FARE_STATIONS.MARLBORO]: 0,
        [FARE_STATIONS.SANDTON]: 333,
        [FARE_STATIONS.ROSEBANK]: 370,
        [FARE_STATIONS.PARK]: 444,
        [FARE_STATIONS.RHODESFIELD]: 380,
        [FARE_STATIONS.OR_TAMBO]: 1970
    },
    // From Sandton
    [FARE_STATIONS.SANDTON]: {
        [FARE_STATIONS.HATFIELD]: 851,
        [FARE_STATIONS.PRETORIA]: 805,
        [FARE_STATIONS.CENTURION]: 703,
        [FARE_STATIONS.MIDRAND]: 444,
        [FARE_STATIONS.MARLBORO]: 333,
        [FARE_STATIONS.SANDTON]: 0,
        [FARE_STATIONS.ROSEBANK]: 333,
        [FARE_STATIONS.PARK]: 370,
        [FARE_STATIONS.RHODESFIELD]: 491,
        [FARE_STATIONS.OR_TAMBO]: 1970
    },
    // From Rosebank
    [FARE_STATIONS.ROSEBANK]: {
        [FARE_STATIONS.HATFIELD]: 916,
        [FARE_STATIONS.PRETORIA]: 851,
        [FARE_STATIONS.CENTURION]: 740,
        [FARE_STATIONS.MIDRAND]: 509,
        [FARE_STATIONS.MARLBORO]: 370,
        [FARE_STATIONS.SANDTON]: 333,
        [FARE_STATIONS.ROSEBANK]: 0,
        [FARE_STATIONS.PARK]: 333,
        [FARE_STATIONS.RHODESFIELD]: 518,
        [FARE_STATIONS.OR_TAMBO]: 2070
    },
    // From Park Station
    [FARE_STATIONS.PARK]: {
        [FARE_STATIONS.HATFIELD]: 981,
        [FARE_STATIONS.PRETORIA]: 916,
        [FARE_STATIONS.CENTURION]: 805,
        [FARE_STATIONS.MIDRAND]: 546,
        [FARE_STATIONS.MARLBORO]: 444,
        [FARE_STATIONS.SANDTON]: 370,
        [FARE_STATIONS.ROSEBANK]: 333,
        [FARE_STATIONS.PARK]: 0,
        [FARE_STATIONS.RHODESFIELD]: 546,
        [FARE_STATIONS.OR_TAMBO]: 2070
    },
    // From Rhodesfield
    [FARE_STATIONS.RHODESFIELD]: {
        [FARE_STATIONS.HATFIELD]: 916,
        [FARE_STATIONS.PRETORIA]: 851,
        [FARE_STATIONS.CENTURION]: 787,
        [FARE_STATIONS.MIDRAND]: 518,
        [FARE_STATIONS.MARLBORO]: 380,
        [FARE_STATIONS.SANDTON]: 491,
        [FARE_STATIONS.ROSEBANK]: 518,
        [FARE_STATIONS.PARK]: 546,
        [FARE_STATIONS.RHODESFIELD]: 0,
        [FARE_STATIONS.OR_TAMBO]: 1970
    },
    // From OR Tambo
    [FARE_STATIONS.OR_TAMBO]: {
        [FARE_STATIONS.HATFIELD]: 2230,
        [FARE_STATIONS.PRETORIA]: 2230,
        [FARE_STATIONS.CENTURION]: 2230,
        [FARE_STATIONS.MIDRAND]: 2070,
        [FARE_STATIONS.MARLBORO]: 1970,
        [FARE_STATIONS.SANDTON]: 1970,
        [FARE_STATIONS.ROSEBANK]: 2070,
        [FARE_STATIONS.PARK]: 2070,
        [FARE_STATIONS.RHODESFIELD]: 1970,
        [FARE_STATIONS.OR_TAMBO]: 0
    }
};

// Monthly fare matrix (44 train trips valid for 44 days)
const MONTHLY_FARE_MATRIX = {
    // From Hatfield
    [FARE_STATIONS.HATFIELD]: {
        [FARE_STATIONS.HATFIELD]: 0,
        [FARE_STATIONS.PRETORIA]: 1347,
        [FARE_STATIONS.CENTURION]: 1758,
        [FARE_STATIONS.MIDRAND]: 2768,
        [FARE_STATIONS.MARLBORO]: 3254,
        [FARE_STATIONS.SANDTON]: 3441,
        [FARE_STATIONS.ROSEBANK]: 3703,
        [FARE_STATIONS.PARK]: 3965,
        [FARE_STATIONS.RHODESFIELD]: 3703,
        [FARE_STATIONS.OR_TAMBO]: 9000
    },
    // From Pretoria
    [FARE_STATIONS.PRETORIA]: {
        [FARE_STATIONS.HATFIELD]: 1347,
        [FARE_STATIONS.PRETORIA]: 0,
        [FARE_STATIONS.CENTURION]: 1534,
        [FARE_STATIONS.MIDRAND]: 2207,
        [FARE_STATIONS.MARLBORO]: 3030,
        [FARE_STATIONS.SANDTON]: 3254,
        [FARE_STATIONS.ROSEBANK]: 3441,
        [FARE_STATIONS.PARK]: 3703,
        [FARE_STATIONS.RHODESFIELD]: 3441,
        [FARE_STATIONS.OR_TAMBO]: 9000
    },
    // From Centurion
    [FARE_STATIONS.CENTURION]: {
        [FARE_STATIONS.HATFIELD]: 1758,
        [FARE_STATIONS.PRETORIA]: 1534,
        [FARE_STATIONS.CENTURION]: 0,
        [FARE_STATIONS.MIDRAND]: 1796,
        [FARE_STATIONS.MARLBORO]: 2207,
        [FARE_STATIONS.SANDTON]: 2843,
        [FARE_STATIONS.ROSEBANK]: 2992,
        [FARE_STATIONS.PARK]: 3254,
        [FARE_STATIONS.RHODESFIELD]: 3179,
        [FARE_STATIONS.OR_TAMBO]: 9000
    },
    // From Midrand
    [FARE_STATIONS.MIDRAND]: {
        [FARE_STATIONS.HATFIELD]: 2768,
        [FARE_STATIONS.PRETORIA]: 2207,
        [FARE_STATIONS.CENTURION]: 1796,
        [FARE_STATIONS.MIDRAND]: 0,
        [FARE_STATIONS.MARLBORO]: 1534,
        [FARE_STATIONS.SANDTON]: 1796,
        [FARE_STATIONS.ROSEBANK]: 2057,
        [FARE_STATIONS.PARK]: 2207,
        [FARE_STATIONS.RHODESFIELD]: 2095,
        [FARE_STATIONS.OR_TAMBO]: 8360
    },
    // From Marlboro
    [FARE_STATIONS.MARLBORO]: {
        [FARE_STATIONS.HATFIELD]: 3254,
        [FARE_STATIONS.PRETORIA]: 3030,
        [FARE_STATIONS.CENTURION]: 2207,
        [FARE_STATIONS.MIDRAND]: 1534,
        [FARE_STATIONS.MARLBORO]: 0,
        [FARE_STATIONS.SANDTON]: 1347,
        [FARE_STATIONS.ROSEBANK]: 1496,
        [FARE_STATIONS.PARK]: 1796,
        [FARE_STATIONS.RHODESFIELD]: 1534,
        [FARE_STATIONS.OR_TAMBO]: 7960
    },
    // From Sandton
    [FARE_STATIONS.SANDTON]: {
        [FARE_STATIONS.HATFIELD]: 3441,
        [FARE_STATIONS.PRETORIA]: 3254,
        [FARE_STATIONS.CENTURION]: 2843,
        [FARE_STATIONS.MIDRAND]: 1796,
        [FARE_STATIONS.MARLBORO]: 1347,
        [FARE_STATIONS.SANDTON]: 0,
        [FARE_STATIONS.ROSEBANK]: 1347,
        [FARE_STATIONS.PARK]: 1496,
        [FARE_STATIONS.RHODESFIELD]: 1983,
        [FARE_STATIONS.OR_TAMBO]: 7960
    },
    // From Rosebank
    [FARE_STATIONS.ROSEBANK]: {
        [FARE_STATIONS.HATFIELD]: 3703,
        [FARE_STATIONS.PRETORIA]: 3441,
        [FARE_STATIONS.CENTURION]: 2992,
        [FARE_STATIONS.MIDRAND]: 2057,
        [FARE_STATIONS.MARLBORO]: 1496,
        [FARE_STATIONS.SANDTON]: 1347,
        [FARE_STATIONS.ROSEBANK]: 0,
        [FARE_STATIONS.PARK]: 1347,
        [FARE_STATIONS.RHODESFIELD]: 2095,
        [FARE_STATIONS.OR_TAMBO]: 8360
    },
    // From Park Station
    [FARE_STATIONS.PARK]: {
        [FARE_STATIONS.HATFIELD]: 3965,
        [FARE_STATIONS.PRETORIA]: 3703,
        [FARE_STATIONS.CENTURION]: 3254,
        [FARE_STATIONS.MIDRAND]: 2207,
        [FARE_STATIONS.MARLBORO]: 1796,
        [FARE_STATIONS.SANDTON]: 1496,
        [FARE_STATIONS.ROSEBANK]: 1347,
        [FARE_STATIONS.PARK]: 0,
        [FARE_STATIONS.RHODESFIELD]: 2207,
        [FARE_STATIONS.OR_TAMBO]: 8360
    },
    // From Rhodesfield
    [FARE_STATIONS.RHODESFIELD]: {
        [FARE_STATIONS.HATFIELD]: 3703,
        [FARE_STATIONS.PRETORIA]: 3441,
        [FARE_STATIONS.CENTURION]: 3179,
        [FARE_STATIONS.MIDRAND]: 2095,
        [FARE_STATIONS.MARLBORO]: 1534,
        [FARE_STATIONS.SANDTON]: 1983,
        [FARE_STATIONS.ROSEBANK]: 2095,
        [FARE_STATIONS.PARK]: 2207,
        [FARE_STATIONS.RHODESFIELD]: 0,
        [FARE_STATIONS.OR_TAMBO]: 7960
    },
    // From OR Tambo
    [FARE_STATIONS.OR_TAMBO]: {
        [FARE_STATIONS.HATFIELD]: 9000,
        [FARE_STATIONS.PRETORIA]: 9000,
        [FARE_STATIONS.CENTURION]: 9000,
        [FARE_STATIONS.MIDRAND]: 8360,
        [FARE_STATIONS.MARLBORO]: 7960,
        [FARE_STATIONS.SANDTON]: 7960,
        [FARE_STATIONS.ROSEBANK]: 8360,
        [FARE_STATIONS.PARK]: 8360,
        [FARE_STATIONS.RHODESFIELD]: 7960,
        [FARE_STATIONS.OR_TAMBO]: 0
    }
};

// Off-peak fare matrix (Pay-As-You-Go Single Train Fares)
const OFFPEAK_FARE_MATRIX = {
    // From Hatfield
    [FARE_STATIONS.HATFIELD]: {
        [FARE_STATIONS.HATFIELD]: 0,
        [FARE_STATIONS.PRETORIA]: 29,
        [FARE_STATIONS.CENTURION]: 38,
        [FARE_STATIONS.MIDRAND]: 59,
        [FARE_STATIONS.MARLBORO]: 70,
        [FARE_STATIONS.SANDTON]: 74,
        [FARE_STATIONS.ROSEBANK]: 79,
        [FARE_STATIONS.PARK]: 85,
        [FARE_STATIONS.RHODESFIELD]: 79,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Pretoria
    [FARE_STATIONS.PRETORIA]: {
        [FARE_STATIONS.HATFIELD]: 29,
        [FARE_STATIONS.PRETORIA]: 0,
        [FARE_STATIONS.CENTURION]: 33,
        [FARE_STATIONS.MIDRAND]: 47,
        [FARE_STATIONS.MARLBORO]: 65,
        [FARE_STATIONS.SANDTON]: 70,
        [FARE_STATIONS.ROSEBANK]: 74,
        [FARE_STATIONS.PARK]: 79,
        [FARE_STATIONS.RHODESFIELD]: 74,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Centurion
    [FARE_STATIONS.CENTURION]: {
        [FARE_STATIONS.HATFIELD]: 38,
        [FARE_STATIONS.PRETORIA]: 33,
        [FARE_STATIONS.CENTURION]: 0,
        [FARE_STATIONS.MIDRAND]: 38,
        [FARE_STATIONS.MARLBORO]: 47,
        [FARE_STATIONS.SANDTON]: 61,
        [FARE_STATIONS.ROSEBANK]: 64,
        [FARE_STATIONS.PARK]: 70,
        [FARE_STATIONS.RHODESFIELD]: 68,
        [FARE_STATIONS.OR_TAMBO]: 248
    },
    // From Midrand
    [FARE_STATIONS.MIDRAND]: {
        [FARE_STATIONS.HATFIELD]: 59,
        [FARE_STATIONS.PRETORIA]: 47,
        [FARE_STATIONS.CENTURION]: 38,
        [FARE_STATIONS.MIDRAND]: 0,
        [FARE_STATIONS.MARLBORO]: 33,
        [FARE_STATIONS.SANDTON]: 38,
        [FARE_STATIONS.ROSEBANK]: 44,
        [FARE_STATIONS.PARK]: 47,
        [FARE_STATIONS.RHODESFIELD]: 45,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Marlboro
    [FARE_STATIONS.MARLBORO]: {
        [FARE_STATIONS.HATFIELD]: 70,
        [FARE_STATIONS.PRETORIA]: 65,
        [FARE_STATIONS.CENTURION]: 47,
        [FARE_STATIONS.MIDRAND]: 33,
        [FARE_STATIONS.MARLBORO]: 0,
        [FARE_STATIONS.SANDTON]: 29,
        [FARE_STATIONS.ROSEBANK]: 32,
        [FARE_STATIONS.PARK]: 38,
        [FARE_STATIONS.RHODESFIELD]: 33,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From Sandton
    [FARE_STATIONS.SANDTON]: {
        [FARE_STATIONS.HATFIELD]: 74,
        [FARE_STATIONS.PRETORIA]: 70,
        [FARE_STATIONS.CENTURION]: 61,
        [FARE_STATIONS.MIDRAND]: 38,
        [FARE_STATIONS.MARLBORO]: 29,
        [FARE_STATIONS.SANDTON]: 0,
        [FARE_STATIONS.ROSEBANK]: 29,
        [FARE_STATIONS.PARK]: 32,
        [FARE_STATIONS.RHODESFIELD]: 42,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From Rosebank
    [FARE_STATIONS.ROSEBANK]: {
        [FARE_STATIONS.HATFIELD]: 79,
        [FARE_STATIONS.PRETORIA]: 74,
        [FARE_STATIONS.CENTURION]: 64,
        [FARE_STATIONS.MIDRAND]: 44,
        [FARE_STATIONS.MARLBORO]: 32,
        [FARE_STATIONS.SANDTON]: 29,
        [FARE_STATIONS.ROSEBANK]: 0,
        [FARE_STATIONS.PARK]: 29,
        [FARE_STATIONS.RHODESFIELD]: 45,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Park Station
    [FARE_STATIONS.PARK]: {
        [FARE_STATIONS.HATFIELD]: 85,
        [FARE_STATIONS.PRETORIA]: 79,
        [FARE_STATIONS.CENTURION]: 70,
        [FARE_STATIONS.MIDRAND]: 47,
        [FARE_STATIONS.MARLBORO]: 38,
        [FARE_STATIONS.SANDTON]: 32,
        [FARE_STATIONS.ROSEBANK]: 29,
        [FARE_STATIONS.PARK]: 0,
        [FARE_STATIONS.RHODESFIELD]: 47,
        [FARE_STATIONS.OR_TAMBO]: 230
    },
    // From Rhodesfield
    [FARE_STATIONS.RHODESFIELD]: {
        [FARE_STATIONS.HATFIELD]: 79,
        [FARE_STATIONS.PRETORIA]: 74,
        [FARE_STATIONS.CENTURION]: 68,
        [FARE_STATIONS.MIDRAND]: 45,
        [FARE_STATIONS.MARLBORO]: 33,
        [FARE_STATIONS.SANDTON]: 42,
        [FARE_STATIONS.ROSEBANK]: 45,
        [FARE_STATIONS.PARK]: 47,
        [FARE_STATIONS.RHODESFIELD]: 0,
        [FARE_STATIONS.OR_TAMBO]: 219
    },
    // From OR Tambo
    [FARE_STATIONS.OR_TAMBO]: {
        [FARE_STATIONS.HATFIELD]: 248,
        [FARE_STATIONS.PRETORIA]: 248,
        [FARE_STATIONS.CENTURION]: 248,
        [FARE_STATIONS.MIDRAND]: 230,
        [FARE_STATIONS.MARLBORO]: 219,
        [FARE_STATIONS.SANDTON]: 219,
        [FARE_STATIONS.ROSEBANK]: 230,
        [FARE_STATIONS.PARK]: 230,
        [FARE_STATIONS.RHODESFIELD]: 219,
        [FARE_STATIONS.OR_TAMBO]: 0
    }
};

// Calculate fare between two stations
function calculateFare(departureStationId, arrivalStationId, fareType = 'Single Trip') {
    // Get station objects
    const departureStation = getStationById(departureStationId);
    const arrivalStation = getStationById(arrivalStationId);

    if (!departureStation || !arrivalStation) {
        return {
            error: true,
            message: 'One or both stations not found'
        };
    }

    // Get station IDs
    const departureId = departureStation.id;
    const arrivalId = arrivalStation.id;

    // Initialize fare variables
    let baseFare = 0;
    let totalFare = 0;
    let discount = 0;

    // Determine fare based on fare type
    switch (fareType) {
        case 'Single Trip':
            // Use peak period single trip fares
            if (SINGLE_FARE_MATRIX[departureId] && SINGLE_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = baseFare;
            }
            break;

        case 'Return Trip':
            // Use return trip fares
            if (RETURN_FARE_MATRIX[departureId] && RETURN_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = RETURN_FARE_MATRIX[departureId][arrivalId];
                discount = (baseFare * 2) - totalFare;
            }
            break;

        case 'Weekly Pass':
            // Use weekly pass fares (10 trips)
            if (WEEKLY_FARE_MATRIX[departureId] && WEEKLY_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = WEEKLY_FARE_MATRIX[departureId][arrivalId];
                discount = (baseFare * 10) - totalFare;
            }
            break;

        case 'Monthly Pass':
            // Use monthly pass fares (44 trips)
            if (MONTHLY_FARE_MATRIX[departureId] && MONTHLY_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = MONTHLY_FARE_MATRIX[departureId][arrivalId];
                discount = (baseFare * 44) - totalFare;
            }
            break;

        case 'Off-Peak':
            // Use off-peak fares
            if (OFFPEAK_FARE_MATRIX[departureId] && OFFPEAK_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = OFFPEAK_FARE_MATRIX[departureId][arrivalId];
                discount = baseFare - totalFare;
            }
            break;

        default:
            // Default to single trip
            if (SINGLE_FARE_MATRIX[departureId] && SINGLE_FARE_MATRIX[departureId][arrivalId] !== undefined) {
                baseFare = SINGLE_FARE_MATRIX[departureId][arrivalId];
                totalFare = baseFare;
            }
    }

    // Check if this is an airport trip
    const isAirportTrip = departureStation.id === 'ortambo' || arrivalStation.id === 'ortambo';

    return {
        error: false,
        baseFare: baseFare,
        fareType: fareType,
        totalFare: totalFare,
        discount: Math.round(discount),
        currency: 'R',
        isAirportTrip: isAirportTrip,
        departureStation: departureStation.name,
        arrivalStation: arrivalStation.name
    };
}
