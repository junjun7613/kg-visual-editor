import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // .envファイルから設定を取得
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || '',
    authDomain: config.public.firebaseAuthDomain || '',
    projectId: config.public.firebaseProjectId || '',
    storageBucket: config.public.firebaseStorageBucket || '',
    messagingSenderId: config.public.firebaseMessagingSenderId || '',
    appId: config.public.firebaseAppId || '',
  };

  // Firebaseアプリの初期化
  const app = initializeApp(firebaseConfig);

  // Firebase Authのインスタンスを取得
  const auth = getAuth(app);

  return {
    provide: {
      firebase: app,
      auth,
    },
  };
});
