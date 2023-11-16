<template>
  <v-container>
    <vc-config-provider :cesium-path="vcConfig.cesiumPath">
      <vc-viewer></vc-viewer>
    </vc-config-provider>
  </v-container>
</template>
<script setup>
import { reactive } from "vue";
import { VcConfigProvider, VcViewer } from "vue-cesium";

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
