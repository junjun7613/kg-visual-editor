<script lang="ts" setup>
import CETEI from "CETEIcean";
import { v4 as uuidv4 } from "uuid";

const { startToEndList,selectedNodeStartToEndList, clickedEntityObject, clickedNode, uploadedNodes } = useEditor();

const teiHTML = ref<string>("");
const text = ref("");

const textContainer = ref(null);
const startToEnd = ref([]);

const inputXMLUrl = ref(""); // ユーザーが入力するManifestのURL
const xml = ref("");

const linkingNodeElement = ref(false);

const elementId = ref("");
const elementText = ref("");

watch(uploadedNodes, () => {
  console.log(uploadedNodes.value);
  let uploadedXml = "";
  for (const node of uploadedNodes.value) {
    const data = node.data;
    for (const key in data) {
      if (key === "correspondingText" || key === "descriptionStart" || key === "descriptionEnd") {
        if (uploadedXml === "") {
          uploadedXml = data[key].split("#")[0];
        }
      }
    }
  };
  inputXMLUrl.value = uploadedXml;

  CETEIcean.getHTML5(inputXMLUrl.value, (data: HTMLElement) => {
    teiHTML.value = data.outerHTML;
  });

  const teiContainer = document.querySelector('.tei-container');
  if (teiContainer) {
    teiContainer.addEventListener('scroll', handleScroll);
  }
});

watch(selectedNodeStartToEndList, (newVal) => {
  if (newVal.length === 2) {
    highlightRange(newVal[0], newVal[1]);
  }
});

function getNodeAndOffset(root, offset) {
  const stack = [root];
  let charsCount = 0;

  while (stack.length) {
    const node = stack.pop();

    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharsCount = charsCount + node.textContent.length;

      if (offset <= nextCharsCount) {
        return { node, offset: offset - charsCount };
      }

      charsCount = nextCharsCount;
    } else {
      const children = Array.from(node.childNodes);
      children.reverse().forEach(child => stack.push(child));

    }
  }

  return null;
}

function highlightRange(start, end) {
  console.log(start, end);
  const existingHighlights = document.querySelectorAll('.highlight');
  existingHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      while (highlight.firstChild) {
        parent.insertBefore(highlight.firstChild, highlight);
      }
      parent.removeChild(highlight);
    }
  });
  //const container = document.body;
  const container = document.getElementById('tei');
  const range = document.createRange();
  const startNodeAndOffset = getNodeAndOffset(container, start);
  const endNodeAndOffset = getNodeAndOffset(container, end);
  console.log(startNodeAndOffset, endNodeAndOffset);

  if (startNodeAndOffset && endNodeAndOffset) {
    range.setStart(startNodeAndOffset.node, startNodeAndOffset.offset);
    range.setEnd(endNodeAndOffset.node, endNodeAndOffset.offset);

    const contents = range.extractContents();
    const highlight = document.createElement('span');
    highlight.classList.add('highlight'); // ハイライト用のクラスを追加
    highlight.appendChild(contents);

    //range.surroundContents(highlight);
    range.insertNode(highlight);
  }
}

function addCElementToXml(xmlString: string) {
  const convert = (xmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    // console.log(xmlDoc);
    return xmlDoc;
  };

  const xmlDoc = convert(xmlString);

  const namespaceURI = xmlDoc.documentElement.namespaceURI;

  const processTextNodes = (node: any, doc: XMLDocument) => {
    if (node.nodeType === 3) {
      const text = node.nodeValue as string;
      const parent = node.parentNode;
      const fragment = doc.createDocumentFragment();

      Array.from(text).forEach((char) => {
        if (char.trim().length > 0) {
          // 空白文字を除外
          const cid = uuidv4();
          // 名前空間を指定して<c>要素を作成
          const cElement = doc.createElementNS(namespaceURI, "c");
          cElement.setAttribute("xml:id", cid);
          cElement.textContent = char;
          fragment.appendChild(cElement);
        }
      });

      if (parent) {
        parent.replaceChild(fragment, node);
      }
    } else if (node.nodeType === 1) {
      // 要素ノードの場合、子ノードも処理
      Array.from(node.childNodes).forEach((child) =>
        processTextNodes(child, doc)
      );
    }
  };

  // XMLドキュメントのルートから処理開始
  // 特定の要素（ここでは最初のdiv要素）以下のノードのみを対象に処理を開始
  const bodyElement = xmlDoc.querySelector("text");
  if (bodyElement) {
    // processTextNodes(bodyElement);
    processTextNodes(bodyElement, xmlDoc);
  }

  // XMLSerializerを使用して文字列に戻す
  const serializer = new XMLSerializer();
  const serializedXML = serializer.serializeToString(xmlDoc);

  // wrapperタグを除去（必要な場合）
  // const finalXML = serializedXML.replace(/<\/?wrapper>/g, "");

  // return finalXML;

  return serializedXML;
}

const CETEIcean = new CETEI();
let behaviors = {
    "tei": {
      "persName": function(element) {
      // placeNameの内容をラップするspan要素を作成
      let span = document.createElement("span");
      span.className = "person-name-highlight";
      span.style.backgroundColor = "green"; // 背景色を緑に設定
      span.style.color = "white"; // テキストの色を白に設定
      // 元のエレメントの子ノードを新しいspanに移動
      while (element.firstChild) {
        span.appendChild(element.firstChild);
      }
      // クリックイベントを追加
      span.addEventListener("click", function() {
        console.log("[persName] " + element.textContent);
        elementText.value = "<persName>" + element.textContent + "</persName>";
        elementId.value = inputXMLUrl.value + "#" + element.textContent;
        //elementId.value = element.getAttribute("xml:id");
        linkingNodeElement.value = true;
      });
      // この新しいエレメント（span）を返す
      return span;
      },
      "date": function(element) {
      // placeNameの内容をラップするspan要素を作成
      let span = document.createElement("span");
      span.className = "time-highlight";
      span.style.backgroundColor = "orange"; // 背景色を緑に設定
      span.style.color = "white"; // テキストの色を白に設定
      // 元のエレメントの子ノードを新しいspanに移動
      while (element.firstChild) {
        span.appendChild(element.firstChild);
      }
      // クリックイベントを追加
      span.addEventListener("click", function() {
        console.log("[time] " + element.textContent);
        elementText.value = "<date>" + element.textContent + "</date>";
        elementId.value = inputXMLUrl.value + "#" + element.textContent;
        //elementId.value = element.getAttribute("xml:id");
        linkingNodeElement.value = true;
      });
      
      // この新しいエレメント（span）を返す
      return span;
      },
    }
  };
CETEIcean.addBehaviors(behaviors);

/*
const createCElementXml = async () => {
  const response = await fetch(inputXMLUrl.value);
  const xmlString = await response.text();

  // addCElementToXml関数を呼び出し、変換後のXMLを取得
  const modifiedXmlString = addCElementToXml(xmlString);
  console.log(modifiedXmlString)

  const xmlData = modifiedXmlString;
  return xmlData;
  // ファイルパスを指定します。
  //const filePath = path.join(__dirname, 'public', 'xml', 'CElementXml.xml');

  // ファイルを上書きします。
  //fs.writeFileSync('xml/CElementXml.xml', xmlData, 'utf8');
}
*/

const loadXML = async () => {
  /*
  const xmlData = await createCElementXml();
  // Blobオブジェクトを作成し、URLを生成
  const blob = new Blob([xmlData], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  // 生成したURLをCETEIceanに渡す
  CETEIcean.getHTML5(url, (data: HTMLElement) => {
    teiHTML.value = data.outerHTML;
    // 使用が終わったらURLを解放
    URL.revokeObjectURL(url);
  });
  */
  
  CETEIcean.getHTML5(inputXMLUrl.value, (data: HTMLElement) => {
    teiHTML.value = data.outerHTML;
  });

};

onMounted(() => {
  const teiContainer = document.querySelector('.tei-container');
  if (teiContainer) {
    teiContainer.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  const teiContainer = document.querySelector('.tei-container');
  if (teiContainer) {
    teiContainer.removeEventListener('scroll', handleScroll);
  }
});

function handleScroll() {

    // .page-number-display クラスを持つすべてのエレメントを取得
    const pageNumbers = document.querySelectorAll('.page-number-display');

    for (const pageNumber of pageNumbers) {
        const rect = pageNumber.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight / 60; // 中央よりも少し上の位置を調整するための閾値

        // isVisibleの条件を変更
        // ページの先頭がビューポートの中央よりも上にあり、かつビューポートの高さの1/4以内にある場合にtrue
        const isVisible = rect.top < (viewportHeight / 2 + threshold) && rect.bottom > (viewportHeight / 2 - threshold);
        //const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    };
};

function getSelectionRange() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(document.getElementById('tei'));
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    console.log(preSelectionRange)
    const startPosition = preSelectionRange.toString().length;

    const endPosition = startPosition + range.toString().length;
    console.log(`Start: ${startPosition}, End: ${endPosition}`);
    startToEnd.value = [startPosition, endPosition];
    startToEndList.value = [`${inputXMLUrl.value}#${startPosition}`, `${inputXMLUrl.value}#${endPosition}`];
  }
}
/*
function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return; // 選択範囲がなければ何もしない

  const range = selection.getRangeAt(0);
  console.log(range);
  const span = document.createElement('span');
  span.classList.add('highlight'); // ハイライト用のクラスを追加
  range.surroundContents(span); // 選択範囲をspanで囲む

  selection.removeAllRanges(); // 選択状態をクリア
}
*/
function changeClickedEntityObject() {
  clickedEntityObject.value = [clickedNode.value, elementId.value];
  linkingNodeElement.value = false;

}
</script>
<template>
  <!--{{clickedNode}}-->
    <client-only>
      <!--{{selectedNodeStartToEndList}}-->
      <v-text-field
        class="mt-4"
        label="TEI/XML URL"
        v-model="inputXMLUrl"
        @keyup.enter="loadXML"
        variant="outlined"
        density="compact"
        single-line
        hide-details
      ></v-text-field>
  
      <v-btn class="my-4 mr-4" @click="loadXML">表示</v-btn>
      <!--<v-btn class="my-4 mr-4" color="primary" @click="openDialog">フォームを表示</v-btn>-->
  
      <!--
      <div
        id="osd"
        style="width: 100%; height: 650px; background-color: black"
      ></div>
      -->
      <div class="tei-container">
        <div id="tei" v-html="teiHTML" style="width: 100%; height: 400px;" @mouseup="getSelectionRange"/>
        <!--<div id="tei" v-html="teiHTML" style="width: 100%; height: 650px;" @mouseup="highlightSelection"/>-->
      </div>
    </client-only>
    <!--ノードとエレメントの接続ダイアログ-->
  <v-dialog
  v-model="linkingNodeElement"
  persistent
  max-width="500px"
  max-height="600px"
>
  <v-card>
    <v-card-title>以下のノードとTEIエレメントを接続します</v-card-title>
    <v-card-text>
      ノード：{{clickedNode.label}} ←→ {{ elementText }}
    </v-card-text>
    <v-card-actions>
      <v-btn @click="linkingNodeElement = false">閉じる</v-btn>
      <v-btn @click="changeClickedEntityObject()">接続</v-btn> <!-- ここを変更 -->
    </v-card-actions>
  </v-card>
</v-dialog>
  </template>
  <style>
  .title {
    color: red;
  }

  .tei-container {
  width: 100%; /* 幅は100%に設定 */
  height: 650px; /* 高さを650pxに設定 */
  overflow: auto; /* 収まりきらない場合はスクロールで表示 */
  border: 1px solid #ccc; /* コンテナの境界を示すために境界線を追加（オプション） */
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
}

.highlight {
  background-color: yellow; /* ハイライト色 */
}
</style>