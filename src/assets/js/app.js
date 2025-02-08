import { initViewer } from "./viewer.js";
import { loadSatellitesLazy } from "./lazyLoader.js";
import { createOrbitControls } from "./orbitControls.js";
import { createInfoPopup, updateInfoPopup } from "./infoPopup.js";
import { addSpeedControls } from "./controls.js";
import { showOrbitPath, focusSatellite } from "./satelliteActions.js";
import { createSatelliteFilter, getEndpointForSatelliteType } from "./satelliteFilter.js";

// Expose functions for inline event handlers (used in the info popup buttons)
window.showOrbitPath = (entityId, visible) => {
  showOrbitPath(window.viewer, entityId, visible);
};

window.focusSatellite = (entityId) => {
  focusSatellite(window.viewer, entityId);
};

async function initialize() {
  // Initialize the Cesium viewer and store it globally.
  window.viewer = initViewer("cesiumContainer");

  // Create and attach UI elements.
  const infoPopup = createInfoPopup();
  document.body.appendChild(infoPopup);

  const orbitControls = createOrbitControls();
  document.body.appendChild(orbitControls);

  // Create and attach the Satellite Filter panel.
  const satelliteFilterContainer = createSatelliteFilter();
  document.body.appendChild(satelliteFilterContainer);

  // Set up entity selection to update the info popup.
  let infoUpdateInterval = null;
  viewer.selectedEntityChanged.addEventListener((entity) => {
    if (infoUpdateInterval) {
      clearInterval(infoUpdateInterval);
      infoUpdateInterval = null;
    }
    if (entity) {
      updateInfoPopup(entity, viewer, infoPopup);
      infoUpdateInterval = setInterval(() => {
        updateInfoPopup(entity, viewer, infoPopup);
      }, 500);
    } else {
      infoPopup.style.display = "none";
    }
  });

  // Toggle all orbits when the button is clicked.
  const toggleAllOrbitsBtn = orbitControls.querySelector("#toggleAllOrbits");
  let allOrbitsVisible = false;
  toggleAllOrbitsBtn.onclick = () => {
    allOrbitsVisible = !allOrbitsVisible;
    viewer.entities.values.forEach((entity) => {
      if (entity.properties && entity.properties.orbitVisible) {
        entity.properties.orbitVisible.setValue(allOrbitsVisible);
      }
    });
  };

  // Add speed controls.
  addSpeedControls(viewer);

  // When the user clicks "Load Satellites", fetch TLE data from the proper endpoint.
  const loadSatellitesBtn = document.getElementById("loadSatellitesBtn");
  loadSatellitesBtn.onclick = async () => {
    const selectedType = document.getElementById("satelliteType").value;
    const endpoint = getEndpointForSatelliteType(selectedType);
    try {
      const response = await fetch(endpoint);
      const tleData = await response.text();
      const tleLines = tleData.split("\n").filter((line) => line.trim() !== "");
      // Clear any existing satellite entities before loading new ones.
      viewer.entities.removeAll();
      loadSatellitesLazy(tleLines, viewer, 10);
    } catch (error) {
      console.error("Error fetching TLE data:", error);
    }
  };
}

initialize();
