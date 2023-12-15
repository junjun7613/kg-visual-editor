import OpenSeadragon from 'openseadragon'
//import Annotorious from "@recogito/annotorious-openseadragon";
//import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      OpenSeadragon,
      //Annotorious
    },
  };
});