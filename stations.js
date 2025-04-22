/**
 * Gautrain Stations Data Module
 *
 * Contains comprehensive information about all Gautrain stations,
 * including coordinates, facilities, connections, and helper functions.
 *
 * @author Skyner Development (www.skyner.co.za)
 * @version 1.1.0
 * @license Copyright (c) 2024 Skyner Development. All rights reserved.
 */

// Gautrain stations with their coordinates and additional information
const STATIONS = [
    {
        id: "hatfield",
        name: "Hatfield",
        coordinates: [28.23794, -25.74762],
        address: "Grosvenor Street, Hatfield, Pretoria",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi"],
        lines: ["north-south"],
        zone: "Pretoria"
    },
    {
        id: "pretoria",
        name: "Pretoria",
        coordinates: [28.18681, -25.75545],
        address: "Pretoria Station, Pretoria Central",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi", "Metrorail"],
        lines: ["north-south"],
        zone: "Pretoria"
    },
    {
        id: "centurion",
        name: "Centurion",
        coordinates: [28.18938, -25.85133],
        address: "West Avenue, Centurion",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi"],
        lines: ["north-south"],
        zone: "Centurion"
    },
    {
        id: "midrand",
        name: "Midrand",
        coordinates: [28.13187, -25.98689],
        address: "K101, Midrand",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi"],
        lines: ["north-south"],
        zone: "Midrand"
    },
    {
        id: "marlboro",
        name: "Marlboro",
        coordinates: [28.11323, -26.08499],
        address: "Marlboro Drive, Marlboro",
        facilities: ["Parking", "Ticket Office"],
        connections: ["Bus", "Taxi"],
        lines: ["north-south", "east-west", "airport"],
        zone: "Johannesburg",
        isInterchange: true
    },
    {
        id: "sandton",
        name: "Sandton",
        coordinates: [28.05693, -26.10858],
        address: "Rivonia Road, Sandton",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office", "Information Desk"],
        connections: ["Bus", "Taxi", "Rea Vaya"],
        lines: ["north-south", "east-west", "airport"],
        zone: "Johannesburg",
        isInterchange: true
    },
    {
        id: "rosebank",
        name: "Rosebank",
        coordinates: [28.04363, -26.14632],
        address: "Oxford Road, Rosebank",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi", "Rea Vaya"],
        lines: ["north-south"],
        zone: "Johannesburg"
    },
    {
        id: "park",
        name: "Park Station",
        coordinates: [28.04363, -26.19632],
        address: "Rissik Street, Johannesburg",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office", "Information Desk"],
        connections: ["Bus", "Taxi", "Metrorail", "Rea Vaya", "Shosholoza Meyl"],
        lines: ["north-south"],
        zone: "Johannesburg"
    },
    {
        id: "rhodespark",
        name: "Rhodespark",
        coordinates: [28.22333, -26.13833],
        address: "Rhodesfield, Kempton Park",
        facilities: ["Parking", "Retail", "ATM", "Ticket Office"],
        connections: ["Bus", "Taxi"],
        lines: ["east-west", "airport"],
        zone: "Ekurhuleni"
    },
    {
        id: "ortambo",
        name: "OR Tambo Airport",
        coordinates: [28.23417, -26.13361],
        address: "O.R. Tambo International Airport, Kempton Park",
        facilities: ["Retail", "ATM", "Ticket Office", "Information Desk", "Currency Exchange"],
        connections: ["Bus", "Taxi", "Airport Shuttle"],
        lines: ["airport"],
        zone: "Ekurhuleni"
    }
];

// Calculate distance between two stations (in kilometers)
function calculateDistance(station1, station2) {
    // Convert coordinates from degrees to radians
    const lat1 = station1.coordinates[1] * Math.PI / 180;
    const lon1 = station1.coordinates[0] * Math.PI / 180;
    const lat2 = station2.coordinates[1] * Math.PI / 180;
    const lon2 = station2.coordinates[0] * Math.PI / 180;

    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.sin(dlat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2)**2;
    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371; // Radius of Earth in kilometers

    // Calculate the distance
    return c * r;
}

// Get station by ID
function getStationById(stationId) {
    return STATIONS.find(station => {
        // Normalize the station ID for comparison
        const normalizedId = station.id.toLowerCase().replace(/[^a-z]/g, '');
        const normalizedSearchId = stationId.toLowerCase().replace(/[^a-z]/g, '');
        return normalizedId.includes(normalizedSearchId) || normalizedSearchId.includes(normalizedId);
    }) || null;
}

// Get stations by line
function getStationsByLine(lineId) {
    return STATIONS.filter(station => station.lines.includes(lineId));
}
