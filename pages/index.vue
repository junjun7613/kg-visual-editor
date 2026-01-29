<template>
  <v-container fluid class="mt-2">
    <!--
  {{entityFields}}
  {{editableEntityData}}
  {{annotation_result}}
  {{selectedNodes}}
  -->
    <v-row>
      <v-col cols="12" md="6">
        <div>
          <v-btn @click="showNodeModal = true" class="ml-2 mt-2"
            >add Statement</v-btn
          >
          <!--
          <v-btn @click="showEntityModal = true" class="ml-2 mt-2"
            >add Entity</v-btn
          >
          -->
          <v-btn @click="showEdgeModal = true" class="ml-2 mt-2"
            >add Edge</v-btn
          >
        </div>
        <div class="mt-3">
          <!--
          <v-btn v-if="tabIndex == 0" @click="relateImage" class="ml-2 mt-2" color="green"
            ><em>画像</em>とリンク</v-btn
          >-->
          <v-btn
            v-if="tabIndex == 1"
            @click="relateText"
            class="ml-2 mt-2"
            color="green"
            ><em>テクスト</em>とリンク</v-btn
          >
        </div>
        <div class="mt-3">
          <v-btn @click="editSelectedElement" class="ml-2 mt-2" color="blue"
            >update</v-btn
          >
          <v-btn @click="deleteSelectedElement" class="ml-2 mt-2" color="red"
            >delete</v-btn
          >
        </div>

        <div
          class="my-4"
          id="cy"
          ref="cyElement"
          :style="`width: 100%; height: ${cyHeight}px; border: 1px solid #ccc`"
        ></div>

        <div>
          <!--<v-btn @click="updateDB">データベースに登録</v-btn>-->
          <v-btn @click="downloadJson" class="ml-2 mt-2">JSON Download</v-btn>
          <v-btn @click="downloadTurtle" class="ml-2 mt-2"
            >Turtle Download</v-btn
          >
          <input
            type="file"
            id="jsonFileInput"
            style="display: none"
            @change="handleGraphFileUpload"
          />
          <v-btn @click="triggerGraphFileUpload" class="ml-2 mt-2"
            >JSON Upload</v-btn
          >
        </div>

        <div>
          <input
            type="file"
            id="jsonSettingsInput"
            style="display: none"
            @change="handleFileUpload"
          />
          <!-- 一つのボタンに変更  mt-2 -->
          <v-btn @click="triggerSettingFileUpload" class="ml-2 mt-3"
            >edit settings</v-btn
          >

          <v-btn @click="showGraphData" class="ml-2 mt-3"
            >show graph data</v-btn
          >

          <div v-if="graphData" class="graph-container my-4">
            <h3>グラフデータ</h3>
            <pre>{{ graphData }}</pre>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-tabs v-model="tabIndex">
          <v-tab>IIIF Image Viewer</v-tab>
          <v-tab>TEI Viewer</v-tab>
        </v-tabs>
        <div v-show="tabIndex === 0">
          <ImageEditor />
        </div>
        <div v-show="tabIndex === 1">
          <TextEditor />
        </div>
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
              <h3 class="input-title">prefixを入力</h3>
              <treeselect
                :multiple="false"
                :options="prefixes"
                placeholder="Prefix"
                v-model="prefixSelect"
                class="mb-4"
              />
              <!--
              <v-text-field
                density="compact"
                v-model="nodeId"
                label="ID(何も入力しなければUUID)"
                variant="outlined"
                required
              ></v-text-field>
              -->
            </div>
            <div>
              <h3 class="input-title">タイプを選択</h3>
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
              <!--<h3>ラベルを入力</h3>-->
              <h3 class="input-title">ラベルを選択</h3>
              <v-text-field
                density="compact"
                v-model="labelInput"
                label="ラベル"
                required
                variant="outlined"
              ></v-text-field>
            </div>
            <div v-for="field in nodeFields" :key="field.model">
              <h3 class="input-title">{{ field.title }}</h3>
              <v-text-field
                density="compact"
                :type="field.type"
                :label="field.label"
                :required="field.required"
                variant="outlined"
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
              <h3 class="input-title">prefixを入力</h3>
              <treeselect
                :multiple="false"
                :options="prefixes"
                placeholder="Prefix"
                v-model="prefixSelect"
                class="mb-4"
              />
              <!--
              <v-text-field
                density="compact"
                v-model="entityId"
                label="Core ID"
                required
                variant="outlined"
              ></v-text-field>
              -->
            </div>
            <div>
              <h3 class="input-title">タイプを選択</h3>
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
              <h3 class="input-title">ラベルを入力</h3>
              <v-text-field
                density="compact"
                v-model="labelInput"
                label="ラベル"
                required
                variant="outlined"
              ></v-text-field>
            </div>
            <!--
            <div v-for="field in entityFields" :key="field.model">
              <h3>{{ field.title }}</h3>
              <v-text-field
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="entityData[field.model]"
              ></v-text-field>
            </div>
            -->
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEntityModal = false"
          >キャンセル</v-btn
        >
        <v-btn color="blue darken-1" text @click="createEntityDataModal"
          >データ入力へ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エンティティ・データ作成用モーダル -->
  <v-dialog
    v-model="showEntityDataModal"
    persistent
    max-width="500px"
    max-height="600px"
  >
    <v-card>
      <v-card-title>エンティティ・データの入力</v-card-title>
      <v-row>
        <v-col sm="12">
          <v-card-text>
            <div v-for="field in filteredEntityFields" :key="field.model">
              <h3 class="input-title" style="margin-bottom: 5xp">
                {{ field.title }}
              </h3>
              <v-text-field
                density="compact"
                :type="field.type"
                :label="field.label"
                :required="field.required"
                v-model="entityData[field.model]"
                variant="outlined"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="backToEntityDialog()"
          >戻る</v-btn
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
        <!--<v-text-field v-model="edgeId" label="エッジID" required></v-text-field>-->
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
        <div
          v-else-if="
            selectedNodes.length === 2 &&
            selectedNodes[0].shape === 'entity' &&
            selectedNodes[1].shape === 'entity'
          "
        >
          <treeselect
            :multiple="false"
            :options="entityRelationSelect"
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
        <!--<v-btn color="blue darken-1" text @click="showEdgeDataModal = true">データ入力へ</v-btn>-->
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エッジデータ作成用モーダル -->
  <!--
  <v-dialog
    v-model="showEdgeDataModal"
    persistent
    max-width="500px"
    max-height="400px"
  >
    <v-card height="600px">
      <v-card-title>エッジデータの作成</v-card-title>
      <v-card-text>
        <div v-for="field in nodeFields" :key="field.model">
              <h3 class="input-title">{{ field.title }}</h3>
              <v-text-field
                density="compact"
                :type="field.type"
                :label="field.label"
                :required="field.required"
                variant="outlined"
                v-model="factoidData[field.model]"
              ></v-text-field>
            </div>
      </v-card-text>
        
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEdgeDataModal = false"
          >キャンセル</v-btn
        >
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
-->

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
            <!--
            <div>
              <h3>タイプを入力</h3>
              <treeselect
                :multiple="false"
                :options="nodeTypeSelect"
                placeholder="Factoid type..."
                v-model="editedNodeType"
                class="mb-4"
              />
            </div>
          -->
            <div>
              <v-text-field
                density="compact"
                label="ラベルの編集"
                v-model="editedLabelInput"
                variant="outlined"
              ></v-text-field>
            </div>
            <div v-for="field in nodeFields" :key="field.model">
              <h3 class="input-title">{{ field.title }}</h3>
              <v-text-field
                density="compact"
                :type="field.type"
                :label="field.label"
                :required="field.required"
                variant="outlined"
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
            <!--
            <div>
              <h3>タイプを入力</h3>
              <treeselect
                :multiple="false"
                :options="entityTypeSelect"
                placeholder="Entity type..."
                v-model="editedEntityType"
                class="mb-4"
              />
            </div>
          -->
            <div>
              <v-text-field
                density="compact"
                label="ラベルの編集"
                v-model="editedLabelInput"
                variant="outlined"
              ></v-text-field>
            </div>
            <div v-for="field in entityFields" :key="field.model">
              <div v-if="field.attachedType.includes(editableEntityData.type)">
                <h3 class="input-title">{{ field.title }}</h3>
                <v-text-field
                  density="compact"
                  :type="field.type"
                  :label="field.label"
                  :required="field.required"
                  variant="outlined"
                  v-model="editableEntityData[field.model]"
                ></v-text-field>
              </div>
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
import ImageEditor from "@/components/ImageEditor.vue"; // 中村版に変更
import TextEditor from "@/components/TextEditor.vue";
import { ref, watch, nextTick } from "vue";
import cytoscape from "cytoscape";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import {
  defaultPrefixes,
  defaultColors,
  defaultNodeTypeSelect,
  defaultEntityTypeSelect,
  defaultEdgeTypeSelect,
  defaultEntityRelationSelect,
  defaultFactoidRelationSelect,
  defaultEntityData,
  defaultNodeData,
  defaultCurationTypeSelect,
  defaultCurationData,
} from "~/utils/annotation/misc";
import { createPopper } from "@popperjs/core";
import { computed } from "vue";
//import { useStore } from '@vue/composition-api';

//const store = useStore();

//const selectedAnnotationUri = computed(() => store.state.selectedAnnotationUri);

const {
  content_state_api,
  annotation_result,
  curation_type_select,
  curation_data,
  curationURIs,
  startToEndList,
  selectedNodeStartToEndList,
  clickedEntityObject,
  clickedNode,
  uploadedNodes,
  colorMatches,
  deletingEntity,
  manifestUrl,
} = useEditor();

watch(annotation_result, (newValue, oldValue) => {
  console.log("annotation_resultが更新されました。", annotation_result.value);
});

//const activeTab = ref(null); // 最初のタブをデフォルトとしてアクティブにする
const tabIndex = ref(0);

const prefixes = ref(defaultPrefixes);
const colors = ref(defaultColors);
const nodeTypeSelect = ref(defaultNodeTypeSelect);
const entityTypeSelect = ref(defaultEntityTypeSelect);
const edgeTypeSelect = ref(defaultEdgeTypeSelect);
const entityRelationSelect = ref(defaultEntityRelationSelect);
const factoidRelationSelect = ref(defaultFactoidRelationSelect);
const origEntityData = ref(defaultEntityData);
const origNodeData = ref(defaultNodeData);
const curationTypeSelect = ref(defaultCurationTypeSelect);
const origCurationData = ref(defaultCurationData);

const entityData = ref({});
const factoidData = ref({});
const curationData = ref({});

const entityFields = ref([]);
const filteredEntityFields = ref([]);
const nodeFields = ref([]);
const curationFields = ref([]);
const dataFields = ref([]);

const cyElement = ref(null);
const cyHeight = ref(0);
let cy = null;
const selectedElement = ref(null);
const deletingElement = ref(null);
const deletingEntityId = ref(null);
const selectedNodes = ref([]);
const selectedEdges = ref([]);
const showNodeModal = ref(false);
const showEntityModal = ref(false);
const showEntityDataModal = ref(false);
const showEdgeModal = ref(false);
const showEdgeDataModal = ref(false);
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

const updateNodeTextLink = () => {
  console.log(
    "clickedEntityObjectが更新されました。",
    clickedEntityObject.value
  );
  if (clickedEntityObject.value) {
    const nodeId = clickedEntityObject.value[0].id;
    const elementId = clickedEntityObject.value[1];

    console.log(nodeId);
    console.log(elementId);

    let node = cy.getElementById(nodeId);
    node.data("correspondingText", elementId);
  }
};

// annotation_resultを監視する
watch(annotation_result.value, (newValue, oldValue) => {
  // annotation_resultが変更された際に実行される処理
  updateGraphDataWithAnnotation();
});

onMounted(() => {
  // Cytoscapeグラフの高さを計算
  const calculateCyHeight = () => {
    const cyEl = document.getElementById('cy');
    if (cyEl) {
      const rect = cyEl.getBoundingClientRect();
      // ウィンドウ高さから、cy要素の上端位置を引く（下部のボタンとマージンのため-180pxを引く）
      cyHeight.value = window.innerHeight - rect.top - 180;
    } else {
      // フォールバック
      cyHeight.value = window.innerHeight - 400;
    }
  };

  // 初期高さを計算（レイアウトが完全に完了してから）
  nextTick(() => {
    nextTick(() => {
      setTimeout(() => {
        calculateCyHeight();
      }, 300);
    });
  });

  // ウィンドウリサイズ時に再計算
  window.addEventListener('resize', calculateCyHeight);

  watch(
    clickedEntityObject,
    (newValue, oldValue) => {
      updateNodeTextLink();
    },
    { deep: true }
  );

  cy = cytoscape({
    container: cyElement.value,
    elements: [],
    style: [
      {
        selector: 'node[shape="factoid"]',
        /*
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
          "text-valign": "center", // テキストを垂直方向の中央に配置
          "text-halign": "center", // テキストを水平方向の中央に配置
          "text-outline-width": 1, // テキストのアウトラインの太さを2に設定
          "text-outline-color": "#FFF", // テキストのアウトラインの色を白に設定
          width: 70, // 幅を50ピクセルに設定
          height: 50, // 高さを50ピクセルに設定
        },
        */
        style: {
          shape: "round-rectangle",
          "background-color": "#fff",
          "border-color": (ele) => {
            // ノードの type データに基づいて色を返す
            const type = ele.data("type");
            return colors.value[type] || "#666"; // 色が定義されていない場合のデフォルト値
          },
          "border-width": 1,
          "text-valign": "center",
          "text-halign": "center",
          color: "#000",
          "font-size": "9px",
          "font-weight": "bold",
          "text-wrap": "wrap",
          "text-max-width": 80, // テキストの最大幅を制限
          padding: "10px", // ノード内のパディング
          "background-image": "url(画像のURL)", // オプション: 背景画像
          "background-fit": "cover", // 背景画像のフィット方法
          label: (ele) => {
            return ele.data("label");
          },
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
          "text-valign": "bottom", // テキストを垂直方向の中央に配置
          "text-halign": "center", // テキストを水平方向の中央に配置
          "font-size": "9px",
          "text-outline-width": 1.5, // テキストのアウトラインの太さを2に設定
          "text-outline-color": "#FFF", // テキストのアウトラインの色を白に設定
          "background-fit": "cover",
          'background-width': '100%',
          'background-height': '100%', 
          //もしサムネイルがあればbackground-imageを設定
          "background-image": (ele) => {
            if (ele.data("thumbnail")) {
              return ele.data("thumbnail");
            }
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
          //"target-arrow-shape": "triangle-tee", // エッジの矢印の形状を設定
          "target-arrow-shape": "diamond", // エッジの矢印の形状を設定
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
          "font-size": "9px",
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
    clickedNode.value = null;

    const node = event.target;
    const nodeId = node.id();
    const nodeShape = node.data("shape") || "unknown"; // shapeがない場合は'unknown'を使用

    const selectedNodeStartEnd = [];
    if (node.data("descriptionStart") && node.data("descriptionEnd")) {
      //console.log(node.data("descriptionStart"))
      selectedNodeStartEnd.push(
        node.data("descriptionStart").split("#").slice(-1)[0]
      );
      //console.log(node.data("descriptionEnd"))
      selectedNodeStartEnd.push(
        node.data("descriptionEnd").split("#").slice(-1)[0]
      );
      //console.log(selectedNodeStartEnd)
      selectedNodeStartToEndList.value = selectedNodeStartEnd;
    }

    deletingEntityId.value = nodeId;
    deletingElement.value = event.target;

    // selectedNodesに現在のノードが含まれているかチェック
    const nodeIndex = selectedNodes.value.findIndex((n) => n.id === nodeId);

    if (nodeIndex !== -1) {
      // ノードがすでに選択されている場合は削除
      selectedNodes.value.splice(nodeIndex, 1);
      node.removeClass("selected");
      selectedNodeStartToEndList.value = [null, null];
    } else {
      // 新しいノードを選択する
      if (selectedNodes.value.length >= 2) {
        // 最初の選択を削除
        const removedNode = selectedNodes.value.shift();
        cy.getElementById(removedNode.id).removeClass("selected");
      }
      selectedNodes.value.push({ id: nodeId, shape: nodeShape });
      clickedNode.value = node.data();
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
    attachedType: origEntityData.value[i]["attachedType"],
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

//entityFieldsとnodeFieldsを結合して、dataFieldsを作っておく。（Turtle作成の際に使用）
const entityNodeFields = entityFields.value.concat(nodeFields.value);
dataFields.value = entityNodeFields.concat(curationFields.value);
console.log(dataFields.value);

/*
// ノードにマウスオーバーしたときの処理
const handleMouseover = (event, nodeData) => {
  if (!popperElement.value) {
    const IDParts = nodeData.id.split("/");
    let completeID = IDParts[IDParts.length - 1];
    completeID = completeID.replace("manifest.json", "");
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
        console.log(key);
        // IDとtypeはすでに表示されているので除外
        if (
          key !== "id" &&
          key !== "type" &&
          key !== "label" &&
          key !== "shape" &&
          key !== "correspondingImage" &&
          key !== "correspondingText" &&
          key !== "descriptionStart" &&
          key !== "descriptionEnd" &&
          key !== "@context" &&
          key !== "contentStateAPI" &&
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
*/

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
      //if (value != null) {
      if (value != "" && value != null) {
        nodeData[key] = value;
      }
    });
    return nodeData;
  });

  const edges = cy.edges().map((edge) => {
    const edgeData = {
      id: edge.id(),
      type: edge.data("type"),
      source: edge.data("source"),
      target: edge.data("target"),
    };
    // node.dataに含まれるすべてのキーについて反復処理を行う
    Object.entries(edge.data()).forEach(([key, value]) => {
      // 値がnullでない場合、それをedgeDataに追加する
      //if (value != null) {
      if (value != "" && value != null) {
        edgeData[key] = value;
      }
    });
    return edgeData;
  });

  const curations = [];
  for (const curation of annotation_result.value) {
    const item = {};
    for (const key in curation) {
      if (key == "@context") {
      } else if ((key == "@id") | (key == "@type")) {
        item[key.replace("@", "")] = curation[key];
      } else {
        if (curation[key] != "") {
          item[key] = curation[key];
        }
      }
    }
    curations.push(item);
  }

  graphData.value = {
    nodes,
    edges,
    //curations,
  };
};

// deletingEntityの値が変更されたときに実行されるウォッチャー
watch(
  () => deletingEntity.value,
  (newVal, oldVal) => {
    if (newVal) {
      const nodeToDelete = cy.getElementById(manifestUrl.value + newVal);
      if (nodeToDelete) {
        nodeToDelete.remove();
        console.log(`ノード ${newVal} が削除されました。`);
      }
    }
  }
);

const getImageUrlFromContentStateApi = async (contentStateAPI) => {
  const iiifContent = contentStateAPI.split("?iiif-content=")[1];

  const decodedString = atob(iiifContent);

  const decodedObject = JSON.parse(decodedString);
  const itemId = decodedObject["id"];

  const [canvasId, xywh] = itemId.split("#xywh=");

  const manifestUri = decodedObject.partOf[0]["id"];

  const res = await fetch(manifestUri);
  const manifestJson = await res.json();

  const imageApi = manifestJson["sequences"][0]["canvases"].find(
    (canvas) => canvas["@id"] == canvasId
  )["images"][0]["resource"]["service"]["@id"];

  const imageUrl = `${imageApi}/${xywh}/300,/0/default.jpg`;

  return imageUrl;
};

// annotation_resultが更新されたときに実行される関数
watch(annotation_result.value, (newValue, oldValue) => {
  console.log({ newValue });
  const nodeIds = cy.nodes().map((node) => node.id());
  console.log(nodeIds);
  // 新しいアノテーション結果を基にノードデータを準備
  const nodeData = newValue.map((annotation) => {
    // ノードの一意のIDを取得し、#で分割して最後の要素を取得
    const nodeId = annotation["@id"];

    // cyインスタンスから特定のノードの現在の位置を取得
    let position = { x: Math.random() * 800, y: Math.random() * 600 }; // デフォルト位置
    if (cy.getElementById(nodeId).length) {
      // ノードが存在する場合、その現在の位置を取得
      position = cy.getElementById(nodeId).position();
    }
    return {
      group: "nodes",
      data: {
        id: annotation["@id"], // 一意のID
        //id: annotation["strippedID"],
        type: annotation["@type"],
        //label: annotation.label,
        label: annotation["label"],
        shape: annotation["shape"],
        // 上記以外にannotationにキーが存在すれば、それをdataのキー、値をdataの値として追加
        //@id, @type, label, shapeは除外
        ...Object.fromEntries(
          Object.entries(annotation).filter(
            ([key, value]) => !["@id", "@type", "label", "shape"].includes(key)
          )
        ),
        //もしthumbnailが存在する場合は、そのURLを取得
        ...(annotation.thumbnail && { thumbnail: annotation.thumbnail })
      },
      //現在のノードの位置情報を取得し、それを新しいノードの位置として設定

      position: position,
      // ノードの位置やスタイルに関するオプションがあればここに追加
    };
  });

  //既存のエッジデータを保持
  const existingEdges = cy.edges();

  //準備したノードデータを使用して、各ノードをcyに追加。もしすでにノードが存在する場合は上書きされる
  nodeData.forEach((node) => {
    //もしnode.idがすでに存在する場合は、そのノードを削除
    if (cy.getElementById(node.data["id"]).length > 0) {
      cy.getElementById(node.data["id"]).remove();
    }
    cy.add(node);
  });
  cy.add(existingEdges);
  cy.layout({ name: "preset" }).run();
});

const addNode = () => {
  if (detailType.value == "") {
    detailType.value = null;
  }

  if (prefixSelect.value && nodeType.value) {
    let completeID = prefixSelect.value + (nodeId.value || crypto.randomUUID());
    completeID = completeID.replace("manifest.json", "");

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

  if (prefixSelect.value && entityType.value) {
    let completeID =
      prefixSelect.value + (entityId.value || crypto.randomUUID());
    completeID = completeID.replace("manifest.json", "");

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

  showEntityDataModal.value = false;
  filteredEntityFields.value = [];
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
        /*
        ...Object.fromEntries(
        Object.entries(factoidData.value).map(([key, value]) => [key, value])
      ),*/
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
        /*
        ...Object.fromEntries(
        Object.entries(factoidData.value).map(([key, value]) => [key, value])
      ),*/
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
    deletingEntity.value = deletingEntityId.value;
    //annotation_resultから当該ノードを削除
    /*
    const newAnnotationResult = annotation_result.value.filter(
      (annotation) => annotation["@id"] !== deletingEntityId.value
    );
    annotation_result.value = newAnnotationResult;
    */
    deletingElement.value.remove(); // 選択された要素を削除;
    deletingElement.value = null;
  }
};

const editSelectedElement = () => {
  if (selectedNodes.value.length === 1) {
    const selectedNodeId = selectedNodes.value[0].id;
    const selectedNode = cy.getElementById(selectedNodeId);

    // 現在のノードデータを取得してeditableNodeDataに設定
    //editableNodeData.value = { ...selectedNode.data() };

    // 編集用モーダルを表示
    if (selectedNodes.value[0].shape === "factoid") {
      editedNodeType.value = selectedNode.data().type;
      editedLabelInput.value = selectedNode.data().label;
      Object.entries(selectedNode.data()).forEach(([key, value]) => {
        editableFactoidData.value[key] = value;
      });
      //モーダルを表示させる
      showEditNodeModal.value = true;
    } else if (selectedNodes.value[0].shape === "entity") {
      /*
      editedEntityType.value = selectedNode.data().type;
      editedLabelInput.value = selectedNode.data().label;
      Object.entries(selectedNode.data()).forEach(([key, value]) => {
        editableEntityData.value[key] = value;
      });
      //モーダルを開く
      showEditEntityModal.value = true;
      */
     alert("Please Edit Entity on the Image"); 
    }
  } else if (selectedEdges.value.length === 1) {
    const selectedEdgeId = selectedEdges.value[0].id;
    const selectedEdge = cy.getElementById(selectedEdgeId);

    // 現在のノードデータを取得してeditableNodeDataに設定
    editableNodeData.value = { ...selectedEdge.data() };
    showEditEdgeModal.value = true;
  } else {
    alert("編集するプロパティを選択してください");
  }
};

const updateNodes = () => {
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

  /*
  //console.log(annotation_result.value);
  const newAnnotationResult = annotation_result.value.filter(
    (annotation) => annotation["@id"] !== editableEntityData.value.id
  );
  console.log(newAnnotationResult);
  */

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
      node.data("@"+key, editedEntityType.value);
    } else if (key === "label") {
      node.data(key, editedLabelInput.value);
    } else if (key === "id") {
      node.data("@"+key, value);
    } else {
      node.data(key, value);
    }
  });

  /*
  console.log(node.data());
  newAnnotationResult.push(node.data());
  annotation_result.value = newAnnotationResult;
  */

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
      //id: node.id(),
      id: node.data("wholeID"),
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

  const edges = cy.edges().map((edge) => {
    const edgeData = {
      id: edge.id(),
      type: edge.data("type"),
      source: edge.data("source"),
      target: edge.data("target"),
    };
    // node.dataに含まれるすべてのキーについて反復処理を行う
    Object.entries(edge.data()).forEach(([key, value]) => {
      // 値がnullでない場合、それをedgeDataに追加する
      //if (value != null) {
      if (value != "" && value != null) {
        edgeData[key] = value;
      }
    });
    return edgeData;
  });

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
    //curations,
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
//function convertToTurtle(nodes, edges, curations) {
function convertToTurtle(nodes, edges) {
  let turtleData =
    "@prefix : <https://junjun7613.github.io/MicroKnowledge/himiko.owl#> .\n"; // ベースURIを定義
  //存在するprefixを記述
  turtleData +=
    "@prefix class: <https://junjun7613.github.io/MicroKnowledge/class/> .\n";
  turtleData +=
    "@prefix property: <https://junjun7613.github.io/MicroKnowledge/property/> .\n";
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
    if (node.correspondingText) {
      properties.push(
        `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTextualDescription> <${node.correspondingText}>`
      );
    }
    if (node.descriptionStart) {
      properties.push(
        `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#descriptionStart> <${node.descriptionStart}>`
      );
    }
    if (node.descriptionEnd) {
      properties.push(
        `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#descriptionEnd> <${node.descriptionEnd}>`
      );
    }
    if (node.contentStateAPI) {
      properties.push(
        `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#contentStateAPI> <${node.contentStateAPI}>`
      );
    }

    // dataFieldsに基づいてノードの各プロパティを処理
    const processedModels = new Set();
    dataFields.value.forEach((field) => {
      if (!processedModels.has(field.model)) {
        const value = node[field.model];
        if (value != "" && value != null) {
          //const object = field.type === "uri" ? `<${value}>` : `"${value}"`; // 目的語の型に応じてフォーマット
          //properties.push(`  <${field.id}> ${object}`);
          if (field.type === "uri") {
            properties.push(`  <${field.id}> <${value}>`);
          } else if (field.type === "number") {
            properties.push(`  <${field.id}> ${Number(value)}`);
          } else {
            properties.push(`  <${field.id}> "${value}"`);
          }
        }
        processedModels.add(field.model);
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

  /*
  curations.forEach((curation) => {
    turtleData += `<${curation.id}> a <${curation.type}>`;
    const properties = [];

    properties.push(
      `  <https://junjun7613.github.io/MicroKnowledge/himiko.owl#contentStateAPI> <${curation.contentStateAPI}>`
    );

    console.log(curation);

    // dataFieldsに基づいてノードの各プロパティを処理
    const processedModels = new Set();
    dataFields.value.forEach((field) => {
      console.log(field);
      if (!processedModels.has(field.model)) {
        const value = curation[field.model];
        if (value != "" && value != null) {
          const object = field.type === "uri" ? `<${value}>` : `"${value}"`; // 目的語の型に応じてフォーマット
          properties.push(`  <${field.id}> ${object}`);
        }
        processedModels.add(field.model);
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
  */

  return turtleData;
}

//Turtleファイルのダウンロード
//function downloadTurtleFile(nodes, edges, curations) {
function downloadTurtleFile(nodes, edges) {
  console.log(nodes);
  //const turtleData = convertToTurtle(nodes, edges, curations);
  const turtleData = convertToTurtle(nodes, edges);
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
    console.log(node.data);
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
  //downloadTurtleFile(nodesData, edgesData, curationsData);
  downloadTurtleFile(nodesData, edgesData);
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
  //if (data.nodes || data.edges || data.curations) {
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
    /*
    const curations = data.curations.map((curation) => {
      const curationData = {
        id: curation.id,
        type: curation.type,
        // 他のすべてのプロパティを動的に追加
      };
      // nodeオブジェクトのすべてのキーに対してループ
      Object.entries(curation).forEach(([key, value]) => {
        // id, type, positionはすでに設定されているのでスキップ
        if (
          !["id", "type"].includes(key) &&
          value != null
        ) {
          curationData[key] = value;
        }
      });

      return curationData;
    });
    */

    cy.add(nodes);
    cy.add(edges);
    //curationURIsに値を入れる際に、annotation_resultの記法に合わせる
    //curationURIs.value = curations;
    curationURIs.value = nodes;
    //annotation_result.value = curations;
    for (const node of data.nodes) {
      data = {
        "@id": node.id,
        "@type": node.type,
        label: node.label,
      };
      Object.entries(node).forEach(([key, value]) => {
        // id, type, positionはすでに設定されているのでスキップ
        if (
          !["id", "type", "position", "label"].includes(key) &&
          value != null
        ) {
          data[key] = value;
        }
      });
      annotation_result.value.push(data);
    }
    //annotation_result.value = data.nodes;
    cy.layout({ name: "preset" }).run(); // レイアウトを更新

    console.log(nodes);

    uploadedNodes.value = nodes;
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
const handleCurationTypeSelectFileUpload = (event) =>
  handleFileUpload(event, "CurationTypeSelect");
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
      colorMatches.value = data["data"];
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
    case "CurationTypeSelect":
      curation_type_select.value = data["data"];
      break;
    case "EntityRelationSelect":
      entityRelationSelect.value = data["data"];
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
          attachedType: item["attachedType"],
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
    case "CurationData":
      curation_data.value = data["data"];
      updateDataFields();
      break;
  }
};

const updateDataFields = () => {
  dataFields.value = [
    ...entityFields.value,
    ...nodeFields.value,
    ...curationFields.value,
  ];
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

//ノードとテクスト領域をリンクする処理
const relateText = () => {
  const selectedNodes_ = selectedNodes.value;

  if (selectedNodes_.length === 1) {
    const selectedNode = selectedNodes_[0];

    let nodeId = selectedNode.id;

    let node = cy.getElementById(nodeId);
    node.data("descriptionStart", startToEndList.value[0]);
    node.data("descriptionEnd", startToEndList.value[1]);
  }
};

const createEntityDataModal = () => {
  const entityTypeValue = entityType.value;
  const newEntityFields = [];
  console.log(entityFields.value);
  for (const field of entityFields.value) {
    //console.log(field)
    //if (field.attachedType == entityTypeValue){
    if (field.attachedType.includes(entityTypeValue)) {
      newEntityFields.push(field);
    }
  }
  console.log(newEntityFields);
  filteredEntityFields.value = newEntityFields;
  showEntityModal.value = false;
  showEntityDataModal.value = true;
};

const backToEntityDialog = () => {
  showEntityDataModal.value = false;
  showEntityModal.value = true;
};

// その他の関数
</script>
<style>
.mainSearch {
  /*background: url("../assets/img/colosseo.jpeg");*/
  background-size: cover;
  background-position: center;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.searchTitle {
  color: grey;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
}
.selectTheme {
  color: grey;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 20px;
}
.searchField {
  width: 700px;
  padding-top: 3px; /* 上のパディングを減らす */
  padding-bottom: 3px; /* 下のパディングを減らす */
  height: 40px;
}
.searchBtn {
  position: relative;
}
.articles {
  display: flex;
  flex-wrap: wrap; /* 複数行になる場合は折り返しを許可 */
  justify-content: space-between; /* 均等に配置 */
}

.article {
  width: calc(
    33.333% - 10px
  ); /* 3列なので33.333%、間のマージンを考慮して引く */
  margin-bottom: 20px; /* 下マージン */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 影を追加 */
  padding: 20px; /* パディング */
  background-color: white; /* 背景色 */
  /* 他のスタイリング（フォントサイズ、色など）もここで追加 */
}

/* レスポンシブ対応: 小さな画面で1列に */
@media (max-width: 600px) {
  .article {
    width: 100%;
  }
}
.article-thumbnail {
  width: 100%; /* 画像の幅を記事の幅に合わせる */
  height: auto; /* 高さを自動調整してアスペクト比を維持 */
  margin-bottom: 15px; /* タイトルとの間隔 */
}
.mySwiper .swiper-slide {
  /* 通常のスライドのスタイル */
  opacity: 0.5;
  transform: scale(0.7);
  z-index: 1;
}

.mySwiper .swiper-slide-active {
  /* 中央およびその隣のスライドのスタイル */
  opacity: 1;
  transform: scale(1);
  z-index: 3;
}

.mySwiper .swiper-slide-next,
.mySwiper .swiper-slide-prev {
  opacity: 0.8;
  transform: scale(0.85);
  z-index: 2;
}

.slide {
  /* スライドの幅を設定 */
  width: 200px;
}

.card {
  /* カードのスタイル */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: white;
  height: 300px;
  width: 300px;
  /* カードサイズ等、その他のスタイル */
}

.card-thumbnail {
  width: 100%;
  height: auto;
  margin-bottom: 15px;
}
.swipeCardTitle {
  text-align: center;
}

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

.input-title {
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
