export function showOrbitPath(viewer, entityId, visible) {
    const entity = viewer.entities.getById(entityId);
    if (entity && entity.properties && entity.properties.orbitVisible) {
      entity.properties.orbitVisible.setValue(!visible);
    }
  }
  
  export function focusSatellite(viewer, entityId) {
    const entity = viewer.entities.getById(entityId);
    if (entity) {
      viewer.flyTo(entity, {
        duration: 2,
        offset: new Cesium.HeadingPitchRange(
          0,
          Cesium.Math.toRadians(-90),
          10000000
        ),
      });
    }
  }
  