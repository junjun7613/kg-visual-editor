<template>
    <v-container class="main">
      <div>
        <button @click="createCircle">円を作成</button>
        <button @click="toggleDrawMode">
          {{ drawMode ? '線を引くモード' : '線を引かないモード' }}
        </button>
      </div>
      <div id="container">
        <svg width="400" height="400" viewBox="0 0 400 400" style="background-color: #FFF;"
             @mousemove="onDrag"
             @mouseup="stopDrag"
             @mouseleave="stopDrag">
             <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
          <!-- 動的に生成される円 -->
          <circle v-for="circle in circles" :key="circle.id"
                  :cx="circle.x" :cy="circle.y" r="10"
                  stroke="black" stroke-width="2" :fill="circle.color"
                  @mousedown="startDrag(circle, $event)"
                  @click="selectItem(circle, 'circle')"/>
          <!-- 動的に生成される線 -->
          <line v-for="line in lines" :key="line.id"
              :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
              stroke="#008080" stroke-width="5"
              marker-end="url(#arrowhead)"
              @click="selectItem(line, 'line')"/>
        </svg>
      </div>
      <div v-if="selectedItem">
        選択されたアイテム: {{ selectedItem.id }}
        <input v-model="selectedItem.id" placeholder="IDを入力" />
        <input v-model="selectedItem.type" placeholder="タイプを入力" />
      </div>
      <p>{{selectedCircles}}</p>
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
  
  function createCircle() {
    const newCircle = {
      id: '',
      type: '',
      x: Math.random() * 380 + 10,
      y: Math.random() * 380 + 10,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    circles.value.push(newCircle);
  }
  
  function toggleDrawMode() {
    drawMode.value = !drawMode.value;
  }
  
  function selectItem(item, type) {
  selectedItem.value = item;
  if (type === 'circle' && drawMode.value) {
    if (selectedCircles.value.length < 2) {
      selectedCircles.value.push(item);
    }
    if (selectedCircles.value.length === 2) {
      // 選択された2つの円に基づいて線を作成
      const newLine = {
        id: '',
        type: '',
        x1: selectedCircles.value[0].x, // 最初に選択された円が始点
        y1: selectedCircles.value[0].y,
        sourceID: selectedCircles.value[0].id,
        targetID: selectedCircles.value[1].id,
        x2: selectedCircles.value[1].x, // 次に選択された円が終点
        y2: selectedCircles.value[1].y
      };
      lines.value.push(newLine);
      selectedCircles.value = []; // 選択された円のリストをリセット
    }
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