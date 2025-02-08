import { createProgressBar } from "./progressBar.js";
import { getSatellitePosition } from "./utils.js";

export function loadSatellitesLazy(tleLines, viewer, satellitesPerBatch = 10) {
  let index = 0;
  const totalSatellites = Math.floor(tleLines.length / 3);
  const totalLines = totalSatellites * 3;
  const progressBar = createProgressBar();
  document.body.appendChild(progressBar.container);

  function processBatch() {
    const batchEnd = Math.min(index + satellitesPerBatch * 3, totalLines);
    for (let i = index; i < batchEnd; i += 3) {
      const name = tleLines[i].trim();
      const tleLine1 = tleLines[i + 1];
      const tleLine2 = tleLines[i + 2];
      if (!tleLine1 || !tleLine2) continue;

      // Create satellite record.
      const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

      // Add satellite entity.
      const entity = viewer.entities.add({
        name: name,
        position: new Cesium.CallbackProperty((time) => {
          const pos = getSatellitePosition(satrec, time);
          return Cesium.Cartesian3.fromDegrees(
            pos.longitude,
            pos.latitude,
            pos.height * 1000
          );
        }, false),
        point: {
          pixelSize: 5,
          color: Cesium.Color.WHITE,
        },
        properties: {
          satelliteId: new Cesium.ConstantProperty(tleLine1.substring(2, 7)),
          tleLine1: new Cesium.ConstantProperty(tleLine1),
          tleLine2: new Cesium.ConstantProperty(tleLine2),
          satrec: new Cesium.ConstantProperty(satrec),
          orbitVisible: new Cesium.ConstantProperty(false),
        },
      });

      // Create an orbit path entity (visible only when enabled).
      viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty((time) => {
            if (!entity.properties.orbitVisible.getValue()) {
              return [];
            }
            const positions = [];
            const minutes = Number(
              document.querySelector("#orbitMinutes").value
            );
            const segments = Number(
              document.querySelector("#orbitSegments").value
            );
            const timeStep = (minutes * 60 * 2) / segments;
            for (let j = -minutes * 60; j <= minutes * 60; j += timeStep) {
              const orbitTime = new Cesium.JulianDate();
              Cesium.JulianDate.addSeconds(time, j, orbitTime);
              const pos = getSatellitePosition(satrec, orbitTime);
              positions.push(
                Cesium.Cartesian3.fromDegrees(
                  pos.longitude,
                  pos.latitude,
                  pos.height * 1000
                )
              );
            }
            return positions;
          }, false),
          width: 1,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLUE.withAlpha(0.7),
          }),
        },
      });
    }

    index += satellitesPerBatch * 3;
    let progressPercent = Math.min((index / totalLines) * 100, 100);
    progressBar.fill.style.width = progressPercent + "%";

    if (index < totalLines) {
      setTimeout(processBatch, 0);
    } else {
      // Remove the progress bar after a brief delay.
      setTimeout(() => {
        progressBar.container.remove();
      }, 500);
    }
  }

  processBatch();
}
