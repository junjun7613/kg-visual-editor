<template>
  <v-container width="1200">
    <v-row>
      <v-col cols="12">
        <v-btn @click="showNodeModal = true">ファクトイドを追加</v-btn>
        <v-btn @click="showEntityModal = true">エンティティを追加</v-btn>
        <v-btn @click="showEdgeModal = true">エッジを追加</v-btn>
        <v-btn @click="deleteSelectedElement">削除</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="updateDB">データベースに登録</v-btn>
        <v-btn @click="downloadJson">JSONファイルをダウンロード</v-btn>
        <input type="file" id="jsonFileInput" style="display: none;" @change="handleGraphFileUpload">
        <v-btn @click="triggerGraphFileUpload">JSONファイルをアップロード</v-btn>
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
        <v-btn @click="triggerSettingFileUpload('Prefixes')">prefixを編集</v-btn>

        <input type="file" id="jsonNodeTypeSelectInput" style="display: none;" @change="handleNodeTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('NodeTypeSelect')">ファクトイドのタイプを編集</v-btn>

        <input type="file" id="jsonEntityTypeSelectInput" style="display: none;"
          @change="handleEntityTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('EntityTypeSelect')">エンティティのタイプを編集</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <input type="file" id="jsonColorsInput" style="display: none;" @change="handleColorsFileUpload">
        <v-btn @click="triggerSettingFileUpload('Colors')">配色を編集</v-btn>

        <input type="file" id="jsonEdgeTypeSelectInput" style="display: none;" @change="handleEdgeTypeSelectFileUpload">
        <v-btn @click="triggerSettingFileUpload('EdgeTypeSelect')">エッジのタイプを編集</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="showGraphData">グラフデータを表示</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div v-if="graphData">
          <h3>グラフデータ</h3>
          <pre>{{ graphData }}</pre>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- ノード作成用モーダル -->
  <v-dialog v-model="showNodeModal" persistent max-width="600px">
    <v-card height="600px">
      <v-card-title>ファクトイドの作成</v-card-title>
      <v-card-text>
        <div>
          <h3>ID情報を入力</h3>
          <treeselect :multiple="false" :options="prefixes" placeholder="Prefix" v-model="prefixSelect" class="mb-4" />
          <v-text-field v-model="nodeId" label="Core ID" required></v-text-field>
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
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showNodeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="addNode">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エンティティ作成用モーダル -->
  <v-dialog v-model="showEntityModal" persistent max-width="600px">
    <v-card height="600px">
      <v-card-title>エンティティの作成</v-card-title>
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
        <treeselect :multiple="false" :options="edgeTypeSelect" placeholder="Select property type" v-model="edgeType"
          class="mb-4" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEdgeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
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
  defaultEdgeTypeSelect
} from "~/utils/annotation/misc";
import { createPopper } from '@popperjs/core';

const prefixes = ref(defaultPrefixes);
const colors = ref(defaultColors);
const nodeTypeSelect = ref(defaultNodeTypeSelect)
const entityTypeSelect = ref(defaultEntityTypeSelect)
const edgeTypeSelect = ref(defaultEdgeTypeSelect)

const cyElement = ref(null);
let cy = null;
const selectedElement = ref(null);
const deletingElement = ref(null);
const selectedNodes = ref([]);
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
const popperElement = ref(null)
//const nodeTypeSelect = ref(null)

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
      }
    ],
    layout: {
      name: 'preset'
    }
  });

  cy.on('click', 'node, edge', (event) => {
    const node = event.target;
    const nodeId = node.id();

    deletingElement.value = event.target;

    if (selectedNodes.value.includes(nodeId)) {
      // ノードがすでに選択されている場合は削除
      selectedNodes.value = selectedNodes.value.filter(id => id !== nodeId);
      node.removeClass('selected');
    } else {
      // 新しいノードを選択する
      if (selectedNodes.value.length >= 2) {
        const removedNodeId = selectedNodes.value.shift(); // 最初の選択を削除
        cy.getElementById(removedNodeId).removeClass('selected');
      }
      selectedNodes.value.push(nodeId);
      node.addClass('selected');
    }
  });

  cy.on('mouseover', 'node, edge', (event) => {
    const ele = event.target;

    selectedElement.value = {
      id: ele.data('id'),
      type: ele.data('type'),
      shape: ele.data('shape'),
      label: ele.data('label')
    };

    //任意の入力項目について、存在すればselectedElementに格納、なければNo ---を代入
    if (ele.data('role')) {
      selectedElement.value.role = ele.data('role')
    } else {
      selectedElement.value.role = "No Role"
    };
    if (ele.data('detailType')) {
      selectedElement.value.detailType = ele.data('detailType')
    } else {
      selectedElement.value.detailType = "No Detail Type"
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
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Role:</h5> ${nodeData.role}<br><h5>Label:</h5> ${nodeData.label}`;
    } else {
      popperElement.value.innerHTML = `<h5>ID:</h5> ${completeID}<br><h5>Type:</h5> ${completeType}<br><h5>Detail Type:</h5> ${nodeData.detailType}<br><h5>Label:</h5> ${nodeData.label}`;
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
    placement: 'top',  // 好みに応じて変更
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [60, -50], // 1つ目の値は水平方向のオフセット、2つ目の値は垂直方向のオフセット
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

  if (labelInput.value && prefixSelect.value && nodeId.value && nodeType.value) {
    const completeID = prefixSelect.value + nodeId.value

    const nodeData = {
      id: completeID,
      type: nodeType.value,
      shape: 'factoid',
      label: labelInput.value
    }

    if (detailType.value != null) {
      nodeData.detailType = detailType.value;
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
  } else if (labelInput.value && prefixSelect.value && nodeType.value) {
    const completeID = prefixSelect.value + crypto.randomUUID();

    const nodeData = {
      id: completeID,
      type: nodeType.value,
      shape: 'factoid',
      label: labelInput.value
    }

    if (detailType.value != null) {
      nodeData.detailType = detailType.value;
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

  if (labelInput.value && prefixSelect.value && entityId.value && entityType.value) {
    const completeID = prefixSelect.value + entityId.value

    const nodeData = {
      id: completeID,
      type: entityType.value,
      shape: 'entity',
      label: labelInput.value
    };

    if (roleInput.value != null) {
      nodeData.role = roleInput.value;
    }

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
    showEntityModal.value = false;
  } else if (labelInput.value && prefixSelect.value && entityType.value) {
    const completeID = prefixSelect.value + crypto.randomUUID();

    const nodeData = {
      id: completeID,
      type: entityType.value,
      shape: 'entity',
      label: labelInput.value
    };

    if (roleInput.value != null) {
      nodeData.role = roleInput.value;
    }

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
        id: edgeId.value,
        type: edgeType.value,
        source: selectedNodes.value[0],
        target: selectedNodes.value[1]
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

const downloadJson = () => {
  const nodes = cy.nodes().map(node => {
  const nodeData = {
    //group: 'nodes', // ノードのグループを指定
    //data: {
      id: node.id(),
      type: node.data('type'),
      shape: node.data('shape'),
      label: node.data('label'),
    //},
    position: {
      x: node.position('x'), // JSONデータからのX座標
      y: node.position('y')  // JSONデータからのY座標
    }
  };

  if (node.data('role') != null) {
    nodeData.role = node.data('role');
  }
  if (node.data('detailType') != null) {
    nodeData.detailType = node.data('detailType');
  }

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
        ...(node.detailType != null && { detailType: node.detailType })
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
</style>