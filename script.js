// Constants
const GAUTRAIN_AGENCY_ID = "edObkk6o-0WN3tNZBLqKPg";
const API_BASE_URL = "http://localhost:3000/api"; // Using local proxy server
const MAP_CENTER = [-26.05, 28.10]; // Center of the map (near Midrand)
const MAP_ZOOM = 10; // Default zoom level

// DOM Elements
const departureSelect = document.getElementById('departure');
const arrivalSelect = document.getElementById('arrival');
const travelTimeSelect = document.getElementById('travel-time');
const swapButton = document.getElementById('swap-button');
const checkScheduleButton = document.getElementById('check-schedule');
const loadingElement = document.getElementById('loading');
const resultsElement = document.getElementById('results');
const schedulesElement = document.getElementById('schedules');
const errorElement = document.getElementById('error');
const journeyStationsElement = document.getElementById('journey-stations');
const journeyTimeElement = document.getElementById('journey-time');
const singleFareElement = document.getElementById('single-fare');
const returnFareElement = document.getElementById('return-fare');
const weeklyFareElement = document.getElementById('weekly-fare');
const routeDistanceElement = document.getElementById('route-distance');
const routeDurationElement = document.getElementById('route-duration');
const routeLineElement = document.getElementById('route-line');
const routeStationsElement = document.getElementById('route-stations');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Map variables
let map;
let stationMarkers = {};
let routeLines = {};
let journeyPath;

// Initialize the app
function init() {
    console.log('Initializing application...');

    // Check if required variables are loaded
    if (typeof STATIONS === 'undefined') {
        console.error('STATIONS data not loaded. Make sure stations.js is included before script.js');
        showError('Application failed to load station data. Please refresh the page.');
        return;
    }

    if (typeof GAUTRAIN_LINES === 'undefined' || typeof LINE_COORDINATES === 'undefined') {
        console.error('Route data not loaded. Make sure routes.js is included before script.js');
        showError('Application failed to load route data. Please refresh the page.');
        return;
    }

    try {
        // Populate station dropdowns first
        populateStationDropdowns();

        // Initialize the map
        initMap();

        // Set up event listeners
        setupEventListeners();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Failed to initialize the application. Please refresh the page and try again.');
    }
}

// Initialize the map
function initMap() {
    // Create a map centered on Gauteng
    map = L.map('map-container').setView(MAP_CENTER, MAP_ZOOM);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Add station markers
    addStationMarkers();

    // Add train lines
    addTrainLines();
}

// Add markers for all stations
function addStationMarkers() {
    STATIONS.forEach(station => {
        // Create a custom icon based on the station type
        const isInterchange = station.isInterchange;
        const isAirport = station.id === 'ortambo';

        let markerIcon;

        if (isAirport) {
            // Airport icon
            markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="station-marker airport-marker"><i class="fas fa-plane"></i></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
        } else if (isInterchange) {
            // Interchange station icon
            markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="station-marker interchange-marker"><i class="fas fa-exchange-alt"></i></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
        } else {
            // Regular station icon
            markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="station-marker"><i class="fas fa-train"></i></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
        }

        // Create a marker for the station
        const marker = L.marker([station.coordinates[1], station.coordinates[0]], {
            icon: markerIcon,
            title: station.name
        }).addTo(map);

        // Add a popup with station information
        let linesText = '';
        try {
            if (typeof GAUTRAIN_LINES !== 'undefined' && station.lines && Array.isArray(station.lines)) {
                linesText = station.lines.map(line => {
                    const upperLine = line.toUpperCase();
                    return GAUTRAIN_LINES[upperLine] ? GAUTRAIN_LINES[upperLine].name : line;
                }).join(', ');
            } else {
                linesText = station.lines ? station.lines.join(', ') : '';
            }
        } catch (error) {
            console.error('Error formatting station lines:', error);
            linesText = station.lines ? station.lines.join(', ') : '';
        }

        marker.bindPopup(`
            <div class="map-popup">
                <h3>${station.name} Station</h3>
                <p><strong>Zone:</strong> ${station.zone}</p>
                <p><strong>Lines:</strong> ${linesText}</p>
                <div class="popup-buttons">
                    <button class="popup-btn from-btn" onclick="selectStationFromMap('${station.id}', 'from')">From Here</button>
                    <button class="popup-btn to-btn" onclick="selectStationFromMap('${station.id}', 'to')">To Here</button>
                </div>
            </div>
        `);

        // Store the marker for later reference
        stationMarkers[station.id] = marker;
    });

    // Add CSS for the station markers
    const style = document.createElement('style');
    style.textContent = `
        .station-marker {
            background-color: #1A4D2E;
            color: white;
            border-radius: 50%;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        .interchange-marker {
            background-color: #FDB913;
            color: #1A4D2E;
        }
        .airport-marker {
            background-color: #0077CC;
            color: white;
        }
        .map-popup h3 {
            margin: 0 0 10px 0;
            color: #1A4D2E;
        }
        .popup-buttons {
            display: flex;
            gap: 5px;
            margin-top: 10px;
        }
        .popup-btn {
            flex: 1;
            padding: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
        }
        .from-btn {
            background-color: #1A4D2E;
            color: white;
        }
        .to-btn {
            background-color: #FDB913;
            color: #1A4D2E;
        }
    `;
    document.head.appendChild(style);
}

// Add train lines to the map
function addTrainLines() {
    // Check if GAUTRAIN_LINES and LINE_COORDINATES are defined
    if (typeof GAUTRAIN_LINES === 'undefined' || typeof LINE_COORDINATES === 'undefined') {
        console.error('GAUTRAIN_LINES or LINE_COORDINATES not defined. Make sure routes.js is loaded.');
        return;
    }

    // Add each line with its own color
    for (const lineKey in GAUTRAIN_LINES) {
        const line = GAUTRAIN_LINES[lineKey];
        const coordinates = LINE_COORDINATES[line.id];

        if (coordinates) {
            const routeLine = L.polyline(coordinates, {
                color: line.color,
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            // Add a popup with line information
            routeLine.bindPopup(`<strong>${line.name}</strong><br>${line.description}`);

            // Store the line for later reference
            routeLines[line.id] = routeLine;
        }
    }

    console.log('Added train lines to map');
}

// Populate station dropdowns
function populateStationDropdowns() {
    // Check if the STATIONS array exists and has elements
    if (!STATIONS || !Array.isArray(STATIONS) || STATIONS.length === 0) {
        console.error('STATIONS array is not available or empty');
        return;
    }

    // Sort stations by name
    const sortedStations = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));

    // Clear existing options
    departureSelect.innerHTML = '';
    arrivalSelect.innerHTML = '';

    // Add a default option
    const defaultDepartureOption = document.createElement('option');
    defaultDepartureOption.value = '';
    defaultDepartureOption.textContent = 'Select departure station';
    defaultDepartureOption.disabled = true;
    defaultDepartureOption.selected = true;
    departureSelect.appendChild(defaultDepartureOption);

    const defaultArrivalOption = document.createElement('option');
    defaultArrivalOption.value = '';
    defaultArrivalOption.textContent = 'Select arrival station';
    defaultArrivalOption.disabled = true;
    defaultArrivalOption.selected = true;
    arrivalSelect.appendChild(defaultArrivalOption);

    // Add stations to dropdowns
    sortedStations.forEach(station => {
        // Departure dropdown
        const departureOption = document.createElement('option');
        departureOption.value = station.id;
        departureOption.textContent = station.name;
        departureSelect.appendChild(departureOption);

        // Arrival dropdown
        const arrivalOption = document.createElement('option');
        arrivalOption.value = station.id;
        arrivalOption.textContent = station.name;
        arrivalSelect.appendChild(arrivalOption);
    });

    // Set default values for testing
    if (sortedStations.length >= 2) {
        // Set default departure to Hatfield if available, otherwise first station
        const hatfieldStation = sortedStations.find(station => station.id === 'hatfield');
        if (hatfieldStation) {
            departureSelect.value = hatfieldStation.id;
        } else {
            departureSelect.value = sortedStations[0].id;
        }

        // Set default arrival to Sandton if available, otherwise second station
        const sandtonStation = sortedStations.find(station => station.id === 'sandton');
        if (sandtonStation) {
            arrivalSelect.value = sandtonStation.id;
        } else {
            arrivalSelect.value = sortedStations[1].id;
        }
    }

    console.log('Populated dropdowns with', sortedStations.length, 'stations');
}

// Set up event listeners
function setupEventListeners() {
    // Check schedule button
    checkScheduleButton.addEventListener('click', checkSchedule);

    // Swap stations button
    swapButton.addEventListener('click', swapStations);

    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Swap departure and arrival stations
function swapStations() {
    const tempDeparture = departureSelect.value;
    const tempArrival = arrivalSelect.value;

    departureSelect.value = tempArrival;
    arrivalSelect.value = tempDeparture;

    // Add a rotation animation to the swap button
    swapButton.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        swapButton.style.transform = 'rotate(0deg)';
    }, 300);
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Update tab content
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Select a station from the map
function selectStationFromMap(stationId, type) {
    if (type === 'from') {
        departureSelect.value = stationId;
    } else if (type === 'to') {
        arrivalSelect.value = stationId;
    }

    // Close the popup
    map.closePopup();
}

// Check if the API is live
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const isLive = await response.json();
        return isLive;
    } catch (error) {
        console.error('Error checking API status:', error);
        return false;
    }
}

// Get journey information from the API
async function getJourneyInfo(departureStationId, arrivalStationId, departureTime = null) {
    try {
        // Get station objects
        const departureStation = getStationById(departureStationId);
        const arrivalStation = getStationById(arrivalStationId);

        if (!departureStation || !arrivalStation) {
            throw new Error('One or both stations not found');
        }

        // Show loading state
        showLoading();

        // Check if API is live
        const isLive = await checkApiStatus();
        if (!isLive) {
            throw new Error('Gautrain API is currently unavailable');
        }

        // Format departure time if provided
        let formattedTime = null;
        if (departureTime && departureTime !== 'now') {
            // Convert local time to UTC ISO string
            const now = new Date();
            let hours, minutes;

            switch (departureTime) {
                case 'morning':
                    hours = 7;
                    minutes = 0;
                    break;
                case 'afternoon':
                    hours = 13;
                    minutes = 0;
                    break;
                case 'evening':
                    hours = 17;
                    minutes = 0;
                    break;
                default:
                    hours = now.getHours();
                    minutes = now.getMinutes();
            }

            now.setHours(hours, minutes, 0, 0);
            formattedTime = now.toISOString();
        }

        // Create journey request
        const journeyRequest = {
            geometry: {
                coordinates: [
                    departureStation.coordinates,
                    arrivalStation.coordinates
                ],
                type: "MultiPoint"
            },
            profile: "ClosestToTime",
            maxItineraries: 5,
            timeType: "DepartAfter",
            time: formattedTime,
            only: {
                agencies: [GAUTRAIN_AGENCY_ID],
                modes: []
            }
        };

        // Make the API call
        const response = await fetch(`${API_BASE_URL}/journey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journeyRequest)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const journeyData = await response.json();
        return journeyData;
    } catch (error) {
        console.error('Error getting journey info:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

// Check schedule and display results
async function checkSchedule() {
    // Clear previous results
    clearResults();

    try {
        // Get selected stations
        const departureStationId = departureSelect.value;
        const arrivalStationId = arrivalSelect.value;

        // Validate selection
        if (!departureStationId || !arrivalStationId) {
            showError('Please select both departure and arrival stations');
            return;
        }

        if (departureStationId === arrivalStationId) {
            showError('Please select different stations for departure and arrival');
            return;
        }

        // Get departure time
        const travelTime = travelTimeSelect.value;

        try {
            // Get journey information from API
            const journeyData = await getJourneyInfo(departureStationId, arrivalStationId, travelTime);

            // Process and display results
            displayResults(journeyData, departureStationId, arrivalStationId);

            // Show journey on map
            showJourneyOnMap(departureStationId, arrivalStationId);

            // Display fare information
            displayFareInfo(departureStationId, arrivalStationId);

            // Display route information
            displayRouteInfo(departureStationId, arrivalStationId);
        } catch (error) {
            // If API fails, use simulated data
            console.warn('API failed, using simulated data:', error);

            // Generate simulated journey data
            const simulatedData = generateSimulatedJourneyData(departureStationId, arrivalStationId, travelTime);

            // Process and display simulated results
            displayResults(simulatedData, departureStationId, arrivalStationId);

            // Show journey on map
            showJourneyOnMap(departureStationId, arrivalStationId);

            // Display fare information
            displayFareInfo(departureStationId, arrivalStationId);

            // Display route information
            displayRouteInfo(departureStationId, arrivalStationId);
        }
    } catch (error) {
        console.error('Error checking schedule:', error);
        showError('Failed to get schedule information. Please try again later.');
    }
}

// Generate simulated journey data when API is not available
function generateSimulatedJourneyData(departureStationId, arrivalStationId, travelTime) {
    // Get station objects
    const departureStation = getStationById(departureStationId);
    const arrivalStation = getStationById(arrivalStationId);

    // Estimate journey time
    const journeyTimeMinutes = estimateJourneyTime(departureStationId, arrivalStationId);

    // Generate departure times based on selected travel time
    const now = new Date();
    let baseTime;

    switch (travelTime) {
        case 'morning':
            baseTime = new Date();
            baseTime.setHours(7, 0, 0, 0);
            break;
        case 'afternoon':
            baseTime = new Date();
            baseTime.setHours(13, 0, 0, 0);
            break;
        case 'evening':
            baseTime = new Date();
            baseTime.setHours(17, 0, 0, 0);
            break;
        default:
            baseTime = now;
    }

    // Generate 5 itineraries with 15-minute intervals
    const itineraries = [];

    for (let i = 0; i < 5; i++) {
        const departureTime = new Date(baseTime);
        departureTime.setMinutes(departureTime.getMinutes() + i * 15);

        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + journeyTimeMinutes);

        itineraries.push({
            departureTime: departureTime.toISOString(),
            arrivalTime: arrivalTime.toISOString(),
            duration: journeyTimeMinutes * 60, // Convert to seconds
            legs: [
                {
                    distance: {
                        value: calculateDistance(departureStation, arrivalStation) * 1000 // Convert to meters
                    }
                }
            ]
        });
    }

    return {
        itineraries: itineraries
    };
}

// Display journey results
function displayResults(journeyData, departureStationId, arrivalStationId) {
    if (!journeyData.itineraries || journeyData.itineraries.length === 0) {
        showError('No schedules found for the selected route');
        return;
    }

    // Get station objects
    const departureStation = getStationById(departureStationId);
    const arrivalStation = getStationById(arrivalStationId);

    // Update journey summary
    journeyStationsElement.textContent = `${departureStation.name} to ${arrivalStation.name}`;
    journeyTimeElement.textContent = `${Math.round(calculateDistance(departureStation, arrivalStation))} km`;

    // Clear previous results
    schedulesElement.innerHTML = '';

    // Process each itinerary
    journeyData.itineraries.forEach((itinerary, index) => {
        const departureTime = new Date(itinerary.departureTime);
        const arrivalTime = new Date(itinerary.arrivalTime);
        const durationMinutes = Math.floor(itinerary.duration / 60);

        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';

        scheduleItem.innerHTML = `
            <p><i class="fas fa-subway"></i> <span class="schedule-time">Train ${index + 1}</span></p>
            <p><i class="fas fa-sign-out-alt"></i> Depart: <span class="schedule-time">${formatTime(departureTime)}</span> from ${departureStation.name}</p>
            <p><i class="fas fa-sign-in-alt"></i> Arrive: <span class="schedule-time">${formatTime(arrivalTime)}</span> at ${arrivalStation.name}</p>
            <p><i class="fas fa-clock"></i> Duration: ${durationMinutes} minutes</p>
        `;

        schedulesElement.appendChild(scheduleItem);
    });

    // Show results
    resultsElement.classList.remove('hidden');

    // Set the active tab to schedules
    switchTab('schedules');
}

// Display fare information
function displayFareInfo(departureStationId, arrivalStationId) {
    // Calculate fares for different types
    const singleFare = calculateFare(departureStationId, arrivalStationId, 'Single Trip');
    const returnFare = calculateFare(departureStationId, arrivalStationId, 'Return Trip');
    const weeklyFare = calculateFare(departureStationId, arrivalStationId, 'Weekly Pass');

    // Update fare elements
    singleFareElement.textContent = `${singleFare.currency}${singleFare.totalFare}`;
    returnFareElement.textContent = `${returnFare.currency}${returnFare.totalFare}`;
    weeklyFareElement.textContent = `${weeklyFare.currency}${weeklyFare.totalFare}`;
}

// Display route information
function displayRouteInfo(departureStationId, arrivalStationId) {
    // Get station objects
    const departureStation = getStationById(departureStationId);
    const arrivalStation = getStationById(arrivalStationId);

    // Calculate distance
    const distance = calculateDistance(departureStation, arrivalStation);

    // Estimate journey time
    const journeyTime = estimateJourneyTime(departureStationId, arrivalStationId);

    // Get line information
    const lineName = getJourneyLineName(departureStationId, arrivalStationId);

    // Get stations on the route
    const stationsOnRoute = getJourneyStations(departureStationId, arrivalStationId);

    // Update route information elements
    routeDistanceElement.textContent = `${distance.toFixed(1)} km`;
    routeDurationElement.textContent = `${journeyTime} minutes`;
    routeLineElement.textContent = lineName;

    // Clear previous stations list
    routeStationsElement.innerHTML = '';

    // Add stations to the list
    stationsOnRoute.forEach((stationId, index) => {
        const station = getStationById(stationId);
        if (station) {
            const listItem = document.createElement('li');

            // Add appropriate icon based on position
            let icon;
            if (index === 0) {
                icon = 'fa-play';
            } else if (index === stationsOnRoute.length - 1) {
                icon = 'fa-flag-checkered';
            } else {
                icon = 'fa-circle';
            }

            listItem.innerHTML = `<i class="fas ${icon}"></i> ${station.name}`;
            routeStationsElement.appendChild(listItem);
        }
    });
}

// Show journey on the map
function showJourneyOnMap(departureStationId, arrivalStationId) {
    // Clear any existing journey path
    clearJourneyPath();

    // Get station objects
    const departureStation = getStationById(departureStationId);
    const arrivalStation = getStationById(arrivalStationId);

    if (!departureStation || !arrivalStation) {
        return;
    }

    // Get stations on the route
    const stationsOnRoute = getJourneyStations(departureStationId, arrivalStationId);

    // Create coordinates array for the journey path
    const pathCoordinates = [];

    stationsOnRoute.forEach(stationId => {
        const station = getStationById(stationId);
        if (station) {
            pathCoordinates.push([station.coordinates[1], station.coordinates[0]]);
        }
    });

    // Create a line for the journey path
    if (pathCoordinates.length > 1) {
        journeyPath = L.polyline(pathCoordinates, {
            color: '#e74c3c',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(map);

        // Fit the map to show the journey
        map.fitBounds(journeyPath.getBounds(), {
            padding: [50, 50]
        });
    }

    // Highlight the departure and arrival stations
    highlightStations(departureStationId, arrivalStationId);
}

// Clear the journey path from the map
function clearJourneyPath() {
    if (journeyPath) {
        map.removeLayer(journeyPath);
        journeyPath = null;
    }

    // Reset station highlights
    resetStationHighlights();
}

// Highlight departure and arrival stations
function highlightStations(departureStationId, arrivalStationId) {
    // Reset any existing highlights
    resetStationHighlights();

    // Get station markers
    const departureMarker = stationMarkers[departureStationId];
    const arrivalMarker = stationMarkers[arrivalStationId];

    // Create custom icons for departure and arrival
    const departureIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="station-marker departure-marker"><i class="fas fa-play"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const arrivalIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="station-marker arrival-marker"><i class="fas fa-flag-checkered"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Add CSS for the highlighted markers
    const style = document.createElement('style');
    style.textContent = `
        .departure-marker {
            background-color: #4CAF50;
            transform: scale(1.2);
            z-index: 1000;
        }
        .arrival-marker {
            background-color: #e74c3c;
            transform: scale(1.2);
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);

    // Update the icons
    if (departureMarker) {
        departureMarker.setIcon(departureIcon);
        departureMarker.setZIndexOffset(1000);
    }

    if (arrivalMarker) {
        arrivalMarker.setIcon(arrivalIcon);
        arrivalMarker.setZIndexOffset(1000);
    }
}

// Reset station highlights
function resetStationHighlights() {
    // Reset all station markers to their original state
    STATIONS.forEach(station => {
        const marker = stationMarkers[station.id];
        if (marker) {
            const isInterchange = station.isInterchange;
            const isAirport = station.id === 'ortambo';

            let markerIcon;

            if (isAirport) {
                markerIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="station-marker airport-marker"><i class="fas fa-plane"></i></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
            } else if (isInterchange) {
                markerIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="station-marker interchange-marker"><i class="fas fa-exchange-alt"></i></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
            } else {
                markerIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="station-marker"><i class="fas fa-train"></i></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
            }

            marker.setIcon(markerIcon);
            marker.setZIndexOffset(0);
        }
    });
}

// Format time (HH:MM)
function formatTime(date) {
    return date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Format date and time
function formatDateTime(date) {
    return date.toLocaleString('en-ZA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Show loading state
function showLoading() {
    loadingElement.classList.remove('hidden');
    resultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    loadingElement.classList.add('hidden');
}

// Show error message
function showError(message) {
    // Make sure the error element exists
    if (!errorElement) {
        // If the error element doesn't exist yet, create a temporary one
        const tempError = document.createElement('div');
        tempError.className = 'error-message';
        tempError.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        tempError.style.position = 'fixed';
        tempError.style.top = '20px';
        tempError.style.left = '50%';
        tempError.style.transform = 'translateX(-50%)';
        tempError.style.zIndex = '9999';
        tempError.style.backgroundColor = '#fff3f3';
        tempError.style.color = '#e74c3c';
        tempError.style.padding = '20px';
        tempError.style.borderRadius = '8px';
        tempError.style.borderLeft = '4px solid #e74c3c';
        tempError.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(tempError);

        // Remove the error after 5 seconds
        setTimeout(() => {
            document.body.removeChild(tempError);
        }, 5000);
        return;
    }

    // Update the error message
    const errorMessage = errorElement.querySelector('p');
    if (errorMessage) {
        errorMessage.textContent = message;
    } else {
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${message}</p>`;
    }

    // Show the error element
    errorElement.classList.remove('hidden');

    // Hide the results element if it exists
    if (resultsElement) {
        resultsElement.classList.add('hidden');
    }
}

// Clear all results
function clearResults() {
    schedulesElement.innerHTML = '';
    resultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');

    // Clear journey path on map
    clearJourneyPath();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
