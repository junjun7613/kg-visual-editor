<template>
  <!--
    <v-app>
      <v-content>
      <v-container fluid class="help-main">
        <h3 class="help-content">エディタの利用方法を解説する動画を公開予定。<br/>開発者：小川潤（国立情報学研究所）・中村覚（東京大学史料編纂所）</h3>
      </v-container>
      </v-content>
    </v-app>
    -->
  <div id="app">
    <div class="main-container">
      <p>HIMIKO Editor for Imageは、小川潤（国立情報学研究所）・中村覚（東京大学史料編纂所）<br/>によって開発されたRDFデータ編集エディタです。<br/><br/>このページでは、エディタの使い方に関する各種資料(ブログ記事・解説動画等)を順次公開していきます。</p>
      <ul class="blog-list">
        <li class="blog-list-item">
          <a href="https://junjun7613.hatenablog.com/entry/2024/04/07/154436" target="_blank" class="blog-link">「HIMIKO Editor for Imageの使い方（基礎編）」</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
/*
.help-main {
  text-align: center;
}
.help-content {
  text-align: left;
}
*/
.main-container {
  max-width: 1200px;
  color: #666;
  margin: 20px auto;
  padding: 20px;
  font-weight: bold;
}
.blog-list {
  margin-top: 50px;
  list-style-type: none; /* リストマーカーを削除 */
  padding: 0; /* デフォルトのパディングを削除 */
}

.blog-list-item {
  margin-bottom: 10px; /* リストアイテム間の余白 */
  font-size: 18px;
}

.blog-link {
  display: block;
  color: black
}
</style>