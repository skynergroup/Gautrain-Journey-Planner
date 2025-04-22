// Gautrain fare information based on the 2024 fare guide
// Source: https://fare-guide.gautrainalerts.co.za/wp-content/uploads/2024/05/FARES-POSTER_2024.pdf

// Define fare zones
const FARE_ZONES = {
    PRETORIA: 'Pretoria',
    CENTURION: 'Centurion',
    MIDRAND: 'Midrand',
    JOHANNESBURG: 'Johannesburg',
    EKURHULENI: 'Ekurhuleni'
};

// Fare matrix for single trips between zones (in ZAR)
// Based on the 2024 fare guide
const ZONE_FARE_MATRIX = {
    // From Pretoria
    [FARE_ZONES.PRETORIA]: {
        [FARE_ZONES.PRETORIA]: 22,
        [FARE_ZONES.CENTURION]: 32,
        [FARE_ZONES.MIDRAND]: 52,
        [FARE_ZONES.JOHANNESBURG]: 82,
        [FARE_ZONES.EKURHULENI]: 154
    },
    // From Centurion
    [FARE_ZONES.CENTURION]: {
        [FARE_ZONES.PRETORIA]: 32,
        [FARE_ZONES.CENTURION]: 22,
        [FARE_ZONES.MIDRAND]: 32,
        [FARE_ZONES.JOHANNESBURG]: 62,
        [FARE_ZONES.EKURHULENI]: 134
    },
    // From Midrand
    [FARE_ZONES.MIDRAND]: {
        [FARE_ZONES.PRETORIA]: 52,
        [FARE_ZONES.CENTURION]: 32,
        [FARE_ZONES.MIDRAND]: 22,
        [FARE_ZONES.JOHANNESBURG]: 42,
        [FARE_ZONES.EKURHULENI]: 118
    },
    // From Johannesburg
    [FARE_ZONES.JOHANNESBURG]: {
        [FARE_ZONES.PRETORIA]: 82,
        [FARE_ZONES.CENTURION]: 62,
        [FARE_ZONES.MIDRAND]: 42,
        [FARE_ZONES.JOHANNESBURG]: 22,
        [FARE_ZONES.EKURHULENI]: 98
    },
    // From Ekurhuleni
    [FARE_ZONES.EKURHULENI]: {
        [FARE_ZONES.PRETORIA]: 154,
        [FARE_ZONES.CENTURION]: 134,
        [FARE_ZONES.MIDRAND]: 118,
        [FARE_ZONES.JOHANNESBURG]: 98,
        [FARE_ZONES.EKURHULENI]: 22
    }
};

// Special fare for Airport trips
const AIRPORT_FARE = {
    [FARE_ZONES.PRETORIA]: 191,
    [FARE_ZONES.CENTURION]: 171,
    [FARE_ZONES.MIDRAND]: 155,
    [FARE_ZONES.JOHANNESBURG]: 135,
    [FARE_ZONES.EKURHULENI]: 82
};

// Discount rates for different fare types
const FARE_DISCOUNTS = {
    RETURN: 0.10, // 10% discount for return trips
    WEEKLY: 0.20, // 20% discount for weekly passes (10 trips)
    MONTHLY: 0.30  // 30% discount for monthly passes (44 trips)
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
    
    // Get zones for the stations
    const departureZone = departureStation.zone;
    const arrivalZone = arrivalStation.zone;
    
    // Check if this is an airport trip
    const isAirportTrip = departureStation.id === 'ortambo' || arrivalStation.id === 'ortambo';
    
    let baseFare = 0;
    
    if (isAirportTrip) {
        // For airport trips, use the special airport fare
        const nonAirportStation = departureStation.id === 'ortambo' ? arrivalStation : departureStation;
        baseFare = AIRPORT_FARE[nonAirportStation.zone];
    } else {
        // For regular trips, use the zone fare matrix
        baseFare = ZONE_FARE_MATRIX[departureZone][arrivalZone];
    }
    
    // Calculate fare based on the fare type
    let totalFare = baseFare;
    let discount = 0;
    
    switch (fareType) {
        case 'Return Trip':
            // Return trip has a discount
            totalFare = baseFare * 2 * (1 - FARE_DISCOUNTS.RETURN);
            discount = baseFare * 2 * FARE_DISCOUNTS.RETURN;
            break;
        case 'Weekly Pass':
            // Weekly pass (10 trips) has a larger discount
            totalFare = baseFare * 10 * (1 - FARE_DISCOUNTS.WEEKLY);
            discount = baseFare * 10 * FARE_DISCOUNTS.WEEKLY;
            break;
        case 'Monthly Pass':
            // Monthly pass (44 trips) has the largest discount
            totalFare = baseFare * 44 * (1 - FARE_DISCOUNTS.MONTHLY);
            discount = baseFare * 44 * FARE_DISCOUNTS.MONTHLY;
            break;
        default:
            // Single trip, no discount
            totalFare = baseFare;
            discount = 0;
    }
    
    return {
        error: false,
        baseFare: baseFare,
        fareType: fareType,
        totalFare: Math.round(totalFare),
        discount: Math.round(discount),
        currency: 'R',
        isAirportTrip: isAirportTrip,
        departureZone: departureZone,
        arrivalZone: arrivalZone
    };
}
