<h1 align="center">Gautrain Journey Planner</h1>

<p align="center">
  <img src="https://skyner.co.za/assets/images/logos/development-dark.png" alt="Skyner Development" width="400">
</p>

<p align="center">
  <a href="https://github.com/skynergroup/Gautrain-Journey-Planner">
    <img src="https://img.shields.io/github/stars/skynergroup/Gautrain-Journey-Planner?style=social" alt="GitHub stars">
  </a>
</p>

A comprehensive web application developed by [Skyner Development](https://www.skyner.co.za) that provides Gautrain journey planning, fare information, and interactive route visualization.

## Features

- Plan journeys between any two Gautrain stations
- View detailed schedules with departure and arrival times
- Get accurate fare information for different ticket types
- Interactive map with station markers and route visualization
- South African-inspired design with Springbok color scheme
- Responsive interface that works on all devices

## How to Use

1. Start the application: `npm start`
2. Open your browser and navigate to `http://localhost:3000`
3. Select your departure and arrival stations
4. Choose when you want to travel (now, morning, afternoon, or evening)
5. Click "Find Trains" to see available journeys
6. Explore the different tabs for schedules, fares, and route information

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Map Visualization**: Leaflet.js
- **Backend Proxy**: Node.js with Express
- **API Integration**: Gautrain Transport API
- **Design**: Custom responsive design with Springbok color scheme

## API Integration

This application integrates with the Gautrain API through a custom proxy server:

- Service status: `https://api.gautrain.co.za/user-service/api/0/mobile/isLive/1.0.0`
- Journey planning: `https://api.gautrain.co.za/transport-api/api/0/journey/create`
- Station information: Stored locally for optimal performance

## Fare Information

The application includes up-to-date fare information for all Gautrain routes:

- Single trip fares (peak and off-peak)
- Return trip fares
- Weekly passes (10 trips valid for 10 days)
- Monthly passes (44 trips valid for 44 days)

Fare data is updated regularly to reflect the latest Gautrain pricing.

## Development

This application was developed by [Skyner Development](https://www.skyner.co.za), a South African software development company specializing in web applications and transport solutions.

### Project Structure

- `index.html` - Main application interface
- `styles.css` - Core styling with responsive design
- `map-styles.css` - Map-specific styling
- `script.js` - Main application logic
- `stations.js` - Station data and helper functions
- `routes.js` - Train route information
- `fares.js` - Fare calculation logic
- `proxy.js` - Node.js proxy server for API requests

## License

© 2024 Skyner Development. All rights reserved.
www.skyner.co.za
