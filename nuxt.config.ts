import { defineNuxtConfig } from "nuxt/config";
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: ["nuxt3-leaflet", "nuxt-swiper"],
  ssr: false,
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.REACT_APP_FIREBASE_APP_ID,
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins!.push(vuetify());
    },
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    define: {
      "process.env.DEBUG": false,
    },
  },
  css: [
    "@/assets/main.scss",
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.css",
    "@/assets/styles/CETEIcean.css",
    "vue3-treeselect/dist/vue3-treeselect.css",
  ],
});
