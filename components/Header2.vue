<template>
  <v-app-bar app flat border class="px-md-6">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="mr-md-4" />
    <v-app-bar-title class="font-weight-bold">
      Digital Archive of Roman Memories
    </v-app-bar-title>
    <v-spacer />
    <Navbar />
    <v-icon icon="mdi-account" class="mr-1" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app floating class="px-6 py-4">
    <v-list>
      <v-list-item
        v-for="item in items"
        active-color="primary"
        :to="item.path"
        class="py-3"
      >
        <!--<v-icon :icon="item.icon" class="mr-6" />-->
        <v-list-item-title class="font-weight-bold" v-text="item.title" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const items = [
  {
    title: "index",
    path: "/",
    //icon: 'mdi-numeric-2'
  },
  {
    title: "link1",
    path: "/link01",
    //icon: 'mdi-numeric-1'
  },
  {
    title: "Map Search",
    path: "/link02",
    //icon: 'mdi-numeric-2'
  },
];
// ナビゲーションの表示・非表示を制御
const drawer = useState("drawer", () => false);
</script>
