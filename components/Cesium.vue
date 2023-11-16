<template>
  <div>This is link2</div>
  <div id="cesiumContainer" />
  {{viewer}}
</template>

<script>
import * as Cesium from "cesium";
import { createWorldTerrain, Viewer } from "cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZmY5YjhlMC03NDNmLTRhOTgtOWRkNC0zZjljNDYzZTliYzciLCJpZCI6MTAyMTUzLCJpYXQiOjE2NTg0ODE1NzJ9.5tFHpMLeMlZ7BisFgNgdzRaDY1JfObEEin16hOQHftA";

this.viewer = new Viewer("cesiumContainer", {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  scene3DOnly: true,
  timeline: false,
  terrainProvider: createWorldTerrain(),
});
</script>