<template>
  <v-container>
    <vc-config-provider :cesium-path="vcConfig.cesiumPath">
      <vc-viewer @click="handleClick" ref="viewer">
        <vc-layer-imagery>
          <vc-imagery-provider-arcgis></vc-imagery-provider-arcgis>
        </vc-layer-imagery>
        <!-- 複数地点の表示 -->
        <vc-entity 
          v-for="point in points"
          :key="point.id"
          :position="point.position"
          :description="point.description"
          :id="point.id">
          <vc-graphics-point :color="point.color" :pixel-size="8"></vc-graphics-point>
        </vc-entity>
        <!-- オーバーレイ -->
        <vc-overlay-html :position="overlayPosition" v-if="showOverlay">
          <div class="entity-info">
            <div v-for="(key,value) in entityInfo" :key="key">
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

// 地点データの配列
const points = ref([])

points.value = [
  { id: "point1", position: [-75.59777, 40.03883], name: "名前1", description: "地点1の説明", additionalInfo: "追加情報1", color: 'red' },
  { id: "point2", position: [-80.00000, 35.00000], name: "名前2", description: "地点2の説明", additionalInfo: "追加情報2", color: 'blue' }
  // 他の地点をここに追加
];

const overlayPosition = ref(null);
const showOverlay = ref(true);
const entityInfo = ref({});

const handleClick = (event) => {
  const viewer = event.cesium.viewer;
  const pickedObject = viewer.scene.pick(event.cesium.movement.endPosition);
  if (Cesium.defined(pickedObject)) {
    const entity = pickedObject.id;
    const point = points.value.find(p => p.id === entity.id);
    if (point) {
      entityInfo.value = point;
      console.log(entityInfo.value)
      overlayPosition.value = Cesium.Cartesian3.fromDegrees(...point.position);
      showOverlay.value = true;
    }
  } 
};
</script>

<style scoped>
.entity-info {
  background-color: grey;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid black;
}
</style>
