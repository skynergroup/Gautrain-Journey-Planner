/**
 * Gautrain Journey Planner - API Proxy Server
 *
 * A Node.js proxy server that handles API requests to the Gautrain API,
 * avoiding CORS issues and providing fallback responses when needed.
 *
 * @author Skyner Development (www.skyner.co.za)
 * @version 1.0.0
 * @license Copyright (c) 2024 Skyner Development. All rights reserved.
 */

// Simple proxy server to handle API requests
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static('./'));

// API status endpoint
app.get('/api/status', async (req, res) => {
    try {
        const response = await axios.get('https://api.gautrain.co.za/user-service/api/0/mobile/isLive/1.0.0');
        res.json(response.data);
    } catch (error) {
        console.error('Error checking API status:', error);
        // Return true even if the API fails (for demo purposes)
        res.json(true);
    }
});

// Journey creation endpoint
app.post('/api/journey', async (req, res) => {
    try {
        console.log('Journey request received:', JSON.stringify(req.body, null, 2));

        const response = await axios.post(
            'https://api.gautrain.co.za/transport-api/api/0/journey/create',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Journey response received');
        res.json(response.data);
    } catch (error) {
        console.error('Error creating journey:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }

        // Return a simulated response for demo purposes
        console.log('Returning simulated journey data');

        // Extract coordinates from the request
        const coordinates = req.body.geometry.coordinates;

        // Create a simulated response
        const simulatedResponse = {
            itineraries: [
                {
                    departureTime: new Date().toISOString(),
                    arrivalTime: new Date(Date.now() + 30 * 60000).toISOString(),
                    duration: 1800, // 30 minutes in seconds
                    legs: [
                        {
                            distance: {
                                value: 30000 // 30 km in meters
                            }
                        }
                    ]
                },
                {
                    departureTime: new Date(Date.now() + 15 * 60000).toISOString(),
                    arrivalTime: new Date(Date.now() + 45 * 60000).toISOString(),
                    duration: 1800, // 30 minutes in seconds
                    legs: [
                        {
                            distance: {
                                value: 30000 // 30 km in meters
                            }
                        }
                    ]
                },
                {
                    departureTime: new Date(Date.now() + 30 * 60000).toISOString(),
                    arrivalTime: new Date(Date.now() + 60 * 60000).toISOString(),
                    duration: 1800, // 30 minutes in seconds
                    legs: [
                        {
                            distance: {
                                value: 30000 // 30 km in meters
                            }
                        }
                    ]
                }
            ]
        };

        res.json(simulatedResponse);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
