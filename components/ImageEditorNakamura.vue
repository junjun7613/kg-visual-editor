<script lang="ts" setup>
import { convertPresentation2 } from "@iiif/parser/presentation-2";
import type { Entity } from "~/types";
import { ref, watch } from "vue";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import {
  //defaultCurationTypeSelect,
  //defaultCurationData,
  defaultEntityTypeSelect,
  defaultEntityData,
} from "~/utils/annotation/misc";

interface Annotation {
  body: {
    field?: string;
    //valueのタイプはstringかobject
    value: string;
  }[];
}

const dialog = ref(false);
const dialog2 = ref(false);
const dialogInfo = ref(false);
const dialogEdit = ref(false);
const dialogEdit2 = ref(false);

const annotationData = ref(null);
const type_label = ref("");

const label = ref("");

const editableDataFieldsMap = ref({});
const editableDataFields = ref([]);

//const curationTypeSelect = ref(defaultCurationTypeSelect);
//const origCurationData = ref(defaultCurationData);
const curationTypeSelect = ref(defaultEntityTypeSelect);
const origCurationData = ref(defaultEntityData);

const curationData = ref({});
const editedCurationData = ref({});

const willDeleteAnnotation = ref("");

const curationFields = ref([]);
const filteredCurationFields = ref([]);

const { $OpenSeadragon, $Annotorious } = useNuxtApp();
//const manifest: string = route.query.manifest
//? String(route.query.manifest)
//: "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";

const {
  content_state_api,
  annotation_result,
  curation_type_select,
  curation_data,
  curationURIs,
  clickedNode,
  deletingEntity,
  manifestUrl,
} = useEditor();

const uploadedPositions = ref<string[]>([]);

watch(curationURIs, () => {
  let loadedID = "";

  console.log("curationsが変更されました");
  curationURIs.value.forEach((uri, index) => {
    if (
      uri.data &&
      "contentStateAPI" in uri.data &&
      uri.data["contentStateAPI"] !== null
    ) {
      const loadedId = uri.data["id"];
      //const loadedId = uri.data["strippedID"]
      //console.log(loadedId)
      //const id = loadedId.replace("https://dl.ndl.go.jp/api/iiif/1307825/manifest.json",'')
      //const id = "#" + loadedId.split("#")[1]
      const id = loadedId;
      loadedID = id;
      const loadedUri = uri.data["contentStateAPI"] || "";
      const decodeUri = loadedUri.replace(
        "https://icsae.vercel.app/viewer/?iiif-content=",
        ""
      );
      const decodedString = atob(decodeUri);
      console.log(decodedString);

      if (uploadedManifestUrl.value === "") {
        const manifest = JSON.parse(decodedString).partOf[0].id;

        uploadedManifestUrl.value = manifest;
        inputManifestUrl.value = manifest;
        manifestUrl.value = manifest;
      }

      /*
      if (inputManifestUrl.value === ""){
        const manifest = JSON.parse(decodedString).partOf[0].id
        inputManifestUrl.value = manifest
      }
      */
      const xywh = JSON.parse(decodedString)["id"].split("#xywh=")[1];
      //console.log(xywh)
      uploadedPositions.value.push(xywh);

      //ここでresult_を作成し、existsAnnotationMapに追加する
      const result_: Entity = {
        "@context":
          "https://junjun7613.github.io/MicroKnowledge/himiko-context.jsonld",
        "@id": uri.data["id"],
        //"@id": uploadedManifestUrl.value + id,
        "@type": uri.data["type"],
        label: uri.data["label"],
        contentStateAPI: uri.data["contentStateAPI"],
        thumbnail: uri.data["thumbnail"],
        shape: "entity",
        coor: xywh,
      };
      result_["contentStateAPI"] = loadedUri;
      for (const key in uri.data) {
        if (
          key !== "id" &&
          key !== "type" &&
          key !== "label" &&
          key !== "contentStateAPI"
        ) {
          result_[key] = uri.data[key];
        }
      }

      existsAnnotationMap.value[id] = result_;
      //existsAnnotationMap.value[strippedID] = result_;
    }
  });

  const loadManifest = async () => {

    const loadedCanvasesMap = {};
    const annotationsMap = {};

    const res = await fetch(uploadedManifestUrl.value);
    //const res = await fetch(inputManifestUrl.value);
    const json = await res.json();
    console.log(convertPresentation2(json));

    //const canvases = json.sequences?.[0]?.canvases ?? [];
    //let canvases = json.canvases || json.items;
    const canvases = (json.sequences && json.sequences[0] && json.sequences[0].canvases) || json.items;
    if (!canvases) {
      const canvases = json.items;
    }

    console.log(canvases)
    for (const key in canvases) {
      const canvas = canvases[key];
          if (canvas.images && canvas.images[0] && canvas.images[0].resource && canvas.images[0].resource.service) {
            loadedCanvasesMap[key] = canvas.images[0].resource.service["@id"];
          } else if (canvas.items && canvas.items[0] && canvas.items[0].items && canvas.items[0].items[0] && canvas.items[0].items[0].body) {
            loadedCanvasesMap[key] = canvas.items[0].items[0].body["id"];
          } else {
            console.log(canvas)
            console.warn(`Image resource not found for canvas ${key}`);
          }
    }
    console.log(loadedCanvasesMap);

    const existsAnnotationMap_ = existsAnnotationMap.value;
    /*
    var annotationsMap: {
      [key: number]: {
        target: {
          source: string;
        };
      }[];
    } = {};
     */

    //existsAnnotationMap_をオブジェクトごとに処理
    for (const key in existsAnnotationMap_) {
      const loadedData = existsAnnotationMap_[key];
      console.log(loadedData);
    }

    console.log({ existsAnnotationMap_, annotationsMap });

    // existsAnnotationMap_ => annotationsMap

    const tileSources = canvases.map((canvas: any) => {
      /*
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
      */
      console.log(canvas);
      let resource;
          if (canvas.images && canvas.images[0] && canvas.images[0].resource) {
            resource = canvas.images[0].resource;
            console.log(resource);
          } else if (canvas.items && canvas.items[0] && canvas.items[0].items && canvas.items[0].items[0] && canvas.items[0].items[0].body) {
            resource = canvas.items[0].items[0].body;
            console.log(resource);
          } else {
            console.warn(`Resource not found for canvas ${canvas["@id"]}`);
            return null;
          }
      //const infoUrl = canvas.images[0].resource["@id"].replace(
      const source_string = resource["id"].split("full")[0]
      let infoUrl = source_string +"info.json";
      console.log(infoUrl);
      //if (resource.service) {
        //infoUrl = resource.service[0]["@id"] + "/info.json";
      //}
      canvasImageMap[infoUrl] = canvas["id"];
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
      console.log(currentIndex.value);
      anno.clearAnnotations();
      showCurrentCanvasAnnotations();
    });

    const showCurrentCanvasAnnotations = () => {
      const index = currentIndex.value;
      console.log(index);

      if (annotationsMap[index]) {
        annotationsMap[index].forEach((annotation) => {
          console.log({ annotation });
          anno.addAnnotation(annotation);
        });
      }
    };

    anno = $Annotorious(viewer);
    anno.disableEditor = true;

    //uploadedPositions.value.forEach((position) => {
    for (const key in existsAnnotationMap.value) {
      const index = currentIndex.value;
      // const canvasId = Object.values(canvasImageMap)[index];

      //ここで、loadedIDを使って、bodyにデータを追加する
      const loadedData = existsAnnotationMap.value[key];

      const body: {
        field?: string;
        value: string;
        type?: string;
        format?: string;
      }[] = [
        {
          type: "TextualBody",
          value: "",
          format: "text/plain",
        },
      ];
      body?.push({
        field: "id",
        value: loadedData["@id"],
      });
      body?.push({
        field: "type",
        value: loadedData["@type"],
      });
      body?.push({
        field: "label",
        value: loadedData["label"],
      });
      for (const key in loadedData) {
        if (
          key !== "@id" &&
          key !== "@type" &&
          key !== "label" &&
          key !== "@context" &&
          key !== "contentStateAPI" &&
          key !== "shape" &&
          key !== "coor"
        ) {
          body?.push({
            field: key,
            value: loadedData[key],
          });
        }
      }

      const annotation = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        //"id": existsAnnotationMap.value[key]["@id"].replace(inputManifestUrl.value, ""),
        id: existsAnnotationMap.value[key]["@id"].replace(
          uploadedManifestUrl.value,
          ""
        ),
        type: "Annotation",
        body: body,
        target: {
          //source: uploadedManifestUrl.value,
          source: tileSources[currentIndex.value].split("/info.json")[0],
          selector: {
            type: "FragmentSelector",
            conformsTo: "http://www.w3.org/TR/media-frags/",
            value: `xywh=pixel:${existsAnnotationMap.value[key]["coor"]}`,
          },
        },
      }

      anno.addAnnotation(annotation);

      console.log(loadedCanvasesMap);
      //existsAnnotationMap.value[key]["thumbnail"]からcanvas idの部分のみ取得
      const canvasId = existsAnnotationMap.value[key]["thumbnail"];
      // 正規表現を使用して、特定の部分を抽出
      const match = canvasId.match(/(https:\/\/dl\.ndl\.go\.jp\/api\/iiif\/\d+\/R\d+)/);

      if (match) {
        const extractedPart = match[1];
        console.log(extractedPart); // https://dl.ndl.go.jp/api/iiif/1307825/R0000001
        //extractedPartの値をvalueに持つキーをloadedCanvasesMapから取得
        const index = Object.keys(loadedCanvasesMap).filter( (key) => { 
          console.log(key);
          return loadedCanvasesMap[key].split("/full")[0] === extractedPart;
        });
        console.log(index);
        console.log(annotationsMap)
        if (index.length > 0) {
          // annotationsMap[index[0]]が存在しない場合に初期化
          if (!annotationsMap[index[0]]) {
            annotationsMap[index[0]] = [];
          }
          annotationsMap[index[0]].push(annotation);
        }
      } else {
        console.log("URLの形式が一致しませんでした。");
      }

      console.log(annotationsMap);

      //});
    }

    anno.on("createSelection", async function (selection: any) {
      // Tag to insert
      /*
      selection.body = [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "",
        },
      ];

      console.log(selection);

      await anno.updateSelected(selection);
      anno.saveSelected();
      */
      const source = tileSources[currentIndex.value].split("/info.json")[0];
      console.log(source);
      // Tag to insert
      selection.body = [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "",
        },
      ];
      selection.target.source = source;

      console.log(selection);

      await anno.updateSelected(selection);
      await anno.saveSelected();
      });

    anno.on("updateAnnotation", function (annotation: any, overrideId: string) {
      console.log(annotation);
      console.log("method: updateAnnotation");
      createContentStateAPI(annotation, overrideId);
    });

    // アノテーションが選択されたときのイベントハンドラ
    anno.on("selectAnnotation", function (annotation: any) {
      selectedAnnotation.value = annotation; // 選択されたアノテーションを保存
      if (annotation && annotation.id) {
        selectedAnnotationId.value = annotation.id; // 選択されたアノテーションのIDを保存
        willDeleteAnnotation.value = annotation.id;
        //selectedAnnotationId.value = uploadedManifest.value + annotation.id; // 選択されたアノテーションのIDを保存
        console.log("Selected annotation ID:", selectedAnnotationId.value); // コンソールに表示
        console.log("selected annotation URI: ", selectedAnnotationUri);
        findSelectedAnnotationUri(); // URIを検索して表示
      }
      if (annotation && annotation.body.length > 1) {
        annotationData.value = annotation;
        //typeのラベルを表示するための探索をこの時点で行い、type_labelを取得する
        const type = annotation.body.find(
          (item) => item.field === "type"
        ).value;
        for (const item of curationTypeSelect.value) {
          if (item.id === type) {
            type_label.value = item.label;
          }
        }
        dialogInfo.value = true;
      }
    });

    watch(clickedNode, () => {
      console.log("clickedNodeが変更されました");
      if (clickedNode.value !== null) {
        console.log(clickedNode.value);
        //const annotationId = clickedNode.value["id"].replace(inputManifestUrl.value, "")
        const annotationId = clickedNode.value["id"];
        console.log(annotationId);
        selectAnnotationById(anno, annotationId);
      }
    });

    watch(deletingEntity, (newVal, oldVal) => {
      if (newVal !== null) {
        deleteAnnotationById(newVal);
        //annotation_resultから、deletingEntityに一致するものを削除する

        const index = annotation_result.value.findIndex(
          (item: Entity) =>
            item["@id"] === inputManifestUrl.value + deletingEntity.value
        );
        //if (index !== -1) {
        annotation_result.value.splice(index, 1);
        //}
      }
    });
  };

  loadManifest();
});

const canvasImageMap: { [key: string]: string } = {};

const currentIndex = ref(0);
const text = ref("");
const uri = ref("");
const height = ref(0);
//const existsAnnotationMap = ref<{
//[key: string]: Entity;
//}>({});
const existsAnnotationMap = ref<{
  [key: string]: Entity;
}>({});

const inputManifestUrl = ref(""); // ユーザーが入力するManifestのURL
const uploadedManifestUrl = ref(""); // アップロードされたManifestのURL
const manifest = ref(""); // 実際に使用するManifestのURL
/*
const manifest: string = route.query.manifest
  ? String(route.query.manifest)
  : "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";
*/

const selectedAnnotationId = ref("");
const selectedAnnotationUri = ref("");
const selectedAnnotationType = ref("");
const selectedAnnotationLabel = ref("");

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

// TODO: ここに注目
const loadManifest = async () => {

  console.log("はじめての作業です");  

  manifest.value = inputManifestUrl.value; // ユーザーが入力したURLを使用する
  //manifest.value = 'https://edh.ub.uni-heidelberg.de/iiif/edh/F000001.manifest.json';

  const res = await fetch(manifest.value);
  //const res = await fetch(manifest);
  const json = await res.json();
  console.log(convertPresentation2(json));

  //const canvases = json.sequences?.[0]?.canvases ?? [];
  const canvases = (json.sequences && json.sequences[0] && json.sequences[0].canvases) || json.items;
  if (!canvases) {
    const canvases = json.items;
  }

  var annotationsMap: {
    [key: number]: {
      target: {
        source: string;
      };
    }[];
  } = {};

  const tileSources = canvases.map((canvas: any) => {
    console.log(canvas);
    let resource;
        if (canvas.images && canvas.images[0] && canvas.images[0].resource) {
          resource = canvas.images[0].resource;
          console.log(resource);
        } else if (canvas.items && canvas.items[0] && canvas.items[0].items && canvas.items[0].items[0] && canvas.items[0].items[0].body) {
          resource = canvas.items[0].items[0].body;
          console.log(resource);
        } else {
          console.warn(`Resource not found for canvas ${canvas["@id"]}`);
          return null;
        }
    //const infoUrl = canvas.images[0].resource["@id"].replace(
    const source_string = resource["id"].split("full")[0]
    let infoUrl = source_string +"info.json";
    console.log(infoUrl);
    //if (resource.service) {
      //infoUrl = resource.service[0]["@id"] + "/info.json";
    //}
    canvasImageMap[infoUrl] = canvas["id"];
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

  viewer.addHandler("page", function (event: { page: number }) {
    currentIndex.value = event.page;
    anno.clearAnnotations();
    showCurrentCanvasAnnotations();
  });

  const showCurrentCanvasAnnotations = () => {
    const index = currentIndex.value;

    if (annotationsMap[index]) {
      annotationsMap[index].forEach((annotation) => {
        console.log({ annotation });
        anno.addAnnotation(annotation);
      });
    }
  };

  anno = $Annotorious(viewer);
  anno.disableEditor = true;

  anno.on("createSelection", async function (selection: any) {
    console.log(selection);

    const source = tileSources[currentIndex.value].split("/info.json")[0];
    console.log(source);
    // Tag to insert
    selection.body = [
      {
        type: "TextualBody",
        purpose: "tagging",
        value: "",
      },
    ];
    selection.target.source = source;

    console.log(selection);

    await anno.updateSelected(selection);
    await anno.saveSelected();

    saveToAnnotationsMap();
  });

  const saveToAnnotationsMap = () => {
    const index = currentIndex.value;
    annotationsMap[index] = anno.getAnnotations();
    console.log(annotationsMap);
  };

  anno.on("updateAnnotation", function (annotation: any, overrideId: string) {
    console.log(annotation);
    console.log("updateAnnotation");
    // リサイズして保存されたら、既存のアノテーションを更新する
    saveToAnnotationsMap();
    createContentStateAPI(annotation, overrideId);
  });

  // アノテーションが選択されたときのイベントハンドラ
  anno.on("selectAnnotation", function (annotation: any) {
    selectedAnnotation.value = annotation; // 選択されたアノテーションを保存
    if (annotation && annotation.id) {
      selectedAnnotationId.value = annotation.id; // 選択されたアノテーションのIDを保存
      willDeleteAnnotation.value = inputManifestUrl.value + annotation.id;
      console.log("Selected annotation ID:", selectedAnnotationId.value); // コンソールに表示
      console.log("selected annotation URI: ", selectedAnnotationUri);
      findSelectedAnnotationUri(); // URIを検索して表示
    }
    if (annotation && annotation.body.length > 1) {
      annotationData.value = annotation;
      //typeのラベルを表示するための探索をこの時点で行い、type_labelを取得する
      const type = annotation.body.find((item) => item.field === "type").value;
      for (const item of curationTypeSelect.value) {
        if (item.id === type) {
          type_label.value = item.label;
        }
      }
      dialogInfo.value = true;
    }
  });

  watch(clickedNode, () => {
    console.log("clickedNodeが変更されました");
    if (clickedNode.value !== null) {
      const annotationId = clickedNode.value["id"].replace(
        inputManifestUrl.value,
        ""
      );
      selectAnnotationById(anno, annotationId);
    }
  });

  watch(deletingEntity, (newVal, oldVal) => {
    if (newVal !== null) {
      deleteAnnotationById(newVal.replace(inputManifestUrl.value, ""));
      //deleteAnnotationById(newVal);
      //annotation_resultから、deletingEntityに一致するものを削除する

      const index = annotation_result.value.findIndex(
        (item: Entity) => item["@id"] === deletingEntity.value
      );
      if (index !== -1) {
        annotation_result.value.splice(index, 1);
      }
    }
  });
};

const openDialog = () => {
  dialog.value = true;
  label.value = "";
};

const createContentStateAPI = (annotation: any, overrideId: string) => {

  console.log(annotation);

  console.log("method: createContentStateAPI");
  const annotationId = annotation.id;

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
        //id: manifest.value,
        id: inputManifestUrl.value,
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
    //"@id": annotationId,
    "@id": inputManifestUrl.value + annotationId,
    "@type": "",
    label: label.value,
    shape: "entity",
    //"strippedID": annotationId,
    coor: xywh,
    contentStateAPI: uri_,
    //thumbnail: `${annotation.target.source}/${intXywh}/300,/0/default.jpg`,
    thumbnail: `${annotation.target.source}/${intXywh}/max/0/default.jpg`,
  };

  const body = annotation.body;

  const skipFields = ["thumbnail"];

  const tags = [];

  for (const value of body) {
    if (value.field === "external") {
      result_[
        "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"
      ] = value.value;
    } else if (value.field === "label") {
      //result_["http://www.w3.org/2000/01/rdf-schema#label"] = value.value;
      result_["label"] = value.value;
    } else if (value.field === "transcribe") {
      result_[
        "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTranscription"
      ] = value.value;
    } else if (value.field === "type") {
      result_["@type"] = value.value;
    } else if (value.purpose === "tagging") {
      tags.push(value.value);
    } else if (!skipFields.includes(value.field)) {
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
  body?.push({
    field: "label",
    value: label.value,
  });

  for (const field of filteredCurationFields.value) {
    body?.push({
      field: field["model"],
      value: curationData.value[field["model"]],
    });
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

const createEditedAnnotation = async () => {
  console.log(filteredCurationFields.value);
  console.log(editableDataFieldsMap.value);

  const valueType_ = selectedAnnotationType.value;

  const selectedAnnotation_ = selectedAnnotation.value;

  const body = selectedAnnotation_?.body;
  //ここで一度、既存のbodyを空にする
  body?.splice(0);
  body?.push({
    field: "type",
    value: valueType_,
  });
  body?.push({
    field: "label",
    value: selectedAnnotationLabel.value,
  });

  for (const field of filteredCurationFields.value) {
    body?.push({
      field: field["model"],
      value: editableDataFieldsMap.value[field["model"]],
    });
  }

  console.log(body);

  await anno.updateSelected(selectedAnnotation_);
  anno.saveSelected();

  dialogEdit.value = false;
  selectedAnnotation.value = null;
  valueType.value = null;
  Object.keys(editableDataFieldsMap.value).forEach((key) => {
    editableDataFieldsMap.value[key] = null;
  });

  dialogEdit2.value = false;
  filteredCurationFields.value = [];
};

const deleteAnnotation = async () => {
  const selectedAnnotation_ = selectedAnnotation.value;
  //deletingEntity.value = selectedAnnotation_.id;
  deletingEntity.value = willDeleteAnnotation.value;
  if (uploadedManifestUrl.value) {
    manifestUrl.value = uploadedManifestUrl.value;
  } else {
    manifestUrl.value = "";
  }
  await anno.removeAnnotation(selectedAnnotation_);
  dialog.value = false;
  selectedAnnotation.value = null;

  deleteContentStateAPI();
};

const valueType = ref(null);

const curationDataModal = () => {
  const curationTypeValue = valueType.value;
  const newCurationFields = [];
  for (const field of curationFields.value) {
    console.log(field);
    console.log("Field attachedType:", field.attachedType);
    console.log("Curation Type Value:", curationTypeValue);
    if (field.attachedType.includes(curationTypeValue)) {
      //if (field["attachedType"] == curationTypeValue){
      newCurationFields.push(field);
    }
  }
  console.log(newCurationFields);
  filteredCurationFields.value = newCurationFields;
  dialog.value = false;
  dialog2.value = true;
};

const editedCurationDataModal = () => {
  const curationTypeValue = selectedAnnotationType.value;
  const newCurationFields = [];
  console.log(curationFields.value);
  for (const field of curationFields.value) {
    console.log(field);
    console.log("Field attachedType:", field.attachedType);
    console.log("Curation Type Value:", selectedAnnotationType.value);
    if (field.attachedType.includes(curationTypeValue)) {
      newCurationFields.push(field);
    }
  }
  console.log(newCurationFields);
  filteredCurationFields.value = newCurationFields;
  dialogEdit.value = false;
  dialogEdit2.value = true;
};

const backToDialog = () => {
  dialog2.value = false;
  dialog.value = true;
};

const closeDialogInfo = () => {
  dialogInfo.value = false;
};

const editAnnotation = (data: object) => {
  dialogInfo.value = false;
  dialogEdit.value = true;
  selectedAnnotationId.value = data["id"];
  //data.bodyの要素から、filedというキーの値がtypeのものを取得し、そのvalueをtype_labelに代入する
  selectedAnnotationType.value = data["body"].find(
    (item) => item.field === "type"
  )["value"];
  if (data["id"] in existsAnnotationMap.value) {
    selectedAnnotationUri.value = existsAnnotationMap.value[data["id"]]["@id"];
  } else {
    selectedAnnotationUri.value =
      existsAnnotationMap.value[inputManifestUrl.value + data["id"]]["@id"];
  }
  selectedAnnotationLabel.value = data["body"].find(
    (item) => item.field === "label"
  )["value"];
  //findSelectedAnnotationUri();
  for (const item of data["body"]) {
    console.log(item);
    if (item["field"] !== "type" && item["type"] !== "TextualBody") {
      const fieldType = item["field"];
      console.log(fieldType);
      const fieldValue = item["value"];
      editableDataFieldsMap.value[fieldType] = fieldValue;
      editableDataFields.value.push(item["field"]);
    }
  }
};

function selectAnnotationById(anno, annotationId) {
  // 全てのアノテーションを取得
  const annotations = anno.getAnnotations();

  // 指定されたIDを持つアノテーションを検索
  const targetAnnotation = annotations.find(
    (annotation) =>
      annotation.id === annotationId.replace(inputManifestUrl.value, "")
  );

  if (targetAnnotation) {
    // 該当するアノテーションが見つかった場合、選択状態にする
    anno.selectAnnotation(targetAnnotation);
  } else {
    console.log("指定されたIDを持つアノテーションが見つかりませんでした。");
  }
}

function deleteAnnotationById(id: any) {
  // ここでアノテーションを削除するロジックを実装します。
  // 例: this.annotations = this.annotations.filter(annotation => annotation.id !== id);
  console.log(`Deleting annotation with ID: ${id}`);
  anno.removeAnnotation(id.replace(inputManifestUrl.value, ""));
}
</script>
<template>
  <client-only>
    <!--
    {{existsAnnotationMap}}
    {{selectedAnnotationUri}}
    {{annotation_result}}
    {{clickedNode}}
    {{curationURIs}}
    {{inputManifestUrl}}
    {{annotationData}}
    {{annotationData}}
    {{selectedAnnotationLabel}}
    -->
    <v-text-field
      class="mt-4"
      label="IIIF Manifest URL"
      v-model="inputManifestUrl"
      @keyup.enter="loadManifest"
      variant="outlined"
      density="compact"
      single-line
      hide-details
    ></v-text-field>

    <v-btn class="my-4 mr-4" @click="loadManifest">show image</v-btn>
    <v-btn class="my-4 mr-4" color="primary" @click="openDialog"
      >annotation</v-btn
    >

    <div
      id="osd"
      style="width: 100%; height: 650px; background-color: black"
    ></div>

    <!-- :style="`height: ${height * 1.1}px`" -->

    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title>キュレーションの作成</v-card-title>
        <v-card-text>
          <h3 class="input-title">タイプを選択</h3>
          <treeselect
            :multiple="false"
            :options="curationTypeSelect"
            v-model="valueType"
            placeholder="Type"
            class="mb-4"
          ></treeselect>
        </v-card-text>
        <v-card-text>
          <h3 class="input-title">ラベルを入力</h3>
          <v-text-field
            density="compact"
            variant="outlined"
            label="labelを入力"
            v-model="label"
          ></v-text-field>
        </v-card-text>
        <br />
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
            <h3 class="input-title">{{ field.title }}</h3>
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

    <v-dialog v-model="dialogInfo" width="600px">
      <v-card>
        <v-card-title>Annotation情報</v-card-title>

        <div v-for="item in annotationData.body">
          <div
            v-if="
              'field' in item && item['value'] !== null && item['value'] !== ''
            "
          >
            <v-card-text v-if="item.field === 'type'">
              <h3 class="input-title">{{ item.field }}</h3>
              <p
                style="
                  margin-left: 50px;
                  margin-right: 50px;
                  text-align: center;
                "
              >
                {{ type_label }}
              </p>
            </v-card-text>
            <v-card-text v-else>
              <h3 class="input-title">{{ item.field }}</h3>
              <p
                style="
                  margin-left: 50px;
                  margin-right: 50px;
                  text-align: center;
                "
              >
                {{ item.value }}
              </p>
            </v-card-text>
          </div>
        </div>
        <v-card-actions>
          <v-btn varinat="flat" @click="closeDialogInfo()">閉じる</v-btn>
          <v-btn
            color="blue"
            varinat="flat"
            @click="editAnnotation(annotationData)"
            >変更</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" width="600px">
      <v-card>
        <v-card-title>キュレーションの編集</v-card-title>
        <v-card-text>
          <h3 class="input-title">タイプを変更</h3>
          <treeselect
            :multiple="false"
            :options="curationTypeSelect"
            v-model="selectedAnnotationType"
            placeholder="Type"
            class="mb-4"
          ></treeselect>
        </v-card-text>
        <v-card-text>
          <h3 class="input-title">ラベルを変更</h3>
          <v-text-field
            density="compact"
            variant="outlined"
            label="labelを変更"
            v-model="selectedAnnotationLabel"
          ></v-text-field>
        </v-card-text>
        <br />
        <v-card-actions>
          <v-btn varinat="flat" @click="dialogEdit = false">キャンセル</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" varinat="flat" @click="deleteAnnotation"
            >削除</v-btn
          >
          <v-btn color="primary" varinat="flat" @click="editedCurationDataModal"
            >データ入力へ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit2" width="600px">
      <v-card>
        <v-card-title>詳細データの入力</v-card-title>
        <v-card-text>
          <div v-for="field in filteredCurationFields" :key="field.model">
            <h3 class="input-title">{{ field.title }}</h3>
            <!--もしfield.modelの値がeditableDataFieldsに含まれる各要素のfieldキーの値と一致しなければ-->
            <v-text-field
              v-if="editableDataFields.includes(field.model)"
              density="compact"
              :type="field.type"
              :label="field.label"
              :required="field.required"
              variant="outlined"
              v-model="editableDataFieldsMap[field.model]"
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn varinat="flat" @click="backToDialog">戻る</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" varinat="flat" @click="createEditedAnnotation"
            >変更</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      id="popup"
      style="
        position: absolute;
        display: none;
        background: white;
        border: 1px solid black;
        padding: 10px;
      "
    >
      <!-- ポップアップの内容 -->
    </div>
  </client-only>
</template>
<style>
.title {
  color: red;
}

.input-title {
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
