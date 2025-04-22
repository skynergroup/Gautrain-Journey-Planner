// Gautrain routes and lines information

// Define the three main Gautrain lines
const GAUTRAIN_LINES = {
    NORTH_SOUTH: {
        id: 'north-south',
        name: 'North-South Line',
        color: '#1A4D2E', // Dark Green
        stations: [
            'hatfield',
            'pretoria',
            'centurion',
            'midrand',
            'marlboro',
            'sandton',
            'rosebank',
            'park'
        ],
        description: 'The main line connecting Hatfield to Park Station'
    },
    EAST_WEST: {
        id: 'east-west',
        name: 'East-West Line',
        color: '#FDB913', // Gold
        stations: [
            'rhodespark',
            'marlboro',
            'sandton'
        ],
        description: 'The line connecting Rhodespark to Sandton via Marlboro'
    },
    AIRPORT: {
        id: 'airport',
        name: 'Airport Line',
        color: '#0077CC', // Blue
        stations: [
            'sandton',
            'marlboro',
            'rhodespark',
            'ortambo'
        ],
        description: 'The line connecting Sandton to OR Tambo International Airport'
    }
};

// Define the coordinates for each line to draw on the map
const LINE_COORDINATES = {
    'north-south': [
        [-25.74762, 28.23794], // Hatfield
        [-25.75545, 28.18681], // Pretoria
        [-25.85133, 28.18938], // Centurion
        [-25.98689, 28.13187], // Midrand
        [-26.08499, 28.11323], // Marlboro
        [-26.10858, 28.05693], // Sandton
        [-26.14632, 28.04363], // Rosebank
        [-26.19632, 28.04363]  // Park Station
    ],
    'east-west': [
        [-26.13833, 28.22333], // Rhodespark
        [-26.08499, 28.11323], // Marlboro
        [-26.10858, 28.05693]  // Sandton
    ],
    'airport': [
        [-26.10858, 28.05693], // Sandton
        [-26.08499, 28.11323], // Marlboro
        [-26.13833, 28.22333], // Rhodespark
        [-26.13361, 28.23417]  // OR Tambo
    ]
};

// Define the train frequency for each line
const LINE_FREQUENCY = {
    'north-south': {
        weekday: {
            peak: 12,      // Every 12 minutes during peak hours
            offPeak: 20,   // Every 20 minutes during off-peak hours
            peakHours: [
                { start: '05:30', end: '08:30' },
                { start: '16:00', end: '19:00' }
            ]
        },
        weekend: {
            frequency: 30  // Every 30 minutes on weekends
        }
    },
    'east-west': {
        weekday: {
            peak: 12,
            offPeak: 20,
            peakHours: [
                { start: '05:30', end: '08:30' },
                { start: '16:00', end: '19:00' }
            ]
        },
        weekend: {
            frequency: 30
        }
    },
    'airport': {
        weekday: {
            peak: 12,
            offPeak: 20,
            peakHours: [
                { start: '05:30', end: '08:30' },
                { start: '16:00', end: '19:00' }
            ]
        },
        weekend: {
            frequency: 30
        }
    }
};

// Define the operating hours for the Gautrain
const OPERATING_HOURS = {
    weekday: {
        start: '05:30',
        end: '21:30'
    },
    saturday: {
        start: '06:00',
        end: '21:00'
    },
    sunday: {
        start: '06:30',
        end: '20:00'
    }
};

// Function to determine which line(s) a journey uses
function getJourneyLines(departureStationId, arrivalStationId) {
    // Convert station IDs to standardized format
    const fromId = departureStationId.toLowerCase().replace(/[^a-z]/g, '');
    const toId = arrivalStationId.toLowerCase().replace(/[^a-z]/g, '');
    
    // Check if both stations are on the same line
    for (const lineKey in GAUTRAIN_LINES) {
        const line = GAUTRAIN_LINES[lineKey];
        if (line.stations.includes(fromId) && line.stations.includes(toId)) {
            return [line];
        }
    }
    
    // If not on the same line, find lines for each station
    const fromLines = [];
    const toLines = [];
    
    for (const lineKey in GAUTRAIN_LINES) {
        const line = GAUTRAIN_LINES[lineKey];
        if (line.stations.includes(fromId)) {
            fromLines.push(line);
        }
        if (line.stations.includes(toId)) {
            toLines.push(line);
        }
    }
    
    // Find common interchange stations
    const interchangeStations = ['marlboro', 'sandton'];
    
    // Return the lines needed for the journey
    return [...new Set([...fromLines, ...toLines])];
}

// Function to get stations on a journey path
function getJourneyStations(departureStationId, arrivalStationId) {
    // Convert station IDs to standardized format
    const fromId = departureStationId.toLowerCase().replace(/[^a-z]/g, '');
    const toId = arrivalStationId.toLowerCase().replace(/[^a-z]/g, '');
    
    // Check if both stations are on the same line
    for (const lineKey in GAUTRAIN_LINES) {
        const line = GAUTRAIN_LINES[lineKey];
        if (line.stations.includes(fromId) && line.stations.includes(toId)) {
            // Get the indices of the stations in the line
            const fromIndex = line.stations.indexOf(fromId);
            const toIndex = line.stations.indexOf(toId);
            
            // Get the stations between the departure and arrival
            if (fromIndex < toIndex) {
                return line.stations.slice(fromIndex, toIndex + 1);
            } else {
                return line.stations.slice(toIndex, fromIndex + 1).reverse();
            }
        }
    }
    
    // If stations are on different lines, we need to find a transfer point
    // For simplicity, we'll use Marlboro or Sandton as transfer points
    const transferStations = ['marlboro', 'sandton'];
    let transferStation = null;
    
    // Find a transfer station that connects both stations
    for (const station of transferStations) {
        let fromLineHasStation = false;
        let toLineHasStation = false;
        
        for (const lineKey in GAUTRAIN_LINES) {
            const line = GAUTRAIN_LINES[lineKey];
            if (line.stations.includes(fromId) && line.stations.includes(station)) {
                fromLineHasStation = true;
            }
            if (line.stations.includes(toId) && line.stations.includes(station)) {
                toLineHasStation = true;
            }
        }
        
        if (fromLineHasStation && toLineHasStation) {
            transferStation = station;
            break;
        }
    }
    
    if (!transferStation) {
        return ['No direct route available'];
    }
    
    // Get stations from departure to transfer
    const firstLegStations = getJourneyStations(fromId, transferStation);
    
    // Get stations from transfer to arrival
    const secondLegStations = getJourneyStations(transferStation, toId);
    
    // Combine the two legs, removing the duplicate transfer station
    return [...firstLegStations.slice(0, -1), ...secondLegStations];
}

// Function to estimate journey time between stations
function estimateJourneyTime(departureStationId, arrivalStationId) {
    // Average speed of Gautrain is about 160 km/h
    // We'll use a simplified calculation based on distance
    
    // Get the stations on the journey
    const stations = getJourneyStations(departureStationId, arrivalStationId);
    
    // If no route is available
    if (stations[0] === 'No direct route available') {
        return null;
    }
    
    // Calculate the total distance
    let totalDistance = 0;
    for (let i = 0; i < stations.length - 1; i++) {
        const station1 = stations[i];
        const station2 = stations[i + 1];
        
        // Find the coordinates of the stations
        const station1Obj = STATIONS.find(s => s.id.toLowerCase().includes(station1));
        const station2Obj = STATIONS.find(s => s.id.toLowerCase().includes(station2));
        
        if (station1Obj && station2Obj) {
            // Calculate distance between the two stations
            const distance = calculateDistance(station1Obj, station2Obj);
            totalDistance += distance;
        }
    }
    
    // Estimate time based on distance (average speed 160 km/h)
    // Add 2 minutes per station for stops (except the first station)
    const travelTimeHours = totalDistance / 160;
    const travelTimeMinutes = travelTimeHours * 60;
    const stationStopTime = (stations.length - 1) * 2;
    
    // Add a small buffer for acceleration/deceleration
    const totalTimeMinutes = Math.ceil(travelTimeMinutes + stationStopTime + 5);
    
    return totalTimeMinutes;
}

// Function to get the line name for a journey
function getJourneyLineName(departureStationId, arrivalStationId) {
    const lines = getJourneyLines(departureStationId, arrivalStationId);
    
    if (lines.length === 1) {
        return lines[0].name;
    } else if (lines.length > 1) {
        return lines.map(line => line.name).join(' & ');
    } else {
        return 'Unknown Line';
    }
}
