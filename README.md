# sat-vis

Satellite Orbit Visualization in 3D
-----------------------------------

sat-vis is a static web application that renders a 3D visualization of satellite orbits using [Cesium](https://cesium.com/). It fetches real-time Two-Line Element (TLE) data from [Celestrak](https://celestrak.org/) to display satellite trajectories interactively—all entirely in the browser without the need for a backend server.



![sat-vis](https://github.com/user-attachments/assets/d3035ed0-a0cc-4e39-87a7-8bd5fc63d97e) 


## Overview

This project demonstrates an engaging way to visualize satellite orbits in three dimensions using modern web technologies. By integrating live TLE data with Cesium’s 3D capabilities, sat-vis offers both space enthusiasts and developers a straightforward example of interactive satellite visualization—all in a static site.

## Features

- **Interactive 3D Visualization:** Uses Cesium to render satellite orbits in a dynamic 3D environment.
- **Real-Time Data:** Retrieves up-to-date TLE data from Celestrak for live satellite tracking.
- **Pure Front-End Implementation:** Built entirely with HTML, CSS, and JavaScript—no server-side code required.
- **Easy Deployment:** Simply open the HTML file in your browser, or serve it with any static file server.

## Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge, etc.)

## Installation

Clone the repository to your local machine:
```bash
git clone https://github.com/boostedspaceprogram/sat-vis.git
cd sat-vis
```

Dependencies
------------
The project relies on the following libraries:

- Cesium: A 3D globe and map engine for rendering satellite orbits.
- satellite.js: A library for satellite orbit calculations.

Contributing
------------
Contributions are welcome! If you have suggestions for improvements or bug fixes, please fork the repository and submit a pull request.

License
-------
This project is licensed under the [MIT License](LICENSE).