sat-vis
=======

Satellite Orbit Visualization in 3D
--------

![sat-vis](https://github.com/user-attachments/assets/d3035ed0-a0cc-4e39-87a7-8bd5fc63d97e) 

sat-vis is a Node.js application that renders a 3D visualization of satellite orbits using Cesium. The app fetches real-time Two-Line Element (TLE) data from [Celestrak](https://celestrak.org/) to display satellite trajectories interactively in a browser.

Overview
--------

This project provides an engaging way to visualize satellite orbits in three dimensions. It serves as both a demonstration of 3D visualization techniques using Cesium and a lightweight Node.js backend that retrieves live TLE data. Whether you're a space enthusiast or a developer interested in satellite data visualization, sat-vis offers a great starting point.

Features
--------

-   **Interactive 3D Visualization:** Uses Cesium to render satellite orbits in a 3D environment.
-   **Real-Time Data:** Fetches current TLE data for satellites from Celestrak.
-   **Express Server:** Serves static files and provides an API endpoint for TLE data.
-   **CORS Support:** Ensures that the API endpoint can be accessed from various origins.

Prerequisites
-------------

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/)

Installation
------------

1.  **Clone the repository:**
    `git clone https://github.com/boostedspaceprogram/sat-vis.git`
    `cd sat-vis`

2.  **Install dependencies:**
    `npm install`

Running the Application
-----------------------

Start the server by running:
`node server.js`

By default, the server listens on port 3000. Open your browser and go to http://localhost:3000 to view the visualization.

API Endpoint
------------

The backend includes a simple API to fetch TLE data:

-   **GET `/api/tle`**\
    Fetches TLE data from Celestrak (currently hardcoded for ISS).

Dependencies
------------
The project relies on several key Node.js packages:
-   **[express](https://www.npmjs.com/package/express):** Web framework for serving content and API endpoints.
-   **[cors](https://www.npmjs.com/package/cors):** Enables Cross-Origin Resource Sharing.
-   **[node-fetch-cache](https://www.npmjs.com/package/node-fetch-cache):** Fetches remote TLE data with caching.
-   **[cesium](https://www.npmjs.com/package/cesium):** 3D globe and map engine for rendering satellite orbits.
-   **[satellite.js](https://www.npmjs.com/package/satellite.js):** Library for satellite orbit calculations.
-   **[axios](https://www.npmjs.com/package/axios):** (Optional) For making HTTP requests if needed elsewhere in the project.

Contributing
------------
Contributions are welcome! If you have ideas for improvements or bug fixes, please fork the repository and submit a pull request.

License
-------
This project is licensed under the [MIT License](LICENSE).