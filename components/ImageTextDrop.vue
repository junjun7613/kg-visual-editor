<template>
  <div>
    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent class="drop-area">
      ここに画像ファイルまたはXMLファイルをドロップしてください
    </div>
    <div v-if="imageUrl">
      <!--<img :src="imageUrl" alt="アップロードされた画像" class="uploaded-image">-->
      <!-- OpenseaDragonビューアのコンテナ -->
      <div id="openseadragon-viewer"></div>
    </div>
    <!--<div v-if="xmlText">-->
    <div v-if="teiHTML">
      <!--<h3>XMLファイルのテキスト:</h3>-->
      <div class="tei-container">
        <!--{{ xmlText }}-->
        <div id="tei" v-html="teiHTML" />
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CETEI from "CETEIcean";
import OpenSeadragon from 'openseadragon';

const imageUrl = ref('');
//const xmlText = ref('');
const teiHTML = ref<string>("");
const viewer = ref<OpenSeadragon.Viewer | null>(null);

const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      const imageUrlValue = URL.createObjectURL(file);
      imageUrl.value = imageUrlValue;
      //xmlText.value = '';
      teiHTML.value = '';

      if (!viewer.value) {
        // OpenSeadragonビューアを初期化
        viewer.value = OpenSeadragon({
          id: "openseadragon-viewer",
          prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
          tileSources: {
            type: 'image',
            url: imageUrlValue
          }
        });
      } else {
        // 既存のビューアに新しい画像を読み込む
        viewer.value.open({
          type: 'image',
          url: imageUrlValue
        });
      }
    } else if (file.type === 'text/xml') {
      // XMLファイルの処理
      const reader = new FileReader();
      const CETEIcean = new CETEI();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        //xmlText.value = event.target?.result as string;
        const xmlContent = event.target?.result as string;
        /*
        CETEIcean.getHTML5(
          "https://raw.githubusercontent.com/TEIC/CETEIcean/master/test/testTEI.xml",
          function (data: HTMLElement) {
            teiHTML.value = data.outerHTML;
          }
        );*/
        CETEIcean.makeHTML5(xmlContent, (data: HTMLElement) => {
          teiHTML.value = data.outerHTML;
        })
      };
      reader.readAsText(file);
      imageUrl.value = '';
    } else {
      alert('画像ファイルまたはXMLファイルをドロップしてください。');
    }
  }
};

const parseXml = (xmlString: string) => {
  // XML解析の処理
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

#openseadragon-viewer {
    width: 530px;
    height: 500px;
  }

  .tei-container {
    width: 530px;
    max-height: 500px;
    overflow: auto; /* スクロール可能にする */
    border: 1px solid #ccc; /* 枠線を追加 */
    padding: 10px; /* 内容と枠線の間の余白 */
  }
</style>