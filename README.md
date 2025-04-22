# Gautrain Schedule Checker

A simple web application that uses the Gautrain API to check train schedules between stations.

## Features

- Check train schedules between any two Gautrain stations
- View departure and arrival times
- See journey duration
- Simple and intuitive interface

## How to Use

1. Open `index.html` in a web browser
2. Select your departure station from the dropdown
3. Select your arrival station from the dropdown
4. Click "Check Schedule" to see the next available trains

## API Information

This application uses the Gautrain API to fetch schedule information:

- Service check: `https://api.gautrain.co.za/user-service/api/0/mobile/isLive/1.0.0`
- Journey creation: `https://api.gautrain.co.za/transport-api/api/0/journey/create`

The API is based on the WhereIsMyTransport platform.

## Notes

- This is a simple demonstration of the API and may not include all features
- The application does not require any API keys as it uses publicly accessible endpoints
- Station coordinates are hardcoded in `stations.js`

## Limitations

- The application relies on the Gautrain API being available
- CORS issues may prevent the application from working when run locally
- The API may change without notice

## Future Improvements

- Add more detailed journey information
- Include bus connections
- Show fare information
- Add a map view of the journey
