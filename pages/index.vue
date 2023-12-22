
<template>
  <v-app>
    <v-content>
    <v-container fluid class="mainSearch">
    <h1 class="searchTitle">Knowledge Graph Visual Editor</h1>
    </v-container>
    </v-content>
  </v-app>
</template>
<script>
</script>
<style>
.mainSearch{
    /*background: url("../assets/img/colosseo.jpeg");*/
    background-size: cover;
    background-position: center;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.searchTitle{
    color:grey;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
}
.selectTheme{
    color:grey;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
}
.searchField{
    width: 700px;
    padding-top: 3px;       /* 上のパディングを減らす */
    padding-bottom: 3px;    /* 下のパディングを減らす */
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
    width: calc(33.333% - 10px); /* 3列なので33.333%、間のマージンを考慮して引く */
    margin-bottom: 20px; /* 下マージン */
    box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 影を追加 */
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
.swipeCardTitle{
  text-align: center;
}

</style>