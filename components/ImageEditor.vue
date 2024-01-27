<script lang="ts" setup>
import ExternalWidget from "~/utils/widgets/external";
import TypeSelectWidget from "~/utils/widgets/typeSelect";
import LabelWidget from "~/utils/widgets/label";
// import ColorSelectorWidget from "~/utils/widgets/color";

interface Entity {
  "@context": string;
  "@id": string;
  "@type": string;
  "http://www.w3.org/2000/01/rdf-schema#label"?: string;
  "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"?: string;
  "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"?: string[];
}

const { $OpenSeadragon, $Annotorious } = useNuxtApp();
const route = useRoute();
//const manifest: string = route.query.manifest
  //? String(route.query.manifest)
  //: "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";

const canvasImageMap: { [key: string]: string } = {};

const currentIndex = ref(0);
const text = ref("");
const uri = ref("");
const height = ref(0);
const result = ref<Entity>({} as Entity);

const inputManifestUrl = ref(""); // ユーザーが入力するManifestのURL
const manifest = ref(""); // 実際に使用するManifestのURL
/*
const manifest: string = route.query.manifest
  ? String(route.query.manifest)
  : "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";
*/

let viewer: any = null;

onMounted(async () => {
    height.value = window.innerHeight - 250;
    await loadManifest();
})

// async
//onMounted(async () => {
  //height.value = window.innerHeight - 64;
const loadManifest = async () => {
  manifest.value = inputManifestUrl.value; // ユーザーが入力したURLを使用する
  //manifest.value = 'https://edh.ub.uni-heidelberg.de/iiif/edh/F000001.manifest.json';

  const res = await fetch(manifest.value);
  //const res = await fetch(manifest);
  const json = await res.json();
  console.log(json); // データ構造をログ出力して確認

  const canvases = json.sequences?.[0]?.canvases ?? [];

  const tileSources = canvases.map((canvas: any) => {
    const infoUrl = canvas.images[0].resource["@id"].replace(
      "/full/full/0/default.jpg",
      "/info.json"
    );
    canvasImageMap[infoUrl] = canvas["@id"];
    return infoUrl;
  });

  if (viewer) {
    viewer.open(tileSources);
  }else{
  const config: any = {
    sequenceMode: true,
    id: "osd",
    tileSources,
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
  };

  //const viewer = $OpenSeadragon(config);
  viewer = $OpenSeadragon(config);

}

  viewer.addHandler("page", function (event) {
    currentIndex.value = event.page;
  });

  const config_ = {
    widgets: [
      TypeSelectWidget,
      ExternalWidget,
      LabelWidget,
      "COMMENT",
      {
        widget: "TAG",
        /*
        vocabulary: [
          { label: "Place", uri: "http://www.example.com/ontology/place" },
          { label: "Person", uri: "http://www.example.com/ontology/person" },
          { label: "Event", uri: "http://www.example.com/ontology/event" },
        ],
        */
      },
    ],
  };
  const anno = $Annotorious(viewer, config_);

  anno.on("createAnnotation", function (annotation: any, overrideId: string) {
    createContentStateAPI(annotation, overrideId);
  });

  anno.on("updateAnnotation", function (annotation: any, overrideId: string) {
    createContentStateAPI(annotation, overrideId);
  });
};

const createContentStateAPI = (annotation: any, overrideId: string) => {

  const xywh = annotation.target.selector.value.split("xywh=pixel:")[1];
  const intXywh = xywh
    .split(",")
    .map((num: string) => Math.round(parseFloat(num)));
  const index = currentIndex.value;
  const canvasId = Object.values(canvasImageMap)[index];

  const api = {
    id: `${canvasId}#xywh=${intXywh}`,
    type: "Canvas",
    partOf: [
      {
        id: manifest,
        type: "Manifest",
      },
    ],
  };

  const apiString = JSON.stringify(api);
  const encodedString = btoa(apiString);

  const path = `/viewer/?iiif-content=${encodedString}`;

  text.value = `${path}`;

  const uri_ = `https://icsae.vercel.app${path}`;
  uri.value = uri_;

  const result_: Entity = {
    "@context": "https://junjun7613.github.io/MicroKnowledge/himiko-context.jsonld",
    "@id": uri_,
    "@type": "",
  }

  const body = annotation.body;

  const tags = []

  for (const value of body) {
    if (value.field === "external") {
      result_["https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"] = value.value
    }
    else if (value.field === "label") {
      result_["http://www.w3.org/2000/01/rdf-schema#label"] = value.value
    }
    else if (value.field === "type") {
      result_["@type"] = value.value
    }
    else if (value.purpose === "tagging") {
      tags.push(value.value)
    }
  }

  if(tags.length > 0) {
    result_["https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"] = tags
  }

  result.value = result_
};
</script>
<template>
  <client-only>
  <v-row class="mt-4" dense>
    <!-- Manifest URL 入力フィールドと表示ボタンの追加 -->
    <v-row>
    <v-col cols="8">
        <v-text-field
          label="Manifest URL"
          v-model="inputManifestUrl"
          @keyup.enter="loadManifest"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-btn height="55px" @click="loadManifest">表示</v-btn>
    </v-col>
    </v-row>
    <v-col sm="12">
      <div
        id="osd"
        style="width: 100%; background-color: black"
        :style="`height: ${height * 0.99}px`"
      ></div>
    </v-col>
    <!--
    <v-col sm="12">
      <div class="api-info">
          <h2>API Information</h2>
          <pre>{{ result }}</pre>
        </div>
    </v-col>
-->
  </v-row>
</client-only>
</template>
<style>
.title {
  color: red;
}
</style>