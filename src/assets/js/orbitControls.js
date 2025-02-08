export function createOrbitControls() {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "10px";
  container.style.left = "10px";
  container.style.zIndex = "1000";
  container.style.background = "rgba(255, 255, 255, 0.9)";
  container.style.padding = "10px";
  container.style.borderRadius = "5px";

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
