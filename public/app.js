let viewer;

async function initialize() {
  // Initialize the Cesium Viewer with animation and timeline
  viewer = new Cesium.Viewer('cesiumContainer', {
    requestRenderMode : true,
    animation: true,
    timeline: true,
    fullscreenButton: true,
    homeButton: true,
    infoBox: false,
    sceneModePicker: true,
    navigationHelpButton: true,
  });

  // FPS Debug
  viewer.scene.debugShowFramesPerSecond = true;

  // Bing Maps Arial with Labels
  var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
  baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[1];

  // Create a custom popup div for detailed information
  const infoPopup = createInfoPopup();
  document.body.appendChild(infoPopup);

  // Add orbit path controls
  const orbitControls = createOrbitControls();
  document.body.appendChild(orbitControls);

  // Set up clock settings
  const start = Cesium.JulianDate.fromDate(new Date());
  const stop = Cesium.JulianDate.addHours(start, 24, new Cesium.JulianDate());

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  viewer.clock.multiplier = 1;
  viewer.clock.shouldAnimate = true;

  viewer.timeline.zoomTo(start, stop);

  viewer.scene.globe.enableLighting = true;

  // Store currently selected entity for updates
  let selectedEntity = null;
  let infoUpdateInterval = null;

  // Query params
  const urlParams = new URLSearchParams(window.location.search);
  const urlToLoad = urlParams.get('url');

  let tleResponse, tleData;
  if (urlToLoad) {
    tleResponse = await fetch(urlToLoad);
    tleData = await tleResponse.text();
  } else {
    tleResponse = await fetch('/api/tle');
    tleData = await tleResponse.text();
  }

  // Parse TLE data
  const tleLines = tleData.split('\n').filter(line => line.trim() !== '');

  for (let i = 0; i < tleLines.length; i += 3) {
    const name = tleLines[i].trim();
    const tleLine1 = tleLines[i + 1];
    const tleLine2 = tleLines[i + 2];

    if (!tleLine1 || !tleLine2) continue;

    // Create satellite record
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    // Create entity for satellite
    const entity = viewer.entities.add({
      name: name,
      position: new Cesium.CallbackProperty(time => {
        const position = getSatellitePosition(satrec, time);
        return Cesium.Cartesian3.fromDegrees(
          position.longitude,
          position.latitude,
          position.height * 1000
        );
      }, false),
      point: {
        pixelSize: 5,
        color: Cesium.Color.WHITE
      },
      properties: {
        satelliteId: tleLine1.substring(2, 7),
        tleLine1: tleLine1,
        tleLine2: tleLine2,
        satrec: satrec,
        orbitVisible: false
      }
    });

    // Generate orbit path
    if (!entity.orbitPath && entity.properties.orbitVisible) {
      entity.orbitPath = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(time => {
            if (!entity.properties.orbitVisible.getValue()) {
              return [];
            }
            const positions = [];
            const minutes = Number(orbitControls.querySelector('#orbitMinutes').value);
            const segments = Number(orbitControls.querySelector('#orbitSegments').value);
            const timeStep = minutes * 120 / segments; // Convert to seconds and divide by segments
  
            for (let j = -minutes * 60; j <= minutes * 60; j += timeStep) {
              const orbitTime = new Cesium.JulianDate();
              Cesium.JulianDate.addSeconds(time, j, orbitTime);
  
              const position = getSatellitePosition(satrec, orbitTime);
              positions.push(Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.height * 1000
              ));
            }
            return positions;
          }, false),
          width: 1,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLUE.withAlpha(0.7)
          })
        }
      });
    }
  }

  // Add toggle all orbits functionality
  const toggleAllOrbitsBtn = orbitControls.querySelector('#toggleAllOrbits');
  let allOrbitsVisible = false;
  toggleAllOrbitsBtn.onclick = () => {
      allOrbitsVisible = !allOrbitsVisible;
      viewer.entities.values.forEach(entity => {
          if (entity.properties && entity.properties.hasOwnProperty('orbitVisible')) {
              entity.properties.orbitVisible = new Cesium.ConstantProperty(allOrbitsVisible);
          }
      });
  };

  // Add click handler for entities
  viewer.selectedEntityChanged.addEventListener((entity) => {
    // Clear previous update interval
    if (infoUpdateInterval) {
      clearInterval(infoUpdateInterval);
      infoUpdateInterval = null;
    }

    selectedEntity = entity;

    if (entity) {
      updateInfoPopup(entity, viewer, infoPopup);
      // Set up interval to update info
      infoUpdateInterval = setInterval(() => {
        updateInfoPopup(entity, viewer, infoPopup);
      }, 2000); // Update every second
    } else {
      infoPopup.style.display = 'none';
    }
  });

  // Add speed controls
  addSpeedControls(viewer);
}

function createOrbitControls() {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.zIndex = '1000';
  container.style.background = 'rgba(255, 255, 255, 0.9)';
  container.style.padding = '10px';
  container.style.borderRadius = '5px';

  container.innerHTML = `
      <div style="margin-bottom: 5px;">
        <label for="orbitMinutes">Orbit Path (±minutes):</label>
        <input type="number" id="orbitMinutes" value="30" min="1" max="180" style="width: 60px;">
      </div>
      <div>
        <label for="orbitSegments">Path Segments:</label>
        <input type="number" id="orbitSegments" value="10" min="10" max="360" style="width: 60px;">
      </div>
      <div style="margin-bottom: 5px;">
        <button id="toggleAllOrbits">Show/Hide All Orbits</button>
      </div>
  `;

  return container;
}

function getSatellitePosition(satrec, time) {
  const date = Cesium.JulianDate.toDate(time);
  const positionVelocity = satellite.propagate(satrec, date);
  const gmst = satellite.gstime(date);

  if (!positionVelocity.position) return { longitude: 0, latitude: 0, height: 0 };

  const positionGd = satellite.eciToGeodetic(
    positionVelocity.position,
    gmst
  );

  return {
    longitude: Cesium.Math.toDegrees(positionGd.longitude),
    latitude: Cesium.Math.toDegrees(positionGd.latitude),
    height: positionGd.height
  };
}

function createInfoPopup() {
  const popup = document.createElement('div');
  popup.style.display = 'none';
  popup.style.position = 'absolute';
  popup.style.top = '100px';
  popup.style.right = '10px';
  popup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  popup.style.padding = '15px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  popup.style.zIndex = '1000';
  popup.style.maxWidth = '300px';
  popup.style.maxHeight = '80vh';
  popup.style.overflow = 'auto';
  popup.style.fontFamily = 'Roboto, sans-serif';
  popup.style.fontSize = '14px';
  return popup;
}

function updateInfoPopup(entity, viewer, popup) {
  if (!entity || !entity.properties) return;

  const satrec = entity.properties.satrec.getValue();
  const currentPosition = getSatellitePosition(satrec, viewer.clock.currentTime);

  // Calculate velocity
  const positionVelocity = satellite.propagate(
    satrec,
    Cesium.JulianDate.toDate(viewer.clock.currentTime)
  );

  const velocity = Math.sqrt(
    positionVelocity.velocity.x * positionVelocity.velocity.x +
    positionVelocity.velocity.y * positionVelocity.velocity.y +
    positionVelocity.velocity.z * positionVelocity.velocity.z
  );

  const html = `
      <h3 style="margin: 0 0 10px 0;">${entity.name}</h3>
      <button onclick="this.parentElement.style.display='none'" 
              style="position: absolute; right: 5px; top: 5px; cursor: pointer;">✖</button>
      <div style="font-size: 14px; line-height: 1.4;">
          <p><strong>Satellite ID:</strong> ${entity.properties.satelliteId.getValue()}</p>
          <p><strong>Current Position:</strong><br>
            Latitude: ${currentPosition.latitude.toFixed(2)}°<br>
            Longitude: ${currentPosition.longitude.toFixed(2)}°<br>
            Altitude: ${(currentPosition.height).toFixed(2)} km</p>
          <p><strong>Current Velocity:</strong> ${(velocity * 1).toFixed(2)} km/s</p>
          <p><strong>Orbital Elements:</strong><br>
            Inclination: ${(satrec.inclo * 180 / Math.PI).toFixed(2)}°<br>
            Eccentricity: ${satrec.ecco.toFixed(6)}<br>
            RAAN: ${(satrec.nodeo * 180 / Math.PI).toFixed(2)}°<br>
            Arg. of Perigee: ${(satrec.argpo * 180 / Math.PI).toFixed(2)}°<br>
            Mean Motion: ${(satrec.no * 720 / Math.PI).toFixed(2)} rev/day</p>
          <p><strong>TLE Data:</strong><br>
            <span style="font-family: monospace; font-size: 12px;">
              ${entity.properties.tleLine1.getValue()}<br>
              ${entity.properties.tleLine2.getValue()}
            </span></p>
          </p>

          <button onclick="showOrbitPath('${entity.id}', ${entity.properties.orbitVisible.getValue()})">
            ${entity.properties.orbitVisible.getValue() ? 'Hide' : 'Show'} Orbit Path
          </button>

          <button onclick="focusSatellite('${entity.id}')">Focus</button>

      </div>
  `;

  popup.innerHTML = html;
  popup.style.display = 'block';
}

function showOrbitPath(entityId, visible) {
  // Enable entity orbit path visibility
  const orbitPathVisible = viewer.entities.getById(entityId).properties.orbitVisible
  orbitPathVisible.setValue(!visible);
}

function focusSatellite(entityId) {
  // Focus on satellite
  const entity = viewer.entities.getById(entityId);
  if (entity) {
    viewer.flyTo(entity, {
      duration: 2,
      offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 10000000)
    });
  }
}

function addSpeedControls(viewer) {
  const speedFactors = [0.1, 0.5, 1, 2, 5, 10, 50, 100];
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.bottom = '30px';
  container.style.right = '10px';
  container.style.zIndex = '1000';
  container.style.background = 'rgba(255, 255, 255, 0.9)';
  container.style.padding = '10px';
  container.style.borderRadius = '5px';

  // Add pause/play button
  const pausePlay = document.createElement('button');
  pausePlay.innerHTML = '⏸️';
  pausePlay.onclick = () => {
    viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate;
    pausePlay.innerHTML = viewer.clock.shouldAnimate ? '⏸️' : '▶️';
  };
  container.appendChild(pausePlay);

  // Add speed buttons
  speedFactors.forEach(factor => {
    const button = document.createElement('button');
    button.innerHTML = `${factor}x`;
    button.onclick = () => {
      viewer.clock.multiplier = factor * 1;
    };
    button.style.marginLeft = '5px';
    container.appendChild(button);
  });

  document.body.appendChild(container);
}

initialize();