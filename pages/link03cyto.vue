<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="showNodeModal = true">ノードを追加</v-btn>
        <v-btn @click="showEdgeModal = true">エッジを追加</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="deleteSelectedElement">削除</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div id="cy" ref="cyElement" style="width: 800px; height: 600px; border: 1px solid #ccc;"></div>
      </v-col>
    </v-row>
    <p>{{selectedElement}}</p>
    <p>{{selectedNodes}}</p>
    <v-row>
      <v-col cols="12">
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
    <v-card>
      <v-card-title>ノードの作成</v-card-title>
      <v-card-text>
        <v-text-field v-model="nodeId" label="ノードID" required></v-text-field>
        <v-text-field v-model="nodeType" label="ノードタイプ" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showNodeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="addNode">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エッジ作成用モーダル -->
  <v-dialog v-model="showEdgeModal" persistent max-width="600px">
    <v-card>
      <v-card-title>エッジの作成</v-card-title>
      <v-card-text>
        <v-text-field v-model="edgeId" label="エッジID" required></v-text-field>
        <v-text-field v-model="edgeType" label="エッジタイプ" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="showEdgeModal = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="createEdge">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import cytoscape from 'cytoscape';

const cyElement = ref(null);
let cy = null;
const selectedElement = ref(null);
const deletingElement = ref(null);
const selectedNodes = ref([]);
const showNodeModal = ref(false);
const showEdgeModal = ref(false);
const nodeId = ref('');
const nodeType = ref('');
const edgeId = ref('');
const edgeType = ref('');

const graphData = ref(null);

const colors = {
  'Action': 'red',
  'Contact': 'blue'
};

onMounted(() => {
  cy = cytoscape({
    container: cyElement.value,
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': (ele) => {
        // ノードの type データに基づいて色を返す
        const type = ele.data('type');
        return colors[type] || '#666';  // 色が定義されていない場合のデフォルト値
      },
          'label': 'data(id)',
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
          'target-arrow-shape': 'triangle', // エッジの矢印の形状を設定
          'curve-style': 'bezier',
          'label': 'data(type)',
          'text-rotation': 'autorotate', // ラベルの回転を自動調整
          'text-margin-y': -10
        }
      }
    ],
    layout: {
      name: 'preset'
    }
  });

  cy.on('click', 'node', (event) => {
  const node = event.target;
  const nodeId = node.id();
  
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
      type: ele.data('type')
    };
    console.log(selectedElement.value)
  });

  // ホバーが外れたときのイベントハンドラ
  cy.on('mouseout', 'node, edge', () => {
    selectedElement.value = null;
  });

});

const showGraphData = () => {
  const nodes = cy.nodes().map(node => ({
    id: node.id(),
    type: node.data('type')
  }));

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
  if (nodeId.value && nodeType.value) {
    cy.add({
      group: 'nodes',
      data: { id: nodeId.value, type: nodeType.value },
      position: { x: Math.random() * 800, y: Math.random() * 600 }
    });
    cy.layout({ name: 'preset' }).run(); // グラフのレイアウトを更新

    // モーダルの入力フィールドをクリア
    nodeId.value = '';
    nodeType.value = '';
    showNodeModal.value = false;
  } else {
    // 必要な場合はエラーメッセージを表示
    console.error('ノードIDとタイプを入力してください。');
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

// その他の関数
</script>

<style scoped>
#cy {
  width: 800px;
  height: 600px;
}
</style>