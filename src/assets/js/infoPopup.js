import { getSatellitePosition } from "./utils.js";

export function createInfoPopup() {
  const popup = document.createElement("div");
  popup.style.display = "none";
  popup.style.position = "absolute";
  popup.style.top = "100px";
  popup.style.right = "10px";
  popup.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  popup.style.padding = "15px";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  popup.style.zIndex = "1000";
  popup.style.maxWidth = "300px";
  popup.style.maxHeight = "80vh";
  popup.style.overflow = "auto";
  popup.style.fontFamily = "Roboto, sans-serif";
  popup.style.fontSize = "14px";
  return popup;
}

export function updateInfoPopup(entity, viewer, popup) {
  if (!entity || !entity.properties) return;

  const satrec = entity.properties.satrec.getValue();
  const currentPosition = getSatellitePosition(
    satrec,
    viewer.clock.currentTime
  );

  const posVel = satellite.propagate(
    satrec,
    Cesium.JulianDate.toDate(viewer.clock.currentTime)
  );
  const velocity = Math.sqrt(
    posVel.velocity.x ** 2 +
      posVel.velocity.y ** 2 +
      posVel.velocity.z ** 2
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
          Altitude: ${currentPosition.height.toFixed(2)} km</p>
        <p><strong>Current Velocity:</strong> ${velocity.toFixed(2)} km/s</p>
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
        <button onclick="showOrbitPath('${entity.id}', ${entity.properties.orbitVisible.getValue()})">
          ${entity.properties.orbitVisible.getValue() ? 'Hide' : 'Show'} Orbit Path
        </button>
        <button onclick="focusSatellite('${entity.id}')">Focus</button>
    </div>
  `;
  popup.innerHTML = html;
  popup.style.display = "block";
}
