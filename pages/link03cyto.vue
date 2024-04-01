<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <div>
          <v-btn @click="showNodeModal = true" class="ml-2 mt-2"
            >ノードを追加</v-btn
          >
          <v-btn @click="showEntityModal = true" class="ml-2 mt-2"
            >エンティティを追加</v-btn
          >
          <v-btn @click="showEdgeModal = true" class="ml-2 mt-2"
            >エッジを追加</v-btn
          >
          <v-btn @click="relateImage" class="ml-2 mt-2" color="green"
            >画像とリンク</v-btn
          >
          <v-btn @click="editSelectedElement" class="ml-2 mt-2" color="blue"
            >更新</v-btn
          >
          <v-btn @click="deleteSelectedElement" class="ml-2 mt-2" color="red"
            >削除</v-btn
          >
        </div>

        <div>
          <!--<v-btn @click="updateDB">データベースに登録</v-btn>-->
          <v-btn @click="downloadJson" class="ml-2 mt-2"
            >JSONファイルをダウンロード</v-btn
          >
          <v-btn @click="downloadTurtle" class="ml-2 mt-2"
            >Turtleファイルをダウンロード</v-btn
          >
          <input
            type="file"
            id="jsonFileInput"
            style="display: none"
            @change="handleGraphFileUpload"
          />
          <v-btn @click="triggerGraphFileUpload" class="ml-2 mt-2"
            >JSONファイルをアップロード</v-btn
          >
        </div>

        <div
          class="my-4"
          id="cy"
          ref="cyElement"
          style="width: 100%; height: 660px; border: 1px solid #ccc"
        ></div>

        <div>
          <input
            type="file"
            id="jsonSettingsInput"
            style="display: none"
            @change="handleFileUpload"
          />
          <!-- 一つのボタンに変更  mt-2 -->
          <v-btn @click="triggerSettingFileUpload" class="ml-2"
            >設定を編集</v-btn
          >

          <v-btn @click="showGraphData" class="ml-2">グラフデータを表示</v-btn>

          <div v-if="graphData" class="graph-container my-4">
            <h3>グラフデータ</h3>
            <pre>{{ graphData }}</pre>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <ImageEditor />
      </v-col>
    </v-row>
  </v-container>

  <!-- ノード作成用モーダル -->
  <v-dialog
    v-model="showNodeModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>ノードの作成</v-card-title>
      <v-row>
        <v-col sm="12">
          <v-card-text>
            <div>
              <h3>ID情報を入力</h3>
              <treeselect
                :multiple="false"
                :options="prefixes"
                placeholder="Prefix"
                v-model="prefixSelect"
                class="mb-4"
              />
              <v-text-field
                v-model="nodeId"
                label="ID(何も入力しなければUUID)"
                required
              ></v-text-field>
            </div>
            <div>
              <h3>タイプを入力</h3>
              <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
              <treeselect
                :multiple="false"
                :options="nodeTypeSelect"
                placeholder="Factoid type..."
                v-model="nodeType"
                class="mb-4"
              />
            </div>
            <div>
              <h3>ラベルを入力</h3>
              <v-text-field
                v-model="labelInput"
                label="ラベル"
                required
              ></v-text-field>
            </div>
            <div v-for="field in nodeFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="factoidData[field.model]"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showNodeModal = false"
          >キャンセル</v-btn
        >
        <v-btn color="blue darken-1" text @click="addNode">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エンティティ作成用モーダル -->
  <v-dialog
    v-model="showEntityModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>エンティティの作成</v-card-title>
      <v-row>
        <v-col sm="12">
          <v-card-text>
            <div>
              <h3>IDを入力</h3>
              <treeselect
                :multiple="false"
                :options="prefixes"
                placeholder="Prefix"
                v-model="prefixSelect"
                class="mb-4"
              />
              <v-text-field
                v-model="entityId"
                label="Core ID"
                required
              ></v-text-field>
            </div>
            <div>
              <h3>タイプを入力</h3>
              <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
              <treeselect
                :multiple="false"
                :options="entityTypeSelect"
                placeholder="Entity type..."
                v-model="entityType"
                class="mb-4"
              />
            </div>
            <div>
              <h3>ラベルを入力</h3>
              <v-text-field
                v-model="labelInput"
                label="ラベル"
                required
              ></v-text-field>
            </div>
            <div v-for="field in entityFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="entityData[field.model]"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEntityModal = false"
          >キャンセル</v-btn
        >
        <v-btn color="blue darken-1" text @click="addEntity">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エッジ作成用モーダル -->
  <v-dialog
    v-model="showEdgeModal"
    persistent
    max-width="500px"
    max-height="400px"
  >
    <v-card height="600px">
      <v-card-title>エッジの作成</v-card-title>
      <v-card-text>
        <v-text-field v-model="edgeId" label="エッジID" required></v-text-field>
        <!--<v-text-field v-model="edgeType" label="エッジタイプ" required></v-text-field>-->
        <div
          v-if="
            selectedNodes.length === 2 &&
            selectedNodes[0].shape === 'factoid' &&
            selectedNodes[1].shape === 'factoid'
          "
        >
          <treeselect
            :multiple="false"
            :options="factoidRelationSelect"
            placeholder="Select property type"
            v-model="edgeType"
            class="mb-4"
          />
        </div>
        <div v-else>
          <treeselect
            :multiple="false"
            :options="edgeTypeSelect"
            placeholder="Select property type"
            v-model="edgeType"
            class="mb-4"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEdgeModal = false"
          >キャンセル</v-btn
        >
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--ノード編集用モーダル-->
  <v-dialog
    v-model="showEditNodeModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>ノードの編集</v-card-title>
      <v-row>
        <v-col sm="12">
          <v-card-text>
            <div>
              <h3>タイプを入力</h3>
              <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
              <treeselect
                :multiple="false"
                :options="nodeTypeSelect"
                placeholder="Factoid type..."
                v-model="editedNodeType"
                class="mb-4"
              />
            </div>
            <div v-for="field in nodeFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="editableFactoidData[field.model]"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
        <!--
      <v-col sm="6">
        <v-card-text>
        <div>
          <h3>典拠資料</h3>
          <v-text-field v-model="editedSourceCitation" label="Source citation (String)" required></v-text-field>
          <v-text-field v-model="editedSourceURI" label="Source URI" required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
  -->
      </v-row>
      <v-card-actions>
        <v-btn @click="updateNodes">更新</v-btn>
        <v-btn @click="showEditNodeModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--エンティティ編集用モーダル-->
  <v-dialog
    v-model="showEditEntityModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>エンティティの編集</v-card-title>
      <v-row>
        <v-col sm="12">
          <v-card-text>
            <div>
              <h3>タイプを入力</h3>
              <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
              <treeselect
                :multiple="false"
                :options="entityTypeSelect"
                placeholder="Entity type..."
                v-model="editedEntityType"
                class="mb-4"
              />
            </div>
            <div v-for="field in entityFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="editableEntityData[field.model]"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
        <!--
    <v-col sm="6">
      <v-card-text>
        <div>
          <h3>外部データURIを入力</h3>
          <v-text-field v-model="editedReferencedEntity" label="Entity URI..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
  -->
      </v-row>
      <v-card-actions>
        <v-btn @click="updateEntities">更新</v-btn>
        <v-btn @click="showEditEntityModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--エッジ編集用モーダル-->
  <v-dialog
    v-model="showEditEdgeModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>プロパティの編集</v-card-title>
      <v-card-text>
        {{ editableNodeData }}
      </v-card-text>
      <v-card-actions>
        <v-btn>更新</v-btn>
        <v-btn @click="showEditEdgeModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
//import ImageDrop from '@/components/ImageTextDrop.vue';
import ImageTextDrop from "@/components/ImageTextDrop.vue";
import ImageEditor from "@/components/ImageEditor.vue";
import { ref, watch } from "vue";
import cytoscape from "cytoscape";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import {
  defaultPrefixes,
  defaultColors,
  defaultNodeTypeSelect,
  defaultEntityTypeSelect,
  defaultEdgeTypeSelect,
  defaultFactoidRelationSelect,
  defaultEntityData,
  defaultNodeData,
} from "~/utils/annotation/misc";
import { createPopper } from "@popperjs/core";
import { computed } from "vue";
//import { useStore } from '@vue/composition-api';

//const store = useStore();

//const selectedAnnotationUri = computed(() => store.state.selectedAnnotationUri);

const { content_state_api, annotation_result } = useEditor();

const activeTab = ref(null); // 最初のタブをデフォルトとしてアクティブにする

const prefixes = ref(defaultPrefixes);
const colors = ref(defaultColors);
const nodeTypeSelect = ref(defaultNodeTypeSelect);
const entityTypeSelect = ref(defaultEntityTypeSelect);
const edgeTypeSelect = ref(defaultEdgeTypeSelect);
const factoidRelationSelect = ref(defaultFactoidRelationSelect);
const origEntityData = ref(defaultEntityData);
const origNodeData = ref(defaultNodeData);

const entityData = ref({});
const factoidData = ref({});

const entityFields = ref([]);
const nodeFields = ref([]);
const dataFields = ref([]);

const cyElement = ref(null);
let cy = null;
const selectedElement = ref(null);
const deletingElement = ref(null);
const selectedNodes = ref([]);
const selectedEdges = ref([]);
const showNodeModal = ref(false);
const showEntityModal = ref(false);
const showEdgeModal = ref(false);
const prefixSelect = ref(null);
const nodeId = ref(null);
const nodeType = ref(null);
const entityId = ref(null);
const entityType = ref(null);
const edgeId = ref(null);
const edgeType = ref(null);
const labelInput = ref(null);
const roleInput = ref(null);
const detailType = ref(null);
const referencedEntity = ref(null);
const sourceCitation = ref(null);
const sourceURI = ref(null);
const popperElement = ref(null);
//const nodeTypeSelect = ref(null)
const showEditNodeModal = ref(false); // モーダル表示用のref
const showEditEntityModal = ref(false); // モーダル表示用のref
const showEditEdgeModal = ref(false); // モーダル表示用のref
const editableNodeData = ref({}); // 編集するノードのデータを格納するref

const editableFactoidData = ref({});
const editableEntityData = ref({});

const editedNodeType = ref(null);
const editedDetailType = ref(null);
const editedLabelInput = ref(null);
const editedEntityType = ref(null);
const editedRoleInput = ref(null);
const editedReferencedEntity = ref(null);
const editedSourceCitation = ref(null);
const editedSourceURI = ref(null);

const graphData = ref(null);

// annotation_resultの値が変更された際に実行する関数
const updateGraphDataWithAnnotation = () => {
  // ここでGraphDataを更新するロジックを実装します。
  // 例えば、annotation_resultの値を利用してグラフのノードやエッジを更新するなど。
  console.log("annotation_resultが更新されました。", annotation_result.value);

  // GraphDataの更新例
  // この例では単純にconsoleに出力していますが、ここで実際にGraphDataを更新する処理を記述します。
  // 例えば、cytoscape.jsを利用している場合、グラフのノードやエッジを追加・更新する処理をここに書きます。
};

// annotation_resultを監視する
watch(annotation_result.value, (newValue, oldValue) => {
  // annotation_resultが変更された際に実行される処理
  updateGraphDataWithAnnotation();
});

onMounted(() => {
  cy = cytoscape({
    container: cyElement.value,
    elements: [],
    style: [
      {
        selector: 'node[shape="factoid"]',
        style: {
          shape: "round-rectangle", // 角なし四角形
          color: "grey",
          "background-color": (ele) => {
            // ノードの type データに基づいて色を返す
            const type = ele.data("type");
            return colors.value[type] || "#666"; // 色が定義されていない場合のデフォルト値
          },
          label: (ele) => {
            return ele.data("label");
          },
          width: 70, // 幅を50ピクセルに設定
          height: 50, // 高さを50ピクセルに設定
        },
      },
      {
        selector: 'node[shape="entity"]',
        style: {
          shape: "ellipse", // 円
          color: "grey",
          "background-color": (ele) => {
            // ノードの type データに基づいて色を返す
            const type = ele.data("type");
            return colors.value[type] || "#666"; // 色が定義されていない場合のデフォルト値
          },
          label: (ele) => {
            //ID(URL)をスラッシュで分割し、最後の要素を取得
            //const id = ele.data('id');
            //const parts = id.split('/');
            //return parts[parts.length - 1];
            return ele.data("label");
          },
        },
      },
      {
        selector: "node.selected", // 選択されたノード用のスタイル
        style: {
          //'background-color': 'blue',
          "border-width": 3, // 輪郭線の太さ
          "border-color": "#FFD700", // 輪郭線の色、ここでは金色を使用
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#ccc",
          "target-arrow-color": "#ccc",
          "target-arrow-shape": "triangle-tee", // エッジの矢印の形状を設定
          "curve-style": "bezier",
          label: (ele) => {
            //ID(URL)をスラッシュで分割し、最後の要素を取得
            const id = ele.data("type");
            let parts;
            if (id.includes("#")) {
              parts = id.split("#");
            } else {
              parts = id.split("/");
            }
            return parts[parts.length - 1];
          },
          "text-rotation": "autorotate", // ラベルの回転を自動調整
          "text-margin-y": -10,
        },
      },
      {
        selector: "edge.selected",
        style: {
          "line-color": "#FFD700",
          "target-arrow-color": "#FFD700",
          width: 4, // 選択されたときのエッジの太さ
        },
      },
    ],
    layout: {
      name: "preset",
    },
  });

  //cy.on('click', 'node, edge', (event) => {
  cy.on("click", "node", (event) => {
    const node = event.target;
    const nodeId = node.id();
    const nodeShape = node.data("shape") || "unknown"; // shapeがない場合は'unknown'を使用

    deletingElement.value = event.target;

    // selectedNodesに現在のノードが含まれているかチェック
    const nodeIndex = selectedNodes.value.findIndex((n) => n.id === nodeId);

    if (nodeIndex !== -1) {
      // ノードがすでに選択されている場合は削除
      selectedNodes.value.splice(nodeIndex, 1);
      node.removeClass("selected");
    } else {
      // 新しいノードを選択する
      if (selectedNodes.value.length >= 2) {
        // 最初の選択を削除
        const removedNode = selectedNodes.value.shift();
        cy.getElementById(removedNode.id).removeClass("selected");
      }
      selectedNodes.value.push({ id: nodeId, shape: nodeShape });
      node.addClass("selected");
    }
  });

  cy.on("click", "edge", (event) => {
    const edge = event.target;
    const edgeId = edge.id();

    deletingElement.value = event.target;

    // 選択されているエッジを探す
    const edgeIndex = selectedEdges.value.findIndex((e) => e.id === edgeId);

    if (edgeIndex !== -1) {
      // エッジがすでに選択されている場合は選択を解除
      selectedEdges.value.splice(edgeIndex, 1);
      edge.removeClass("selected");
    } else {
      // 新しいエッジを選択
      selectedEdges.value.push({ id: edgeId });
      edge.addClass("selected");
    }
  });

  cy.on("mouseover", "node", (event) => {
    const ele = event.target;

    // 初期化されたselectedElementオブジェクト
    selectedElement.value = {};

    // ele.data()のすべてのエントリに対してループ処理
    Object.entries(ele.data()).forEach(([key, value]) => {
      // 値がnullまたはundefinedでない場合、それをselectedElementに追加する
      if (value != null && value != undefined) {
        selectedElement.value[key] = value;
      }
    });
    handleMouseover(event, selectedElement.value);
    console.log(selectedElement.value);
  });

  cy.on("mouseover", "edge", (event) => {
    const ele = event.target;

    selectedElement.value = {
      id: ele.data("id"),
      type: ele.data("type"),
    };

    handleMouseover(event, selectedElement.value);
    console.log(selectedElement.value);
  });

  // ホバーが外れたときのイベントハンドラ
  cy.on("mouseout", "node, edge", () => {
    handleMouseout();
    selectedElement.value = null;
  });
});

// ポップアップのスタイル設定
const setPopperStyle = (popper) => {
  popper.style.background = "#fff";
  popper.style.border = "1px solid #ddd";
  popper.style.borderRadius = "4px";
  popper.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
  popper.style.padding = "10px";
  popper.style.fontSize = "14px";
  popper.style.color = "#333";
  popper.style.opacity = 1;
  popper.style.transition = "opacity 0.3s";
};

//entityDataにdefaultEntityDataからデータ挿入
for (const i in origEntityData.value) {
  console.log(origEntityData.value[i]);
  entityData.value[origEntityData.value[i]["model"]] = "";
  const field = {
    title: origEntityData.value[i]["title"],
    label: origEntityData.value[i]["label"],
    model: origEntityData.value[i]["model"],
    type: origEntityData.value[i]["type"],
    id: origEntityData.value[i]["id"],
    required: true,
  };
  entityFields.value.push(field);
}
//console.log(entityFields.value);
console.log(entityData.value);

//nodeDataにdefaultNodeDataからデータ挿入
for (const i in origNodeData.value) {
  console.log(origNodeData.value[i]);
  factoidData.value[origNodeData.value[i]["model"]] = "";
  const field = {
    title: origNodeData.value[i]["title"],
    label: origNodeData.value[i]["label"],
    model: origNodeData.value[i]["model"],
    type: origNodeData.value[i]["type"],
    id: origNodeData.value[i]["id"],
    required: true,
  };
  nodeFields.value.push(field);
}
//console.log(entityFields.value);
console.log(factoidData.value);

//entityFieldsとnodeFieldsを結合して、dataFieldsを作っておく。（Turtle作成の際に使用）
dataFields.value = entityFields.value.concat(nodeFields.value);

// ノードにマウスオーバーしたときの処理
const handleMouseover = (event, nodeData) => {
  if (!popperElement.value) {
    const IDParts = nodeData.id.split("/");
    const completeID = IDParts[IDParts.length - 1];
    const TypeParts = nodeData.type.split("#");
    const completeType = TypeParts[TypeParts.length - 1];
    // ポップアップ要素がまだない場合は作成
    popperElement.value = document.createElement("div");
    setPopperStyle(popperElement.value);
    //popperElement.value.innerHTML = `ID: ${nodeData.id}<br>Type: ${nodeData.type}`;
    console.log(nodeData.shape);
    if (nodeData.shape == "entity") {
      let htmlContent = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br>`;
      htmlContent += `<h5>Label:</h5> ${nodeData.label}<br>`;
      //popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Role:</h5> ${nodeData.role}<br><h5>Label:</h5> ${nodeData.label}<br><h5>External URI:</h5> ${nodeData.referencedEntity}`;
      Object.entries(nodeData).forEach(([key, value]) => {
        // IDとtypeはすでに表示されているので除外
        if (
          key !== "id" &&
          key !== "type" &&
          key !== "label" &&
          key !== "shape" &&
          key !== "correspondingImage" &&
          value
        ) {
          // キー名をラベルとして、値を表示
          const label = key.charAt(0).toUpperCase() + key.slice(1); // 最初の文字を大文字に
          htmlContent += `<h5>${label}:</h5> ${value}<br>`;
        }
      });
      popperElement.value.innerHTML = htmlContent;
    } else if (nodeData.shape == "factoid") {
      //popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Detail Type:</h5> ${nodeData.detailType}<br><h5>Label:</h5> ${nodeData.label}`;
      let htmlContent = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br>`;
      htmlContent += `<h5>Label:</h5> ${nodeData.label}<br>`;
      Object.entries(nodeData).forEach(([key, value]) => {
        // IDとtypeはすでに表示されているので除外
        if (
          key !== "id" &&
          key !== "type" &&
          key !== "label" &&
          key !== "shape" &&
          key !== "correspondingImage" &&
          value
        ) {
          // キー名をラベルとして、値を表示
          const label = key.charAt(0).toUpperCase() + key.slice(1); // 最初の文字を大文字に
          htmlContent += `<h5>${label}:</h5> ${value}<br>`;
        }
      });
      popperElement.value.innerHTML = htmlContent;
    } else {
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}`;
    }
    document.body.appendChild(popperElement.value);
  }

  // Cytoscape.js ノードの位置を基に Popper インスタンスを作成
  const referenceObject = {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      top: event.renderedPosition.y,
      bottom: event.renderedPosition.y,
      left: event.renderedPosition.x,
      right: event.renderedPosition.x,
    }),
  };

  // Popperインスタンスを作成
  const popperInstance = createPopper(referenceObject, popperElement.value, {
    placement: "right", // 好みに応じて変更
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [10, -20], // 1つ目の値は水平方向のオフセット、2つ目の値は垂直方向のオフセット
        },
      },
    ],
  });
};

// ノードからマウスが離れたときの処理
const handleMouseout = () => {
  if (popperElement.value) {
    document.body.removeChild(popperElement.value);
    popperElement.value = null;
  }
};

const showGraphData = () => {
  const nodes = cy.nodes().map((node) => {
    //基本的なノードを設定
    const nodeData = {
      id: node.id(),
      type: node.data("type"),
      shape: node.data("shape"),
      label: node.data("label"),
    };

    // node.dataに含まれるすべてのキーについて反復処理を行う
    Object.entries(node.data()).forEach(([key, value]) => {
      // 値がnullでない場合、それをnodeDataに追加する
      if (value != null) {
        nodeData[key] = value;
      }
    });
    return nodeData;
  });

  const edges = cy.edges().map((edge) => ({
    id: edge.id(),
    type: edge.data("type"),
    source: edge.data("source"),
    target: edge.data("target"),
  }));

  const curations = [];
  for (const curation of annotation_result.value) {
    const item = {};
    for (const key in curation) {
      if (key == "@context") {
      } else if ((key == "@id") | (key == "@type")) {
        item[key.replace("@", "")] = curation[key];
      } else {
        item[key] = curation[key];
      }
    }
    curations.push(item);
  }

  graphData.value = {
    nodes,
    edges,
    curations,
  };
};

const addNode = () => {
  if (detailType.value == "") {
    detailType.value = null;
  }

  if (prefixSelect.value && nodeType.value) {
    const completeID =
      prefixSelect.value + (nodeId.value || crypto.randomUUID());

    const nodeData = {
      id: completeID,
      type: nodeType.value,
      shape: "factoid",
      label: labelInput.value,
      //...(labelInput.value && {label: labelInput.value}),
      //...(detailType.value && { detailType: detailType.value }), // オプショナルなプロパティ
      //...(sourceCitation.value && { sourceCitation: sourceCitation.value }),
      //...(sourceURI.value && { sourceURI: sourceURI.value }),
      ...Object.fromEntries(
        Object.entries(factoidData.value).map(([key, value]) => [key, value])
      ),
    };

    cy.add({
      group: "nodes",
      //data: { id: nodeId.value, type: nodeType.value, shape: 'factoid' },
      data: nodeData,
      position: { x: Math.random() * 800, y: Math.random() * 600 },
    });
    cy.layout({ name: "preset" }).run(); // グラフのレイアウトを更新

    // モーダルの入力フィールドをクリア
    nodeId.value = null;
    nodeType.value = null;
    prefixSelect.value = null;

    // factoidDataの各プロパティをクリア
    Object.keys(factoidData.value).forEach((key) => {
      factoidData.value[key] = null;
    });

    labelInput.value = null;
    //detailType.value = null;
    //sourceCitation.value = null;
    //sourceURI.value = null;

    showNodeModal.value = false;
  } else {
    // 必要な場合はエラーメッセージを表示
    console.error("ノードID、タイプ、ラベルを入力してください。");
  }
};

const addEntity = () => {
  if (roleInput.value == "") {
    roleInput.value = null;
  }

  console.log(entityData.value);

  if (prefixSelect.value && entityType.value) {
    const completeID =
      prefixSelect.value + (entityId.value || crypto.randomUUID());

    const nodeData = {
      id: completeID,
      type: entityType.value,
      shape: "entity",
      label: labelInput.value,
      //...(labelInput.value && {label: labelInput.value}),
      //...(roleInput.value && {role: roleInput.value}),
      //...(referencedEntity.value && { referencedEntity: referencedEntity.value }),
      // entityData内の各フィールドをデータとして追加
      ...Object.fromEntries(
        Object.entries(entityData.value).map(([key, value]) => [key, value])
      ),
    };

    cy.add({
      group: "nodes",
      //data: { id: entityId.value, type: entityType.value, shape: 'entity' },
      data: nodeData,
      position: { x: Math.random() * 800, y: Math.random() * 600 },
    });
    cy.layout({ name: "preset" }).run(); // グラフのレイアウトを更新

    console.log("現在のグラフデータ:", cy.json());

    // モーダルの入力フィールドをクリア
    entityId.value = null;
    entityType.value = null;
    prefixSelect.value = null;

    // entityDataの各プロパティをクリア
    Object.keys(entityData.value).forEach((key) => {
      entityData.value[key] = null;
    });

    labelInput.value = null;
    //roleInput.value = null;
    //referencedEntity.value = null;

    showEntityModal.value = false;
  } else {
    // 必要な場合はエラーメッセージを表示
    console.error("ノードID、タイプ、ラベルを入力してください。");
  }
};

// エッジ作成用のメソッド
const createEdge = () => {
  if (selectedNodes.value.length === 2 && edgeId.value && edgeType.value) {
    //if (selectedNodes.length === 2) {
    cy.add({
      group: "edges",
      data: {
        id:
          "https://junjun7613.github.io/MicroKnowledge/property/" +
          edgeId.value,
        type: edgeType.value,
        source: selectedNodes.value[0]["id"],
        target: selectedNodes.value[1]["id"],
      },
    });
    edgeId.value = "";
    edgeType.value = "";
    showEdgeModal.value = false;
    selectedNodes.value = []; // 選択されたノードの配列をクリア
  } else if (selectedNodes.value.length === 2 && edgeType.value) {
    const completeID =
      "https://junjun7613.github.io/MicroKnowledge/property/" +
      crypto.randomUUID();
    cy.add({
      group: "edges",
      data: {
        id: completeID,
        type: edgeType.value,
        source: selectedNodes.value[0]["id"],
        target: selectedNodes.value[1]["id"],
      },
    });
    edgeId.value = "";
    edgeType.value = "";
    showEdgeModal.value = false;
    selectedNodes.value = []; // 選択されたノードの配列をクリア
  } else {
    console.error("2つのノードを選択し、エッジIDとタイプを入力してください。");
  }
};

const deleteSelectedElement = () => {
  if (deletingElement.value) {
    deletingElement.value.remove(); // 選択された要素を削除
    deletingElement.value = null;
  }
};

const editSelectedElement = () => {
  if (selectedNodes.value.length === 1) {
    const selectedNodeId = selectedNodes.value[0].id;
    const selectedNode = cy.getElementById(selectedNodeId);
    console.log(selectedNode.data());

    // 現在のノードデータを取得してeditableNodeDataに設定
    //editableNodeData.value = { ...selectedNode.data() };

    // 編集用モーダルを表示
    if (selectedNodes.value[0].shape === "factoid") {
      /*
      editedNodeType.value = selectedNode.data().type
      if (selectedNode.data().detailType) {
        editedDetailType.value = selectedNode.data().detailType
      }
      if (selectedNode.data().label) {
        editedLabelInput.value = selectedNode.data().label
      }
      if (selectedNode.data().sourceCitation) {
        editedSourceCitation.value = selectedNode.data().sourceCitation
      }
      if (selectedNode.data().sourceURI) {
        editedSourceURI.value = selectedNode.data().sourceURI
      }
      */
      editedNodeType.value = selectedNode.data().type;
      editedLabelInput.value = selectedNode.data().label;
      Object.entries(selectedNode.data()).forEach(([key, value]) => {
        editableFactoidData.value[key] = value;
      });
      //モーダルを表示させる
      showEditNodeModal.value = true;
    } else if (selectedNodes.value[0].shape === "entity") {
      /*
      editedEntityType.value = selectedNode.data().type
      if (selectedNode.data().role) {
        editedRoleInput.value = selectedNode.data().role;
      }
      if (selectedNode.data().label) {
        editedLabelInput.value = selectedNode.data().label;
      }
      if (selectedNode.data().referencedEntity) {
        editedReferencedEntity.value = selectedNode.data().referencedEntity;
      }
      */
      editedEntityType.value = selectedNode.data().type;
      editedLabelInput.value = selectedNode.data().label;
      Object.entries(selectedNode.data()).forEach(([key, value]) => {
        editableEntityData.value[key] = value;
      });
      //モーダルを開く
      showEditEntityModal.value = true;
    }
  } else if (selectedEdges.value.length === 1) {
    const selectedEdgeId = selectedEdges.value[0].id;
    const selectedEdge = cy.getElementById(selectedEdgeId);
    console.log(selectedEdge.data());
    // 現在のノードデータを取得してeditableNodeDataに設定
    editableNodeData.value = { ...selectedEdge.data() };
    showEditEdgeModal.value = true;
  } else {
    alert("編集するプロパティを選択してください");
  }
};

const updateNodes = () => {
  console.log(editableFactoidData.value);
  let nodeId = editableFactoidData.value.id;
  let node = cy.getElementById(nodeId);

  // 更新前のデータをログ出力
  console.log("Before update:", node.data());

  // ノードのデータを更新
  /*
  node.data({
    type: editedNodeType.value,
    ...(editedDetailType.value && {detailType: editedDetailType.value}),
    ...(editedLabelInput.value && {label: editedLabelInput.value}),
    ...(editedSourceCitation.value && {sourceCitation: editedSourceCitation.value}),
    ...(editedSourceURI.value && {sourceURI: editedSourceURI.value}),
    // その他の更新したいデータ
  });
  */

  Object.entries(editableFactoidData.value).forEach(([key, value]) => {
    if (key === "type") {
      node.data(key, editedNodeType.value);
    } else if (key === "label") {
      node.data(key, editedLabelInput.value);
    } else {
      node.data(key, value);
    }
  });

  // 更新後のデータをログ出力
  console.log("After update:", node.data());

  /*
  editableNodeData.value = {};
  editedNodeType.value = null;
  editedDetailType.value = null;
  editedLabelInput.value = null;
  editedSourceCitation.value = null;
  editedSourceURI.value = null;
  showEditNodeModal.value = false;
  */
  // 編集用データをクリア
  editableFactoidData.value = {};
  showEditNodeModal.value = false;
};
const updateEntities = () => {
  let nodeId = editableEntityData.value.id;
  let node = cy.getElementById(nodeId);

  // ノードのデータを更新
  /*
  node.data({
    type: editedEntityType.value,
    ...(editedRoleInput.value && {role: editedRoleInput.value}),
    ...(editedLabelInput.value && {label: editedLabelInput.value}),
    ...(editedReferencedEntity.value && {referencedEntity: editedReferencedEntity.value}),
    // その他の更新したいデータ
  });
  */
  Object.entries(editableEntityData.value).forEach(([key, value]) => {
    if (key === "type") {
      node.data(key, editedEntityType.value);
    } else if (key === "label") {
      node.data(key, editedLabelInput.value);
    } else {
      node.data(key, value);
    }
  });

  /*
  editableNodeData.value = {};
  editedEntityType.value = null;
  editedRoleInput.value = null;
  editedLabelInput.value = null;
  editedReferencedEntity.value = null;
  showEditEntityModal.value = false;
  */
  // 編集用データをクリア
  editableEntityData.value = {};
  showEditEntityModal.value = false;
};

const downloadJson = () => {
  const nodes = cy.nodes().map((node) => {
    const nodeData = {
      //group: 'nodes', // ノードのグループを指定
      //data: {
      id: node.id(),
      type: node.data("type"),
      shape: node.data("shape"),
      label: node.data("label"),
      position: {
        x: node.position("x"), // JSONデータからのX座標
        y: node.position("y"), // JSONデータからのY座標
      },
    };
    // node.dataに含まれるすべてのキーについて反復処理を行う
    Object.entries(node.data()).forEach(([key, value]) => {
      // 値がnullでない場合、それをnodeDataに追加する
      if (value != null) {
        nodeData[key] = value;
      }
    });

    return nodeData;
  });

  const edges = cy.edges().map((edge) => ({
    id: edge.id(),
    type: edge.data("type"),
    source: edge.data("source"),
    target: edge.data("target"),
  }));

  const curations = [];
  for (const curation of annotation_result.value) {
    const item = {};
    for (const key in curation) {
      if (key == "@context") {
      } else if ((key == "@id") | (key == "@type")) {
        item[key.replace("@", "")] = curation[key];
      } else {
        item[key] = curation[key];
      }
    }
    curations.push(item);
  }

  const graphData = {
    nodes,
    edges,
    curations,
  };
  const graphDataJson = JSON.stringify(graphData, null, 2);
  const blob = new Blob([graphDataJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "graph-data.json";
  a.click();
  URL.revokeObjectURL(url);
};

//Turtleへの変換
function convertToTurtle(nodes, edges, curations) {
  let turtleData =
    "@prefix : <https://junjun7613.github.io/MicroKnowledge/himiko.owl#> .\n"; // ベースURIを定義
  //存在するprefixを記述
  prefixes.value.forEach((prefix) => {
    turtleData += `@prefix ${prefix["label"]}: <${prefix["id"]}> .\n`;
  });

  turtleData += "\n";

  // ノードのデータをTurtle形式に変換
  nodes.forEach((node) => {
    turtleData += `<${node.id}> a <${node.type}>`;
    const properties = [];

    console.log(node);
    properties.push(
      `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#label> "${node.label}"`
    );
    if (node.correspondingImage) {
      properties.push(
        `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasVisualDescription> <${node.correspondingImage}>`
      );
    }

    // dataFieldsに基づいてノードの各プロパティを処理
    dataFields.value.forEach((field) => {
      console.log(field);
      const value = node[field.model];
      if (value != null) {
        const object = field.type === "uri" ? `<${value}>` : `"${value}"`; // 目的語の型に応じてフォーマット
        properties.push(`  <${field.id}> ${object}`);
      }
    });

    // 最初の述語の後にpropertiesがあればセミコロンを追加
    if (properties.length > 0) {
      turtleData += ";\n";
    }
    // 各プロパティをセミコロンで終わらせ、最後のプロパティにはピリオドを付ける
    properties.forEach((prop, index) => {
      if (index < properties.length - 1) {
        turtleData += prop + ";\n";
      } else {
        turtleData += prop + ".\n";
      }
    });

    // プロパティがない場合はピリオドを追加
    if (properties.length === 0) {
      turtleData += ".\n";
    }
  });
  // エッジのデータをTurtle形式に変換
  edges.forEach((edge) => {
    turtleData += `<${edge.source}> <${edge.type}> <${edge.target}> .\n`;
  });

  curations.forEach((curation) => {
    turtleData += `<${curation.id}> a <${curation.type}>`;
    const properties = [];

    console.log(curation);

    // 先に tags の処理を行う
    if (
      curation["https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"]
    ) {
      const tagsString =
        curation[
          "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"
        ][0];
      const tags = tagsString.split(",");
      console.log(tags);
      /*
      tags.forEach(tag => {
        properties.push(`  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag> "${tag}"`);
      });
      */
      for (const tag of tags) {
        properties.push(
          `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag> "${tag}"`
        );
      }
    }

    for (const key in curation) {
      if (
        key != "id" &&
        key != "type" &&
        key != "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"
      ) {
        if (
          key ==
          "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"
        ) {
          properties.push(`  <${key}> <${curation[key]}>`);
        } else {
          properties.push(`  <${key}> "${curation[key]}"`);
        }
      }
    }

    // 最初の述語の後にpropertiesがあればセミコロンを追加
    if (properties.length > 0) {
      turtleData += ";\n";
    }
    // 各プロパティをセミコロンで終わらせ、最後のプロパティにはピリオドを付ける
    properties.forEach((prop, index) => {
      if (index < properties.length - 1) {
        turtleData += prop + ";\n";
      } else {
        turtleData += prop + ".\n";
      }
    });

    // プロパティがない場合はピリオドを追加
    if (properties.length === 0) {
      turtleData += ".\n";
    }
  });

  return turtleData;
}

//Turtleファイルのダウンロード
function downloadTurtleFile(nodes, edges, curations) {
  const turtleData = convertToTurtle(nodes, edges, curations);
  const blob = new Blob([turtleData], { type: "text/turtle" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "graph-data.ttl";
  a.click();
  URL.revokeObjectURL(url);
}

const downloadTurtle = () => {
  const nodesData = cy.nodes().map((node) => {
    // 基本構造のセットアップ
    let nodeData = {
      id: node.id(),
      type: node.data("type"),
      label: node.data("label"),
    };

    // node.data()の各プロパティをループ処理
    Object.keys(node.data()).forEach((key) => {
      if (key !== "id" && key !== "type") {
        // idとtype以外のプロパティを対象
        const value = node.data(key);
        if (value != null) {
          // nullでない値のみを追加
          nodeData[key] = value;
        }
      }
    });

    return nodeData;
  });

  const edgesData = cy.edges().map((edge) => ({
    source: edge.data("source"),
    target: edge.data("target"),
    type: edge.data("type"),
  }));

  const curationsData = [];
  for (const curation of annotation_result.value) {
    const item = {};
    for (const key in curation) {
      if (key == "@context") {
      } else if ((key == "@id") | (key == "@type")) {
        item[key.replace("@", "")] = curation[key];
      } else {
        item[key] = curation[key];
      }
    }
    curationsData.push(item);
  }

  //console.log(nodesData)
  downloadTurtleFile(nodesData, edgesData, curationsData);
};

const handleGraphFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const json = JSON.parse(content);
        loadGraphData(json);
      } catch (error) {
        console.error("JSONファイルの読み込みエラー:", error);
      }
    };
    reader.readAsText(file);
  }
};

const triggerGraphFileUpload = () => {
  document.getElementById("jsonFileInput").click();
};

const loadGraphData = (data) => {
  cy.elements().remove(); // 現在のグラフデータを削除
  if (data.nodes || data.edges) {
    const nodes = data.nodes.map((node) => {
      const nodeData = {
        group: "nodes",
        data: {
          id: node.id,
          type: node.type,
          label: node.label,
          // 他のすべてのプロパティを動的に追加
        },
        position: {
          x: node.position.x,
          y: node.position.y,
        },
      };
      // nodeオブジェクトのすべてのキーに対してループ
      Object.entries(node).forEach(([key, value]) => {
        // id, type, positionはすでに設定されているのでスキップ
        if (
          !["id", "type", "position", "label"].includes(key) &&
          value != null
        ) {
          nodeData.data[key] = value;
        }
      });

      return nodeData;
    });

    const edges = data.edges.map((edge) => ({
      group: "edges",
      data: {
        id: edge.id,
        type: edge.type,
        source: edge.source,
        target: edge.target,
      },
    }));

    cy.add(nodes);
    cy.add(edges);
    cy.layout({ name: "preset" }).run(); // レイアウトを更新
  }
};

// triggerSettingFileUpload関数の変更
const triggerSettingFileUpload = () => {
  document.getElementById("jsonSettingsInput").click();
};

const handleColorsFileUpload = (event) => handleFileUpload(event, "Colors");
const handlePrefixesFileUpload = (event) => handleFileUpload(event, "Prefixes");
const handleNodeTypeSelectFileUpload = (event) =>
  handleFileUpload(event, "NodeTypeSelect");
const handleEntityTypeSelectFileUpload = (event) =>
  handleFileUpload(event, "EntityTypeSelect");
const handleEdgeTypeSelectFileUpload = (event) =>
  handleFileUpload(event, "EdgeTypeSelect");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      // 各タイプの設定を更新
      for (const type in json) {
        updateSettings(type, json[type]);
      }
    };
    reader.readAsText(file);
  }
};

const updateSettings = (type, data) => {
  switch (type) {
    case "Colors":
      colors.value = data["data"];
      break;
    case "Prefixes":
      prefixes.value = data["data"];
      break;
    case "NodeTypeSelect":
      nodeTypeSelect.value = data["data"];
      break;
    case "EntityTypeSelect":
      entityTypeSelect.value = data["data"];
      break;
    case "EdgeTypeSelect":
      edgeTypeSelect.value = data["data"];
      break;
    case "FactoidRelationSelect":
      factoidRelationSelect.value = data["data"];
      break;
    case "EntityData":
      origEntityData.value = data["data"];
      entityFields.value = [];
      entityData.value = {};
      data["data"].forEach((item) => {
        entityData.value[item["model"]] = "";
        const field = {
          title: item["title"],
          label: item["label"],
          model: item["model"],
          type: item["type"],
          id: item["id"],
          required: true,
        };
        entityFields.value.push(field);
      });
      //dataFieldsの更新
      updateDataFields();
      break;
    case "NodeData":
      origNodeData.value = data["data"];
      nodeFields.value = []; // クリアする
      factoidData.value = {}; // クリアする
      data["data"].forEach((item) => {
        factoidData.value[item["model"]] = "";
        const field = {
          title: item["title"],
          label: item["label"],
          model: item["model"],
          type: item["type"],
          id: item["id"],
          required: true,
        };
        nodeFields.value.push(field);
      });
      updateDataFields();
      break;
  }
};

const updateDataFields = () => {
  dataFields.value = [...entityFields.value, ...nodeFields.value];
};

//ノードと画像をリンクする処理
const relateImage = () => {
  const selectedNodes_ = selectedNodes.value;

  if (selectedNodes_.length === 1) {
    const selectedNode = selectedNodes_[0];

    let nodeId = selectedNode.id;

    let node = cy.getElementById(nodeId);
    node.data("correspondingImage", content_state_api.value);
  }
};

// その他の関数
</script>

<style scoped>
#cy {
  width: 800px;
  height: 600px;
}

.graph-container {
  _width: 800px;
  width: 100%;
  max-height: 500px;
  overflow: auto; /* スクロール可能にする */
  border: 1px solid #ccc; /* 枠線を追加 */
  padding: 10px; /* 内容と枠線の間の余白 */
}
</style>
