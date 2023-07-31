const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
// You can change this port if needed

// CORS Middleware - Allow requests from your website
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://location-tracker-a6a36.web.app/"
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Route to handle the proxy request to Google Maps API
app.get('/google-maps-api-route', async (req, res) => {
  const { origin, destination, waypoints } = req.query;
  try {
      // Make a request to Google Maps API with the provided parameters
      const key = "AIzaSyDdbRLJoF5ewKpqksOCwqU8IWz2tgq_RVU";
    const apiUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    // const origin = '7.2194611895284035,80.59764336794615';
    // const destination = "7.256442814359051,80.59264708310366";
    const mode = "driving";
    const avoidHighways = false;
    const avoidFerries = true;
    const avoidTolls = false;

    // const waypoints =
    //   "optimize:true|7.245156536096372,80.59493735432625|7.232304721695906,80.59506643563509";
    const response = await axios.get(apiUrl, {
      params: {
      origin,
      destination,
      waypoints,
      mode,
      avoidHighways,
      avoidFerries,
      avoidTolls,
      key, // Your Google Maps API key
      },
    });
    console.log(response.data);
    console.log(response.data.routes[0].overview_polyline.points);
    // Send the API response back to the client
    res.status(200).json({"wayPoint":response.data.routes[0].overview_polyline.points});

  } catch (error) {
    // Handle errors
    console.error('Error calling Google Maps API:', error);
    res.status(500).json({ error: 'An error occurred while fetching route data from Google Maps API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
