<!--
<template>
  <v-container>
    <vc-config-provider :cesium-path="vcConfig.cesiumPath">
      <vc-viewer>
        <vc-layer-imagery>
          <vc-imagery-provider-arcgis> </vc-imagery-provider-arcgis>
        </vc-layer-imagery>
        <vc-entity :position="[-75.59777, 40.03883]" description="Hello VueCesium">
          <vc-graphics-point ref="point1" color="red" :pixel-size="8"></vc-graphics-point>
        </vc-entity>
      </vc-viewer>
    </vc-config-provider>
  </v-container>
</template>
<script setup>
import { reactive } from "vue";
import {
  VcConfigProvider, VcViewer, VcEntity, VcGraphicsPoint, VcLayerImagery,
  VcImageryProviderArcgis,
} from "vue-cesium";

const vcConfig = reactive({
  cesiumPath: "https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js",
});
</script>
<style scoped>
.main {
  margin-top: 10px;
  width: 90vw;
}
</style>
-->
<template>
  <v-container>
    <vc-config-provider :cesium-path="vcConfig.cesiumPath">
      <vc-viewer @click="handleClick" ref="viewer">
        <vc-layer-imagery>
          <vc-imagery-provider-arcgis></vc-imagery-provider-arcgis>
        </vc-layer-imagery>
        <vc-entity :position="[-75.59777, 40.03883]" description="Hello VueCesium" id="myEntity">
          <vc-graphics-point ref="point1" color="red" :pixel-size="8"></vc-graphics-point>
        </vc-entity>
        <vc-overlay-html :position="overlayPosition" v-if="showOverlay">
          <div class="entity-info">
            <div v-for="(value, key) in entityInfo" :key="key">
              {{ key }}: {{ value }}
            </div>
          </div>
        </vc-overlay-html>
      </vc-viewer>
    </vc-config-provider>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  VcConfigProvider, VcViewer, VcEntity, VcGraphicsPoint, VcLayerImagery,
  VcImageryProviderArcgis, VcOverlayHtml
} from "vue-cesium";

const vcConfig = reactive({
  cesiumPath: "https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js",
});

const overlayPosition = ref(null);
const showOverlay = ref(false);
const entityInfo = ref({});

const handleClick = (event) => {
  const viewer = event.cesium.viewer;
  const pickedObject = viewer.scene.pick(event.cesium.movement.endPosition);
  if (Cesium.defined(pickedObject)) {
    const entity = pickedObject.id;
    if (entity && entity.id === 'myEntity') {
    entityInfo.value = {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      // 他の属性
    };
    console.log(entityInfo.value)
    overlayPosition.value = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
    showOverlay.value = true;
  }
  }
};
</script>

<style scoped>
.entity-info {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid black;
}
</style>
