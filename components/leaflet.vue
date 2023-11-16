<template>
  <v-app>
    <v-container>
      <div style="height: 70vh; width: 90vw">
        <LMap ref="map" :zoom="zoom" :center="[47.21322, -1.559482]">
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            layer-type="base"
            name="OpenStreetMap"
          />
          <l-marker :lat-lng="[47.21322, -1.559482]"></l-marker>
        </LMap>
      </div>
    </v-container>
  </v-app>
</template>
<script setup>
import { ref } from "vue";
const zoom = ref(6);
</script>
<style>
body {
  margin: 0;
}
</style>
