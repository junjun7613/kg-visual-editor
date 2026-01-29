import { ref } from 'vue';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

// グローバルな初期化フラグ
let authListenerInitialized = false;

// グローバルな状態（refを直接使用）
const globalUser = ref<User | null>(null);
const globalLoading = ref(true);
const globalIsAuthenticated = computed(() => !!globalUser.value);

export const useAuth = () => {
  const { $auth } = useNuxtApp();

  // クライアントサイドで、かつ初回のみ認証状態を監視
  if (process.client && !authListenerInitialized) {
    authListenerInitialized = true;
    onAuthStateChanged($auth, (firebaseUser) => {
      globalUser.value = firebaseUser;
      globalLoading.value = false;
    });
  }

  // Googleログイン
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup($auth, provider);

      // 即座に状態を更新
      globalUser.value = result.user;
      globalLoading.value = false;

      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // ログアウト
  const signOut = async () => {
    try {
      await firebaseSignOut($auth);
      globalUser.value = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user: globalUser,
    isAuthenticated: globalIsAuthenticated,
    loading: globalLoading,
    signInWithGoogle,
    signOut,
  };
};
