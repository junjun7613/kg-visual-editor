<template>
  <v-app-bar app flat border class="px-md-6">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="mr-md-4" />
    <v-app-bar-title class="font-weight-bold">
      HIMIKO Editor
    </v-app-bar-title>
    <v-spacer />
    <Navbar />
    <template v-if="user">
      <div class="d-flex align-center" :key="'auth-' + user.uid">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar size="32">
                <v-img v-if="user.photoURL" :src="user.photoURL" />
                <v-icon v-else icon="mdi-account" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ user.displayName || user.email }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleSignOut">
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
    <template v-else>
      <v-btn @click="handleSignIn" color="primary" class="mr-1" key="login-btn">
        <v-icon icon="mdi-google" class="mr-2" />
        Googleでログイン
      </v-btn>
    </template>
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
import { ref } from 'vue';

const items = [
  {
    title: "Editor",
    path: "/",
    //icon: 'mdi-numeric-2'
  },
  /*
  {
    title: "Editor",
    path: "/link03cyto",
    //icon: 'mdi-numeric-2'
  },
  */
  {
    title: "Help",
    path: "/help",
    //icon: 'mdi-numeric-2'
  },
  {
    title: "Setting",
    path: "/setting",
    //icon: 'mdi-numeric-2'
  },
];

// ナビゲーションの表示・非表示を制御（デフォルトは閉じた状態）
const drawer = ref(false);

// 認証機能
const { user, signInWithGoogle, signOut } = useAuth();

// Googleログイン
const handleSignIn = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    console.error('Login failed:', error);
    alert('ログインに失敗しました');
  }
};

// ログアウト
const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error('Logout failed:', error);
    alert('ログアウトに失敗しました');
  }
};
</script>
