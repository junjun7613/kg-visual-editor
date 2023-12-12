<template>
    <div>
      <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent
           class="drop-area">
        ここに画像ファイルまたはXMLファイルをドロップしてください
      </div>
      <div v-if="imageUrl">
        <img :src="imageUrl" alt="アップロードされた画像" class="uploaded-image">
      </div>
      <div v-if="xmlText">
        <h3>XMLファイルのテキスト:</h3>
        <p>{{ xmlText }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const imageUrl = ref('');
  const xmlText = ref('');
  
  const handleDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        imageUrl.value = URL.createObjectURL(file);
        xmlText.value = ''; // 画像を表示するときはXMLテキストをクリア
      } else if (file.type === 'text/xml') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          parseXml(content);
        };
        reader.readAsText(file);
        imageUrl.value = ''; // XMLを表示するときは画像をクリア
      } else {
        alert('画像ファイルまたはXMLファイルをドロップしてください。');
      }
    }
  };
  
  const parseXml = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const textElements = xmlDoc.getElementsByTagName('text');
    if (textElements.length > 0) {
      xmlText.value = textElements[0].textContent;
    } else {
      xmlText.value = 'テキストタグが見つかりませんでした。';
    }
  };
  </script>
  
  <style scoped>
  .drop-area {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .uploaded-image {
    max-width: 100%;
    height: auto;
  }
  </style>