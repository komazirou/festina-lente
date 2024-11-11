import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentIndexedDbCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF7n2EB4w_SnOGWUb6puRcHIL8yxcvvkU",
  authDomain: "festina-lente-55274.firebaseapp.com",
  projectId: "festina-lente-55274",
  storageBucket: "festina-lente-55274.firebasestorage.app",
  messagingSenderId: "85274766934",
  appId: "1:85274766934:web:0806ba6c1493b4599ed5f7",
  measurementId: "G-QL7QWLY3N6",
};

// Firebase アプリの初期化
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore のインスタンスの取得または初期化、キャッシュ設定を使用
const db = getApps().length
  ? getFirestore(app)
  : initializeFirestore(app, {
      localCache: persistentLocalCache({
        synchronizeTabs: true, // タブ間のキャッシュ同期
        tabManager: persistentIndexedDbCache(), // IndexedDBキャッシュ
      }),
      experimentalAutoDetectLongPolling: true, // 自動でポーリング設定
      useFetchStreams: true,
    });

export { db };
