<template>
    <v-container class="main">
      <div>
        <!--<button @click="createCircle">円を作成</button>-->
        <div><button @click="showCreateCircleModal">円を作成</button></div>
        <div><button @click="toggleDrawMode">
          {{ drawMode ? '線を引くモード' : '線を引かないモード' }}
        </button></div>
        <div><button @click="deleteSelectedItem" v-if="selectedItem">削除</button></div>
      </div>

      <!-- モーダル -->
      <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <h3>円の作成</h3>
        <input v-model="newCircleId" placeholder="IDを入力">
        <input v-model="newCircleType" placeholder="タイプを入力">
        <div><button @click="createCircle">作成</button></div>
        <div><button @click="isModalVisible = false">キャンセル</button></div>
      </div>
    </div>

      <div id="container">
        <svg width="400" height="400" viewBox="0 0 400 400" style="background-color: #FFF;"
             @mousemove="onDrag"
             @mouseup="stopDrag"
             @mouseleave="stopDrag">
             <defs>
              <marker id="arrowhead" markerWidth="5" markerHeight="3.5" 
                  refX="0" refY="1.75" orient="auto">
            <polygon points="0 0, 5 1.75, 0 3.5" fill="#008080" />
          </marker>
        </defs>
          <!-- 動的に生成される円 -->
          <g v-for="circle in circles" :key="circle.id">
          <circle v-for="circle in circles" :key="circle.id"
                  :cx="circle.x" :cy="circle.y" r="10"
                  stroke="black" stroke-width="2" :fill="getColor(circle.type)"
                  @mousedown="startDrag(circle, $event)"
                  @click="selectItem(circle, 'circle')"/>
                  <!--<text :x="circle.x" :y="circle.y" text-anchor="middle" dominant-baseline="central" fill="white">
            {{ circle.id }}
          </text>-->
                </g>
          <!-- 動的に生成される線 -->
          <line v-for="line in lines" :key="line.id"
              :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
              stroke="#008080" stroke-width="2"
              marker-end="url(#arrowhead)"
              @click="selectItem(line, 'line')"/>
        </svg>
      </div>
      <div v-if="selectedItem">
        選択されたアイテム: {{ selectedItem.id }}
        <input v-model="selectedItem.id" placeholder="IDを入力" />
        <input v-model="selectedItem.type" placeholder="タイプを入力" />
      </div>
      <p>{{selectedItem}}</p>
      <p>{{circles}}</p>
      <p>{{lines}}</p>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const circles = ref([]);
    const lines = ref([]);
    const selectedCircles = ref([]); // 選択された円を保持する配列
    const selectedItem = ref(null);
    const drawMode = ref(false); // 線を引くモードのフラグ
    const isDragging = ref(false);
    const selectedCircle = ref(null); // ドラッグ中の円
    const circleRadius = 20; // 円の半径
    const arrowSize = 5; // 矢印のサイズ（おおよその長さ）
    const isModalVisible = ref(false);

const newCircleId = ref('');
const newCircleType = ref('');

function showCreateCircleModal() {
  isModalVisible.value = true;
  newCircleId.value = '';
  newCircleType.value = '';
}
/*
  function createCircle() {
    const newCircle = {
      id: '',
      type: '', // デフォルトのタイプ
      x: Math.random() * 380 + 10,
      y: Math.random() * 380 + 10,
      color: '#000000'
    };
    circles.value.push(newCircle);
  }
  */

  function createCircle() {
  const newCircle = {
    id: newCircleId.value,
    type: newCircleType.value,
    shape: 'circle',
    //x: Math.random() * 380 + 10,
    //y: Math.random() * 380 + 10,
    color: getColor(newCircleType.value),
    radius: circleRadius
  };
  circles.value.push(newCircle);
  isModalVisible.value = false;
}

  function toggleDrawMode() {
    drawMode.value = !drawMode.value;
  }
  /*
  function selectItem(item, type) {
  selectedItem.value = item;
  if (type === 'circle' && drawMode.value) {
    if (selectedCircles.value.length < 2) {
      selectedCircles.value.push(item);
    }
    if (selectedCircles.value.length === 2) {
      // 選択された2つの円に基づいて線を作成
      const newLine = calculateLineCoordinates(selectedCircles.value[0], selectedCircles.value[1]);
      lines.value.push(newLine);
      selectedCircles.value = []; // 選択された円のリストをリセット
    }
  }
}
*/
function selectItem(item, type) {
  selectedItem.value = item;
  if (type === 'circle' && drawMode.value) {
    // 選択された円をselectedCircles配列に追加
    selectedCircles.value.push(item);

    // 2つの円が選択された場合、線を引く
    if (selectedCircles.value.length === 2) {
      const newLine = calculateLineCoordinates(selectedCircles.value[0], selectedCircles.value[1]);
      lines.value.push(newLine);
      selectedCircles.value = []; // 選択された円のリストをリセット
    }
  }
}

function calculateLineCoordinates(circle1, circle2) {
  const dx = circle2.x - circle1.x;
  const dy = circle2.y - circle1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const normX = dx / dist;
  const normY = dy / dist;

  // 線の終点を円の中心から矢印のサイズ分だけ外側に移動
  const adjustX = normX * (circleRadius + arrowSize);
  const adjustY = normY * (circleRadius + arrowSize);

  return {
    id: '',
    type: '',
    shape: 'line',
    sourceID: selectedCircles.value[0].id,
    targetID: selectedCircles.value[1].id,
    x1: circle1.x + normX * circleRadius,
    y1: circle1.y + normY * circleRadius,
    x2: circle2.x - adjustX,
    y2: circle2.y - adjustY
  };
}

function deleteSelectedItem() {
  if (selectedItem.value) {
    if (selectedItem.value.shape === 'circle') {
      circles.value = circles.value.filter(circle => circle !== selectedItem.value);
    } else if (selectedItem.value.shape === 'line') {
      lines.value = lines.value.filter(line => line !== selectedItem.value);
    }
    selectedItem.value = null;
  }
}

function getColor(type) {
  switch (type) {
    case 'Action': return 'red';
    case 'Contact': return 'blue';
    case 'Geo': return 'green';
    // その他のタイプに対する色を追加可能
    default: return 'black';
  }
}
  
  function updateLinePositions(movedCircle) {
    lines.value.forEach(line => {
      if (line.x1 === movedCircle.oldX && line.y1 === movedCircle.oldY) {
        line.x1 = movedCircle.x;
        line.y1 = movedCircle.y;
      }
      if (line.x2 === movedCircle.oldX && line.y2 === movedCircle.oldY) {
        line.x2 = movedCircle.x;
        line.y2 = movedCircle.y;
      }
    });
  }
  
  function startDrag(circle, event) {
    selectedCircle.value = { ...circle, oldX: circle.x, oldY: circle.y };
    isDragging.value = true;
    event.preventDefault();
  }
  
  function onDrag(event) {
    if (isDragging.value && selectedCircle.value) {
      const svgRect = event.target.getBoundingClientRect();
      selectedCircle.value.x = event.clientX - svgRect.left;
      selectedCircle.value.y = event.clientY - svgRect.top;
      updateLinePositions(selectedCircle.value);
    }
  }
  
  function stopDrag() {
    isDragging.value = false;
    selectedCircle.value = null;
  }
  </script>

<style>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
</style>