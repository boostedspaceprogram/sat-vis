export function getSatellitePosition(satrec, time) {
    const date = Cesium.JulianDate.toDate(time);
    const positionVelocity = satellite.propagate(satrec, date);
    const gmst = satellite.gstime(date);

    if (!positionVelocity.position) return { longitude: 0, latitude: 0, height: 0 };

    const positionGd = satellite.eciToGeodetic(positionVelocity.position, gmst);
    return {
        longitude: Cesium.Math.toDegrees(positionGd.longitude),
        latitude: Cesium.Math.toDegrees(positionGd.latitude),
        height: positionGd.height,
    };
}
