<template>
  <v-container width="1200">
    <v-row>
      <v-col cols="12">
        <v-btn @click="showNodeModal = true" class="ml-2 mt-2">ノードを追加</v-btn>
        <v-btn @click="showEntityModal = true" class="ml-2 mt-2">エンティティを追加</v-btn>
        <v-btn @click="showEdgeModal = true" class="ml-2 mt-2">エッジを追加</v-btn>
        <v-btn @click="editSelectedElement" class="ml-2 mt-2" color="blue">更新</v-btn>
        <v-btn @click="deleteSelectedElement" class="ml-2 mt-2" color="red">削除</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <!--<v-btn @click="updateDB">データベースに登録</v-btn>-->
        <v-btn @click="downloadJson" class="ml-2 mt-2">JSONファイルをダウンロード</v-btn>
        <v-btn @click="downloadTurtle" class="ml-2 mt-2">Turtleファイルをダウンロード</v-btn>
        <input type="file" id="jsonFileInput" style="display: none;" @change="handleGraphFileUpload">
        <v-btn @click="triggerGraphFileUpload" class="ml-2 mt-2">JSONファイルをアップロード</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div id="cy" ref="cyElement" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>
      </v-col>
      <v-col cols="6">
        <!-- ここにテキストや画像を配置 -->
        <div>
          <ImageTextDrop />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!--<p>{{ selectedElement }}</p>-->
      <!--<p>{{ selectedNodes }}</p>-->
    </v-row>
    <v-row>
      <v-col>
        <input type="file" id="jsonPrefixesInput" style="display: none;" @change="handlePrefixesFileUpload">
        <v-btn @click="triggerSettingFileUpload('Prefixes')" class="ml-2 mt-2">prefixを編集</v-btn>

        <input type="file" id="jsonNodeTypeSelectInput" style="display: none;" @change="handleNodeTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('NodeTypeSelect')" class="ml-2 mt-2">ノードのタイプを編集</v-btn>

        <input type="file" id="jsonEntityTypeSelectInput" style="display: none;"
          @change="handleEntityTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('EntityTypeSelect')" class="ml-2 mt-2">エンティティのタイプを編集</v-btn>

        <input type="file" id="jsonEdgeTypeSelectInput" style="display: none;" @change="handleEdgeTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('EdgeTypeSelect')" class="ml-2 mt-2">エッジのタイプを編集</v-btn>

        <input type="file" id="jsonColorsInput" style="display: none;" @change="handleColorsFileUpload">
        <v-btn @click="triggerSettingFileUpload('Colors')" class="ml-2 mt-2">配色を編集</v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col>
        <v-btn @click="showGraphData" class="ml-2">グラフデータを表示</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div v-if="graphData" class="graph-container">
          <h3>グラフデータ</h3>
          <pre>{{ graphData }}</pre>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- ノード作成用モーダル -->
  <v-dialog v-model="showNodeModal" persistent max-width="1000px" max-height="600px">
    <v-card>
      <v-card-title>ノードの作成</v-card-title>
      <v-row>
      <v-col sm="6">
      <v-card-text>
        <div>
          <h3>ID情報を入力</h3>
          <treeselect :multiple="false" :options="prefixes" placeholder="Prefix" v-model="prefixSelect" class="mb-4" />
          <v-text-field v-model="nodeId" label="ID(何も入力しなければUUID)" required></v-text-field>
        </div>
        <div>
          <h3>タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <treeselect :multiple="false" :options="nodeTypeSelect" placeholder="Factoid type..." v-model="nodeType"
            class="mb-4" />
        </div>
        <div>
          <h3>詳細タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="detailType" label="Detail type..." required></v-text-field>
        </div>
        <div>
          <h3>ラベルを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="labelInput" label="Label..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
    <v-col sm="6">
      <v-card-text>
        <div>
          <h3>典拠資料</h3>
          <v-text-field v-model="sourceCitation" label="Source citation (String)" required></v-text-field>
          <v-text-field v-model="sourceURI" label="Source URI" required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
  </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showNodeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="addNode">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エンティティ作成用モーダル -->
  <v-dialog v-model="showEntityModal" persistent max-width="1000px" max-height="600px">
    <v-card>
      <v-card-title>エンティティの作成</v-card-title>
      <v-row>
      <v-col sm="6">
      <v-card-text>
        <div>
          <h3>IDを入力</h3>
          <treeselect :multiple="false" :options="prefixes" placeholder="Prefix" v-model="prefixSelect" class="mb-4" />
          <v-text-field v-model="entityId" label="Core ID" required></v-text-field>
        </div>
        <div>
          <h3>タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <treeselect :multiple="false" :options="entityTypeSelect" placeholder="Entity type..." v-model="entityType"
            class="mb-4" />
        </div>
        <div>
          <h3>役割を入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="roleInput" label="Roles..." required></v-text-field>
        </div>
        <div>
          <h3>ラベルを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="labelInput" label="Label..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
    <v-col sm="6">
      <v-card-text>
        <div>
          <h3>外部データURIを入力</h3>
          <v-text-field v-model="referencedEntity" label="Entity URI..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
  </v-row>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEntityModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="addEntity">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エッジ作成用モーダル -->
  <v-dialog v-model="showEdgeModal" persistent max-width="600px">
    <v-card height="600px">
      <v-card-title>エッジの作成</v-card-title>
      <v-card-text>
        <v-text-field v-model="edgeId" label="エッジID" required></v-text-field>
        <!--<v-text-field v-model="edgeType" label="エッジタイプ" required></v-text-field>-->
        <div v-if="selectedNodes.length === 2 && selectedNodes[0].shape === 'factoid' && selectedNodes[1].shape === 'factoid'">
        <treeselect :multiple="false" :options="factoidRelationSelect" placeholder="Select property type" v-model="edgeType"
          class="mb-4" />
        </div>
        <div v-else>
        <treeselect :multiple="false" :options="edgeTypeSelect" placeholder="Select property type" v-model="edgeType"
          class="mb-4" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEdgeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--ノード編集用モーダル-->
  <v-dialog v-model="showEditNodeModal">
    <v-card>
      <v-card-title>ノードの編集</v-card-title>
      <v-row>
      <v-col sm="6">
      <v-card-text>
        <div>
          <h3>タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <treeselect :multiple="false" :options="nodeTypeSelect" placeholder="Factoid type..." v-model="editedNodeType"
            class="mb-4" />
        </div>
        <div>
          <h3>詳細タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="editedDetailType" label="Detail type..." required></v-text-field>
        </div>
        <div>
          <h3>ラベルを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="editedLabelInput" label="Label..." required></v-text-field>
        </div>
      </v-card-text>
      </v-col>
      <v-col sm="6"></v-col>
    </v-row>
      <v-card-actions>
        <v-btn @click="updateNodes">更新</v-btn>
        <v-btn @click="showEditNodeModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--エンティティ編集用モーダル-->
  <v-dialog v-model="showEditEntityModal">
    <v-card>
      <v-card-title>エンティティの編集</v-card-title>
      <v-row>
      <v-col sm="6">
      <v-card-text>
        <div>
          <h3>タイプを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <treeselect :multiple="false" :options="entityTypeSelect" placeholder="Entity type..." v-model="editedEntityType"
            class="mb-4" />
        </div>
        <div>
          <h3>役割を入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="editedRoleInput" label="Roles..." required></v-text-field>
        </div>
        <div>
          <h3>ラベルを入力</h3>
          <!--<v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>-->
          <v-text-field v-model="editedLabelInput" label="Label..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
    <v-col sm="6">
      <v-card-text>
        <div>
          <h3>外部データURIを入力</h3>
          <v-text-field v-model="editedReferencedEntity" label="Entity URI..." required></v-text-field>
        </div>
      </v-card-text>
    </v-col>
  </v-row>
      <v-card-actions>
        <v-btn @click="updateEntities">更新</v-btn>
        <v-btn @click="showEditEntityModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--エッジ編集用モーダル-->
  <v-dialog v-model="showEditEdgeModal">
    <v-card>
      <v-card-title>プロパティの編集</v-card-title>
      <v-card-text>
        {{editableNodeData}}
      </v-card-text>
      <v-card-actions>
        <v-btn>更新</v-btn>
        <v-btn @click="showEditEdgeModal = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import ImageDrop from '@/components/ImageTextDrop.vue';
import { ref } from 'vue';
import cytoscape from 'cytoscape';
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import {
  defaultPrefixes,
  defaultColors,
  defaultNodeTypeSelect,
  defaultEntityTypeSelect,
  defaultEdgeTypeSelect,
  defaultFactoidRelationSelect
} from "~/utils/annotation/misc";
import { createPopper } from '@popperjs/core';

const prefixes = ref(defaultPrefixes);
const colors = ref(defaultColors);
const nodeTypeSelect = ref(defaultNodeTypeSelect)
const entityTypeSelect = ref(defaultEntityTypeSelect)
const edgeTypeSelect = ref(defaultEdgeTypeSelect)
const factoidRelationSelect = ref(defaultFactoidRelationSelect)

const cyElement = ref(null);
let cy = null;
const selectedElement = ref(null);
const deletingElement = ref(null);
const selectedNodes = ref([]);
const selectedEdges = ref([]);
const showNodeModal = ref(false);
const showEntityModal = ref(false);
const showEdgeModal = ref(false);
const prefixSelect = ref(null)
const nodeId = ref(null);
const nodeType = ref(null);
const entityId = ref(null);
const entityType = ref(null);
const edgeId = ref(null);
const edgeType = ref(null);
const labelInput = ref(null)
const roleInput = ref(null)
const detailType = ref(null)
const referencedEntity = ref(null)
const popperElement = ref(null)
//const nodeTypeSelect = ref(null)
const showEditNodeModal = ref(false); // モーダル表示用のref
const showEditEntityModal = ref(false); // モーダル表示用のref
const showEditEdgeModal = ref(false); // モーダル表示用のref
const editableNodeData = ref({}); // 編集するノードのデータを格納するref

const editedNodeType = ref(null);
const editedDetailType = ref(null);
const editedLabelInput = ref(null);
const editedEntityType = ref(null);
const editedRoleInput = ref(null);
const editedReferencedEntity = ref(null);

const graphData = ref(null);

onMounted(() => {
  cy = cytoscape({
    container: cyElement.value,
    elements: [],
    style: [
      {
        selector: 'node[shape="factoid"]',
        style: {
          'shape': 'round-rectangle', // 角なし四角形
          'background-color': (ele) => {
            // ノードの type データに基づいて色を返す
            const type = ele.data('type');
            return colors.value[type] || '#666';  // 色が定義されていない場合のデフォルト値
          },
          'label': (ele) => {
            //ID(URL)をスラッシュで分割し、最後の要素を取得
            //const id = ele.data('id');
            //const parts = id.split('/');
            //return parts[parts.length - 1];
            if (ele.data('detailType')) {
              return ele.data('detailType');
            } else {
              //ID(URL)をスラッシュで分割し、最後の要素を取得
              const id = ele.data('type');
              const parts = id.split('');
              return parts[parts.length - 1];
            };
          },
          'width': 70,  // 幅を50ピクセルに設定
          'height': 50  // 高さを50ピクセルに設定
        }
      },
      {
        selector: 'node[shape="entity"]',
        style: {
          'shape': 'ellipse', // 円
          'background-color': (ele) => {
            // ノードの type データに基づいて色を返す
            const type = ele.data('type');
            return colors.value[type] || '#666';  // 色が定義されていない場合のデフォルト値
          },
          'label': (ele) => {
            //ID(URL)をスラッシュで分割し、最後の要素を取得
            //const id = ele.data('id');
            //const parts = id.split('/');
            //return parts[parts.length - 1];
            return ele.data('label');
          }
        }
      },
      {
        selector: 'node.selected', // 選択されたノード用のスタイル
        style: {
          //'background-color': 'blue',
          'border-width': 3,  // 輪郭線の太さ
          'border-color': '#FFD700'  // 輪郭線の色、ここでは金色を使用
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle-tee', // エッジの矢印の形状を設定
          'curve-style': 'bezier',
          'label': (ele) => {
            //ID(URL)をスラッシュで分割し、最後の要素を取得
            const id = ele.data('type');
            const parts = id.split('#');
            return parts[parts.length - 1];
          },
          'text-rotation': 'autorotate', // ラベルの回転を自動調整
          'text-margin-y': -10
        }
      },
      {
    selector: 'edge.selected',
    style: {
      'line-color': '#FFD700',
      'target-arrow-color': '#FFD700',
      'width': 4 // 選択されたときのエッジの太さ
    }
  }
    ],
    layout: {
      name: 'preset'
    }
  });

  //cy.on('click', 'node, edge', (event) => {
cy.on('click', 'node', (event) => {
  const node = event.target;
  const nodeId = node.id();
  const nodeShape = node.data('shape') || 'unknown'; // shapeがない場合は'unknown'を使用

  deletingElement.value = event.target;

  // selectedNodesに現在のノードが含まれているかチェック
  const nodeIndex = selectedNodes.value.findIndex(n => n.id === nodeId);

  if (nodeIndex !== -1) {
    // ノードがすでに選択されている場合は削除
    selectedNodes.value.splice(nodeIndex, 1);
    node.removeClass('selected');
  } else {
    // 新しいノードを選択する
    if (selectedNodes.value.length >= 2) {
      // 最初の選択を削除
      const removedNode = selectedNodes.value.shift();
      cy.getElementById(removedNode.id).removeClass('selected');
    }
    selectedNodes.value.push({ id: nodeId, shape: nodeShape });
    node.addClass('selected');
  }
});

cy.on('click', 'edge', (event) => {
  const edge = event.target;
  const edgeId = edge.id();

  deletingElement.value = event.target;

  // 選択されているエッジを探す
  const edgeIndex = selectedEdges.value.findIndex(e => e.id === edgeId);

  if (edgeIndex !== -1) {
    // エッジがすでに選択されている場合は選択を解除
    selectedEdges.value.splice(edgeIndex, 1);
    edge.removeClass('selected');
  } else {
    // 新しいエッジを選択
    selectedEdges.value.push({ id: edgeId });
    edge.addClass('selected');
  }
});

  cy.on('mouseover', 'node', (event) => {
    const ele = event.target;

    selectedElement.value = {
      id: ele.data('id'),
      type: ele.data('type'),
      shape: ele.data('shape'),
      //label: ele.data('label')
      ...(ele.data('label') && {label: ele.data('label')}),
      ...(ele.data('role') && {role: ele.data('role')}),
      ...(ele.data('detailType') && {detailType: ele.data('detailType')}),
      ...(ele.data('referencedEntity') && {referencedEntity: ele.data('referencedEntity')}),
    };

    handleMouseover(event, selectedElement.value)
    console.log(selectedElement.value)
  });

  cy.on('mouseover', 'edge', (event) => {
    const ele = event.target;

    selectedElement.value = {
      id: ele.data('id'),
      type: ele.data('type'),
    };

    handleMouseover(event, selectedElement.value)
    console.log(selectedElement.value)
  });

  // ホバーが外れたときのイベントハンドラ
  cy.on('mouseout', 'node, edge', () => {
    handleMouseout();
    selectedElement.value = null;
  });

});

// ポップアップのスタイル設定
const setPopperStyle = (popper) => {
  popper.style.background = '#fff';
  popper.style.border = '1px solid #ddd';
  popper.style.borderRadius = '4px';
  popper.style.boxShadow = '0 2px 5px 0 rgba(0, 0, 0, 0.2)';
  popper.style.padding = '10px';
  popper.style.fontSize = '14px';
  popper.style.color = '#333';
  popper.style.opacity = 1;
  popper.style.transition = 'opacity 0.3s';
};

// ノードにマウスオーバーしたときの処理
const handleMouseover = (event, nodeData) => {
  if (!popperElement.value) {
    const IDParts = nodeData.id.split('/')
    const completeID = IDParts[IDParts.length - 1]
    const TypeParts = nodeData.type.split('#')
    const completeType = TypeParts[TypeParts.length - 1]
    // ポップアップ要素がまだない場合は作成
    popperElement.value = document.createElement('div');
    setPopperStyle(popperElement.value);
    //popperElement.value.innerHTML = `ID: ${nodeData.id}<br>Type: ${nodeData.type}`;
    console.log(nodeData.shape)
    if (nodeData.shape == 'entity') {
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Role:</h5> ${nodeData.role}<br><h5>Label:</h5> ${nodeData.label}<br><h5>External URI:</h5> ${nodeData.referencedEntity}`;
    } else if (nodeData.shape == 'factoid') {
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Detail Type:</h5> ${nodeData.detailType}<br><h5>Label:</h5> ${nodeData.label}`;
    } else {
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}`;
    };
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
    placement: 'right',  // 好みに応じて変更
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, -20], // 1つ目の値は水平方向のオフセット、2つ目の値は垂直方向のオフセット
        }
      }
    ]
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
  const nodes = cy.nodes().map(node => {
    const nodeData = {
      id: node.id(),
      type: node.data('type'),
      shape: node.data('shape'),
      label: node.data('label')
    };

    if (node.data('role') != null) {
      nodeData.role = node.data('role');
    };
    if (node.data('detailType') != null) {
      nodeData.detailType = node.data('detailType');
    };
    if (node.data('referencedEntity') != null) {
      nodeData.referencedEntity = node.data('referencedEntity');
    };

    return nodeData;
  });

  const edges = cy.edges().map(edge => ({
    id: edge.id(),
    type: edge.data('type'),
    source: edge.data('source'),
    target: edge.data('target')
  }));

  graphData.value = {
    nodes,
    edges
  };
}

const addNode = () => {
  if (detailType.value == "") {
    detailType.value = null;
  };

  if (prefixSelect.value && nodeType.value) {
    const completeID = prefixSelect.value + (nodeId.value || crypto.randomUUID());

    const nodeData = {
      id: completeID,
      type: nodeType.value,
      shape: 'factoid',
      //label: labelInput.value,
      ...(labelInput.value && {label: labelInput.value}),
      ...(detailType.value && { detailType: detailType.value }), // オプショナルなプロパティ
    }
  
    cy.add({
      group: 'nodes',
      //data: { id: nodeId.value, type: nodeType.value, shape: 'factoid' },
      data: nodeData,
      position: { x: Math.random() * 800, y: Math.random() * 600 }
    });
    cy.layout({ name: 'preset' }).run(); // グラフのレイアウトを更新

    // モーダルの入力フィールドをクリア
    nodeId.value = null;
    nodeType.value = null;
    prefixSelect.value = null;
    labelInput.value = null;
    detailType.value = null;
    showNodeModal.value = false;
  } else {
    // 必要な場合はエラーメッセージを表示
    console.error('ノードID、タイプ、ラベルを入力してください。');
  }
};

const addEntity = () => {
  if (roleInput.value == "") {
    roleInput.value = null;
  };

  if (prefixSelect.value && entityType.value) {
    const completeID = prefixSelect.value + (entityId.value || crypto.randomUUID());

    const nodeData = {
      id: completeID,
      type: entityType.value,
      shape: 'entity',
      ...(labelInput.value && {label: labelInput.value}),
      ...(roleInput.value && {role: roleInput.value}),
      ...(referencedEntity.value && { referencedEntity: referencedEntity.value }),
    };

    cy.add({
      group: 'nodes',
      //data: { id: entityId.value, type: entityType.value, shape: 'entity' },
      data: nodeData,
      position: { x: Math.random() * 800, y: Math.random() * 600 }
    });
    cy.layout({ name: 'preset' }).run(); // グラフのレイアウトを更新

    // モーダルの入力フィールドをクリア
    entityId.value = null;
    entityType.value = null;
    prefixSelect.value = null;
    labelInput.value = null;
    roleInput.value = null;
    referencedEntity.value = null;
    showEntityModal.value = false;
  } else {
    // 必要な場合はエラーメッセージを表示
    console.error('ノードID、タイプ、ラベルを入力してください。');
  }
};

// エッジ作成用のメソッド
const createEdge = () => {
  if (selectedNodes.value.length === 2 && edgeId.value && edgeType.value) {
    //if (selectedNodes.length === 2) {
    cy.add({
      group: 'edges',
      data: {
        id: "https://junjun7613.github.io/MicroKnowledge/property/" + edgeId.value,
        type: edgeType.value,
        source: selectedNodes.value[0]['id'],
        target: selectedNodes.value[1]['id']
      }
    });
    edgeId.value = '';
    edgeType.value = '';
    showEdgeModal.value = false;
    selectedNodes.value = []; // 選択されたノードの配列をクリア
  } else if (selectedNodes.value.length === 2 && edgeType.value) {
    const completeID = "https://junjun7613.github.io/MicroKnowledge/property/" + crypto.randomUUID();
    cy.add({
      group: 'edges',
      data: {
        id: completeID,
        type: edgeType.value,
        source: selectedNodes.value[0]['id'],
        target: selectedNodes.value[1]['id']
      }
    });
    edgeId.value = '';
    edgeType.value = '';
    showEdgeModal.value = false;
    selectedNodes.value = []; // 選択されたノードの配列をクリア
  } else {
    console.error('2つのノードを選択し、エッジIDとタイプを入力してください。');
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
    console.log(selectedNode.data())
    // 現在のノードデータを取得してeditableNodeDataに設定
    editableNodeData.value = { ...selectedNode.data() };
    // 編集用モーダルを表示
    if (selectedNodes.value[0].shape === "factoid"){
      editedNodeType.value = selectedNode.data().type
      if (selectedNode.data().detailType) {
        editedDetailType.value = selectedNode.data().detailType
      }
      if (selectedNode.data().label) {
        editedLabelInput.value = selectedNode.data().label
      }
      //モーダルを表示させる
      showEditNodeModal.value = true;
    } else if (selectedNodes.value[0].shape === "entity") {
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
      //モーダルを開く
      showEditEntityModal.value = true;
    };
  } else if (selectedEdges.value.length === 1) {
    const selectedEdgeId = selectedEdges.value[0].id;
    const selectedEdge = cy.getElementById(selectedEdgeId);
    console.log(selectedEdge.data())
    // 現在のノードデータを取得してeditableNodeDataに設定
    editableNodeData.value = { ...selectedEdge.data() };
    showEditEdgeModal.value = true;
  } else {
    alert("編集するプロパティを選択してください");
  }
};

const updateNodes = () => {
  let nodeId = editableNodeData.value.id;
  let node = cy.getElementById(nodeId);

  // ノードのデータを更新
  node.data({
    type: editedNodeType.value,
    ...(editedDetailType.value && {detailType: editedDetailType.value}),
    ...(editedLabelInput.value && {label: editedLabelInput.value}),
    // その他の更新したいデータ
  });

  editableNodeData.value = {};
  editedNodeType.value = null;
  editedDetailType.value = null;
  editedLabelInput.value = null;
  showEditNodeModal.value = false;
};
const updateEntities = () => {
  let nodeId = editableNodeData.value.id;
  let node = cy.getElementById(nodeId);

  // ノードのデータを更新
  node.data({
    type: editedEntityType.value,
    ...(editedRoleInput.value && {role: editedRoleInput.value}),
    ...(editedLabelInput.value && {label: editedLabelInput.value}),
    ...(editedReferencedEntity.value && {referencedEntity: editedReferencedEntity.value}),
    // その他の更新したいデータ
  });

  editableNodeData.value = {};
  editedEntityType.value = null;
  editedRoleInput.value = null;
  editedLabelInput.value = null;
  editedReferencedEntity.value = null;
  showEditEntityModal.value = false;
};

const downloadJson = () => {
  const nodes = cy.nodes().map(node => {
  const nodeData = {
    //group: 'nodes', // ノードのグループを指定
    //data: {
      id: node.id(),
      type: node.data('type'),
      shape: node.data('shape'),
      ///label: node.data('label'),
      ...(node.data('label') && {label: node.data('label')}),
      ...(node.data('role') && {role: node.data('role')}),
      ...(node.data('detailType') && {detailType: node.data('detailType')}),
      ...(node.data('referencedEntity') && {referencedEntity: node.data('referencedEntity')}),
    //},
    position: {
      x: node.position('x'), // JSONデータからのX座標
      y: node.position('y')  // JSONデータからのY座標
    }
  };
  return nodeData;
});

  const edges = cy.edges().map(edge => ({
    id: edge.id(),
    type: edge.data('type'),
    source: edge.data('source'),
    target: edge.data('target')
  }));

  const graphData = {
    nodes,
    edges
  };
  const graphDataJson = JSON.stringify(graphData, null, 2);
  const blob = new Blob([graphDataJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'graph-data.json';
  a.click();
  URL.revokeObjectURL(url);
};

//Turtleへの変換
function convertToTurtle(nodes, edges) {
  let turtleData = '@prefix : <https://junjun7613.github.io/MicroKnowledge/himiko.owl#> .\n'; // ベースURIを定義
  //存在するprefixを記述
  prefixes.value.forEach(prefix => {
    turtleData += `@prefix ${prefix["label"]}: <${prefix["id"]}> .\n`;
  });

  turtleData += "\n";

  // ノードのデータをTurtle形式に変換
  nodes.forEach(node => {
    turtleData += `<${node.id}> a <${node.type}>`;
    const properties = [];
    if (node.label) {
      properties.push(`  :label "${node.label}"`);
    };
    if (node.detailType) {
      properties.push(`  :detailType "${node.detailType}"`);
    };
    if (node.role) {
      properties.push(`  :role "${node.role}"`);
    };
    if (node.referencedEntity) {
      properties.push(`  :referencesEntity "${node.referencedEntity}"`);
    };
    // 最初の述語の後にpropertiesがあればセミコロンを追加
    if (properties.length > 0) {
      turtleData += ';\n';
    }
    // 各プロパティをセミコロンで終わらせ、最後のプロパティにはピリオドを付ける
    properties.forEach((prop, index) => {
      if (index < properties.length - 1) {
        turtleData += prop + ';\n';
      } else {
        turtleData += prop + '.\n';
      }
    });

    // プロパティがない場合はピリオドを追加
    if (properties.length === 0) {
      turtleData += '.\n';
    };
  });
  // エッジのデータをTurtle形式に変換
  edges.forEach(edge => {
    turtleData += `<${edge.source}> <${edge.type}> <${edge.target}> .\n`;
  });

  return turtleData;
}

//Turtleファイルのダウンロード
function downloadTurtleFile(nodes, edges) {
  const turtleData = convertToTurtle(nodes, edges);
  const blob = new Blob([turtleData], { type: 'text/turtle' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'graph-data.ttl';
  a.click();
  URL.revokeObjectURL(url);
}

const downloadTurtle = () => {
  const nodesData = cy.nodes().map(node => ({
    id: node.id(),
    type: node.data('type'),
    ...(node.data('label') && {label: node.data('label')}),
    ...(node.data('role') && {role: node.data('role')}),
    ...(node.data('detailType') && {detailType: node.data('detailType')}),
    //},
  }));

  const edgesData = cy.edges().map(edge => ({
    source: edge.data('source'),
    target: edge.data('target'),
    type: edge.data('type')
  }));

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
        console.error('JSONファイルの読み込みエラー:', error);
      }
    };
    reader.readAsText(file);
  }
};

const triggerGraphFileUpload = () => {
  document.getElementById('jsonFileInput').click();
};

const loadGraphData = (data) => {
  cy.elements().remove(); // 現在のグラフデータを削除
  if (data.nodes || data.edges) {

    const nodes = data.nodes.map(node => ({
      group: 'nodes',
      data: {
        id: node.id,
        type: node.type,
        shape: node.shape,
        label: node.label,
        ...(node.role != null && { role: node.role }),
        ...(node.detailType != null && { detailType: node.detailType }),
        ...(node.referencedEntity != null && { referencedEntity: node.referencedEntity })
      },
      position: {
        x: node.position.x,
        y: node.position.y
      }
    }));

    const edges = data.edges.map(edge => ({
      group: 'edges',
      data: {
        id: edge.id,
        type: edge.type,
        source: edge.source,
        target: edge.target
      }
    }));

    cy.add(nodes);
    cy.add(edges);
    cy.layout({ name: 'preset' }).run(); // レイアウトを更新
  }
};

const triggerSettingFileUpload = (type) => {
  const inputId = `json${type}Input`; // 正しい ID 形式に修正
  //console.log(inputId);
  document.getElementById(inputId).click();
};

const handleColorsFileUpload = (event) => handleFileUpload(event, 'Colors');
const handlePrefixesFileUpload = (event) => handleFileUpload(event, 'Prefixes');
const handleNodeTypeSelectFileUpload = (event) => handleFileUpload(event, 'NodeTypeSelect');
const handleEntityTypeSelectFileUpload = (event) => handleFileUpload(event, 'EntityTypeSelect');
const handleEdgeTypeSelectFileUpload = (event) => handleFileUpload(event, 'EdgeTypeSelect');


const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      updateSettings(type, json);
    };
    reader.readAsText(file);
  }
};

const updateSettings = (type, data) => {
  switch (type) {
    case 'Colors':
      colors.value = data["data"];
      break;
    case 'Prefixes':
      prefixes.value = data["data"];
      break;
    case 'NodeTypeSelect':
      nodeTypeSelect.value = data["data"];
      break;
    case 'EntityTypeSelect':
      entityTypeSelect.value = data["data"];
      break;
    case 'EdgeTypeSelect':
      edgeTypeSelect.value = data["data"];
      break;
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
    width: 800px;
    max-height: 500px;
    overflow: auto; /* スクロール可能にする */
    border: 1px solid #ccc; /* 枠線を追加 */
    padding: 10px; /* 内容と枠線の間の余白 */
  }
</style>