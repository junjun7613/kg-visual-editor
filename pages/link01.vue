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
import { VcConfigProvider, VcViewer, VcEntity, VcGraphicsPoint, VcLayerImagery,
  VcImageryProviderArcgis, } from "vue-cesium";

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
