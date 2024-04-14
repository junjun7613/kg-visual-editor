<script lang="ts" setup>
import type { Entity } from "~/types";
import { ref, watch } from "vue";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import {
  defaultCurationTypeSelect,
  defaultCurationData,
} from "~/utils/annotation/misc";

interface Annotation {
  body: {
    field?: string;
    value: string;
  }[];
}

const dialog = ref(false);
const dialog2 = ref(false);

const curationTypeSelect = ref(defaultCurationTypeSelect);
const origCurationData = ref(defaultCurationData);

const curationData = ref({});

const curationFields = ref([]);
const filteredCurationFields = ref([]);

const { $OpenSeadragon, $Annotorious } = useNuxtApp();
//const manifest: string = route.query.manifest
//? String(route.query.manifest)
//: "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";

const { content_state_api, annotation_result, curation_type_select, curation_data } = useEditor();

const canvasImageMap: { [key: string]: string } = {};

const currentIndex = ref(0);
const text = ref("");
const uri = ref("");
const height = ref(0);
const existsAnnotationMap = ref<{
  [key: string]: Entity;
}>({});

const inputManifestUrl = ref(""); // ユーザーが入力するManifestのURL
const manifest = ref(""); // 実際に使用するManifestのURL
/*
const manifest: string = route.query.manifest
  ? String(route.query.manifest)
  : "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";
*/

const selectedAnnotationId = ref("");
const selectedAnnotationUri = ref("");

let viewer: any = null;

watch(curation_type_select, () => {
  console.log("curation_type_selectが変更されました");
  curationTypeSelect.value = curation_type_select.value;
});

watch(curation_data, () => {
  console.log("curation_dataが変更されました");
  origCurationData.value = curation_data.value;
      curationFields.value = [];
      curationData.value = {};
      curation_data.value.forEach((item) => {
        curationData.value[item["model"]] = "";
        const field = {
          title: item["title"],
          label: item["label"],
          model: item["model"],
          type: item["type"],
          attachedType: item["attachedType"],
          id: item["id"],
          required: true,
        };
        curationFields.value.push(field);
      });
});

onMounted(async () => {
  height.value = window.innerHeight - 255;
  await loadManifest();
});

//curaionDataにdefaultCurationDataからデータ挿入
for (const i in origCurationData.value) {
  console.log(origCurationData.value[i]);
  curationData.value[origCurationData.value[i]["model"]] = "";
  const field = {
    title: origCurationData.value[i]["title"],
    label: origCurationData.value[i]["label"],
    model: origCurationData.value[i]["model"],
    type: origCurationData.value[i]["type"],
    attachedType: origCurationData.value[i]["attachedType"],
    id: origCurationData.value[i]["id"],
    required: true,
  };
  curationFields.value.push(field);
}
//console.log(entityFields.value);
console.log(curationData.value);

// 選択されたアノテーションのURIを検索
const findSelectedAnnotationUri = () => {
  const uri = existsAnnotationMap.value[selectedAnnotationId.value]?.["@id"];
  if (uri) {
    selectedAnnotationUri.value = uri;
    content_state_api.value = uri;
  } else {
    selectedAnnotationUri.value = "Not found";
  }
};

const selectedAnnotation = ref<Annotation | null>(null);

let anno: any = null;

// async
//onMounted(async () => {
//height.value = window.innerHeight - 64;
const loadManifest = async () => {
  manifest.value = inputManifestUrl.value; // ユーザーが入力したURLを使用する
  //manifest.value = 'https://edh.ub.uni-heidelberg.de/iiif/edh/F000001.manifest.json';

  const res = await fetch(manifest.value);
  //const res = await fetch(manifest);
  const json = await res.json();

  //const canvases = json.sequences?.[0]?.canvases ?? [];
  const canvases = json.sequences[0].canvases;

  const tileSources = canvases.map((canvas: any) => {
    const resource = canvas.images[0].resource;
    //const infoUrl = canvas.images[0].resource["@id"].replace(
    let infoUrl = resource["@id"].replace(
      "/full/full/0/default.jpg",
      "/info.json"
    );
    if (resource.service) {
      infoUrl = resource.service["@id"] + "/info.json";
    }
    canvasImageMap[infoUrl] = canvas["@id"];
    return infoUrl;
  });

  if (viewer) {
    viewer.open(tileSources);
  } else {
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

  anno = $Annotorious(viewer);
  anno.disableEditor = true;

  anno.on("createSelection", async function (selection: any) {
    // Tag to insert
    selection.body = [
      {
        type: "TextualBody",
        purpose: "tagging",
        value: "",
      },
    ];

    await anno.updateSelected(selection);
    anno.saveSelected();
  });

  anno.on("updateAnnotation", function (annotation: any, overrideId: string) {
    createContentStateAPI(annotation, overrideId);
  });

  // アノテーションが選択されたときのイベントハンドラ
  anno.on("selectAnnotation", function (annotation: any) {
    selectedAnnotation.value = annotation; // 選択されたアノテーションを保存
    if (annotation && annotation.id) {
      selectedAnnotationId.value = annotation.id; // 選択されたアノテーションのIDを保存
      console.log("Selected annotation ID:", selectedAnnotationId.value); // コンソールに表示
      console.log("selected annotation URI: ", selectedAnnotationUri);
      findSelectedAnnotationUri(); // URIを検索して表示

      //dialog.value = true;
    }
  });
};

const openDialog = () => {
  dialog.value = true;
}

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
        id: manifest.value,
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
    "@context":
      "https://junjun7613.github.io/MicroKnowledge/himiko-context.jsonld",
    "@id": uri_,
    "@type": "",
  };

  const body = annotation.body;
  console.log(body)

  const tags = [];

  for (const value of body) {
    if (value.field === "external") {
      result_[
        "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"
      ] = value.value;
    } else if (value.field === "label") {
      result_["http://www.w3.org/2000/01/rdf-schema#label"] = value.value;
    } else if (value.field === "transcribe") {
      result_[
        "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTranscription"
      ] = value.value;
    } else if (value.field === "type") {
      result_["@type"] = value.value;
    } else if (value.purpose === "tagging") {
      tags.push(value.value);
    } else {
      result_[value.field] = value.value;
    }
  }
  /*
  if (tags.length > 0) {
    result_["https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"] =
      tags;
  }
  */

  // 要修正

  const annotationsIndex = annotation_result.value.findIndex(
    (item: Entity) => item["@id"] === result_["@id"]
  );

  if (annotationsIndex !== -1) {
    // 要素が見つかった場合、その位置に newItem を更新
    annotation_result.value[annotationsIndex] = result_;
  } else {
    // 要素が見つからなかった場合、newItem を配列の末尾に追加
    annotation_result.value.push(result_);
  }

  existsAnnotationMap.value[annotation.id] = result_;
};

const deleteContentStateAPI = () => {
  const index = annotation_result.value.findIndex(
    (item: Entity) => item["@id"] === selectedAnnotationUri.value
  );
  if (index !== -1) {
    annotation_result.value.splice(index, 1);
  }

  delete existsAnnotationMap.value[selectedAnnotationId.value];
};

const createAnnotation = async () => {
  const valueType_ = valueType.value;

  const selectedAnnotation_ = selectedAnnotation.value;

  const body = selectedAnnotation_?.body;
  body?.push({
    field: "type",
    value: valueType_,
  });

  //console.log(curationData.value)
  for (const field of filteredCurationFields.value){
    body?.push({
      field: field["model"],
      value: curationData.value[field["model"]],
    })
  }
  

  await anno.updateSelected(selectedAnnotation_);
  anno.saveSelected();

  dialog.value = false;
  selectedAnnotation.value = null;
  valueType.value = null;
  Object.keys(curationData.value).forEach((key) => {
      curationData.value[key] = null;
    });

  dialog2.value = false;
  filteredCurationFields.value = [];
};

const deleteAnnotation = async () => {
  const selectedAnnotation_ = selectedAnnotation.value;
  await anno.removeAnnotation(selectedAnnotation_);
  dialog.value = false;
  selectedAnnotation.value = null;

  deleteContentStateAPI();
};

const valueType = ref(null);

const curationDataModal = () => {
  const curationTypeValue = valueType.value
  const newCurationFields = []
  console.log(curationFields.value)
  for (const field of curationFields.value){
    console.log('Field attachedType:', field.attachedType)
    console.log('Curation Type Value:', curationTypeValue)
    //if (field.attachedType.includes(curationTypeValue)){
    if (field["attachedType"] == curationTypeValue){
      newCurationFields.push(field)
    }
  };
  console.log(newCurationFields)
  filteredCurationFields.value = newCurationFields;
  dialog.value = false;
  dialog2.value = true;
}

const backToDialog = () => {
  dialog2.value = false;
  dialog.value = true;
}

</script>
<template>
  <client-only>
    <v-text-field
      label="Manifest URL"
      v-model="inputManifestUrl"
      @keyup.enter="loadManifest"
      variant="outlined"
      density="compact"
      single-line
      hide-details
    ></v-text-field>

    <v-btn class="my-4 mr-4" @click="loadManifest">表示</v-btn>
    <v-btn class="my-4 mr-4" color="primary" @click="openDialog">フォームを表示</v-btn>

    <div
      id="osd"
      style="width: 100%; height: 650px; background-color: black"
    ></div>
  
    <!-- :style="`height: ${height * 1.1}px`" -->

    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title>キュレーションの作成</v-card-title>
        <v-card-text>
          <treeselect
            :multiple="false"
            :options="curationTypeSelect"
            v-model="valueType"
            placeholder="Type"
            class="mb-4"
          ></treeselect>
        </v-card-text>
        <v-card-actions>
          <v-btn varinat="flat" @click="dialog = false">キャンセル</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" varinat="flat" @click="deleteAnnotation"
            >削除</v-btn
          >
          <v-btn color="primary" varinat="flat" @click="curationDataModal"
            >データ入力へ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" width="600px">
      <v-card>
        <v-card-title>詳細データの入力</v-card-title>
        <v-card-text>
          <div v-for="field in filteredCurationFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                density="compact"
                :type="field.type"
                :label="field.label"
                :required="field.required"
                variant="outlined"
                v-model="curationData[field.model]"
              ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn varinat="flat" @click="backToDialog">戻る</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" varinat="flat" @click="createAnnotation"
            >作成</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </client-only>
</template>
<style>
.title {
  color: red;
}
</style>
