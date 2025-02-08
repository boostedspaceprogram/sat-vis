export function initViewer(containerId = "cesiumContainer") {
  const viewer = new Cesium.Viewer(containerId, {
    requestRenderMode: true,
    animation: true,
    timeline: true,
    fullscreenButton: true,
    homeButton: false,
    infoBox: false,
    sceneModePicker: true,
    navigationHelpButton: true,
  });

  // Show FPS
  viewer.scene.debugShowFramesPerSecond = true;

  // Set Bing Maps Aerial with Labels.
  const baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
  baseLayerPickerViewModel.selectedImagery =
    baseLayerPickerViewModel.imageryProviderViewModels[1];

  // Set up the simulation clock.
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

  return viewer;
}
