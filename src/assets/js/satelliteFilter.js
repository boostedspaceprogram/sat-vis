// Mapping from satellite type to endpoint URL.
const satelliteEndpoints = {
  active: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle",
  decayed: "https://celestrak.org/NORAD/elements/gp.php?GROUP=decayed&FORMAT=tle",
  starlink: "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
  gnss: "https://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle",
  gps: "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle",
  galileo: "https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle",
  beidou: "https://celestrak.org/NORAD/elements/gp.php?GROUP=beidou&FORMAT=tle",
  iridium: "https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium&FORMAT=tle",
  geo: "https://celestrak.org/NORAD/elements/gp.php?GROUP=geo&FORMAT=tle",
  weather: "https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle",
  stations: "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
  nnss: "https://celestrak.org/NORAD/elements/gp.php?GROUP=nnss&FORMAT=tle",
  cubesats: "https://celestrak.org/NORAD/elements/gp.php?GROUP=cubesat&FORMAT=tle",
};

export function createSatelliteFilter() {
  const container = document.createElement("div");
  container.id = "satellite-filter";
  container.innerHTML = `
    <label for="satelliteType">Select Satellite Type:</label>
    <select id="satelliteType">
      <option value="#" disabled>-----[ALL]-----</option>
      <option value="active" selected>All Global Active Satellites</option>
      <option value="decayed">All Decayed Satellites</option>
      <option value="starlink">All Active Starlink Satellites</option>
      <option value="geo">All Geostationary Satellites</option>
      <option value="#" disabled>-----[Navigation]-----</option>
      <option value="gnss">[WORLD] GNSS Navigation Satellites</option>
      <option value="gps">[US] GPS Navigation Satellites</option>
      <option value="galileo">[EU] Galileo Navigation Satellites</option>
      <option value="beidou">[CN] BeiDou Navigation Satellites</option>
      <option value="iridium">[US] Iridium Communication Satellites</option>
      <option value="nnss">[US] Navy Navigation Satellite System (NNSS)</option>
      <option value="#" disabled>-----[Scientific]-----</option>
      <option value="weather">Weather & Earth Resources Satellites</option>
      <option value="stations">Space Stations</option>
      <option value="cubesats">CubeSats</option>
    </select>
    <button id="loadSatellitesBtn">Load</button>
  `;
  return container;
}

export function getEndpointForSatelliteType(type) {
  return satelliteEndpoints[type] || satelliteEndpoints["active"];
}
