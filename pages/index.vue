<template>
  <v-app>
    <v-content>
    <v-container fluid class="mainSearch">
    <h1 class="searchTitle">Discovery Roman memories</h1>
    <v-text-field
        class="searchField"
        v-model="keyword"
        variant="solo"
        label="Search keywords"
        append-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-container>
    <v-container fluid>
    <div v-for="n in 10" :key="n" class="article">
      <h3>タイトル {{ n }}</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
        perspiciatis repudiandae eveniet at totam? Animi sapiente, ipsam sed
        laudantium hic saepe modi adipisci odio commodi deserunt nihil expedita
        amet aperiam.
      </p>
    </div>
    </v-container>
    </v-content>
  </v-app>
</template>
<script>
</script>
<style>
.mainSearch{
    background: url("../assets/img/colosseo.jpeg");
    background-size: cover;
    background-position: center center;
    height: 300px;
}
.searchTitle{
    color:aliceblue;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
}
.searchField{
    width: 700px;
}
.searchBtn {
  position: relative;
}
</style>